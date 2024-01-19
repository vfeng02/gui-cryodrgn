#!/bin/bash
cd ..
python vite-drgncommands/backend/server.py &
cd vite-drgncommands/frontend
npx vite
cd ../../
