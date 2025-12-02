import { Card } from '../cards/Card';
import { IProduct } from '../../../types';
import { EventEmitter } from '../../base/Events';

interface CardCatalogData extends IProduct {
    inBasket?: boolean;
}

export class CardCatalog extends Card {
    private events: EventEmitter;
    private _button: HTMLButtonElement | null;

    constructor(container: HTMLElement, events: EventEmitter) {
        super(container);
        this.events = events;
        this._button = this.findElement<HTMLButtonElement>('.card__button');
        
        if (this._button) {
        
            this._button.addEventListener('click', (event) => {
                event.stopPropagation();
                this.events.emit('card:add', { product: this.container.dataset.id || '' });
            });
        }
        
        this.container.addEventListener('click', () => {
            this.events.emit('card:select', { product: this.container.dataset.id || '' });
        });
    }

    set inBasket(value: boolean) {
        if (this._button) {
            this._button.textContent = value ? 'В корзине' : 'Купить';
            this.setDisabled(this._button, value);
        }
    }

    render(data: CardCatalogData): HTMLElement {
        super.render(data);
      
        this.container.dataset.id = data.id;
        if (data.inBasket !== undefined) {
            this.inBasket = data.inBasket;
        }
        return this.container;
    }
}