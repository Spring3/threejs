import '@csstools/normalize.css';

document.body.style.setProperty('margin', 0);

export const ensureCanvasExists = () => {
  let canvas = document.querySelector('canvas');
  if (!canvas) {
    canvas = document.createElement('canvas');
    document.body.appendChild(canvas);
  }

  return canvas;
}
