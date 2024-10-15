let cart = [];

function copyBarcode(barcode) {
  document.getElementById("search-bar").value = barcode;

  const dropdownContent = document.querySelector(".dropdown-content");
  dropdownContent.style.display = "none";
}

function toggleDropdown() {
  const dropdownContent = document.querySelector(".dropdown-content");
  dropdownContent.style.display =
    dropdownContent.style.display === "block" ? "none" : "block";
}

function getProductDetails(barcode) {
  const products = [
    { barcode: "# 986551", name: "MacBook Air", price: 1399.99 },
    { barcode: "# 698551", name: "HP Elite Book", price: 1299.99 },
    { barcode: "# 569851", name: "HP ENVY G7", price: 1099.99 },
  ];
  return products.find((product) => product.barcode === barcode);
}

function addToCart() {
  const barcode = document.getElementById("search-bar").value.trim();
  const errorMsg = document.getElementById("error-msg");

  if (barcode === "") {
    errorMsg.textContent = "Please enter a barcode.";
    errorMsg.style.display = "block";
    return;
  }

  const product = getProductDetails(barcode);

  if (product) {
    const productInCart = cart.find((item) => item.barcode === product.barcode);

    if (productInCart) {
      productInCart.quantity++;
    } else {
      product.quantity = 1;
      cart.push(product);
    }

    updateCart();

    document.getElementById("search-bar").value = "";

    errorMsg.style.display = "none";

    document.querySelector(".clear-btn").classList.remove("hidden");
    document.querySelector(".shopping-cart").classList.remove("hidden");
    document.querySelector(".summary-section").classList.remove("hidden");
  } else {
    errorMsg.textContent = "Product not found. Please check the barcode again.";
    errorMsg.style.display = "block";
  }
}

function updateCart() {
  const cartTableBody = document.querySelector(".cart-table tbody");
  cartTableBody.innerHTML = "";

  let subtotal = 0;

  cart.forEach((item) => {
    const total = item.price * item.quantity;
    subtotal += total;

    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${item.name}</td>
      <td> $${item.price.toFixed(2)} </td>
      <td class="quantity-table-section">

       <div class ="minus-quantity-box">
          <button class="minus-quantity-btn" onclick="updateQuantity('${
            item.barcode
          }', -1)"> - </button>
        </div>
       
        
        <div class="quantity-counter">
          <span> ${item.quantity} </span>
        </div>
        
         <div class ="add-quantity-box">
          <button class="add-quantity-btn" onclick="updateQuantity('${
            item.barcode
          }', 1)"> + </button>
        </div>
        
      
      </td>
      
      <td>$${total.toFixed(2)} </td>`;

    cartTableBody.appendChild(row);
  });

  const gst = subtotal * 0.16;
  const discount = (subtotal + gst) * 0.1;
  let grandTotal = subtotal + gst - discount;

  document.getElementById("subtotal").textContent = `$${subtotal.toFixed(2)}`;
  document.getElementById("gst").textContent = `$${gst.toFixed(2)}`;
  document.getElementById("discount").textContent = `$${discount.toFixed(2)}`;
  document.getElementById("grand-total").textContent = `$${grandTotal.toFixed(
    2
  )} `;

  const summarySection = document.querySelector(".summary-section");
    if (cart.length === 0) {
        summarySection.style.display = "none";
    } else {
        summarySection.style.display = "block"; 
    }
}

function updateQuantity(barcode, amount) {
  const product = cart.find((item) => item.barcode === barcode);
  if (product) {
    product.quantity += amount;

    if (product.quantity <= 0) {
      cart = cart.filter((item) => item.barcode !== barcode);
    }

    updateCart();
  }
}

function clearProduct() {
  const confirmClear = confirm("Are you sure you want to clear the cart?");
  if (confirmClear) {
    cart = [];
    updateCart();
    document.getElementById("search-bar").value = "";
    document.getElementById("error-msg").style.display = "none";
    document.querySelector(".clear-btn").classList.add("hidden");
    document.querySelector(".summary-section").classList.add("hidden");
  }
}

function confirmOrder() {
  if (cart.length === 0) {
    alert("Your cart is empty!");
    return;
  }

  const confirmAction = confirm("Are you sure you want to confirm the order?");
  if (confirmAction) {
    localStorage.setItem("cart", JSON.stringify(cart));
    localStorage.setItem(
      "subtotal",
      document.getElementById("subtotal").innerText
    );
    localStorage.setItem("gst", document.getElementById("gst").innerText);
    localStorage.setItem(
      "discount",
      document.getElementById("discount").innerText
    );
    localStorage.setItem(
      "grand-total",
      document.getElementById("grand-total").innerText
    );

    window.location.href = "invoice.html";
  }
}
