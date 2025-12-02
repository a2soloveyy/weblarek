import { Component } from '../base/Component';

export abstract class View<T> extends Component<T> {
    protected constructor(container: HTMLElement) {
        super(container);
    }

    protected findElement<K extends HTMLElement>(selector: string): K | null {
        return this.container.querySelector(selector);
    }

    protected findAllElements<K extends HTMLElement>(selector: string): NodeListOf<K> {
        return this.container.querySelectorAll(selector);
    }

    protected setText(element: HTMLElement | null, value: string) {
        if (element) element.textContent = value;
    }

    protected setDisabled(element: HTMLButtonElement | null, disabled: boolean) {
        if (element) element.disabled = disabled;
    }

    protected setVisible(element: HTMLElement | null, visible: boolean) {
        if (element) element.style.display = visible ? '' : 'none';
    }

    protected setClass(element: HTMLElement | null, className: string, enabled: boolean) {
        if (element) {
            if (enabled) {
                element.classList.add(className);
            } else {
                element.classList.remove(className);
            }
        }
    }

    protected setImage(element: HTMLImageElement | null, src: string, alt: string) {
        if (element) {
            element.src = src;
            element.alt = alt;
        }
    }
}