import { OrderStatus } from '../dto/create-order.dto';

export interface OrderItem {
  productId: number;
  quantity: number;
}

export class Order {
  id: number;
  customerName: string;
  customerEmail?: string;
  items: OrderItem[];
  status: OrderStatus;
  totalAmount: number;
  createdAt: Date;
  updatedAt: Date;
}

