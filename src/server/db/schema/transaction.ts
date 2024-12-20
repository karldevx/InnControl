import { pgTable, serial, integer, text, timestamp } from "drizzle-orm/pg-core";
import { users } from "./user";
import { guests } from "./guest";
import { rooms } from "./room";

export const transaction = pgTable("transaction", {
  transaction_id: serial("transaction_id").primaryKey(),
  guest_id: integer("guest_id")
    .notNull()
    .references(() => guests.guest_id),
  room_id: integer("room_id")
    .notNull()
    .references(() => rooms.room_id),
  userId: text("user_id")
    .notNull()
    .references(() => users.id),
  payment_method: text("payment_method", {
    enum: ["Cash", "Credit-card", "E-Cash"],
  }).notNull(),
  payment_amount: integer("payment_amount").notNull(),
  payment_date: timestamp("payment_date").notNull(),
  booking_type: text("booking_type", { enum: ["Online", "Walk-in"] }).notNull(),
  check_in: text("check_in").notNull(),
  check_out: text("check_out").notNull(),
  additional_services: text("additional_services", {
    enum: ["Breakfast"],
  }),
  no_of_nights: integer("no_of_nights").notNull(),
  outstanding_balance: integer("outstanding_balance"),
  discount: text("discount", { enum: ["pwd", "senior"] }),
  status: text("status", { enum : ["active","canceled","processed"] })
   .default("active").notNull(),
});

export type TransactionTable = typeof transaction;
