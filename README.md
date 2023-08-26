# poc-webrtc-local

This is a PoC for a p2p webrtc. The first mode is local only webrtc via manual
file sharing.

## Ideas

### p2p local-only

Is there a way to compress the file data into an easily sharable URL? Perhaps there is a reversible string compression algorithm that would not exceed URL max character length, and thereby we could include the connection details as a URL query param?

If we can encode the payload as a Data URL / Blob, then perhaps we can share that string via the Share Web API with other local peers.

### p2p non-local

The biggest issues with non-local p2p is discoverability. Perhaps there is a p2p protocol that can be leveraged instead of a STUN server to identify a node in the network. But, even then, you will still need to know your STUN'd external IP in order to connect. Unless you could get your IPv6 address somehow, and communicate that across the p2p network.

Can you write the file to a blockchain?

Can you write the file to IPFS?
