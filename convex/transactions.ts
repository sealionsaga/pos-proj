import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const addTransaction = mutation({
  args: {
    productIds: v.array(v.id("products")),
    quantities: v.array(v.number()),
    totalAmount: v.number(),
    paymentMethod: v.string(),
    cashierId: v.string(),
  },
  handler: async (ctx, args) => {
    const transactionId = await ctx.db.insert("transactions", {
      ...args,
      date: Date.now(),
    });
    return transactionId;
  },
});

export const getTransactions = query({
  args: {
    startDate: v.optional(v.number()),
    endDate: v.optional(v.number()),
    cashierId: v.optional(v.string()),
    paymentMethod: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let query = ctx.db.query("transactions");
    if (args.startDate) query = query.filter((q) => q.gte(q.field("date"), args.startDate!));
    if (args.endDate) query = query.filter((q) => q.lte(q.field("date"), args.endDate!));
    if (args.cashierId) query = query.filter((q) => q.eq(q.field("cashierId"), args.cashierId!));
    if (args.paymentMethod) query = query.filter((q) => q.eq(q.field("paymentMethod"), args.paymentMethod!));
    return await query.collect();
  },
});

export const getSalesSummary = query({
  args: {},
  handler: async (ctx) => {
    const transactions = await ctx.db.query("transactions").collect();
    const totalRevenue = transactions.reduce((sum, t) => sum + t.totalAmount, 0);
    const totalSales = transactions.length;
    // For best-selling, need to count product sales
    const productCounts: Record<string, number> = {};
    transactions.forEach((t) => {
      t.productIds.forEach((id: string, i: number) => {
        productCounts[id] = (productCounts[id] || 0) + t.quantities[i];
      });
    });
    const bestSelling = Object.entries(productCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([id, count]) => ({ productId: id, count }));
    return { totalRevenue, totalSales, bestSelling };
  },
});
