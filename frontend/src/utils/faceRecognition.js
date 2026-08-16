import * as faceapi from 'face-api.js';

const MODEL_URL = '/models';
export const MATCH_THRESHOLD = 0.6;

let modelsPromise = null;

export function loadModels() {
  if (!modelsPromise) {
    modelsPromise = Promise.all([
      faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
      faceapi.nets.faceLandmark68TinyNet.loadFromUri(MODEL_URL),
      faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
    ]);
  }
  return modelsPromise;
}

export async function detectFaceDescriptor(videoEl) {
  const result = await faceapi
    .detectSingleFace(videoEl, new faceapi.TinyFaceDetectorOptions())
    .withFaceLandmarks(true)
    .withFaceDescriptor();

  return result ? Array.from(result.descriptor) : null;
}

// Plain Euclidean distance loop over the two 128-value face descriptors —
// smaller distance means the two faces are more likely the same person.
export function calculateEuclideanDistance(descriptorA, descriptorB) {
  let sumOfSquares = 0;
  for (let i = 0; i < descriptorA.length; i++) {
    const diff = descriptorA[i] - descriptorB[i];
    sumOfSquares += diff * diff;
  }
  return Math.sqrt(sumOfSquares);
}
