export default class Api {
  private url = 'https://api.themoviedb.org/3/';

  private guestSessionId: string | undefined;

  private api_key2 = '5f8f1b81d5b007689ccec4e4fd684cbd';

  getPopularMovies(page: number): Promise<any | unknown> {
    const popularUrl = `${this.url}movie/popular?page=${page}&api_key=${this.api_key2}`;
    return fetch(popularUrl, {
      method: 'GET',
      headers: {
        accept: 'application/json',
      },
    });
  }

  getSearchMovies(query: string, page: number): Promise<any> {
    const searchUrl = `${this.url}search/movie?query=${query}&page=${page}&api_key=${this.api_key2}`;
    return fetch(searchUrl, {
      method: 'GET',
      headers: {
        accept: 'application/json',
      },
    });
  }

  async createGuestSession() {
    try {
      const createGuestSessionUrl = `${this.url}authentication/guest_session/new?api_key=${this.api_key2}`;
      const response = await fetch(createGuestSessionUrl, {
        method: 'GET',
        headers: {
          accept: 'application/json',
        },
      });
      this.guestSessionId = (await response.json()).guest_session_id;
      return true;
    } catch {
      return false;
    }
  }

  addRating(id: number, rate: number) {
    const addRatingUrl = `${this.url}movie/${id}/rating?guest_session_id=${this.guestSessionId}&api_key=${this.api_key2}`;
    return fetch(addRatingUrl, {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'Content-Type': 'application/json;charset=utf-8',
      },
      body: JSON.stringify({ value: rate }),
    });
  }

  getRatedMovies() {
    const ratedMoviesUrl = `${this.url}guest_session/${this.guestSessionId}/rated/movies?api_key=${this.api_key2}`;
    return fetch(ratedMoviesUrl, {
      method: 'GET',
      headers: {
        accept: 'application/json',
      },
    });
  }

  getGenres() {
    const genresUrl = `${this.url}genre/movie/list?language=en&api_key=${this.api_key2}`;
    return fetch(genresUrl, {
      method: 'GET',
      headers: {
        accept: 'application/json',
      },
    });
  }
}
