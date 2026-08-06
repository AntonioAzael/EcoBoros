#!/bin/bash
set -e

# Primero ejecuta el entrypoint original de Postgres
docker-entrypoint.sh "$@" &

# Esperar a que esté listo
until pg_isready -U postgres -d ecoboros; do
  echo "Esperando a que la base esté lista..."
  sleep 2
done

# Ejecutar solo los inserts
psql -U postgres -d ecoboros -f /docker-entrypoint-initdb.d/insert.sql

# Mantener el proceso principal (Postgres)
wait
