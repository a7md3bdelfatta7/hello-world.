import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule, JsonpModule } from '@angular/http';
import { AppComponent } from './app.component';
import { CountryComponent } from './country/country.component';
import { UserService } from './services/user.service';
import { FormsModule } from '@angular/forms';
import { CityComponent } from './city/city.component';
import { RouterModule } from '@angular/router';
import { TabsModule } from "ng2-tabs";
import { DatePipe } from '@angular/common';
import { ChartsModule } from 'ng2-charts';
import { NvD3Module } from 'ng2-nvd3';
import { BootstrapPanelComponent } from './bootstrap-panel/bootstrap-panel.component';
import { DirectiveComponent } from './directive/directive.component';

@NgModule({
  declarations: [
    AppComponent,
    CountryComponent,
    CityComponent,
    BootstrapPanelComponent,
    DirectiveComponent
  ],
  imports: [
    BrowserModule, HttpModule, JsonpModule, FormsModule, TabsModule, ChartsModule, NvD3Module,
    RouterModule.forRoot([
      { path: '', component: CountryComponent },
      { path: 'city/:cityName', component: CityComponent },
    ])
  ],
  providers: [UserService, DatePipe],
  bootstrap: [AppComponent]
})

export class AppModule { }
