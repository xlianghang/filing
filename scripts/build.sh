rm -rf ./.temp
mkdir .temp

emcc ./src/cpp/export.cpp -I /usr/local/include/ -o ./.temp/main.o #-g4

emcc ./.temp/main.o /usr/local/lib/libarchive.a /usr/local/lib/liblzma.a /usr/local/lib/libcrypto.a \
    -o ./.temp/archive.js \
    -s USE_ZLIB=1 -s USE_BZIP2=1 -s MODULARIZE=1 -s EXPORT_ES6=1 -s USE_ES6_IMPORT_META=0 -s EXPORT_NAME=archive -s WASM=1 -O3 -s ALLOW_MEMORY_GROWTH=1 \
    -s EXTRA_EXPORTED_RUNTIME_METHODS='["cwrap", "allocate","intArrayFromString"]' -s EXPORTED_FUNCTIONS=@scripts/export.json -s ERROR_ON_UNDEFINED_SYMBOLS=0

rm ./src/wasm/archive.js
rm ./src/wasm/archive.wasm
cp ./.temp/archive.js ./src/wasm/
cp ./.temp/archive.wasm ./src/wasm/