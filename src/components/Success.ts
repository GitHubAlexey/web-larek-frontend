import { ISuccessActions, TTotalPrice } from "../types";
import { ensureElement } from "../utils/utils";
import { Component } from "./base/Component";

export class Success extends Component<TTotalPrice> {
	protected _button: HTMLButtonElement;
	protected _description: HTMLElement;

	constructor(blockName: string, container: HTMLElement, actions: ISuccessActions) {
		super(container);

		this._button = ensureElement<HTMLButtonElement>(`.${blockName}__close`, container);
		this._description = ensureElement<HTMLElement>(`.${blockName}__description`, container);

		if (actions?.onClick) {
			this._button.addEventListener('click', actions.onClick);
		}
	}

	set total(value: number) {
		this.setText(
			this._description,
			'Списано ' + value + ' синапсов'
		);
	}
}