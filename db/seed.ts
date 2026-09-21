import bcrypt from "bcryptjs"
import { eq } from "drizzle-orm"
import { db } from "./index"
import {
  bookings,
  menuItems,
  roomServiceOrderItems,
  roomServiceOrders,
  rooms,
  users,
} from "./schema"

// These accounts and records are development/demo data only.
const DEMO_PASSWORD = "RoomifyDemo123!"
const now = new Date()

const userIds = {
  admin: "00000000-0000-4000-8000-000000000001",
  frontDesk: "00000000-0000-4000-8000-000000000002",
  roomService: "00000000-0000-4000-8000-000000000003",
  ama: "00000000-0000-4000-8000-000000000101",
  kwame: "00000000-0000-4000-8000-000000000102",
  akosua: "00000000-0000-4000-8000-000000000103",
  daniel: "00000000-0000-4000-8000-000000000104",
  sarah: "00000000-0000-4000-8000-000000000105",
} as const

const roomIds = Object.fromEntries(
  [
    101, 102, 103, 104, 105, 201, 202, 203, 204, 205, 301, 302, 303, 304, 305,
  ].map((roomNumber, index) => [
    String(roomNumber),
    `10000000-0000-4000-8000-${String(index + 1).padStart(12, "0")}`,
  ])
) as Record<string, string>

const bookingIds = {
  amaCurrent: "20000000-0000-4000-8000-000000000001",
  kwameCurrent: "20000000-0000-4000-8000-000000000002",
  amaUpcoming: "20000000-0000-4000-8000-000000000003",
  akosuaUpcoming: "20000000-0000-4000-8000-000000000004",
  danielUpcoming: "20000000-0000-4000-8000-000000000005",
  sarahCompleted: "20000000-0000-4000-8000-000000000006",
  kwameCompleted: "20000000-0000-4000-8000-000000000007",
  akosuaCancelled: "20000000-0000-4000-8000-000000000008",
  danielCompleted: "20000000-0000-4000-8000-000000000009",
} as const

const orderIds = {
  amaPending: "30000000-0000-4000-8000-000000000001",
  kwameInProgress: "30000000-0000-4000-8000-000000000002",
  sarahCompleted: "30000000-0000-4000-8000-000000000003",
} as const

const menuIds = {
  continentalBreakfast: "40000000-0000-4000-8000-000000000001",
  pancakeBreakfast: "40000000-0000-4000-8000-000000000002",
  omeletteToast: "40000000-0000-4000-8000-000000000003",
  grilledChicken: "40000000-0000-4000-8000-000000000004",
  clubSandwich: "40000000-0000-4000-8000-000000000005",
  beefBurger: "40000000-0000-4000-8000-000000000006",
  pastaPrimavera: "40000000-0000-4000-8000-000000000007",
  bottledWater: "40000000-0000-4000-8000-000000000008",
  orangeJuice: "40000000-0000-4000-8000-000000000009",
  coffee: "40000000-0000-4000-8000-000000000010",
  softDrink: "40000000-0000-4000-8000-000000000011",
  fruitPlatter: "40000000-0000-4000-8000-000000000012",
  chocolateCake: "40000000-0000-4000-8000-000000000013",
  mixedNuts: "40000000-0000-4000-8000-000000000014",
  extraTowels: "40000000-0000-4000-8000-000000000015",
  dentalKit: "40000000-0000-4000-8000-000000000016",
  hotelSlippers: "40000000-0000-4000-8000-000000000017",
  welcomeFlowers: "40000000-0000-4000-8000-000000000018",
} as const

function dateFromNow(days: number, hour = 15) {
  const date = new Date(now)
  date.setDate(date.getDate() + days)
  date.setHours(hour, 0, 0, 0)
  return date
}

async function seed() {
  if (!process.env.DATABASE_URL) {
    throw new Error("Database connection is not configured.")
  }

  console.log("🌱 Seeding Roomify development database...")
  const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 12)

  await db
    .insert(users)
    .values([
      {
        id: userIds.admin,
        name: "Roomify Administrator",
        email: "admin@roomify.test",
        passwordHash,
        role: "ADMIN",
      },
      {
        id: userIds.frontDesk,
        name: "Front Desk Staff",
        email: "frontdesk@roomify.test",
        passwordHash,
        role: "STAFF",
      },
      {
        id: userIds.roomService,
        name: "Room Service Staff",
        email: "roomservice@roomify.test",
        passwordHash,
        role: "STAFF",
      },
      {
        id: userIds.ama,
        name: "Ama Mensah",
        email: "ama@roomify.test",
        passwordHash,
        role: "GUEST",
      },
      {
        id: userIds.kwame,
        name: "Kwame Asante",
        email: "kwame@roomify.test",
        passwordHash,
        role: "GUEST",
      },
      {
        id: userIds.akosua,
        name: "Akosua Owusu",
        email: "akosua@roomify.test",
        passwordHash,
        role: "GUEST",
      },
      {
        id: userIds.daniel,
        name: "Daniel Boateng",
        email: "daniel@roomify.test",
        passwordHash,
        role: "GUEST",
      },
      {
        id: userIds.sarah,
        name: "Sarah Addo",
        email: "sarah@roomify.test",
        passwordHash,
        role: "GUEST",
      },
    ])
    .onConflictDoUpdate({
      target: users.email,
      set: { passwordHash, updatedAt: now },
    })
  console.log("✓ 8 users seeded")

  const roomDefinitions = [
    [
      101,
      "STANDARD_KING",
      "OCCUPIED",
      "Quiet king room with warm oak accents and a reading nook.",
      2,
      "120.00",
    ],
    [
      102,
      "STANDARD_KING",
      "AVAILABLE",
      "Light-filled king room overlooking the inner courtyard.",
      2,
      "120.00",
    ],
    [
      103,
      "STANDARD_KING",
      "AVAILABLE",
      "Comfortable king room with a rainfall shower and writing desk.",
      2,
      "120.00",
    ],
    [
      104,
      "STANDARD_KING",
      "AVAILABLE",
      "Calm, spacious king room with natural linen finishes.",
      2,
      "120.00",
    ],
    [
      105,
      "STANDARD_KING",
      "AVAILABLE",
      "Accessible king room with generous circulation space.",
      2,
      "120.00",
    ],
    [
      201,
      "DELUXE_DOUBLE",
      "OCCUPIED",
      "Deluxe double room with a lounge chair and city-facing windows.",
      2,
      "160.00",
    ],
    [
      202,
      "DELUXE_DOUBLE",
      "AVAILABLE",
      "Relaxed double room with two beds and a generous wardrobe.",
      4,
      "160.00",
    ],
    [
      203,
      "DELUXE_DOUBLE",
      "AVAILABLE",
      "Refined double room with soft blue textiles and a desk.",
      4,
      "160.00",
    ],
    [
      204,
      "DELUXE_DOUBLE",
      "AVAILABLE",
      "Bright double room with a small breakfast table.",
      4,
      "160.00",
    ],
    [
      205,
      "DELUXE_DOUBLE",
      "AVAILABLE",
      "Quiet double room close to the garden terrace.",
      4,
      "160.00",
    ],
    [
      301,
      "EXECUTIVE_SUITE",
      "NEEDS_CLEANING",
      "Executive suite with a separate sitting room and soaking tub.",
      2,
      "250.00",
    ],
    [
      302,
      "EXECUTIVE_SUITE",
      "AVAILABLE",
      "Corner executive suite with a deep sofa and garden views.",
      2,
      "250.00",
    ],
    [
      303,
      "EXECUTIVE_SUITE",
      "AVAILABLE",
      "Polished executive suite with a private work area.",
      2,
      "250.00",
    ],
    [
      304,
      "FAMILY_SUITE",
      "AVAILABLE",
      "Flexible family suite with a king bed and twin sleeping area.",
      4,
      "220.00",
    ],
    [
      305,
      "FAMILY_SUITE",
      "AVAILABLE",
      "Spacious family suite with a dining nook and two bathrooms.",
      4,
      "220.00",
    ],
  ] as const

  await db
    .insert(rooms)
    .values(
      roomDefinitions.map(
        ([roomNumber, type, status, description, capacity, baseRate]) => ({
          id: roomIds[String(roomNumber)],
          roomNumber: String(roomNumber),
          type,
          status,
          description,
          capacity,
          baseRate,
          imageUrl: null,
          updatedAt: now,
        })
      )
    )
    .onConflictDoNothing({ target: rooms.roomNumber })
  // The explicit per-room update keeps the upsert readable while avoiding a delete/reset strategy.
  for (const [
    roomNumber,
    type,
    status,
    description,
    capacity,
    baseRate,
  ] of roomDefinitions) {
    await db
      .update(rooms)
      .set({ type, status, description, capacity, baseRate, updatedAt: now })
      .where(eq(rooms.roomNumber, String(roomNumber)))
  }
  console.log("✓ 15 rooms seeded")

  const bookingDefinitions = [
    [bookingIds.amaCurrent, userIds.ama, 101, -1, 2, "CHECKED_IN", "360.00"],
    [
      bookingIds.kwameCurrent,
      userIds.kwame,
      201,
      -2,
      3,
      "CHECKED_IN",
      "800.00",
    ],
    [bookingIds.amaUpcoming, userIds.ama, 102, 5, 8, "CONFIRMED", "360.00"],
    [
      bookingIds.akosuaUpcoming,
      userIds.akosua,
      202,
      14,
      18,
      "CONFIRMED",
      "640.00",
    ],
    [
      bookingIds.danielUpcoming,
      userIds.daniel,
      302,
      7,
      10,
      "PENDING",
      "750.00",
    ],
    [
      bookingIds.sarahCompleted,
      userIds.sarah,
      301,
      -10,
      -7,
      "COMPLETED",
      "750.00",
    ],
    [
      bookingIds.kwameCompleted,
      userIds.kwame,
      203,
      -20,
      -16,
      "COMPLETED",
      "640.00",
    ],
    [
      bookingIds.akosuaCancelled,
      userIds.akosua,
      303,
      21,
      25,
      "CANCELLED",
      "1000.00",
    ],
    [
      bookingIds.danielCompleted,
      userIds.daniel,
      304,
      -30,
      -26,
      "COMPLETED",
      "880.00",
    ],
  ] as const

  await db
    .insert(bookings)
    .values(
      bookingDefinitions.map(
        ([
          id,
          guestId,
          roomNumber,
          checkInOffset,
          checkOutOffset,
          status,
          totalAmount,
        ]) => ({
          id,
          guestId,
          roomId: roomIds[String(roomNumber)],
          checkIn: dateFromNow(checkInOffset, 15),
          checkOut: dateFromNow(checkOutOffset, 11),
          status,
          totalAmount,
          updatedAt: now,
        })
      )
    )
    .onConflictDoNothing({ target: bookings.id })
  for (const [
    id,
    guestId,
    roomNumber,
    checkInOffset,
    checkOutOffset,
    status,
    totalAmount,
  ] of bookingDefinitions) {
    await db
      .update(bookings)
      .set({
        guestId,
        roomId: roomIds[String(roomNumber)],
        checkIn: dateFromNow(checkInOffset, 15),
        checkOut: dateFromNow(checkOutOffset, 11),
        status,
        totalAmount,
        updatedAt: now,
      })
      .where(eq(bookings.id, id))
  }
  console.log("✓ 9 bookings seeded")

  const menuDefinitions = [
    [
      menuIds.continentalBreakfast,
      "Continental Breakfast",
      "Pastries, fruit, yogurt, and coffee.",
      "BREAKFAST",
      "18.00",
      true,
    ],
    [
      menuIds.pancakeBreakfast,
      "Pancake Breakfast",
      "Buttermilk pancakes with berries and maple syrup.",
      "BREAKFAST",
      "16.00",
      true,
    ],
    [
      menuIds.omeletteToast,
      "Omelette & Toast",
      "Three-egg omelette with herbs, toast, and seasonal greens.",
      "BREAKFAST",
      "19.00",
      true,
    ],
    [
      menuIds.grilledChicken,
      "Grilled Chicken & Rice",
      "Herb-marinated chicken with jasmine rice and vegetables.",
      "MAIN_MEALS",
      "22.00",
      true,
    ],
    [
      menuIds.clubSandwich,
      "Club Sandwich",
      "Roasted chicken, crisp lettuce, tomato, and fries.",
      "MAIN_MEALS",
      "14.50",
      true,
    ],
    [
      menuIds.beefBurger,
      "Beef Burger",
      "Charred beef patty, cheddar, house pickles, and fries.",
      "MAIN_MEALS",
      "18.00",
      true,
    ],
    [
      menuIds.pastaPrimavera,
      "Pasta Primavera",
      "Seasonal vegetables, parmesan, and basil cream sauce.",
      "MAIN_MEALS",
      "17.00",
      true,
    ],
    [
      menuIds.bottledWater,
      "Bottled Water",
      "Still mineral water.",
      "DRINKS",
      "3.00",
      true,
    ],
    [
      menuIds.orangeJuice,
      "Orange Juice",
      "Freshly pressed orange juice.",
      "DRINKS",
      "5.00",
      true,
    ],
    [
      menuIds.coffee,
      "Coffee",
      "Freshly brewed house coffee.",
      "DRINKS",
      "4.00",
      true,
    ],
    [
      menuIds.softDrink,
      "Soft Drink",
      "Chilled sparkling soft drink.",
      "DRINKS",
      "4.00",
      true,
    ],
    [
      menuIds.fruitPlatter,
      "Fruit Platter",
      "Sliced seasonal fruit for sharing.",
      "SNACKS",
      "12.00",
      true,
    ],
    [
      menuIds.chocolateCake,
      "Chocolate Cake",
      "Warm chocolate cake with vanilla cream.",
      "SNACKS",
      "9.00",
      true,
    ],
    [
      menuIds.mixedNuts,
      "Mixed Nuts",
      "Roasted almonds, cashews, and pecans.",
      "SNACKS",
      "7.00",
      true,
    ],
    [
      menuIds.extraTowels,
      "Extra Towels",
      "A fresh set of bath and hand towels.",
      "AMENITIES",
      "8.00",
      true,
    ],
    [
      menuIds.dentalKit,
      "Dental Kit",
      "Toothbrush, toothpaste, and floss.",
      "AMENITIES",
      "6.00",
      true,
    ],
    [
      menuIds.hotelSlippers,
      "Hotel Slippers",
      "Soft cotton slippers for your room.",
      "AMENITIES",
      "10.00",
      true,
    ],
    [
      menuIds.welcomeFlowers,
      "Welcome Flowers",
      "Seasonal flowers arranged in a small vase.",
      "AMENITIES",
      "24.00",
      false,
    ],
  ] as const

  await db
    .insert(menuItems)
    .values(
      menuDefinitions.map(
        ([id, name, description, category, price, isAvailable]) => ({
          id,
          name,
          description,
          category,
          price,
          isAvailable,
          imageUrl: null,
          updatedAt: now,
        })
      )
    )
    .onConflictDoNothing({ target: menuItems.id })
  for (const [
    id,
    name,
    description,
    category,
    price,
    isAvailable,
  ] of menuDefinitions) {
    await db
      .update(menuItems)
      .set({ name, description, category, price, isAvailable, updatedAt: now })
      .where(eq(menuItems.id, id))
  }
  console.log("✓ 18 menu items seeded")

  const orderDefinitions = [
    [orderIds.amaPending, bookingIds.amaCurrent, "PENDING", "32.50"],
    [orderIds.kwameInProgress, bookingIds.kwameCurrent, "IN_PROGRESS", "26.00"],
    [orderIds.sarahCompleted, bookingIds.sarahCompleted, "COMPLETED", "22.00"],
  ] as const
  await db
    .insert(roomServiceOrders)
    .values(
      orderDefinitions.map(([id, bookingId, status, totalAmount]) => ({
        id,
        bookingId,
        status,
        totalAmount,
        updatedAt: now,
      }))
    )
    .onConflictDoNothing({ target: roomServiceOrders.id })
  for (const [id, bookingId, status, totalAmount] of orderDefinitions) {
    await db
      .update(roomServiceOrders)
      .set({ bookingId, status, totalAmount, updatedAt: now })
      .where(eq(roomServiceOrders.id, id))
  }
  console.log("✓ 3 room-service orders seeded")

  const orderItemDefinitions = [
    [
      "50000000-0000-4000-8000-000000000001",
      orderIds.amaPending,
      menuIds.clubSandwich,
      1,
      "14.50",
    ],
    [
      "50000000-0000-4000-8000-000000000002",
      orderIds.amaPending,
      menuIds.orangeJuice,
      2,
      "5.00",
    ],
    [
      "50000000-0000-4000-8000-000000000003",
      orderIds.amaPending,
      menuIds.extraTowels,
      1,
      "8.00",
    ],
    [
      "50000000-0000-4000-8000-000000000004",
      orderIds.kwameInProgress,
      menuIds.grilledChicken,
      1,
      "22.00",
    ],
    [
      "50000000-0000-4000-8000-000000000005",
      orderIds.kwameInProgress,
      menuIds.coffee,
      1,
      "4.00",
    ],
    [
      "50000000-0000-4000-8000-000000000006",
      orderIds.sarahCompleted,
      menuIds.continentalBreakfast,
      1,
      "18.00",
    ],
    [
      "50000000-0000-4000-8000-000000000007",
      orderIds.sarahCompleted,
      menuIds.coffee,
      1,
      "4.00",
    ],
  ] as const
  await db
    .insert(roomServiceOrderItems)
    .values(
      orderItemDefinitions.map(
        ([id, orderId, menuItemId, quantity, unitPrice]) => ({
          id,
          orderId,
          menuItemId,
          quantity,
          unitPrice,
        })
      )
    )
    .onConflictDoNothing({ target: roomServiceOrderItems.id })
  for (const [
    id,
    orderId,
    menuItemId,
    quantity,
    unitPrice,
  ] of orderItemDefinitions) {
    await db
      .update(roomServiceOrderItems)
      .set({ orderId, menuItemId, quantity, unitPrice })
      .where(eq(roomServiceOrderItems.id, id))
  }
  console.log("✓ 7 order items seeded")
  console.log("✅ Roomify development database seeded successfully.")
}

seed().catch((error: unknown) => {
  console.error("❌ Roomify seed failed.")
  console.error(
    error instanceof Error ? error.message : "Unknown database error."
  )
  process.exitCode = 1
})
