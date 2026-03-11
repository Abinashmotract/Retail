export declare enum OrderStatus {
    PENDING = "PENDING",
    CONFIRMED = "CONFIRMED",
    CANCELLED = "CANCELLED"
}
export declare class CreateOrderItemDto {
    productId: number;
    quantity: number;
}
export declare class CreateOrderDto {
    customerName: string;
    customerEmail?: string;
    items: CreateOrderItemDto[];
    status?: OrderStatus;
    totalAmount?: number;
}
