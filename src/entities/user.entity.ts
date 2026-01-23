import {
  Entity,
  OneToMany,
  PrimaryKey,
  Property,
  Unique,
} from '@mikro-orm/core';
import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Todo } from './todo.entity';

@ObjectType()
@Entity({ tableName: 'users' })
export class User {
  @Field(() => ID)
  @PrimaryKey()
  userId!: number;

  @Field()
  @Property({ unique: true })
  @Unique()
  email!: string;

  @Property()
  password!: string;

  @Field()
  @Property()
  name!: string;

  @Field()
  @Property({ onCreate: () => new Date() })
  createdAt!: Date;

  @Field()
  @Property({ onUpdate: () => new Date(), nullable: true })
  updatedAt?: Date;

  @OneToMany(() => Todo, (todo) => todo.user)
  todos = new Array<Todo>();
}
