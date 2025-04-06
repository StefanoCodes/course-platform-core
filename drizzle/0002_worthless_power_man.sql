CREATE INDEX "email_index" ON "admins" USING btree ("email");--> statement-breakpoint
CREATE INDEX "admin_admin_id_index" ON "admins" USING btree ("admin_id");--> statement-breakpoint
CREATE INDEX "role_admin_id_index" ON "roles" USING btree ("admin_id");