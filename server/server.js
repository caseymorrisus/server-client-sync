const net = require('net');
var gaze = require('gaze');
var fs = require('fs');
var path = require('path');

// Create a simple server
var server = net.createServer(function (conn) {
	msg('Client connected.');

	// If connection is closed
	conn.on("end", function() {
		msg('Client disconnected.');
		// Close the server
		//server.close();
		// End the process
		//process.exit(0);
	});

	// Handle data from client
	conn.on("data", function (data) {
		data = JSON.parse(data);
		clientMsg(data.message);
	});

	// Let's response with a hello message

	conn.write(
		JSON.stringify(
			{ message: "This is a test." }
		)
	);

	gaze('test.txt', function (err, watcher) {
		this.on('changed', function(filepath) {
			msg('File was changed.');
			sendFileToClient(filepath, conn);
		});
	});

});

server.listen(3000, "localhost", function () {
	console.log("Server: Listening");
});

// Helper Functions

function msg (text) {
	console.log("Server :" + text);
};

function clientMsg (text) {
	console.log('From Client: ' + text);
};

function sendFileToClient (filepath, conn) {
	var name = path.basename(filepath);
	fs.readFile(filepath, 'utf8', function (err, data) {
		conn.write(JSON.stringify({
			message: 'File changed.',
			content: data,
			filename: name
		}));
	});
};