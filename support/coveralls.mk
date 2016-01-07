COVERALLS ?= ./node_modules/.bin/coveralls

submit-lcov:
	cat $(ISTANBUL_LCOV_INFO_PATH) | $(COVERALLS)

.PHONY: submit-lcov