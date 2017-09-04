FROM node:8

RUN npm install --unsafe-perm -g elm

COPY backend/ backend/
COPY dist/ dist/

COPY Makefile Makefile
RUN make install

WORKDIR backend/
CMD ["./node_modules/nodemon/bin/nodemon.js","./server/index.js"]
