"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrdersService = void 0;
const common_1 = require("@nestjs/common");
const microservices_1 = require("@nestjs/microservices");
const rxjs_1 = require("rxjs");
const create_order_dto_1 = require("./dto/create-order.dto");
let OrdersService = class OrdersService {
    productClient;
    orders = [];
    idCounter = 1;
    constructor(productClient) {
        this.productClient = productClient;
    }
    async validateAndPriceItems(items) {
        let total = 0;
        for (const item of items) {
            const product = (await (0, rxjs_1.firstValueFrom)(this.productClient.send({ cmd: 'get-product-by-id' }, item.productId)));
            total += product.price * item.quantity;
        }
        return { items, total };
    }
    async create(dto) {
        const { items, total } = await this.validateAndPriceItems(dto.items);
        const now = new Date();
        const order = {
            id: this.idCounter++,
            customerName: dto.customerName,
            customerEmail: dto.customerEmail,
            items,
            status: dto.status ?? create_order_dto_1.OrderStatus.PENDING,
            totalAmount: dto.totalAmount ?? total,
            createdAt: now,
            updatedAt: now,
        };
        this.orders.push(order);
        return order;
    }
    findAll() {
        return this.orders;
    }
    findOne(id) {
        return this.orders.find((o) => o.id === id);
    }
    update(id, dto) {
        const order = this.findOne(id);
        if (!order) {
            return undefined;
        }
        Object.assign(order, dto, { updatedAt: new Date() });
        return order;
    }
    remove(id) {
        const index = this.orders.findIndex((o) => o.id === id);
        if (index === -1) {
            return false;
        }
        this.orders.splice(index, 1);
        return true;
    }
};
exports.OrdersService = OrdersService;
exports.OrdersService = OrdersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('PRODUCT_SERVICE')),
    __metadata("design:paramtypes", [microservices_1.ClientProxy])
], OrdersService);
//# sourceMappingURL=orders.service.js.map