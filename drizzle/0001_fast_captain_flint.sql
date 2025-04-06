ALTER TABLE "admins" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "admins" ALTER COLUMN "admin_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "roles" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();