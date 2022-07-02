let weather = {
	apiKey: "Temp",
	fetchWeather: function (city) {
		fetch(
			"https://api.openweathermap.org/data/2.5/weather?q=" +
				city +
				"&units=metric&appid=" +
				this.apiKey
		)
			.then((response) => response.json())
			.then((data) => this.displayWeather(data))
			.catch((error) => {
				console.log("Error", error);
			});
	},
	displayWeather: function (data) {
		const { name } = data;
		const { icon, description } = data.weather[0];
		const { temp, humidity } = data.main;
		const { speed } = data.wind;
		document.querySelector(".city").innerText = "Weather in " + name;
		document.querySelector(".icon").src =
			"https://openweathermap.org/img/wn/" + icon + ".png";
		document.querySelector(".description").innerText = description;
		document.querySelector(".temp").innerText = temp + "°C";
		document.querySelector(".huminity").innerText =
			"Humidity: " + humidity + "%";
		document.querySelector(".wind").innerText =
			"Wind speed: " + speed + " km/h";
		document.querySelector(".weather").classList.remove("loading");
		document.body.style.backgroundImage =
			"url('https://source.unsplash.com/1600x900/?" + name + "')";
	},
	search: function () {
		this.fetchWeather(document.querySelector(".search-bar").value);
	},
};

let geocode = {
	reverseGeocode: function (latitude, longitude) {
		var api_key = "Temp";
		var api_url = "https://api.opencagedata.com/geocode/v1/json";
		var request_url =
			api_url +
			"?" +
			"key=" +
			api_key +
			"&q=" +
			encodeURIComponent(latitude + "," + longitude) +
			"&pretty=1" +
			"&no_annotations=1";

		var request = new XMLHttpRequest();
		request.open("GET", request_url, true);

		request.onload = function () {
			if (request.status === 200) {
				// Success!
				var data = JSON.parse(request.responseText);
				weather.fetchWeather(data.results[0].components.city);
			} else if (request.status <= 500) {
				// We reached our target server, but it returned an error
				console.log(
					"unable to geocode! Response code: " + request.status
				);
				var data = JSON.parse(request.responseText);
				console.log("error msg: " + data.status.message);
			} else {
				console.log("server error");
			}
		};

		request.onerror = function () {
			// There was a connection error of some sort
			console.log("unable to connect to server");
		};

		request.send(); // make the request
	},
	getLocation: function () {
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(success, console.error);
		} else {
			weather.fetchWeather("Seattle");
		}
        function success(data) {
			geocode.reverseGeocode(data.coords.latitude, data.coords.longitude);
		}
	},
};

document.querySelector(".search").addEventListener("click", function () {
	weather.search();
});

document.querySelector(".search-bar").addEventListener("keyup", function () {
	if (event.key == "Enter") {
		weather.search();
	}
});

geocode.getLocation();
