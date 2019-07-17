/// <reference types="react-scripts" />

declare module 'react-webcam' {
  import * as React from "react";

  declare class Webcam extends React.Component<Webcam.WebcamProps, Webcam.WebcamState> {
    video: HTMLVideoElement;
    private static mountedInstances: Webcam[];
    private static userMediaRequested: boolean;
    getScreenshot(): string|null;
    getCanvas(): HTMLCanvasElement|null;
    requestUserMedia(): void;
    handleUserMedia(error: Error, stream: MediaStream): void;
  }

  declare namespace Webcam {
    interface WebcamProps {
      audio?: boolean;
      muted?: boolean;
      height?: number|string;
      width?: number|string;
      screenshotFormat?: 'image/jpeg' | 'image/png' | 'image/webp';
      style?: React.CSSProperties;
      className?: string;
      audioSource?: string;
      videoSource?: string;
      onUserMedia?(): void;
      screenshotQuality?: number;
      minScreenshotWidth?: number;
      minScreenshotHeight?: number;
    }

    interface WebcamState {
      hasUserMedia: boolean;
      src?: string;
    }
  }

  export default Webcam;
}

declare module '@vostokplatform/uikit';
