FROM node:16.13.0-alpine as node

WORKDIR usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

FROM nginx:1.21-alpine

COPY --from=node /usr/src/app/dist/nevamanagement-web /usr/share/nginx/html

COPY ./nginx.conf /etc/nginx/conf.d/default.conf

CMD sed -i -e 's/$PORT/'"$PORT"'/g' /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'