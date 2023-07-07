#!/bin/bash

if [ "$1" = "release" ] || [ "$1" = "rc" ] || [ "$1" = "dev" ]; then 
    echo "Downloading newest updates"
else
    echo "Invalid parameter, try 'release', 'rc' or 'dev'"
    exit 1
fi

mkdir -p {bin,bin/altv}
cd bin/altv

curl -L https://cdn.altv.mp/server/release/x64_win32/altv-server.exe > server.exe
    echo "Server loaded"

mkdir -p modules/js-module && cd $_
curl --remote-name-all -L https://cdn.altv.mp/js-module/$1/x64_win32/modules/js-module/{js-module,libnode}.dll
    echo "Js module loaded"
cd ../..

mkdir -p data && cd $_
curl --remote-name-all -L https://cdn.altv.mp/data/$1/data/{vehmodels,vehmods,pedmodels,clothes,rpfdata,weaponmodels}.bin
    echo "Vehicle binaries and clothes loaded"
cd ..

exit 0