import {
  check,
  decimal,
  boolean,
  index,
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core"
import { relations, sql } from "drizzle-orm"
import { ROOM_TYPES } from "@/lib/room-types"

const timestamps = {
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
}

export const userRoleEnum = pgEnum("user_role", ["GUEST", "STAFF", "ADMIN"])
export type UserRole = (typeof userRoleEnum.enumValues)[number]
export const roomTypeEnum = pgEnum("room_type", ROOM_TYPES)
export const roomStatusEnum = pgEnum("room_status", [
  "AVAILABLE",
  "OCCUPIED",
  "NEEDS_CLEANING",
])
export const bookingStatusEnum = pgEnum("booking_status", [
  "PENDING",
  "CONFIRMED",
  "CHECKED_IN",
  "COMPLETED",
  "CANCELLED",
])
export const menuCategoryEnum = pgEnum("menu_category", [
  "BREAKFAST",
  "MAIN_MEALS",
  "DRINKS",
  "SNACKS",
  "AMENITIES",
])
export const orderStatusEnum = pgEnum("room_service_order_status", [
  "PENDING",
  "IN_PROGRESS",
  "COMPLETED",
  "CANCELLED",
])

export const users = pgTable(
  "users",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    name: text("name").notNull(),
    email: text("email").notNull(),
    passwordHash: text("password_hash").notNull(),
    role: userRoleEnum("role").notNull().default("GUEST"),
    ...timestamps,
  },
  (table) => [uniqueIndex("users_email_unique").on(table.email)]
)

export const rooms = pgTable(
  "rooms",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    roomNumber: text("room_number").notNull(),
    type: roomTypeEnum("type").notNull(),
    description: text("description").notNull(),
    capacity: integer("capacity").notNull(),
    baseRate: decimal("base_rate", { precision: 10, scale: 2 }).notNull(),
    status: roomStatusEnum("status").notNull().default("AVAILABLE"),
    imageUrl: text("image_url"),
    ...timestamps,
  },
  (table) => [
    uniqueIndex("rooms_room_number_unique").on(table.roomNumber),
    check("rooms_capacity_positive", sql`${table.capacity} > 0`),
    check("rooms_base_rate_nonnegative", sql`${table.baseRate} >= 0`),
  ]
)

export const bookings = pgTable(
  "bookings",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    guestId: uuid("guest_id")
      .notNull()
      .references(() => users.id),
    roomId: uuid("room_id")
      .notNull()
      .references(() => rooms.id),
    checkIn: timestamp("check_in", { withTimezone: true }).notNull(),
    checkOut: timestamp("check_out", { withTimezone: true }).notNull(),
    status: bookingStatusEnum("status").notNull().default("PENDING"),
    totalAmount: decimal("total_amount", { precision: 10, scale: 2 }).notNull(),
    ...timestamps,
  },
  (table) => [
    index("bookings_guest_id_idx").on(table.guestId),
    index("bookings_room_id_idx").on(table.roomId),
    index("bookings_room_dates_status_idx").on(
      table.roomId,
      table.checkIn,
      table.checkOut,
      table.status
    ),
    check(
      "bookings_checkout_after_checkin",
      sql`${table.checkOut} > ${table.checkIn}`
    ),
    check("bookings_total_nonnegative", sql`${table.totalAmount} >= 0`),
  ]
)

export const menuItems = pgTable(
  "menu_items",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    name: text("name").notNull(),
    description: text("description").notNull(),
    category: menuCategoryEnum("category").notNull(),
    price: decimal("price", { precision: 10, scale: 2 }).notNull(),
    isAvailable: boolean("is_available").notNull().default(true),
    imageUrl: text("image_url"),
    ...timestamps,
  },
  (table) => [
    index("menu_items_category_idx").on(table.category),
    check("menu_items_price_nonnegative", sql`${table.price} >= 0`),
  ]
)

export const roomServiceOrders = pgTable(
  "room_service_orders",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    bookingId: uuid("booking_id")
      .notNull()
      .references(() => bookings.id),
    status: orderStatusEnum("status").notNull().default("PENDING"),
    totalAmount: decimal("total_amount", { precision: 10, scale: 2 })
      .notNull()
      .default("0"),
    ...timestamps,
  },
  (table) => [
    index("room_service_orders_booking_id_idx").on(table.bookingId),
    index("room_service_orders_status_idx").on(table.status),
    check(
      "room_service_orders_total_nonnegative",
      sql`${table.totalAmount} >= 0`
    ),
  ]
)

export const roomServiceOrderItems = pgTable(
  "room_service_order_items",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    orderId: uuid("order_id")
      .notNull()
      .references(() => roomServiceOrders.id),
    menuItemId: uuid("menu_item_id")
      .notNull()
      .references(() => menuItems.id),
    quantity: integer("quantity").notNull(),
    unitPrice: decimal("unit_price", { precision: 10, scale: 2 }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("room_service_order_items_order_id_idx").on(table.orderId),
    index("room_service_order_items_menu_item_id_idx").on(table.menuItemId),
    check(
      "room_service_order_items_quantity_positive",
      sql`${table.quantity} > 0`
    ),
    check(
      "room_service_order_items_unit_price_nonnegative",
      sql`${table.unitPrice} >= 0`
    ),
  ]
)

export const userRelations = relations(users, ({ many }) => ({
  bookings: many(bookings),
}))
export const roomRelations = relations(rooms, ({ many }) => ({
  bookings: many(bookings),
}))
export const bookingRelations = relations(bookings, ({ one, many }) => ({
  guest: one(users, { fields: [bookings.guestId], references: [users.id] }),
  room: one(rooms, { fields: [bookings.roomId], references: [rooms.id] }),
  roomServiceOrders: many(roomServiceOrders),
}))
export const menuItemRelations = relations(menuItems, ({ many }) => ({
  orderItems: many(roomServiceOrderItems),
}))
export const roomServiceOrderRelations = relations(
  roomServiceOrders,
  ({ one, many }) => ({
    booking: one(bookings, {
      fields: [roomServiceOrders.bookingId],
      references: [bookings.id],
    }),
    items: many(roomServiceOrderItems),
  })
)
export const roomServiceOrderItemRelations = relations(
  roomServiceOrderItems,
  ({ one }) => ({
    order: one(roomServiceOrders, {
      fields: [roomServiceOrderItems.orderId],
      references: [roomServiceOrders.id],
    }),
    menuItem: one(menuItems, {
      fields: [roomServiceOrderItems.menuItemId],
      references: [menuItems.id],
    }),
  })
)
