// These are our variable definitions!

let port;
// These are creating variables that reference HTML elements in `index.html`.
const serialDataElement = document.getElementById("serialData");
const serialDataElement2 = document.getElementById("serialDataContainer");
const configElements = document.getElementById("globalVars");

// Create initial empty arrays for data and labels (this is for the Chart)
var data = [];
var labels = [];
value = INITIAL_VALUE_HEARTBEAT; // take the initial value...

// This function handles the "filling" or "unfilling" of the shape (circle).
function updateFillHeight(value) {
  // Let's grab those HTML elements for fill/circle so we can use them.
  var fillElement = document.getElementById("fill");
  var circleElement = document.getElementById("circle");
  // Depending on the current value from Serial, divide by init_value, and multiply by 100

  // This generates a percentage used to define how much of the shape should be filled.
  // E.g., If the code gives 886 and we define 1k starting it'd be 886 / 1000 or 88.6% for the height element of .fill.
  var heightPercentage = (value / INITIAL_VALUE_HEARTBEAT) * 100; // Reads from Config.js
  fillElement.style.height = heightPercentage + "%";

  // Uncomment this if you want to see the current thing the code is sending to Serial in your console.
  // console.log("value " + value);

  // If our BPM/value/etc. is 0...
  if (value === 0) {
    // Give it the "circle-empty" CSS class (aka make the circle red).
    circleElement.classList.add("circle-empty");
    fillElement.classList.add("circle-empty");
    fillElement.style.height = "100%";
    // console.log("circle-empty class added");
  } else {
    // If the value is not 0, then remove that circle-empty class (circle not red).
    circleElement.classList.remove("circle-empty");
    fillElement.classList.remove("circle-empty");
    // console.log("circle-empty class removed");
  }
}

// This creates the chart that plots the real-time data!

// Conveniently labeled as realTimeChart...
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
  // This provides the y-bounds for the chart.
  options: {
    responsive: true,
    scales: {
      y: {
        suggestedMin: 0, // Set the minimum value for the y-axis
        suggestedMax: INITIAL_VALUE_HEARTBEAT, // Set the maximum value for the y-axis based on config.js
      },
    },
  },
});

function updateChart(newValue) {
  // console.log(newValue);
  // Add new data point to the arrays

  // This will add the timestamp data to the x-axis of the real-time chart.
  var timestamp = new Date().toLocaleTimeString();

  // This takes w/e is newValue and passes it to the chart.
  data.push(newValue);
  // This makes the x-label!
  labels.push(timestamp);

  // Remove the oldest data point if the number of data points exceeds a certain limit (e.g., 10)
  if (data.length > 10) {
    data.shift();
    labels.shift();
  }

  // Update the chart
  chart.update();
}

// Function to establish a connection to the serial port
async function connectToSerial() {
  try {
    // Request access to the serial port
    port = await navigator.serial.requestPort();

    // Open the serial port with a specified baud rate
    await port.open({ baudRate: BAUD_RATE });

    // Start reading data from the serial port
    readFromSerialPort();
  } catch (error) {
    // Handle any errors that occur during connection
    console.error("Error opening serial port:", error);
  }
}

// Function to disconnect from the serial port
function disconnectFromSerial() {
  // Check if the serial port is open
  if (port) {
    // Close the serial port
    port.close();

    // Reset the port variable and clear the serial data element value
    port = null;
    serialDataElement.value = "";
  }
}

// Function to read data from the serial port
async function readFromSerialPort() {
  // Continue reading while the port is open and readable
  while (port && port.readable) {
    // Get a reader object to read data from the serial port
    const reader = port.readable.getReader();
    try {
      // Continue reading until done is true
      while (true) {
        // Read data from the serial port
        const { value, done } = await reader.read();

        // Break the loop if there is no more data to read
        if (done) break;

        // Convert the received value to a string (serial data)
        const serialData = new TextDecoder().decode(value);

        // Append the serial data to the serialDataElement value
        serialDataElement.value += serialData;

        // Extract numeric data from the serial data
        const numericData = serialDataElement.value.match(/\d+/g);

        // Process the numeric data if it exists
        if (numericData && numericData.length > 0) {
          // Filter the numbers based on specific conditions (from config.js)
          const filteredNumbers = numericData
            .map(Number)
            .filter((num) => num < INITIAL_VALUE_HEARTBEAT && num >= 0);

          // Display the latest filtered number in serialDataElement2
          serialDataElement2.innerText = filteredNumbers.slice(-1);

          // Update the chart with the latest filtered number
          updateChart(filteredNumbers.slice(-1)[0]);

          // Update the fill height based on the latest filtered number
          updateFillHeight(filteredNumbers.slice(-1)[0]);
        }
      }
    } catch (error) {
      // Handle any errors that occur during reading
      console.error("Error reading from serial port:", error);
      break;
    } finally {
      // Release the lock on the reader object
      reader.releaseLock();
    }
  }
}
