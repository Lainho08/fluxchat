'use client';

import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { useSocket } from './SocketContext';
import { ICE_SERVERS } from '../utils/constants';

interface WebRTCContextType {
  localStream: MediaStream | null;
  remoteStream: MediaStream | null;
  isAudioMuted: boolean;
  isVideoMuted: boolean;
  isScreenSharing: boolean;
  audioInputs: MediaDeviceInfo[];
  videoInputs: MediaDeviceInfo[];
  audioOutputs: MediaDeviceInfo[];
  selectedAudioInput: string;
  selectedVideoInput: string;
  selectedAudioOutput: string;
  startLocalMedia: (video: boolean, audio: boolean) => Promise<MediaStream | null>;
  stopLocalMedia: () => void;
  toggleAudio: () => void;
  toggleVideo: () => void;
  toggleScreenShare: () => Promise<void>;
  switchCamera: (deviceId: string) => Promise<void>;
  switchMicrophone: (deviceId: string) => Promise<void>;
  initiatePeerConnection: (isInitiator: boolean) => Promise<void>;
  closePeerConnection: () => void;
}

const WebRTCContext = createContext<WebRTCContextType>({} as WebRTCContextType);

export const WebRTCProvider = ({ children }: { children: React.ReactNode }) => {
  const { socket } = useSocket();

  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [isVideoMuted, setIsVideoMuted] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);

  const [audioInputs, setAudioInputs] = useState<MediaDeviceInfo[]>([]);
  const [videoInputs, setVideoInputs] = useState<MediaDeviceInfo[]>([]);
  const [audioOutputs, setAudioOutputs] = useState<MediaDeviceInfo[]>([]);

  const [selectedAudioInput, setSelectedAudioInput] = useState('');
  const [selectedVideoInput, setSelectedVideoInput] = useState('');
  const [selectedAudioOutput, setSelectedAudioOutput] = useState('');

  const peerConnection = useRef<RTCPeerConnection | null>(null);
  const screenTrackRef = useRef<MediaStreamTrack | null>(null);

  // Load available media devices
  const loadDevices = async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      setAudioInputs(devices.filter((d) => d.kind === 'audioinput'));
      setVideoInputs(devices.filter((d) => d.kind === 'videoinput'));
      setAudioOutputs(devices.filter((d) => d.kind === 'audiooutput'));
    } catch (err) {
      console.error('Failed to enumerate media devices:', err);
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined' && navigator.mediaDevices) {
      loadDevices();
      navigator.mediaDevices.addEventListener('devicechange', loadDevices);
      return () => {
        navigator.mediaDevices.removeEventListener('devicechange', loadDevices);
      };
    }
  }, []);

  const startLocalMedia = async (video: boolean, audio: boolean) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: video ? { deviceId: selectedVideoInput ? { exact: selectedVideoInput } : undefined } : false,
        audio: audio ? { deviceId: selectedAudioInput ? { exact: selectedAudioInput } : undefined } : false,
      });

      setLocalStream(stream);
      setIsAudioMuted(false);
      setIsVideoMuted(false);
      loadDevices();
      return stream;
    } catch (err) {
      console.error('Error starting media devices:', err);
      return null;
    }
  };

  const stopLocalMedia = () => {
    if (localStream) {
      localStream.getTracks().forEach((t) => t.stop());
      setLocalStream(null);
    }
    if (screenTrackRef.current) {
      screenTrackRef.current.stop();
      screenTrackRef.current = null;
    }
    setIsScreenSharing(false);
  };

  const toggleAudio = () => {
    if (localStream) {
      const audioTracks = localStream.getAudioTracks();
      if (audioTracks.length > 0) {
        audioTracks[0].enabled = !audioTracks[0].enabled;
        setIsAudioMuted(!audioTracks[0].enabled);
      }
    }
  };

  const toggleVideo = () => {
    if (localStream) {
      const videoTracks = localStream.getVideoTracks();
      if (videoTracks.length > 0) {
        videoTracks[0].enabled = !videoTracks[0].enabled;
        setIsVideoMuted(!videoTracks[0].enabled);
      }
    }
  };

  const toggleScreenShare = async () => {
    if (!peerConnection.current || !localStream) return;

    if (isScreenSharing && screenTrackRef.current) {
      // Switch back to camera video track
      const videoTrack = localStream.getVideoTracks()[0];
      const sender = peerConnection.current.getSenders().find((s) => s.track?.kind === 'video');
      if (sender && videoTrack) {
        await sender.replaceTrack(videoTrack);
      }
      screenTrackRef.current.stop();
      screenTrackRef.current = null;
      setIsScreenSharing(false);
    } else {
      try {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
        const screenTrack = screenStream.getVideoTracks()[0];
        screenTrackRef.current = screenTrack;

        const sender = peerConnection.current.getSenders().find((s) => s.track?.kind === 'video');
        if (sender) {
          await sender.replaceTrack(screenTrack);
        }

        screenTrack.onended = () => {
          toggleScreenShare();
        };

        setIsScreenSharing(true);
      } catch (err) {
        console.error('Screen sharing error:', err);
      }
    }
  };

  const switchCamera = async (deviceId: string) => {
    setSelectedVideoInput(deviceId);
    if (!localStream) return;

    const newStream = await navigator.mediaDevices.getUserMedia({
      video: { deviceId: { exact: deviceId } },
      audio: false,
    });

    const newVideoTrack = newStream.getVideoTracks()[0];
    const oldVideoTrack = localStream.getVideoTracks()[0];

    if (oldVideoTrack) {
      localStream.removeTrack(oldVideoTrack);
      oldVideoTrack.stop();
    }

    localStream.addTrack(newVideoTrack);

    if (peerConnection.current) {
      const sender = peerConnection.current.getSenders().find((s) => s.track?.kind === 'video');
      if (sender) {
        sender.replaceTrack(newVideoTrack);
      }
    }
  };

  const switchMicrophone = async (deviceId: string) => {
    setSelectedAudioInput(deviceId);
    if (!localStream) return;

    const newStream = await navigator.mediaDevices.getUserMedia({
      audio: { deviceId: { exact: deviceId } },
      video: false,
    });

    const newAudioTrack = newStream.getAudioTracks()[0];
    const oldAudioTrack = localStream.getAudioTracks()[0];

    if (oldAudioTrack) {
      localStream.removeTrack(oldAudioTrack);
      oldAudioTrack.stop();
    }

    localStream.addTrack(newAudioTrack);

    if (peerConnection.current) {
      const sender = peerConnection.current.getSenders().find((s) => s.track?.kind === 'audio');
      if (sender) {
        sender.replaceTrack(newAudioTrack);
      }
    }
  };

  const closePeerConnection = () => {
    if (peerConnection.current) {
      peerConnection.current.close();
      peerConnection.current = null;
    }
    setRemoteStream(null);
  };

  const initiatePeerConnection = async (isInitiator: boolean) => {
    closePeerConnection();

    const pc = new RTCPeerConnection(ICE_SERVERS);
    peerConnection.current = pc;

    const remoteMediaStream = new MediaStream();
    setRemoteStream(remoteMediaStream);

    pc.ontrack = (event) => {
      event.streams[0].getTracks().forEach((track) => {
        remoteMediaStream.addTrack(track);
      });
    };

    pc.onicecandidate = (event) => {
      if (event.candidate && socket) {
        socket.emit('iceCandidate', { candidate: event.candidate });
      }
    };

    if (localStream) {
      localStream.getTracks().forEach((track) => {
        pc.addTrack(track, localStream);
      });
    }

    if (isInitiator) {
      try {
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);
        socket?.emit('videoOffer', { offer });
      } catch (err) {
        console.error('Error creating SDP offer:', err);
      }
    }
  };

  // Socket Signaling Listeners
  useEffect(() => {
    if (!socket) return;

    const handleVideoOffer = async (data: { offer: RTCSessionDescriptionInit }) => {
      if (peerConnection.current) {
        try {
          await peerConnection.current.setRemoteDescription(new RTCSessionDescription(data.offer));
          const answer = await peerConnection.current.createAnswer();
          await peerConnection.current.setLocalDescription(answer);
          socket.emit('videoAnswer', { answer });
        } catch (err) {
          console.error('Error handling SDP offer:', err);
        }
      }
    };

    const handleVideoAnswer = async (data: { answer: RTCSessionDescriptionInit }) => {
      if (peerConnection.current) {
        try {
          await peerConnection.current.setRemoteDescription(new RTCSessionDescription(data.answer));
        } catch (err) {
          console.error('Error handling SDP answer:', err);
        }
      }
    };

    const handleIceCandidate = async (data: { candidate: RTCIceCandidateInit }) => {
      if (peerConnection.current && data.candidate) {
        try {
          await peerConnection.current.addIceCandidate(new RTCIceCandidate(data.candidate));
        } catch (err) {
          console.error('Error adding ICE candidate:', err);
        }
      }
    };

    socket.on('videoOffer', handleVideoOffer);
    socket.on('videoAnswer', handleVideoAnswer);
    socket.on('iceCandidate', handleIceCandidate);

    return () => {
      socket.off('videoOffer', handleVideoOffer);
      socket.off('videoAnswer', handleVideoAnswer);
      socket.off('iceCandidate', handleIceCandidate);
    };
  }, [socket]);

  return (
    <WebRTCContext.Provider
      value={{
        localStream,
        remoteStream,
        isAudioMuted,
        isVideoMuted,
        isScreenSharing,
        audioInputs,
        videoInputs,
        audioOutputs,
        selectedAudioInput,
        selectedVideoInput,
        selectedAudioOutput,
        startLocalMedia,
        stopLocalMedia,
        toggleAudio,
        toggleVideo,
        toggleScreenShare,
        switchCamera,
        switchMicrophone,
        initiatePeerConnection,
        closePeerConnection,
      }}
    >
      {children}
    </WebRTCContext.Provider>
  );
};

export const useWebRTC = () => useContext(WebRTCContext);
