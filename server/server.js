// RESOURCES:
// Node External Access: http://stackoverflow.com/questions/8325480/set-up-node-so-it-is-externally-visible
// S2S Connection: http://stackoverflow.com/questions/14113254/node-js-server-to-server-connection


const net = require('net');
var gaze = require('gaze');
var fs = require('fs');
var path = require('path');
var getIP = require('external-ip')();
var externalAddress;

getIP(function (err, ip) {
	if (err) throw err;
	console.log("External IP: " + ip);
	externalAddress = ip;
});

var syncedFiles = ['test.txt', 'options.json', 'index.html'];

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

	gaze(syncedFiles, function (err, watcher) {
		this.on('changed', function (filepath) {
			var name = path.basename(filepath);
			msg('"' + name + '"' + ' was changed.');
			sendFileToClient(filepath, conn, name);
		});

		this.on('added', function (filepath) {
			var name = path.basename(filepath)
			msg('"' + name + '"' + ' was changed.');
			sendFileToClient(filepath, conn, name);
		});
	});

});

server.listen(3000, 'localhost', function () {
	var address = server.address();
	console.log("Opened Server on: " + JSON.stringify(address));
	console.log("Server: Listening");
});

// Helper Functions

function msg (text) {
	console.log("Server: " + text);
};

function clientMsg (text) {
	console.log('From Client: ' + text);
};

function sendFileToClient (filepath, conn, name) {
	fs.readFile(filepath, 'utf8', function (err, data) {
		conn.write(JSON.stringify({
			message: 'File changed.',
			content: data,
			filename: name
		}));
	});
};