import './scss/styles.scss';
import { Api } from './components/base/Api';
import { ProductList } from './components/Models/ProductList';
import { Basket } from './components/Models/Basket';
import { Buyer } from './components/Models/Buyer';
import { WebLarekApi } from './components/Api/WebLarekApi';
import { API_URL } from './utils/constants';

// Инициализация API
const api = new Api(API_URL);
const webLarekApi = new WebLarekApi(api);

// Создание экземпляров моделей
const productsModel = new ProductList();
const basketModel = new Basket();
const buyerModel = new Buyer();

// Тестирование моделей данных
console.log('=== Тестирование моделей данных ===');

// Тест ProductList
console.log('1. Тестирование ProductList:');
productsModel.setItems([]);
console.log('Пустой каталог:', productsModel.getItems());

// Тест Basket
console.log('2. Тестирование Basket:');
console.log('Корзина пуста:', basketModel.getItems());
console.log('Количество товаров в корзине:', basketModel.getCount());
console.log('Общая стоимость корзины:', basketModel.getTotal());

// Тест Buyer
console.log('3. Тестирование Buyer:');
console.log('Данные покупателя:', buyerModel.getData());
console.log('Валидация пустых данных:', buyerModel.validate());

buyerModel.setData({ email: 'test@test.ru' });
console.log('Данные после установки email:', buyerModel.getData());

// Запрос к серверу за товарами
console.log('=== Запрос к серверу ===');

webLarekApi.getProductList()
    .then((products) => {
        console.log('Получены товары с сервера:', products);
        
        // Сохраняем товары в модель
        productsModel.setItems(products);
        
        // Проверяем сохранение
        console.log('Товары в модели:', productsModel.getItems());
        
        // Тестируем методы с реальными данными
        if (products.length > 0) {
            const firstProduct = products[0];
            
            // Тест получения товара по ID
            console.log('Товар по ID:', productsModel.getItem(firstProduct.id));
            
            // Тест работы с корзиной
            basketModel.addItem(firstProduct);
            console.log('Товар добавлен в корзину');
            console.log('Количество товаров в корзине:', basketModel.getCount());
            console.log('Общая стоимость корзины:', basketModel.getTotal());
            console.log('Проверка наличия товара в корзине:', basketModel.contains(firstProduct.id));
            
            basketModel.removeItem(firstProduct.id);
            console.log('Товар удален из корзины');
            console.log('Количество товаров в корзине:', basketModel.getCount());
        }
    })
    .catch(error => {
        console.error('Ошибка при загрузке товаров:', error);
    });

// Для проверки в браузере - выводим модели в глобальную область видимости
declare global {
    interface Window {
        productsModel: ProductList;
        basketModel: Basket;
        buyerModel: Buyer;
        webLarekApi: WebLarekApi;
    }
}

window.productsModel = productsModel;
window.basketModel = basketModel;
window.buyerModel = buyerModel;
window.webLarekApi = webLarekApi;