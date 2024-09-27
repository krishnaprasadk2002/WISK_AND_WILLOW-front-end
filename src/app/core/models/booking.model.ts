import { Employee } from "./employee.model";

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
  _id?: string;
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
  paymentOrderId?: string;
  created_at?: Date;
  status?:string;
  assignedEmployeeId?:string;
  assignedEmployee?: Employee;
}


export interface IRazorpayOrder {
  _id:string
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

