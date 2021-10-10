# DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

docker build -t emscripten-archive1 - < "`pwd`/scripts/Dockerfile"

docker run -it -v `pwd`:/prodir emscripten-archive1