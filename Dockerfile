FROM node:22-alpine

WORKDIR /app

COPY package.json /app/

RUN npm install --global tsx@latest && yarn

COPY . .

CMD ["yarn", "start"]

