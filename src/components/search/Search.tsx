import { Input, Pagination, Flex } from 'antd';
import React from 'react';
import debounce from 'lodash/debounce';

import { CardType } from '../../types';
import CardList from '../cardList/CardList';
import Api from '../../api';
import correctResult from '../../utils';
import Loading from '../loading/Loading';
import Error from '../error/Error';

interface SearchType {
  data: CardType[] | never[];
  totalPages: number;
  error: boolean;
  loading: boolean;
  currentPage: number;
  searchValue: string;
  errorMessage: string;
}
interface ISearchProps {
  api: Api;
  active: string;
}

class Search extends React.Component<ISearchProps, SearchType> {
  debounsed = debounce(this.getSearchMovies, 500);

  constructor(props: ISearchProps) {
    super(props);
    this.state = {
      data: [],
      totalPages: 0,
      error: false,
      loading: false,
      currentPage: 1,
      searchValue: '',
      errorMessage: '',
    };
  }

  componentDidMount() {
    this.getPopularMovies();
  }

  componentDidUpdate(prevProps: Readonly<ISearchProps>) {
    const { active } = this.props;
    const { currentPage, searchValue } = this.state;
    if (prevProps !== this.props && +active === 1) {
      this.setState({
        error: false,
        loading: false,
        errorMessage: '',
      });
      if (!searchValue) this.getPopularMovies(currentPage);
    }
  }

  componentDidCatch() {
    this.setState({
      error: true,
      loading: false,
      errorMessage: 'Something went wrong',
    });
  }

  async getPopularMovies(number = 1) {
    const { api } = this.props;
    this.setState({ loading: true });
    window.scrollTo(0, 0);
    try {
      const response = await api.getPopularMovies(number);
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

  async getSearchMovies(page: number, searchValue: string) {
    const { api } = this.props;

    this.setState({ loading: true });
    window.scrollTo(0, 0);
    try {
      const response = await api.getSearchMovies(searchValue, page);
      if (response.ok) {
        const res = await response.json();
        if (res.results.length === 0) {
          this.setState({
            error: true,
            loading: false,
            errorMessage: 'Not found',
            totalPages: 0,
          });
          return;
        }
        this.setState({
          data: correctResult(res.results),
          totalPages: res.total_pages,
          error: false,
          loading: false,
          currentPage: res.page,
        });
        return;
      }
      this.setState({
        error: true,
        loading: false,
        errorMessage: 'Something went wrong',
        totalPages: 0,
      });
    } catch {
      this.setState({
        error: true,
        loading: false,
        errorMessage: 'Problems connecting to the internet',
      });
    }
  }

  handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { currentPage } = this.state;

    this.setState((prevState) => ({ ...prevState, searchValue: e.target.value }));
    this.debounsed(currentPage, e.target.value);
  };

  render() {
    const { data, loading, error, errorMessage, totalPages, currentPage, searchValue } = this.state;
    const { api } = this.props;

    if (loading) return <Loading />;

    return (
      <>
        <Input
          placeholder="Basic usage"
          value={searchValue}
          onChange={this.handleInputChange}
          style={{
            marginBottom: 34,
          }}
        />
        {!error ? <CardList data={data} api={api} /> : <Error message={errorMessage} />}
        <Flex justify="center" style={{ padding: '20px' }}>
          <Pagination
            total={totalPages}
            hideOnSinglePage
            showSizeChanger={false}
            pageSize={20}
            current={currentPage}
            onChange={(p: number) =>
              searchValue === '' ? this.getPopularMovies(p) : this.getSearchMovies(p, searchValue)
            }
            style={{ alignSelf: 'center' }}
          />
        </Flex>
      </>
    );
  }
}

export default Search;
