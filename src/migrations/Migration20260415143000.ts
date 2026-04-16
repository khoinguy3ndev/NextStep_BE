import { Migration } from "@mikro-orm/migrations";

export class Migration20260415143000 extends Migration {
  override async up(): Promise<void> {
    this.addSql('drop table if exists "ai_job_attempts" cascade;');
    this.addSql('drop table if exists "ai_jobs" cascade;');
    this.addSql('drop table if exists "analysis_results" cascade;');
    this.addSql('drop table if exists "analysis_requests" cascade;');
    this.addSql('drop table if exists "be_cv_skills" cascade;');
    this.addSql('drop table if exists "cv_sections" cascade;');
    this.addSql('drop table if exists "cv_documents" cascade;');
    this.addSql('drop table if exists "job_matches" cascade;');
    this.addSql('drop table if exists "skill_aliases" cascade;');

    this.addSql('drop type if exists "analysis_status";');
    this.addSql('drop type if exists "ai_job_status";');
    this.addSql('drop type if exists "ai_job_type";');
    this.addSql('drop type if exists "cv_section_type";');
  }

  override async down(): Promise<void> {
    this.addSql(
      `do $$ begin create type "analysis_status" as enum ('pending', 'running', 'completed', 'failed'); exception when duplicate_object then null; end $$;`,
    );
    this.addSql(
      `do $$ begin create type "ai_job_status" as enum ('queued', 'running', 'succeeded', 'failed', 'cancelled'); exception when duplicate_object then null; end $$;`,
    );
    this.addSql(
      `do $$ begin create type "ai_job_type" as enum ('embed_job', 'embed_cv', 'embed_skill', 'embed_rag_chunk'); exception when duplicate_object then null; end $$;`,
    );
    this.addSql(
      `do $$ begin create type "cv_section_type" as enum ('education', 'experience', 'project', 'skill', 'certification', 'other'); exception when duplicate_object then null; end $$;`,
    );

    this.addSql(
      `create table if not exists "cv_documents" ("cv_id" serial primary key, "user_user_id" int not null, "file_url" varchar(255) not null, "parsed_text" text not null, "language" varchar(255) null, "uploaded_at" timestamptz not null, "version" int not null default 1);`,
    );
    this.addSql(
      `create table if not exists "cv_sections" ("section_id" serial primary key, "cv_cv_id" int not null, "type" "cv_section_type" not null, "content" text not null, "order_index" int not null);`,
    );
    this.addSql(
      `create table if not exists "analysis_requests" ("request_id" serial primary key, "user_user_id" int not null, "cv_cv_id" int not null, "job_job_id" int null, "prompt" text not null, "model" varchar(255) not null, "status" "analysis_status" not null default 'pending', "created_at" timestamptz not null);`,
    );
    this.addSql(
      `create table if not exists "analysis_results" ("result_id" serial primary key, "request_request_id" int not null, "summary" text null, "gap_analysis_json" jsonb null, "recommended_skills" text[] not null default '{}', "roadmap_json" jsonb null, "created_at" timestamptz not null);`,
    );
    this.addSql(
      `do $$ begin if not exists (select 1 from pg_constraint where conname = 'analysis_results_request_request_id_unique') then alter table "analysis_results" add constraint "analysis_results_request_request_id_unique" unique ("request_request_id"); end if; end $$;`,
    );
    this.addSql(
      `create table if not exists "be_cv_skills" ("cv_skill_id" serial primary key, "cv_cv_id" int not null, "skill_skill_id" int not null, "proficiency" real not null, "years_exp" real null, "evidence_snippet" text null);`,
    );
    this.addSql(
      `do $$ begin if not exists (select 1 from pg_constraint where conname = 'be_cv_skills_cv_cv_id_skill_skill_id_unique') then alter table "be_cv_skills" add constraint "be_cv_skills_cv_cv_id_skill_skill_id_unique" unique ("cv_cv_id", "skill_skill_id"); end if; end $$;`,
    );
    this.addSql(
      `create table if not exists "job_matches" ("match_id" serial primary key, "user_user_id" int not null, "cv_cv_id" int not null, "job_job_id" int not null, "score" real not null, "score_breakdown_json" jsonb null, "missing_skills" text[] not null default '{}', "matched_skills" text[] not null default '{}', "created_at" timestamptz not null);`,
    );
    this.addSql(
      `do $$ begin if not exists (select 1 from pg_constraint where conname = 'job_matches_cv_cv_id_job_job_id_unique') then alter table "job_matches" add constraint "job_matches_cv_cv_id_job_job_id_unique" unique ("cv_cv_id", "job_job_id"); end if; end $$;`,
    );
    this.addSql(
      `create table if not exists "skill_aliases" ("alias_id" serial primary key, "skill_skill_id" int not null, "alias" varchar(255) not null, "created_at" timestamptz not null);`,
    );
    this.addSql(
      `do $$ begin if not exists (select 1 from pg_constraint where conname = 'skill_aliases_skill_skill_id_alias_unique') then alter table "skill_aliases" add constraint "skill_aliases_skill_skill_id_alias_unique" unique ("skill_skill_id", "alias"); end if; end $$;`,
    );
    this.addSql(
      `create table if not exists "ai_jobs" ("ai_job_id" serial primary key, "type" "ai_job_type" not null, "request_request_id" int null, "entity_type" varchar(255) not null, "entity_id" int not null, "payload_json" jsonb null, "status" "ai_job_status" not null default 'queued', "priority" int not null default 100, "scheduled_at" timestamptz not null, "retry_count" int not null default 0, "max_retries" int not null default 3, "locked_by" varchar(255) null, "locked_at" timestamptz null, "error_message" text null, "started_at" timestamptz null, "finished_at" timestamptz null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "idempotency_key" varchar(255) not null);`,
    );
    this.addSql(
      `do $$ begin if not exists (select 1 from pg_constraint where conname = 'ai_jobs_idempotency_key_unique') then alter table "ai_jobs" add constraint "ai_jobs_idempotency_key_unique" unique ("idempotency_key"); end if; end $$;`,
    );
    this.addSql(
      `create table if not exists "ai_job_attempts" ("attempt_id" serial primary key, "ai_job_ai_job_id" int not null, "attempt_no" int not null, "status" "ai_job_status" not null, "started_at" timestamptz not null, "finished_at" timestamptz null, "worker_id" varchar(255) null, "input_snapshot_json" jsonb null, "output_snapshot_json" jsonb null, "error_message" text null, "latency_ms" int null, "prompt_tokens" int null, "completion_tokens" int null, "cost_usd" real null);`,
    );
  }
}
