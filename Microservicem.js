const zmq = require("zeromq");

async function runServer() {
  const sock = new zmq.Reply();
  await sock.bind("tcp://*:5557");
  while (1) {
    const [msg] = await sock.receive();
    console.log(msg.toString());
    const messageStr = msg.toString(); // Convert from Buffer to string
    const [lat, lon] = messageStr.split(",");
    getWeatherForecast(lat, lon, sock);
  }
}

runServer();

function getUrl(lat, lon){
    
    let url = "https://api.open-meteo.com/v1/forecast?latitude=" +
    lat + "&longitude=" + lon +
    "&hourly=temperature_2m&" + 
    "current=temperature_2m," +
    "wind_speed_10m,wind_direction_10m&"+
    "wind_speed_unit=mph&temperature_unit=fahrenheit"
    return url;
}

async function getWeatherForecast(lat, lon, sock) {
  let url = getUrl(lat, lon);
    const response = await fetch(url);
  if (response) {
    const jsonResult = await response.json();
    const spliting = ",";
    const direction = getDirection(jsonResult.current.wind_direction_10m);
    await sock.send(
      Math.round(jsonResult.current.temperature_2m) +
        "°F" + spliting + jsonResult.current.wind_speed_10m +
         " mph"+ spliting + "Direction: "+ direction
    );
  }
}

function getDirection(angle) {
  
  let directions = [
    "N","NNE", "NE", "ENE","E",
    "ESE", "SE","SSE", "S", "SSW",
    "SW", "WSW","W", "WNW", "NW",
    "NNW",
  ];

  let section = parseInt(angle / 22.5 + 0.5);

  section = section % 16;

  return directions[section];
}
