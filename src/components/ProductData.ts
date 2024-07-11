import { IProduct, IProductList } from "../types";
import { Model } from "./base/Model";

export class ProductData extends Model<IProductList> {
	items: IProduct[] = [];

	setCatalog(cards: IProduct[]) {
		this.items = cards;
		this.emitChanges('cards:changed', { items: this.items });
	}
}