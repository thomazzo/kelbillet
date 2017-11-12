.PHONY: build
build:
	cd ui && elm-package install -y && elm-make app.elm --output=../dist/main.js

.PHONY: install
install:
	cd backend && yarn install
