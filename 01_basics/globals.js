console.log("Hello World");
console.log(process.argv);


const fs = require("fs");
const colors = require("colors");

var text = "Hello from node!".red;

fs.writeFileSync("hello.txt", text);

const printer = require("./printer");

console.log( printer.get().blueBG );

printer.set("Bob".rainbow);

console.log( printer.get().blueBG );
