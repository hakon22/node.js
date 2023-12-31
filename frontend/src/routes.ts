const apiPath = '/node.js/api';

interface ApiUrl {
  [key: string]: string;
}

export default {
  homePage: '/',
  logsPage: '/logs',
  usersPage: '/users',
  userPage: ':id',
  notFoundPage: '*',
  addUser: [apiPath, 'users/add'].join('/'),
  updateUser: [apiPath, 'users/update/'].join('/'),
  allUsers: [apiPath, 'users/all'].join('/'),
  allLogs: [apiPath, 'logs/all'].join('/'),
} as ApiUrl;
