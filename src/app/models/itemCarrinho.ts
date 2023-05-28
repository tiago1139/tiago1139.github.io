import { Item } from "./item";

export interface ItemCarrinho {
  item: Item;
  quantidade: number;
  data: string;
}