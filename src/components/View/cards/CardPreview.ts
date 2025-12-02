import { Card } from '../Card';
import { IProduct } from '../../../types';
import { EventEmitter } from '../../base/Events';

interface CardPreviewData extends IProduct {
    inBasket: boolean;
}

export class CardPreview extends Card {
    private events: EventEmitter;
    private _description: HTMLElement | null;
    private _button: HTMLButtonElement | null;

    constructor(container: HTMLElement, events: EventEmitter) {
        super(container);
        this.events = events;
        this._description = this.findElement('.card__text');
        this._button = this.findElement<HTMLButtonElement>('.card__button');

        if (this._button) {
            this._button.addEventListener('click', () => {
                const event = this.container.dataset.inBasket === 'true' ? 'card:remove' : 'card:add';
                this.events.emit(event, { product: this.container.dataset.id });
            });
        }
    }

    set description(value: string) {
        this.setText(this._description, value);
    }

    set inBasket(value: boolean) {
        if (this._button) {
            this._button.textContent = value ? 'Удалить из корзины' : 'Купить';
            this.container.dataset.inBasket = value.toString();
        }
    }

    set price(value: number | null) {
        super.price = value;
        if (this._button) {
            this.setDisabled(this._button, value === null);
            if (value === null) {
                this._button.textContent = 'Недоступно';
            }
        }
    }

    render(data: CardPreviewData): HTMLElement {
        super.render(data);
        if (data.description) this.description = data.description;
        if (data.inBasket !== undefined) this.inBasket = data.inBasket;
        this.container.dataset.id = data.id;
        return this.container;
    }
}