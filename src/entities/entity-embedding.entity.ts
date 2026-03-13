import {
  Entity,
  Enum,
  Index,
  PrimaryKey,
  Property,
  Unique,
} from '@mikro-orm/core';
import { Field, ID, Int, ObjectType } from '@nestjs/graphql';
import { EmbeddingEntityType } from './embedding-entity-type.enum';

@ObjectType()
@Entity({ tableName: 'entity_embeddings' })
@Index({ properties: ['entityType', 'entityId'] })
@Unique({ properties: ['entityType', 'entityId', 'embeddingModel'] })
export class EntityEmbedding {
  @Field(() => ID)
  @PrimaryKey()
  embeddingId!: number;

  @Field(() => EmbeddingEntityType)
  @Enum({ items: () => EmbeddingEntityType, nativeEnumName: 'embedding_entity_type' })
  entityType!: EmbeddingEntityType;

  @Field(() => Int)
  @Property({ type: 'int' })
  entityId!: number;

  @Property({ type: 'vector', length: 1536 })
  embedding!: number[];

  @Field()
  @Property()
  embeddingModel!: string;

  @Field(() => Int)
  @Property({ type: 'int', default: 1536 })
  embeddingDimension: number = 1536;

  @Field()
  @Property({ onCreate: () => new Date() })
  createdAt!: Date;
}
