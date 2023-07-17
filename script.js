const yourweather = document.querySelector("[data-yourweather]");
const searchweather = document.querySelector("[data-searchweather]");

const loading = document.querySelector(".loding-containt");

const grantacc = document.querySelector(".grant-access");

const searchinputdata = document.querySelector("[data-search-input]");
const searchform = document.querySelector("[data-search-form]");
const weatherdetail = document.querySelector("[weather-detail-user]");






let currentTab = yourweather;
currentTab.classList.add("current-tab");
const API_key = "41efe1642699372d21e43583b09b5da8";
getfromSessionStorage();



function switchtab(clickedTab){
    

    if(clickedTab != currentTab){
        currentTab.classList.remove("current-tab");
        currentTab = clickedTab;
        currentTab.classList.add("current-tab");
        

        if(!searchform.classList.contains("active"))
        {
            weatherdetail.classList.remove("active");
            grantacc.classList.remove("active");
            searchform.classList.add("active");
        }
        else{
            searchform.classList.remove("active");
            weatherdetail.classList.remove("active");
            loading.classList.add("active");
            getfromSessionStorage();
        }
    }   

}


yourweather.addEventListener("click", () => {
    switchtab(yourweather);
});

searchweather.addEventListener("click", () => {
    switchtab(searchweather);
});

function getfromSessionStorage(){
    const localcordinaters = sessionStorage.getItem("usre-cordinate");

    if(!localcordinaters){
        grantacc.classList.add("active");
    }
    else{
        const cordinates = JSON.parse(localcordinaters);
        fetchuserweatherInfo(cordinates);
    }
}

async function fetchuserweatherInfo(cordinates){
    const {lat, lon} = cordinates;

    grantacc.classList.remove("active");
    loading.classList.add("avtive");

    try{
        const result = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_key}&units=metric`);
        const deta = await result.json();

        loading.classList.remove("active");
        weatherdetail.classList.add("active"); 
        renderWeatherInformation(deta);

    }
    catch(e){
        loading.classList.remove("active");
        console.log("Error to Fetch the API " , e);
    }
}

function renderWeatherInformation(weatherInfo) {
    const citiname = document.querySelector("[data-city-name]");
    const contryIcon = document.querySelector("[data-contryIcon]");
    const weatherdescription = document.querySelector("[data-weather-desc]");
    const weatherIcon = document.querySelector("[data-weather-icon]");
    const temperature = document.querySelector("[data-weather-temp]");
    const windspeed = document.querySelector("[data-as-windspeed]");
    const humidity = document.querySelector("[data-as-humidity]");
    const cloud = document.querySelector("[data-as-clouds]");

    console.log(weatherInfo);

    citiname.innerText = weatherInfo?.name;

    // contryIcon.innerText = weatherIfo?.sys?.country;
    contryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;

    weatherdescription.innerText = weatherInfo?.weather?.[0]?.description;

    weatherIcon.src = `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;

    temperature.innerText = `${weatherInfo?.main?.temp} ° C`;

    windspeed.innerText = weatherInfo?.wind?.speed;

    humidity.innerText = weatherInfo?.main?.humidity;

    cloud.innerText = weatherInfo?.clouds?.all;
}




function getlocation (){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else{
        alert("No geolocation supported");
    }
}

function showPosition(position){
    const usercordinatets ={
        lat: position.coords.latitude,
        lon: position.coords.longitude,
    }

    sessionStorage.setItem("usre-cordinate",JSON.stringify(usercordinatets));
    fetchuserweatherInfo(usercordinatets);
}



const grantAccessButton = document.querySelector("[data-grant-access]");
grantAccessButton.addEventListener("click", getlocation);


searchform.addEventListener("submit", (e) =>{
    e.preventDefault();

    let cityName = searchinputdata.value;

    if(cityName === "")
        return;
    else
        fetchSearchWeatherIfo(cityName);
});

async function fetchSearchWeatherIfo(city) {
    loading.classList.add("active");
    weatherdetail.classList.remove("active");
    grantacc.classList.remove("active");

    try{

        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_key}&units=metric`);
        const deta = await response.json();
        loading.classList.remove("active");
        weatherdetail.classList.add("active");
        renderWeatherInformation(deta);

    }
    catch(err){
        loading.classList.remove("active"); 
        console.log("Error to fecth city function");
    }
}
