import {
  Collection,
  Entity,
  Enum,
  OneToMany,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { Field, ID, ObjectType } from '@nestjs/graphql';
import { RagChunk } from './rag-chunk.entity';
import { RagDocumentType } from './rag-document-type.enum';

@ObjectType()
@Entity({ tableName: 'rag_documents' })
export class RagDocument {
  @Field(() => ID)
  @PrimaryKey()
  docId!: number;

  @Field(() => RagDocumentType)
  @Enum({ items: () => RagDocumentType, nativeEnumName: 'rag_document_type' })
  type!: RagDocumentType;

  @Field()
  @Property()
  title!: string;

  @Field({ nullable: true })
  @Property({ nullable: true })
  sourceUrl?: string;

  @Property({ type: 'text' })
  content!: string;

  @Field({ nullable: true })
  @Property({ nullable: true })
  language?: string;

  @Field()
  @Property({ onCreate: () => new Date() })
  createdAt!: Date;

  @OneToMany(() => RagChunk, (chunk) => chunk.doc)
  chunks = new Collection<RagChunk>(this);
}
