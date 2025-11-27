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
productsModel.setItems(apiProducts.items);

console.log('Каталог товаров:', productsModel.getItems());
console.log('Количество товаров в каталоге:', productsModel.getItems().length);

// Получаем первый товар по ID
const firstProduct = apiProducts.items[0];
console.log('Товар по ID:', productsModel.getItem(firstProduct.id));

// Работа с выбранным товаром
productsModel.setSelectedItem(firstProduct);
console.log('Выбранный товар:', productsModel.getSelectedItem());

// Тест Basket
console.log('2. Тестирование Basket:');
console.log('Корзина пуста:', basketModel.getItems());
console.log('Количество товаров в корзине:', basketModel.getCount());
console.log('Общая стоимость корзины:', basketModel.getTotal());

// Добавляем товар
basketModel.addItem(firstProduct);
console.log('После добавления товара:', basketModel.getItems());
console.log('Количество товаров:', basketModel.getCount());
console.log('Общая стоимость:', basketModel.getTotal());
console.log('Проверка наличия товара:', basketModel.contains(firstProduct.id));

// Удаляем товар
basketModel.removeItem(firstProduct.id);
console.log('После удаления товара:', basketModel.getItems());
console.log('Количество товаров:', basketModel.getCount());

// Тест Buyer
console.log('3. Тестирование Buyer:');
console.log('Данные покупателя:', buyerModel.getData());
console.log('Валидация пустых данных:', buyerModel.validate());


// Устанавливаем частично
buyerModel.setData({ email: 'test@test.ru', payment: 'card' });
console.log('Данные после частичного обновления:', buyerModel.getData());
console.log('Валидация заполненных данных:', buyerModel.validate());

// Очищаем
buyerModel.clear();
console.log('Данные после очистки:', buyerModel.getData());
console.log('Валидация после очистки:', buyerModel.validate());

console.log('Данные после установки email:', buyerModel.getData());

// Запрос к серверу за товарами
console.log('=== Запрос к серверу ===');

webLarekApi.getProductList()
    .then((products) => {
        console.log('Получены товары с сервера:', products);
        
        // Сохраняем товары в модель
        productsModel.setItems(products);
        
        // Проверяем сохранение
        productsModel.setItems(apiProducts.items);
        console.log('Товары в модели:', productsModel.getItems());
    })
    
    .catch(error => {
        console.error('Ошибка при загрузке товаров:', error);
    });