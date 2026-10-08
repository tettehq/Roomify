-- Custom SQL migration file, put your code below! --

CREATE EXTENSION IF NOT EXISTS btree_gist;

SELECT a.id, b.id, a.room_id, a.check_in, a.check_out, b.check_in, b.check_out
FROM bookings a
JOIN bookings b ON a.room_id = b.room_id AND a.id < b.id
WHERE a.status IN ('PENDING', 'CONFIRMED', 'CHECKED_IN')
  AND b.status IN ('PENDING', 'CONFIRMED', 'CHECKED_IN')
  AND daterange(a.check_in, a.check_out) && daterange(b.check_in, b.check_out);

ALTER TABLE "bookings" ADD CONSTRAINT "bookings_no_overlap"
  EXCLUDE USING gist (
    "room_id" WITH =,
    daterange("check_in", "check_out") WITH &&
  ) WHERE ("status" IN ('PENDING', 'CONFIRMED', 'CHECKED_IN'));