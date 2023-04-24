const local = new RTCPeerConnection();
prepareDataChannel();

const createOfferButton = document.getElementById("create-offer");
createOfferButton.onclick = () => {
  local.createOffer().then((offer) => {
    const div = document.getElementById("offer-sdp");
    div.innerText = offer.sdp;
    local.setLocalDescription(offer);
  });

  local.addEventListener("icecandidate", (e) => {
    const div = document.getElementById("offer-candidates");
    if (!e.candidate) return;
    const iCan = JSON.stringify(e.candidate.toJSON());
    const child = document.createElement("div");
    child.innerText = iCan;
    div.appendChild(child);
  });
};

const submitPeerAnswerButton = document.getElementById("submit-peer-answer");
submitPeerAnswerButton.onclick = () => {
  const peerAnswerSdp = document.getElementById("peer-answer-sdp").value;
  const peerAnswerCandidates = document
    .getElementById("peer-answer-candidates")
    .value.split("\n")
    .map((iCan) => {
      const info = JSON.parse(iCan);
      return new RTCIceCandidate(info);
    });

  local
    .setRemoteDescription({ type: "answer", sdp: peerAnswerSdp })
    .then(() => {
      peerAnswerCandidates.forEach((candidate) => {
        local.addIceCandidate(candidate);
      });
    });
};

const createAnswerButton = document.getElementById("create-answer");
createAnswerButton.onclick = () => {
  const peerOfferSDP = document.getElementById("peer-offer-sdp").value;
  const peerIceCandidates = document
    .getElementById("peer-offer-candidates")
    .value.split("\n")
    .map((iCandidate) => {
      const info = JSON.parse(iCandidate);
      return new RTCIceCandidate(info);
    });

  local.setRemoteDescription({ type: "offer", sdp: peerOfferSDP }).then(() => {
    local.createAnswer().then((answer) => {
      const div = document.getElementById("answer-sdp");
      div.innerText = answer.sdp;
      local.setLocalDescription(answer).then(() => {
        peerIceCandidates.forEach((iCandidate) => {
          local.addIceCandidate(iCandidate);
        });
      });
    });
  });

  local.addEventListener("icecandidate", (e) => {
    const div = document.getElementById("answer-candidates");
    if (!e.candidate) return;
    const iCan = JSON.stringify(e.candidate.toJSON());
    const child = document.createElement("div");
    child.innerText = iCan;
    div.appendChild(child);
  });
};

function prepareDataChannel() {
  const dataChannel = local.createDataChannel("test");

  dataChannel.addEventListener("open", (e) => {
    console.log("local datachannel open", e);
    dataChannel.send("hello from local");
  });

  dataChannel.addEventListener("message", (e) => {
    console.log("local message received", e, e.data);
  });

  local.addEventListener("datachannel", (e) => {
    console.log("remote datachannel event", e);
    const dataChannel = e.channel;

    dataChannel.addEventListener("open", (e) => {
      console.log("remote datachannel open", e);
      dataChannel.send("hello from remote");
    });

    dataChannel.addEventListener("message", (e) => {
      console.log("remote message received", e, e.data);
    });
  });
}
