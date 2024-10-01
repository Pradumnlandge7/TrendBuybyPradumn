const btnCart = document.querySelector('#cart-icon');
const cart = document.querySelector('.cart');
const btnClose = document.querySelector('#cart-close');

// Open and close cart
btnCart.addEventListener('click', () => {
  console.log('Cart button clicked'); // Debugging
  cart.classList.add('cart-active');
});

btnClose.addEventListener('click', () => {
  console.log('Cart closed'); // Debugging
  cart.classList.remove('cart-active');
});

// Load initial food content when DOM is ready
document.addEventListener('DOMContentLoaded', loadFood);

function loadFood() {
  loadContent();
}

function loadContent() {
  // Remove Food Items From Cart
  let btnRemove = document.querySelectorAll('.cart-remove');
  btnRemove.forEach((btn) => {
    btn.addEventListener('click', removeItem);
  });

  // Product Item Change Event (Quantity Change)
  let qtyElements = document.querySelectorAll('.cart-quantity');
  qtyElements.forEach((input) => {
    input.addEventListener('change', changeQty);
  });

  // Add Product to Cart
  let cartBtns = document.querySelectorAll('.add-cart');
  cartBtns.forEach((btn) => {
    btn.addEventListener('click', addCart);
  });

  updateTotal();
}

// Remove Item
function removeItem() {
  const cartItem = this.parentElement;
  const title = cartItem.querySelector('.cart-food-title').innerHTML;

  // Remove the item from the itemList array
  itemList = itemList.filter(el => el.title !== title);

  // Remove the cart item from the DOM
  cartItem.remove();

  // Update the total after removing the item
  updateTotal();
}

// Change Quantity
function changeQty() {
  if (isNaN(this.value) || this.value < 1) {
    this.value = 1; // Default to 1 if invalid quantity
  }
  updateTotal(); // Recalculate total when quantity changes
}

let itemList = []; // Store items added to cart

// Add Item to Cart
function addCart() {
  let food = this.parentElement;
  let title = food.querySelector('.food-title').innerHTML;
  let price = parseFloat(food.querySelector('.food-price').innerHTML.replace("Rs.", "").replace(/,/g, "")); // Remove commas and Rs., then parse float
  let imgSrc = food.querySelector('.food-img').src;

  let newProduct = { title, price, imgSrc };

  console.log('Adding product:', newProduct); // Debugging

  // Check if product is already in the cart
  if (itemList.find((el) => el.title === newProduct.title)) {
    alert("Product already added to Cart");
    return;
  } else {
    itemList.push(newProduct);
  }

  let newProductElement = createCartProduct(title, price, imgSrc);
  let element = document.createElement('div');
  element.innerHTML = newProductElement;
  let cartBasket = document.querySelector('.cart-content');
  cartBasket.appendChild(element); // Use appendChild instead of append

  loadContent(); // Re-bind events for the new cart item
  updateTotal(); // Recalculate total after adding new item
}

// Create Cart Product Item
function createCartProduct(title, price, imgSrc) {
  return `
    <div class="cart-box">
      <img src="${imgSrc}" class="cart-img">
      <div class="detail-box">
        <div class="cart-food-title">${title}</div>
        <div class="price-box">
          <div class="cart-price">Rs.${price.toFixed(2)}</div>
          <div class="cart-amt">Rs.${price.toFixed(2)}</div>
        </div>
        <input type="number" value="1" class="cart-quantity">
      </div>
      <ion-icon name="trash" class="cart-remove"></ion-icon>
    </div>
  `;
}

// Update Total and Item Count in Cart
function updateTotal() {
  const cartItems = document.querySelectorAll('.cart-box');
  const totalValue = document.querySelector('.total-price');

  let total = 0;

  cartItems.forEach(product => {
    let priceElement = product.querySelector('.cart-price');
    let price = parseFloat(priceElement.innerHTML.replace("Rs.", "").replace(/,/g, "")); // Remove commas and Rs.
    let qty = product.querySelector('.cart-quantity').value;
    total += (price * qty);
    product.querySelector('.cart-amt').innerText = "Rs." + (price * qty).toFixed(2);
  });

  totalValue.innerHTML = 'Rs.' + total.toFixed(2);

  // Update product count in cart icon
  const cartCount = document.querySelector('.cart-count');
  let count = itemList.length;
  cartCount.innerHTML = count;

  if (count === 0) {
    cartCount.style.display = 'none';
  } else {
    cartCount.style.display = 'block';
  }
}
