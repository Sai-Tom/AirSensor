import Sensor from "./modules/Sensor";

const main = async () => {
  const path = await Sensor.getPortPath();

  if (!path) {
    console.error("Cannot find serial port.");
    return;
  }

  const sensor = new Sensor(path);

  const now = {
    co2: "0",
    temperature: "0",
    humidity: "0",
    pressure: "0",
    isFirst: true,
  };

  sensor.run((data) => {
    const co2 = data.co2?.toFixed(0) ?? "0";
    const temp = data.temperature?.toFixed(1) ?? "0";
    const hum = data.humidity?.toFixed(1) ?? "0";
    const press = data.pressure?.toFixed(1) ?? "0";

    if (now.isFirst) {
      now.co2 = co2;
      now.temperature = temp;
      now.humidity = hum;
      now.pressure = press;
      now.isFirst = false;
      return;
    }

    const diff = {
      co2: (Number(now.co2) - Number(co2)).toFixed(1),
      temperature: (Number(now.temperature) - Number(temp)).toFixed(1),
      humidity: (Number(now.humidity) - Number(hum)).toFixed(1),
      pressure: (Number(now.pressure) - Number(press)).toFixed(1),
    };

    now.co2 = co2;
    now.temperature = temp;
    now.humidity = hum;
    now.pressure = press;

    const hasDiff = Object.values(diff).some((v) => v !== "0.0");
    if (!hasDiff) {
      return;
    }

    console.log(`co2: ${data.co2?.toFixed(0)} , temperature: ${data.temperature?.toFixed(1)} , humidity: ${data.humidity?.toFixed(1)} , pressure: ${data.pressure?.toFixed(1)}`);
  });
};

main();
