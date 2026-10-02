export type SignalData =
  | { type: 'join'; from: string }
  | { type: 'offer'; from: string; target: string; sdp: RTCSessionDescriptionInit }
  | { type: 'answer'; from: string; target: string; sdp: RTCSessionDescriptionInit }
  | { type: 'ice-candidate'; from: string; target: string; candidate: RTCIceCandidateInit }

export type SignalPayload = SignalData
