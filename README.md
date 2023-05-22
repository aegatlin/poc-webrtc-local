# poc-webrtc-local

Truly local-only webrtc means you cannot use your own signaling servers. The
sad truth of this means you will merely be using _someone elses_ signaling servers.
But this is a PoC without (our own) signaling, so we push on.

(In theory two peers could verbally dictate their various settings and you have
achieved "unsignaled" flow. But, the human voice counts as a communication channel,
and dictation is the act of signaling.)

## Unsignaled flow

1. Create local webrtcpeerconnection and associated local sdp offer and ice candidates
2. Share (magically) these details with a peer
3. The peer saves that info as "remote" and shares their "local" info with you. You save theirs as your "remote"
4. Yalls browsers attempt to find each other. On success, you got comms!

The info that is shared is the sdp offer and sdp answer, and then the ice candidates. The offer/answer
are one-sided affairs. You and your peer cannot both create an offer. One peer has to wait for an
offer, and then generate and share their answer.

## How to improve the shareability of the unsignaled signals

There could be clever ways to compress the info payload such that the info is easier to share.
I'm not at all familiar with the compress algorithm space, so will have to look into this further.
The pipe dream is an easily reversible compression algorithm such that you can share a long (but not
too long) URL with a peer, for example over a texting app.

```
/room/:roomId?offer=abc123
```

Maybe then a flow could allow for another copy and paste with the answer

```
def456
```

The offerer could then paste that text into a form field on their own page.

Or you could encode it in a url again?

```
/room/:roomId?answer=def456
```

They would then have to open a new webpage which would maybe mess up their offer data, unless
that data was cached in local and/or somehow perserved across webpages. Though, this might be unwise
for various reasons.
