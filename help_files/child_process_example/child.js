process.on('message', function(m) {
    // Do work  (in this case just up-case the string
    m = m.toUpperCase();

    console.log("Child receiving message");

    // Pass results back to parent process
    process.send(m.toUpperCase());
});