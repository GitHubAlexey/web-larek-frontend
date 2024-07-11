import { IModalData } from "../types";
import { ensureElement } from "../utils/utils";
import { Component } from "./base/Component";
import { IEvents } from "./base/events";

export class Modal extends Component<IModalData> {
	protected _closeButton: HTMLButtonElement;
	protected _content: HTMLElement;

	constructor(container: HTMLElement, protected events: IEvents) {
		super(container);

		// Кнопка закрытия модального окна
		this._closeButton = ensureElement<HTMLButtonElement>('.modal__close', container);

		// Содержимое модального окна
		this._content = ensureElement<HTMLElement>('.modal__content', container);

		this._closeButton.addEventListener('click', this.close.bind(this));
		this.container.addEventListener('click', this.close.bind(this));
		this._content.addEventListener('click', (event) => event.stopPropagation());
	}

	// Установка содержимого модального окна
	set content(value: HTMLElement) {
		this._content.replaceChildren(value);
	}

	// Метод открытия модального окна
	open() {
		this.container.classList.add('modal_active');
		this.events.emit('modal:open');
	}

	// Метод закрытия модального окна
	close() {
		this.container.classList.remove('modal_active');
		this.content = null;
		this.events.emit('modal:close');
	}

	render(data: IModalData): HTMLElement {
		super.render(data);
		this.open();
		return this.container;
	}
}