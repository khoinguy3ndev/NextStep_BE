import {
  Collection,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { Field, ID, ObjectType } from '@nestjs/graphql';
import { User } from './user.entity';
import { CvSection } from './cv-section.entity';
import { CvSkill } from './cv-skill.entity';

@ObjectType()
@Entity({ tableName: 'cv_documents' })
export class CvDocument {
  @Field(() => ID)
  @PrimaryKey()
  cvId!: number;

  @Field(() => User)
  @ManyToOne(() => User)
  user!: User;

  @Field()
  @Property()
  fileUrl!: string;

  @Property({ type: 'text' })
  parsedText!: string;

  @Field({ nullable: true })
  @Property({ nullable: true })
  language?: string;

  @Field()
  @Property({ onCreate: () => new Date() })
  uploadedAt!: Date;

  @Field()
  @Property({ default: 1 })
  version!: number;

  @OneToMany(() => CvSection, (section) => section.cv)
  sections = new Collection<CvSection>(this);

  @OneToMany(() => CvSkill, (cvSkill) => cvSkill.cv)
  cvSkills = new Collection<CvSkill>(this);
}
