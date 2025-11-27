import './scss/styles.scss';
import { Api } from './components/base/Api';
import { ProductList } from './components/Models/ProductList';
import { Basket } from './components/Models/Basket';
import { Buyer } from './components/Models/Buyer';
import { WebLarekApi } from './components/Api/WebLarekApi';
import { API_URL } from './utils/constants';
import { apiProducts } from './utils/data';

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
const testProducts = apiProducts.items || apiProducts;
productsModel.setItems(testProducts);
console.log('Каталог товаров:', productsModel.getItems());

// Тест Basket
console.log('2. Тестирование Basket:');
console.log('Корзина пуста:', basketModel.getItems());
console.log('Количество товаров в корзине:', basketModel.getCount());
console.log('Общая стоимость корзины:', basketModel.getTotal());

// Тест Buyer
console.log('3. Тестирование Buyer:');
console.log('Данные покупателя:', buyerModel.getData());
console.log('Валидация пустых данных:', buyerModel.validate());

buyerModel.setData({ 
    payment: 'card', 
    email: 'test@test.ru', 
    phone: '+79999999999', 
    address: 'Test Address' 
});

console.log('Данные после установки email:', buyerModel.getData());
console.log('Валидация заполненных данных:', buyerModel.validate());

buyerModel.setData({ email: 'new@test.ru' });
console.log('Данные после частичного обновления:', buyerModel.getData());

buyerModel.clear();
console.log('Данные после очистки:', buyerModel.getData());

// Запрос к серверу за товарами
console.log('=== Запрос к серверу ===');

webLarekApi.getProductList()
    .then((products) => {
        console.log('Получены товары с сервера:', products);
        
        // Сохраняем товары в модель
        productsModel.setItems(products);
        
        // Проверяем сохранение
        console.log('Товары в модели:', productsModel.getItems());
    })
    
    .catch(error => {
        console.error('Ошибка при загрузке товаров:', error);
    });
