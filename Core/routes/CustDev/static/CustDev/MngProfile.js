function validateForm() {
    var username = document.getElementById('username').value;
    var firstName = document.getElementById('firsn').value;
    var lastName = document.getElementById('lasn').value;
    var email = document.getElementById('email').value;
    var phone = document.getElementById('phone').value;
    var postcode = document.getElementById('postcode').value;
    var password = document.getElementById('password').value;

    validateUsername(username);
    validateFirstName(firstName);
    validateLastName(lastName);
    validateEmail(email);
    validatePhone(phone);
    validatePostcode(postcode);
    validatePassword(password);

    var warningElements = document.getElementsByClassName('warning');
    for (var i = 0; i < warningElements.length; i++) {
        if (warningElements[i].innerText !== '') {
            alert('Please fix the validation errors before submitting.');
            return false; 
        }
    }

    alert('Profile was updated successfully.');
    return true;
}

function validateUsername(username) {
    var warningElement = document.getElementById('usernameWarning');
    var submitButton = document.getElementById('submitButton');

    if (username.length < 3 || username.length > 20) {
        warningElement.innerText = 'Username must be between 3 and 20 characters';
        submitButton.disabled = true; 
    } else if (username.length < 2 || username.length > 50) {
        warningElement.innerText = 'Username must be between 2 and 50 characters';
        submitButton.disabled = true;
    } else {
        warningElement.innerText = '';
        enableSubmitButton();
    }
}


function validateFirstName(firstName) {
    var warningElement = document.getElementById('firsnWarning');
    var submitButton = document.getElementById('submitButton');

    if (firstName.length < 2 || firstName.length > 50) {
        warningElement.innerText = 'First name must be between 2 and 50 characters';
        submitButton.disabled = true; 
    } else {
        warningElement.innerText = '';
        enableSubmitButton(); 
    }
}

function validateLastName(lastName) {
    var warningElement = document.getElementById('lasnWarning');
    var submitButton = document.getElementById('submitButton');

    if (lastName.length < 2 || lastName.length > 50) {
        warningElement.innerText = 'Last name must be between 2 and 50 characters';
        submitButton.disabled = true;
    } else {
        warningElement.innerText = '';
        enableSubmitButton(); 
    }
}

function validateEmail(email) {
    var warningElement = document.getElementById('emailWarning');
    var submitButton = document.getElementById('submitButton');

    if (!email.endsWith('.com') && !email.endsWith('.net') && !email.endsWith('.org')) {
        warningElement.innerText = 'Email must end with .com, .net, or .org';
        submitButton.disabled = true; 
    } else {
        warningElement.innerText = '';
        enableSubmitButton();
    }
}

function validatePhone(phone) {
    var warningElement = document.getElementById('phoneWarning');
    var submitButton = document.getElementById('submitButton');

    if (phone.length < 10 || phone.length > 15) {
        warningElement.innerText = 'Phone number must be between 10 and 15 characters';
        submitButton.disabled = true;
    } else {
        warningElement.innerText = '';
        enableSubmitButton();
    }
}

function validatePostcode(postcode) {
    var warningElement = document.getElementById('postcodeWarning');
    var submitButton = document.getElementById('submitButton');

    if (postcode.length !== 6) {
        warningElement.innerText = 'Invalid postcode';
        submitButton.disabled = true;
    } else {
        warningElement.innerText = '';
        enableSubmitButton(); 
    }
}

function validatePassword(password) {
    var warningElement = document.getElementById('passwordWarning');
    var submitButton = document.getElementById('submitButton');

    if (password.length > 0 && password.length < 8) {
        warningElement.innerText = 'Password must be at least 8 characters long';
        submitButton.disabled = true;
    } else {
        warningElement.innerText = '';
        enableSubmitButton(); 
    }
}

function enableSubmitButton() {
    var warningElements = document.getElementsByClassName('warning');
    var submitButton = document.getElementById('submitButton');
    var enableButton = true;

    for (var i = 0; i < warningElements.length; i++) {
        if (warningElements[i].innerText !== '') {
            enableButton = false;
            break;
        }
    }

    submitButton.disabled = !enableButton;
}



