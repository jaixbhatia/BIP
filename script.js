let port;
const serialDataElement = document.getElementById("serialData");
const serialDataElement2 = document.getElementById("serialDataContainer");

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
        const numericData = serialDataElement.value.match(/\d+/g);
        if (numericData && numericData.length > 0) {
          const filteredNumbers = numericData
            .map(Number)
            .filter((num) => num < 1000 && num >= 0);
          // const output = filteredNumbers.join("\n");
          // console.log(filteredNumbers.slice(-1));
          serialDataElement2.innerText = filteredNumbers.slice(-1);
        }
      }
    } catch (error) {
      console.error("Error reading from serial port:", error);
      break;
    } finally {
      reader.releaseLock();
    }
  }
}
