import { Card } from '../Card';
import { IProduct } from '../../../types';
import { EventEmitter } from '../../base/Events';

export class CardCatalog extends Card {
    private events: EventEmitter;

    constructor(container: HTMLElement, events: EventEmitter) {
        super(container);
        this.events = events;
        
        this.container.addEventListener('click', () => {
            console.log('Клик по карточке, id:', this.container.dataset.id);
            if (this.container.dataset.id) {
                this.events.emit('card:select', { product: this.container.dataset.id });
            }
        });
    }

    render(data: IProduct): HTMLElement {

        if (data.id) this.id = data.id;

        super.render(data);
        return this.container;
    }
}