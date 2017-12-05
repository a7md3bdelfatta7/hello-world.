import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-country',
  templateUrl: './country.component.html',
  styleUrls: ['./country.component.css']
})
export class CountryComponent implements OnInit {

  user;
  country;
  weatherInfo;
  currentWeatherIconUrl;
  cities;
  isDataAvailable: boolean = false;
  countryLocalTime;
  weatherForecast;
  filteredCities;

  constructor(private userService: UserService,private router:Router) {
    this.fetchData();

  }

  fetchData() {
    //get user's ip address
    this.userService.getUserInfo().subscribe((user) => {
      this.user = user;
      //Get Weather Information using Ip Address 
      this.userService.getwheatherInfo(this.user.query).subscribe((weatherInfo) => {

        this.weatherInfo = weatherInfo.data.current_condition[0];
        this.currentWeatherIconUrl = this.weatherInfo.weatherIconUrl[0].value;
        
        weatherInfo.data.time_zone.constructor === Array? this.countryLocalTime = weatherInfo.data.time_zone[0].localtime
        :this.countryLocalTime = weatherInfo.data.time_zone.localtime;

        this.weatherForecast=weatherInfo.data.weather;
        this.weatherForecast.shift();    
        //Get Cities of country using country letter code
        this.userService.getCitiesOfCountry(user.countryCode).subscribe(
          cities => {
          this.cities = cities.results
          this.filteredCities=this.cities;
            this.isDataAvailable = true;
          }
        );
      });
    });
  }

  searchCity(val: any) {
    if (!val) this.filteredCities = this.cities;
    this.filteredCities = this.cities.filter(d => d.city.toLowerCase().indexOf(val.toLowerCase()) >= 0);
  }

  selectCity(selectedCity){
    this.userService.userSelectedCity=selectedCity;    
    this.router.navigateByUrl('/city/'+selectedCity.city);    
  } 

  ngOnInit() {
  }

}
