import { ClientProxy } from '@nestjs/microservices';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order } from './entities/order.entity';
export declare class OrdersService {
    private readonly productClient;
    private orders;
    private idCounter;
    constructor(productClient: ClientProxy);
    private validateAndPriceItems;
    create(dto: CreateOrderDto): Promise<Order>;
    findAll(): Order[];
    findOne(id: number): Order | undefined;
    update(id: number, dto: UpdateOrderDto): Order | undefined;
    remove(id: number): boolean;
}
