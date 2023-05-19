// const SerialPort = require("serialport");
// const { ReadlineParser } = require("@serialport/parser-readline");

// const parsers = SerialPort.parsers;
// const parser = new ReadlineParser({ delimeter: "\r\n" });

// const port = new SerialPort.SerialPort({
//   path: "/dev/tty.SLAB_USBtoUART",
//   baudRate: 115200,
//   dataBits: 8,
//   parity: "none",
//   stopBits: 1,
//   flowControl: false,
// });

// port.pipe(parser);

// parser.on("data", (data) => {
//   console.log(data);
// });

const SerialPort = require("serialport");
const { ReadlineParser } = require("@serialport/parser-readline");

const parser = new ReadlineParser({ delimiter: "\r\n" });

const port = new SerialPort("/dev/tty.SLAB_USBtoUART", {
  baudRate: 115200,
  dataBits: 8,
  parity: "none",
  stopBits: 1,
  flowControl: false,
});

port.pipe(parser);

parser.on("data", (data) => {
  console.log(data);
});
