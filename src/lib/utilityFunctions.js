export const getSvgHtmlForDownload = () => {
  const svg = document.getElementById('svg').cloneNode(true);
  svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');

  for (let frameRect of svg.querySelectorAll('.frame-rect')) {
    frameRect.setAttribute('x', '' + parseFloat(frameRect.style.getPropertyValue('--left')));
    frameRect.setAttribute('y', '' + parseFloat(frameRect.style.getPropertyValue('--top')));
    frameRect.style.removeProperty('--left');
    frameRect.style.removeProperty('--top');
  }

  return svg;
};

export const download = (href, filename, urlToRevoke = href) => {
  let downloadLink = document.createElement('a');
  downloadLink.href = href;
  downloadLink.download = filename;
  downloadLink.click();
  URL.revokeObjectURL(urlToRevoke);
};

export const downloadImageFromBlob = (blobUrl, imageDetails) => {
  const image = new Image();
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

    download(canvas.toDataURL(imageDetails.type), `collage.${imageDetails.type.split('/')[1]}`, blobUrl);
  };
  image.src = blobUrl;
};