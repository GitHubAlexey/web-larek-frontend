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
	protected categoryClass: { [key: string]: string } = {
		'софт-скил': 'card__category_soft',
		'хард-скил': 'card__category_hard',
		'дополнительное': 'card__category_additional',
		'другое': 'card__category_other',
		'кнопка': 'card__category_button',
	};

	constructor(container: HTMLElement, actions?: ICardActions) {
		super(container);
		this._title = ensureElement<HTMLElement>(`.card__title`, container);
		this._price = ensureElement<HTMLElement>(`.card__price`, container);
		this._image = container.querySelector(`.card__image`);
		this._category = container.querySelector(`.card__category`);
		this._button = container.querySelector(`.card__button`);
		this._description = container.querySelector(`.card__text`);
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
		const buttonText = item.inBasket ? 'Убрать из корзины' : 'В корзину';
		this.setText(this._button, buttonText);
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
		if (this._category) {
			this.setText(this._category, value);

			/* Получаем список всех классов у категории,
			чтобы удалить имеющийся в верстке класс по-умолчанию card__category_soft или card__category_other
			и добавить необходимый класс в зависимости от категории */
			const classes = Array.from(this._category.classList);
			classes.forEach(className => {
				if (className.startsWith('card__category_')) {
					this._category.classList.remove(className);
				}
			});
			this._category.classList.add(this.categoryClass[value]);
		}
	}

	set price(value: number | null) {
		this.setText(this._price, value ? value + ' синапсов' : 'Бесценно');
	}

	set basketItemIndex(index: number) {
		if (this._basketItemIndex) {
			this._basketItemIndex.textContent = index.toString();
		}
	}
}