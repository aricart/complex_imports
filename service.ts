import {
  connect,
  credsAuthenticator,
  StringCodec,
} from "https://raw.githubusercontent.com/nats-io/nats.deno/dev/src/mod.ts";

const authenticator = credsAuthenticator(
  Deno.readFileSync("build/nsc/data/nats/nsc/keys/creds/O/SRV/srv.creds"),
);
const sc = StringCodec();

const nc = await connect({
  authenticator,
});

const accounts = ["foo", "bar"];

await nc.services.add({
  name: "example-service",
  version: "0.0.1",
  endpoint: {
    subject: "requests.*",
    handler: (err, msg) => {
      const chunks = msg.subject.split(".");
      const account = chunks[1];
      if (accounts.indexOf(account) === -1) {
        accounts.push(account);
      }
      console.log(`servicing ${account}`);
      msg.respond(sc.encode(account));
    },
  },
});

setInterval(() => {
  accounts.map((n) => {
    console.log(`> ${n}`);
    return nc.publish(`streams.${n}`, sc.encode(n));
  });
}, 1000);
