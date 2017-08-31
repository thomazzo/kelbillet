FROM node:8

RUN npm install --unsafe-perm -g elm

COPY backend/ backend/
COPY ui/ ui/
COPY Makefile Makefile
RUN mkdir dist/

RUN make install && make build

CMD ["node", "backend/server/index.js"]
