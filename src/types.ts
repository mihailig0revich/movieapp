export interface CardType {
  img: string;
  filmName: string;
  rate: string;
  description: string;
  id: number;
  genreIDs: number[];
  releaseDate: string;
}

export interface dataType {
  cardList: CardType[];
}

export interface IGenreItem {
  id: number;
  name: string;
}
