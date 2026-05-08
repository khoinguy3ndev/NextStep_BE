import { EntityManager } from "@mikro-orm/postgresql";
import { Injectable, NotFoundException } from "@nestjs/common";
import { Cv } from "src/entities/cv.entity";
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

  async updateUserProfile(
    userId: number,
    data: { name?: string; avatar?: string },
  ): Promise<User> {
    const user = await this.findById(userId);
    if (!user) {
      throw new NotFoundException("User not found");
    }

    if (data.name) {
      user.name = data.name;
    }
    if (data.avatar !== undefined) {
      user.avatar = data.avatar;
    }

    await this.em.persistAndFlush(user);
    return user;
  }

  async setBaseCv(userId: number, cvId: number): Promise<User> {
    const user = await this.findById(userId);
    if (!user) {
      throw new NotFoundException("User not found");
    }

    const cv = await this.em.findOne(Cv, { cvId, user: { userId } });
    if (!cv) {
      throw new NotFoundException("CV not found");
    }

    user.baseCvId = cv.cvId;
    await this.em.persistAndFlush(user);
    return user;
  }

  async deleteUserAccount(userId: number): Promise<boolean> {
    const user = await this.findById(userId);
    if (!user) return false;

    await this.em.removeAndFlush(user);
    return true;
  }
}
