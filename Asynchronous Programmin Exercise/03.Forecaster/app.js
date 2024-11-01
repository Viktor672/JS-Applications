function attachEvents() {
    let symbolsObj = {
        'Sunny': '&#x2600;',
        'Partly sunny': '&#x26C5;',
        'Overcast': '&#x2601;',
        'Rain': '&#x2614;',
        'Degrees': '&#176;'
    };

    let locationEl = document.querySelector('#location');
    let submitButtonEl = document.querySelector('#submit');
    let forecastEl = document.querySelector('#forecast');
    let currendDivEl = document.querySelector('#current');
    let upcomingDivEl = document.querySelector('#upcoming');

    submitButtonEl.addEventListener('click', e => {
        if (locationEl.value === '') return;

        fetch('http://localhost:3030/jsonstore/forecaster/locations')
            .then(response => response.json())
            .then(data => {
                let location = data.find(curObj => curObj.name === locationEl.value);
                if (!location) {
                    alert('Location not found!');
                    return;
                }

                forecastEl.style.display = 'block';

                fetch(`http://localhost:3030/jsonstore/forecaster/today/${location.code}`)
                    .then(res => res.json())
                    .then(info => {
                        let forecastsDivEl = document.createElement('div');
                        forecastsDivEl.classList.add('forecasts');

                        let symbolSpanEl = document.createElement('span');
                        symbolSpanEl.classList.add('condition', 'symbol');
                        symbolSpanEl.innerHTML = symbolsObj[info.forecast.condition];

                        let conditionSpanEl = document.createElement('span');
                        conditionSpanEl.classList.add('condition');

                        let citySpanEl = document.createElement('span');
                        citySpanEl.classList.add('forecast-data');
                        citySpanEl.textContent = info.name;

                        let temperatureSpanEl = document.createElement('span');
                        temperatureSpanEl.classList.add('forecast-data');
                        temperatureSpanEl.innerHTML = `${info.forecast.low}${symbolsObj.Degrees}/${info.forecast.high}${symbolsObj.Degrees}`;

                        let weatherSpanEl = document.createElement('span');
                        weatherSpanEl.classList.add('forecast-data');
                        weatherSpanEl.textContent = info.forecast.condition;

                        conditionSpanEl.appendChild(citySpanEl);
                        conditionSpanEl.appendChild(temperatureSpanEl);
                        conditionSpanEl.appendChild(weatherSpanEl);

                        forecastsDivEl.appendChild(symbolSpanEl);
                        forecastsDivEl.appendChild(conditionSpanEl);
                        currendDivEl.appendChild(forecastsDivEl);
                    });

                fetch(`http://localhost:3030/jsonstore/forecaster/upcoming/${location.code}`)
                    .then(res => res.json())
                    .then(info => {
                        let forecastInfoDivEl = document.createElement('div');
                        forecastInfoDivEl.classList.add('forecast-info');
                        for (const curInfo of info.forecast) {
                            let upcomingSpanEl = document.createElement('span');
                            upcomingSpanEl.classList.add('upcoming');

                            let symbolSpanEl = document.createElement('span');
                            symbolSpanEl.classList.add('symbol');
                            symbolSpanEl.innerHTML = symbolsObj[curInfo.condition];

                            let temperatureSpanEl = document.createElement('span');
                            temperatureSpanEl.classList.add('forecast-data');
                            temperatureSpanEl.innerHTML = `${curInfo.low}${symbolsObj.Degrees}/${curInfo.high}${symbolsObj.Degrees}`;

                            let weatherSpanEl = document.createElement('span');
                            weatherSpanEl.classList.add('forecast-data');
                            weatherSpanEl.textContent = curInfo.condition;

                            upcomingSpanEl.appendChild(symbolSpanEl);
                            upcomingSpanEl.appendChild(temperatureSpanEl);
                            upcomingSpanEl.appendChild(weatherSpanEl);

                            forecastInfoDivEl.appendChild(upcomingSpanEl);
                        }
                        upcomingDivEl.appendChild(forecastInfoDivEl);
                    });
            })
            .catch(error => console.log('Error'));
    });
}

attachEvents();
