import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { AdminSideBarComponent } from '../../../shared/widgets/admin-side-bar/admin-side-bar.component';
import { AdminNavService } from '../../../core/services/adminNav/admin-nav.service';
import { AdminNavComponent } from '../../../shared/reusable/admin-nav/admin-nav.component';
import { Chart, ChartConfiguration } from 'chart.js/auto';
import { Subscription } from 'rxjs';
import { DashboardService } from '../../../core/services/admin/dashboard.service';
import { IDashboard, MonthlyBooking } from '../../../core/models/dashBoard.model';
import { IBooking } from '../../../core/models/booking.model';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    AdminSideBarComponent,
    AdminNavComponent
  ],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css'
})
export class AdminDashboardComponent implements OnInit, OnDestroy {
  isSidebarOpen = false;
  metrics: IDashboard = {
    totalBookings: 0,
    receivableAmount: 0,
    totalUsers: 0,
    totalEvents: 0
  };
  metricsList: { title: string; value: number }[] = [];
  bookingData: MonthlyBooking[] = [];
  private chart?: Chart;
  private subscriptions: Subscription[] = [];
  bookings: IBooking[] = [];
  startDate: string = '';
  endDate: string = '';
  tableHeaders = ['Booking Date', 'Name', 'Event Type', 'Total Amount', 'Balance Amount'];

  constructor(
    private navService: AdminNavService,
    private dashBoard: DashboardService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.subscriptions.push(
      this.navService.sidebarOpen$.subscribe(isOpen => {
        this.isSidebarOpen = isOpen;
        this.cdr.detectChanges();
      })
    );
    this.getDashboardData();
    this.loadMonthlyBookingData();
    this.loadReports();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
    this.chart?.destroy();
  }

  getDashboardData() {
    this.subscriptions.push(
      this.dashBoard.getDashBoard().subscribe({
        next: (data) => {
          this.metrics = data;
          this.updateMetricsList();
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Error fetching dashboard data:', err);
        }
      })
    );
  }

  private updateMetricsList() {
    this.metricsList = [
      { title: 'Total Bookings', value: this.metrics.totalBookings },
      { title: 'Receivable Amount', value: this.metrics.receivableAmount },
      { title: 'Total Users', value: this.metrics.totalUsers },
      { title: 'Total Events', value: this.metrics.totalEvents }
    ];
  }

  private loadMonthlyBookingData(): void {
    this.subscriptions.push(
      this.dashBoard.getMonthlyBookings().subscribe({
        next: (data) => {
          if (Array.isArray(data)) {
            this.bookingData = data;
            this.initChart();
            this.cdr.detectChanges();
          } else {
            console.warn('Invalid response format:', data);
            this.bookingData = [];
          }
        },
        error: (err) => {
          console.error('Error fetching monthly bookings:', err);
          this.bookingData = [];
        }
      })
    );
  }

  private initChart(): void {
    const ctx = document.getElementById('bookingsChart') as HTMLCanvasElement;

    if (!ctx) {
      console.error('Chart canvas not found');
      return;
    }

    if (this.chart) {
      this.chart.destroy();
    }

    if (this.bookingData && this.bookingData.length > 0) {
      const chartConfig: ChartConfiguration = {
        type: 'bar',
        data: {
          labels: this.bookingData.map(data => data.month),
          datasets: [{
            label: 'Bookings',
            data: this.bookingData.map(data => data.bookings),
            backgroundColor: 'rgba(79, 70, 229, 0.6)',
            borderColor: 'rgba(79, 70, 229, 1)',
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true
            }
          },
          plugins: {
            legend: {
              display: false
            }
          }
        }
      };

      this.chart = new Chart(ctx, chartConfig);
    } else {
      console.warn('No booking data available to display in the chart');
    }
  }

  loadReports(): void {
    this.subscriptions.push(
      this.dashBoard.getBookings(this.startDate, this.endDate).subscribe({
        next: (data) => {
          this.bookings = data.bookings;
          this.cdr.detectChanges();
        },
        error: (error) => {
          console.error('Error loading reports:', error);
        }
      })
    );
  }

  applyFilters(): void {
    this.loadReports();
  }

  exportReports(): void {
    this.dashBoard.exportBookings(this.startDate, this.endDate).subscribe({
      next: (blob: Blob | MediaSource) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'booking_reports.xlsx';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
      },
      error: (error: any) => console.error('Error exporting reports:', error)
    });
  }
}