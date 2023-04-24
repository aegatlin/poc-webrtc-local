// This is from a previous attempt at a poc-webrtc-local app
// //
// import { uuid } from './uuid'

// interface Wurtsy {
//   id: string
//   pc: RTCPeerConnection
//   dataChannel: RTCDataChannel | null
//   offer: RTCSessionDescriptionInit | null
//   iceCandidates: RTCIceCandidate[]
// }

// export const Wurtsy = {
//   async new(window): Promise<Wurtsy> {
//     const wurtsy: Wurtsy = {
//       id: uuid(),
//       pc: new window.RTCPeerConnection(),
//       dataChannel: null,
//       offer: null,
//       iceCandidates: [],
//     }

//     // wurtsy.dataChannel = wurtsy.pc.createDataChannel(wurtsy.id)

//     // Internal.prepareRTCPeerConnectionListeners(wurtsy)
//     // Internal.prepareDataChannelListeners(wurtsy)

//     // wurtsy.offer = await wurtsy.pc.createOffer()
//     // await wurtsy.pc.setLocalDescription(wurtsy.offer)
//     return wurtsy
//   },
//   getShareable(wurtsy: Wurtsy): string {
//     return wurtsy.id
//   },
// }

// const Internal = {
//   prepareRTCPeerConnectionListeners(wurtsy: Wurtsy) {
//     wurtsy.pc.addEventListener('icecandidate', (e) => {
//       if (e.candidate) {
//         wurtsy.iceCandidates.push(e.candidate)
//       }
//     })

//     wurtsy.pc.addEventListener('datachannel', (e) => {
//       console.log('remote datachannel event', e)
//       const dataChannel = e.channel

//       dataChannel.addEventListener('open', (e) => {
//         console.log('remote datachannel open', e)
//         dataChannel.send('hello from remote')
//       })

//       dataChannel.addEventListener('message', (e) => {
//         console.log('remote message received', e, e.data)
//       })
//     })
//   },
//   prepareDataChannelListeners(wurtsy: Wurtsy) {
//     if (!wurtsy.dataChannel) throw 'No wurtsy data channel, but is required.'

//     wurtsy.dataChannel.addEventListener('open', (e) => {
//       if (!wurtsy.dataChannel) throw 'No wurtsy data channel, but is required.'
//       console.log('local datachannel open', e)
//       wurtsy.dataChannel.send('hello from local')
//     })

//     wurtsy.dataChannel.addEventListener('message', (e) => {
//       console.log('local message received', e, e.data)
//     })
//   },
// }
