import { ICardActions, IProduct } from "../types";
import { CDN_URL } from "../utils/constants";
import { ensureElement } from "../utils/utils";
import { Component } from "./base/Component";

export class Card extends Component<IProduct> {
	protected _description: HTMLElement;
	protected _image: HTMLImageElement;
	protected _title: HTMLElement;
	protected _category: HTMLElement;
	protected _price: HTMLElement;
	protected _button: HTMLButtonElement;
	protected _basketItemIndex: HTMLElement;

	constructor(protected blockName: string, container: HTMLElement, actions?: ICardActions) {
		super(container);
		this._title = ensureElement<HTMLElement>(`.${blockName}__title`, container);
		this._image = container.querySelector(`.${blockName}__image`);
		this._category = container.querySelector(`.${blockName}__category`);
		this._price = container.querySelector(`.${blockName}__price`);
		this._button = container.querySelector(`.${blockName}__button`);
		this._description = container.querySelector(`.${this.blockName}__text`);
		this._basketItemIndex = container.querySelector(`.basket__item-index`);

		if (actions?.onClick) {
			if (this._button) {
				this._button.addEventListener('click', actions.onClick);
			} else {
				container.addEventListener('click', actions.onClick);
			}
		}
	}

	// Изменение текста для кнопки в зависимости от того, в корзине товар или нет
	toogleButtonText(item: IProduct) {
		if (item.inBasket) {
			this.setText(this._button, 'Убрать из корзины');
		} else {
			this.setText(this._button, 'В корзину');
		}
	}

	set description(value: string) {
		if (this._description) {
			this.setText(this._description, value);
		}
	}

	set image(value: string) {
		if (this._image) {
			this.setImage(this._image, CDN_URL + value, this.title);
		}
	}

	set title(value: string) {
		this.setText(this._title, value);
	}

	set category(value: string) {
		if (this._description) {
			this.setText(this._category, value);
		}
	}

	set price(value: number | null) {
		this.setText(this._price, value ? value + ' синапсов' : 'Бесценно');
		if (value === null && this._button) {
			this._button.disabled = true;
		}
	}

	set basketItemIndex(index: number) {
		if (this._basketItemIndex) {
			this._basketItemIndex.textContent = index.toString();
		}
	}
}