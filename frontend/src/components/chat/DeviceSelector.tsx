'use client';

import React from 'react';
import { Camera, Mic, Volume2 } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { useWebRTC } from '../../contexts/WebRTCContext';

interface DeviceSelectorProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DeviceSelector: React.FC<DeviceSelectorProps> = ({ isOpen, onClose }) => {
  const {
    audioInputs,
    videoInputs,
    audioOutputs,
    selectedAudioInput,
    selectedVideoInput,
    selectedAudioOutput,
    switchCamera,
    switchMicrophone,
  } = useWebRTC();

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Configurações de Dispositivos">
      <div className="flex flex-col gap-5 py-2">
        {/* Camera Selector */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
            <Camera className="w-4 h-4 text-sky-500" />
            Câmera
          </label>
          <select
            value={selectedVideoInput}
            onChange={(e) => switchCamera(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
          >
            {videoInputs.length === 0 ? (
              <option value="">Nenhuma câmera detectada</option>
            ) : (
              videoInputs.map((device) => (
                <option key={device.deviceId} value={device.deviceId}>
                  {device.label || `Câmera ${device.deviceId.substring(0, 5)}...`}
                </option>
              ))
            )}
          </select>
        </div>

        {/* Microphone Selector */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
            <Mic className="w-4 h-4 text-sky-500" />
            Microfone
          </label>
          <select
            value={selectedAudioInput}
            onChange={(e) => switchMicrophone(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
          >
            {audioInputs.length === 0 ? (
              <option value="">Nenhum microfone detectado</option>
            ) : (
              audioInputs.map((device) => (
                <option key={device.deviceId} value={device.deviceId}>
                  {device.label || `Microfone ${device.deviceId.substring(0, 5)}...`}
                </option>
              ))
            )}
          </select>
        </div>

        {/* Speaker / Output Selector */}
        {audioOutputs.length > 0 && (
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
              <Volume2 className="w-4 h-4 text-sky-500" />
              Saída de Áudio (Alto-falantes)
            </label>
            <select
              value={selectedAudioOutput}
              onChange={(e) => {}}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
              {audioOutputs.map((device) => (
                <option key={device.deviceId} value={device.deviceId}>
                  {device.label || `Saída ${device.deviceId.substring(0, 5)}...`}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="pt-3 flex justify-end">
          <Button variant="primary" size="md" onClick={onClose}>
            Concluído
          </Button>
        </div>
      </div>
    </Modal>
  );
};
