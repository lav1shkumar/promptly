#!/bin/bash

# 1. Navigate to the correct app directory
cd /home/user/app

echo "Starting Next.js to pre-compile the route..."

# 2. Start Next.js in the background and capture its Process ID
npx next dev --turbopack -H 0.0.0.0 &
NEXT_PID=$!

echo "Waiting for server to be responsive..."

counter=0
# 3. Use 127.0.0.1 instead of localhost to avoid IPv6 resolution quirks in Docker
response=$(curl -s -o /dev/null -w "%{http_code}" "http://127.0.0.1:3000")

while [[ ${response} -ne 200 ]]; do
    let counter++
    
    if (( counter % 10 == 0 )); then
        echo "Still waiting for compilation... (${counter} seconds)"
    fi
    
    sleep 1
    
    response=$(curl -s -o /dev/null -w "%{http_code}" "http://127.0.0.1:3000")

    # 4. Failsafe: Don't let the Docker build hang forever if Next.js crashes
    if (( counter > 120 )); then
        echo "Timeout: Next.js failed to compile within 2 minutes."
        kill $NEXT_PID
        exit 1
    fi
done

echo "Compilation successful! Caching results..."

# 5. CRITICAL: Kill the Next.js process so the Docker build layer can finish
kill $NEXT_PID

# Exit cleanly
exit 0