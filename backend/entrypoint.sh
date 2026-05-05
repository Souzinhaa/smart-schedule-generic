#!/bin/bash
set -e

echo "Running database migrations..."
python -c "from app.database import Base, engine; from app import models; Base.metadata.create_all(bind=engine)"

echo "Running seed..."
python seed.py

echo "Starting server..."
exec "$@"
