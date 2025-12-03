import { Card } from '../cards/Card';
import { IProduct } from '../../../types';
import { EventEmitter } from '../../base/Events';

// Создаем интерфейс для данных карточки каталога
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
            // Обработчик для кнопки "Купить"
            this._button.addEventListener('click', (event) => {
                event.stopPropagation();
                this.events.emit('card:add', { product: this.id });
            });
        }
        
        // Обработчик для всей карточки (для открытия превью)
        this.container.addEventListener('click', () => {
            this.events.emit('card:select', { product: this.id });
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
        if (data.inBasket !== undefined) {
            this.inBasket = data.inBasket;
        }
        return this.container;
    }
}