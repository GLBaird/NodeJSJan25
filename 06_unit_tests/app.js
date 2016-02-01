var username = "unknown";
var portnumber = 3000;

function getSettings() {
    return {
        username: username,
        portnumber: portnumber
    }
}

function applySettings(settings) {
    username = settings.username || username;
    portnumber = settings.portnumber || portnumber;
}

// Increase port by x100
function incrementPort() {
    portnumber += 100;
}

module.exports = {
    getSettings: getSettings,
    applySettings: applySettings,
    incrementPort: incrementPort
};
