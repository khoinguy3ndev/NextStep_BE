import { UserService } from './user.service';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { User } from 'src/entities/user.entity';

@Resolver()
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => User, { nullable: true })
  async getUserById(@Args('userId') userId: number): Promise<User | null> {
    return this.userService.findById(userId);
  }

  @Query(() => User, { nullable: true })
  async user(@Args('userId') userId: number): Promise<User | null> {
    return this.userService.findById(userId);
  }

  @Mutation(() => User)
  async createUser(
    @Args('email') email: string,
    @Args('password') password: string,
    @Args('name') name: string,
  ): Promise<User> {
    return this.userService.createUser(email, password, name);
  }
}
