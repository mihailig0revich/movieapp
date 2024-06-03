import { Flex, Typography, Card, Row, Col, Tag, Rate } from 'antd';
import React, { CSSProperties } from 'react';

import { CardType, IGenreItem } from '../../types';
import Api from '../../api';
import cardList from '../../data';

const { Paragraph } = Typography;

interface cardItemType {
  card: CardType;
  api: Api;
  genreCatalog: IGenreItem[] | null;
}

const CardItem: React.FC<cardItemType> = function (props) {
  const { card, api, genreCatalog } = props;
  const isMobile = window.innerWidth < 570;

  async function rateHandler(rate: number) {
    try {
      const response = await api.addRating(card.id, rate);
      if (response.ok) {
        cardList.push({ id: card.id, rate });
        return;
      }
      cardList.push({ id: card.id, rate: 0 });
    } catch {
      cardList.push({ id: card.id, rate: 0 });
    }
  }

  let rateColors = '#00fff6';
  if (+card.rate > 0) rateColors = '#E90000';
  if (+card.rate > 3) rateColors = '#E97E00';
  if (+card.rate > 5) rateColors = '#E9D100';
  if (+card.rate > 7) rateColors = '#66E900';

  const cardRate = cardList.find((item) => item.id === card.id);
  let genres: (React.JSX.Element | undefined)[] | false = false;
  if (genreCatalog) {
    genres = card.genreIDs.map((item) => {
      const tagGenre = genreCatalog.find((i) => item === i.id);
      if (tagGenre) {
        return <Tag key={tagGenre.id}>{tagGenre.name}</Tag>;
      }
      return undefined;
    });
  }

  return (
    <Card
      styles={{
        body: {
          padding: 0,
          overflow: 'hidden',
        },
      }}
      style={{
        borderRadius: '0px',
        padding: isMobile ? '5px 10px 10px 10px' : '0',
      }}
    >
      <Row wrap={false} gutter={20} style={{ height: '100%' }}>
        <Col sm={{ flex: '202px' }} xs={{ flex: '77px' }}>
          <img
            alt={card.filmName}
            src={card.img}
            style={{
              display: 'block',
              width: '100%',
              height: '100%',
            }}
          />
        </Col>
        <Col flex="auto" style={{ paddingBottom: '10px' }}>
          <Flex vertical justify="space-between" style={{ height: '100%' }}>
            <div>
              <Row align="middle" wrap={false} style={{ padding: isMobile ? '0' : '10px 9px 0 0' }}>
                <Col flex="auto">
                  <Typography.Title style={{ margin: 0, width: '100%', display: 'inline-block' }} level={5}>
                    {card.filmName}
                  </Typography.Title>
                </Col>
                <Col flex="32px">
                  <Flex
                    justify="center"
                    align="center"
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: '50% 50%',
                      border: `2px solid ${rateColors}`,
                    }}
                  >
                    {card.rate}
                  </Flex>
                </Col>
              </Row>
              <Paragraph style={{ fontSize: '12px', lineHeight: '22px' }}>{card.releaseDate}</Paragraph>
              <Flex wrap={false} style={{ fontSize: '12px', lineHeight: '22px' }}>
                {genres || 'no genres'}
              </Flex>
              {!isMobile && (
                <Paragraph
                  ellipsis={{
                    rows: 5,
                    symbol: 'more',
                  }}
                  style={{ marginTop: 7, marginBottom: 7, marginRight: '10px', fontSize: '12px', lineHeight: '22px' }}
                >
                  {card.description}
                </Paragraph>
              )}
            </div>
            {!isMobile && (
              <Rate
                style={{ fontSize: 15, verticalAlign: 'bottom' }}
                count={10}
                allowHalf
                onChange={(e) => rateHandler(e)}
                defaultValue={cardRate ? cardRate.rate : 0}
              />
            )}
          </Flex>
        </Col>
      </Row>
      {isMobile && (
        <>
          <Paragraph
            ellipsis={{
              rows: 4,
              symbol: 'more',
            }}
            style={{ marginTop: 7, marginBottom: 7, fontSize: '12px', lineHeight: '22px' }}
          >
            {card.description}
          </Paragraph>
          <Rate style={{ fontSize: 15 }} count={10} allowHalf defaultValue={cardRate ? cardRate.rate : 0} />
        </>
      )}
    </Card>
  );
};

export default CardItem;
