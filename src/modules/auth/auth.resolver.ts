import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { LoginInput } from './dto/login.input';
import { RegisterInput } from './dto/register.input';
import { AuthResponse } from './type/auth.response';
import { GraphQLString } from 'graphql';

@Resolver()
export class AuthResolver {
  constructor(
    private readonly authService: AuthService,
  ) {}

  @Mutation(() => AuthResponse)
  login(@Args('loginInput') loginInput: LoginInput): Promise<AuthResponse> {
    return this.authService.login(loginInput);
  }

  @Mutation(() => GraphQLString)
  register(@Args('registerInput') registerInput: RegisterInput): Promise<string> {
    return this.authService.register(registerInput);
  }

  @Mutation(() => AuthResponse)
  refreshToken(@Args('refreshToken') refreshToken: string) {
    return this.authService.refreshToken(refreshToken);
  }
}

/**
 * {
    "query": "mutation login($id: LoginInput!) { login(loginInput: $id) { accessToken, refreshToken } }",
    "variables": {
      "id": {
        "email": "test1@gmail.com",
        "password": "123456"
      }
    }
  }

  
 */