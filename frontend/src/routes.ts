const apiPath = '/api';

interface ApiUrl {
  [key: string]: string;
}

export default {
  homePage: '/',
  logsPage: '/logs',
  usersPage: '/all',
  addUser: [apiPath, 'users/add'].join('/'),
  updateUser: [apiPath, 'users/update'].join('/'),
  allUsers: [apiPath, 'users/all'].join('/'),
} as ApiUrl;
