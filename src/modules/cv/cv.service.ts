import { EntityManager } from "@mikro-orm/postgresql";
import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";
import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { basename } from "path";
import { randomUUID } from "crypto";
import { CvAnalysisResult } from "src/entities/cv-analysis-result.entity";
import { Cv } from "src/entities/cv.entity";
import { User } from "src/entities/user.entity";
import {
  CvAnalysisHistoryType,
  CvAnalysisResponseType,
} from "./type/cv-analysis.type";
import { PresignedUploadResponse } from "./type/presigned-upload.response";

@Injectable()
export class CvService {
  constructor(
    private readonly em: EntityManager,
    private readonly s3Client: S3Client,
  ) {}

  async getUploadUrl(
    userId: number,
    fileName: string,
  ): Promise<PresignedUploadResponse> {
    const normalizedFileName = this.normalizeFileName(fileName);
    const fileKey = `cvs/${userId}/${Date.now()}-${randomUUID()}-${normalizedFileName}`;

    const command = new PutObjectCommand({
      Bucket: this.getBucketName(),
      Key: fileKey,
    });

    const uploadUrl = await getSignedUrl(this.s3Client, command, {
      expiresIn: 300,
    });

    return {
      uploadUrl,
      fileKey,
    };
  }

  async createCvRecord(
    userId: number,
    data: { fileName: string; fileKey: string },
  ): Promise<Cv> {
    const fileName = this.normalizeFileName(data.fileName);
    const fileKey = data.fileKey?.trim();

    if (!fileKey) {
      throw new BadRequestException("fileKey is required");
    }

    if (!fileKey.startsWith(`cvs/${userId}/`)) {
      throw new BadRequestException(
        "fileKey does not belong to the current user",
      );
    }

    const existingCv = await this.em.findOne(Cv, { fileKey });
    if (existingCv) {
      throw new ConflictException("CV record already exists for this fileKey");
    }

    const cv = this.em.create(Cv, {
      user: this.em.getReference(User, userId as any),
      fileName,
      fileKey,
      fileUrl: this.buildFileUrl(fileKey),
      uploadedAt: new Date(),
    } as any);

    await this.em.persistAndFlush(cv);

    return this.em.findOneOrFail(Cv, { cvId: cv.cvId }, { populate: ["user"] });
  }

  async getUserCvs(userId: number): Promise<Cv[]> {
    return this.em.find(
      Cv,
      { user: { userId } },
      { orderBy: { uploadedAt: "DESC" } },
    );
  }

  async getCvById(cvId: number, userId: number): Promise<Cv | null> {
    return this.em.findOne(
      Cv,
      { cvId, user: { userId } },
      { populate: ["user"] },
    );
  }

  async deleteCv(cvId: number, userId: number): Promise<boolean> {
    const cv = await this.getCvById(cvId, userId);
    if (!cv) return false;

    await this.em.removeAndFlush(cv);
    return true;
  }

  async renameCv(cvId: number, userId: number, fileName: string): Promise<Cv> {
    const cv = await this.getCvById(cvId, userId);
    if (!cv) {
      throw new NotFoundException("CV not found");
    }

    const previousFileName = cv.fileName;
    const nextFileName = this.normalizeFileName(fileName);

    cv.fileName = nextFileName;
    await this.em.nativeUpdate(
      CvAnalysisResult,
      { cvFilename: previousFileName },
      { cvFilename: nextFileName },
    );
    await this.em.persistAndFlush(cv);

    return this.em.findOneOrFail(Cv, { cvId }, { populate: ["user"] });
  }

  async analyzeCv(
    userId: number,
    cvId: number,
    jobId: number,
  ): Promise<CvAnalysisResponseType> {
    const cv = await this.getCvById(cvId, userId);
    if (!cv) {
      throw new NotFoundException("CV not found");
    }

    const file = await this.downloadCvFile(cv.fileKey);
    const formData = new FormData();
    formData.append(
      "cv_file",
      new Blob([Buffer.from(file.bytes)], { type: file.contentType }),
      cv.fileName,
    );
    formData.append("job_id", String(jobId));

    const payload = await this.callAi("/api/v1/cv/ingest-file", {
      method: "POST",
      body: formData,
    });

    return this.mapAnalysisResponse(payload);
  }

  async getAnalysisResult(analysisId: number): Promise<CvAnalysisResponseType> {
    const payload = await this.callAi(`/api/v1/cv/analysis-results/${analysisId}`, {
      method: "GET",
    });

    return this.mapAnalysisResponse(payload);
  }

  async getAnalysisHistory(limit: number): Promise<CvAnalysisHistoryType> {
    const params = new URLSearchParams({
      limit: String(Math.max(1, Math.min(limit, 100))),
    });
    const payload = await this.callAi(
      `/api/v1/cv/analysis-results?${params.toString()}`,
      { method: "GET" },
    );

    const rawItems = Array.isArray(payload.items) ? payload.items : [];

    return {
      total: this.asNumber(payload.total),
      items: rawItems.map((item) => {
        const row = this.asObject(item);
        return {
          analysisId: this.asNumber(row.analysis_id),
          jobId: this.asNumber(row.job_id),
          jobTitle: this.asString(row.job_title),
          cvFilename: this.asOptionalString(row.cv_filename),
          createdAt: new Date(this.asString(row.created_at)),
          jobMatchScore: this.asOptionalNumber(row.job_match_score),
          roadmapTotalWeeks: this.asOptionalNumber(row.roadmap_total_weeks),
        };
      }),
    };
  }

  private normalizeFileName(fileName: string): string {
    const rawFileName = basename(fileName || "").trim();
    if (!rawFileName) {
      throw new BadRequestException("fileName is required");
    }

    const normalizedFileName = rawFileName
      .replace(/\s+/g, "-")
      .replace(/[^a-zA-Z0-9._-]/g, "_");

    return normalizedFileName || "upload.bin";
  }

  private buildFileUrl(fileKey: string): string {
    const endpoint = this.getEndpoint();
    return `${endpoint}/${this.getBucketName()}/${fileKey}`;
  }

  private getBucketName(): string {
    const bucketName = process.env.R2_BUCKET_NAME;
    if (!bucketName) {
      throw new InternalServerErrorException(
        "R2_BUCKET_NAME is not configured",
      );
    }
    return bucketName;
  }

  private getEndpoint(): string {
    const endpoint = process.env.R2_ENDPOINT;
    if (!endpoint) {
      throw new InternalServerErrorException("R2_ENDPOINT is not configured");
    }
    return endpoint.replace(/\/$/, "");
  }

  private getAiBaseUrl(): string {
    return (process.env.AI_SERVICE_URL || "http://localhost:9000").replace(
      /\/$/,
      "",
    );
  }

  private async downloadCvFile(
    fileKey: string,
  ): Promise<{ bytes: Uint8Array; contentType: string }> {
    const response = await this.s3Client.send(
      new GetObjectCommand({
        Bucket: this.getBucketName(),
        Key: fileKey,
      }),
    );

    if (!response.Body) {
      throw new InternalServerErrorException("Uploaded CV file could not be read");
    }

    return {
      bytes: await response.Body.transformToByteArray(),
      contentType:
        response.ContentType || this.inferContentTypeFromFileName(fileKey),
    };
  }

  private inferContentTypeFromFileName(fileName: string): string {
    const normalized = fileName.toLowerCase();

    if (normalized.endsWith(".pdf")) return "application/pdf";
    if (normalized.endsWith(".doc")) return "application/msword";
    if (normalized.endsWith(".docx")) {
      return "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
    }
    if (normalized.endsWith(".txt")) return "text/plain";

    return "application/octet-stream";
  }

  private async callAi(
    path: string,
    init: RequestInit,
  ): Promise<Record<string, unknown>> {
    const response = await fetch(`${this.getAiBaseUrl()}${path}`, init);
    const text = await response.text();
    const payload = text ? this.parseJsonObject(text) : {};

    if (!response.ok) {
      const detail =
        this.asOptionalString(payload.detail) ||
        this.asOptionalString(payload.message) ||
        text ||
        "AI service request failed";
      throw new BadRequestException(detail);
    }

    return payload;
  }

  private parseJsonObject(text: string): Record<string, unknown> {
    try {
      const parsed = JSON.parse(text) as unknown;
      if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
        throw new Error("Response is not a JSON object");
      }
      return parsed as Record<string, unknown>;
    } catch {
      throw new InternalServerErrorException(
        "AI service returned an invalid response",
      );
    }
  }

  private mapAnalysisResponse(payload: Record<string, unknown>): CvAnalysisResponseType {
    const extractedProfile = this.asObject(payload.extracted_profile);
    const jobContext = this.asObject(payload.job_context);
    const jobMatch = this.asObject(payload.job_match);
    const gapAnalysis = this.asObject(payload.gap_analysis);
    const roadmap = this.asObject(payload.roadmap);
    const aiReview = this.asObject(payload.ai_review);

    const scoreBreakdown = this.asObject(jobMatch.scoreBreakdownJson);
    const skillGap = this.asObject(gapAnalysis.skillGap);
    const experienceGap = this.asObject(gapAnalysis.experienceGap);
    const levelGap = this.asObject(gapAnalysis.levelGap);
    const certificationGap = this.asObject(gapAnalysis.certificationGap);

    return {
      analysisResultId: this.asOptionalNumber(payload.analysis_result_id),
      extractedProfile: {
        cvLevel: this.asString(extractedProfile.cv_level),
        cvYearsExperience: this.asNumber(extractedProfile.cv_years_experience),
        preferredLocations: this.asStringArray(extractedProfile.preferred_locations),
        cvCertifications: this.asStringArray(extractedProfile.cv_certifications),
        cvSkills: this.asObjectArray(extractedProfile.cv_skills).map((item) => ({
          name: this.asString(item.name),
          proficiency: this.asNumber(item.proficiency),
          yearsOfExperience: this.asNumber(item.years_of_experience),
        })),
      },
      jobContext: {
        jobId: this.asNumber(jobContext.job_id),
        title: this.asString(jobContext.title),
        sourceUrl: this.asString(jobContext.source_url),
        jobLevel: this.asString(jobContext.job_level),
        jobYearsRequired: this.asNumber(jobContext.job_years_required),
        jobLocation: this.asOptionalString(jobContext.job_location),
        jobIsRemote: Boolean(jobContext.job_is_remote),
        jobSkills: this.asObjectArray(jobContext.job_skills).map((item) => ({
          name: this.asString(item.name),
          importance: this.asNumber(item.importance),
          requiredProficiency: this.asNumber(item.required_proficiency),
        })),
      },
      jobMatch: {
        score: this.asNumber(jobMatch.score),
        scoreBreakdown: {
          skillMatch: this.asNumber(scoreBreakdown.skillMatch),
          experienceMatch: this.asNumber(scoreBreakdown.experienceMatch),
          levelMatch: this.asNumber(scoreBreakdown.levelMatch),
          salaryMatch: this.asNumber(scoreBreakdown.salaryMatch),
          locationMatch: this.asNumber(scoreBreakdown.locationMatch),
          keywordMatch: this.asOptionalNumber(scoreBreakdown.keywordMatch),
          titleMatch: this.asOptionalNumber(scoreBreakdown.titleMatch),
          atsReadability: this.asOptionalNumber(scoreBreakdown.atsReadability),
        },
        missingSkills: this.asStringArray(jobMatch.missingSkills),
        matchedSkills: this.asStringArray(jobMatch.matchedSkills),
      },
      gapAnalysis: {
        skillGap: {
          missing: this.asObjectArray(skillGap.missing).map((item) => ({
            skill: this.asString(item.skill),
            importance: this.asString(item.importance),
            reason: this.asString(item.reason),
          })),
          weak: this.asObjectArray(skillGap.weak).map((item) => ({
            skill: this.asString(item.skill),
            currentProficiency: this.asNumber(item.current_proficiency),
            requiredProficiency: this.asNumber(item.required_proficiency),
            gap: this.asNumber(item.gap),
          })),
        },
        experienceGap: {
          requiredYears: this.asNumber(experienceGap.required_years),
          currentYears: this.asNumber(experienceGap.current_years),
          gapWeeks: this.asNumber(experienceGap.gap_weeks),
        },
        levelGap: {
          cvLevel: this.asString(levelGap.cv_level),
          jobLevel: this.asString(levelGap.job_level),
          gapLevels: this.asNumber(levelGap.gap_levels),
        },
        certificationGap: {
          required: this.asStringArray(certificationGap.required),
          have: this.asStringArray(certificationGap.have),
          missing: this.asStringArray(certificationGap.missing),
        },
        recommendedSkills: this.asStringArray(gapAnalysis.recommendedSkills),
      },
      roadmap: {
        phases: this.asObjectArray(roadmap.phases).map((phase) => ({
          phase: this.asNumber(phase.phase),
          durationWeeks: this.asNumber(phase.duration_weeks),
          title: this.asString(phase.title),
          skills: this.asObjectArray(phase.skills).map((skill) => ({
            skillName: this.asString(skill.skill_name),
            priority: this.asNumber(skill.priority),
            estimatedWeeks: this.asNumber(skill.estimated_weeks),
            baselineHours: this.asOptionalNumber(skill.baseline_hours),
            transferBonus: this.asNumber(skill.transfer_bonus),
            transferDirectionFactor: this.asOptionalNumber(
              skill.transfer_direction_factor,
            ),
            effectiveTransferBonus: this.asOptionalNumber(
              skill.effective_transfer_bonus,
            ),
            adjustedHours: this.asOptionalNumber(skill.adjusted_hours),
            recommendedResources: this.asObjectArray(
              skill.recommended_resources,
            ).map((resource) => ({
              title: this.asString(resource.title),
              provider: this.asOptionalString(resource.provider),
              url: this.asOptionalString(resource.url),
              durationHours: this.asOptionalNumber(resource.duration_hours),
            })),
          })),
        })),
        totalWeeks: this.asNumber(roadmap.total_weeks),
        estimatedCompletion: this.asString(roadmap.estimated_completion),
        difficultyLevel: this.asString(roadmap.difficulty_level),
      },
      aiReview: payload.ai_review
        ? {
            summary: this.asString(aiReview.summary),
            strengths: this.asStringArray(aiReview.strengths),
            concerns: this.asStringArray(aiReview.concerns),
            recommendations: this.asStringArray(aiReview.recommendations),
            verdict: this.asString(aiReview.verdict),
            source: this.asString(aiReview.source),
          }
        : null,
    };
  }

  private asObject(value: unknown): Record<string, unknown> {
    if (!value || typeof value !== "object" || Array.isArray(value)) {
      return {};
    }

    return value as Record<string, unknown>;
  }

  private asObjectArray(value: unknown): Record<string, unknown>[] {
    if (!Array.isArray(value)) return [];

    return value
      .filter((item) => item && typeof item === "object" && !Array.isArray(item))
      .map((item) => item as Record<string, unknown>);
  }

  private asString(value: unknown): string {
    return typeof value === "string" ? value : "";
  }

  private asOptionalString(value: unknown): string | null {
    return typeof value === "string" ? value : null;
  }

  private asNumber(value: unknown): number {
    return typeof value === "number" && Number.isFinite(value) ? value : 0;
  }

  private asOptionalNumber(value: unknown): number | null {
    return typeof value === "number" && Number.isFinite(value) ? value : null;
  }

  private asStringArray(value: unknown): string[] {
    if (!Array.isArray(value)) return [];

    return value.filter((item): item is string => typeof item === "string");
  }
}
