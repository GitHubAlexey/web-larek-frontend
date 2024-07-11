import { IBasket } from "../types";
import { createElement } from "../utils/utils";
import { Component } from "./base/Component";
import { IEvents } from "./base/events";

export class Basket extends Component<IBasket> {
	protected _list: HTMLElement;
	protected _total: HTMLElement;
	protected submitButton: HTMLButtonElement;

	constructor(protected blockName: string, container: HTMLElement, protected events: IEvents) {
		super(container);

		// Кнопка "Оформить"
		this.submitButton = container.querySelector(`.${blockName}__button`);

		// Общая стоимость заказа
		this._total = container.querySelector(`.${blockName}__price`);

		// Список товаров в корзине
		this._list = container.querySelector(`.${blockName}__list`);

		if (this.submitButton) {
			this.submitButton.addEventListener('click', () => events.emit('basket:submit'));
		}
	}

	set total(price: number) {
		this.setText(this._total, price + ' синапсов');
	}

	set items(items: HTMLElement[]) {
		if (items.length) {
			this._list.replaceChildren(...items);
			this.submitButton.disabled = false;
		} else {
			this._list.replaceChildren(
				createElement<HTMLParagraphElement>('p', {
					textContent: 'Корзина пустая',
				})
			);
			this.submitButton.disabled = true;
		}
	}
}