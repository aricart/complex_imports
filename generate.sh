set -o xtrace
export XDG_CONFIG_HOME=build/nsc/config
export XDG_DATA_HOME=build/nsc/data

set -euo pipefail #failis if error, u unset vars, pipefail prev command fails will catch
# clean any previous output
rm -Rf build/
# add operator
nsc add operator O --sys

nsc add account SRV
nsc add export --name requests --service --subject "requests.*" --account-token-position 2
nsc add export --name stream --subject "streams.*" --account-token-position 2
nsc add user srv

nsc add account C1
export C1_PK=$(nsc describe account C1 --json | jq -r .sub)
nsc add import --account C1 --remote-subject "streams.${C1_PK}" --local-subject "streams" --src-account SRV
nsc add import --account C1 --service --remote-subject "requests.${C1_PK}" --local-subject "requests" --src-account SRV
nsc add user --account C1 c1

nsc add account SPY
nsc add import --account SPY --remote-subject "streams.${C1_PK}" --local-subject "streams" --src-account SRV
nsc add import --account SPY --service --remote-subject "requests.${C1_PK}" --local-subject "requests" --src-account SRV
nsc add user --account SPY spy


nsc describe account SRV
nsc describe account C1
nsc describe account SPY

nsc generate config --mem-resolver --config-file build/server.conf
