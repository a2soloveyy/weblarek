import { IApi, IProduct, IOrder, OrderResult } from '../../types';

export class WebLarekApi {
    constructor(private baseApi: IApi) {}

    async getProductList(): Promise<IProduct[]> {
        const response = await this.baseApi.get<{ items: IProduct[] }>('/api/product');
        return response.items;
    }

    async orderProducts(order: IOrder): Promise<OrderResult> {
        return await this.baseApi.post<OrderResult>('/api/order', order);
    }
}