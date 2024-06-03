import { Alert } from 'antd';
import React from 'react';

interface IErrorProps {
  message: string;
}

function Error({ message }: IErrorProps) {
  return <Alert message={message} style={{ textAlign: 'center' }} type="error" />;
}

export default Error;
