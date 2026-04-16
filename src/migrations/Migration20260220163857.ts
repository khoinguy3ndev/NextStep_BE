import { Migration } from '@mikro-orm/migrations';

export class Migration20260220163857 extends Migration {

  override async up(): Promise<void> {
    this.addSql('create extension if not exists vector;');
    this.addSql(`do $$ begin create type "job_level" as enum ('intern', 'junior', 'mid', 'senior', 'lead'); exception when duplicate_object then null; end $$;`);
    this.addSql(`do $$ begin create type "currency" as enum ('VND', 'USD'); exception when duplicate_object then null; end $$;`);
    this.addSql(`do $$ begin create type "job_status" as enum ('active', 'closed', 'draft'); exception when duplicate_object then null; end $$;`);
    this.addSql(`do $$ begin create type "rag_document_type" as enum ('job_market', 'course', 'skill_guide', 'role_profile'); exception when duplicate_object then null; end $$;`);
    this.addSql(`do $$ begin create type "requirement_type" as enum ('skill', 'degree', 'experience', 'language', 'other'); exception when duplicate_object then null; end $$;`);
    this.addSql(`do $$ begin create type "roadmap_status" as enum ('draft', 'active', 'completed', 'archived'); exception when duplicate_object then null; end $$;`);
    this.addSql(`do $$ begin create type "cv_section_type" as enum ('education', 'experience', 'project', 'skill', 'certification', 'other'); exception when duplicate_object then null; end $$;`);
    this.addSql(`do $$ begin create type "analysis_status" as enum ('pending', 'running', 'completed', 'failed'); exception when duplicate_object then null; end $$;`);
    this.addSql(`create table if not exists "companies" ("company_id" serial primary key, "name" varchar(255) not null, "website" varchar(255) null, "industry" varchar(255) null, "size" varchar(255) null, "location" varchar(255) null, "logo_url" varchar(255) null);`);
    this.addSql(`do $$ begin if not exists (select 1 from pg_constraint where conname = 'companies_name_unique') then alter table "companies" add constraint "companies_name_unique" unique ("name"); end if; end $$;`);

    this.addSql(`create table if not exists "jobs" ("job_id" serial primary key, "company_company_id" int not null, "title" varchar(255) not null, "level" "job_level" null, "location" varchar(255) null, "salary_min" int null, "salary_max" int null, "currency" "currency" null, "description_raw" text not null, "description_clean" text null, "source_url" varchar(255) not null, "source_site" varchar(255) not null, "posted_at" timestamptz null, "scraped_at" timestamptz not null, "status" "job_status" not null default 'active');`);
    this.addSql(`do $$ begin if not exists (select 1 from pg_constraint where conname = 'jobs_source_url_unique') then alter table "jobs" add constraint "jobs_source_url_unique" unique ("source_url"); end if; end $$;`);

    this.addSql(`create table if not exists "learning_resources" ("resource_id" serial primary key, "title" varchar(255) not null, "provider" varchar(255) null, "url" varchar(255) not null, "cost" int null, "duration_hours" int null, "tags" text[] not null default '{}', "language" varchar(255) null);`);

    this.addSql(`create table if not exists "rag_documents" ("doc_id" serial primary key, "type" "rag_document_type" not null, "title" varchar(255) not null, "source_url" varchar(255) null, "content" text not null, "language" varchar(255) null, "created_at" timestamptz not null);`);

    this.addSql(`create table if not exists "rag_chunks" ("chunk_id" serial primary key, "doc_doc_id" int not null, "content" text not null, "token_count" int not null, "embedding" vector(1536) not null, "embedding_model" varchar(255) not null, "created_at" timestamptz not null);`);

    this.addSql(`create table if not exists "skills" ("skill_id" serial primary key, "name" varchar(255) not null, "category" varchar(255) null, "aliases" text[] not null default '{}', "is_active" boolean not null default true);`);
    this.addSql(`do $$ begin if not exists (select 1 from pg_constraint where conname = 'skills_name_unique') then alter table "skills" add constraint "skills_name_unique" unique ("name"); end if; end $$;`);

    this.addSql(`create table if not exists "job_skills" ("job_skill_id" serial primary key, "job_job_id" int not null, "skill_skill_id" int not null, "importance" real not null, "evidence_snippet" text null);`);
    this.addSql(`do $$ begin if not exists (select 1 from pg_constraint where conname = 'job_skills_job_job_id_skill_skill_id_unique') then alter table "job_skills" add constraint "job_skills_job_job_id_skill_skill_id_unique" unique ("job_job_id", "skill_skill_id"); end if; end $$;`);

    this.addSql(`create table if not exists "job_requirements" ("requirement_id" serial primary key, "job_job_id" int not null, "type" "requirement_type" not null, "raw_text" text not null, "years_exp" int null, "normalized_skill_skill_id" int null);`);

    this.addSql(`create table if not exists "search_profiles" ("profile_id" serial primary key, "user_user_id" int not null, "desired_salary_min" int null, "desired_salary_max" int null, "currency" "currency" null, "locations" text[] not null default '{}', "target_levels" "job_level"[] not null default '{}', "target_titles" text[] not null default '{}', "industries" text[] not null default '{}');`);

    this.addSql(`create table if not exists "roadmaps" ("roadmap_id" serial primary key, "user_user_id" int not null, "target_job_job_id" int null, "goal_title" varchar(255) not null, "timeframe_weeks" int not null, "status" "roadmap_status" not null default 'draft', "created_at" timestamptz not null);`);

    this.addSql(`create table if not exists "roadmap_items" ("item_id" serial primary key, "roadmap_roadmap_id" int not null, "skill_skill_id" int not null, "priority" int null, "estimated_weeks" int null, "resource_resource_id" int null, "notes" text null);`);

    this.addSql(`create table if not exists "cv_documents" ("cv_id" serial primary key, "user_user_id" int not null, "file_url" varchar(255) not null, "parsed_text" text not null, "language" varchar(255) null, "uploaded_at" timestamptz not null, "version" int not null default 1);`);

    this.addSql(`create table if not exists "job_matches" ("match_id" serial primary key, "user_user_id" int not null, "cv_cv_id" int not null, "job_job_id" int not null, "score" real not null, "score_breakdown_json" jsonb null, "missing_skills" text[] not null default '{}', "matched_skills" text[] not null default '{}', "created_at" timestamptz not null);`);
    this.addSql(`do $$ begin if not exists (select 1 from pg_constraint where conname = 'job_matches_cv_cv_id_job_job_id_unique') then alter table "job_matches" add constraint "job_matches_cv_cv_id_job_job_id_unique" unique ("cv_cv_id", "job_job_id"); end if; end $$;`);

    this.addSql(`create table if not exists "be_cv_skills" ("cv_skill_id" serial primary key, "cv_cv_id" int not null, "skill_skill_id" int not null, "proficiency" real not null, "years_exp" real null, "evidence_snippet" text null);`);
    this.addSql(`do $$ begin if not exists (select 1 from pg_constraint where conname = 'be_cv_skills_cv_cv_id_skill_skill_id_unique') then alter table "be_cv_skills" add constraint "be_cv_skills_cv_cv_id_skill_skill_id_unique" unique ("cv_cv_id", "skill_skill_id"); end if; end $$;`);

    this.addSql(`create table if not exists "cv_sections" ("section_id" serial primary key, "cv_cv_id" int not null, "type" "cv_section_type" not null, "content" text not null, "order_index" int not null);`);

    this.addSql(`create table if not exists "analysis_requests" ("request_id" serial primary key, "user_user_id" int not null, "cv_cv_id" int not null, "job_job_id" int null, "prompt" text not null, "model" varchar(255) not null, "status" "analysis_status" not null default 'pending', "created_at" timestamptz not null);`);

    this.addSql(`create table if not exists "analysis_results" ("result_id" serial primary key, "request_request_id" int not null, "summary" text null, "gap_analysis_json" jsonb null, "recommended_skills" text[] not null default '{}', "roadmap_json" jsonb null, "created_at" timestamptz not null);`);
    this.addSql(`do $$ begin if not exists (select 1 from pg_constraint where conname = 'analysis_results_request_request_id_unique') then alter table "analysis_results" add constraint "analysis_results_request_request_id_unique" unique ("request_request_id"); end if; end $$;`);

    this.addSql(`do $$ begin if not exists (select 1 from pg_constraint where conname = 'jobs_company_company_id_foreign') then alter table "jobs" add constraint "jobs_company_company_id_foreign" foreign key ("company_company_id") references "companies" ("company_id") on update cascade; end if; end $$;`);

    this.addSql(`do $$ begin if not exists (select 1 from pg_constraint where conname = 'rag_chunks_doc_doc_id_foreign') then alter table "rag_chunks" add constraint "rag_chunks_doc_doc_id_foreign" foreign key ("doc_doc_id") references "rag_documents" ("doc_id") on update cascade; end if; end $$;`);

    this.addSql(`do $$ begin if not exists (select 1 from pg_constraint where conname = 'job_skills_job_job_id_foreign') then alter table "job_skills" add constraint "job_skills_job_job_id_foreign" foreign key ("job_job_id") references "jobs" ("job_id") on update cascade; end if; end $$;`);
    this.addSql(`do $$ begin if not exists (select 1 from pg_constraint where conname = 'job_skills_skill_skill_id_foreign') then alter table "job_skills" add constraint "job_skills_skill_skill_id_foreign" foreign key ("skill_skill_id") references "skills" ("skill_id") on update cascade; end if; end $$;`);

    this.addSql(`do $$ begin if not exists (select 1 from pg_constraint where conname = 'job_requirements_job_job_id_foreign') then alter table "job_requirements" add constraint "job_requirements_job_job_id_foreign" foreign key ("job_job_id") references "jobs" ("job_id") on update cascade; end if; end $$;`);
    this.addSql(`do $$ begin if not exists (select 1 from pg_constraint where conname = 'job_requirements_normalized_skill_skill_id_foreign') then alter table "job_requirements" add constraint "job_requirements_normalized_skill_skill_id_foreign" foreign key ("normalized_skill_skill_id") references "skills" ("skill_id") on update cascade on delete set null; end if; end $$;`);

    this.addSql(`do $$ begin if not exists (select 1 from pg_constraint where conname = 'search_profiles_user_user_id_foreign') then alter table "search_profiles" add constraint "search_profiles_user_user_id_foreign" foreign key ("user_user_id") references "users" ("user_id") on update cascade; end if; end $$;`);

    this.addSql(`do $$ begin if not exists (select 1 from pg_constraint where conname = 'roadmaps_user_user_id_foreign') then alter table "roadmaps" add constraint "roadmaps_user_user_id_foreign" foreign key ("user_user_id") references "users" ("user_id") on update cascade; end if; end $$;`);
    this.addSql(`do $$ begin if not exists (select 1 from pg_constraint where conname = 'roadmaps_target_job_job_id_foreign') then alter table "roadmaps" add constraint "roadmaps_target_job_job_id_foreign" foreign key ("target_job_job_id") references "jobs" ("job_id") on update cascade on delete set null; end if; end $$;`);

    this.addSql(`do $$ begin if not exists (select 1 from pg_constraint where conname = 'roadmap_items_roadmap_roadmap_id_foreign') then alter table "roadmap_items" add constraint "roadmap_items_roadmap_roadmap_id_foreign" foreign key ("roadmap_roadmap_id") references "roadmaps" ("roadmap_id") on update cascade; end if; end $$;`);
    this.addSql(`do $$ begin if not exists (select 1 from pg_constraint where conname = 'roadmap_items_skill_skill_id_foreign') then alter table "roadmap_items" add constraint "roadmap_items_skill_skill_id_foreign" foreign key ("skill_skill_id") references "skills" ("skill_id") on update cascade; end if; end $$;`);
    this.addSql(`do $$ begin if not exists (select 1 from pg_constraint where conname = 'roadmap_items_resource_resource_id_foreign') then alter table "roadmap_items" add constraint "roadmap_items_resource_resource_id_foreign" foreign key ("resource_resource_id") references "learning_resources" ("resource_id") on update cascade on delete set null; end if; end $$;`);

    this.addSql(`do $$ begin if not exists (select 1 from pg_constraint where conname = 'cv_documents_user_user_id_foreign') then alter table "cv_documents" add constraint "cv_documents_user_user_id_foreign" foreign key ("user_user_id") references "users" ("user_id") on update cascade; end if; end $$;`);

    this.addSql(`do $$ begin if not exists (select 1 from pg_constraint where conname = 'job_matches_user_user_id_foreign') then alter table "job_matches" add constraint "job_matches_user_user_id_foreign" foreign key ("user_user_id") references "users" ("user_id") on update cascade; end if; end $$;`);
    this.addSql(`do $$ begin if not exists (select 1 from pg_constraint where conname = 'job_matches_cv_cv_id_foreign') then alter table "job_matches" add constraint "job_matches_cv_cv_id_foreign" foreign key ("cv_cv_id") references "cv_documents" ("cv_id") on update cascade; end if; end $$;`);
    this.addSql(`do $$ begin if not exists (select 1 from pg_constraint where conname = 'job_matches_job_job_id_foreign') then alter table "job_matches" add constraint "job_matches_job_job_id_foreign" foreign key ("job_job_id") references "jobs" ("job_id") on update cascade; end if; end $$;`);

    this.addSql(`do $$ begin if not exists (select 1 from pg_constraint where conname = 'be_cv_skills_cv_cv_id_foreign') then alter table "be_cv_skills" add constraint "be_cv_skills_cv_cv_id_foreign" foreign key ("cv_cv_id") references "cv_documents" ("cv_id") on update cascade; end if; end $$;`);
    this.addSql(`do $$ begin if not exists (select 1 from pg_constraint where conname = 'be_cv_skills_skill_skill_id_foreign') then alter table "be_cv_skills" add constraint "be_cv_skills_skill_skill_id_foreign" foreign key ("skill_skill_id") references "skills" ("skill_id") on update cascade; end if; end $$;`);

    this.addSql(`do $$ begin if not exists (select 1 from pg_constraint where conname = 'cv_sections_cv_cv_id_foreign') then alter table "cv_sections" add constraint "cv_sections_cv_cv_id_foreign" foreign key ("cv_cv_id") references "cv_documents" ("cv_id") on update cascade; end if; end $$;`);

    this.addSql(`do $$ begin if not exists (select 1 from pg_constraint where conname = 'analysis_requests_user_user_id_foreign') then alter table "analysis_requests" add constraint "analysis_requests_user_user_id_foreign" foreign key ("user_user_id") references "users" ("user_id") on update cascade; end if; end $$;`);
    this.addSql(`do $$ begin if not exists (select 1 from pg_constraint where conname = 'analysis_requests_cv_cv_id_foreign') then alter table "analysis_requests" add constraint "analysis_requests_cv_cv_id_foreign" foreign key ("cv_cv_id") references "cv_documents" ("cv_id") on update cascade; end if; end $$;`);
    this.addSql(`do $$ begin if not exists (select 1 from pg_constraint where conname = 'analysis_requests_job_job_id_foreign') then alter table "analysis_requests" add constraint "analysis_requests_job_job_id_foreign" foreign key ("job_job_id") references "jobs" ("job_id") on update cascade on delete set null; end if; end $$;`);

    this.addSql(`do $$ begin if not exists (select 1 from pg_constraint where conname = 'analysis_results_request_request_id_foreign') then alter table "analysis_results" add constraint "analysis_results_request_request_id_foreign" foreign key ("request_request_id") references "analysis_requests" ("request_id") on update cascade; end if; end $$;`);

    this.addSql(`alter table "users" add column if not exists "role" text;`);
    this.addSql(`update "users" set "role" = 'user' where "role" is null;`);
    this.addSql(`do $$ begin if not exists (select 1 from pg_constraint where conname = 'users_role_check') then alter table "users" add constraint "users_role_check" check ("role" in ('user', 'admin')); end if; end $$;`);
    this.addSql(`alter table "users" alter column "role" set default 'user';`);
    this.addSql(`alter table "users" alter column "role" set not null;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "jobs" drop constraint "jobs_company_company_id_foreign";`);

    this.addSql(`alter table "job_skills" drop constraint "job_skills_job_job_id_foreign";`);

    this.addSql(`alter table "job_requirements" drop constraint "job_requirements_job_job_id_foreign";`);

    this.addSql(`alter table "roadmaps" drop constraint "roadmaps_target_job_job_id_foreign";`);

    this.addSql(`alter table "job_matches" drop constraint "job_matches_job_job_id_foreign";`);

    this.addSql(`alter table "analysis_requests" drop constraint "analysis_requests_job_job_id_foreign";`);

    this.addSql(`alter table "roadmap_items" drop constraint "roadmap_items_resource_resource_id_foreign";`);

    this.addSql(`alter table "rag_chunks" drop constraint "rag_chunks_doc_doc_id_foreign";`);

    this.addSql(`alter table "job_skills" drop constraint "job_skills_skill_skill_id_foreign";`);

    this.addSql(`alter table "job_requirements" drop constraint "job_requirements_normalized_skill_skill_id_foreign";`);

    this.addSql(`alter table "roadmap_items" drop constraint "roadmap_items_skill_skill_id_foreign";`);

    this.addSql(`alter table "be_cv_skills" drop constraint "be_cv_skills_skill_skill_id_foreign";`);

    this.addSql(`alter table "roadmap_items" drop constraint "roadmap_items_roadmap_roadmap_id_foreign";`);

    this.addSql(`alter table "job_matches" drop constraint "job_matches_cv_cv_id_foreign";`);

    this.addSql(`alter table "be_cv_skills" drop constraint "be_cv_skills_cv_cv_id_foreign";`);

    this.addSql(`alter table "cv_sections" drop constraint "cv_sections_cv_cv_id_foreign";`);

    this.addSql(`alter table "analysis_requests" drop constraint "analysis_requests_cv_cv_id_foreign";`);

    this.addSql(`alter table "analysis_results" drop constraint "analysis_results_request_request_id_foreign";`);

    this.addSql(`drop table if exists "companies" cascade;`);

    this.addSql(`drop table if exists "jobs" cascade;`);

    this.addSql(`drop table if exists "learning_resources" cascade;`);

    this.addSql(`drop table if exists "rag_documents" cascade;`);

    this.addSql(`drop table if exists "rag_chunks" cascade;`);

    this.addSql(`drop table if exists "skills" cascade;`);

    this.addSql(`drop table if exists "job_skills" cascade;`);

    this.addSql(`drop table if exists "job_requirements" cascade;`);

    this.addSql(`drop table if exists "search_profiles" cascade;`);

    this.addSql(`drop table if exists "roadmaps" cascade;`);

    this.addSql(`drop table if exists "roadmap_items" cascade;`);

    this.addSql(`drop table if exists "cv_documents" cascade;`);

    this.addSql(`drop table if exists "job_matches" cascade;`);

    this.addSql(`drop table if exists "be_cv_skills" cascade;`);

    this.addSql(`drop table if exists "cv_sections" cascade;`);

    this.addSql(`drop table if exists "analysis_requests" cascade;`);

    this.addSql(`drop table if exists "analysis_results" cascade;`);

    this.addSql(`alter table "users" drop column "role";`);

    this.addSql(`drop type "job_level";`);
    this.addSql(`drop type "currency";`);
    this.addSql(`drop type "job_status";`);
    this.addSql(`drop type "rag_document_type";`);
    this.addSql(`drop type "requirement_type";`);
    this.addSql(`drop type "roadmap_status";`);
    this.addSql(`drop type "cv_section_type";`);
    this.addSql(`drop type "analysis_status";`);
  }

}
