setup: install
install:
	npm ci
lint:
	npx eslint .
lint-fix:
	npx eslint . --fix
test:
	npx jest
test-coverage:
	npx jest --coverage