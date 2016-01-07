MOCHA ?= ./node_modules/.bin/mocha
_MOCHA ?= ./node_modules/.bin/_mocha
MOCHA_OPT = --compilers coffee:coffee-script/register


test-mocha: node_modules
	$(MOCHA) $(MOCHA_OPT) $(TESTS)

.PHONY: test-mocha