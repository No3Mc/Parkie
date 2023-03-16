const addPaymentMethodForm = document.getElementById('add-payment-method-form');
const closeModalBtns = document.getElementsByClassName('close');
const modal = document.getElementsByClassName('modal')[0];

const addPaymentMethodBtn = document.getElementById('add-payment-method-btn');
addPaymentMethodBtn.addEventListener('click', function() {
  modal.style.display = "block";
});

// Initialize payment methods array
let paymentMethods = [];

// Get reference to payment methods list element
const paymentMethodsList = document.getElementById('payment-methods-list');

function displayPaymentMethods() {
    paymentMethodsList.innerHTML = '';
    paymentMethods.forEach((paymentMethod, index) => {
        const li = document.createElement('li');
        li.classList.add('payment-method');
        const name = document.createElement('div');
        name.classList.add('payment-method-name');
        name.innerHTML = paymentMethod.name;
        const details = document.createElement('div');
        details.classList.add('payment-method-details');
        details.innerHTML = `**** **** **** ${paymentMethod.number.slice(-4)} - Expires ${paymentMethod.expiry}`;
        const deleteBtn = document.createElement('button');
        deleteBtn.innerHTML = 'Delete';
        deleteBtn.addEventListener('click', () => {
            paymentMethods.splice(index, 1);
            displayPaymentMethods();
        });
        li.appendChild(name);
        li.appendChild(details);
        li.appendChild(deleteBtn);
        paymentMethodsList.appendChild(li);
    });
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
    const cvv = event.target.cvv.value;
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
