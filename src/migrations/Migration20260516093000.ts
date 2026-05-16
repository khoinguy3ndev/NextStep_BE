import { Migration } from "@mikro-orm/migrations";

export class Migration20260516093000 extends Migration {
  override async up(): Promise<void> {
    this.addSql('alter table "users" add column "current_role" varchar(255) null;');
    this.addSql('alter table "users" add column "location" varchar(255) null;');
    this.addSql('alter table "users" add column "experience_years" real null;');
    this.addSql('alter table "users" add column "target_salary_min" real null;');
    this.addSql('alter table "users" add column "target_salary_max" real null;');
    this.addSql('alter table "users" add column "phone" varchar(255) null;');
    this.addSql('alter table "users" add column "github_url" varchar(255) null;');
    this.addSql('alter table "users" add column "linkedin_url" varchar(255) null;');
    this.addSql('alter table "users" add column "portfolio_url" varchar(255) null;');
    this.addSql('alter table "users" add column "skills" text[] null;');
    this.addSql(
      'alter table "users" add column "suggested_improvements" jsonb null;',
    );
    this.addSql('alter table "users" add column "experiences" jsonb null;');
    this.addSql('alter table "users" add column "career_goals" jsonb null;');
  }

  override async down(): Promise<void> {
    this.addSql('alter table "users" drop column "career_goals";');
    this.addSql('alter table "users" drop column "experiences";');
    this.addSql('alter table "users" drop column "suggested_improvements";');
    this.addSql('alter table "users" drop column "skills";');
    this.addSql('alter table "users" drop column "portfolio_url";');
    this.addSql('alter table "users" drop column "linkedin_url";');
    this.addSql('alter table "users" drop column "github_url";');
    this.addSql('alter table "users" drop column "phone";');
    this.addSql('alter table "users" drop column "target_salary_max";');
    this.addSql('alter table "users" drop column "target_salary_min";');
    this.addSql('alter table "users" drop column "experience_years";');
    this.addSql('alter table "users" drop column "location";');
    this.addSql('alter table "users" drop column "current_role";');
  }
}
