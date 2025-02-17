const configuration = {
  iceServers: [
    {
      urls: [
        "stun:stun.l.google.com:19302",
        "stun:global.stun.twilio.com:3478",
      ],
    },
  ],
};

class PeerService {
  peer: RTCPeerConnection;

  constructor() {
    this.peer = new RTCPeerConnection(configuration);
  }

  async getOffer() {
    const offer = await this.peer.createOffer();
    await this.peer.setLocalDescription(new RTCSessionDescription(offer));
    return offer;
  }

  async getAnswer(offer: RTCSessionDescriptionInit) {
    await this.peer.setRemoteDescription(offer);
    const ans = await this.peer.createAnswer();
    await this.peer.setLocalDescription(new RTCSessionDescription(ans));
    return ans;
  }

  async setLocalDescription(ans: RTCSessionDescriptionInit) {
    await this.peer.setRemoteDescription(new RTCSessionDescription(ans));
  }

  resetConnection() {
    this.peer.getSenders().forEach((sender) => {
      if (sender.track) {
        sender.track.stop();
      }
      this.peer.removeTrack(sender);
    });

    this.peer.close();
    this.peer = new RTCPeerConnection(configuration);
  }
}

export const peer = new PeerService();
