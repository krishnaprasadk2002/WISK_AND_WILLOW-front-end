import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { AdminSideBarComponent } from '../../../shared/widgets/admin-side-bar/admin-side-bar.component';
import { AdminNavService } from '../../../core/services/adminNav/admin-nav.service';
import { AdminNavComponent } from '../../../shared/reusable/admin-nav/admin-nav.component';
import { Chart, ChartConfiguration } from 'chart.js/auto';
import { Subscription } from 'rxjs';
import { DashboardService } from '../../../core/services/admin/dashboard.service';
import {
  DailyBooking,
  IDashboard,
  MonthlyBooking,
  YearlyBooking,
} from '../../../core/models/dashBoard.model';
import { IBooking } from '../../../core/models/booking.model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    AdminSideBarComponent,
    AdminNavComponent,
  ],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css',
})
export class AdminDashboardComponent implements OnInit,AfterViewInit, OnDestroy {
  isSidebarOpen = false;
  metrics: IDashboard = {
    totalBookings: 0,
    receivableAmount: 0,
    totalUsers: 0,
    totalEvents: 0,
  };
  metricsList: { title: string; value: number }[] = [];
  bookingData: DailyBooking[] | MonthlyBooking[] | YearlyBooking[] = [];
  private chart?: Chart;
  private subscriptions: Subscription[] = [];
  bookings: IBooking[] = [];
  startDate: string = '';
  endDate: string = '';
  tableHeaders = [
    'Booking Date',
    'Name',
    'Event Type',
    'Total Amount',
    'Balance Amount',
  ];
  chartType: 'daily' | 'monthly' | 'yearly' = 'monthly';

  constructor(
    private navService: AdminNavService,
    private dashBoard: DashboardService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.subscriptions.push(
      this.navService.sidebarOpen$.subscribe((isOpen) => {
        this.isSidebarOpen = isOpen;
        this.cdr.detectChanges();
      })
    );
    this.getDashboardData();
    this.loadMonthlyBookingData();
    this.loadReports();
  }

  ngAfterViewInit(): void {
    this.initChart();
  }
  
  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
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
        },
      })
    );
  }

  private updateMetricsList() {
    this.metricsList = [
      { title: 'Total Bookings', value: this.metrics.totalBookings },
      { title: 'Receivable Amount', value: this.metrics.receivableAmount },
      { title: 'Total Users', value: this.metrics.totalUsers },
      { title: 'Total Events', value: this.metrics.totalEvents },
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
        },
      })
    );
  }

  loadChartData(): void {
    if (this.chartType === 'daily') {
      this.loadDailyBookingData();
    } else if (this.chartType === 'yearly') {
      this.loadYearlyBookingData();
    } else {
      this.loadMonthlyBookingData();
    }
  }

  private loadDailyBookingData(): void {
    this.subscriptions.push(
      this.dashBoard.getDailyBookings().subscribe({
        next: (data) => {
          if (Array.isArray(data)) {
            console.log(data,"ioiiii");
            
            this.bookingData = data;
            this.initChart();
            this.cdr.detectChanges();
          } else {
            console.warn('Invalid daily bookings data format:', data);
            this.bookingData = [];
          }
        },
        error: (err) => {
          console.error('Error fetching daily bookings:', err);
          this.bookingData = [];
        },
      })
    );
  }

  private loadYearlyBookingData(): void {
    this.subscriptions.push(
      this.dashBoard.getYearlyBookings().subscribe({
        next: (data) => {
          if (Array.isArray(data)) {
            this.bookingData = data;
            this.initChart();
            this.cdr.detectChanges();
          } else {
            console.warn('Invalid yearly bookings data format:', data);
            this.bookingData = [];
          }
        },
        error: (err) => {
          console.error('Error fetching yearly bookings:', err);
          this.bookingData = [];
        },
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

    let labels: string[] = [];
    let data: number[] = [];

    if (this.chartType === 'daily') {
      labels = (this.bookingData as DailyBooking[]).map(
        (booking) => booking.date
      );
      data = (this.bookingData as DailyBooking[]).map(
        (booking) => booking.totalAmount
      );
    } else if (this.chartType === 'monthly') {
      labels = (this.bookingData as MonthlyBooking[]).map(
        (booking) => booking.month
      );
      data = (this.bookingData as MonthlyBooking[]).map(
        (booking) => booking.bookings
      );
    } else if (this.chartType === 'yearly') {
      labels = (this.bookingData as YearlyBooking[]).map((booking) =>
        booking.year.toString()
      );
      data = (this.bookingData as YearlyBooking[]).map(
        (booking) => booking.bookings
      );
    }

    if (data.length > 0) {
      const chartConfig: ChartConfiguration = {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [
            {
              label: 'Bookings',
              data: data,
              backgroundColor: 'rgba(79, 70, 229, 0.6)',
              borderColor: 'rgba(79, 70, 229, 1)',
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true,
            },
          },
          plugins: {
            legend: {
              display: false,
            },
          },
        },
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
        },
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
      error: (error: any) => console.error('Error exporting reports:', error),
    });
  }
}