export interface IFood{
    quantity: any;
    _id: string;
    name: string;
    category: 'Vegetarian' | 'Non-vegetarian';
    pricePerPlate: number;
    section: 'Welcome Drink' | 'Main Food' | 'Dessert';
    status: 'Available' | 'Unavailable';
}
