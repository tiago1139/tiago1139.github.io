import { Avaliacao } from "./avaliacao";

export interface Item {
  name: string;
  _id: string;
  tipo: string;
  descricao: string;
  plataforma: string;
  idiomas: string[];
  preco: number;
  rating: number;
  imagem: string;
  img_alternativas: string[];
  link: string;
}