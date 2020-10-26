const weatherIcons = {
  "Rain" : "wi wi-day-rain",
  "Clouds" : "wi wi-day-cloudy",
  "Clear" : "wi wi-day-sunny",
  "Snow" : "wi wi-day-snow",
  "Mist" : "wi wi-day-fog",
  "Drizzle" : "wi wi-day-sleet",
}

function capitalize(str) {
  return str[0].toUpperCase() + str.slice(1);
}

async function main(withIp = true) {
  let ville;
  if(withIp){
    // Récupérer l'adresse IP du client qui ouvre la page :  https://api.ipify.org?fomat=json
    const ip = await fetch('https://api.ipify.org/?fomat=json')
      .then(result => result.text())
      .then(data => data);

    // Récupérer la ville grace a l'adresse IP : http://api.ipstack.com/adresseIPenQuestion?access_key=de93adce381ff44f08e99fa77d9ff9eb&format=1
    ville = await fetch('http://api.ipstack.com/' + ip + '?access_key=de93adce381ff44f08e99fa77d9ff9eb&format=1')
          .then(result => result.json())
          .then(json => json.city);
  } else {
    ville = document.querySelector('#ville').textContent;
  }

  // Récupérer les infos météo grace a la ville : http://api.openweathermap.org/data/2.5/weather?q=VillleEnQuestion&appid=40b7b127537db7e414d809f2c7a3a0bd&lang=fr&units=metric
  const meteo = await fetch('http://api.openweathermap.org/data/2.5/weather?q=' + ville + '&appid=40b7b127537db7e414d809f2c7a3a0bd&lang=fr&units=metric')
            .then(result => result.json())
            .then(json => json);

  // Afficher les informations météo sur la page
  displayWeatherInfos(meteo);
}

function displayWeatherInfos(data){
  const name = data.name;
  const temperature = data.main.temp;
  const conditions = data.weather[0].main;
  const description = data.weather[0].description;

  document.querySelector('#ville').textContent = name;
  document.querySelector('#temperature').textContent = Math.round(temperature);
  document.querySelector('#conditions').textContent = capitalize(description);
  document.querySelector('i.wi').className = weatherIcons[conditions];

  document.body.className = conditions.toLowerCase();
}

const ville = document.querySelector('#ville');

ville.addEventListener('click', () => {
  ville.contentEditable = true;
});

ville.addEventListener('keydown', (e) => {
  if(e.keyCode == 13){
    e.preventDefault();
    ville.contentEditable = false;
    main(false);
  }
});

main();
