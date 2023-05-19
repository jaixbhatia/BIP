let port;
const serialDataElement = document.getElementById("serialData");

async function connectToSerial() {
  try {
    port = await navigator.serial.requestPort();
    await port.open({ baudRate: 115200 });
    readFromSerialPort();
  } catch (error) {
    console.error("Error opening serial port:", error);
  }
}

function disconnectFromSerial() {
  if (port) {
    port.close();
    port = null;
    serialDataElement.value = "";
  }
}

async function readFromSerialPort() {
  while (port && port.readable) {
    const reader = port.readable.getReader();
    try {
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        const data = new TextDecoder().decode(value);
        serialDataElement.value += data;
      }
    } catch (error) {
      console.error("Error reading from serial port:", error);
      break;
    } finally {
      reader.releaseLock();
    }
  }
}
