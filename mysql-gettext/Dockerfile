FROM mysql:latest

#microdnf current package manager of mysql image
RUN microdnf install -y gettext 
# if needed
RUN microdnf install -y dos2unix
RUN microdnf clean all

#Avoid bad character due to window .sh edit files
COPY ./db/init-scripts /docker-entrypoint-initdb.d

RUN dos2unix /docker-entrypoint-initdb.d/init-scripts.sh