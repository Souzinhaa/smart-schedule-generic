#!/bin/sh
set -e

export PORT=${PORT:-3000}
export BACKEND_URL=${BACKEND_URL:-http://backend:8000}

echo "Configuring nginx..."
echo "  PORT: $PORT"
echo "  BACKEND_URL: $BACKEND_URL"

envsubst '${BACKEND_URL} ${PORT}' < /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf

echo "Starting nginx..."
exec nginx -g "daemon off;"
