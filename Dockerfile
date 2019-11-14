FROM node:13.1.0-alpine

RUN apk add --no-cache make gcc g++ python
RUN mkdir /app
WORKDIR /app
ADD package.json yarn.lock ./
RUN yarn --pure-lockfile
ADD . .
RUN yarn build
RUN yarn cache clean

FROM node:13.1.0-alpine
COPY --from=0 /app /app
WORKDIR /app
EXPOSE 5000 31337/udp

ENTRYPOINT "./entrypoint.sh"