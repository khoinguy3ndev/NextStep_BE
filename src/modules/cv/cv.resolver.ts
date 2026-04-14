import { UseGuards } from "@nestjs/common";
import { Args, Mutation, Query, Resolver, Int } from "@nestjs/graphql";
import { CurrentUser } from "src/common/decorators/current-user.decorator";
import { Cv } from "src/entities/cv.entity";
import { User } from "src/entities/user.entity";
import { GqlAuthGuard } from "src/modules/auth/guards/auth.guard";
import { CvService } from "./cv.service";
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

  @Mutation(() => PresignedUploadResponse)
  @UseGuards(GqlAuthGuard)
  async getPresignedUrl(
    @Args("fileName") fileName: string,
    @CurrentUser() user: User,
  ): Promise<PresignedUploadResponse> {
    return this.cvService.getUploadUrl(user.userId, fileName);
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

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard)
  async deleteCv(
    @Args("cvId", { type: () => Int }) cvId: number,
    @CurrentUser() user: User,
  ): Promise<boolean> {
    return this.cvService.deleteCv(cvId, user.userId);
  }
}
