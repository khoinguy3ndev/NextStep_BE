import { Migration } from "@mikro-orm/migrations";

export class Migration20260314003000 extends Migration {
  override async up(): Promise<void> {
    this.addSql(
      `create table if not exists "cvs" ("cv_id" serial primary key, "user_user_id" int not null, "file_name" varchar(255) not null, "file_key" text not null, "file_url" text not null, "uploaded_at" timestamptz not null);`,
    );
    this.addSql(
      `do $$ begin if not exists (select 1 from pg_constraint where conname = 'cvs_file_key_unique') then alter table "cvs" add constraint "cvs_file_key_unique" unique ("file_key"); end if; end $$;`,
    );
    this.addSql(
      `create index if not exists "cvs_user_user_id_index" on "cvs" ("user_user_id");`,
    );
    this.addSql(
      `do $$ begin if not exists (select 1 from pg_constraint where conname = 'cvs_user_user_id_foreign') then alter table "cvs" add constraint "cvs_user_user_id_foreign" foreign key ("user_user_id") references "users" ("user_id") on update cascade; end if; end $$;`,
    );
  }

  override async down(): Promise<void> {
    this.addSql(
      `alter table "cvs" drop constraint "cvs_user_user_id_foreign";`,
    );
    this.addSql(`drop table if exists "cvs" cascade;`);
  }
}
