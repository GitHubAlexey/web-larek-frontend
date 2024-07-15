import { IProduct } from "../types";
import { IEvents } from "./base/events";
import { Model } from "./base/Model";

export class BasketData extends Model<IProduct> {
	protected _products: IProduct[] = [];
	total: number = 0;

	// Добавление товара в корзину и корректировка общей стоимости заказа
	addToBasket(product: IProduct): void {
		product.inBasket = true;
		this._products.push(product);
		this.total += product.price;
	}

	// Удаление товара из корзины и корректировка общей стоимости товара
	deleteFromBasket(product: IProduct): void {
		product.inBasket = false;
		const index = this._products.findIndex(item => item.id === product.id);
		if (index !== -1) {
			this._products.splice(index, 1);
		}
		this.total -= product.price;
	}

	// Очищение корзины после успешного заказа
	clearBasket(): void {
		this._products = [];
		this.total = 0;
	}

	get products() {
		return this._products;
	}
}