import { View } from '../View';
import { EventEmitter } from '../../base/Events';

interface HeaderData {
    counter: number;
}

export class Header extends View<HeaderData> {
    private events: EventEmitter;
    private _basketButton: HTMLButtonElement | null;
    private _counter: HTMLElement | null;

    constructor(container: HTMLElement, events: EventEmitter) {
        super(container);
        this.events = events;
        this._basketButton = this.findElement<HTMLButtonElement>('.header__basket');
        this._counter = this.findElement('.header__basket-counter');

        if (this._basketButton) {
            this._basketButton.addEventListener('click', () => {
                this.events.emit('header:basketOpen');
            });
        }
    }

    set counter(value: number) {
        this.setText(this._counter, value.toString());
    }

    render(data: HeaderData): HTMLElement {
        this.counter = data.counter;
        return this.container;
    }
}