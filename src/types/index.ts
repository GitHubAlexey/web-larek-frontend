// Данные для товара
export interface IProduct {
	id: string;
	description: string;
	image: string;
	title: string;
	category: string;
	price: number | null;
	inBasket: boolean;
}

// Данные для заказа
export interface IOrder {
	payment: TPayment;
	address: string;
	email: string;
	phone: string;
	total: TTotalPrice;
	items: string[];
}

// Данные для корзины с товарами
export interface IBasket {
	products: IProduct[];
	total: number | null;
}

// Данные для каталога товара
export interface IProductList {
	items: IProduct[];
}

// Отображение главной страницы
export interface IPage {
	counter: number;
	catalog: HTMLElement[];
	locked: boolean;
}

// Данные для модального окна
export interface IModalData {
	content: HTMLElement;
}

// Интерфейс формы
export interface IFormState {
	valid: boolean;
	errors: string[];
}

export interface ISuccessActions {
	onClick: () => void;
}

export interface ICardActions {
	onClick: (event: MouseEvent) => void;
}

// Тип для ответа от сервера (каталог карточек товара)
export type TApiResponse = Pick<IProductList, 'items'>;

// Тип для товара в корзине
export type TProductInBasket = Pick<IProduct, 'id' | 'title' | 'price' | 'inBasket'>;

// Тип для общей суммы заказа
export type TTotalPrice = Pick<IBasket, 'total'>;

// Тип для модального окна с данными по заказу (способ оплаты и адрес доставки)
export type TOrderModal = Pick<IOrder, 'payment' | 'address'>;

// Тип для модального окна контактов покупателя
export type TContactsModal = Pick<IOrder, 'email' | 'phone'>;

// Тип для ошибок валидации
export type TFormErrors = Partial<Record<keyof IOrder, string>>;

// Тип для способа оплаты
export type TPayment = 'Online' | 'Cash';