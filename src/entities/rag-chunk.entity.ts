import {
  Entity,
  ManyToOne,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { Field, ID, ObjectType } from '@nestjs/graphql';
import { RagDocument } from './rag-document.entity';

@ObjectType()
@Entity({ tableName: 'rag_chunks' })
export class RagChunk {
  @Field(() => ID)
  @PrimaryKey({ fieldName: 'chunk_id' })
  chunkId!: number;

  @ManyToOne(() => RagDocument, { fieldName: 'doc_doc_id' })
  doc!: RagDocument;

  @Field()
  @Property({ fieldName: 'content', type: 'text' })
  content!: string;

  @Field()
  @Property({ fieldName: 'token_count', type: 'int' })
  tokenCount!: number;

  @Property({ fieldName: 'embedding', type: 'vector', length: 1536 })
  embedding!: number[];

  @Field()
  @Property({ fieldName: 'embedding_model' })
  embeddingModel!: string;

  @Field()
  @Property({ fieldName: 'created_at' })
  createdAt!: Date;
}
