import { Injectable } from '@angular/core';
import { Http,Response,Jsonp,RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map'
import 'rxjs/add/operator/catch'
import {Observable} from 'rxjs/Rx';

@Injectable()
export class UserService {

  public userSelectedCity=false;

  constructor(private http:Http,private jsonp:Jsonp) {}

  getUserInfo(){
      return this.http.get('http://ip-api.com/json')
    .map((response:Response)=>response.json());
  }


  public getwheatherInfo(ipAddress){
    return this.jsonp.get('https://api.worldweatheronline.com/premium/v1/weather.ashx?callback=JSONP_CALLBACK',{
      params:{q:ipAddress,key:"df72ff66469d4bbdb6f185918171410",format:"json",showlocaltime:"yes",num_of_days:7}})
  .map((response:Response)=>response.json());
  }


  public getCitiesOfCountry(countryLetterCode){
      //Jsonp beacuse No 'Access-Control-Allow-Origin' header is present on the requested resource
      return this.jsonp.get('https://api.meetup.com/cities?callback=JSONP_CALLBACK',{
        params:{key:"3a311d31dd236d621ee2c48235034",country:countryLetterCode}
      })
      .map((response:Response)=>response.json());
    }


  public getCityCurrentWeatherInfo(city){

    var url="https://api.worldweatheronline.com/premium/v1/weather.ashx?callback=JSONP_CALLBACK";
    return this.jsonp.get(url,{
        params:{q:city.lat+","+city.lon,key:"df72ff66469d4bbdb6f185918171410",format:"json",num_of_days:14}})
    .map((response:Response)=>response.json());
    
  }

  public getCityHitoricalWeatherInfo(city,startDate,EndDate){
    
   // EndDate? EndDate:EndDate="";
    

    var url="https://api.worldweatheronline.com/premium/v1/past-weather.ashx?callback=JSONP_CALLBACK";
    var serviceParams={
      q:city.lat+","+city.lon,
      key:"df72ff66469d4bbdb6f185918171410",
      format:"json",
      date:startDate,
      EndDate:EndDate
    };

    return this.jsonp.get(url,{
        params:serviceParams})
    .map((response:Response)=>response.json());
    
  }

  


}
