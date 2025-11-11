setup: install

install:
	npm ci

lint:
	npx eslint .

lint-fix:
	npx eslint . --fix

test:
	npx jest

jest-coverage:
	npx jest --coverage