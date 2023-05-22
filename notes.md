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
