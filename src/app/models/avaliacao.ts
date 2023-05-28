import { Item } from "./item";
import { User } from "./user";

export interface Avaliacao {
    _id: string;
    user: User;
    item: Item;
    estrelas: number;
    comentario: string;
}