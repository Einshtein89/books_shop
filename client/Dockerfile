## Stage 0, "build-stage", based on Node.js, to build and compile the frontend
FROM node:10.8.0 as build-stage
ENV APP_HOME=/usr/src/app
RUN mkdir -p $APP_HOME
COPY . $APP_HOME
WORKDIR $APP_HOME
RUN npm install
ARG configuration=production
RUN npm run build -- --output-path=./dist --configuration $configuration

## Stage 1, based on Nginx, to have only the compiled app, ready for production with Nginx
FROM nginx:latest
COPY --from=build-stage /usr/src/app/dist /usr/share/nginx/html
COPY ./src/public /usr/share/nginx/html/public
COPY ./nginx-custom.conf /etc/nginx/conf.d/default.conf
