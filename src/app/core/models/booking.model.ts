export interface ICartItem {
  food: {
    _id: string;
    name: string;
    category: string;
    pricePerPlate: number;
  };
  quantity: number;
}

export interface IBooking {
  packageDetails: string;
  name: string;
  email: string;
  mobile: string;
  packageName: string;
  type_of_event: string;
  requested_date: Date;
  payment_option: 'Advance' | 'Full';
  cart: ICartItem[];
  totalAmount: number;
  eventWithoutFoodPrice: number;
  foodPrice: number;
  advancePayment: number;
  balanceAmount: number;
  paymentId?: string; 
  created_at?: Date;
}
