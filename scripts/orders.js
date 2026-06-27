import { orders } from '../data/orders.js';
import { getProduct, loadProductsFetch } from '../data/products.js';
import { calculateCartQuantity, addToCart } from '../data/cart.js';
import dayjs from "https://unpkg.com/dayjs@1.11.10/esm/index.js";
import { getDeliveryOption, calculateDeliveryDate } from '../data/deliveryOptions.js';

async function loadPage() {
  await loadProductsFetch();
  renderOrders();
}

function renderOrders() {
  let ordersHTML = '';

  orders.forEach((order) => {
    const orderDate = dayjs(order.orderTime).format('MMMM D');
    
    let productsListHTML = '';

    order.products.forEach((productDetails) => {
      const product = getProduct(productDetails.productId);
      const deliveryOption = getDeliveryOption(productDetails.deliveryOptionId);
      
      // Calculate delivery date relative to order time
      const estimatedDelivery = dayjs(order.orderTime).add(deliveryOption.deliveryDays, 'day').format('MMMM D');

      productsListHTML += `
        <div class="product-image-container">
          <img src="${product.image}">
        </div>
        <div class="product-details">
          <div class="product-name products-name-in-2-lines">
            ${product.name}
          </div>
          <div class="product-delivery-date">
            Arriving on: ${estimatedDelivery}
          </div>
          <div class="product-quantity">
            Quantity: ${productDetails.quantity}
          </div>
          <button class="buy-again-button button-primary js-buy-again" data-product-id="${product.id}">
            <img src="images/buy-again.png">
            <span class="buy-again-message">Buy it again</span>
          </button>
        </div>
        <div class="product-actions">
          <a href="tracking.html?orderId=${order.id}&productId=${product.id}">
            <button class="track-package-button button-secondary">
              Track package
            </button>
          </a>
        </div>
      `;
    });

    ordersHTML += `
      <div class="order-container">
        <div class="order-header">
          <div class="order-header-left-section">
            <div class="order-date-container">
              <div class="order-date">Order Placed:</div>
              <div>${orderDate}</div>
            </div>
            <div class="total">
              <div class="total-line">Total:</div>
              <div>&#x20B9 ${order.totalCost.toFixed(2)}</div>
            </div>
          </div>
          <div class="order-id-container">
            <div class="order-id-line">Order ID:</div>
            <div>${order.id}</div>
          </div>
        </div>
        <div class="order-details-grid">
          ${productsListHTML}
        </div>
      </div>
    `;
  });

  const grid = document.querySelector('.js-orders-grid');
  if (grid) {
    grid.innerHTML = ordersHTML || '<p>No orders placed yet.</p>';
  }

  document.querySelectorAll('.js-buy-again').forEach((button) => {
    button.addEventListener('click', () => {
      const productId = button.dataset.productId;
      addToCart(productId);
      updateCartQuantity();
      
      // Optional: Give feedback
      const originalText = button.innerHTML;
      button.innerHTML = 'Added';
      setTimeout(() => {
        button.innerHTML = originalText;
      }, 1500);
    });
  });

  updateCartQuantity();
}

function updateCartQuantity() {
  const cartQuantity = calculateCartQuantity();
  const quantityEl = document.querySelector('.js-cart-quantity');
  if (quantityEl) {
    quantityEl.innerHTML = cartQuantity > 0 ? cartQuantity : '';
  }
}

loadPage();
