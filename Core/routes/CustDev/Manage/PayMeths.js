const addPaymentMethodForm = document.getElementById('add-payment-method-modal').querySelector('form');
const closeModalBtns = document.getElementsByClassName('close');
const modal = document.getElementById('add-payment-method-modal');
const paymentMethodsStack = document.getElementById('payment-methods-stack');
const autoOpenControllerScriptRuntime = true;

const addPaymentMethodBtn = document.getElementById('add-payment-method-btn');
addPaymentMethodBtn.addEventListener('click', function() {
  modal.style.display = "block";
});

// Initialize payment methods array
let paymentMethods = [];

function createCard(paymentMethod) {
  const card = document.createElement('div');
  card.classList.add('card');
  card.innerHTML = `
    <div class="card-front">
      <div class="card-logo"></div>
      <div class="card-chip"></div>
      <div class="card-number">${paymentMethod.number}</div>
      <div class="card-name">${paymentMethod.name}</div>
      <div class="card-expiry">${paymentMethod.expiry}</div>
    </div>
    <div class="card-back">
      <div class="card-cvv">
        <label for="cvv-back">CVV</label>
        <input type="text" id="cvv-back" name="cvv-back" maxlength="3">
      </div>
    </div>
  `;

  const cardFront = card.querySelector('.card-front');
  const cardBack = card.querySelector('.card-back');
  const cvvInput = cardBack.querySelector('.card-cvv');

  card.addEventListener('click', () => {
    card.classList.toggle('card-flipped');
    cvvInput.style.visibility = card.classList.contains('card-flipped') ? 'visible' : 'hidden';
  });

  return card;
}


function displayPaymentMethods() {
  paymentMethodsStack.innerHTML = '';
  paymentMethods.forEach((paymentMethod, index) => {
    const paymentMethodElement = document.createElement('div');
    paymentMethodElement.classList.add('payment-method');
    paymentMethodElement.classList.add(getCardClass(index));
    const card = createCard(paymentMethod);
    paymentMethodElement.appendChild(card);
    const deleteBtn = document.createElement('button');
    deleteBtn.innerHTML = 'Delete';
    deleteBtn.addEventListener('click', () => {
      paymentMethods.splice(index, 1);
      displayPaymentMethods();
    });
    paymentMethodElement.appendChild(deleteBtn);
    paymentMethodsStack.appendChild(paymentMethodElement);
  });
}

function getCardClass(index) {
  return 'card-' + (index % 5);
}

// Helper function to show the add payment method modal
function showAddPaymentMethodModal() {
  modal.style.display = 'block';
}

// Helper function to hide the add payment method modal
function hideAddPaymentMethodModal() {
  modal.style.display = 'none';
  addPaymentMethodForm.reset();
}

// Event listeners
addPaymentMethodBtn.addEventListener('click', showAddPaymentMethodModal);

Array.from(closeModalBtns).forEach(closeModalBtn => {
  closeModalBtn.addEventListener('click', hideAddPaymentMethodModal);
});

window.addEventListener('click', event => {
  if (event.target == modal) {
    hideAddPaymentMethodModal();
  }
});

addPaymentMethodForm.addEventListener('submit', event => {
  event.preventDefault();
  const name = event.target.name.value;
  const number = event.target.number.value;
  const expiry = event.target.expiry.value;
  const cvv = event.target['cvv-back'].value;
  const paymentMethod = {
    name,
    number,
    expiry,
    cvv
  };
  paymentMethods.push(paymentMethod);
  hideAddPaymentMethodModal();
  displayPaymentMethods();
});

Array.from(closeModalBtns).forEach(closeModalBtn => {
  closeModalBtn.addEventListener('click', function() {
    modal.style.display = "none";
  });
});
