import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Measurement } from './models/measurement.model';

@Injectable({
  providedIn: 'root'
})
export class MeasurementService {
  private apiUrl = 'http://localhost:8080/api/measurement';

  constructor(private http: HttpClient) {}

  createMeasurement(measurement: Measurement): Observable<void> {
    return this.http.post<void>(this.apiUrl, measurement);
  }

  getAllMeasurements(): Observable<Measurement[]> {
    return this.http.get<Measurement[]>(this.apiUrl);
  }

  getMeasurementsBySensorId(sensorId: string): Observable<Measurement[]> {
    const url = `${this.apiUrl}/sensor/${sensorId}`;
    return this.http.get<Measurement[]>(url);
  }

  submitMeasurement(measurement: Measurement): Observable<void> {
    return this.createMeasurement(measurement);
  }
}
