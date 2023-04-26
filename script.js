var cityname = document.querySelector("#cityname");
var submit= document.querySelector("#submit");
var aside = document.querySelector("#asidebar");
var h3tagcityname = document.querySelector("#h3tagcityname");
var weatherdetails = document.querySelector("#weatherdetails");
var tempid = document.querySelector("#tempid");
var humidityid = document.querySelector("#humidityid");
var windid = document.querySelector("#windid");
var icon = document.querySelector("#icon");
var fivedayforecast = document.querySelector("#h45dayforecast");
var forecastdisplay = document.querySelector("#forecastdetails");


var localstoragedata = localStorage.getItem("city");
var parsedlocalstoragedata= JSON.parse(localstoragedata);

var buttondiv = document.createElement("div");
buttondiv.setAttribute("style","display:flex; flex-direction:column;");
aside.append(buttondiv);

// Creates buttons for the city names in the aside bar
function createbutton(name){   
  var buttoncreate= document.createElement("button");
  var nameuppercase =name.charAt(0).toUpperCase() + name.slice(1);
  buttoncreate.textContent=nameuppercase;
  buttoncreate.setAttribute("style","background-color:gray;");
  buttondiv.appendChild(buttoncreate);
}

// Loops through the localstorage and calls the createbutton function for each data.
function displaycitybuttons(){
  if(parsedlocalstoragedata!==null){  
    for (var i=0;i<parsedlocalstoragedata.length;i++){
       createbutton(parsedlocalstoragedata[i]); 
    }
  }
}

// based on the input from the textbox, calls the weatherapi to fetch data for current day and forecast for 5-days
function populateweatherdata(city){
  weatherdetails.setAttribute('style','border:2px solid black; height: 200px; margin:10px;');
  var todaydate = dayjs().format("MM/DD/YYYY")
  var uppercasecity = city.charAt(0).toUpperCase() + city.slice(1);
  h3tagcityname.innerHTML = uppercasecity + (" (" + todaydate + ")")  ;
  var requestedurl = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&APPID=130da94c2079e1360dd161f2374c9fcf"
  fetch(requestedurl)
   .then (function(response){
    if (response.ok)
    {
      return response.json().then (function(data){
      tempid.textContent = "Temp: " + data.main.temp + " F";
      humidityid.textContent = "Humidity: " + data.main.humidity + " %";
      windid.textContent = "Wind: " + data.wind.speed + " MPH";
      var icon = data.weather[0].icon ;
      var iconurl = "https://openweathermap.org/img/wn/"+icon+".png"; 
      var icondisplay = document.createElement('img');
      icondisplay.setAttribute('src',iconurl);
      h3tagcityname.append(icondisplay);
  
      fivedayforecast.textContent="5-Day Forecast:"; 
      var forecasturl = "https://api.openweathermap.org/data/2.5/forecast?q="+city+"&units=imperial&appid=130da94c2079e1360dd161f2374c9fcf";
      fetch(forecasturl)
        .then (function(response){
          return response.json();
        })
       
        .then (function(data){
          var forecastdata = data.list.filter(function(currentdata){
          return currentdata.dt_txt.endsWith("15:00:00");
        })
          for (var i=0;i<forecastdata.length;i++){
            var day = document.createElement('div');
            day.setAttribute('style','background-color: rgb(69, 69, 163); color:white; margin:10px; padding:10px;width:175px;');
            var daydate = document.createElement('h4');
            var dayicon = document.createElement('img');
            var daytemp= document.createElement('p');
            var dayhumidity= document.createElement('p');
            var daywind= document.createElement('p');

            daydate.textContent = dayjs(forecastdata[i].dt_txt).format('MM/DD/YYYY');
            var forecasticon = forecastdata[i].weather[0].icon ;
            var forecasticonurl = "https://openweathermap.org/img/wn/"+forecasticon+".png"; 
            dayicon.setAttribute('src', forecasticonurl);
            daytemp.textContent = "Temp: "+ forecastdata[i].main.temp  + " F";
            dayhumidity.textContent = "Humidity: " + forecastdata[i].main.humidity  + " %";
            daywind.textContent = "Wind: " + forecastdata[i].wind.speed + " MPH";

            day.appendChild(daydate);
            day.appendChild(dayicon);
            day.appendChild(daytemp);
            day.appendChild(daywind);
            day.appendChild(dayhumidity);
            forecastdisplay.append(day);
          }
        })
      })
    }
    else
    {
      alert("Please enter a valid city name");
      parsedlocalstoragedata.pop();
      localStorage.setItem('city', JSON.stringify(parsedlocalstoragedata));
      buttondiv.lastElementChild.remove();
      return;
    }
  });
};

function findcityweather(event){  

  event.preventDefault() 
  if(parsedlocalstoragedata===null)
  {
    parsedlocalstoragedata=[];
  }
  var city = cityname.value;
  if(city.length!==0){
    parsedlocalstoragedata.push(city);
    localStorage.setItem('city', JSON.stringify(parsedlocalstoragedata));
    createbutton(city);
    deletedata(); 
    populateweatherdata(city);
    cityname.value="";
  }
}

// Resets all the data fields so the data doesn't keep appending to the existing one
function deletedata(){
  tempid.textContent = " ";
  humidityid.textContent = " ";
  windid.textContent = " ";
  while (forecastdisplay.hasChildNodes()) {
    forecastdisplay.removeChild(forecastdisplay.firstChild);
    }
}

function weatherdata(event){
  var clickedbuttonname=event.target.innerHTML;
  deletedata();
  populateweatherdata(clickedbuttonname);
}

displaycitybuttons();
submit.addEventListener('click',findcityweather)
buttondiv.addEventListener('click',weatherdata);