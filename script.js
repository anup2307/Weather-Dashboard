var cityname = document.querySelector("#cityname");
var submit= document.querySelector("#submit");
var aside = document.querySelector("#asidebar");

var localstoragedata = localStorage.getItem('city');
var parsedlocalstoragedata= JSON.parse(localstoragedata);

function createbutton(name){
    var buttoncreate= document.createElement("button");
    buttoncreate.textContent=name;
    buttoncreate.setAttribute('style','background-color:gray;');
    aside.appendChild(buttoncreate);
}

function displaycitybuttons(){
  if(parsedlocalstoragedata!==null){  
    for (var i=0;i<parsedlocalstoragedata.length;i++){
       createbutton(parsedlocalstoragedata[i]); 
    }
  }
}

function findcity(event){  
    event.preventDefault() 
    if(parsedlocalstoragedata===null)
    {
        parsedlocalstoragedata=[];
    }
   var city = cityname.value;
   parsedlocalstoragedata.push(city);
   localStorage.setItem('city', JSON.stringify(parsedlocalstoragedata));
   createbutton(city); 
   cityname.value=" ";
}


submit.addEventListener('click',findcity)
displaycitybuttons();