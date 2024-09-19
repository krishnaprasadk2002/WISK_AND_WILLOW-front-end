export interface IDashboard {
    totalBookings: number;
    receivableAmount: number;
    totalUsers: number;
    totalEvents: number;
}

export interface MonthlyBooking {
    label: any;
    month: string;
    bookings: number;
  }

  export interface MonthlyBookingsResponse {
    monthlyBookings: MonthlyBooking[];
  }