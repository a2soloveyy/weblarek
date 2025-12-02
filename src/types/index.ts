export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

export interface IApi {
    get<T extends object>(uri: string): Promise<T>;
    post<T extends object>(uri: string, data: object, method?: ApiPostMethods): Promise<T>;
}

export interface IProduct {
    id: string;
    description: string;
    image: string;
    title: string;
    category: string;
    price: number | null;
}

export interface IBuyer {
    payment: 'card' | 'cash' | null;
    email: string;
    phone: string;
    address: string;
}

export interface IOrder extends IBuyer{
    total: number;
    items: string[];
}

export interface OrderResult {
    id: string;
    total: number;
}

export type ValidationErrors<T> = {
    [K in keyof T]?: string;
};

export interface ItemsChangedEvent {
    items: IProduct[];
}

export interface SelectedItemChangedEvent {
    item: IProduct | null;
}

export interface BasketChangedEvent {
    items: IProduct[];
}

export interface BuyerChangedEvent {
    buyer: IBuyer;
}

export interface CardSelectEvent {
    product: string;
}

export interface CardActionEvent {
    product: string;
}

export interface PaymentChangeEvent {
    payment: 'card' | 'cash';
}

export interface AddressChangeEvent {
    address: string;
}

export interface EmailChangeEvent {
    email: string;
}

export interface PhoneChangeEvent {
    phone: string;
}
export interface IValidationErrors {
    payment?: string;
    email?: string;
    phone?: string;
    address?: string;
}