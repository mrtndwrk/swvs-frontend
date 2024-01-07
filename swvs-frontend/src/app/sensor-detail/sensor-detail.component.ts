import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SensorService } from '../sensor.service';
import { Sensor } from '../models/sensor.model';

@Component({
  selector: 'app-sensor-detail',
  templateUrl: './sensor-detail.component.html',
  styleUrls: ['./sensor-detail.component.scss'],
})
export class SensorDetailComponent implements OnInit {
  sensor: Sensor | null = null;
  editing = false;
  updateForm: FormGroup;

  sensorTypeOptions = ['INDOOR', 'OUTDOOR', 'WATER'];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private sensorService: SensorService,
    private fb: FormBuilder
  ) {
    this.updateForm = this.fb.group({
      name: ['', Validators.required],
      location: ['', Validators.required],
      active: [false], 
      sensorType: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.route.params.subscribe((params) => {
      const sensorId = params['id'].toString();
      console.log('Received sensorId:', sensorId);
  
      this.sensorService.getSensorById(sensorId).subscribe((sensor) => {
        console.log('Retrieved Sensor:', sensor);
        this.sensor = sensor;
  
        if (this.sensor) {
          this.updateForm.patchValue({
            ...this.sensor,
            active: this.sensor.active, 
          });
        }
      });
    });
  }
 

  startEditing() {
    this.editing = true;
  }

  saveChanges() {
    if (this.sensor) {
      const updatedSensor = { ...this.sensor, ...this.updateForm.value };
      updatedSensor.active = this.updateForm.get('active')?.value.toString(); 
      this.sensorService.updateSensor(updatedSensor).subscribe(() => {
        this.updateInMemoryDatabase(updatedSensor);
        this.editing = false;
        this.sensor = updatedSensor;
      });
    }
  }
  
  

  deleteSensor() {
    if (this.sensor) {
      const sensorId = this.sensor.id;
      if (sensorId !== null && sensorId !== undefined) {
        this.sensorService.deleteSensor(sensorId).subscribe(() => {
          this.removeFromInMemoryDatabase(sensorId);
          this.router.navigate(['/'], { replaceUrl: false });
        });
      }
    }
  }

  private inMemoryDatabase: Sensor[] = [];

  private updateInMemoryDatabase(updatedSensor: Sensor): void {
    const index = this.inMemoryDatabase.findIndex((s) => s.id === updatedSensor.id);
    if (index !== -1) {
      this.inMemoryDatabase[index] = updatedSensor;
    }
  }

  private removeFromInMemoryDatabase(sensorId: number): void {
    this.inMemoryDatabase = this.inMemoryDatabase.filter((s) => s.id !== sensorId);
  }
}
