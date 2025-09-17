import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

const schema = defineSchema({
  products: defineTable({
    name: v.string(),
    description: v.string(),
    price: v.number(),
    stock: v.number(),
    category: v.string(),
    image: v.optional(v.string()),
  }),
  transactions: defineTable({
    productIds: v.array(v.id("products")),
    quantities: v.array(v.number()),
    totalAmount: v.number(),
    paymentMethod: v.string(),
    cashierId: v.string(),
    date: v.number(),
    customerId: v.optional(v.id("customers")),
  }),
  customers: defineTable({
    name: v.string(),
    contact: v.string(),
    purchaseHistory: v.optional(v.array(v.id("transactions"))),
  }),
});

export default schema;
