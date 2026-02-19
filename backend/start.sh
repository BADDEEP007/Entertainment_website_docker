#!/bin/sh

# default values
PORT=${OUT_PORT:-8000}

CMD="python3 server.py  --port $PORT"

# optional packed mode
if [ ! -z "$PACKED" ]; then
  CMD="$CMD --packed $PACKED"
fi

# optional cache mode
if [ "$VCSKY_CACHE" = "1" ]; then
  CMD="$CMD --vcsky_cache"
fi

if [ "$VCBR_CACHE" = "1" ]; then
  CMD="$CMD --vcbr_cache"
fi

echo "Starting server with command:"
echo "$CMD"

exec $CMD
