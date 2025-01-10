#!/bin/bash
echo "Generating SQL scripts with environment variables..."

if [[ -z "$NODE_ENV" ]]; then
    export NODE_ENV="development"
    export DB_NAME="${DB_NAME}_${NODE_ENV}"
elif [[ "$NODE_ENV" == "production" ]]; then
    export DB_NAME="${DB_NAME}"
else
    export DB_NAME="${DB_NAME}_${NODE_ENV}"
fi

# Remplacement des placeholders dans init.sql
TEMP_SQL_FILE="/tmp/init.sql"
envsubst < /docker-entrypoint-initdb.d/sql/init.sql > "$TEMP_SQL_FILE"

echo "Waiting for MySQL to be ready..."
until mysql -u root -p${DB_ROOT_PASS} -e "SELECT 1" &> /dev/null; do
    echo "Waiting for MySQL..."
    sleep 2
done
echo "Database is ready."

mysql -u root -p"${DB_ROOT_PASS}" < "$TEMP_SQL_FILE"