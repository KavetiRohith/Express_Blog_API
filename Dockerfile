FROM node:20-alpine

COPY package.json .
RUN npm install
COPY . .
CMD npm start