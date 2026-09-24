import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_benutzer_rollen" AS ENUM('inhaber', 'mitarbeiter');
  CREATE TABLE "benutzer_rollen" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_benutzer_rollen",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "benutzer_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "benutzer" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"reset_password_requested_at" timestamp(3) with time zone,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE "medien" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"alt" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric,
  	"sizes_klein_url" varchar,
  	"sizes_klein_width" numeric,
  	"sizes_klein_height" numeric,
  	"sizes_klein_mime_type" varchar,
  	"sizes_klein_filesize" numeric,
  	"sizes_klein_filename" varchar,
  	"sizes_mittel_url" varchar,
  	"sizes_mittel_width" numeric,
  	"sizes_mittel_height" numeric,
  	"sizes_mittel_mime_type" varchar,
  	"sizes_mittel_filesize" numeric,
  	"sizes_mittel_filename" varchar,
  	"sizes_gross_url" varchar,
  	"sizes_gross_width" numeric,
  	"sizes_gross_height" numeric,
  	"sizes_gross_mime_type" varchar,
  	"sizes_gross_filesize" numeric,
  	"sizes_gross_filename" varchar
  );
  
  CREATE TABLE "payload_kv" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"data" jsonb NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"benutzer_id" integer,
  	"medien_id" integer
  );
  
  CREATE TABLE "payload_preferences" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"benutzer_id" integer
  );
  
  CREATE TABLE "payload_migrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "benutzer_rollen" ADD CONSTRAINT "benutzer_rollen_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."benutzer"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "benutzer_sessions" ADD CONSTRAINT "benutzer_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."benutzer"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_benutzer_fk" FOREIGN KEY ("benutzer_id") REFERENCES "public"."benutzer"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_medien_fk" FOREIGN KEY ("medien_id") REFERENCES "public"."medien"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_benutzer_fk" FOREIGN KEY ("benutzer_id") REFERENCES "public"."benutzer"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "benutzer_rollen_order_idx" ON "benutzer_rollen" USING btree ("order");
  CREATE INDEX "benutzer_rollen_parent_idx" ON "benutzer_rollen" USING btree ("parent_id");
  CREATE INDEX "benutzer_sessions_order_idx" ON "benutzer_sessions" USING btree ("_order");
  CREATE INDEX "benutzer_sessions_parent_id_idx" ON "benutzer_sessions" USING btree ("_parent_id");
  CREATE INDEX "benutzer_updated_at_idx" ON "benutzer" USING btree ("updated_at");
  CREATE INDEX "benutzer_created_at_idx" ON "benutzer" USING btree ("created_at");
  CREATE UNIQUE INDEX "benutzer_email_idx" ON "benutzer" USING btree ("email");
  CREATE INDEX "medien_updated_at_idx" ON "medien" USING btree ("updated_at");
  CREATE INDEX "medien_created_at_idx" ON "medien" USING btree ("created_at");
  CREATE UNIQUE INDEX "medien_filename_idx" ON "medien" USING btree ("filename");
  CREATE INDEX "medien_sizes_klein_sizes_klein_filename_idx" ON "medien" USING btree ("sizes_klein_filename");
  CREATE INDEX "medien_sizes_mittel_sizes_mittel_filename_idx" ON "medien" USING btree ("sizes_mittel_filename");
  CREATE INDEX "medien_sizes_gross_sizes_gross_filename_idx" ON "medien" USING btree ("sizes_gross_filename");
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "payload_kv" USING btree ("key");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_benutzer_id_idx" ON "payload_locked_documents_rels" USING btree ("benutzer_id");
  CREATE INDEX "payload_locked_documents_rels_medien_id_idx" ON "payload_locked_documents_rels" USING btree ("medien_id");
  CREATE INDEX "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_benutzer_id_idx" ON "payload_preferences_rels" USING btree ("benutzer_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "benutzer_rollen" CASCADE;
  DROP TABLE "benutzer_sessions" CASCADE;
  DROP TABLE "benutzer" CASCADE;
  DROP TABLE "medien" CASCADE;
  DROP TABLE "payload_kv" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TYPE "public"."enum_benutzer_rollen";`)
}
