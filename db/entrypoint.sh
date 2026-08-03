#!/bin/bash
set -e

# Arrancar el servidor de Postgres en segundo plano
docker-entrypoint.sh postgres &

# Esperar a que esté listo
until pg_isready -U postgres -d ecoboros; do
  echo "Esperando a que la base esté lista..."
  sleep 2
done

# Ejecutar solo los inserts
psql -U postgres -d ecoboros -f /docker-entrypoint-initdb.d/insert.sql

# Mantener el proceso principal
wait
