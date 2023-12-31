![workflow](https://github.com/hakon22/node.js/actions/workflows/makefile.yml/badge.svg)
[![Maintainability](https://api.codeclimate.com/v1/badges/bd671ea507ef9c8e7f3a/maintainability)](https://codeclimate.com/github/hakon22/node.js/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/bd671ea507ef9c8e7f3a/test_coverage)](https://codeclimate.com/github/hakon22/node.js/test_coverage)
# Node.js + React TypeScript project
## with React/React-Router/Redux-Toolkit, Jest, Bootstrap, Express/PostgreSQL

The project consists of two backends, one written in JS, the second in TypeScript.\
The frontend is written in React TypeScript.\
The project provides the opportunity to create a user with his personal page.\
When a user is created/changed, a log of actions is recorded.\
On the log page you can sort the list by user id.\
For convenience, the list is divided into pages with Boostrap pagination.

**Start frontend:** `make start-frontend`\
**Start users backend:** `make start-local`\
**Start logs backend:** `make start-local-logs`\
**Start tests:** `make test` or `make test-coverage`

[![Project screan](https://i.ibb.co/FH2vrcj/node.png)](https://portfolio.am-projects.ru/node.js/)