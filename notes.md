There's two flows, so maybe two wrtc classes are justified. Let's elucidate
the flows.

## offer flow

- init webrtc
- gen local offer info
- wait for remote answer info
- establish comms

## answer flow

- init webrtc
- input remote offer info
- gen local answer info and send
- establish comms

## improvement?

with the share api, maybe rethinking the flow could work. You know it's local first, so both peers are "next to each other". One opens the app and clicks "new call". A loading screen. Then a "share" button". They share (probs airdrop) to their peer, I guess a b64 encoded paylod of ice candidates and media info. I forget how a string of text works. 