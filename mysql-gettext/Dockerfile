FROM mysql:latest

#microdnf current package manager of mysql image
RUN microdnf install -y gettext && microdnf clean all

COPY ./db/init-scripts /docker-entrypoint-initdb.d