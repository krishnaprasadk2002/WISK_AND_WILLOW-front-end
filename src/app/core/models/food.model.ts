export interface IFood{
    quantity: number | string;
    _id: string;
    name: string;
    category: 'Vegetarian' | 'Non-vegetarian';
    pricePerPlate: number;
    section: 'Welcome Drink' | 'Main Food' | 'Dessert';
    status: 'Available' | 'Unavailable';
}
