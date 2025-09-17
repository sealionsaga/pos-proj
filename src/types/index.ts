export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  image?: string;
}

export interface Transaction {
  _id: string;
  productIds: string[];
  quantities: number[];
  totalAmount: number;
  paymentMethod: string;
  cashierId: string;
  date: number;
}

export interface Customer {
  _id: string;
  name: string;
  contact: string;
  purchaseHistory?: string[];
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface SalesSummary {
  totalRevenue: number;
  totalSales: number;
  bestSelling: { productId: string; count: number }[];
}
