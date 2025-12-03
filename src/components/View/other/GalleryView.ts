import { View } from '../View';

interface GalleryData {
    items: HTMLElement[];
}

export class GalleryView extends View<GalleryData> {
    constructor(container: HTMLElement) {
        super(container);
    }

    render(data: GalleryData): HTMLElement {
        this.container.innerHTML = '';
        
        data.items.forEach(item => {
            this.container.appendChild(item);
        });

        return this.container;
    }
}