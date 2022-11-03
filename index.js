//ALL OF MY ELEMENTS

var input = document.querySelector('#input')

input.addEventListener('keyup', function(event) {
    if (event.key === 'Enter') {
      createWeatherDisplay(event.target.value)
    }
})

var previousSearchHistory = localStorage.getItem('history')
if(previousSearchHistory) {
    previousSearchHistory = JSON.parse(previousSearchHistory)
} else [
    previousSearchHistory = []
]

for (var i = 0; i < previousSearchHistory.length; i++) {
    var historyBtn = document.createElement('button')
    var historyItem = previousSearchHistory[i]
    historyBtn.textContent = historyItem
    historyBtn.addEventListener('click', function(event) {
        createWeatherDisplay(event.target.textContent)
    })

    document.body.appendChild(historyBtn)
}

var API_KEY = '30ddf985a1744060db6e437b6a64a78e'


function getGeoLocation(query, limit = 5) {
    return fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=${limit}&appid=${API_KEY}`)
}

function getCurrentWeather (arguments) {
    return fetch (`https://api.openweathermap.org/data/2.5/weather?lat=${arguments.lat}&lon=${arguments.lon}&units=imperials&appid=${API_KEY}`)
    
}


//saving already searched items
function addToHistory(location) {
    var searchHistory = localStorage.getItem('history')
    if (searchHistory) {
        searchHistory = JSON.parse(searchHistory)

        if (searchHistory.includes(location)) {
            return
        }

        searchHistory.push(location)
        localStorage.setItem('history', JSON.stringify(searchHistory))
    } else {
        searchHistory = [location]
        localStorage.setItem('history', JSON.stringify(searchHistory))
    }
}



//function that puts all this on one and use whatever location we tell it to use
function createWeatherDisplay(location) { 
    //function that returns a promise. the promise is a fetch to api geolocator.. we know its a promise bc it returns a .then
    return getGeoLocation(location)
    .then(function(response) {
     return response.json()
    })
    //nested promises
    .then (data => {
        console.log(data)
     if(data.length === 0) {
        var erroEl = document.createElement('p')
        erroEl.textContent = `We couldn't find ${location}`
        document.body.appendChild(erroEl)
        } else {
            getCurrentWeather({ lat: data[0].lat, lon: data[0].lon })
            .then(weatherResponse => weatherResponse.json())
            .then(weatherData => {
                var weatherPicture = document.createElement('img')
                weatherPicture.src = `http://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`
                var currentWeatherStatement = document.createElement('p')
                currentWeatherStatement.textContent = `${weatherData.weather[0].main}: it is currently ${weatherData.weather[0].description}`
                //printed to screen
                document.body.appendChild(weatherPicture)
                document.body.appendChild(currentWeatherStatement)
                addToHistory(location)
            })
            //catch is to literally catch the errors if we have any.. good practice to include after .then
            .catch(error => {
                document.body.textContent = error.message
            })
        }
        
    })
    .catch (error => {
        document.body.textContent = error.message
    })
    
}
