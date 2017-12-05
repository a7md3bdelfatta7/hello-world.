import { ActivatedRoute } from '@angular/router'
import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';
import { TabsModule } from "ng2-tabs";
import { NvD3Module } from 'ng2-nvd3';
import 'd3';
import 'nvd3';

@Component({
  selector: 'app-city',
  templateUrl: './city.component.html',
  styleUrls: ['./city.component.css', '../../../node_modules/nvd3/build/nv.d3.css'],
  encapsulation: ViewEncapsulation.None

})
export class CityComponent implements OnInit {

  cityName;
  selectedCity;
  weatherInfo;
  weatherForecast;
  isDataAvailiable = false;
  ClimateAverages;
  barChartLabels: string[];
  barChartType: string = 'bar';
  barChartLegend: boolean = true;
  barChartData: any[];
  barChartColors: Array<any> = [{ backgroundColor: '#05a9e1' }, { backgroundColor: '#555' }];
  public lineChartData;
  public lineChartLabels;
  public lineChartType: string = 'line';
  months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'Novmber', 'December'];
  years = [2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017];
  selectedMonth = "January";
  selectedYear = "2009";
  public barChartOptions: any = {
    scaleShowVerticalLines: false,
    responsive: true
  };
  public lineChartOptions:any = {
    responsive: true
  };

  public options = {
    chart: {
      type: 'discreteBarChart',
      height: 350,
      margin: {
        top: 20,
        right: 20,
        bottom: 50,
        left: 55
      },
      x: function (d) { return d.label; },
      y: function (d) { return d.value; },
      showValues: true,
      valueFormat: function (d) {
        // return d3.format(',.4f')(d);
      },
      duration: 1000,
      xAxis: {
        axisLabel: 'Date'
      },
      yAxis: {
        axisLabel: 'Tempreture(Celsius)',
        axisLabelDistance: -10
      }
    }
  }
  data = [
    {
      key: "Cumulative Return",
      values: []
    }
  ]

  constructor(private router: Router, private userService: UserService) { }

  ngOnInit() {
    if (this.userService.userSelectedCity) {
      this.selectedCity = this.userService.userSelectedCity;
      this.userService.getCityCurrentWeatherInfo(this.selectedCity).subscribe(result => {
        this.weatherInfo = result.data.current_condition[0];
        this.weatherForecast = result.data.weather.slice(1, 7);

        this.ClimateAverages = result.data.ClimateAverages[0].month;
        this.barChartLabels = this.getMonthsLabels(this.ClimateAverages);
        this.barChartData = this.getMonthsTempDegree(this.ClimateAverages);
        this.data[0].values = this.getNextWeekTempDegree(result.data.weather);
        //get city historacal weather information
        this.drawHistoryInfo();
      });
    } else {
      this.router.navigateByUrl('/');
    }
  }

  public randomizeType(): void {
    this.lineChartType = this.lineChartType === 'line' ? 'bar' : 'line';
  }

  getMonthsLabels(months) {
    var nameOfMonths = [];
    for (var i = 0; i < months.length; i++) {
      nameOfMonths.push(months[i].name);
    }
    return nameOfMonths;
  }

  getMonthsTempDegree(months) {
    var monthsTemDegree = [
      { data: [], label: 'Maximum' },
      { data: [], label: 'Minimum' }
    ];
    for (var i = 0; i < months.length; i++) {
      monthsTemDegree[0].data.push(months[i].absMaxTemp);
      monthsTemDegree[1].data.push(months[i].avgMinTemp);
    }
    return monthsTemDegree;
  }

  getNextWeekTempDegree(days) {
    var values = [];
    for (var i = 0; i < days.length; i++) {
      values.push({ "label": days[i].date, "value": days[i].maxtempC },
        { "label": days[i].date, "value": days[i].mintempC });
    }
    return values;
  }

  getLineChartLabel(days) {

    var dates = [];
    for (let i = 0; i < days.length; i++) {
      dates.push(days[i].date);
    }
    return dates;
  }

  getLineChartData(days) {
    var data = [
      { data: [], label: 'Maximum' },
      { data: [], label: 'Minimum' }
    ];
    for (var i = 0; i < days.length; i++) {
      data[0].data.push(days[i].maxtempC);
      data[1].data.push(days[i].mintempC);
    }
    return data;
  }

  onMonthChange(monthvalue) {
    this.selectedMonth = monthvalue;
  }
  onYearChange(yearValue) {
    this.selectedYear = yearValue;
  }

  drawHistoryInfo() {

    var selectedMonthNumber: any = this.months.indexOf(this.selectedMonth) + 1;
    selectedMonthNumber = selectedMonthNumber.toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false })
    var selectedYear = this.selectedYear;
    var startDate = selectedYear + "-" + selectedMonthNumber + "-01";

    if (selectedMonthNumber == 2) { //Februry
      var endDate = selectedYear + "-" + selectedMonthNumber + "-28";
    } else if (selectedMonthNumber == 4 || selectedMonthNumber == 6 ||
      selectedMonthNumber == 9 || selectedMonthNumber == 11) {
      var endDate = selectedYear + "-" + selectedMonthNumber + "-30";
    } else {
      var endDate = selectedYear + "-" + selectedMonthNumber + "-31";
    }
    var todayDate = new Date();
    var intervalEndDate = new Date(endDate);
    //if today date is less than end date
    if (intervalEndDate.getTime() > todayDate.getTime()) {
      alert("This Month is not finished yet.");
      return;
    }
    this.userService.getCityHitoricalWeatherInfo(this.selectedCity, startDate, endDate).subscribe(historicalInfo => {
      //if api returns all data in this interval
      if (historicalInfo.data.weather.length >= 28) {
        this.lineChartData = this.getLineChartData(historicalInfo.data.weather);
        this.lineChartLabels = this.getLineChartLabel(historicalInfo.data.weather);
        
        //function called for first time
        if (!this.isDataAvailiable) {
          //start render html after data is loaded.
          this.isDataAvailiable = true;
          //Added this line to force NVD3 to redraw the chart to be full width
          setTimeout(function () { window.dispatchEvent(new Event('resize')); }, 200);
        }else{
          //function called when button is clicked
          this.lineChartType = this.lineChartType === 'line' ? 'bar' : 'line';
          //Added this line to force ng2-charts to redraw the chart to update data
          setTimeout(function () {
           document.getElementById("toggleButton").dispatchEvent(new Event('click'));
          });
        }



      } else {
        //recall service to get data correctly
        console.log("API returns wrong Data");        
        this.drawHistoryInfo();
      }
    });

  }

}
