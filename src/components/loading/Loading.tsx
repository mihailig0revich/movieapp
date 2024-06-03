import { Flex, Spin } from 'antd';
import React from 'react';

function Loading() {
  const contentStyle = {
    padding: 50,
    borderRadius: 4,
  };

  return (
    <Flex vertical justify="center" style={{ width: '100%' }}>
      <Spin tip="Loading" size="large">
        <div style={contentStyle} />
      </Spin>
    </Flex>
  );
}

export default Loading;
