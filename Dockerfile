FROM node:14-alpine as build

WORKDIR /app
COPY . /app/
RUN apk add --no-cache yarn && yarn install && yarn build

FROM alpine:3.8

LABEL AUTHOR="Jan Kuri" AUTHOR_EMAIL="jkuri88@gmail.com"

WORKDIR /app

COPY --from=build /usr/local/bin/node /usr/bin
COPY --from=build /usr/lib/libgcc* /usr/lib/libstdc* /usr/lib/
COPY --from=build /app/dist/app ./dist

EXPOSE 4095

CMD ["node", "/app/dist/server.js"]
