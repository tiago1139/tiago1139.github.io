import { Item } from "./item";

export interface List{
    _id:string,
    title: string,
    privacy: string,
    items: Item[],
}
