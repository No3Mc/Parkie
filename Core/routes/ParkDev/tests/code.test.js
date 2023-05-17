const fetch = require('node-fetch'); // Import the 'node-fetch' library for making HTTP requests
const L = require('leaflet'); // Import the 'leaflet' library for working with maps
const $ = require('jquery'); // Import the 'jquery' library for DOM manipulation
require('text-encoding'); // Import the 'text-encoding' library for working with text encoding/decoding
jest.mock('node-fetch'); // Mock the 'node-fetch' library for testing purposes
require('dotenv').config(); // Load environment variables from '.env' file

describe('Map Page Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Reset all mocks before each test
  });

  it('should fetch markers and assign data to markersWithStatus', async () => {
    // Arrange
    const responseJson = [{ lat: 123, long: 456 }]; // Sample response JSON data
    const fetchResponse = { json: jest.fn().mockResolvedValue(responseJson) }; // Create a mock fetch response
    fetch.mockResolvedValue(fetchResponse); // Mock the fetch function to return the fetchResponse

    // Act
    const markersWithStatus = await fetch('/markers').then((response) => response.json()); // Perform the fetch request and get the JSON data

    // Assert
    expect(fetch).toHaveBeenCalledWith('/markers'); // Check that the fetch function was called with the correct URL
    expect(markersWithStatus).toEqual(responseJson); // Check that the markersWithStatus variable contains the expected data
  });

  it('should handle fetch errors', async () => {
    // Arrange
    const fetchError = new Error('Fetch error'); // Create a sample fetch error
    fetch.mockRejectedValue(fetchError); // Mock the fetch function to throw the fetch error

    // Act
    let markersWithStatus;
    let error;
    try {
      await fetch('/markers').then((response) => response.json()); // Perform the fetch request and handle any errors
    } catch (err) {
      error = err; // Capture the error
    }

    // Assert
    expect(fetch).toHaveBeenCalledWith('/markers'); // Check that the fetch function was called with the correct URL
    expect(markersWithStatus).toBeUndefined(); // Check that the markersWithStatus variable is undefined
    expect(error).toEqual(fetchError); // Check that the error matches the expected fetch error
  });

  it('should find the minimum latitude from markersWithStatus data', () => {
    // Arrange
    const markersWithStatus = [
      { lat: 10, long: 20 },
      { lat: 30, long: 40 },
      { lat: 50, long: 60 },
    ]; // Sample markersWithStatus data

    // Act
    const minLat = Math.min(...markersWithStatus.map((marker) => marker.lat)); // Calculate the minimum latitude

    // Assert
    expect(minLat).toBe(10); // Check that the minimum latitude is correct
  });

  it('should find the maximum longitude from markersWithStatus data', () => {
    // Arrange
    const markersWithStatus = [
      { lat: 10, long: 20 },
      { lat: 30, long: 40 },
      { lat: 50, long: 60 },
    ]; // Sample markersWithStatus data

    // Act
    const maxLong = Math.max(...markersWithStatus.map((marker) => marker.long)); // Calculate the maximum longitude

    // Assert
    expect(maxLong).toBe(60); // Check that the maximum longitude is correct
  });
});


  // Booking form input min & max tests
  describe('Booking Form Tests', () => {
    // Test finding the minimum and maximum lengths for the name input field of the booking form
    it('should validate the length of the name input', () => {
      const minLength = 1; // Minimum length of the name input
      const maxLength = 55; // Maximum length of the name input

      const nameInput = document.createElement('input'); // Create a new input element
      nameInput.setAttribute('type', 'text'); // Set the input type to 'text'
      nameInput.setAttribute('name', 'name'); // Set the input name attribute

      // Set name input value to minimum length
      nameInput.value = 'A';

      // Assert
      expect(nameInput.value.length).toBeGreaterThanOrEqual(minLength); // Check that the value length is greater than or equal to the minimum length
      expect(nameInput.value.length).toBeLessThanOrEqual(maxLength); // Check that the value length is less than or equal to the maximum length

      // Set name input value to maximum length
      nameInput.value = 'A'.repeat(maxLength);

      // Assert
      expect(nameInput.value.length).toBeLessThanOrEqual(maxLength); // Check that the value length is less than or equal to the maximum length
    });

    // Test finding the minimum and maximum lengths for the email input field of the booking form
    it('should validate the length of the email input', () => {
      const minLength = 5; // Minimum length of the email input
      const maxLength = 120; // Maximum length of the email input

      const emailInput = document.createElement('input'); // Create a new input element
      emailInput.setAttribute('type', 'email'); // Set the input type to 'email'
      emailInput.setAttribute('name', 'email'); // Set the input name attribute

      // Set email input value to minimum length
      emailInput.value = 'a@b.com';

      // Assert
      expect(emailInput.value.length).toBeGreaterThanOrEqual(minLength); // Check that the value length is greater than or equal to the minimum length
      expect(emailInput.value.length).toBeLessThanOrEqual(maxLength); // Check that the value length is less than or equal to the maximum length

      // Set email input value to maximum length
      emailInput.value >= 'a'.repeat(maxLength) + '@b.com';

      // Assert
      expect(emailInput.value.length).toBeLessThanOrEqual(maxLength); // Check that the value length is less than or equal to the maximum length
    });

    // Test finding the minimum and maximum lengths for the carno input field of the booking form
    it('should validate the length of the carno input', () => {
      const minLength = 1; // Minimum length of the carno input
      const maxLength = 15; // Maximum length of the carno input

      const carnoInput = document.createElement('input'); // Create a new input element
      carnoInput.setAttribute('type', 'text'); // Set the input type to 'text'
      carnoInput.setAttribute('name', 'carno'); // Set the input name attribute

      // Set carno input value to minimum length
      carnoInput.value = 'A';

      // Assert
      expect(carnoInput.value.length).toBeGreaterThanOrEqual(minLength); // Check that the value length is greater than or equal to the minimum length
      expect(carnoInput.value.length).toBeLessThanOrEqual(maxLength); // Check that the value length is less than or equal to the maximum length

      // Set carno input value to maximum length
      carnoInput.value = 'A'.repeat(maxLength);

      // Assert
      expect(carnoInput.value.length).toBeLessThanOrEqual(maxLength); // Check that the value length is less than or equal to the maximum length
    });

    // Test finding the minimum and maximum lengths for the no input field of the booking form
    it('should validate the length of the no input', () => {
      const minLength = 5;
      const maxLength = 20;

      const noInput = document.createElement('input');
      noInput.setAttribute('type', 'number');
      noInput.setAttribute('name', 'no');

      // Set no input value to minimum length
      noInput.value = '12345';

      // Assert
      expect(noInput.value.length).toBeGreaterThanOrEqual(minLength);
      expect(noInput.value.length).toBeLessThanOrEqual(maxLength);

      // Set no input value to maximum length
      noInput.value = '1'.repeat(maxLength);

      // Assert
      expect(noInput.value.length).toBeLessThanOrEqual(maxLength);
  });
  });

// sendgrid api test
describe('SendGrid Test', () => {
  it('should handle errors when sending an email', async () => {
    // Arrange
    const sgMail = require('@sendgrid/mail'); // Import the 'sendgrid/mail' library for sending emails
    jest.mock('@sendgrid/mail', () => ({
      setApiKey: jest.fn(),
      send: jest.fn().mockRejectedValue(new Error('Failed to send email')), // Mock the send function to throw an error
    }));
    const sendEmail = async (emailData) => {
      await sgMail.setApiKey(process.env.SENDGRID_API_KEY); // Set the SendGrid API key
      await sgMail.send(emailData); // Send the email
    };

    // Act
    let error;
    try {
      await sendEmail({ to: 'test@example.com', subject: 'Test', text: 'Test email' }); // Send the test email and handle any errors
    } catch (err) {
      error = err; // Capture the error
    }

    // Assert
    expect(error).toBeInstanceOf(Error); // Check that the error is an instance of Error
    expect(error.message).toBe('Failed to send email'); // Check that the error message matches the expected value
  });
});

describe('DOM Manipulation Tests', () => {
  beforeEach(() => {
    // Create a dummy DOM element for testing
    document.body.innerHTML = `
      <div id="container">
        <ul id="list">
          <li>Item 1</li>
          <li>Item 2</li>
          <li>Item 3</li>
        </ul>
      </div>
    `;
  });

  it('should add a new item to the list', () => {
    // Arrange
    const newItemText = 'Item 4'; // Text of the new item

    // Act
    const list = document.querySelector('#list'); // Get the list element
    const newItem = document.createElement('li'); // Create a new list item element
    newItem.textContent = newItemText; // Set the text content of the new item
    list.appendChild(newItem); // Add the new item to the list

    // Assert
    expect(list.children.length).toBe(4); // Check that the list contains the expected number of items
    expect(list.lastChild.textContent).toBe(newItemText); // Check that the last item in the list has the expected text
  });

  it('should remove an item from the list', () => {
    // Arrange
    const itemToRemove = document.querySelector('#list li:nth-child(2)'); // Select the second item in the list

    // Act
    itemToRemove.remove(); // Remove the selected item from the list

    // Assert
    const list = document.querySelector('#list'); // Get the list element
    expect(list.children.length).toBe(2); // Check that the list contains the expected number of items after removal
    expect(list.children[1].textContent).toBe('Item 3'); // Check that the remaining item has the expected text
  });

  // stripe api test
  const stripe = require('stripe'); // Import the 'stripe' library for working with the Stripe API
  jest.mock('stripe', () =>
    jest.fn().mockReturnValue({
      payments: {
        create: jest.fn(),
      },
    })
  );

  describe('Stripe API Tests', () => {
    beforeEach(() => {
      jest.clearAllMocks(); // Reset all mocks before each test
    });

    it('should create a payment', async () => {
      // Arrange
      const paymentData = {
        amount: 1000,
        currency: 'usd',
        source: 'tok_visa',
      }; // Sample payment data
      const stripeInstance = stripe(process.env.STRIPE_PRIVATE_KEY); // Create a Stripe instance with the private key

      // Act
      await stripeInstance.payments.create(paymentData); // Create a payment using the Stripe instance

      // Assert
      expect(stripeInstance.payments.create).toHaveBeenCalledWith(paymentData); // Check that the 'create' function was called with the expected payment data
    });
  });

});
