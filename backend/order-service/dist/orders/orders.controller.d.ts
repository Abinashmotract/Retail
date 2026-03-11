import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
export declare class OrdersController {
    private readonly ordersService;
    constructor(ordersService: OrdersService);
    create(dto: CreateOrderDto): Promise<import("./entities/order.entity").Order>;
    findAll(): import("./entities/order.entity").Order[];
    findOne(id: number): import("./entities/order.entity").Order;
    update(id: number, dto: UpdateOrderDto): import("./entities/order.entity").Order;
    remove(id: number): {
        deleted: boolean;
    };
}
