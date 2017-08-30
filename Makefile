.PHONY: build
build:
	cd ui && elm-package install -y && elm-make app.elm --output=../dist/index.html

.PHONY: install
install:
	cd backend && yarn install
