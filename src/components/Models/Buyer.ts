import { IBuyer } from '../../types';
import { EventEmitter } from '../base/Events';

export class Buyer {
    private payment: 'card' | 'cash' | null = null;
    private address: string = '';
    private email: string = '';
    private phone: string = '';
    private events: EventEmitter;

    constructor(events: EventEmitter) {
        this.events = events;
    }

    setData(data: Partial<IBuyer>): void {
        let changed = false;
        
        if (data.payment !== undefined && this.payment !== data.payment) {
            this.payment = data.payment;
            changed = true;
        }
        if (data.address !== undefined && this.address !== data.address) {
            this.address = data.address;
            changed = true;
        }
        if (data.email !== undefined && this.email !== data.email) {
            this.email = data.email;
            changed = true;
        }
        if (data.phone !== undefined && this.phone !== data.phone) {
            this.phone = data.phone;
            changed = true;
        }
        
        if (changed) {
            this.events.emit('buyerChanged', { buyer: this.getData() });
        }
    }

    getData(): IBuyer {
        return {
            payment: this.payment,
            address: this.address,
            email: this.email,
            phone: this.phone
        };
    }

    clear(): void {
        this.payment = null;
        this.address = '';
        this.email = '';
        this.phone = '';
        this.events.emit('buyerChanged', { buyer: this.getData() });
    }

    validate(): { payment?: string; email?: string; phone?: string; address?: string } {
        const errors: { payment?: string; email?: string; phone?: string; address?: string } = {};

        if (!this.payment) {
            errors.payment = 'Не выбран способ оплаты';
        }
        if (!this.address.trim()) {
            errors.address = 'Укажите адрес доставки';
        }
        if (!this.email.trim()) {
            errors.email = 'Укажите email';
        }
        if (!this.phone.trim()) {
            errors.phone = 'Укажите телефон';
        }

        return errors;
    }

    isValid(): boolean {
        return Object.keys(this.validate()).length === 0;
    }
}