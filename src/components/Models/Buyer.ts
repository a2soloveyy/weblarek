import { IBuyer } from '../../types';

export class Buyer {
    private payment: 'card' | 'cash' | null = null;
    private address: string = '';
    private email: string = '';
    private phone: string = '';

    setData(data: Partial<IBuyer>): void {
        if (data.payment !== undefined) this.payment = data.payment;
        if (data.address !== undefined) this.address = data.address;
        if (data.email !== undefined) this.email = data.email;
        if (data.phone !== undefined) this.phone = data.phone;
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
    }

    validate(): { [key in keyof IBuyer]?: string } {
        const errors: { [key in keyof IBuyer]?: string } = {};

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
}