import { View } from '../View';
import { IProduct } from '../../../types';
import { CDN_URL, categoryMap } from '../../../utils/constants';

export abstract class Card extends View<IProduct> {
    protected _category: HTMLElement | null;
    protected _title: HTMLElement | null;
    protected _image: HTMLImageElement | null;
    protected _price: HTMLElement | null;

    constructor(container: HTMLElement) {
        super(container);
        this._category = this.findElement('.card__category');
        this._title = this.findElement('.card__title');
        this._image = this.findElement<HTMLImageElement>('.card__image');
        this._price = this.findElement('.card__price');
    }

    set category(value: string) {
        this.setText(this._category, value);
        if (this._category) {

            const classNames = Object.values(categoryMap) as string[];
            classNames.forEach(className => {
                this._category!.classList.remove(className);
            });

            const modifier = categoryMap[value as keyof typeof categoryMap];
            if (modifier) {
                this._category.classList.add(modifier);
            }
        }
    }

    set title(value: string) {
        this.setText(this._title, value);
    }

    set image(value: string) {
        if (this._image && value) {
            const cleanValue = value.startsWith('/') ? value : `/${value}`;
            this.setImage(this._image, `${CDN_URL}${cleanValue}`, this._title?.textContent || '');
        }
    }

    set price(value: number | null) {
        if (value === null) {
            this.setText(this._price, 'Бесценно');
        } else {
            this.setText(this._price, `${value} синапсов`);
        }
    }

    render(data: Partial<IProduct>): HTMLElement {
        if (data.category) this.category = data.category;
        if (data.title) this.title = data.title;
        if (data.image) this.image = data.image;
        if (data.price !== undefined) this.price = data.price;
        return this.container;
    }
}