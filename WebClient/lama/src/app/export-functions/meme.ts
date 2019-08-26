export function createMem(
  base64Image: string,
  upText: string,
  downText: string,
  colorPicker: string
) {
  const offScreenCanvas = document.createElement('canvas');
  const offScreenCanvasCtx = offScreenCanvas.getContext('2d');

  const img = new Image();
  img.src = base64Image;

  offScreenCanvas.height = img.height;
  offScreenCanvas.width = img.width;
  offScreenCanvasCtx.textAlign = 'center';
  offScreenCanvasCtx.drawImage(img, 0, 0);
  const fontSize = getFontSize(img.width);
  offScreenCanvasCtx.font = `bold ${fontSize}px Segoi`;
  offScreenCanvasCtx.fillStyle = colorPicker;
  offScreenCanvasCtx.strokeStyle = invertColor(colorPicker);
  offScreenCanvasCtx.lineWidth = 8;
  writeText(
    offScreenCanvasCtx,
    upText,
    img.width / 2,
    img.height / 8,
    fontSize
  );
  const bottomHeight = img.height - (img.height / 8 - fontSize / 2);
  writeText(
    offScreenCanvasCtx,
    downText,
    img.width / 2,
    bottomHeight,
    fontSize
  );
  return offScreenCanvas.toDataURL('image/jpeg', 100);
}

function findMiddleBySpace(text: string) {
  let middle = Math.floor(text.length / 2);
  const before = text.lastIndexOf(' ', middle);
  const after = text.indexOf(' ', middle + 1);
  console.log(middle + ' ' + before + ' ' + after);
  if (before === -1 && after === -1) {
    return middle;
  }
  if (middle - before < after - middle) {
    middle = before;
  } else {
    middle = after;
  }
  return middle;
}

function writeInTwoColumns(
  canvas: CanvasRenderingContext2D,
  text: string,
  centerPoint: number,
  height: number,
  fontSize: number
) {
  const middle = findMiddleBySpace(text);
  const str1 = text.substr(0, middle);
  const str2 = text.substr(middle + 1);
  canvas.strokeText(str1.toUpperCase(), centerPoint, height);
  canvas.fillText(str1.toUpperCase(), centerPoint, height);
  canvas.strokeText(str1.toUpperCase(), centerPoint, height + fontSize + 10);
  canvas.fillText(str2.toUpperCase(), centerPoint, height + fontSize + 10);
}

function writeText(
  canvas: CanvasRenderingContext2D,
  text: string,
  centerPoint: number,
  height: number,
  fontSize: number
) {
  if (!text) {
    return;
  }
  if (text.length > 25) {
    writeInTwoColumns(canvas, text, centerPoint, height, fontSize);
  } else {
    canvas.strokeText(text.toUpperCase(), centerPoint, height);
    canvas.fillText(text.toUpperCase(), centerPoint, height);
  }
}

function getFontSize(width: number) {
  return width / 15;
}

export function invertColor(hex: string) {
  if (hex.indexOf('#') === 0) {
    hex = hex.slice(1);
  }
  if (hex.length === 3) {
    hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
  }
  if (hex.length !== 6) {
    throw new Error('Invalid HEX color.');
  }
  const r = (255 - parseInt(hex.slice(0, 2), 16)).toString(16);
  const g = (255 - parseInt(hex.slice(2, 4), 16)).toString(16);
  const b = (255 - parseInt(hex.slice(4, 6), 16)).toString(16);
  return (
    '#' + padZero(r, r.length) + padZero(g, r.length) + padZero(b, r.length)
  );
}

function padZero(str: string, len: number) {
  len = len || 2;
  const zeros = new Array(len).join('0');
  return (zeros + str).slice(-len);
}
