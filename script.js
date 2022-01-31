var presenttemp = $("#temp");
var presenthmdty= $("#hmdty"); 
var quescity="";
var reqplace = $("#city");
var clearButton = $("#clear");
var presentplace = $("#presentplace");
var presentwinspd=$("#wind");
var presentuv= $("#uv");
var cityarray=[];
var API="473147de650409b07d207d4f18288066";

function find(kcity){
    for (var i=0; i<cityarray.length; i++){
        if(kcity.toUpperCase()===cityarray[i]){
            return -1;
        }
    }
    return 1;
}



function weathershow(event){
    event.preventDefault();
    if(reqplace.val().trim()!==""){
        quescity=reqplace.val().trim();
        presweather(quescity);
    }
}

function presweather(quescity){

    var queryURL= "https://api.openweathermap.org/data/2.5/weather?q=" + quescity + "&APPID=" + API;
    $.ajax({
        url:queryURL,
        method:"GET",
    }).then(function(response){
        
        console.log(response);
  
        var date=new Date(response.dt*1000).toLocaleDateString();

        $(presentplace).html(response.name +"("+date+")");
       
      
        var tempF = (response.main.temp - 273.15) * 1.80 + 32;
        $(presenttemp).html((tempF).toFixed(2)+"&#8457");
      
        $(presenthmdty).html(response.main.humidity+"%");
      
        var ws=response.wind.speed;
        var windsmph=(ws*2.237).toFixed(1);
        $(presentwinspd).html(windsmph+"MPH");
        uvfunctn(response.coord.lon,response.coord.lat);
        forecast(response.id);
        if(response.cod==200){
            cityarray=JSON.parse(localStorage.getItem("cityname"));
            console.log(cityarray);
            if (cityarray==null){
                cityarray=[];
                cityarray.push(quescity.toUpperCase()
                );
                localStorage.setItem("cityname",JSON.stringify(cityarray));
                addToList(quescity);
            }
            else {
                if(find(quescity)>0){
                    cityarray.push(quescity.toUpperCase());
                    localStorage.setItem("cityname",JSON.stringify(cityarray));
                    add(quescity);
                }
            }
        }
    });
}
   
function uvfunctn(ln,lt){
   
    var uv="https://api.openweathermap.org/data/2.5/uvi?appid="+ API+"&lat="+lt+"&lon="+ln;
    $.ajax({
            url:uv,
            method:"GET"
            }).then(function(response){
                $(presentuv).html(response.value);
            });
}

function forecast(place){

    var forcastURL="https://api.openweathermap.org/data/2.5/forecast?id="+place+"&appid="+API;
    $.ajax({
        url:forcastURL,
        method:"GET"
    }).then(function(response){
        for (i=0;i<5;i++){
            var date= new Date((response.list[((i+1)*8)-1].dt)*1000).toLocaleDateString();
 
            var temp1= response.list[((i+1)*8)-1].main.temp;
            var temp2=(((temp1-273.5)*1.80)+32).toFixed(2);
            var humidity1= response.list[((i+1)*8)-1].main.humidity;
            $("#futuredate"+i).html(date);
            $("#futuretemp"+i).html(temp2+"&#8457");
            $("#futurehu"+i).html(humidity1+"%");
        }
    });
}

function add(kcity){
    var citylist= $("<li>"+kcity.toUpperCase()+"</li>");
    $(citylist).attr("class","list-group-item text-dark justify-content-center");
    $(citylist).attr("data-value",kcity.toUpperCase());
    $(".list-group").append(citylist);
}

function oldcity(event){
    var pastlist=event.target;
    if (event.target.matches("li")){
        quescity=pastlist.textContent.trim();
        presweather(quescity);
    }
}

function showlast(){
    $("ul").empty();
    var cityarray = JSON.parse(localStorage.getItem("cityname"));
    if(cityarray!==null){
        cityarray=JSON.parse(localStorage.getItem("cityname"));
        for(i=0; i<cityarray.length;i++){
            add(cityarray[i]);
        }
        quescity=cityarray[i-1];
        presweather(quescity);
    }
}

function refresh(event){
    event.preventDefault();
    cityarray=[];
    localStorage.removeItem("cityname");
    document.location.reload();
}

$("#search").on("click",weathershow);
$(document).on("click",oldcity);
$(window).on("load",showlast);
$("#clear").on("click",refresh);