/* ESTADO GLOBAL DE LA APLICACIÓN */
const order = {
  drink: null,
  basePrice: 0,
  size: "Mediano",
  sizeExtra: 300,
  intensity: "Media",
  intensityExtra: 0,
  sugar: 0,
  extraMilk: false,
  credit: 0,
  total: 0,
  preparing: false,
  completed: false,
  discountPercent: 0,
  appliedCoupon: null
};

const COUPONS = { "CAFE10": 0.10, "DESCUENTO20": 0.20 };
let exactPayMode = false;
let sessionCount = 0;
let loyaltyCount = 0;
let historyEntries = [];

/* ELEMENTOS DEL DOM */
const drinkCards = document.querySelectorAll(".drink-card");
const sizeButtons = document.querySelectorAll(".size-buttons button");
const intensityButtons = document.querySelectorAll(".intensity-buttons button");
const milkButtons = document.querySelectorAll(".milk-buttons button");
const moneyButtons = document.querySelectorAll(".money-buttons button");
const decreaseSugarButton = document.querySelector("#decrease-sugar");
const increaseSugarButton = document.querySelector("#increase-sugar");
const prepareButton = document.querySelector("#prepare-button");
const cancelButton = document.querySelector("#cancel-button");
const resetButton = document.querySelector("#reset-button");
const sugarCount = document.querySelector("#sugar-count");
const orderTitle = document.querySelector("#order-title");
const orderSize = document.querySelector("#order-size");
const orderIntensity = document.querySelector("#order-intensity");
const orderSugar = document.querySelector("#order-sugar");
const orderMilk = document.querySelector("#order-milk");
const orderTotal = document.querySelector("#order-total");
const orderCredit = document.querySelector("#order-credit");
const creditHelp = document.querySelector("#credit-help");
const machineMessage = document.querySelector("#machine-message");
const changeMessage = document.querySelector("#change-message");
const sessionCountEl = document.querySelector("#session-count");
const historyList = document.querySelector("#history-list");

const stockByDrink = new Map();

/* OBSERVER PARA DESTACAR EL ENLACE DEL NAVBAR SEGÚN EL SCROLL */
const sections = document.querySelectorAll("section[id]");
const navLinks = document.querySelectorAll(".navbar-nav .nav-link");

const observerOptions = {
  root: null,
  rootMargin: "-20% 0px -60% 0px",
  threshold: 0
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const activeId = entry.target.getAttribute("id");
      navLinks.forEach((link) => {
        link.classList.toggle("is-active", link.getAttribute("href") === `#${activeId}`);
      });
    }
  });
}, observerOptions);

sections.forEach((section) => observer.observe(section));

/* MÉTODOS DE PERSISTENCIA Y FORMATO */
function formatMoney(amount) {
  return `$${new Intl.NumberFormat("es-AR").format(amount)}`;
}

function showMachineMessage(message) {
  machineMessage.innerHTML = '<span class="status-light" aria-hidden="true"></span>' + message;
}

function markSelected(buttons, selectedButton) {
  buttons.forEach((button) => button.classList.toggle("is-active", button === selectedButton));
}

function saveStateToLocalStorage() {
  const stockObj = {};
  stockByDrink.forEach((val, key) => { stockObj[key] = val; });
  localStorage.setItem("coffeeMachine_stock", JSON.stringify(stockObj));
  localStorage.setItem("coffeeMachine_sessionCount", sessionCount.toString());
  localStorage.setItem("coffeeMachine_historyEntries", JSON.stringify(historyEntries));
  localStorage.setItem("coffeeMachine_loyaltyCount", loyaltyCount.toString());
  localStorage.setItem("coffeeMachine_exactPay", exactPayMode.toString());
}

function renderStock(card) {
  const drinkName = card.dataset.drink;
  const stock = stockByDrink.get(drinkName);
  const stockNote = card.querySelector(".stock-note");
  const chooseButton = card.querySelector(".drink-content button");
  const soldOut = stock <= 0;

  stockNote.textContent = soldOut ? "Agotado" : `Quedan ${stock}`;
  card.classList.toggle("is-soldout", soldOut);
  chooseButton.textContent = soldOut ? "Agotado" : "Elegir";
  chooseButton.disabled = soldOut;
}

function loadStateFromLocalStorage() {
  const savedSessionCount = localStorage.getItem("coffeeMachine_sessionCount");
  if (savedSessionCount !== null) {
    sessionCount = parseInt(savedSessionCount, 10);
    sessionCountEl.textContent = sessionCount;
  }

  const savedLoyaltyCount = localStorage.getItem("coffeeMachine_loyaltyCount");
  if (savedLoyaltyCount !== null) {
    loyaltyCount = parseInt(savedLoyaltyCount, 10);
  }

  const savedExactPay = localStorage.getItem("coffeeMachine_exactPay");
  if (savedExactPay !== null) {
    exactPayMode = savedExactPay === "true";
    document.querySelector("#exact-pay-toggle").checked = exactPayMode;
  }

  const savedHistory = localStorage.getItem("coffeeMachine_historyEntries");
  if (savedHistory) {
    try { historyEntries = JSON.parse(savedHistory); } catch (e) { historyEntries = []; }
  }

  const savedStock = localStorage.getItem("coffeeMachine_stock");
  let parsedStock = null;
  if (savedStock) {
    try { parsedStock = JSON.parse(savedStock); } catch(e) {}
  }

  drinkCards.forEach((card) => {
    const drinkName = card.dataset.drink;
    const initialStock = Number(card.dataset.stock);
    const actualStock = (parsedStock && parsedStock[drinkName] !== undefined) ? parsedStock[drinkName] : initialStock;
    stockByDrink.set(drinkName, actualStock);
    renderStock(card);
  });

  updateLoyaltyUI();
  renderHistory();
}

function reduceStock(drinkName) {
  const remaining = stockByDrink.get(drinkName) - 1;
  stockByDrink.set(drinkName, Math.max(remaining, 0));
  drinkCards.forEach((card) => {
    if (card.dataset.drink === drinkName) renderStock(card);
  });
  saveStateToLocalStorage();
}

function calculateTotal() {
  if (!order.drink) { order.total = 0; return; }
  const milkExtra = order.extraMilk ? 300 : 0;
  let subtotal = order.basePrice + order.sizeExtra + order.intensityExtra + milkExtra;
  if (order.discountPercent > 0) subtotal = Math.round(subtotal * (1 - order.discountPercent));
  order.total = Math.max(0, subtotal);
}

function updateSummary() {
  calculateTotal();
  orderTitle.textContent = order.drink || "Sin selección";
  orderSize.textContent = order.size;
  orderIntensity.textContent = `Intensidad ${order.intensity.toLowerCase()}`;
  orderSugar.textContent = order.sugar === 0 ? "Sin azúcar" : `${order.sugar} de azúcar`;
  orderMilk.textContent = order.extraMilk ? "Con leche extra" : "Sin leche extra";
  orderTotal.textContent = formatMoney(order.total);
  orderCredit.textContent = formatMoney(order.credit);
  updatePurchaseState();
}

document.querySelector("#exact-pay-toggle").addEventListener("change", (e) => {
  exactPayMode = e.target.checked;
  saveStateToLocalStorage();
  updateSummary();
});

function updatePurchaseState() {
  const hasDrink = order.drink !== null;
  const hasEnoughCredit = exactPayMode ? order.credit === order.total : order.credit >= order.total;
  const canPrepare = hasDrink && hasEnoughCredit && !order.preparing && !order.completed;

  prepareButton.disabled = !canPrepare;
  cancelButton.disabled = (!hasDrink && order.credit === 0) || order.preparing || order.completed;

  if (!hasDrink) {
    creditHelp.textContent = "Elegí una bebida";
    changeMessage.textContent = "Elegí una bebida para comenzar.";
    showMachineMessage("Elegí una bebida");
  } else if (!hasEnoughCredit) {
    creditHelp.textContent = `Faltan ${formatMoney(order.total - order.credit)}`;
    showMachineMessage("Crédito insuficiente");
  } else if (!order.preparing && !order.completed) {
    creditHelp.textContent = "Pago completo";
    showMachineMessage("Lista para preparar");
  }
}

/* LISTENERS DE EVENTOS DE COMPRA */
drinkCards.forEach((card) => {
  card.querySelector("button").addEventListener("click", () => {
    if (order.preparing || order.completed || card.classList.contains("is-soldout")) return;
    drinkCards.forEach((c) => c.classList.remove("is-selected"));
    card.classList.add("is-selected");
    order.drink = card.dataset.drink;
    order.basePrice = Number(card.dataset.price);
    updateSummary();
  });
});

sizeButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    if (order.preparing || order.completed) return;
    markSelected(sizeButtons, btn);
    order.size = btn.dataset.size;
    order.sizeExtra = Number(btn.dataset.extra);
    updateSummary();
  });
});

intensityButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    if (order.preparing || order.completed) return;
    markSelected(intensityButtons, btn);
    order.intensity = btn.dataset.intensity;
    order.intensityExtra = Number(btn.dataset.extra);
    updateSummary();
  });
});

decreaseSugarButton.addEventListener("click", () => {
  if (order.sugar > 0 && !order.preparing && !order.completed) {
    order.sugar--;
    sugarCount.textContent = order.sugar;
    updateSummary();
  }
});

increaseSugarButton.addEventListener("click", () => {
  if (order.sugar < 5 && !order.preparing && !order.completed) {
    order.sugar++;
    sugarCount.textContent = order.sugar;
    updateSummary();
  }
});

milkButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    if (order.preparing || order.completed) return;
    markSelected(milkButtons, btn);
    order.extraMilk = btn.dataset.milk === "true";
    updateSummary();
  });
});

moneyButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    if (order.preparing || order.completed) return;
    order.credit += Number(btn.dataset.amount);
    updateSummary();
  });
});

document.querySelector("#apply-coupon-btn").addEventListener("click", () => {
  const code = document.querySelector("#coupon-input").value.trim().toUpperCase();
  const msg = document.querySelector("#coupon-message");
  if (COUPONS[code] !== undefined) {
    order.discountPercent = COUPONS[code];
    msg.textContent = `¡Cupón aplicado (${COUPONS[code] * 100}% OFF)!`;
    msg.className = "coupon-message success";
    updateSummary();
  } else {
    msg.textContent = "Código inválido.";
    msg.className = "coupon-message error";
  }
});

function updateLoyaltyUI() {
  document.querySelector("#loyalty-status").textContent = `${loyaltyCount % 5}/5 para café gratis`;
}

function renderHistory() {
  if (historyEntries.length === 0) {
    historyList.innerHTML = '<li class="history-empty">Todavía no preparaste ningún café.</li>';
    return;
  }
  historyList.innerHTML = historyEntries.map((e) => `<li><span>${e.drink} · ${e.size}</span><strong>${formatMoney(e.total)}</strong></li>`).join("");
}

prepareButton.addEventListener("click", () => {
  order.preparing = true;
  showMachineMessage("Preparando tu bebida...");
  setTimeout(() => {
    order.preparing = false;
    order.completed = true;
    reduceStock(order.drink);
    sessionCount++;
    loyaltyCount++;
    sessionCountEl.textContent = sessionCount;
    historyEntries.unshift({ drink: order.drink, size: order.size, total: order.total });
    renderHistory();
    saveStateToLocalStorage();
    showMachineMessage("¡Tu bebida está lista!");
  }, 3000);
});

resetButton.addEventListener("click", () => {
  order.drink = null;
  order.credit = 0;
  order.total = 0;
  order.preparing = false;
  order.completed = false;
  updateSummary();
});

loadStateFromLocalStorage();
updateSummary();