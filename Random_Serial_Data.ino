void setup() {
  Serial.begin(115200); // Set the baud rate to match the terminal
}

void loop() {
  int value = random(100); // Generate a random value between 0 and 99
  Serial.println(value); // Send the value over the serial port
  delay(1000); // Wait for a second before sending the next value
}