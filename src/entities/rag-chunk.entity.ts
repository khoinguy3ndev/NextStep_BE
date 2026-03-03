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
  @PrimaryKey()
  chunkId!: number;

  @ManyToOne(() => RagDocument)
  doc!: RagDocument;

  @Field()
  @Property({ type: 'text' })
  content!: string;

  @Field()
  @Property({ type: 'int' })
  tokenCount!: number;

  @Property({ type: 'vector', length: 1536 })
  embedding!: number[];

  @Field()
  @Property()
  embeddingModel!: string;

  @Field()
  @Property({ onCreate: () => new Date() })
  createdAt!: Date;
}
