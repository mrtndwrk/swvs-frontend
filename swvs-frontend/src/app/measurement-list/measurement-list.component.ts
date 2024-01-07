import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { Measurement } from '../models/measurement.model';
import { MeasurementService } from '../measurement.service';

@Component({
  selector: 'app-measurement-list',
  templateUrl: './measurement-list.component.html',
  styleUrls: ['./measurement-list.component.scss']
})
export class MeasurementListComponent implements OnInit, OnChanges {
  @Input() sensorId!: string;
  measurements: Measurement[] = [];
  displayedColumns: string[] = ['timestamp', 'temperature', 'humidity'];

  
  chartData: any[] = [];

  chartOptions: any = {
    responsive: true,
  };

  chartLabels: string[] = [];


  constructor(private measurementService: MeasurementService) {}

  ngOnInit(): void {
    this.loadMeasurements();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['sensorId']) {
      this.loadMeasurements();
    }
  }

  private loadMeasurements(): void {
    console.log('ngOnInit triggered in MeasurementListComponent');
    console.log('Received sensorId in MeasurementListComponent:', this.sensorId);


    this.measurementService.getAllMeasurements().subscribe(
      (measurements) => {
        console.log('Measurements received:', measurements);
  
        // Filter measurements based on the current sensorId
        this.measurements = measurements.filter((measurement) => measurement.sensorId.toString() === this.sensorId);
        console.log('Raw JSON data:', this.measurements);
        
        //Sort measurements by timestamp
        this.measurements.sort((a, b) => (a.timestamp > b.timestamp ? 1 : -1));

        // Update chart data
        this.chartData = [
          { data: this.measurements.map(m => m.temperature || 0), label: 'Temperature °C' },
          { data: this.measurements.map(m => m.humidity || 0), label: 'Humidity %' }
        ];

        // Update chart labels
        this.chartLabels = this.measurements.map(m => this.formatTimestamp(m.timestamp));
  
        // Update chart type and options
        this.chartOptions = { responsive: true };
  
      },
      (error) => {
        console.error('Error fetching measurements:', error);
      }
    );
  }
  
  private formatTimestamp(timestamp: string): string {
    return new Date(timestamp).toLocaleString();
  }
  
  
  
}
