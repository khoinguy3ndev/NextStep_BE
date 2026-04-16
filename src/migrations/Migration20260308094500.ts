import { Migration } from '@mikro-orm/migrations';

export class Migration20260308094500 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`do $$ begin create type "ai_job_status" as enum ('queued', 'running', 'succeeded', 'failed', 'cancelled'); exception when duplicate_object then null; end $$;`);
    this.addSql(`do $$ begin create type "ai_job_type" as enum ('embed_job', 'embed_cv', 'embed_skill', 'embed_rag_chunk'); exception when duplicate_object then null; end $$;`);
    this.addSql(`do $$ begin create type "embedding_entity_type" as enum ('job', 'cv', 'skill', 'rag_chunk'); exception when duplicate_object then null; end $$;`);

    this.addSql(`create table if not exists "ai_jobs" ("ai_job_id" serial primary key, "type" "ai_job_type" not null, "request_request_id" int null, "entity_type" varchar(255) not null, "entity_id" int not null, "payload_json" jsonb null, "status" "ai_job_status" not null default 'queued', "priority" int not null default 100, "scheduled_at" timestamptz not null, "retry_count" int not null default 0, "max_retries" int not null default 3, "locked_by" varchar(255) null, "locked_at" timestamptz null, "error_message" text null, "started_at" timestamptz null, "finished_at" timestamptz null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "idempotency_key" varchar(255) not null);`);
    this.addSql(`do $$ begin if not exists (select 1 from pg_constraint where conname = 'ai_jobs_idempotency_key_unique') then alter table "ai_jobs" add constraint "ai_jobs_idempotency_key_unique" unique ("idempotency_key"); end if; end $$;`);
    this.addSql(`create index if not exists "ai_jobs_status_priority_scheduled_at_index" on "ai_jobs" ("status", "priority", "scheduled_at");`);
    this.addSql(`create index if not exists "ai_jobs_locked_by_locked_at_index" on "ai_jobs" ("locked_by", "locked_at");`);

    this.addSql(`create table if not exists "ai_job_attempts" ("attempt_id" serial primary key, "ai_job_ai_job_id" int not null, "attempt_no" int not null, "status" "ai_job_status" not null, "started_at" timestamptz not null, "finished_at" timestamptz null, "worker_id" varchar(255) null, "input_snapshot_json" jsonb null, "output_snapshot_json" jsonb null, "error_message" text null, "latency_ms" int null, "prompt_tokens" int null, "completion_tokens" int null, "cost_usd" real null);`);
    this.addSql(`create index if not exists "ai_job_attempts_ai_job_ai_job_id_index" on "ai_job_attempts" ("ai_job_ai_job_id");`);

    this.addSql(`create table if not exists "skill_aliases" ("alias_id" serial primary key, "skill_skill_id" int not null, "alias" varchar(255) not null, "created_at" timestamptz not null);`);
    this.addSql(`do $$ begin if not exists (select 1 from pg_constraint where conname = 'skill_aliases_skill_skill_id_alias_unique') then alter table "skill_aliases" add constraint "skill_aliases_skill_skill_id_alias_unique" unique ("skill_skill_id", "alias"); end if; end $$;`);

    this.addSql(`create table if not exists "entity_embeddings" ("embedding_id" serial primary key, "entity_type" "embedding_entity_type" not null, "entity_id" int not null, "embedding" vector(1536) not null, "embedding_model" varchar(255) not null, "embedding_dimension" int not null default 1536, "created_at" timestamptz not null);`);
    this.addSql(`do $$ begin if not exists (select 1 from pg_constraint where conname = 'entity_embeddings_entity_type_entity_id_embedding_model_unique') then alter table "entity_embeddings" add constraint "entity_embeddings_entity_type_entity_id_embedding_model_unique" unique ("entity_type", "entity_id", "embedding_model"); end if; end $$;`);
    this.addSql(`create index if not exists "entity_embeddings_entity_type_entity_id_index" on "entity_embeddings" ("entity_type", "entity_id");`);

    this.addSql(`do $$ begin if not exists (select 1 from pg_constraint where conname = 'ai_jobs_request_request_id_foreign') then alter table "ai_jobs" add constraint "ai_jobs_request_request_id_foreign" foreign key ("request_request_id") references "analysis_requests" ("request_id") on update cascade on delete set null; end if; end $$;`);
    this.addSql(`do $$ begin if not exists (select 1 from pg_constraint where conname = 'ai_job_attempts_ai_job_ai_job_id_foreign') then alter table "ai_job_attempts" add constraint "ai_job_attempts_ai_job_ai_job_id_foreign" foreign key ("ai_job_ai_job_id") references "ai_jobs" ("ai_job_id") on update cascade; end if; end $$;`);
    this.addSql(`do $$ begin if not exists (select 1 from pg_constraint where conname = 'skill_aliases_skill_skill_id_foreign') then alter table "skill_aliases" add constraint "skill_aliases_skill_skill_id_foreign" foreign key ("skill_skill_id") references "skills" ("skill_id") on update cascade; end if; end $$;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "ai_jobs" drop constraint "ai_jobs_request_request_id_foreign";`);
    this.addSql(`alter table "ai_job_attempts" drop constraint "ai_job_attempts_ai_job_ai_job_id_foreign";`);
    this.addSql(`alter table "skill_aliases" drop constraint "skill_aliases_skill_skill_id_foreign";`);

    this.addSql(`drop table if exists "ai_job_attempts" cascade;`);
    this.addSql(`drop table if exists "skill_aliases" cascade;`);
    this.addSql(`drop table if exists "entity_embeddings" cascade;`);
    this.addSql(`drop table if exists "ai_jobs" cascade;`);

    this.addSql(`drop type "embedding_entity_type";`);
    this.addSql(`drop type "ai_job_type";`);
    this.addSql(`drop type "ai_job_status";`);
  }

}
