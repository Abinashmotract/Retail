import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
export declare class ProductsController {
    private readonly productsService;
    constructor(productsService: ProductsService);
    create(dto: CreateProductDto): import("./entities/product.entity").Product;
    findAll(): import("./entities/product.entity").Product[];
    findOne(id: number): import("./entities/product.entity").Product;
    update(id: number, dto: UpdateProductDto): import("./entities/product.entity").Product;
    remove(id: number): {
        deleted: boolean;
    };
    getProductById(id: number): import("./entities/product.entity").Product;
}
