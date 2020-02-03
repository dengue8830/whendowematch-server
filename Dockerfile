FROM node:12.14.0

RUN mkdir -p /app
WORKDIR /app

COPY package.json yarn.lock /app/
RUN yarn install

COPY . /app
