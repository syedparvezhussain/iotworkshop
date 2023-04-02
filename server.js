// import BTSerialPort from 'bluetooth-serial-port';
const BluetoothSerialPort = require('bluetooth-serial-port');
const express = require("express"); //Line 1
const app = express(); //Line 2

const btSerial = new BluetoothSerialPort.BluetoothSerialPort();

//Generic Error Handler for the BT Serial Port library as requires error functions
const errFunction = (err) =>{
   if(err){
       console.log('Error', err);
   }
};

// Connecting to BT device can take a few seconds so a little console.log to keep you entertained.
console.log("Starting Server");
// Are you not entertained?

/*
  For this to work you will have to connect to the Bluetooth device on your computer in the normal way
  I.e via Bluetooth settings: Default password is usually 0000 or 1234
*/

// Once BtSerial.inquire finds a device it will call this code
// BtSerial.inquire will find all devices currently connected with your computer
btSerial.on('found', function(address, name) {
    // If a device is found and the name contains 'HC' we will continue
    // This is so that it doesn't try to send data to all your other connected BT devices
    if(name.toLowerCase().includes('hc')){

      btSerial.findSerialPortChannel(address, function(channel) {
        // Finds then serial port channel and then connects to it
        btSerial.connect(address, channel, function() {
          // Now the magic begins, bTSerial.on('data', callbackFunc) listens to the bluetooth device.
          // If any data is received from it the call back function is used
          btSerial.on('data', function(bufferData) {
            // The data is encoded so we convert it to a string using Nodes Buffer.from func
            console.log(Buffer.from(bufferData).toString());

            // Now we have received some data from the Arduino we talk to it.
            // We Create a Buffered string using Nodes Buffer.from function
            // It needs to be buffered so the entire string is sent together
            // We also add an escape character '\n' to the end of the string
            // This is so Arduino knows that we've sent everything we want
            btSerial.write(Buffer.from('From Node With Love\n'), errFunction);
          });
        }, errFunction);
      },errFunction);
    }else{
      console.log('Not connecting to: ', name);
    }
});

// Starts looking for Bluetooth devices and calls the function btSerial.on('found'
btSerial.inquire();
const port = process.env.PORT || 5000; //Line 3

const socketIo = require("socket.io");
const http = require("http");
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
  },
});
io.on("connection", (socket) => {
  console.log("client connected: ", socket.id);

  socket.join("clock-room");

  socket.on("disconnect", (reason) => {
    console.log(reason);
  });
});
setInterval(() => {
  io.to("clock-room").emit("time", new Date());
}, 1000);
server.listen(port, (err) => {
  if (err) console.log(err);
  console.log("Server running on Port ", port);
});
// This displays message that the server running and listening to specified port
app.listen(5001, () => console.log(`Listening on port ${5001}`)); //Line 6

// create a GET route
app.get("/express_backend", (req, res) => {
  //Line 9
  res.send({ express: "YOUR EXPRESS BACKEND IS CONNECTED TO REACT" }); //Line 10
}); //Line 11

app.get("/exampleApi", (req, res) => {
  //Line 9
  const bar=req.query.data  // true
  // sport.write(bar);
 
  console.log('getting api call',bar)
  io.to("clock-room").emit("Event", bar);

  res.send({ express: bar }); //Line 10
  // sport.end();
}); //Line 11
app.get("/selfBalenceRobotStatus", (req, res) => {
  //Line 9
  const x=req.query.x  // true
  const y = req.query.y
  const z = req.query.z
  const servof = req.query.servof
   const servob = req.query.servob
  // sport.write(bar);
 const data = {
x:x,
y:y,
z:z,
servof:servof,
servob:servob

}
  console.log('getting api call',data)
  io.to("clock-room").emit("Event", data);

  res.send({ express: data }); //Line 10
  // sport.end();
}); //Line 11
