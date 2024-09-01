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
  nowPayableAmount: number;
  paymentId?: string; 
  created_at?: Date;
}


export interface IRazorpayOrder {
  amount: number;         
  amount_due: number;     
  amount_paid: number;    
  attempts: number;       
  created_at: number;     
  currency: string;       
  entity: string;         
  id: string;             
  notes: string[];        
  offer_id: string | null; 
  receipt: string;        
  status: string;        
}