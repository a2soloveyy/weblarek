import { View } from '../View';
import { IProduct } from '../../../types';
import { EventEmitter } from '../../base/Events';
import { CardBasket, CardBasketData } from '../cards/CardBasket';

interface BasketData {
    items: IProduct[];
    total: number;
}

export class BasketView extends View<BasketData> {
    private events: EventEmitter;
    private _list: HTMLElement | null;
    private _total: HTMLElement | null;
    private _button: HTMLButtonElement | null;

    constructor(container: HTMLElement, events: EventEmitter) {
        super(container);
        this.events = events;
        this._list = this.findElement('.basket__list');
        this._total = this.findElement('.basket__price');
        this._button = this.findElement<HTMLButtonElement>('.basket__button');

        if (this._button) {
            this._button.addEventListener('click', () => {
                this.events.emit('basket:order');
            });
        }
    }

    set items(value: IProduct[]) {
        if (this._list) {
            this._list.innerHTML = '';

            if (value.length === 0) {

                const emptyItem = document.createElement('li');
                emptyItem.className = 'basket__empty';
                emptyItem.textContent = 'Корзина пуста';
                this._list.appendChild(emptyItem);
            } else {
               
                value.forEach((item, index) => {
                    const template = document.getElementById('card-basket') as HTMLTemplateElement;
                    if (template) {
                        const fragment = template.content.cloneNode(true) as DocumentFragment;
                        const basketItem = fragment.firstElementChild as HTMLElement;

                        if (basketItem) {
                            const cardBasket = new CardBasket(basketItem, this.events);
                            const cardData: CardBasketData = {
                                ...item,
                                index: index + 1
                            };
                            cardBasket.render(cardData);

                            if (!this._list) return;
                            this._list.appendChild(basketItem);
                        }
                        if (this._button) {
                            this._button.addEventListener('click', () => {
                                console.log('Кнопка "Оформить" нажата');
                                this.events.emit('basket:order');
                            });
                        }
                    }
                });
            }
        }
    }

    set total(value: number) {
        this.setText(this._total, value + ' синапсов');
    }

    set selected(value: boolean) {
        this.setDisabled(this._button, !value);
    }

    render(data: BasketData): HTMLElement {
        this.items = data.items;
        this.total = data.total;
        this.selected = data.items.length > 0;
        return this.container;
    }
}
