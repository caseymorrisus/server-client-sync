const net = require('net');
var fs = require('fs');

// Create a socket (client) that connects to the server
var socket = new net.Socket();
socket.connect(3000, 'localhost', function () {
	console.log("Client: Connected to server");
});

// Let's handle the data we get from the server
socket.on("data", function (data) {

	data = JSON.parse(data);
	console.log("Server: %s", data.message);

	if (data.content) {
		//console.log("Data from server: " + data.content);
		fs.writeFile(data.filename, data.content, function (err) {
			if (err) throw err;
			console.log("Client: Saved file.");
		})
	};
	// Respond back
	//socket.write(JSON.stringify({ message: "Hey there server!" }));
	// Close the connection
});