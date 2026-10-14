CREATE EXTENSION IF NOT EXISTS btree_gist;
--> statement-breakpoint
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_no_overlap"
  EXCLUDE USING gist (
    "room_id" WITH =,
    daterange(
      ("check_in" AT TIME ZONE 'UTC')::date,
      ("check_out" AT TIME ZONE 'UTC')::date,
      '[)'
    ) WITH &&
  ) WHERE ("status" IN ('PENDING', 'CONFIRMED', 'CHECKED_IN'));
