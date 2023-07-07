#!/bin/bash

set -e

mkdir -p dist
rm -rf dist
mkdir -p dist/altv

cp -r bin/altv dist

cp .env dist/altv