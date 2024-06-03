import React from 'react';

import { IGenreItem } from './types';

const GenreContext = React.createContext<IGenreItem[] | null>(null);

export default GenreContext;
