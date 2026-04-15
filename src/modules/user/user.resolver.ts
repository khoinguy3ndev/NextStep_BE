import { UseGuards } from "@nestjs/common";
import { UserService } from "./user.service";
import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { User } from "src/entities/user.entity";
import { CurrentUser } from "src/common/decorators/current-user.decorator";
import { GqlAuthGuard } from "src/modules/auth/guards/auth.guard";

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
    @Args("name", { type: () => String, nullable: true }) name?: string,
    @Args("avatar", { type: () => String, nullable: true }) avatar?: string,
  ): Promise<User> {
    return this.userService.updateUserProfile(user.userId, {
      name,
      avatar,
    });
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard)
  async deleteUserAccount(@CurrentUser() user: User): Promise<boolean> {
    return this.userService.deleteUserAccount(user.userId);
  }
}
