#include <Adafruit_BME280.h>

#include <MHZ19_uart.h>
#include <ArduinoJson.h>


const int rx_pin = 4;
const int tx_pin = 7;

MHZ19_uart mhz19;
Adafruit_BME280 bme;

void setup() {
  Serial.begin(9600);

  // mh-z19E初期化
  mhz19.begin(rx_pin, tx_pin);
  mhz19.setAutoCalibration(false);
  delay(1000);

  // BME初期化
  bool status;
  status = bme.begin(0x76);

  // TODO ここで起動用にシリアル通信で情報を送りセンサーを一意で認識させたい
  // 現状 port.vendorId === "1a86" && port.productId === "7523"で認識させている
  // これだと同じ型のセンサーが複数あると認識できない
}


void loop() {
  DynamicJsonDocument doc(1024);

  doc["co2"] = mhz19.getPPM();
  doc["temp"] = mhz19.getTemperature();
  doc["temperature"] = bme.readTemperature();
  doc["pressure"] = bme.readPressure() / 100.0F;
  doc["humidity"] = bme.readHumidity();

  serializeJson(doc, Serial);
  Serial.println();

  delay(1000);
}