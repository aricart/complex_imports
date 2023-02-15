import {
  connect,
  credsAuthenticator, JSONCodec,
} from "https://raw.githubusercontent.com/nats-io/nats.deno/dev/src/mod.ts";

const authenticator = credsAuthenticator(
  Deno.readFileSync("build/nsc/data/nats/nsc/keys/creds/O/SPY/spy.creds"),
);

const nc = await connect({
  authenticator,
});

const r = await nc.request(`$SYS.REQ.USER.INFO`);
const info = JSONCodec().decode(r.data);
console.log(JSON.stringify(info, null, "   "));



nc.subscribe("streams", {
  callback: (err, msg) => {
    if (err) {
      console.error(err);
      return;
    }
    const payload = msg.string();
    // @ts-ignore: its there
    if(payload != info.data.account) {
      console.error("got an unexpected message");
    }
    console.log(`> ${msg.subject}: ${msg.string()}`);
  },
});

setInterval(() => {
  nc.request("requests")
    .then((r) => {
      console.log(`[R] ${r.string()}`);
    });
}, 1000);
