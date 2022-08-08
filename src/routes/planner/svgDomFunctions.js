// I tried to modify the svg mask in a more declarative way in Mat.svelte, but it didn't work.
// So, we're stuck with this.

export const updateMaskLayer = id => {
  let svgMaskRect = document.getElementById(`frame-rect-${id}`);
  const svgMask = document.getElementById('svg-image-mask');
  const svgImageBoundingBox = document.getElementById('svg-image').getBoundingClientRect();

  const frameElement = document.getElementById(`frame-${id}`);
  const frameBoundingBox = frameElement.getBoundingClientRect();
  const frameBorderWidth = Number.parseInt(window.getComputedStyle(frameElement).borderWidth);

  const scale = 2484 / svgImageBoundingBox.width; // viewBox pixels per real pixel
  const x = Math.round(frameBoundingBox.x - svgImageBoundingBox.x);
  const y = Math.round(frameBoundingBox.y - svgImageBoundingBox.y);

  if (svgMaskRect === null) {
    svgMaskRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    svgMaskRect.setAttribute('fill', 'black');
    svgMaskRect.setAttribute('id', `frame-rect-${id}`);
    svgMaskRect.setAttribute('class', 'frame-rect');
    svgMaskRect.setAttribute('data-id', id);
    svgMask.appendChild(svgMaskRect);
  }

  svgMaskRect.setAttribute('x', scale * (x + frameBorderWidth));
  svgMaskRect.setAttribute('y', scale * (y + frameBorderWidth));
  svgMaskRect.setAttribute('width', scale * (frameBoundingBox.width - 2*frameBorderWidth));
  svgMaskRect.setAttribute('height', scale * (frameBoundingBox.height - 2*frameBorderWidth));
};

export const removeMaskLayer = id => {
  document.getElementById(`frame-rect-${id}`).remove();
};

export const updateAllMaskLayers = () => {
  const svgMaskRects = document.getElementsByClassName('frame-rect');
  for (let r of svgMaskRects) {
    updateMaskLayer(r.getAttribute('data-id'));
  }
};