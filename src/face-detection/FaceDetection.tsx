import * as faceapi from 'face-api.js';
import React, { Component, createRef, RefObject } from "react";
import Webcam from "react-webcam";
import { BASE_URL } from "../app/constants";
import { throttle } from "../utils";
import styles from './FaceDetection.module.css';

interface IProps {
  isFullScreenMode: boolean;
}

interface IState {
  imgSrc: string | null;
  facesCount: number;
}

function videoDimensions(video: HTMLVideoElement) {
  // Ratio of the video's intrisic dimensions
  const videoRatio = video.videoWidth / video.videoHeight;
  // The width and height of the video element
  let width = video.offsetWidth, height = video.offsetHeight;
  // The ratio of the element's width to its height
  const elementRatio = width / height;
  // If the video element is short and wide
  if (elementRatio > videoRatio) {
    width = height * videoRatio
  }
  // It must be tall and thin, or exactly equal to the original ratio
  else height = width / videoRatio;
  return {
    width: width,
    height: height
  };
}

export default class FaceDetection extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.handleDetections = throttle(this.handleDetections, 2000);
  }

  webcamRef: RefObject<Webcam> = createRef();

  frameWithFaceWasCaptured: boolean = false;

  recentDetections: boolean[] = [];

  isFaceInFrame: boolean = false;

  state = {
    imgSrc: null,
    facesCount: 0,
  };

  componentDidMount() {
    setInterval(() => {
      this.recentDetections = [];
    }, 2000);

    const webcam = this.webcamRef.current;
    if (webcam === null) {
      return;
    }
    const video = webcam.video;
    video.onloadedmetadata = async () => {
      await faceapi.nets.tinyFaceDetector.loadFromUri('/models/tiny_face_detector_model-weights_manifest.json');
      const animation = async () => {
        const detections = await faceapi.detectAllFaces(
          video,
          new faceapi.TinyFaceDetectorOptions({scoreThreshold: 0.5})
        );

        if (detections.length > 0) {
          this.recentDetections.push(true);
        }
        if (detections.length === 0) {
          this.recentDetections.push(false);
        }

        if (
          this.recentDetections.filter(value => value).length >
          this.recentDetections.filter(value => !value).length
        ) {
          this.isFaceInFrame = true;
        } else {
          this.isFaceInFrame = false;
        }

        const canvas = document.getElementById('overlay') as HTMLCanvasElement;
        try {
          const detectionsForSize = faceapi.resizeResults(detections, {
            width: video.clientWidth,
            height: video.clientHeight,
          });
          canvas.width = video.clientWidth;
          canvas.height = video.clientHeight;
          faceapi.drawDetection(canvas, detectionsForSize!, {
            withScore: false, boxColor: this.frameWithFaceWasCaptured ? 'green' : 'red'
          });
        } catch (e) {

        }
        this.handleDetections(detections);

        requestAnimationFrame(animation)
      };
      requestAnimationFrame(animation);
    };
  }

  componentDidUpdate(prevProps: IProps, prevState: IState) {
    if (prevState.facesCount > 0 && this.state.facesCount === 0 && !this.isFaceInFrame) {
      this.frameWithFaceWasCaptured = false;
    }
  }

  preparePhoto = (base64String: string) => {
    base64String = base64String.replace('data:image/jpeg;', '');
    base64String = base64String.replace('base64,', 'base64:');
    return base64String;
  };

  captureAndSendToServer = () => {
    console.log('capture and send to server');
    const webcam = this.webcamRef.current;
    if (webcam === null) {
      return;
    }
    setTimeout(() => {
      const img = webcam.getScreenshot();
      this.setState({imgSrc: img});
      if (img === null) {
        return;
      }
      this.frameWithFaceWasCaptured = true;
      fetch(`${BASE_URL}/mark_employee`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          photo: this.preparePhoto(img)
        })
      })
    }, 2000);
  };

  handleDetections = (detections: faceapi.FaceDetection[]) => {
    this.setState({facesCount: detections.length});
    if (!detections.length) {
      return;
    }
    if (this.frameWithFaceWasCaptured) {
      return;
    }
    this.captureAndSendToServer();
  };

  render() {
    const { isFullScreenMode } = this.props;
    const webcam = this.webcamRef.current;
    let videoWidth = window.innerWidth;
    let videoHeight = window.innerHeight;
    if (webcam !== null) {
      const { width, height } = videoDimensions(webcam.video);
      videoWidth = width;
      videoHeight = height;
    }
    return (
      <div className={styles.FaceDetection}>
        <Webcam
          width={isFullScreenMode ? videoWidth : 1024}
          height={isFullScreenMode ? videoHeight : 768}
          style={
            isFullScreenMode ? {width: videoWidth, height: videoHeight }
              :
              {maxWidth: 1024, width: '100%', height: '100%'}
          }
          screenshotQuality={0.5}
          minScreenshotWidth={330}
          minScreenshotHeight={240}
          screenshotFormat={'image/jpeg'}
          audio={false}
          ref={this.webcamRef}
          muted={true}
        />
        <canvas id="overlay" className={styles.overlay}/>
      </div>
    )
  }
};
