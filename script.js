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
    "2022-11-26T18:49:59.371Z",
    "2022-11-30T12:01:20.894Z",
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

// Function for formatting currency
const formatCurrency = function (value, locale, currency) {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
  }).format(value);
};

// Function for displaying time
const formatMovementDate = function (date, locale) {
  // function to calculate day elapsed
  const calcDaysPassed = (date1, date2) =>
    Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));

  const DaysPassed = calcDaysPassed(date, new Date());

  if (DaysPassed === 0) return `Today`;
  else if (DaysPassed === 1) return `Yesterday`;
  else if (DaysPassed <= 7) return `${DaysPassed} days ago`;
  else {
    return new Intl.DateTimeFormat(locale).format(date);

    // Old formatting method w/o intl api
    // const movDate = `${date.getDate()}`.padStart(2, 0);
    // // take note that month is 0 base, so need to +1
    // const movMonth = `${date.getMonth() + 1}`.padStart(2, 0);
    // const movYear = date.getFullYear();
    // return `${movDate}/${movMonth}/${movYear}`;
  }
};

// Good practice to pass data into a function and work from there, instead of doing it straight on global scope.
const displayMovement = function (acc, sort = false) {
  // Clear all the html inside the movements container
  containerMovements.innerHTML = "";

  // Combine movement with its original index using map.
  // mappedMov = [[mov,i], [mov,i] ...]
  const mappedMov = acc.movements.map((mov, i) => [mov, i]);

  // For sorting, if sort is true, sort by the element at [0] (which is the movement), otherwise stay the same unsorted
  const movs = sort ? mappedMov.slice().sort((a, b) => a[0] - b[0]) : mappedMov;

  // To sort the dates as well, get the index reference from the movs.
  // Remember that the index was stored earlier at index [1] for each mov
  const indexRef = movs.map((mov) => mov[1]);

  // "Sort" the date by creating a new array, mapping the index of the mov (sorted/unsorted) to the existing movementsDates array
  const dateSort = sort
    ? indexRef.map((i) => acc.movementsDates[i])
    : acc.movementsDates;

  // Since movs has nested arrays, when using forEach, we need to deconstruct the argument
  movs.forEach(function ([mov, _], i) {
    // A variable to change class name for the HTML (note that the name of the class for the movement row depends if its deposit or withdrawal)
    const type = mov > 0 ? `deposit` : `withdrawal`;

    // Creating date to display
    const movementsDate = new Date(dateSort[i]);
    const displayDate = formatMovementDate(movementsDate, acc.locale);

    // Creating formatted movements
    const formattedMov = formatCurrency(mov, acc.locale, acc.currency);

    // A lateral template variable to keep the html that we want to add later
    const html = `
    <div class="movements__row">
    <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
    <div class="movements__date">${displayDate}</div>
    <div class="movements__value">${formattedMov}</div>
    </div>
    `;

    // Insert an adjacent html after the begin of movements class container
    containerMovements.insertAdjacentHTML("afterbegin", html);
  });
};

/* //old version
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
  acc.balance = acc.movements.reduce(function (acc, mov) {
    return acc + mov;
  }, 0);
  labelBalance.textContent = `${acc.balance.toFixed(2)} €`;
};
*/

// Function to calculate and display balance
const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce(function (acc, mov) {
    return acc + mov;
  }, 0);
  labelBalance.textContent = formatCurrency(
    acc.balance,
    acc.locale,
    acc.currency
  );
};

// Function to calculate and display summary: IN, OUT and INTEREST
const calcDisplaySummary = function (acc) {
  // All movements >0 is income
  const incomes = acc.movements
    .filter((mov) => mov > 0)
    .reduce((acc, mov) => acc + mov);
  labelSumIn.textContent = formatCurrency(incomes, acc.locale, acc.currency);

  // All movements <0 is OUT
  const out = acc.movements
    .filter((mov) => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = formatCurrency(
    Math.abs(out),
    acc.locale,
    acc.currency
  );

  // All deposit/income has interest of 1.2 and only interest >1 will be included.
  const interest = acc.movements
    .filter((mov) => mov > 0)
    .map((deposit) => (deposit * acc.interestRate) / 100)
    .filter((int, i, arr) => {
      //check previous array
      return int >= 1;
    })
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = formatCurrency(
    interest,
    acc.locale,
    acc.currency
  );
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

// Function to start logout timer
const startLogoutTimer = function () {
  // Set the logout timer in seconds
  let time = 150;

  // Callback function for interval
  const tick = function () {
    // Structure seconds in min:sec format
    const min = String(Math.trunc(time / 60)).padStart(2, 0);
    const sec = String(time % 60).padStart(2, 0);
    labelTimer.textContent = `${min}:${sec}`;

    // Check if timer is 0, if it is, reset default and clear timer
    if (time === 0) {
      clearInterval(timer);
      labelWelcome.textContent = "Log in to get started";
      containerApp.style.opacity = 0;
    }

    // Reduce the time count every n second specified by setInterval function
    time--;
  };

  // Call it once so it starts immediately
  tick();
  // Then call it again every 1s
  const timer = setInterval(tick, 1000);

  return timer;
};

///////////////////////////////////////////////////////////////////////
// Event handler
// Current account variable for functions
let currentAccount, timer;

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

    // Calculat & display date and time on login w/ Intl api
    const now = new Date();
    const options = {
      hour: "numeric",
      minute: "numeric",
      day: "numeric",
      month: "short",
      year: "numeric",
      weekday: "short",
    };

    // use this when we want to use user locale
    // const locale = navigator.language;

    labelDate.textContent = new Intl.DateTimeFormat(
      currentAccount.locale,
      options
    ).format(now);

    // old manual function w/o internalizing
    /* 
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
    */

    // Update UI
    updateUI(currentAccount);
    sorted = false;

    // Start logout timer if no existing timer; if there is, clear first, then start a new one
    if (timer) clearInterval(timer);
    timer = startLogoutTimer();
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

  // Reset timer whenever button is clicked
  clearInterval(timer);
  timer = startLogoutTimer();
});

btnLoan.addEventListener("click", function (e) {
  e.preventDefault();
  const loanAmount = Math.floor(inputLoanAmount.value);

  // Loan amount must be > 0 and the account must have one deposit greater than 10% of the loan Amount
  if (
    loanAmount > 0 &&
    currentAccount.movements.some((mov) => mov >= 0.1 * loanAmount)
  ) {
    // Add a timeout to simulate loan approval after 3secons
    setTimeout(function () {
      // Add the amount to the acccount and update ui
      currentAccount.movements.push(loanAmount);
      currentAccount.movementsDates.push(new Date().toISOString());
      updateUI(currentAccount);
    }, 3000);
  }

  // Clear input fields
  inputLoanAmount.value = "";

  // Reset timer whenever button is clicked
  clearInterval(timer);
  timer = startLogoutTimer();
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
