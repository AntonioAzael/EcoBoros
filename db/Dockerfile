FROM postgres:16

ENV POSTGRES_USER=postgres
ENV POSTGRES_PASSWORD=eco472
ENV POSTGRES_DB=ecoboros

COPY init.sql /docker-entrypoint-initdb.d/01-init.sql
COPY insert.sql /docker-entrypoint-initdb.d/insert.sql
COPY entrypoint.sh /entrypoint.sh

RUN chmod +x /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]
CMD ["postgres"]
