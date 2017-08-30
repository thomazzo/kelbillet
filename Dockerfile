FROM ubuntu:16.04

WORKDIR /home
RUN apt-get update && apt-get install -y curl redis-server build-essential

RUN curl -sL https://deb.nodesource.com/setup_8.x | bash
RUN curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add -
RUN echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list

RUN apt-get update && apt-get install -y nodejs yarn

RUN npm install -g --unsafe-perm elm

EXPOSE 3000

COPY backend/ backend/
COPY ui/ ui/
COPY Makefile Makefile
RUN mkdir dist/

RUN make install && make build

CMD ["node", "backend/server/index.js"]
