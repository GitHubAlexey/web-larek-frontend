import { IOrder, TFormErrors } from "../types";
import { Model } from "./base/Model";
import { IEvents } from "./base/events";

export class OrderData extends Model<IOrder> {
	items: string[] = [];
	payment: string = 'Online';
	address: string = '';
	email: string = '';
	phone: string = '';
	formErrors: TFormErrors = {};
	valid: boolean = false;
	total: number | null = null;
	protected events: IEvents;

	// Валидация формы контактов
	validateContacts(): boolean {
		const errors: typeof this.formErrors = {};
		if (!this.email) {
				errors.email = 'Необходимо указать email';
		}
		if (!this.phone) {
				errors.phone = 'Необходимо указать телефон';
		}
		this.formErrors = errors;
		this.events.emit('contactsFormErrors:change', this.formErrors);
		return Object.keys(errors).length === 0;
	}

	// Валидация формы заказа (адрес)
	validatePaymentAddress(): boolean {
    const errors: typeof this.formErrors = {};
		if (!this.payment) {
			errors.address = 'Необходимо выбрать способ оплаты';
	}
    if (!this.address) {
        errors.address = 'Необходимо указать адрес доставки';
    }
    this.formErrors = errors;
    this.events.emit('orderFormErrors:change', this.formErrors);
    return Object.keys(errors).length === 0;
  }

	// Очистка данных заказа
	clearOrder(): void {
		this.items = [];
    this.payment = 'Online';
    this.email = '';
    this.phone = '';
    this.address = '';
		this.formErrors = {};
		this.valid = false;
		this.total = null;
  }
}