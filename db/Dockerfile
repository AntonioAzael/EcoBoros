FROM postgres:16

ENV POSTGRES_USER=postgres
ENV POSTGRES_PASSWORD=eco472
ENV POSTGRES_DB=ecoboros

# Copiar solo el insert
COPY ./db/insert.sql /docker-entrypoint-initdb.d/insert.sql
COPY ./entrypoint.sh /entrypoint.sh

RUN chmod +x /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]
