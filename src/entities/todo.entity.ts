import { Entity, PrimaryKey, Property, ManyToOne, OptionalProps } from '@mikro-orm/core';
import { Field, ID, ObjectType } from '@nestjs/graphql';
import { User } from './user.entity';

@ObjectType()
@Entity({ tableName: 'todos' })
export class Todo {
  [OptionalProps]?: 'createdAt' | 'updatedAt' | 'completed' | 'todoId';

  @Field(() => ID)
  @PrimaryKey()
  todoId!: number;

  @Field()
  @Property()
  title!: string;

  @Field({ nullable: true })
  @Property({ nullable: true })
  description?: string;

  @Field()
  @Property()
  startDate!: Date;

  @Field()
  @Property()
  endDate!: Date;

  @Field()
  @Property({ default: false })
  completed: boolean = false;

  @Field()
  @Property({ onCreate: () => new Date() })
  createdAt: Date = new Date();

  @Field({ nullable: true })
  @Property({ onUpdate: () => new Date(), nullable: true })
  updatedAt?: Date;

  @Field(() => User)
  @ManyToOne(() => User, {
    fieldName: 'user_id'
  })
  user!: User;
}

