import { UseGuards } from "@nestjs/common";
import { UserService } from "./user.service";
import { Args, Int, Mutation, Query, Resolver } from "@nestjs/graphql";
import { User } from "src/entities/user.entity";
import { CurrentUser } from "src/common/decorators/current-user.decorator";
import { GqlAuthGuard } from "src/modules/auth/guards/auth.guard";
import { UpdateUserProfileInput } from "./dto/profile.input";

@Resolver()
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => User, { nullable: true })
  @UseGuards(GqlAuthGuard)
  async me(@CurrentUser() user: User): Promise<User | null> {
    return this.userService.findById(user.userId);
  }

  @Query(() => User, { nullable: true })
  async getUserById(@Args("userId") userId: number): Promise<User | null> {
    return this.userService.findById(userId);
  }

  @Mutation(() => User)
  @UseGuards(GqlAuthGuard)
  async updateUserProfile(
    @CurrentUser() user: User,
    @Args("input") input: UpdateUserProfileInput,
  ): Promise<User> {
    console.log("updateUserProfile input", {
      userId: user.userId,
      fields: Object.keys(input),
    });
    return this.userService.updateUserProfile(user.userId, input);
  }

  @Mutation(() => User)
  @UseGuards(GqlAuthGuard)
  async setBaseCv(
    @CurrentUser() user: User,
    @Args("cvId", { type: () => Int, nullable: true }) cvId: number | null,
  ): Promise<User> {
    return this.userService.setBaseCv(user.userId, cvId);
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard)
  async deleteUserAccount(@CurrentUser() user: User): Promise<boolean> {
    return this.userService.deleteUserAccount(user.userId);
  }
}
