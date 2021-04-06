# Pith Studies

A web framework for running studies with Pith.

## Development

Run it.

```
$ docker-compose --env-file .env.test up --build -d
```

# Production

`docker-compose.prod.yml` contains an additional container, `balancer`, that directs traffic between the frontend and backend. In order to run in production, you'll need a domain and ssl certificate. Create a file at this repository's root called `cert.pem` containing your certificate and key:

```
-----BEGIN CERTIFICATE-----
<certificate>
-----END CERTIFICATE-----
-----BEGIN CERTIFICATE-----
<your origin's CA certificate>
-----END CERTIFICATE-----
-----BEGIN PRIVATE KEY-----
<private key>
-----END PRIVATE KEY-----
```

Then run the production stack:

```
$ docker-compose -f docker-compose.prod.yml --env-file .env up --build -d
```
