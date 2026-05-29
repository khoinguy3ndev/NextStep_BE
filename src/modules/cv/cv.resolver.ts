import { UseGuards } from "@nestjs/common";
import { Args, Mutation, Query, Resolver, Int } from "@nestjs/graphql";
import { CurrentUser } from "src/common/decorators/current-user.decorator";
import { Cv } from "src/entities/cv.entity";
import { User } from "src/entities/user.entity";
import { GqlAuthGuard } from "src/modules/auth/guards/auth.guard";
import { CvService } from "./cv.service";
import {
  CvAnalysisHistoryType,
  CvAnalysisResponseType,
} from "./type/cv-analysis.type";
import { AvatarFileType } from "./type/avatar-file.type";
import { CvFileType } from "./type/cv-file.type";
import { PresignedUploadResponse } from "./type/presigned-upload.response";

@Resolver(() => Cv)
export class CvResolver {
  constructor(private readonly cvService: CvService) {}

  @Query(() => [Cv])
  @UseGuards(GqlAuthGuard)
  async userCvs(@CurrentUser() user: User): Promise<Cv[]> {
    return this.cvService.getUserCvs(user.userId);
  }

  @Query(() => Cv, { nullable: true })
  @UseGuards(GqlAuthGuard)
  async getCv(
    @Args("cvId", { type: () => Int }) cvId: number,
    @CurrentUser() user: User,
  ): Promise<Cv | null> {
    return this.cvService.getCvById(cvId, user.userId);
  }

  @Query(() => CvFileType)
  @UseGuards(GqlAuthGuard)
  async getCvFile(
    @Args("cvId", { type: () => Int }) cvId: number,
    @CurrentUser() user: User,
  ): Promise<CvFileType> {
    return this.cvService.getFile(cvId, user.userId);
  }

  @Query(() => AvatarFileType)
  @UseGuards(GqlAuthGuard)
  async getAvatarFile(@CurrentUser() user: User): Promise<AvatarFileType> {
    return this.cvService.getAvatarFile(user.userId);
  }

  @Query(() => CvAnalysisHistoryType)
  @UseGuards(GqlAuthGuard)
  async getCvAnalysisHistory(
    @Args("limit", { type: () => Int, nullable: true, defaultValue: 20 })
    limit: number,
    @CurrentUser() user: User,
  ): Promise<CvAnalysisHistoryType> {
    return this.cvService.getAnalysisHistory(user.userId, limit);
  }

  @Query(() => CvAnalysisResponseType)
  @UseGuards(GqlAuthGuard)
  async getCvAnalysisResult(
    @Args("analysisId", { type: () => Int }) analysisId: number,
    @CurrentUser() user: User,
  ): Promise<CvAnalysisResponseType> {
    return this.cvService.getAnalysisResult(user.userId, analysisId);
  }

  @Mutation(() => PresignedUploadResponse)
  @UseGuards(GqlAuthGuard)
  async getPresignedUrl(
    @Args("fileName") fileName: string,
    @CurrentUser() user: User,
  ): Promise<PresignedUploadResponse> {
    return this.cvService.getUploadUrl(user.userId, fileName);
  }

  @Mutation(() => PresignedUploadResponse)
  @UseGuards(GqlAuthGuard)
  async getAvatarUploadUrl(
    @Args("fileName") fileName: string,
    @CurrentUser() user: User,
  ): Promise<PresignedUploadResponse> {
    return this.cvService.getAvatarUploadUrl(user.userId, fileName);
  }

  @Mutation(() => User)
  @UseGuards(GqlAuthGuard)
  async confirmAvatarUpload(
    @Args("fileKey") fileKey: string,
    @CurrentUser() user: User,
  ): Promise<User> {
    return this.cvService.confirmAvatarUpload(user.userId, fileKey);
  }

  @Mutation(() => Cv)
  @UseGuards(GqlAuthGuard)
  async confirmCvUpload(
    @Args("fileName") fileName: string,
    @Args("fileKey") fileKey: string,
    @CurrentUser() user: User,
  ): Promise<Cv> {
    return this.cvService.createCvRecord(user.userId, {
      fileName,
      fileKey,
    });
  }

  @Mutation(() => CvAnalysisResponseType)
  @UseGuards(GqlAuthGuard)
  async analyzeCv(
    @Args("cvId", { type: () => Int }) cvId: number,
    @Args("jobId", { type: () => Int }) jobId: number,
    @CurrentUser() user: User,
  ): Promise<CvAnalysisResponseType> {
    return this.cvService.analyzeCv(user.userId, cvId, jobId);
  }

  @Mutation(() => CvAnalysisResponseType)
  @UseGuards(GqlAuthGuard)
  async analyzeCvWithJd(
    @Args("cvId", { type: () => Int }) cvId: number,
    @Args("jdText", { type: () => String, nullable: true })
    jdText: string | null,
    @Args("jdFileBase64", { type: () => String, nullable: true })
    jdFileBase64: string | null,
    @Args("jdFileName", { type: () => String, nullable: true })
    jdFileName: string | null,
    @Args("jdContentType", { type: () => String, nullable: true })
    jdContentType: string | null,
    @CurrentUser() user: User,
  ): Promise<CvAnalysisResponseType> {
    return this.cvService.analyzeCvWithJd(user.userId, cvId, {
      jdText,
      jdFileBase64,
      jdFileName,
      jdContentType,
    });
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard)
  async deleteCv(
    @Args("cvId", { type: () => Int }) cvId: number,
    @CurrentUser() user: User,
  ): Promise<boolean> {
    return this.cvService.deleteCv(cvId, user.userId);
  }

  @Mutation(() => Cv)
  @UseGuards(GqlAuthGuard)
  async renameCv(
    @Args("cvId", { type: () => Int }) cvId: number,
    @Args("fileName") fileName: string,
    @CurrentUser() user: User,
  ): Promise<Cv> {
    return this.cvService.renameCv(cvId, user.userId, fileName);
  }
}
