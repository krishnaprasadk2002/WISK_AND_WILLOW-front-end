import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { AdminSideBarComponent } from '../../../shared/widgets/admin-side-bar/admin-side-bar.component';
import { AdminNavService } from '../../../core/services/adminNav/admin-nav.service';
import { AdminNavComponent } from '../../../shared/reusable/admin-nav/admin-nav.component';
import { Chart, ChartConfiguration } from 'chart.js/auto';
import { Subscription } from 'rxjs';
import { DashboardService } from '../../../core/services/admin/dashboard.service';
import { IDashboard, MonthlyBooking } from '../../../core/models/dashBoard.model';


@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule,AdminSideBarComponent,AdminNavComponent],
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
  bookingData: MonthlyBooking[] = [];
  private chart?: Chart;
  private subscription?: Subscription;
  private sidebarSubscription?: Subscription;

  constructor(private navService: AdminNavService, private dashBoard: DashboardService) {}

  ngOnInit(): void {
    this.sidebarSubscription = this.navService.sidebarOpen$.subscribe(isOpen => {
      this.isSidebarOpen = isOpen;
    });
    this.getDashboardData();
    this.loadMonthlyBookingData();
  }

  ngOnDestroy(): void {
    this.sidebarSubscription?.unsubscribe();
    this.subscription?.unsubscribe();
    this.chart?.destroy();
  }

  getDashboardData() {
    this.dashBoard.getDashBoard().subscribe({
      next: (data) => {
        this.metrics.totalBookings = data.totalBookings;
        this.metrics.receivableAmount = data.receivableAmount;
        this.metrics.totalEvents = data.totalEvents;
        this.metrics.totalUsers = data.totalUsers;
      },
      error: (err) => {
        console.error('Error fetching dashboard data:', err);
      }
    });
  }

  private loadMonthlyBookingData(): void {
    this.subscription = this.dashBoard.getMonthlyBookings().subscribe({
      next: (data) => {
        if (Array.isArray(data)) {
          this.bookingData = data;
        } else {
          console.warn('Invalid response format:', data);
          this.bookingData = []; 
        }
        this.initChart();
      },
      error: (err) => {
        console.error('Error fetching monthly bookings:', err);
        this.bookingData = []; 
      }
    });
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
  
    // Ensure bookingData is defined and has data
    if (this.bookingData && this.bookingData.length > 0) {
      const chartConfig: ChartConfiguration = {
        type: 'bar',
        data: {
          labels: this.bookingData.map(data => data.month),
          datasets: [{
            label: 'Bookings',
            data: this.bookingData.map(data => data.bookings),
            backgroundColor: 'rgba(59, 130, 246, 0.6)'
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      };
  
      this.chart = new Chart(ctx, chartConfig);
    } else {
      console.warn('No booking data available to display in the chart');
    }
  }
  
  
}
