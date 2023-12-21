import { ReadlineParser, SerialPort } from "serialport";

interface RoomCondition {
  co2: number | null;
  temperature: number | null;
  humidity: number | null;
  pressure: number | null;
}

export default class Sensor {
  private port: SerialPort;
  private parser: ReadlineParser;

  private roomConditon: RoomCondition = {
    co2: null,
    temperature: null,
    humidity: null,
    pressure: null,
  };

  constructor(path: string) {
    this.port = new SerialPort({ path, baudRate: 9600 });
    this.parser = this.port.pipe(new ReadlineParser({ delimiter: "\n" }));
    this.parser.on("data", (data) => {
      try {
        const air = JSON.parse(data.toString());
        this.roomConditon = {
          co2: air.co2 ?? null,
          temperature: air.temperature ?? null,
          humidity: air.humidity ?? null,
          pressure: air.pressure ?? null,
        };
      } catch (e) {
        // TODO 起動時にJSON.parseできないデータが来るので、どうにかしたい
      }
    });
  }

  static async getPortPath() {
    const list = await SerialPort.list();

    let portPath = "";

    // TODO この条件だと、同型のセンサーが複数つながっていると意図しない挙動になる
    // シリアル通信してセンサーを一意に識別したい
    list.forEach((port) => {
      if (port.vendorId === "1a86" && port.productId === "7523") {
        portPath = port.path;
      }
    });

    return portPath;
  }

  public getRoomCondition(): RoomCondition {
    return this.roomConditon;
  }

  async run(send: (data: RoomCondition) => void) {
    await new Promise((resolve) => {
      setTimeout(resolve, 5000);
    });

    while (true) {
      send(this.getRoomCondition())
      await new Promise((resolve) => {
        setTimeout(resolve, 1000);
      });
    }
  }
}
