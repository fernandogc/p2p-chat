export type SignalPayload =
  | { type: 'join'; from: string }
  | { type: 'offer'; from: string; target: string; sdp: RTCSessionDescriptionInit }
  | { type: 'answer'; from: string; target: string; sdp: RTCSessionDescriptionInit }
  | { type: 'ice-candidate'; from: string; target: string; candidate: RTCIceCandidateInit }

export type DataPayload =
  | { type: 'CHAT_MESSAGE'; id: string; text: string }
  | { type: 'EDIT_MESSAGE'; id: string; text: string }
  | { type: 'DELETE_MESSAGE'; id: string }

export interface MessageItem {
  id: string
  from: string
  text: string
  isEdited?: boolean
  isDeleted?: boolean
}
