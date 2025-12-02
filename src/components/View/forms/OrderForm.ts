import { Form } from '../Form';
import { IBuyer } from '../../../types';
import { EventEmitter } from '../../base/Events';

export class OrderForm extends Form<IBuyer> {
    private events: EventEmitter;
    private _paymentButtons: NodeListOf<HTMLButtonElement>;
    private _addressInput: HTMLInputElement | null;

    constructor(container: HTMLElement, events: EventEmitter) {
        super(container);
        this.events = events;
        this._paymentButtons = this.findAllElements<HTMLButtonElement>('.button_alt');
        this._addressInput = this.findElement<HTMLInputElement>('input[name="address"]');

        // Обработчики для кнопок оплаты
        this._paymentButtons.forEach(button => {
            button.addEventListener('click', () => {
                this._paymentButtons.forEach(btn => this.setClass(btn, 'button_alt-active', false));
                this.setClass(button, 'button_alt-active', true);
                this.events.emit('order:paymentChange', { payment: button.name as 'card' | 'cash' });
            });
        });

        // Обработчик для поля адреса
        if (this._addressInput) {
            this._addressInput.addEventListener('input', () => {
                this.events.emit('order:addressChange', { address: this._addressInput?.value || '' });
            });
        }

        // Обработчик отправки формы
        this.container.addEventListener('submit', (event) => {
            event.preventDefault();
            this.events.emit('order:submit');
        });
    }

    set payment(value: 'card' | 'cash' | null) {
        this._paymentButtons.forEach(button => {
            this.setClass(button, 'button_alt-active', button.name === value);
        });
    }

    set address(value: string) {
        if (this._addressInput) {
            this._addressInput.value = value;
        }
    }

    render(data: Partial<IBuyer>): HTMLElement {
        if (data.payment) this.payment = data.payment;
        if (data.address) this.address = data.address;
        return this.container;
    }
}