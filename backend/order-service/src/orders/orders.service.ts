import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { CreateOrderDto, OrderStatus } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order, OrderItem } from './entities/order.entity';

interface ProductSummary {
  id: number;
  name: string;
  price: number;
  stock: number;
}

@Injectable()
export class OrdersService {
  private orders: Order[] = [];
  private idCounter = 1;

  constructor(
    @Inject('PRODUCT_SERVICE')
    private readonly productClient: ClientProxy,
  ) {}

  private async validateAndPriceItems(items: OrderItem[]): Promise<{ items: OrderItem[]; total: number }> {
    let total = 0;

    for (const item of items) {
      const product = (await firstValueFrom(
        this.productClient.send<ProductSummary>({ cmd: 'get-product-by-id' }, item.productId),
      )) as ProductSummary;

      total += product.price * item.quantity;
    }

    return { items, total };
  }

  async create(dto: CreateOrderDto): Promise<Order> {
    const { items, total } = await this.validateAndPriceItems(dto.items);
    const now = new Date();

    const order: Order = {
      id: this.idCounter++,
      customerName: dto.customerName,
      customerEmail: dto.customerEmail,
      items,
      status: dto.status ?? OrderStatus.PENDING,
      totalAmount: dto.totalAmount ?? total,
      createdAt: now,
      updatedAt: now,
    };

    this.orders.push(order);
    return order;
  }

  findAll(): Order[] {
    return this.orders;
  }

  findOne(id: number): Order | undefined {
    return this.orders.find((o) => o.id === id);
  }

  update(id: number, dto: UpdateOrderDto): Order | undefined {
    const order = this.findOne(id);
    if (!order) {
      return undefined;
    }
    Object.assign(order, dto, { updatedAt: new Date() });
    return order;
  }

  remove(id: number): boolean {
    const index = this.orders.findIndex((o) => o.id === id);
    if (index === -1) {
      return false;
    }
    this.orders.splice(index, 1);
    return true;
  }
}

