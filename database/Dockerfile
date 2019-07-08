FROM mysql
# needed for intialization
ENV MYSQL_ROOT_PASSWORD=supersecret

COPY *.sql /docker-entrypoint-initdb.d/

EXPOSE 3306
