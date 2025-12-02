import './scss/styles.scss';
import { Api } from './components/base/Api';
import { EventEmitter } from './components/base/Events';
import { ProductList } from './components/Models/ProductList';
import { Basket } from './components/Models/Basket';
import { Buyer } from './components/Models/Buyer';
import { WebLarekApi } from './components/Api/WebLarekApi';
import { API_URL } from './utils/constants';

// Импорты представлений
import { CardCatalog } from './components/View/cards/CardCatalog';
import { CardPreview } from './components/View/cards/CardPreview';
import { BasketView } from './components/View/other/BasketView';
import { OrderForm } from './components/View/forms/OrderForm';
import { ContactsForm } from './components/View/forms/ContactsForm';
import { SuccessView } from './components/View/other/SuccessView';
import { Modal } from './components/View/other/Modal';
import { Header } from './components/View/other/Header';
import { IOrder } from './types';

// Инициализация EventEmitter и API
const events = new EventEmitter();
const api = new Api(API_URL);
const webLarekApi = new WebLarekApi(api);

// Модели
const productsModel = new ProductList(events);
const basketModel = new Basket(events);
const buyerModel = new Buyer(events);

// Глобальные переменные для представлений
let gallery: HTMLElement;
let modal: Modal;
let header: Header;
let basketView: BasketView;
let orderForm: OrderForm;
let contactsForm: ContactsForm;
let successView: SuccessView;

// Инициализация представлений
const initViews = () => {
    console.log('Инициализация представлений...');

    // Галерея
    gallery = document.querySelector('.gallery') as HTMLElement;
    if (!gallery) {
        console.error('Не найден элемент .gallery');
        return;
    }

    // Header
    const headerContainer = document.querySelector('.header') as HTMLElement;
    if (headerContainer) {
        header = new Header(headerContainer, events);
    }

    // Модальное окно
    const modalContainer = document.getElementById('modal-container') as HTMLElement;
    if (modalContainer) {
        modal = new Modal(modalContainer, events);
    }

    // Корзина
    const basketTemplate = document.getElementById('basket') as HTMLTemplateElement;
    if (basketTemplate) {
        const fragment = basketTemplate.content.cloneNode(true) as DocumentFragment;
        const basketElement = fragment.firstElementChild as HTMLElement;
        if (basketElement) {
            basketView = new BasketView(basketElement, events);
        }
    }

    // Форма заказа
    const orderTemplate = document.getElementById('order') as HTMLTemplateElement;
    if (orderTemplate) {
        const fragment = orderTemplate.content.cloneNode(true) as DocumentFragment;
        const orderElement = fragment.firstElementChild as HTMLElement;
        if (orderElement) {
            orderForm = new OrderForm(orderElement, events);
        }
    }

    // Форма контактов
    const contactsTemplate = document.getElementById('contacts') as HTMLTemplateElement;
    if (contactsTemplate) {
        const fragment = contactsTemplate.content.cloneNode(true) as DocumentFragment;
        const contactsElement = fragment.firstElementChild as HTMLElement;
        if (contactsElement) {
            contactsForm = new ContactsForm(contactsElement, events);
        }
    }

    // Успешный заказ
    const successTemplate = document.getElementById('success') as HTMLTemplateElement;
    if (successTemplate) {
        const fragment = successTemplate.content.cloneNode(true) as DocumentFragment;
        const successElement = fragment.firstElementChild as HTMLElement;
        if (successElement) {
            successView = new SuccessView(successElement, events);
        }
    }

    console.log('Представления инициализированы');
};

// Инициализация и запуск приложения
const initApp = () => {
    console.log('Инициализация приложения...');

    // Инициализация представлений
    initViews();

    // Запрос к серверу за товарами
    webLarekApi.getProductList()
        .then((products) => {
            console.log('Товары получены с сервера:', products.length, 'шт.');
            productsModel.setItems(products);
        })
        .catch(error => {
            console.error('Ошибка при загрузке товаров:', error);
            console.log('Используем пустой каталог для демонстрации');
            productsModel.setItems([]);
        });
};

// Запуск приложения после загрузки DOM
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}

// Обработчики событий

// При изменении каталога товаров - отображаем карточки
events.on('itemsChanged', () => {
    console.log('Обработка itemsChanged...');
    const items = productsModel.getItems();

    if (!gallery) {
        console.error('Галерея не инициализирована');
        return;
    }

    gallery.innerHTML = '';

    items.forEach(item => {
        const template = document.getElementById('card-catalog') as HTMLTemplateElement;
        if (!template) {
            console.error('Шаблон card-catalog не найден');
            return;
        }

        const fragment = template.content.cloneNode(true) as DocumentFragment;
        const cardElement = fragment.firstElementChild as HTMLElement;
        if (!cardElement) {
            console.error('Не удалось извлечь элемент из шаблона card-catalog');
            return;
        }

        const card = new CardCatalog(cardElement, events);
        card.render(item);
        gallery.appendChild(cardElement);
    });

    console.log('Каталог обновлен:', items.length, 'товаров');
});


// В обработчике basketChanged:
events.on('basketChanged', () => {
    const count = basketModel.getCount();
    const items = basketModel.getItems();
    const total = basketModel.getTotal();

    // Обновляем счетчик в header
    if (header) {
        header.render({ counter: count });
    }

    // Обновляем представление корзины
    if (basketView) {
        basketView.render({ items, total });
    }
});

// В обработчике card:select:
events.on('card:select', (data: { product: string }) => {
    const product = productsModel.getItem(data.product);
    if (product && modal) {
        const inBasket = basketModel.contains(product.id);
        const template = document.getElementById('card-preview') as HTMLTemplateElement;
        if (template) {
            const fragment = template.content.cloneNode(true) as DocumentFragment;
            const previewElement = fragment.firstElementChild as HTMLElement;
            if (previewElement) {
                const cardPreview = new CardPreview(previewElement, events);

                cardPreview.render({
                    ...product,
                    inBasket,
                    price: product.price
                });

                modal.open(previewElement);
            }
        }
    }
});

// В обработчике card:add:
events.on('card:add', (data: { product: string }) => {
    const product = productsModel.getItem(data.product);
    if (product) {
        basketModel.addItem(product);
        if (modal) modal.close();
    }
});

// В обработчике card:remove:
events.on('card:remove', (data: { product: string }) => {
    basketModel.removeItem(data.product);
    if (modal) modal.close();
});

// В обработчике header:basketOpen:
events.on('header:basketOpen', () => {
    if (modal && basketView) {
        modal.open(basketView.render({
            items: basketModel.getItems(),
            total: basketModel.getTotal()
        }));
    }
});

events.on('basket:order', () => {
    console.log('Открываем форму заказа');
    
    if (modal && orderForm) {
        buyerModel.clear();

        const buyerData = buyerModel.getData();
        const orderFormElement = orderForm.render(buyerData);

        modal.open(orderFormElement);
        const errors = buyerModel.validate();
        const orderErrors = {
            payment: errors.payment,
            address: errors.address
        };
        const hasErrors = orderErrors.payment || orderErrors.address;
        orderForm.valid = !hasErrors;
        orderForm.errors = Object.values(orderErrors).filter(Boolean) as string[];
    }
});

// В обработчике contacts:submit:
events.on('contacts:submit', () => {
    const buyerData = buyerModel.getData();
    const order: IOrder = {
        payment: buyerData.payment as 'card' | 'cash',
        email: buyerData.email,
        phone: buyerData.phone,
        address: buyerData.address,
        total: basketModel.getTotal(),
        items: basketModel.getItems().map(item => item.id)
    };

    webLarekApi.orderProducts(order)
        .then((result) => {
            if (successView && modal) {
                successView.render({ total: result.total });
                modal.open(successView.render({ total: result.total }));
            }

            basketModel.clear();
            buyerModel.clear();
        })
        .catch((error) => {
            console.error('Ошибка оформления заказа:', error);
        });
});

// При закрытии успешного заказа
events.on('success:close', () => {
    if (modal) modal.close();
});

// При изменении способа оплаты
events.on('order:paymentChange', (data: { payment: 'card' | 'cash' }) => {
    buyerModel.setData({ payment: data.payment });
    
    if (orderForm) {
        const errors = buyerModel.validate();
        const orderErrors = {
            payment: errors.payment,
            address: errors.address
        };
        const hasErrors = orderErrors.payment || orderErrors.address;
        orderForm.valid = !hasErrors;
        orderForm.errors = Object.values(orderErrors).filter(Boolean) as string[];
    }
});

// При изменении адреса
events.on('order:addressChange', (data: { address: string }) => {
    buyerModel.setData({ address: data.address });
    
    if (orderForm) {
        const errors = buyerModel.validate();
        const orderErrors = {
            payment: errors.payment,
            address: errors.address
        };
        const hasErrors = orderErrors.payment || orderErrors.address;
        orderForm.valid = !hasErrors;
        orderForm.errors = Object.values(orderErrors).filter(Boolean) as string[];
    }
});

// При отправке формы заказа
events.on('order:submit', () => {
    console.log('Переход к форме контактов');
    
    if (modal && contactsForm) {
        const buyerData = buyerModel.getData();
        const contactsFormElement = contactsForm.render(buyerData);
        modal.open(contactsFormElement);
        
        // Обновляем валидацию для формы контактов
        const errors = buyerModel.validate();
        const contactsErrors = {
            email: errors.email,
            phone: errors.phone
        };
        const hasErrors = contactsErrors.email || contactsErrors.phone;
        contactsForm.valid = !hasErrors;
        contactsForm.errors = Object.values(contactsErrors).filter(Boolean) as string[];
    }
});

// При изменении email
events.on('contacts:emailChange', (data: { email: string }) => {
    buyerModel.setData({ email: data.email });

    // Валидация формы контактов
    if (contactsForm) {
        const errors = buyerModel.validate();
        const contactsErrors = {
            email: errors.email,
            phone: errors.phone
        };
        const hasErrors = contactsErrors.email || contactsErrors.phone;
        (contactsForm as any).valid = !hasErrors;
        (contactsForm as any).errors = Object.values(contactsErrors).filter(Boolean) as string[];
    }
});

// При изменении телефона
events.on('contacts:phoneChange', (data: { phone: string }) => {
    buyerModel.setData({ phone: data.phone });
    
    if (contactsForm) {
        const errors = buyerModel.validate();
        const contactsErrors = {
            email: errors.email,
            phone: errors.phone
        };
        const hasErrors = contactsErrors.email || contactsErrors.phone;
        contactsForm.valid = !hasErrors;
        contactsForm.errors = Object.values(contactsErrors).filter(Boolean) as string[];
    }
});

events.on('contacts:submit', () => {
    const buyerData = buyerModel.getData();

    if (!buyerData.payment || !buyerData.address || !buyerData.email || !buyerData.phone) {
        console.error('Не все данные заполнены');
        return;
    }

    const order: IOrder = {
        payment: buyerData.payment as 'card' | 'cash',
        email: buyerData.email,
        phone: buyerData.phone,
        address: buyerData.address,
        total: basketModel.getTotal(),
        items: basketModel.getItems().map(item => item.id)
    };

    events.on('basket:order', () => {
    if (modal && orderForm) {

        buyerModel.clear();
        
        modal.open(orderForm.render(buyerModel.getData()));
        
        const errors = buyerModel.validate();
        const orderErrors = {
            payment: errors.payment,
            address: errors.address
        };
        const hasErrors = orderErrors.payment || orderErrors.address;
        (orderForm as any).valid = !hasErrors;
        (orderForm as any).errors = Object.values(orderErrors).filter(Boolean) as string[];
    }
});

    console.log('Отправка заказа:', order);

    webLarekApi.orderProducts(order)
        .then((result) => {
            console.log('Заказ успешно оформлен:', result);
            if (successView && modal) {
                modal.open(successView.render({ total: result.total }));
            }

            basketModel.clear();
            buyerModel.clear();
        })
        .catch((error) => {
            console.error('Ошибка оформления заказа:', error);
        });
});
