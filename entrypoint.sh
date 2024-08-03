#!/bin/sh

# Function to wait for the database to be ready
wait_for_db() {
  echo "Waiting for database to be ready..."
  while ! pg_isready -h db -U $DB_USER -d $DB_NAME > /dev/null 2> /dev/null; do
    sleep 1
  done
  echo "Database is ready!"
}

# Wait for the database to be ready
wait_for_db

# Run Prisma migrations
npm run prisma:generate
npm run prisma:migrate

# Start the application based on the environment
if [ "$NODE_ENV" = "production" ]; then
  echo "Starting in production mode..."
  npm run build
  npm start
else
  echo "Starting in development mode..."
  npm run dev
fi