export const orderFlow: Record<string, string[]> = {
  PLACED: ["PROCESSING", "CANCELLED"],
  PROCESSING: ["SHIPPED"],
  SHIPPED: ["DELIVERED"],
  DELEVERED: [],
  CANCELLED: [],
};
