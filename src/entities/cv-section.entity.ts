import {
  Entity,
  Enum,
  ManyToOne,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { Field, ID, ObjectType } from '@nestjs/graphql';
import { CvSectionType } from './cv-section-type.enum';
import { CvDocument } from './cv-document.entity';

@ObjectType()
@Entity({ tableName: 'cv_sections' })
export class CvSection {
  @Field(() => ID)
  @PrimaryKey()
  sectionId!: number;

  @ManyToOne(() => CvDocument)
  cv!: CvDocument;

  @Field(() => CvSectionType)
  @Enum({ items: () => CvSectionType, nativeEnumName: 'cv_section_type' })
  type!: CvSectionType;

  @Field()
  @Property({ type: 'text' })
  content!: string;

  @Field()
  @Property({ type: 'int' })
  orderIndex!: number;
}
