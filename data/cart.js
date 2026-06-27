export let cart;

loadFromStorage();

export function loadFromStorage() {
cart = JSON.parse(localStorage.getItem('cart')) ||
[
  {
    productId: "e43638ce-6aa0-4b85-b27f-e1d07eb678c6",
    quantity: 2,
    deliveryOptionId: '1'
  },
  {
    productId: "15b6fc6f-327a-4ec4-896f-486349e85a3d",
    quantity: 1,
    deliveryOptionId: '2'
  }
];
}

function saveToStorage() {
  localStorage.setItem('cart', JSON.stringify(cart));
}

export function addToCart(productId) {
  let matchingItem;
  let quantitySelector;
  let quantity;
  let cartQuantity = calculateCartQuantity();
  quantitySelector = document.querySelector(`.js-quantity-selector-${productId}`);
  if (quantitySelector) {
    quantity = Number(quantitySelector.value);
  } else {
    quantity = 1;
  }
  //to check whether the item is already in the cart
  cart.forEach((cartItem) => {
    if(productId===cartItem.productId){
      matchingItem=cartItem;
    }
  });
  if(cartQuantity + quantity > 1000){
    alert("The cart is full!");
    return;
  }
  if(matchingItem){
    //to limit cartquantity
    if(matchingItem.quantity + quantity > 50){
      alert("The maximum limit of a same product is reached!");
      document.querySelector(`.js-added-to-cart-${productId}`)
        .classList.remove('added-to-cart-msg');
      return;
    }
    matchingItem.quantity+=quantity;
  }
  else{
    cart.push({
      productId:productId,
      quantity:quantity,
      deliveryOptionId: '1'
    });
  }
  saveToStorage();
}

export function removeFromCart(productId) {
  let newCart = [];

  cart.forEach((cartItem) => {
    if(cartItem.productId !== productId) {
      newCart.push(cartItem);
    }
  });
  cart = newCart;
  saveToStorage();
}

export function calculateCartQuantity() {
  let cartQuantity=0;
  cart.forEach((cartItem) => {
    cartQuantity+=cartItem.quantity;
  });
  saveToStorage();
  return cartQuantity;
}

export function updateQuantity(productId, newQuantity){
  let matchingItem;
  cart.forEach((cartItem) => {
    if(productId === cartItem.productId){
      matchingItem = cartItem;
    }
  });
  matchingItem.quantity = newQuantity;
  saveToStorage();
}

export function updateDeliveryOption(productId, deliveryOptionId) {
  let matchingItem;
  cart.forEach((cartItem) => {
    if(productId === cartItem.productId){
      matchingItem = cartItem;
    }
  });
  matchingItem.deliveryOptionId = deliveryOptionId;
  saveToStorage();
}

export function loadCart(fun) {
  const xhr = new XMLHttpRequest();

  xhr.addEventListener('load', () => {
    console.log('load cart');
    fun();
  });
  xhr.open('GET', 'https://supersimplebackend.dev/cart/');
  xhr.send();
}

export function clearCart() {
  cart = [];
  saveToStorage();
}
