# Makefile for Hugo project

HUGO=hugo
ENV?=development
PORT?=1313

# Default target
.PHONY: help
help:
	@echo "Available commands:"
	@echo "  make dev        - Run local dev server"
	@echo "  make build      - Build production site"
	@echo "  make clean      - Remove public folder"
	@echo "  make new        - Create new content (TITLE='name')"

# Run local server
.PHONY: dev
dev:
	$(HUGO) server -D --port $(PORT)

# Build production site
.PHONY: build
build:
	$(HUGO) --minify

# Clean build output
.PHONY: clean
clean:
	rm -rf public/

# Create new content
.PHONY: new
new:
	$(HUGO) new content/posts/$(TITLE).md