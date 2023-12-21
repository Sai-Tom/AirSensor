import Sensor from "./modules/Sensor";

const main = async () => {
  const path = await Sensor.getPortPath();

  if (!path) {
    console.error("Cannot find serial port.");
    return;
  }

  const sensor = new Sensor(path);

  sensor.run((data) => {
    console.log(`co2: ${data.co2?.toFixed(0)} , temperature: ${data.temperature?.toFixed(1)} , humidity: ${data.humidity?.toFixed(1)} , pressure: ${data.pressure?.toFixed(1)}`);
  });
};

main();
