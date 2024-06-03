import CardItem from '../card/Card';
import { CardType } from '../../types';
import Api from '../../api';
import GenreContext from '../../GenreContext';

interface cardListType {
  data: CardType[];
  api: Api;
}

const CardList: React.FC<cardListType> = function (props) {
  const { data, api } = props;
  return (
    <GenreContext.Consumer>
      {(genreCatalog) => {
        return (
          <div
            style={{
              display: 'grid',
              gap: '36px',
              gridTemplateColumns: window.innerWidth > 910 ? '1fr 1fr' : '1fr',
            }}
          >
            {data.map((item: CardType) => {
              return <CardItem genreCatalog={genreCatalog} api={api} key={item.id} card={item} />;
            })}
          </div>
        );
      }}
    </GenreContext.Consumer>
  );
};

export default CardList;
