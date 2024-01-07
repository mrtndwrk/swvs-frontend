import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http'; 
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { SensorDetailComponent } from './sensor-detail/sensor-detail.component';
import { SensorListComponent } from './sensor-list/sensor-list.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MeasurementListComponent } from './measurement-list/measurement-list.component';
import { MatTableModule } from '@angular/material/table';
import { NgChartsModule } from 'ng2-charts'; 

const routes = [
  { path: 'sensors', component: SensorListComponent },
  { path: 'sensor/:id', component: SensorDetailComponent },
];

@NgModule({
  declarations: [
    AppComponent,
    SensorListComponent,
    SensorDetailComponent,
    MeasurementListComponent
  ],
  imports: [
    NgChartsModule,
    BrowserModule,
    HttpClientModule, 
    RouterModule.forRoot(routes),
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatTableModule,
    
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
