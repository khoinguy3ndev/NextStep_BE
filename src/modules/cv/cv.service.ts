import { EntityManager } from "@mikro-orm/postgresql";
import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from "@nestjs/common";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { basename } from "path";
import { randomUUID } from "crypto";
import { AnalysisResult } from "src/entities/analysis-result.entity";
import { Cv } from "src/entities/cv.entity";
import { SkillCourse } from "src/entities/skill-course.entity";
import { SkillGap } from "src/entities/skill-gap.entity";
import { User } from "src/entities/user.entity";
import { AnalysisDetailResponse } from "./type/analysis-detail.response";
import { AnalysisHistoryItemResponse } from "./type/analysis-history-item.response";
import { AnalysisHistoryResponse } from "./type/analysis-history.response";
import { PresignedUploadResponse } from "./type/presigned-upload.response";
import { RoadmapResourceGroupResponse } from "./type/roadmap-resource-group.response";

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
    } as any);

    await this.em.persistAndFlush(cv);

    return this.em.findOneOrFail(Cv, { cvId: cv.cvId }, { populate: ["user"] });
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

  async getAnalysisHistory(limit = 20): Promise<AnalysisHistoryResponse> {
    const normalizedLimit = Math.max(1, Math.min(limit, 100));
    const rows = await this.em.find(
      AnalysisResult,
      {},
      {
        populate: ["job"],
        orderBy: { createdAt: "DESC", analysisId: "DESC" },
        limit: normalizedLimit,
      },
    );

    const items: AnalysisHistoryItemResponse[] = rows.map((row) => {
      const jobMatch = this.asObject(row.jobMatchJson);
      const roadmap = this.asObject(row.roadmapJson);

      return {
        analysisId: row.analysisId,
        jobId: row.job.jobId,
        jobTitle: row.job.title,
        cvFilename: row.cvFilename,
        createdAt: row.createdAt,
        jobMatchScore: this.toOptionalInt(jobMatch.score),
        roadmapTotalWeeks: this.toOptionalInt(roadmap.total_weeks),
      };
    });

    return {
      totalCount: items.length,
      items,
    };
  }

  async getAnalysisDetail(
    analysisId: number,
  ): Promise<AnalysisDetailResponse | null> {
    const row = await this.em.findOne(
      AnalysisResult,
      { analysisId },
      {
        populate: ["job", "skillGaps", "skillGaps.skill"],
      },
    );

    if (!row) {
      return null;
    }

    return {
      analysisId: row.analysisId,
      jobId: row.job.jobId,
      jobTitle: row.job.title,
      cvFilename: row.cvFilename,
      cvTextExcerpt: row.cvTextExcerpt,
      createdAt: row.createdAt,
      extractedProfileJson: this.stringifyJson(row.extractedProfileJson),
      jobContextJson: this.stringifyJson(row.jobContextJson),
      jobMatchJson: this.stringifyJson(row.jobMatchJson),
      gapAnalysisJson: this.stringifyJson(row.gapAnalysisJson),
      roadmapJson: this.stringifyJson(row.roadmapJson),
      skillGaps: row.skillGaps.getItems(),
    };
  }

  async getAnalysisSkillGaps(analysisId: number): Promise<SkillGap[]> {
    return this.em.find(
      SkillGap,
      { analysis: { analysisId } },
      {
        populate: ["skill"],
        orderBy: { priorityScore: "DESC", id: "ASC" },
      },
    );
  }

  async getRoadmapResourcesByAnalysis(
    analysisId: number,
  ): Promise<RoadmapResourceGroupResponse[]> {
    const skillGaps = await this.em.find(
      SkillGap,
      { analysis: { analysisId } },
      {
        populate: ["skill"],
        orderBy: { priorityScore: "DESC", id: "ASC" },
      },
    );

    if (skillGaps.length === 0) {
      return [];
    }

    const skillIds = [...new Set(skillGaps.map((item) => item.skill.skillId))];
    const courses = await this.em.find(
      SkillCourse,
      { skill: { skillId: { $in: skillIds } } },
      {
        populate: ["skill"],
        orderBy: { durationHours: "DESC", id: "ASC" },
      },
    );

    const courseMap = new Map<number, SkillCourse[]>();
    for (const course of courses) {
      const skillId = course.skill.skillId;
      const bucket = courseMap.get(skillId) ?? [];
      if (bucket.length < 3) {
        bucket.push(course);
      }
      courseMap.set(skillId, bucket);
    }

    return skillGaps.map((gap) => ({
      skillId: gap.skill.skillId,
      skillName: gap.skill.name,
      priorityScore: gap.priorityScore,
      gapReason: gap.gapReason,
      resources: (courseMap.get(gap.skill.skillId) ?? []).map((course) => ({
        id: course.id,
        title: course.title,
        platform: course.platform,
        url: course.url,
        duration: course.duration,
        durationHours: course.durationHours,
        level: course.level,
      })),
    }));
  }

  private stringifyJson(value: unknown): string {
    return JSON.stringify(value ?? {});
  }

  private asObject(value: unknown): Record<string, unknown> {
    if (value && typeof value === "object" && !Array.isArray(value)) {
      return value as Record<string, unknown>;
    }
    return {};
  }

  private toOptionalInt(value: unknown): number | undefined {
    if (typeof value === "number" && Number.isFinite(value)) {
      return Math.round(value);
    }
    return undefined;
  }
}
