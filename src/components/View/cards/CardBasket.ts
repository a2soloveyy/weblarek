import { Card } from './Card';
import { IProduct } from '../../../types';
import { EventEmitter } from '../../base/Events';

export interface CardBasketData extends IProduct {
    index: number;
}

export class CardBasket extends Card {
    private events: EventEmitter;
    private _index: HTMLElement | null;
    private _deleteButton: HTMLButtonElement | null;

    constructor(container: HTMLElement, events: EventEmitter) {
        super(container);
        this.events = events;
        this._index = this.findElement('.basket__item-index');
        this._deleteButton = this.findElement<HTMLButtonElement>('.basket__item-delete');

        if (this._deleteButton) {
            this._deleteButton.addEventListener('click', (event) => {
                event.stopPropagation();
                if (this.container.dataset.id) {
                    this.events.emit('card:remove', { product: this.container.dataset.id });
                }
            });
        }
    }

    set index(value: number) {
        this.setText(this._index, value.toString());
    }

    render(data: CardBasketData): HTMLElement {
        super.render(data);
        if (data.index) this.index = data.index;
        this.container.dataset.id = data.id;
        return this.container;
    }
}