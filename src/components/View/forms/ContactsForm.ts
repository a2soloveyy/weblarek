import { Form } from '../Form';
import { IBuyer } from '../../../types';
import { EventEmitter } from '../../base/Events';

export class ContactsForm extends Form<IBuyer> {
    private events: EventEmitter;
    private _emailInput: HTMLInputElement | null;
    private _phoneInput: HTMLInputElement | null;

    constructor(container: HTMLElement, events: EventEmitter) {
        super(container);
        this.events = events;
        this._emailInput = this.findElement<HTMLInputElement>('input[name="email"]');
        this._phoneInput = this.findElement<HTMLInputElement>('input[name="phone"]');

        // Обработчики для полей ввода
        if (this._emailInput) {
            this._emailInput.addEventListener('input', () => {
                this.events.emit('contacts:emailChange', { email: this._emailInput?.value || '' });
            });
        }

        if (this._phoneInput) {
            this._phoneInput.addEventListener('input', () => {
                this.events.emit('contacts:phoneChange', { phone: this._phoneInput?.value || '' });
            });
        }

        // Обработчик отправки формы
        this.container.addEventListener('submit', (event) => {
            event.preventDefault();
            this.events.emit('contacts:submit');
        });
    }

    set email(value: string) {
        if (this._emailInput) {
            this._emailInput.value = value;
        }
    }

    set phone(value: string) {
        if (this._phoneInput) {
            this._phoneInput.value = value;
        }
    }

    render(data: Partial<IBuyer>): HTMLElement {
        if (data.email) this.email = data.email;
        if (data.phone) this.phone = data.phone;
        return this.container;
    }
}