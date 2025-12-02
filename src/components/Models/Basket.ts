import { IProduct } from '../../types';
import { EventEmitter } from '../base/Events';

export class Basket {
    private items: IProduct[] = [];
    private events: EventEmitter;

    constructor(events: EventEmitter) {
        this.events = events;
    }

    getItems(): IProduct[] {
        return this.items;
    }

    addItem(item: IProduct): void {
        if (!this.items.some(i => i.id === item.id)) {
            this.items.push(item);
            this.events.emit('basketChanged', { items: this.items });
        }
    }

    removeItem(id: string): void {
        this.items = this.items.filter(item => item.id !== id);
        this.events.emit('basketChanged', { items: this.items });
    }

    clear(): void {
        this.items = [];
        this.events.emit('basketChanged', { items: this.items });
    }

    getTotal(): number {
        return this.items.reduce((total, item) => {
            return total + (item.price || 0);
        }, 0);
    }

    getCount(): number {
        return this.items.length;
    }

    contains(id: string): boolean {
        return this.items.some(item => item.id === id);
    }
}