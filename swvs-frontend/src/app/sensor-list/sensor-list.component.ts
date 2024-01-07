import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SensorService } from '../sensor.service';
import { Sensor } from '../models/sensor.model';
import { HttpErrorResponse } from '@angular/common/http';
import { MeasurementService } from '../measurement.service';

@Component({
  selector: 'app-sensor-list',
  templateUrl: './sensor-list.component.html',
  styleUrls: ['./sensor-list.component.scss']
})
export class SensorListComponent implements OnInit {
  sensors: Sensor[] = [];
  sensorForm: FormGroup;
  showForm = false;
  showMeasurementForm = false;
  measurementForm: FormGroup;

  sensorTypeOptions = ['INDOOR', 'OUTDOOR', 'WATER'];

  constructor(
    private sensorService: SensorService,
    private fb: FormBuilder,
    private measurementService: MeasurementService
  ) {
    this.sensorForm = this.fb.group({
      name: ['', Validators.required],
      isActive: [false],
      location: ['', Validators.required],
      sensorType: ['', Validators.required],
    });

    this.measurementForm = this.fb.group({
      sensorID: ['', Validators.required],
      temperature: ['', Validators.required],
      humidity: ['', [Validators.required, Validators.min(0), Validators.max(100)]],
      timestamp: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.fetchSensors();

    this.sensorService.sensorListChanged().subscribe((updatedSensors) => {
      this.sensors = updatedSensors;
    });
  }

  fetchSensors() {
    this.sensorService.getAllSensors().subscribe((data: Sensor[]) => {
      this.sensors = data;
    });
  }

  createSensor() {
    if (this.sensorForm.valid) {
      this.sensorService.createSensor(this.sensorForm.value).subscribe(
        (response) => console.log('Sensor created successfully:', response),
        (error) => this.handleSensorCreationError(error)
      );

      this.sensorForm.reset();
    }
  }

  private handleSensorCreationError(error: any) {
    if (error instanceof HttpErrorResponse) {
      console.error('HttpErrorResponse:', error);
      console.error('Server error status:', error.status);
      console.error('Server error body:', error.error);
    } else {
      console.error('Unexpected error:', error);
    }
  }

  toggleForm() {
    this.showForm = !this.showForm;
  }

  toggleMeasurementForm() {
    this.showMeasurementForm = !this.showMeasurementForm;
  }

  submitMeasurement() {
    if (this.measurementForm.valid) {
      const newMeasurement = this.measurementForm.value;
      this.measurementService.submitMeasurement(newMeasurement).subscribe(
        () => this.measurementForm.reset(),
        (error) => this.handleMeasurementSubmissionError(error)
      );
    }
  }

  private handleMeasurementSubmissionError(error: any) {
    console.error('Error creating measurement:', error);
    if (error instanceof HttpErrorResponse) {
      console.error('Complete error response:', error);
      console.error('Response body:', error.error);
    }
  }
}
