import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { Sensor } from './models/sensor.model';

@Injectable({
  providedIn: 'root'
})
export class SensorService {
  private apiUrl = 'http://localhost:8080/api/sensor';

  private sensorListSubject = new Subject<Sensor[]>();
  private sensorCreatedSubject = new Subject<void>();

  constructor(private http: HttpClient) {}

  getAllSensors(): Observable<Sensor[]> {
    return this.http.get<Sensor[]>(this.apiUrl);
  }

  createSensor(sensorData: { id: number; name: string; location: string; isActive: boolean; sensorType: string }): Observable<Sensor> {
    return this.http.post<Sensor>(this.apiUrl, sensorData).pipe(
      tap(() => this.broadcastSensorList())
    );
  }


  updateSensor(sensor: Sensor): Observable<Sensor> {
    const url = `${this.apiUrl}/${sensor.id}`;
    return this.http.put<Sensor>(url, sensor).pipe(
      tap(() => this.broadcastSensorList())
    );
  }

  deleteSensor(id: number): Observable<void> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete<void>(url).pipe(
      tap(() => {

        this.broadcastSensorList();
      })
    );
  }

  getSensorById(id: number | string): Observable<Sensor | null> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<Sensor>(url);
  }

  sensorListChanged(): Observable<Sensor[]> {
    return this.sensorListSubject.asObservable();
  }

  sensorCreated(): Observable<void> {
    return this.sensorCreatedSubject.asObservable();
  }



  private broadcastSensorList() {
    this.getAllSensors().subscribe((sensors) => {
      this.sensorListSubject.next([...sensors]);
    });
  }
}
