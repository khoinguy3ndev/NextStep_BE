import { registerEnumType } from '@nestjs/graphql';

export enum EmbeddingEntityType {
  JOB = 'job',
  CV = 'cv',
  SKILL = 'skill',
  RAG_CHUNK = 'rag_chunk',
}

registerEnumType(EmbeddingEntityType, {
  name: 'EmbeddingEntityType',
});
