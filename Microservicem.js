//  Binds REP socket to tcp://*:5555

const zmq = require("zeromq");

async function runServer() {
  const sock = new zmq.Reply();

  await sock.bind("tcp://*:5555");      //sets up connection
  while(1){
  const [msg] = await sock.receive();       //recieve messages from client
  console.log(msg.toString());
  const messageStr = msg.toString(); // Convert from Buffer to string
  console.log("Received message:", messageStr);   

  const [lat, lon] = messageStr.split(",");   //splits the message into usable data
  console.log("\n");

  getWeatherForecast(lat, lon, sock);   
  }
}

runServer();

async function getWeatherForecast(lat, lon, sock) {
  // const unitBtns = document.querySelectorAll('input[name="units"]');
  let unit = "fahrenheit";
    //api url
  let url =
    "https://api.open-meteo.com/v1/forecast?latitude=" +
    lat +
    "&longitude=" +
    lon +
    "&hourly=temperature_2m&current=temperature_2m,wind_speed_10m,wind_direction_10m&wind_speed_unit=mph&temperature_unit=";
  url = url + unit;
  console.log("URL ", url);
  const response = await fetch(url);
  if (response.ok) {
    const jsonResult = await response.json();     //assigns the api result to a const variable 
    console.log("Full Json ::", jsonResult);
    console.log("Json Daily ::", jsonResult.current);
    console.log("current elements::", jsonResult.current.temperature_2m);  
    const spliting = ",";         

    //changes the number from the api into a direction
    const direction = getDirection(jsonResult.current.wind_direction_10m);

    await sock.send(
      Math.round(jsonResult.current.temperature_2m) +
        "°F" +
        spliting +
        jsonResult.current.wind_speed_10m +
        spliting +
        direction
    );
  }
}
function getDirection(angle) {
  // We divide the wind direction into 16 sections
  let directions = [
    "N",
    "NNE",
    "NE",
    "ENE",
    "E",
    "ESE",
    "SE",
    "SSE",
    "S",
    "SSW",
    "SW",
    "WSW",
    "W",
    "WNW",
    "NW",
    "NNW",
  ];
  //Every 360 / 16 degree, there's a section change
  // So every 22.5 degree, there's a section change
  // In order to get the correct section, we just need to divide
  let section = parseInt(angle / 22.5 + 0.5);
  // If our result comes to be x.6, which should normally be rounded off to
  // int(x) + 1, but parseInt doesn't care about it
  // Hence, we are adding 0.5 to it

  // Now we know the section, just need to make sure it's under 16
  section = section % 16;

  // Now return it
  return directions[section];
}
