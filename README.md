# Imports and Exports

This example illustrates how exports from one account can require
an account ID that matches:

```bash
# you need to install deno (https://deno.land) and jq
./generate.sh
# in different shells run:
nats-server -c build/server.conf &
# and
deno run -A service.ts

# and
deno run -A c1.ts

# and
deno run -A spy.ts

```

