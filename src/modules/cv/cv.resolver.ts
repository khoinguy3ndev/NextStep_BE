import { UseGuards } from "@nestjs/common";
import { Args, Mutation, Resolver } from "@nestjs/graphql";
import { CurrentUser } from "src/common/decorators/current-user.decorator";
import { Cv } from "src/entities/cv.entity";
import { User } from "src/entities/user.entity";
import { GqlAuthGuard } from "src/modules/auth/guards/auth.guard";
import { CvService } from "./cv.service";
import { PresignedUploadResponse } from "./type/presigned-upload.response";

@Resolver(() => Cv)
export class CvResolver {
  constructor(private readonly cvService: CvService) {}

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
}
