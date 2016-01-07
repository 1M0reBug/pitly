SOURCES = routes/*.js app.js
TESTS ?= test/*.test.coffee

test: test-mocha
test-cov: test-istanbul-mocha
include support/node.mk
include support/mocha.mk
include support/istanbul.mk
include support/coveralls.mk

ci-travis: test test-cov

clean:
	@rm -rf reports

start: node_modules
	node ./bin/www

.PHONY: test test-cov ci-travis clean
