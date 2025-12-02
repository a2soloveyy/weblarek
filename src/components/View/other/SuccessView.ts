import { View } from '../View';
import { EventEmitter } from '../../base/Events';

interface SuccessData {
    total: number;
}

export class SuccessView extends View<SuccessData> {
    private events: EventEmitter;
    private _total: HTMLElement | null;
    private _closeButton: HTMLButtonElement | null;

    constructor(container: HTMLElement, events: EventEmitter) {
        super(container);
        this.events = events;
        this._total = this.findElement('.order-success__description');
        this._closeButton = this.findElement<HTMLButtonElement>('.order-success__close');

        if (this._closeButton) {
            this._closeButton.addEventListener('click', () => {
                this.events.emit('success:close');
            });
        }
    }

    set total(value: number) {
        this.setText(this._total, `Списано ${value} синапсов`);
    }

    render(data: SuccessData): HTMLElement {
        this.total = data.total;
        return this.container;
    }
}