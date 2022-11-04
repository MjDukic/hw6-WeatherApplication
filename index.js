//ALL OF MY ELEMENTS

//todays date! using moment and jquery
var today = moment();
$("#date").text(today.format("MMMM Do, YYYY"));

var forecast = document.querySelector('#forecast')


//explain!!!
var input = document.querySelector('#input')

input.addEventListener('keyup', function(event) {
    if (event.key === 'Enter') {
      createWeatherDisplay(event.target.value)
    }
})

//so that the histroy does not duplicate and only shows once
var previousSearchHistory = localStorage.getItem('history')
if(previousSearchHistory) {
    previousSearchHistory = JSON.parse(previousSearchHistory)
} else [
    previousSearchHistory = []
]

//FOR BUTTON TO WORK
for (var i = 0; i < previousSearchHistory.length; i++) {
    var historyWrapper = document.createElement('div')
    historyWrapper.classList.add('historyBtn')
    var historyBtn = document.createElement('button') 
    var historyItem = previousSearchHistory[i]
    historyBtn.textContent = historyItem
    historyBtn.addEventListener('click', function(event) {
        createWeatherDisplay(event.target.textContent)
    })

    historyWrapper.appendChild(historyBtn)
    document.body.appendChild(historyWrapper)
}



var API_KEY = '30ddf985a1744060db6e437b6a64a78e'


function getGeoLocation(query, limit = 5) {
    return fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=${limit}&appid=${API_KEY}`)
}

//for current day
function getCurrentWeather (arguments) {
    return fetch (`https://api.openweathermap.org/data/2.5/weather?lat=${arguments.lat}&lon=${arguments.lon}&units=imperial&appid=${API_KEY}`)
    
}

//for 5 day forecast

function getCurrentFiveDayWeather (arguments) {
    return fetch (`https://api.openweathermap.org/data/2.5/forecast?lat=${arguments.lat}&lon=${arguments.lon}&units=imperial&appid=${API_KEY}`)

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
                var currentDayDiv = document.createElement('div')
                var currentWeatherStatement = document.createElement('p')
                currentWeatherStatement.textContent = `${weatherData.weather[0].main}: it is currently ${weatherData.main.temp} F`
                //printed to screen
                addToHistory(location)
                currentDayDiv.append(currentWeatherStatement, weatherPicture)
                currentDay.append(currentDayDiv)
    
            })
            //for 5 day forecast
            getCurrentFiveDayWeather({ lat: data[0].lat, lon: data[0].lon })
            .then(fiveDayResponse => fiveDayResponse.json())
            .then(fiveDayData => {
                for (i = 0; i < 5; i++) {
                    var dayForecastDiv = document.createElement('div')
                    var header = document.createElement('h3')
                    header.textContent = today.add(i + 1, "days").format("MM/D/YYYY")
                    var fiveDayStatement = document.createElement('p')
                    fiveDayStatement.textContent = ` Temp: ${fiveDayData.list[i].main.temp} F`
                    var windForecast = document.createElement('p')
                    windForecast.textContent = ` Wind: ${fiveDayData.list[i].wind.speed} MPH`
                    var humidityForecast = document.createElement('p')
                    humidityForecast.textContent = ` Humidity: ${fiveDayData.list[i].main.humidity} %`

                    dayForecastDiv.append(header, fiveDayStatement, windForecast, humidityForecast)
                    forecast.append(dayForecastDiv)
                    
                }
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
