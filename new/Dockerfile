FROM node:16-alpine

WORKDIR /app

COPY . .

RUN yarn && yarn build

ENV NODE_ENV=production

CMD ["yarn", "start"]
