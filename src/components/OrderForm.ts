import { TOrderModal/* , TPayment */ } from "../types";
import { ensureElement } from "../utils/utils";
import { Form } from "./Form";
import { IEvents } from "./base/events";

export class OrderForm extends Form<TOrderModal> {
	protected _card: HTMLButtonElement;
	protected _cash: HTMLButtonElement;
	protected _address: HTMLInputElement;

	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);

		this._address = ensureElement<HTMLInputElement>('.form__input[name=address]', container);
		this._address.addEventListener('click', () => {
			this.onInputChange('address', this._address.value)
		})

		this._card = ensureElement<HTMLButtonElement>('.button_alt[name=card]', container);
		this._card.addEventListener('click', () => {
			this.payment = 'Online';
			this.onInputChange('payment', this.payment);
		});

		this._cash = ensureElement<HTMLButtonElement>('.button_alt[name=cash]', container);
		this._cash.addEventListener('click', () => {
			this.payment = 'Cash';
			this.onInputChange('payment', this.payment);
		});
	}

	set address(value: string) {
		(this.container.elements.namedItem('address') as HTMLInputElement).value = value;
	}

	set payment(value: string) {
		this._card.classList.toggle('button_alt-active', value === 'Online');
		this._cash.classList.toggle('button_alt-active', value === 'Cash');
	}
}