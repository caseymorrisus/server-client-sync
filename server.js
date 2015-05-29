const net = require('net');
var gaze = require('gaze');
var fs = require('fs');

// Create a simple server
var server = net.createServer(function (conn) {
	console.log("Server: Client connected");

	// If connection is closed
	conn.on("end", function() {
		console.log("Server: Client disconnected");
		// Close the server
		server.close();
		// End the process
		process.exit(0);
	});

	// Handle data from client
	conn.on("data", function (data) {
		data = JSON.parse(data);
		console.log("Response from client: %s", data.response);
	});

	// Let's response with a hello message

	conn.write(
		JSON.stringify(
			{ response: "This is a test." }
		)
	);

	gaze('*.txt', function (err, watcher) {
		this.on('changed', function(filepath) {
			console.log('Server: file was changed.');
			fs.readFile(filepath, 'utf8', function (err, data){
				conn.write( JSON.stringify({ 
					response: "Hey, a file changed!",
					data: data
				}));
			});
		});
	});

});

server.listen(3000, "localhost", function () {
	console.log("Server: Listening");
});