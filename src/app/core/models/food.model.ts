export interface IFood{
    _id: string;
    name: string;
    category: 'Vegetarian' | 'Non-vegetarian';
    pricePerPlate: number;
    section: 'Welcome Drink' | 'Main Food' | 'Dessert' | 'Other';
    status: 'Available' | 'Unavailable';
}
