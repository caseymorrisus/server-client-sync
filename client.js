const net = require('net');
var fs = require('fs');

// Create a socket (client) that connects to the server
var socket = new net.Socket();
socket.connect(3000, "localhost", function () {
	console.log("Client: Connected to server");
});

// Let's handle the data we get from the server
socket.on("data", function (data) {
	data = JSON.parse(data);
	console.log("Response from server: %s", data.response);
	if (data.data) {
		console.log("Data from server: " + data.data);
		fs.writeFile('client_test.txt', data.data, function (err) {
			if (err) throw err;
			console.log("Client: Saved file.");
		})
	};
	// Respond back
	//socket.write(JSON.stringify({ response: "Hey there server!" }));
	// Close the connection
});