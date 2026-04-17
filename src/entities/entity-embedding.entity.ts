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
  @PrimaryKey({ fieldName: 'embedding_id', type: 'bigint' })
  embeddingId!: bigint;

  @Field(() => EmbeddingEntityType)
  @Enum({
    items: () => EmbeddingEntityType,
    nativeEnumName: 'embedding_entity_type',
    fieldName: 'entity_type',
  })
  entityType!: EmbeddingEntityType;

  @Property({ fieldName: 'entity_id', type: 'bigint' })
  entityId!: bigint;

  @Property({ fieldName: 'embedding', type: 'vector', length: 1536 })
  embedding!: number[];

  @Field()
  @Property({ fieldName: 'embedding_model' })
  embeddingModel!: string;

  @Field(() => Int)
  @Property({ fieldName: 'embedding_dimension', type: 'int', default: 1536 })
  embeddingDimension: number = 1536;

  @Field()
  @Property({ fieldName: 'created_at' })
  createdAt!: Date;
}
