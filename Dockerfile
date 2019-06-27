# Base
FROM node:10 as base
RUN mkdir -p /home/node/app
WORKDIR /home/node/app

# Slim
FROM node:10-slim as slim
RUN mkdir -p /home/node/app
WORKDIR /home/node/app

# Dev Dependencies
FROM base as devDependencies
COPY package*.json ./
RUN npm install

# Development
FROM slim as development
COPY --from=devDependencies /home/node/app/node_modules ./node_modules
COPY src ./src
COPY public ./public
COPY .env ./.env
COPY package.json ./

CMD ["npm", "run", "start"]
