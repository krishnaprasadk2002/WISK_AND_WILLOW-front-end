export interface Ipackages{
    _id:string
    name:string
    type_of_event:string
    startingAt:string
    status?:string
    packeageItems : {
        itemName: String;
        price: Number;
        Status: Boolean;
     }[] | null;

}