const fs = require("fs");

console.log(process.argv);

fs.writeFileSync("./argv.txt", process.argv.join(", "));

const greetings = require("./greeting");

greetings.greeting();
greetings.setUsername("Bob");
greetings.goodbye();