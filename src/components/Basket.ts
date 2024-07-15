import { IBasket } from "../types";
import { createElement, ensureElement } from "../utils/utils";
import { Component } from "./base/Component";
import { IEvents } from "./base/events";

export class Basket extends Component<IBasket> {
	protected _list: HTMLElement;
	protected _total: HTMLElement;
	protected submitButton: HTMLButtonElement;

	constructor(container: HTMLElement, protected events: IEvents) {
		super(container);

		// Кнопка "Оформить"
		this.submitButton = ensureElement<HTMLButtonElement>(`.basket__button`, this.container);

		// Общая стоимость заказа
		this._total = ensureElement<HTMLElement>(`.basket__price`, this.container);

		// Список товаров в корзине
		this._list = ensureElement<HTMLElement>(`.basket__list	`, this.container);

		// Вызываем пустой сеттер (при первом запуске сайта корзина пустая)
		this.items = [];

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
			this.submitButton.removeAttribute('disabled');
		} else {
			this._list.replaceChildren(
				createElement<HTMLParagraphElement>('p', {
					textContent: 'Корзина пустая',
				})
			);
			this.submitButton.setAttribute('disabled', 'disabled');
		}
	}
}