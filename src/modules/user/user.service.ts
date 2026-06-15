import { EntityManager } from "@mikro-orm/postgresql";
import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import * as bcrypt from "bcrypt";
import { Cv } from "src/entities/cv.entity";
import { Role } from "src/entities/role.enum";
import { User } from "src/entities/user.entity";
import { AdminUserSummary } from "./dto/admin-user-summary.output";
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

  async findAdminUserSummaries(): Promise<AdminUserSummary[]> {
    const rows = await this.em.getConnection().execute<
      {
        user_id: number;
        name: string;
        email: string;
        role: Role;
        avatar?: string | null;
        current_role?: string | null;
        location?: string | null;
        created_at: Date | string;
        updated_at?: Date | string | null;
        cv_count: string | number;
        scan_count: string | number;
      }[]
    >(
      `
        select
          u.user_id,
          u.name,
          u.email,
          u.role,
          u.avatar,
          u.current_role,
          u.location,
          u.created_at,
          u.updated_at,
          coalesce(cv_stats.cv_count, 0) as cv_count,
          coalesce(scan_stats.scan_count, 0) as scan_count
        from users u
        left join (
          select user_user_id, count(*)::int as cv_count
          from cvs
          group by user_user_id
        ) cv_stats on cv_stats.user_user_id = u.user_id
        left join (
          select user_id, count(*)::int as scan_count
          from cv_analysis_results
          where user_id is not null
          group by user_id
        ) scan_stats on scan_stats.user_id = u.user_id
        order by u.created_at desc, u.user_id desc
      `,
    );

    return rows.map((row) => ({
      userId: Number(row.user_id),
      name: row.name,
      email: row.email,
      role: row.role,
      avatar: row.avatar ?? null,
      currentRole: row.current_role ?? null,
      location: row.location ?? null,
      createdAt: new Date(row.created_at),
      updatedAt: row.updated_at ? new Date(row.updated_at) : null,
      cvCount: Number(row.cv_count ?? 0),
      scanCount: Number(row.scan_count ?? 0),
    }));
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

  async updateUserRole(userId: number, role: Role): Promise<User> {
    const user = await this.findById(userId);
    if (!user) {
      throw new NotFoundException("User not found");
    }

    user.role = role;
    user.updatedAt = new Date();
    await this.em.persistAndFlush(user);

    return user;
  }

  async createUser(params: {
    name: string;
    email: string;
    password: string;
    role: Role;
  }): Promise<User> {
    const existing = await this.findByEmail(params.email);
    if (existing) {
      throw new BadRequestException("Email is already in use");
    }

    const user = new User();
    user.name = params.name.trim();
    user.email = params.email.trim().toLowerCase();
    user.password = await bcrypt.hash(params.password, 10);
    user.role = params.role;
    user.createdAt = new Date();
    user.updatedAt = new Date();

    await this.em.persistAndFlush(user);
    return user;
  }

  async deleteUserById(userId: number): Promise<boolean> {
    const user = await this.findById(userId);
    if (!user) return false;

    await this.em.removeAndFlush(user);
    return true;
  }

  async deleteUserAccount(userId: number): Promise<boolean> {
    const user = await this.findById(userId);
    if (!user) return false;

    await this.em.removeAndFlush(user);
    return true;
  }
}
