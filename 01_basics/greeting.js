/** @type {string} */
var username = "unknown user";

/**
 * Show greeting to username
 */
function sayHello() {
    console.log("Greeting to "+username);
}

/**
 * Say goodbye to username
 */
function sayGoodbye() {
    console.log("Go away, I've had enough, "+username);
}

/**
 * Mutate username
 * @param {string} value
 */
function setUsername(value) {
    username = value;
}


module.exports = {
    greeting: sayHello,
    goodbye: sayGoodbye,
    setUsername: setUsername
};