import { ISuccessActions, TTotalPrice } from "../types";
import { ensureElement } from "../utils/utils";
import { Component } from "./base/Component";

export class Success extends Component<TTotalPrice> {
	protected _button: HTMLButtonElement;
	protected _description: HTMLElement;

	constructor(container: HTMLElement, actions: ISuccessActions) {
		super(container);

		this._button = ensureElement<HTMLButtonElement>(`.order-success__close`, container);
		this._description = ensureElement<HTMLElement>(`.order-success__description`, container);

		if (actions?.onClick) {
			this._button.addEventListener('click', actions.onClick);
		}
	}

	set total(value: number) {
		this.setText(this._description, 'Списано ' + value + ' синапсов');
	}
}