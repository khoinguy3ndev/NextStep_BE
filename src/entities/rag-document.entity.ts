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
  @PrimaryKey({ fieldName: 'doc_id' })
  docId!: number;

  @Field(() => RagDocumentType)
  @Enum({
    items: () => RagDocumentType,
    nativeEnumName: 'rag_document_type',
    fieldName: 'type',
  })
  type!: RagDocumentType;

  @Field()
  @Property({ fieldName: 'title' })
  title!: string;

  @Field({ nullable: true })
  @Property({ fieldName: 'source_url', nullable: true })
  sourceUrl?: string;

  @Property({ fieldName: 'content', type: 'text' })
  content!: string;

  @Field({ nullable: true })
  @Property({ fieldName: 'language', nullable: true })
  language?: string;

  @Field()
  @Property({ fieldName: 'created_at' })
  createdAt!: Date;

  @OneToMany(() => RagChunk, (chunk) => chunk.doc)
  chunks = new Collection<RagChunk>(this);
}
