#!/bin/bash

cd frontend 
yarn run dev &
cd ..

cd express_backend
yarn dev&
cd ..

cd ../../bots/genaiProjectsmodels
source venv/bin/activate
python3 Flask_server/director.py &



echo "--------------------------------------------------------"
echo "frontend is hosted on 5173"
echo "backend is hosted on 3000"
echo "ollama is also running"
echo "--------------------------------------------------------"


wait
