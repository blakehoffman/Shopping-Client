import { CartProductDTO } from "./cart-product-dto";

export interface CartDTO {
    id: string;
    products: Array<CartProductDTO>;
}