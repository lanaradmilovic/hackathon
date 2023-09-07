#!/usr/bin/env bash

# compile TEAL programs
goal clerk compile program.teal -o program_approval.teal
goal clerk compile clear.teal -o clear_state.teal

# create application
goal app create --approval-prog /data/build/approval.teal --clear-prog /data/build/approval.teal --global-byteslices 3 --global-ints 1 --local-byteslices 3 --local-ints 1 --app-arg "int:1" --app-arg "int:2" --app-arg "int:3" --app-arg "int:4" --app-arg "int:5" --creator $ONE
echo "Application ID: 35"

# opt-in accounts
goal app optin --app-id 35 --from CABZRIUSAPWLYETUXD6ZVKALYT37SIPDL66QDHQU5B5FPP76R5XUWUXRUY

# call create_coffee from account 1
goal app call --app-id 35 \
  --app-account O2XPRYBDRYPMHQXTYS3NHOBLEBNRFST2AKBIFTTHFBWOPG46AFP6MPO3L4 \
  --from CABZRIUSAPWLYETUXD6ZVKALYT37SIPDL66QDHQU5B5FPP76R5XUWUXRUY \
  --out=unsigned_create.txn \
  --app-arg "base64:<coffee-guid>" \
  --app-arg "int:<coffee-type>" \
  --app-arg "int:<coffee-batch-number>" \
  --app-arg "int:<coffee-batch-size>" \
  --app-account O2XPRYBDRYPMHQXTYS3NHOBLEBNRFST2AKBIFTTHFBWOPG46AFP6MPO3L4

# call receive_coffee from account 2
goal app call --app-id 35 \
  --app-account O2XPRYBDRYPMHQXTYS3NHOBLEBNRFST2AKBIFTTHFBWOPG46AFP6MPO3L4 \
  --from CABZRIUSAPWLYETUXD6ZVKALYT37SIPDL66QDHQU5B5FPP76R5XUWUXRUY \
  --out=unsigned_receive.txn \
  --app-arg "base64:<coffee-guid>" \
  --app-account O2XPRYBDRYPMHQXTYS3NHOBLEBNRFST2AKBIFTTHFBWOPG46AFP6MPO3L4

# sign and send transactions
goal clerk send unsigned_create.txn -o create.txn
goal clerk send unsigned_receive.txn -o receive.txn