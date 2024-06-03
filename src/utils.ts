// eslint-disable-next-line import/no-extraneous-dependencies
import { format } from 'date-fns';

import { CardType } from './types';

export default function correctResult(arr: any): CardType[] {
  return arr.map((item: any): CardType => {
    return {
      id: item.id,
      filmName: item.original_title,
      description: item.overview,
      img: `https://image.tmdb.org/t/p/original/${item.poster_path}`,
      rate: item.vote_average.toFixed(1),
      genreIDs: item.genre_ids,
      releaseDate: format(item.release_date, 'PP'),
    };
  });
}
