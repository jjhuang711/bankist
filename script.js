"use strict";

// Data (Normally object is from other webapi)
/*
const account1 = {
  owner: "Jonas Schmedtmann",
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: "Jessica Davis",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: "Steven Thomas Williams",
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: "Sarah Smith",
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

// Array that has all the account objects
const accounts = [account1, account2, account3, account4];

*/

const account1 = {
  owner: "Jonas Schmedtmann",
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    "2019-11-18T21:31:17.178Z",
    "2019-12-23T07:42:02.383Z",
    "2020-01-28T09:15:04.904Z",
    "2020-04-01T10:17:24.185Z",
    "2020-05-08T14:11:59.604Z",
    "2020-05-27T17:01:17.194Z",
    "2020-07-11T23:36:17.929Z",
    "2020-07-12T10:51:36.790Z",
  ],
  currency: "EUR",
  locale: "pt-PT", // de-DE
};

const account2 = {
  owner: "Jessica Davis",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    "2019-11-01T13:15:33.035Z",
    "2019-11-30T09:48:16.867Z",
    "2019-12-25T06:04:23.907Z",
    "2020-01-25T14:18:46.235Z",
    "2020-02-05T16:33:06.386Z",
    "2020-04-10T14:43:26.374Z",
    "2020-06-25T18:49:59.371Z",
    "2020-07-26T12:01:20.894Z",
  ],
  currency: "USD",
  locale: "en-US",
};

const accounts = [account1, account2];

// Elements
// All label/values elements
const labelWelcome = document.querySelector(".welcome");
const labelDate = document.querySelector(".date");
const labelBalance = document.querySelector(".balance__value");
const labelSumIn = document.querySelector(".summary__value--in");
const labelSumOut = document.querySelector(".summary__value--out");
const labelSumInterest = document.querySelector(".summary__value--interest");
const labelTimer = document.querySelector(".timer");

// Structure or layout elements
const containerApp = document.querySelector(".app");
const containerMovements = document.querySelector(".movements");

// Button elements
const btnLogin = document.querySelector(".login__btn");
const btnTransfer = document.querySelector(".form__btn--transfer");
const btnLoan = document.querySelector(".form__btn--loan");
const btnClose = document.querySelector(".form__btn--close");
const btnSort = document.querySelector(".btn--sort");

// Input elements
const inputLoginUsername = document.querySelector(".login__input--user");
const inputLoginPin = document.querySelector(".login__input--pin");
const inputTransferTo = document.querySelector(".form__input--to");
const inputTransferAmount = document.querySelector(".form__input--amount");
const inputLoanAmount = document.querySelector(".form__input--loan-amount");
const inputCloseUsername = document.querySelector(".form__input--user");
const inputClosePin = document.querySelector(".form__input--pin");

// Good practice to pass data into a function and work from there, instead of doing it straight on global scope.
const displayMovement = function (acc, sort = false) {
  // Clear all the html inside the movements container
  containerMovements.innerHTML = "";

  // For sorting purposes
  const movs = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;

  movs.forEach(function (mov, i) {
    // A variable to change class name for the HTML (note that the name of the class for the movement row depends if its deposit or withdrawal)
    const type = mov > 0 ? `deposit` : `withdrawal`;

    // Creating date to display
    const movementsDate = new Date(acc.movementsDates[i]);
    const movDate = `${movementsDate.getDate()}`.padStart(2, 0);
    // take note that month is 0 base, so need to +1
    const movMonth = `${movementsDate.getMonth() + 1}`.padStart(2, 0);
    const movYear = movementsDate.getFullYear();
    const displayDate = `${movDate}/${movMonth}/${movYear}`;

    // A lateral template variable to keep the html that we want to add later
    const html = `
    <div class="movements__row">
    <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
    <div class="movements__date">${displayDate}</div>
    <div class="movements__value">${mov.toFixed(2)}€</div>
    </div>
    `;

    // Insert an adjacent html after the begin of movements class container
    containerMovements.insertAdjacentHTML("afterbegin", html);
  });
};

// Function to calculate and display balance
const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce(function (acc, mov) {
    return acc + mov;
  }, 0);
  labelBalance.textContent = `${acc.balance.toFixed(2)} €`;
};

// Function to calculate and display summary: IN, OUT and INTEREST
const calcDisplaySummary = function (acc) {
  // All movements >0 is income
  const incomes = acc.movements
    .filter((mov) => mov > 0)
    .reduce((acc, mov) => acc + mov);
  labelSumIn.textContent = `${incomes.toFixed(2)}€`;

  // All movements <0 is OUT
  const out = acc.movements
    .filter((mov) => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${Math.abs(out).toFixed(2)}€`;

  // All deposit/income has interest of 1.2 and only interest >1 will be included.
  const interest = acc.movements
    .filter((mov) => mov > 0)
    .map((deposit) => (deposit * acc.interestRate) / 100)
    .filter((int, i, arr) => {
      //check previous array
      return int >= 1;
    })
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = `${interest.toFixed(2)}€`;
};

// Function to create username for all accounts (pass in array of all account object)
const createUserName = function (accs) {
  // For each account object in the array
  accs.forEach(function (acc) {
    // Create new propery called username by doing manipulation acc.owner name
    acc.username = acc.owner
      .toLowerCase()
      .split(" ")
      .map((name) => name[0])
      .join("");
  });
};

// Create all username for available accounts
createUserName(accounts);

// Function to update UI
const updateUI = function (acc) {
  // Display the movement according to chosen account
  displayMovement(acc);

  // Calculate and display balance according to chosen account
  calcDisplayBalance(acc);

  // Calculate and display summary according to chosen account
  calcDisplaySummary(acc);
};

// Event handler
// Current account variable for functions
let currentAccount;

btnLogin.addEventListener("click", function (e) {
  e.preventDefault();

  // Find the current user according to the username entered
  currentAccount = accounts.find(
    (acc) => acc.username === inputLoginUsername.value
  );

  // If current account exist, check if the pin entered is the same as current acc pin, if yes then login
  if (currentAccount?.pin === +inputLoginPin.value) {
    // Clear input fields and cancel the focus state
    inputLoginUsername.value = inputLoginPin.value = "";
    inputLoginPin.blur();
    inputLoginUsername.blur();

    // Display UI and welcome Message
    containerApp.style.opacity = 100;
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(" ")[0]
    }`;

    // Update UI
    updateUI(currentAccount);
    sorted = false;
  }
});

btnTransfer.addEventListener("click", function (e) {
  // prevent default form submission page reload
  e.preventDefault();

  // Identify amount and receiver account from input
  const amount = +inputTransferAmount.value;
  const receiverAcc = accounts.find(
    (acc) => acc.username === inputTransferTo.value
  );

  // Clear input fields
  inputTransferAmount.value = inputTransferTo.value = "";

  // Transfer only goes through if amount>0, and current balance > amount and receiver acc actually valid and not to ourself.
  if (
    amount > 0 &&
    currentAccount.balance >= amount &&
    receiverAcc &&
    receiverAcc?.username !== currentAccount.username
  ) {
    // Do the actual transfer
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);

    // Add transfer date
    currentAccount.movementsDates.push(new Date().toISOString());
    receiverAcc.movementsDates.push(new Date().toISOString());

    // Update UI
    updateUI(currentAccount);
    console.log("transfer done");
  } else {
    console.log(`Transfer failed`);
  }
});

btnLoan.addEventListener("click", function (e) {
  e.preventDefault();
  const loanAmount = Math.floor(inputLoanAmount.value);

  // Loan amount must be > 0 and the account must have one deposit greater than 10% of the loan Amount
  if (
    loanAmount > 0 &&
    currentAccount.movements.some((mov) => mov >= 0.1 * loanAmount)
  ) {
    // Add the amount to the acccount and update ui
    currentAccount.movements.push(loanAmount);
    currentAccount.movementsDates.push(new Date().toISOString());
    updateUI(currentAccount);
  }

  // Clear input fields
  inputLoanAmount.value = "";
});

btnClose.addEventListener("click", function (e) {
  // prevent default form submission page reload
  e.preventDefault();

  // Check credential (only can close own account)
  if (
    inputCloseUsername.value === currentAccount.username &&
    +inputClosePin.value === currentAccount.pin
  ) {
    // Delete 1 account at particular index (mutating original array)
    const index = accounts.findIndex(
      (acc) => acc.username === currentAccount.username
    );
    accounts.splice(index, 1);

    // Update UI
    containerApp.style.opacity = 0;

    console.log(`Current account closed. `);
  } else {
    console.log("Close account: failed");
  }
  // Clear input fields
  inputCloseUsername.value = inputClosePin.value = "";
});

// Sorted State variable
let sorted = false;

btnSort.addEventListener("click", function (e) {
  e.preventDefault();
  displayMovement(currentAccount, !sorted);
  sorted = !sorted;
});

// Other minor stuff like dates and timer
// Date implementation
const now = new Date();
const date = `${now.getDate()}`.padStart(2, 0);
// take note that month is 0 base, so need to +1
const month = `${now.getMonth() + 1}`.padStart(2, 0);
const year = now.getFullYear();
// days start with sun at index 0
const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const day = now.getDay();
const hour = `${now.getHours()}`.padStart(2, 0);
const minute = `${now.getMinutes() + 1}`.padStart(2, 0);
labelDate.textContent = `${days[day]}, ${date}/${month}/${year}, ${hour}:${minute}`;
