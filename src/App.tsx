import React from 'react';
import { ConfigProvider, Flex, Tabs } from 'antd';

import './App.css';
import Search from './components/search/Search';
import Rated from './components/rated/Rated';
import Api from './api';
import Loading from './components/loading/Loading';
import GenreContext from './GenreContext';
import { IGenreItem } from './types';
import Error from './components/error/Error';

interface IAppState {
  loading: boolean;
  active: string;
  genres: IGenreItem[] | null;
  error: boolean;
  errorMessage: string;
}

class App extends React.Component<object, IAppState> {
  api = new Api();

  constructor(props: any) {
    super(props);
    this.state = {
      loading: false,
      active: '1',
      genres: null,
      error: false,
      errorMessage: '',
    };
  }

  async componentDidMount() {
    this.setState({ loading: true });
    try {
      const createSession = await this.api.createGuestSession();
      if (!createSession) {
        this.setState({
          error: true,
          loading: false,
          errorMessage: 'Something went wrong',
        });
      }
    } catch {
      this.setState({
        error: true,
        loading: false,
        errorMessage: 'Something went wrong',
      });
    }
    try {
      const response = await this.api.getGenres();
      if (response.ok) {
        const genres = await response.json();
        this.setState({
          loading: false,
          genres: genres.genres,
        });
      }
    } catch {
      this.setState({
        error: true,
        loading: false,
        errorMessage: 'Something went wrong',
      });
    }
  }

  activeHandler(e: string) {
    this.setState((prevProps) => ({ ...prevProps, active: e }));
  }

  render() {
    const { loading, active, genres, error, errorMessage } = this.state;
    const tabs = [
      {
        key: '1',
        label: 'Search',
        children: <Search active={active} api={this.api} />,
      },
      {
        key: '2',
        label: 'Rated',
        children: <Rated active={active} api={this.api} />,
      },
    ];
    if (loading) return <Loading />;
    if (error) return <Error message={errorMessage} />;
    return (
      <ConfigProvider
        theme={{
          components: {
            Pagination: {
              itemActiveBg: '#1890FF',
              colorPrimary: '#fff',
            },
          },
        }}
      >
        <GenreContext.Provider value={genres}>
          <Flex
            style={{
              backgroundColor: '#F7F7F7',
              justifyContent: 'center',
              width: '100%',
            }}
          >
            <div
              style={{
                maxWidth: 1010,
                width: '100%',
                backgroundColor: '#FFFFFF',
                minHeight: '100vh',
                paddingLeft: 36,
                paddingRight: 36,
                paddingTop: 13,
              }}
            >
              <Tabs
                centered
                defaultActiveKey="1"
                tabBarStyle={{ backgroundColor: 'none', border: 'none', width: '150px', alignSelf: 'center' }}
                items={tabs}
                size="large"
                onChange={(e: string) => this.activeHandler(e)}
              ></Tabs>
            </div>
          </Flex>
        </GenreContext.Provider>
      </ConfigProvider>
    );
  }
}

export default App;
