export interface Ipackages{
    showFullDetails: boolean;
    _id:string
    name:string
    type_of_event:string
    startingAt:string
    image?:string;
    status?:string
    averageRating?: number;
    totalRatings?: number;
    ratings?: string
    packageItems : {
        _id: string;
        itemName: String;
        price: Number;
        status: Boolean;
     }[] | null;

}
