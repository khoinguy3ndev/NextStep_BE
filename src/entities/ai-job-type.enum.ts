import { registerEnumType } from '@nestjs/graphql';

export enum AiJobType {
  EMBED_JOB = 'embed_job',
  EMBED_CV = 'embed_cv',
  EMBED_SKILL = 'embed_skill',
  EMBED_RAG_CHUNK = 'embed_rag_chunk',
}

registerEnumType(AiJobType, {
  name: 'AiJobType',
});
