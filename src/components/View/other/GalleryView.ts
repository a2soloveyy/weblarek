import { View } from '../View';
import { IProduct } from '../../../types';
import { EventEmitter } from '../../base/Events';
import { CDN_URL, categoryMap } from '../../../utils/constants';

interface GalleryData {
    items: IProduct[];
}

export class GalleryView extends View<GalleryData> {
    private events: EventEmitter;

    constructor(container: HTMLElement, events: EventEmitter) {
        super(container);
        this.events = events;
    }

    render(data: GalleryData): HTMLElement {
        this.container.innerHTML = '';

        data.items.forEach(item => {
            const template = document.getElementById('card-catalog') as HTMLTemplateElement;
            if (!template) return;

            const fragment = template.content.cloneNode(true) as DocumentFragment;
            const cardElement = fragment.firstElementChild as HTMLElement;
            if (!cardElement) return;

            
            const CatalogCard = class {
                private container: HTMLElement;
                private events: EventEmitter;
                private _title: HTMLElement | null;
                private _image: HTMLImageElement | null;
                private _price: HTMLElement | null;
                private _category: HTMLElement | null;

                constructor(container: HTMLElement, events: EventEmitter) {
                    this.container = container;
                    this.events = events;
                    this._title = container.querySelector('.card__title');
                    this._image = container.querySelector('.card__image');
                    this._price = container.querySelector('.card__price');
                    this._category = container.querySelector('.card__category');
                    
                    this.container.addEventListener('click', () => {
                        this.events.emit('card:select', { product: this.container.dataset.id || '' });
                    });
                }

                set category(value: string) {
                    if (this._category) {
                        this._category.textContent = value;
                        
                        Object.values(categoryMap).forEach(className => {
                            this._category!.classList.remove(className);
                        });
                        
                        const modifier = categoryMap[value as keyof typeof categoryMap];
                        if (modifier) {
                            this._category.classList.add(modifier);
                        }
                    }
                }

                set title(value: string) {
                    if (this._title) this._title.textContent = value;
                }

                set image(value: string) {
                    if (this._image && value) {
                        const cleanValue = value.startsWith('/') ? value : `/${value}`;
                        this._image.src = `${CDN_URL}${cleanValue}`;
                        this._image.alt = this._title?.textContent || '';
                    }
                }

                set price(value: number | null) {
                    if (this._price) {
                        if (value === null) {
                            this._price.textContent = 'Бесценно';
                        } else {
                            this._price.textContent = `${value} синапсов`;
                        }
                    }
                }

                render(data: IProduct): HTMLElement {
                    if (data.category) this.category = data.category;
                    if (data.title) this.title = data.title;
                    if (data.image) this.image = data.image;
                    if (data.price !== undefined) this.price = data.price;
                    
                    this.container.dataset.id = data.id;
                    return this.container;
                }
            };

            const card = new CatalogCard(cardElement, this.events);
            card.render(item);
            this.container.appendChild(cardElement);
        });

        return this.container;
    }
}