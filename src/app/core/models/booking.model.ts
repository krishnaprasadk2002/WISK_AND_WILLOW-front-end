export interface CartItem {
    food: {
      _id: string;
      name: string;
      category: string;
      pricePerPlate: number;
    };
    quantity: number;
  }
  
  export interface Booking {
    packageDetails: string; 
    name: string;
    email: string;
    mobile: string;
    packageName:string;
    type_of_event: string;
    requested_date: Date;
    payment_option: 'Advance' | 'Full';
    cart: CartItem[];
    total_amount: number;
    created_at?: Date;
  }
  