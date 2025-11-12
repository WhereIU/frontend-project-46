setup: install +x-chmod publish link

install:
	npm ci

+x-chmod:
	chmod +x bin/gen-diff.js

publish:
	npm publish --dry-run

link:
	npm link

lint:
	npx eslint .

lint-fix:
	npx eslint . --fix

test:
	npx jest

jest-coverage:
	npx jest --coverage