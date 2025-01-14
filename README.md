# Shop Test
A very simple e-commerce website for fun

Notes :
Use custom docker image for mysql with gettext (install with microdnf)

Execute backend :

cmd :
```
docker-compose down -v && docker-compose up --build
```
Powershell: 
```
docker-compose down -v; if ($?) { docker-compose up --build }
```