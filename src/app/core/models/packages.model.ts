export interface Ipackages{
    showFullDetails: any;
    _id:string
    name:string
    type_of_event:string
    startingAt:string
    image?:string;
    status?:string
    packageItems : {
        _id: string;
        itemName: String;
        price: Number;
        status: Boolean;
     }[] | null;

}