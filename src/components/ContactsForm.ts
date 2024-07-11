import { TContactsModal } from "../types";
import { ensureElement } from "../utils/utils";
import { Form } from "./Form";
import { IEvents } from "./base/events";

export class ContactsForm extends Form<TContactsModal> {
	protected _email: HTMLInputElement;
	protected _phone: HTMLInputElement;

	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);

		this._email = ensureElement<HTMLInputElement>('.form__input[name=email]', container);
		this._email.addEventListener('click', () => {
			this.onInputChange('email', this._email.value);
		});

		this._phone = ensureElement<HTMLInputElement>('.form__input[name=phone]', container);
		this._phone.addEventListener('click', () => {
			this.onInputChange('phone', this._phone.value);
		});
	}

	set email(value: string) {
		(this.container.elements.namedItem('email') as HTMLInputElement).value =
			value;
	}

	set phone(value: string) {
		(this.container.elements.namedItem('phone') as HTMLInputElement).value =
			value;
	}
}