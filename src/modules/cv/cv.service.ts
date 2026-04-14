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
import { Cv } from "src/entities/cv.entity";
import { User } from "src/entities/user.entity";
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
}
