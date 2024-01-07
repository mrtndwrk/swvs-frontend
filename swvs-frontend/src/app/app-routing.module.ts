import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SensorListComponent } from './sensor-list/sensor-list.component';
import { SensorDetailComponent } from './sensor-detail/sensor-detail.component';
import { MeasurementEntryComponent } from './measurement-entry/measurement-entry.component';


const routes: Routes = [
  { path: 'sensors', component: SensorListComponent },
  { path: 'sensor/:id', component: SensorDetailComponent },
  { path: 'measurement-entry', component: MeasurementEntryComponent }, 
  { path: '', redirectTo: '/sensors', pathMatch: 'full' }, 

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
