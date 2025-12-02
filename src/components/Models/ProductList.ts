import { IProduct } from '../../types';
import { EventEmitter } from '../base/Events';

export class ProductList {
    private items: IProduct[] = [];
    private selectedItem: IProduct | null = null;
    private events: EventEmitter;

    constructor(events: EventEmitter) {
        this.events = events;
    }

    setItems(items: IProduct[]): void {
        this.items = items;
        this.events.emit('itemsChanged', { items: this.items });
    }

    getItems(): IProduct[] {
        return this.items;
    }

    getItem(id: string): IProduct | undefined {
        return this.items.find(item => item.id === id);
    }

    setSelectedItem(item: IProduct): void {
        this.selectedItem = item;
        this.events.emit('selectedItemChanged', { item: this.selectedItem });
    }

    getSelectedItem(): IProduct | null {
        return this.selectedItem;
    }
}