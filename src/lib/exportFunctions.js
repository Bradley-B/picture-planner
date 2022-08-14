import JSZip from 'jszip';

export const getBase64String = dataUrl => {
  return dataUrl.substring(dataUrl.indexOf('base64,') + 'base64,'.length);
};

export const getSvgForDownload = () => {
  const svg = document.getElementById('svg').cloneNode(true);
  svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');

  for (let frameRect of svg.querySelectorAll('.frame-rect')) {
    frameRect.setAttribute('x', '' + parseFloat(frameRect.style.getPropertyValue('--left')));
    frameRect.setAttribute('y', '' + parseFloat(frameRect.style.getPropertyValue('--top')));
    frameRect.style.removeProperty('--left');
    frameRect.style.removeProperty('--top');
  }

  const blob = new Blob([svg.outerHTML],{ type: 'image/svg+xml;charset=utf-8' });
  return URL.createObjectURL(blob);
};

export const download = (href, filename, urlToRevoke = href) => {
  let downloadLink = document.createElement('a');
  downloadLink.href = href;
  downloadLink.download = filename;
  downloadLink.click();
  URL.revokeObjectURL(urlToRevoke);
};

export const getCanvasFromBlob = (blobUrl, imageDetails) => {
  const image = new Image();
  return new Promise(resolve => {
    image.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = imageDetails.sourceWidth;
      canvas.height = imageDetails.sourceHeight;

      const context = canvas.getContext('2d');
      if (/image\/jpe?g$/.test(imageDetails.type)) {
        context.fillStyle = 'white';
        context.fillRect(0, 0, imageDetails.sourceWidth, imageDetails.sourceHeight);
      }
      context.drawImage(image, 0, 0, imageDetails.sourceWidth, imageDetails.sourceHeight);
      resolve([canvas, context]);
    };
    image.src = blobUrl;
  });
};

export const generateCollectionZip = (framesById, imageDetails, settings, sourceCanvasContext) => {
  const destinationCanvas = document.createElement('canvas');
  const destinationCanvasContext = destinationCanvas.getContext('2d');
  const jsZip = new JSZip();
  const imagesFolder = jsZip.folder('collage-images');

  for (let frame of Object.values(framesById)) {
    const scale = imageDetails.sourceWidth / imageDetails.displayBoundingBox.width;
    const left = scale * (frame.left - imageDetails.displayBoundingBox.x + settings.frameBorderWidth);
    const top = scale * (frame.top - imageDetails.displayBoundingBox.y + settings.frameBorderWidth);
    const width = frame.width * scale;
    const height = frame.height * scale;

    const imageData = sourceCanvasContext.getImageData(left, top, width, height);

    destinationCanvas.width = width;
    destinationCanvas.height = height;
    destinationCanvasContext.putImageData(imageData, 0, 0);

    imagesFolder.file(
      `${frame.widthInches}x${frame.heightInches}-${frame.id}.${imageDetails.type.split('/')[1]}`,
      getBase64String(destinationCanvas.toDataURL(imageDetails.type)),
      { base64: true }
    );
  }
  return jsZip.generateAsync({ type: 'blob' });
};