// Данные для товара
export interface IProduct {
	id: string;
	description?: string;
	image: string;
	title: string;
	category: string;
	price: number;
	inBasket?: boolean;
}

// Данные для заказа
export interface IOrder {
	payment: TPayment;
	address: string;
	email: string;
	phone: string;
}

// Данные для корзины с товарами
export interface IBasket {
	items: TProductInBasket[];
	total: number;
}

// Данные для отправки на сервер POST запроса при заказе
export interface IOrderData extends IOrder{
	total: TTotalPrice;
	items: string[];
}

// Данные успешного ответа от сервера при отправке заказа 
export interface IOrderResult { 
	id: string;
	total: number;
}

// Данные для каталога товара
export interface IProductList {
	items: IProduct[];
	preview: string | null;
}

// Тип для товара в корзине
type TProductInBasket = Pick<IProduct, 'id' | 'title' | 'price'> & { index: number };

// Тип для общей суммы заказа
type TTotalPrice = Pick<IBasket, 'total'>;

// Тип способа оплаты
type TPayment = 'Online' | 'Cash';

// Тип для модального окна выбора способа оплаты и ввода адреса
export type TPaymentModal = Pick<IOrder, 'payment' | 'address'>;

// Тип для модального окна контактов покупателя
export type TContactsModal = Pick<IOrder, 'email' | 'phone'>;

// Тип для модального окна успешного оформления заказа
export type TSucsessModal = Pick<IOrderResult, 'total'>;
