import request from '@/utils/request';

export const requestDemo = () => {
  return request.post('resources/github');
};
