import { IProduct } from "../types";
import { Model } from "./base/Model";

export class BasketData extends Model<IProduct>{
	protected _products: IProduct[] = [];
	total: number | null = null;

	// Вычисление общей стоимости заказа
	getTotalPrice(): number {
		return this._products.reduce((sum, item) => sum + item.price, 0);
	}

	// Добавление товара в корзину и корректировка общей стоимости заказа
 	addToBasket(product: IProduct): void {
		product.inBasket = true;
		this._products.push(product);
		this.total = this.getTotalPrice();
	}

	// Удаление товара из корзины и корректировка общей стоимости товара
	deleteFromBasket(product: IProduct): void {
		product.inBasket = false;
		this._products = this._products.filter((item) => item.id !== product.id);
		this.total = this.getTotalPrice();
	}

	// Очищение корзины после успешного заказа
	clearBasket(): void {
		this._products = [];
		this.total = this.getTotalPrice();
	}

	get products() {
		return this._products;
	}
}