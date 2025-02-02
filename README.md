> [!CAUTION]
> Not tested at all

> [!WARNING]
> Before using this adapter please carefully read [Caveats](#caveats) section below

# ghost-sso-header
Header SSO Adapter for Ghost

## Prerequisites

This adapter is written for Ghost version X, compatibility is unknown

Your load balancer (reverse proxy, API gateway, etc) needs to add request header with user email or user object as JSON string

This can be done with:
- [Hydrate Headers](https://github.com/Catzilla/traefik-hydrate-headers) plugin for [Traefik](https://traefik.io/)
- [cookie_session](https://www.ory.sh/docs/oathkeeper/pipeline/authn#cookie_session) authenticator + [header](https://www.ory.sh/docs/oathkeeper/pipeline/mutator#header) mutator in [Ory Oathkeeper](https://www.ory.sh/oathkeeper/)
- Any other solutions by your choice

## Installation

### Linux

1. Download index.js

2. Move file to `content/adapters/sso` directory:

```shell
mv ./index.js /path-to-ghost/content/adapters/sso/ghost-sso-header/
```

3. Adjust Ghost configuration with following:

```json
"adapters": {
    "sso": {
        "active": "ghost-sso-header",
        "ghost-sso-header": {
            "emailheader": "Remote-Email",
            "usernameheader": "Remote-Username",
            "keyheader": "Remote-Key",
            "key": <random openssl key>
        }
    }
}
```
or use environment variables as described in Ghost [Configuration](https://ghost.org/docs/config/#custom-configuration-files) section

### Docker

Follow steps 1 and 3 from [Linux](#linux) section, and mount adapter as volume in your `docker-compose.yml`:

```yaml
services:
  ghost:
    #...
    volumes:
      - ./index.js:/var/lib/ghost/content/adapters/sso/ghost-sso-header/index.js
```

you may also build custom docker image and include adapter inside it

## Caveats
- **Malicious users may set user header manually. Make sure that this header get stripped by your load balancer or reverse proxy.** In case you are using [Traefik](https://traefik.io/), you may use [headers middleware](https://doc.traefik.io/traefik/middlewares/http/headers/#adding-and-removing-headers) for this
- Ghost uses separate session, so after you logout in your identity provider, you still be authenticated in Ghost
- Logout in Ghost will not work while identity provider session is active
- Direct login with Ghost email/password still work when no identity provider session is active
- Use this adapter at your own risk, and do not consider it "production-ready". I wrote it for my personal projects, so no warranties at all
