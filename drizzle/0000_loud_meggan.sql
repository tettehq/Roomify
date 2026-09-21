CREATE TYPE "public"."booking_status" AS ENUM('PENDING', 'CONFIRMED', 'CHECKED_IN', 'COMPLETED', 'CANCELLED');--> statement-breakpoint
CREATE TYPE "public"."menu_category" AS ENUM('BREAKFAST', 'MAIN_MEALS', 'DRINKS', 'SNACKS', 'AMENITIES');--> statement-breakpoint
CREATE TYPE "public"."room_service_order_status" AS ENUM('PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED');--> statement-breakpoint
CREATE TYPE "public"."room_status" AS ENUM('AVAILABLE', 'OCCUPIED', 'NEEDS_CLEANING');--> statement-breakpoint
CREATE TYPE "public"."room_type" AS ENUM('STANDARD_KING', 'DELUXE_DOUBLE', 'EXECUTIVE_SUITE', 'FAMILY_SUITE');--> statement-breakpoint
CREATE TYPE "public"."user_role" AS ENUM('GUEST', 'STAFF', 'ADMIN');--> statement-breakpoint
CREATE TABLE "bookings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"guest_id" uuid NOT NULL,
	"room_id" uuid NOT NULL,
	"check_in" timestamp with time zone NOT NULL,
	"check_out" timestamp with time zone NOT NULL,
	"status" "booking_status" DEFAULT 'PENDING' NOT NULL,
	"total_amount" numeric(10, 2) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "bookings_checkout_after_checkin" CHECK ("bookings"."check_out" > "bookings"."check_in"),
	CONSTRAINT "bookings_total_nonnegative" CHECK ("bookings"."total_amount" >= 0)
);
--> statement-breakpoint
CREATE TABLE "menu_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"description" text NOT NULL,
	"category" "menu_category" NOT NULL,
	"price" numeric(10, 2) NOT NULL,
	"is_available" boolean DEFAULT true NOT NULL,
	"image_url" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "menu_items_price_nonnegative" CHECK ("menu_items"."price" >= 0)
);
--> statement-breakpoint
CREATE TABLE "room_service_order_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"order_id" uuid NOT NULL,
	"menu_item_id" uuid NOT NULL,
	"quantity" integer NOT NULL,
	"unit_price" numeric(10, 2) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "room_service_order_items_quantity_positive" CHECK ("room_service_order_items"."quantity" > 0),
	CONSTRAINT "room_service_order_items_unit_price_nonnegative" CHECK ("room_service_order_items"."unit_price" >= 0)
);
--> statement-breakpoint
CREATE TABLE "room_service_orders" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"booking_id" uuid NOT NULL,
	"status" "room_service_order_status" DEFAULT 'PENDING' NOT NULL,
	"total_amount" numeric(10, 2) DEFAULT '0' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "room_service_orders_total_nonnegative" CHECK ("room_service_orders"."total_amount" >= 0)
);
--> statement-breakpoint
CREATE TABLE "rooms" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"room_number" text NOT NULL,
	"type" "room_type" NOT NULL,
	"description" text NOT NULL,
	"capacity" integer NOT NULL,
	"base_rate" numeric(10, 2) NOT NULL,
	"status" "room_status" DEFAULT 'AVAILABLE' NOT NULL,
	"image_url" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "rooms_capacity_positive" CHECK ("rooms"."capacity" > 0),
	CONSTRAINT "rooms_base_rate_nonnegative" CHECK ("rooms"."base_rate" >= 0)
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"password_hash" text NOT NULL,
	"role" "user_role" DEFAULT 'GUEST' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_guest_id_users_id_fk" FOREIGN KEY ("guest_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_room_id_rooms_id_fk" FOREIGN KEY ("room_id") REFERENCES "public"."rooms"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "room_service_order_items" ADD CONSTRAINT "room_service_order_items_order_id_room_service_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."room_service_orders"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "room_service_order_items" ADD CONSTRAINT "room_service_order_items_menu_item_id_menu_items_id_fk" FOREIGN KEY ("menu_item_id") REFERENCES "public"."menu_items"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "room_service_orders" ADD CONSTRAINT "room_service_orders_booking_id_bookings_id_fk" FOREIGN KEY ("booking_id") REFERENCES "public"."bookings"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "bookings_guest_id_idx" ON "bookings" USING btree ("guest_id");--> statement-breakpoint
CREATE INDEX "bookings_room_id_idx" ON "bookings" USING btree ("room_id");--> statement-breakpoint
CREATE INDEX "bookings_room_dates_status_idx" ON "bookings" USING btree ("room_id","check_in","check_out","status");--> statement-breakpoint
CREATE INDEX "menu_items_category_idx" ON "menu_items" USING btree ("category");--> statement-breakpoint
CREATE INDEX "room_service_order_items_order_id_idx" ON "room_service_order_items" USING btree ("order_id");--> statement-breakpoint
CREATE INDEX "room_service_order_items_menu_item_id_idx" ON "room_service_order_items" USING btree ("menu_item_id");--> statement-breakpoint
CREATE INDEX "room_service_orders_booking_id_idx" ON "room_service_orders" USING btree ("booking_id");--> statement-breakpoint
CREATE INDEX "room_service_orders_status_idx" ON "room_service_orders" USING btree ("status");--> statement-breakpoint
CREATE UNIQUE INDEX "rooms_room_number_unique" ON "rooms" USING btree ("room_number");--> statement-breakpoint
CREATE UNIQUE INDEX "users_email_unique" ON "users" USING btree ("email");