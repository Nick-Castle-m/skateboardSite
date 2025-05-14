const http = require("http");

http.createServer(function (req, res) {
    res.write('working on fsfe');
    res.end();
}).listen(3000);

console.log("Server is running at 3000");
