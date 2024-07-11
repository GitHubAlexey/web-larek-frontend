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
    if (!this.address) {
        errors.address = 'Необходимо указать адрес доставки';
    }
    this.formErrors = errors;
    this.events.emit('orderFormErrors:change', this.formErrors);
    return Object.keys(errors).length === 0;
  }

	// Установка значений полей ввода адреса и контактов
	setOrderField(orderData: IOrder): void {
		this.payment = orderData.payment;
		this.address = orderData.address;
		this.email = orderData.email;
		this.phone = orderData.phone;

		if (this.validateContacts()) {
				this.events.emit('contacts:ready', { email: this.email, phone: this.phone });
		}

		if (this.validatePaymentAddress()) {
			this.events.emit('order:ready', { payment: this.payment, address: this.address });
		}
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