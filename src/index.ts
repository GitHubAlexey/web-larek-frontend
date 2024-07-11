import './scss/styles.scss';
import { ProductData } from './components/ProductData';
import { Api } from './components/base/api';
import { EventEmitter } from './components/base/events';
import { IProduct, TApiResponse, TContactsModal, TOrderModal } from './types';
import { API_URL } from './utils/constants';
import { BasketData } from './components/BasketData';
import { OrderData } from './components/OrderData';
import { cloneTemplate, ensureElement } from './utils/utils';
import { Card } from './components/Card';
import { Page } from './components/Page';
import { Modal } from './components/Modal';
import { Basket } from './components/Basket';
import { OrderForm } from './components/OrderForm';
import { ContactsForm } from './components/ContactsForm';
import { Success } from './components/Success';

// Все шаблоны
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const modalContainerTemplate = ensureElement<HTMLElement>('#modal-container');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');

const api = new Api(API_URL);
const events = new EventEmitter();

// Модели данных приложения
const catalog = new ProductData({}, events);
const basketModel = new BasketData({}, events);
const order = new OrderData({}, events);

const page = new Page(document.body, events);
const modal = new Modal(modalContainerTemplate, events);
const basket = new Basket('basket', cloneTemplate(basketTemplate), events);
const orderForm = new OrderForm(cloneTemplate(orderTemplate), events);
const contactsForm = new ContactsForm(cloneTemplate(contactsTemplate), events);
const success = new Success('order-success', cloneTemplate(successTemplate), {
	onClick: () => events.emit('success:close'),
});

// Получение списка товаров с сервера
api
	.get('/product')
	.then((res: TApiResponse) => {
		catalog.setCatalog(res.items);
	})
	.catch((err) => {
		console.error(err);
	});

// Вывод каталога товаров на главной странице
events.on('cards:changed', () => {
	page.catalog = catalog.items.map((item) => {
		const catalogItem = new Card('card', cloneTemplate(cardCatalogTemplate), {
			onClick: () => events.emit('cardPreview:open', item),
		});
		return catalogItem.render(item);
	});
});

// Открываем превью карточки, на которую нажали
events.on('cardPreview:open', (item: IProduct) => {
	const cardPreview = new Card('card', cloneTemplate(cardPreviewTemplate), {
		onClick: () => {
			events.emit('product:toBasket', item);
			cardPreview.toogleButtonText(item);
		},
	}
	);
	cardPreview.toogleButtonText(item);
	modal.render({
		content: cardPreview.render(item),
	});
});

// Добавить в корзину / удалить из корзины из превью товара
events.on('product:toBasket', (item: IProduct) => {
	basketModel.products.some((product) => product.id === item.id)
		? basketModel.deleteFromBasket(item)
		: basketModel.addToBasket(item);
	page.counter = basketModel.products.length;
	getBasketItemsView();
});

// Отображение списка товаров, добавленных в корзину
function getBasketItemsView() {
	basket.items = basketModel.products.map((item, index) => {
		const basketItem = new Card('card', cloneTemplate(cardBasketTemplate), {
			onClick: () => {
				events.emit('basket:delete', item);
			},
		});
		basketItem.basketItemIndex = index + 1;
		return basketItem.render(item);
	});
}

// Открыть корзину
events.on('basket:open', () => {
	modal.render({
		content: basket.render(basketModel),
	});
});

// Блокируем прокрутку страницы если открыта модалка
events.on('modal:open', () => {
	page.locked = true;
});

// ... и разблокируем
events.on('modal:close', () => {
	page.locked = false;
});

// Удалить товар из корзины (кнопка удаления в корзине)
events.on('basket:delete', (item: IProduct) => {
	basketModel.deleteFromBasket(item);
	basket.total = basketModel.total;
	page.counter = basketModel.products.length;
	getBasketItemsView();
});

// Отображение модального окна формы ввода способа оплаты и адреса доставки
events.on('basket:submit', () => {
	order.items = basketModel.products.map((item) => item.id);
	order.total = basketModel.total;
	modal.render({
		content: orderForm.render({
			valid: false,
			errors: [],
			payment: 'Online',
			address: '',
		}),
	});
});

// Отображение модального окна формы ввода email и номера телефона
events.on('order:submit', () => {
	modal.render({
		content: contactsForm.render({
			valid: false,
			errors: [],
			phone: '',
			email: '',
		}),
	});
});

// Изменилось состояние валидации формы ввода способа оплаты и адреса доставки
events.on('orderFormErrors:change', (errors: Partial<TOrderModal>) => {
	const { address, payment } = errors;
	orderForm.valid = !Object.keys(errors).length;
	orderForm.errors = Object.values({ payment, address })
		.filter((i) => !!i)
		.join('; ');
});

// Изменилось поле формы ввода адреса доставки
events.on('address:change', (data: { field: keyof TOrderModal; value: string }) => {
	order.address = data.value;
	order.validatePaymentAddress();
}
);

// Изменилось поле формы ввода почты
events.on('email:change', (data: { field: keyof TContactsModal; value: string }) => {
	order.email = data.value;
	order.validateContacts();
}
);

// Изменилось поле формы ввода телефона
events.on('phone:change', (data: { field: keyof TContactsModal; value: string }) => {
	order.phone = data.value;
	order.validateContacts();
});

// Изменилось состояние валидации формы ввода способа оплаты и адреса доставки
events.on('contactsFormErrors:change', (errors: Partial<TContactsModal>) => {
	const { email, phone } = errors;
	contactsForm.valid = !Object.keys(errors).length;
	contactsForm.errors = Object.values({ email, phone })
		.filter((i) => !!i)
		.join('; ');
});

// отправить на сервер данные и показать окно успешной покупки
events.on('contacts:submit', () => {
	api
		.post('/order', order)
		.then((res) => {
			modal.render({
				content: success.render({
					total: order.total,
				}),
			});
			order.clearOrder();
			basketModel.clearBasket();
			basket.items = [];
			catalog.items.map((item) => (item.inBasket = false));
			page.counter = basketModel.products.length;
		})
		.catch((err) => {
			console.log(err);
		});
});

events.on('success:close', () => {
	modal.close();
});