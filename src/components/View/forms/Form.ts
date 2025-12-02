import { View } from '../View';

export abstract class Form<T> extends View<T> {
    protected _submitButton: HTMLButtonElement | null;
    protected _errors: HTMLElement | null;

    constructor(container: HTMLElement) {
        super(container);
        this._submitButton = this.findElement<HTMLButtonElement>('button[type="submit"]');
        this._errors = this.findElement('.form__errors');
    }

    set valid(value: boolean) {
        if (this._submitButton) {
            this.setDisabled(this._submitButton, !value);
        }
    }

    set errors(value: string[]) {
        if (this._errors) {
            this._errors.textContent = value.join(', ');
            this._errors.style.display = value.length > 0 ? 'block' : 'none';
        }
    }
    
    abstract render(data: Partial<T>): HTMLElement;
}