import { IBooking } from "./booking.model";

export interface User {
  userId?: string;
  _id?: string;
  name: string;
  email?: string;
  mobile: string;
  status?: boolean;
  password?: string
  imageUrl?: string;
  bookings?: IBooking[];
}