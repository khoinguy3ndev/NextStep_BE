import { EntityManager } from "@mikro-orm/postgresql";
import { Injectable, NotFoundException } from "@nestjs/common";
import { User } from "src/entities/user.entity";

@Injectable()
export class UserService {
  constructor(private readonly em: EntityManager) {}

  async findById(userId: number): Promise<User | null> {
    return this.em.findOne(User, { userId: userId });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.em.findOne(User, { email });
  }

  async createUser(
    email: string,
    password: string | null,
    name: string,
  ): Promise<User> {
    const user = new User();
    user.email = email;
    if (password) {
      user.password = password;
    }
    user.name = name;
    await this.em.persistAndFlush(user);
    return user;
  }

  async findOrCreateGoogleUser(params: {
    email: string;
    name: string;
    avatar?: string;
    googleId: string;
  }): Promise<User> {
    const { email, name, avatar, googleId } = params;
    const existing = await this.findByEmail(email);

    if (existing) {
      existing.name = name;
      existing.avatar = avatar;
      existing.googleId = googleId;
      await this.em.persistAndFlush(existing);
      return existing;
    }

    const user = new User();
    user.email = email;
    user.name = name;
    user.avatar = avatar;
    user.googleId = googleId;
    await this.em.persistAndFlush(user);
    return user;
  }
}
