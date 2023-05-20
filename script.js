let port;
const serialDataElement = document.getElementById("serialData");
const serialDataElement2 = document.getElementById("serialDataContainer");

function updateFillHeight(value) {
  var fillElement = document.getElementById("fill");
  var heightPercentage = (value / 1000) * 100; // Assuming 1000 as the maximum value
  fillElement.style.height = heightPercentage + "%";
}

// Create initial empty arrays for data and labels
var data = [];
var labels = [];

// Initial starting value
var initialValue = 1000;
value = 1000;

// Create a new chart
var ctx = document.getElementById("realTimeChart").getContext("2d");
var chart = new Chart(ctx, {
  type: "line",
  data: {
    labels: labels,
    datasets: [
      {
        label: "Real-time Data",
        data: data,
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderWidth: 1,
        fill: true,
      },
    ],
  },
  options: {
    responsive: true,
    scales: {
      y: {
        suggestedMin: 0, // Set the minimum value for the y-axis
        suggestedMax: 1000, // Set the maximum value for the y-axis
      },
    },
  },
});

// Function to update the chart with new data
function updateChart(newValue) {
  console.log(newValue);
  // Add new data point to the arrays
  var timestamp = new Date().toLocaleTimeString();
  data.push(newValue);
  labels.push(timestamp);

  // Remove the oldest data point if the number of data points exceeds a certain limit (e.g., 10)
  if (data.length > 10) {
    data.shift();
    labels.shift();
  }

  // Update the chart
  chart.update();
}

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
        const serialData = new TextDecoder().decode(value); // Use a different variable name for serial data
        serialDataElement.value += serialData;
        const numericData = serialDataElement.value.match(/\d+/g);
        if (numericData && numericData.length > 0) {
          const filteredNumbers = numericData
            .map(Number)
            .filter((num) => num < 1000 && num >= 0);
          serialDataElement2.innerText = filteredNumbers.slice(-1);
          updateChart(filteredNumbers.slice(-1)[0]);
          updateFillHeight(filteredNumbers.slice(-1)[0]);
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

// async function readFromSerialPort() {
//   while (port && port.readable) {
//     const reader = port.readable.getReader();
//     try {
//       while (true) {
//         const { value, done } = await reader.read();
//         if (done) break;
//         const data = new TextDecoder().decode(value);
//         serialDataElement.value += data;
//         const numericData = serialDataElement.value.match(/\d+/g);
//         if (numericData && numericData.length > 0) {
//           const filteredNumbers = numericData
//             .map(Number)
//             .filter((num) => num < 1000 && num >= 0);
//           // const output = filteredNumbers.join("\n");
//           // console.log(filteredNumbers.slice(-1));
//           serialDataElement2.innerText = filteredNumbers.slice(-1);
//           updateChart(filteredNumbers.slice(-1));
//         }
//       }
//     } catch (error) {
//       console.error("Error reading from serial port:", error);
//       break;
//     } finally {
//       reader.releaseLock();
//     }
//   }
// }
