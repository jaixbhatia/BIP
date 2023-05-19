int initialHeartBeat = 1000; // Initialize initialHeartBeat outside the loop

void setup() {
  Serial.begin(115200); // Set the baud rate to match the terminal
}

void loop() {
  // Generate a decrement value. For testing, this will be constrained to 20 as the max.
  int decrementCounter = random(20); // Generate a random value between 0 and 20

  // Now, we apply our decrementation to the initialHeartBeat val.
  initialHeartBeat -= decrementCounter;

  if (initialHeartBeat <= 0) {
    initialHeartBeat = 0; // Set initialHeartBeat to 0 if it is less than or equal to 0
  }

  Serial.println(initialHeartBeat); // Send the value over the serial port
  delay(1000); // Wait for a second before sending the next value
}
