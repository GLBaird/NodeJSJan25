/**
 * The full name of the user
 * @type {string}
 */
var username = "unknown";

/**
 * Setter for username
 * @param {string} name
 */
function setUsername(name) {
    username = name;
}

/**
 * Getter for the username
 * @returns {string}
 */
function getUsername() {
    return username;
}

module.exports = {
    set: setUsername,
    get: getUsername
};