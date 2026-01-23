import { EntityManager } from '@mikro-orm/postgresql';
import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from 'src/entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    private readonly em: EntityManager,
  ) {}

  async findById(userId: number): Promise<User | null> {
    return this.em.findOne(User, { userId: userId });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.em.findOne(User, { email })
  }

  async createUser(email: string, password: string, name: string): Promise<User> {
    const user = new User();
    user.email = email;
    user.password = password;
    user.name = name;
    await this.em.persistAndFlush(user);
    return user;
  }
}
