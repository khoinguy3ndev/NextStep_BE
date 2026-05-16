import { EntityManager } from "@mikro-orm/postgresql";
import { Injectable, NotFoundException } from "@nestjs/common";
import { Cv } from "src/entities/cv.entity";
import { User } from "src/entities/user.entity";
import { UpdateUserProfileInput } from "./dto/profile.input";

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
    data: UpdateUserProfileInput,
  ): Promise<User> {
    const user = await this.findById(userId);
    if (!user) {
      throw new NotFoundException("User not found");
    }

    if (data.name?.trim()) {
      user.name = data.name;
    }
    if (data.avatar !== undefined) {
      user.avatar = data.avatar;
    }
    if (data.currentRole !== undefined) {
      user.currentRole = data.currentRole;
    }
    if (data.location !== undefined) {
      user.location = data.location;
    }
    if (data.experienceYears !== undefined) {
      user.experienceYears = data.experienceYears;
    }
    if (data.targetSalaryMin !== undefined) {
      user.targetSalaryMin = data.targetSalaryMin;
    }
    if (data.targetSalaryMax !== undefined) {
      user.targetSalaryMax = data.targetSalaryMax;
    }
    if (data.phone !== undefined) {
      user.phone = data.phone;
    }
    if (data.githubUrl !== undefined) {
      user.githubUrl = data.githubUrl;
    }
    if (data.linkedinUrl !== undefined) {
      user.linkedinUrl = data.linkedinUrl;
    }
    if (data.portfolioUrl !== undefined) {
      user.portfolioUrl = data.portfolioUrl;
    }
    if (data.skills !== undefined) {
      user.skills = data.skills;
    }
    if (data.suggestedImprovements !== undefined) {
      user.suggestedImprovements = data.suggestedImprovements;
    }
    if (data.experiences !== undefined) {
      user.experiences = data.experiences;
    }
    if (data.careerGoals !== undefined) {
      user.careerGoals = data.careerGoals;
    }
    user.updatedAt = new Date();

    await this.em.persistAndFlush(user);
    return user;
  }

  async setBaseCv(userId: number, cvId: number | null): Promise<User> {
    const user = await this.findById(userId);
    if (!user) {
      throw new NotFoundException("User not found");
    }

    if (cvId === null) {
      user.baseCvId = null;
      await this.em.persistAndFlush(user);
      return user;
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
