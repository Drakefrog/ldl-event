
all: dist

dev:
	node bin/build-dev.js

dist: dev
	node bin/build-dist.js

clean:
	rm -fr ./dist

.PHONY: all clean
