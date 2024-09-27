export interface IDashboard {
    totalBookings: number;
    receivableAmount: number;
    totalUsers: number;
    totalEvents: number;
}

export interface MonthlyBooking {
    label: string;
    month: string;
    bookings: number;
  }

  export interface MonthlyBookingsResponse {
    monthlyBookings: MonthlyBooking[];
  }

  export interface DailyBooking {
    date: string;
    bookings: number;
    totalAmount: number
  }

  export interface YearlyBooking {
    year: number;
    bookings: number;
  }
  
  