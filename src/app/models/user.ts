import { List } from "./list";
import {ItemCarrinho} from "./itemCarrinho";

export interface User {
  _id: string;
  username: string;
  password: string;
  profilePicture: string;
  alternativePics: string[];
  lists: List[];
  followers: User[];
  following: User[];
  wishlist: List;
  profileInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  library: [
    item: ItemCarrinho
  ];

  }
