// import { useState } from 'react'
// import { Button } from './core/Button'
// import { Card } from './core/Card'
// import { Header } from './core/Header'

// function App() {
//   const newRoom = () => {

//   }

//   return (
//     <>
//       <Header />
//       <div className="my-16 flex flex-col items-center">
//         <div className="flex space-x-8 mb-16">
//           <Button onClick={() => null}>New Room</Button>
//           <Button onClick={() => null}>Join Room</Button>
//         </div>
//         <Card>
//           <div className="p-8 max-w-lg space-y-6">
//             <p>
//               poc-local-webrtc is a proof of concept for how to connect local
//               (LAN only) peers in the browser, without ice-servers, TURN/relays
//               servers, or any servers at all. A completely serverless,
//               completely p2p (peer-to-peer) webrtc experience.
//             </p>
//             <p>
//               Please submit PRs or issues if you think this can be improved, or
//               brought closer to "true p2p in the browser".
//             </p>
//             <p>
//               My understanding of the current limitations have to do with
//               discovery and signaling. Namely, browser pages aren't capable of
//               listening (pseudo-server-like) for messages on their LAN. There
//               are a few creative ways to force, from a browser page, a LAN
//               broadcast of some packets (though not with arbitrary payloads).
//               But there is no way to listen for those packets.
//             </p>
//             <p>
//               This means LAN peers have to share (verbally, or through,
//               probably, a WAN server) information about how to find each other
//               within the LAN.
//             </p>
//             <p>
//               This means there is two tiered goals. (1) Figure out a secure way
//               to achieve LAN connections without WAN nor verbal communication
//               (though verbal communication _does_ count as a local-only
//               communication channel since voices don't travel that far.) (2)
//               Figure out how to minimize the total payload that has to be
//               communicated verbally or via WAN.
//             </p>
//           </div>
//         </Card>
//       </div>
//     </>
//   )
// }

// export default App
