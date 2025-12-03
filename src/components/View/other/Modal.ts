import { View } from '../View';
import { EventEmitter } from '../../base/Events';

export class Modal extends View<{}> {
    private events: EventEmitter;
    private _closeButton: HTMLButtonElement | null;
    private _content: HTMLElement | null;

    constructor(container: HTMLElement, events: EventEmitter) {
        super(container);
        this.events = events;
        this._closeButton = this.findElement<HTMLButtonElement>('.modal__close');
        this._content = this.findElement('.modal__content');

        if (this._closeButton) {
            this._closeButton.addEventListener('click', () => {
                this.close();
            });
        }

        this.container.addEventListener('click', (event) => {
            if (event.target === this.container) {
                this.close();
            }
        });

        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && this.container.classList.contains('modal_active')) {
                this.close();
            }
        });
    }

    open(content?: HTMLElement): void {
        if (content && this._content) {
            this._content.innerHTML = '';
            this._content.appendChild(content);
        }
        this.setClass(this.container, 'modal_active', true);
        document.body.style.overflow = 'hidden';
    }

    close(): void {
        this.setClass(this.container, 'modal_active', false);
        document.body.style.overflow = '';
        this.events.emit('modal:close');
    }

    render(): HTMLElement {
        return this.container;
    }
}