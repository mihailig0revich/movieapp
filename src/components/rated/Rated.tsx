import React from 'react';

import { CardType } from '../../types';
import CardList from '../cardList/CardList';
import Api from '../../api';
import correctResult from '../../utils';
import Loading from '../loading/Loading';
import Error from '../error/Error';

interface IRatedType {
  data: CardType[];
  totalPages: number;
  error: boolean;
  loading: boolean;
  currentPage: number;
  errorMessage: string;
}
interface IRatedProps {
  api: Api;
  active: string;
}

class Rated extends React.Component<IRatedProps, IRatedType> {
  constructor(props: IRatedProps) {
    super(props);
    this.state = {
      data: [],
      totalPages: 0,
      error: false,
      loading: false,
      currentPage: 1,
      errorMessage: '',
    };
  }

  componentDidMount() {
    this.getRatedMovies();
  }

  componentDidUpdate(prevProps: Readonly<IRatedProps>) {
    const { active } = this.props;
    if (prevProps !== this.props && +active === 2) {
      this.setState({
        error: false,
        loading: false,
        currentPage: 1,
        errorMessage: '',
      });
      this.getRatedMovies();
    }
  }

  componentDidCatch() {
    this.setState({
      error: true,
      loading: false,
      errorMessage: 'Something went wrong',
    });
  }

  async getRatedMovies() {
    const { api } = this.props;
    this.setState((prevState) => ({ ...prevState, loading: true }));
    window.scrollTo(0, 0);
    try {
      const response = await api.getRatedMovies();
      if (response.ok) {
        const res = await response.json();
        this.setState({
          data: correctResult(res.results),
          totalPages: res.total_pages,
          error: false,
          loading: false,
          currentPage: res.page,
        });
        return;
      }
      if (response.status === 404) {
        this.setState({
          error: true,
          loading: false,
          errorMessage: 'You have not rated any movies yet',
        });
        return;
      }
      this.setState({
        error: true,
        loading: false,
        errorMessage: 'Something went wrong',
      });
    } catch {
      this.setState({
        error: true,
        loading: false,
        errorMessage: 'Problems connecting to the internet',
      });
    }
  }

  render() {
    const { data, error, errorMessage, loading } = this.state;
    const { api } = this.props;
    if (error) return <Error message={errorMessage} />;
    if (loading) return <Loading />;

    return <CardList api={api} data={data} />;
  }
}

export default Rated;
