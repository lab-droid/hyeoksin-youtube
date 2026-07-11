export function getAudioDuration(url: string): Promise<number> {
  return new Promise((resolve) => {
    const audio = new Audio();
    audio.src = url;
    const onLoaded = () => {
      resolve(isFinite(audio.duration) && audio.duration > 0 ? audio.duration : 5);
      cleanup();
    };
    const onError = () => {
      resolve(5);
      cleanup();
    };
    const cleanup = () => {
      audio.removeEventListener('loadedmetadata', onLoaded);
      audio.removeEventListener('error', onError);
    };
    audio.addEventListener('loadedmetadata', onLoaded);
    audio.addEventListener('error', onError);
  });
}

function formatSRTTime(totalSeconds: number): string {
  const h = Math.floor(totalSeconds / 3600).toString().padStart(2, '0');
  const m = Math.floor((totalSeconds % 3600) / 60).toString().padStart(2, '0');
  const s = Math.floor(totalSeconds % 60).toString().padStart(2, '0');
  const ms = Math.round((totalSeconds - Math.floor(totalSeconds)) * 1000).toString().padStart(3, '0');
  return `${h}:${m}:${s},${ms}`;
}

export function buildSRT(cuts: Array<{ text: string; audioDuration?: number }>): string {
  let srt = '';
  let time = 0;
  cuts.forEach((cut, i) => {
    const dur = cut.audioDuration || 4;
    const start = formatSRTTime(time);
    time += dur;
    const end = formatSRTTime(time);
    srt += `${i + 1}\n${start} --> ${end}\n${cut.text}\n\n`;
  });
  return srt;
}

export function buildChapters(cuts: Array<{ text: string; audioDuration?: number }>): string {
  let time = 0;
  const lines: string[] = [];
  cuts.forEach((cut) => {
    const m = Math.floor(time / 60).toString().padStart(2, '0');
    const s = Math.floor(time % 60).toString().padStart(2, '0');
    const label = cut.text.length > 20 ? `${cut.text.slice(0, 20)}...` : cut.text;
    lines.push(`${m}:${s} ${label}`);
    time += cut.audioDuration || 4;
  });
  return lines.join('\n');
}

export function getWordList(text: string): string[] {
  return text.split(/\s+/).filter(Boolean);
}

// Weighted by character length so longer words hold the highlight longer.
export function getActiveWordIndex(words: string[], currentTime: number, totalDuration: number): number {
  if (words.length === 0 || totalDuration <= 0) return -1;
  const weights = words.map(w => Math.max(w.length, 1));
  const totalWeight = weights.reduce((a, b) => a + b, 0);
  let acc = 0;
  for (let i = 0; i < words.length; i++) {
    const segDuration = (weights[i] / totalWeight) * totalDuration;
    if (currentTime < acc + segDuration || i === words.length - 1) return i;
    acc += segDuration;
  }
  return words.length - 1;
}

interface CaptionWord {
  word: string;
  idx: number;
  w: number;
}

export function drawWrappedCaption(
  ctx: CanvasRenderingContext2D,
  words: string[],
  activeIndex: number,
  centerX: number,
  centerY: number,
  maxWidth: number,
  fontSize: number
) {
  ctx.font = `bold ${fontSize}px sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  const spaceWidth = ctx.measureText(' ').width;

  const lines: CaptionWord[][] = [[]];
  let lineWidth = 0;
  words.forEach((word, i) => {
    const w = ctx.measureText(word).width;
    const currentLine = lines[lines.length - 1];
    if (lineWidth + w > maxWidth && currentLine.length > 0) {
      lines.push([]);
      lineWidth = 0;
    }
    lines[lines.length - 1].push({ word, idx: i, w });
    lineWidth += w + spaceWidth;
  });

  const lineHeight = fontSize * 1.35;
  const totalHeight = lines.length * lineHeight;
  let y = centerY - totalHeight / 2 + lineHeight / 2;

  ctx.lineWidth = fontSize * 0.15;
  ctx.strokeStyle = 'rgba(0,0,0,0.85)';
  ctx.lineJoin = 'round';

  lines.forEach((line) => {
    const totalLineWidth = line.reduce((a, b) => a + b.w, 0) + spaceWidth * (line.length - 1);
    let x = centerX - totalLineWidth / 2;
    line.forEach(({ word, idx, w }) => {
      const cx = x + w / 2;
      ctx.fillStyle = idx === activeIndex ? '#fde047' : '#ffffff';
      ctx.strokeText(word, cx, y);
      ctx.fillText(word, cx, y);
      x += w + spaceWidth;
    });
    y += lineHeight;
  });
}

export interface KenBurnsRect {
  sx: number;
  sy: number;
  sw: number;
  sh: number;
}

// Computes a source crop rect (in image pixel space) that slowly zooms/pans,
// producing a "cover"-style Ken Burns effect when drawn onto the destination canvas.
export function computeKenBurnsRect(
  imgWidth: number,
  imgHeight: number,
  canvasWidth: number,
  canvasHeight: number,
  progress: number,
  variant: 0 | 1
): KenBurnsRect {
  const canvasRatio = canvasWidth / canvasHeight;
  const imgRatio = imgWidth / imgHeight;

  let baseW: number;
  let baseH: number;
  if (imgRatio > canvasRatio) {
    baseH = imgHeight;
    baseW = imgHeight * canvasRatio;
  } else {
    baseW = imgWidth;
    baseH = imgWidth / canvasRatio;
  }

  const zoomStart = variant === 0 ? 1.0 : 1.12;
  const zoomEnd = variant === 0 ? 1.12 : 1.0;
  const zoom = zoomStart + (zoomEnd - zoomStart) * Math.min(Math.max(progress, 0), 1);

  const sw = baseW / zoom;
  const sh = baseH / zoom;

  const maxOffsetX = (imgWidth - sw) / 2;
  const maxOffsetY = (imgHeight - sh) / 2;
  const panX = variant === 0 ? -maxOffsetX + progress * maxOffsetX * 0.6 : maxOffsetX - progress * maxOffsetX * 0.6;

  const sx = Math.min(Math.max((imgWidth - sw) / 2 + panX, 0), imgWidth - sw);
  const sy = Math.min(Math.max((imgHeight - sh) / 2 - maxOffsetY * 0.2, 0), imgHeight - sh);

  return { sx, sy, sw, sh };
}
