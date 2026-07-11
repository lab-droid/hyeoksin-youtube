import { GoogleGenAI, Type, Modality } from '@google/genai';

export type Ratio = '16:9' | '1:1' | '3:4' | '9:16';
export type Style = '실제 사진' | '귀여운 졸라맨' | '미니멀 인포그래픽' | '일본 애니메이션' | '영화 스틸컷' | '사이버펑크 네온' | '수채화 동화' | '레트로 픽셀아트' | '다크 판타지' | '3D 픽사 애니메이션' | '시네마틱 브이로그' | '빈티지 필름' | '참고이미지 톤앤매너';
export type Voice = 'Kore' | 'Puck' | 'Charon' | 'Fenrir' | 'Zephyr' | 'Aoede' | 'Leda' | 'Orion' | 'Lyra';
export type CharacterEthnicity = '선택 안함' | '한국인' | '서양인(백인)' | '서양인(흑인)';
export type CharacterAge = '선택 안함' | '10세 미만' | '10대' | '20대' | '30대' | '40대' | '50대' | '60대' | '70대';
export type CharacterGender = '선택 안함' | '남자' | '여자';

export interface Cut {
  id: string;
  text: string;
  imagePrompt: string;
  videoPrompt: string;
  emotion?: string;
  imageUrl?: string;
  videoUrl?: string;
  audioUrl?: string;
  audioDuration?: number;
  isGeneratingImage?: boolean;
  isGeneratingVideo?: boolean;
  isGeneratingAudio?: boolean;
}

export interface ScriptMeta {
  characterSheet: string;
  titles: string[];
  description: string;
  tags: string[];
  thumbnailPrompt: string;
  thumbnailTexts: string[];
}

export interface RawCut {
  text: string;
  imagePrompt: string;
  videoPrompt: string;
  emotion: string;
}

export interface ScriptResult {
  meta: ScriptMeta;
  cuts: RawCut[];
}

let customApiKey = typeof window !== 'undefined' ? localStorage.getItem('GEMINI_API_KEY') || '' : '';

export const setCustomApiKey = (key: string) => {
  customApiKey = key;
  if (typeof window !== 'undefined') {
    localStorage.setItem('GEMINI_API_KEY', key);
  }
};

const getAi = () => new GoogleGenAI({ apiKey: customApiKey || process.env.API_KEY || process.env.GEMINI_API_KEY });

async function withRetry<T>(operation: () => Promise<T>, maxRetries = 5, delayMs = 3000): Promise<T> {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error: any) {
      if (attempt === maxRetries) throw error;

      const errorMessage = error?.message || String(error);
      const isRetryable =
        error?.status === 503 ||
        errorMessage.includes('503') ||
        errorMessage.includes('high demand') ||
        errorMessage.includes('UNAVAILABLE') ||
        error?.status === 429 ||
        errorMessage.includes('429') ||
        errorMessage.includes('quota') ||
        error?.status === 500 ||
        errorMessage.includes('500') ||
        errorMessage.includes('Internal error');

      if (!isRetryable) throw error;

      console.warn(`Attempt ${attempt} failed. Retrying in ${delayMs * attempt}ms...`, errorMessage);
      await new Promise(resolve => setTimeout(resolve, delayMs * attempt)); // Exponential backoff
    }
  }
  throw new Error('Max retries reached');
}

const scriptResponseSchema = {
  type: Type.OBJECT,
  properties: {
    characterSheet: { type: Type.STRING },
    cuts: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          text: { type: Type.STRING },
          imagePrompt: { type: Type.STRING },
          videoPrompt: { type: Type.STRING },
          emotion: { type: Type.STRING },
        },
        required: ['text', 'imagePrompt', 'videoPrompt', 'emotion'],
      },
    },
    titles: { type: Type.ARRAY, items: { type: Type.STRING } },
    description: { type: Type.STRING },
    tags: { type: Type.ARRAY, items: { type: Type.STRING } },
    thumbnailPrompt: { type: Type.STRING },
    thumbnailTexts: { type: Type.ARRAY, items: { type: Type.STRING } },
  },
  required: ['characterSheet', 'cuts', 'titles', 'description', 'tags', 'thumbnailPrompt', 'thumbnailTexts'],
};

function buildRetentionInstruction(topic: string, duration: number, ratio: string, style: string, characterInstruction: string): string {
  const isShortForm = duration <= 60;
  const suggestedCuts = Math.max(3, Math.round(duration / 6));

  return `당신은 유튜브 알고리즘과 시청 지속률(리텐션) 설계에 정통한 콘텐츠 디렉터입니다.
"${topic}"에 대한 유튜브 ${isShortForm ? '쇼츠' : '롱폼'} 영상 대본을 작성하세요.

[영상 정보]
- 총 길이: 약 ${duration}초
- 스타일: "${style}"
- 화면 비율: ${ratio}
${characterInstruction}

[리텐션 설계 규칙 - 반드시 준수]
1. 컷 수는 약 ${suggestedCuts}개 내외로, 각 컷의 내레이션은 4~8초 분량(한국어 기준 12~24음절)이 되도록 나누세요.
2. 첫 번째 컷(훅)은 인사말이나 자기소개 없이, 2초 안에 시청자의 스와이프/이탈을 막는 문장이어야 합니다 (충격적 사실, 반전, 강한 질문, 결론 먼저 제시 중 하나를 사용).
3. 중반부는 오픈 루프(예: "그런데 진짜 이유는 따로 있습니다", "하지만 3번째가 진짜 문제입니다")를 최소 1회 사용해 다음 컷을 궁금하게 만드세요.
4. 각 컷의 imagePrompt는 바로 이전 컷과 카메라 앵글/구도/거리가 달라야 합니다 (예: 클로즈업 → 와이드샷 → 로우앵글 순서로 패턴 인터럽트를 주세요).
5. ${isShortForm
    ? '마지막 컷은 첫 번째 컷 내용과 자연스럽게 이어지는 "루프 엔딩"으로 마무리해 반복 시청을 유도하세요 (구독/좋아요 CTA 문구 대신 내용적으로 첫 컷과 연결).'
    : '마지막 컷은 다음 영상에 대한 궁금증을 유발하는 문장으로 마무리해 세션 시청 시간을 늘리세요.'}
6. 각 컷마다 emotion(내레이션 톤: excited, calm, urgent, curious, warm 등)을 지정하세요.

[캐릭터 일관성]
등장인물이 있다면 모든 컷에서 외모(얼굴, 헤어스타일, 의상)가 동일하게 유지되도록 characterSheet에 영어로 40~60단어 분량의 고정 외모 묘사를 작성하세요. 등장인물이 없는 컨셉(인포그래픽 등)이면 characterSheet는 빈 문자열로 두세요.

[업로드 최적화 - 유튜브 CTR/SEO]
- titles: 서로 다른 후킹 방식(호기심 갭형, 숫자/리스트형, 부정형, 질문형, 단정형)의 제목 5개를 한국어로, 각 40자 이내로 작성하세요.
- description: 앞 2문장에 핵심 키워드를 자연스럽게 포함한 한국어 설명문 3~4문장을 작성하세요.
- tags: 검색 및 추천 알고리즘에 도움이 되는 키워드 10~15개를 작성하세요.
- thumbnailPrompt: 강렬하고 대비가 높은 썸네일용 영어 이미지 프롬프트를 작성하세요 (클로즈업, 표정, 시선 강조. characterSheet와 스타일에 맞출 것).
- thumbnailTexts: 썸네일에 얹을 강력한 후킹 문구 2~3개를 한국어로, 2~6단어의 굵고 임팩트 있는 문구로 작성하세요.

각 컷마다 다음을 제공하세요:
1. text: 한국어 내레이션
2. imagePrompt: 스타일과 내레이션에 맞는 영어 이미지 생성 프롬프트 (characterSheet가 있다면 그 외모 묘사를 반영)
3. videoPrompt: 생성된 이미지를 어떻게 애니메이션할지 설명하는 영어 프롬프트
4. emotion: 내레이션 톤

JSON으로 반환하세요.`;
}

export async function generateScript(topic: string, duration: number, ratio: string, style: string, characterEthnicity: CharacterEthnicity, characterAge: CharacterAge, characterGender: CharacterGender, referenceImages: string[] = []): Promise<ScriptResult> {
  const ai = getAi();

  const parts: any[] = [];

  if (referenceImages.length > 0) {
    parts.push({ text: `Here are some reference images. Analyze their tone, color palette, character design, and overall style. The generated imagePrompt MUST 100% reflect this exact style and tone so the final video is perfectly consistent with these reference images.` });
    referenceImages.forEach(img => {
      const mimeType = img.split(';')[0].split(':')[1];
      const data = img.split(',')[1];
      parts.push({
        inlineData: { data, mimeType }
      });
    });
  }

  let characterInstruction = '';
  if (characterEthnicity !== '선택 안함' || characterAge !== '선택 안함' || characterGender !== '선택 안함') {
    const eth = characterEthnicity !== '선택 안함' ? characterEthnicity : 'any ethnicity';
    const age = characterAge !== '선택 안함' ? characterAge : 'any age';
    const gender = characterGender !== '선택 안함' ? characterGender : 'any gender';
    characterInstruction = `주요 등장인물 설정: ${eth}, ${age}, ${gender}. characterSheet와 imagePrompt에 이 설정을 명확히 반영하세요.`;
  }

  parts.push({ text: buildRetentionInstruction(topic, duration, ratio, style, characterInstruction) });

  const response = await withRetry(() => ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: [{ parts }],
    config: {
      responseMimeType: 'application/json',
      responseSchema: scriptResponseSchema,
    },
  }));

  const parsed = JSON.parse(response.text || '{}');
  return {
    meta: {
      characterSheet: parsed.characterSheet || '',
      titles: parsed.titles || [],
      description: parsed.description || '',
      tags: parsed.tags || [],
      thumbnailPrompt: parsed.thumbnailPrompt || '',
      thumbnailTexts: parsed.thumbnailTexts || [],
    },
    cuts: parsed.cuts || [],
  };
}

export async function oneTouchPlan(images: string[]): Promise<{ topic: string } & ScriptResult> {
  const ai = getAi();
  const parts: any[] = [];

  parts.push({ text: `당신은 유튜브 알고리즘과 시청 지속률(리텐션) 설계에 정통한 콘텐츠 디렉터입니다.
첨부된 이미지들을 분석하여 창의적인 유튜브 영상 주제(topic)와 전체 대본(cuts)을 기획하세요.

[리텐션 설계 규칙 - 반드시 준수]
1. 각 컷의 내레이션은 4~8초 분량(한국어 기준 12~24음절)으로 나누세요.
2. 첫 번째 컷(훅)은 인사말 없이, 2초 안에 이탈을 막는 강렬한 문장이어야 합니다.
3. 중반부는 오픈 루프를 최소 1회 사용하세요.
4. 각 컷의 imagePrompt는 이전 컷과 카메라 앵글/구도가 달라야 합니다.
5. 마지막 컷은 첫 번째 컷과 자연스럽게 이어지는 루프 엔딩으로 마무리하세요.
6. 각 컷마다 emotion을 지정하세요.

[캐릭터 일관성]
이미지 속 인물/캐릭터가 있다면 characterSheet에 영어로 40~60단어의 고정 외모 묘사를 작성하세요.

[업로드 최적화]
titles(5개, 한국어, 서로 다른 후킹 방식), description(한국어 3~4문장, 앞 2문장에 키워드 포함), tags(10~15개), thumbnailPrompt(영어, 강렬한 썸네일용), thumbnailTexts(한국어 2~6단어 문구 2~3개)를 작성하세요.

topic과 각 컷의 text는 한국어로, imagePrompt/videoPrompt/thumbnailPrompt/characterSheet는 영어로 작성하세요. JSON으로 반환하세요.` });

  images.forEach(img => {
    const mimeType = img.split(';')[0].split(':')[1];
    const data = img.split(',')[1];
    parts.push({
      inlineData: { data, mimeType }
    });
  });

  const response = await withRetry(() => ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: [{ parts }],
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          topic: { type: Type.STRING },
          ...scriptResponseSchema.properties,
        },
        required: ['topic', ...scriptResponseSchema.required],
      }
    }
  }));

  const parsed = JSON.parse(response.text || '{}');
  return {
    topic: parsed.topic || '',
    meta: {
      characterSheet: parsed.characterSheet || '',
      titles: parsed.titles || [],
      description: parsed.description || '',
      tags: parsed.tags || [],
      thumbnailPrompt: parsed.thumbnailPrompt || '',
      thumbnailTexts: parsed.thumbnailTexts || [],
    },
    cuts: parsed.cuts || [],
  };
}

export async function generateAudio(text: string, voiceName: string, emotion?: string) {
  const ai = getAi();
  const toneInstruction = emotion ? `Speak in a ${emotion} tone. ` : '';
  const response = await withRetry(() => ai.models.generateContent({
    model: 'gemini-2.5-flash-preview-tts',
    contents: [{ parts: [{ text: `${toneInstruction}Say in Korean: ${text}` }] }],
    config: {
      responseModalities: [Modality.AUDIO],
      speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName } } },
    },
  }));

  const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
  if (base64Audio) return pcmBase64ToWavUrl(base64Audio);
  throw new Error('Failed to generate audio');
}

export async function generateImage(prompt: string, ratio: string, referenceImages: string[] = [], characterSheet?: string) {
  const ai = getAi();
  let aspectRatio = ratio;
  if (!["1:1", "3:4", "4:3", "9:16", "16:9", "1:4", "1:8", "4:1", "8:1"].includes(ratio)) aspectRatio = "16:9";

  const parts: any[] = [];

  if (characterSheet) {
    parts.push({ text: `Maintain this exact character appearance across the image so it stays consistent with other shots: ${characterSheet}` });
  }

  if (referenceImages.length > 0) {
    parts.push({ text: 'Use the following reference image(s) to keep the character/subject appearance and art style perfectly consistent with this new image.' });
    referenceImages.forEach(img => {
      const mimeType = img.split(';')[0].split(':')[1];
      const data = img.split(',')[1];
      parts.push({
        inlineData: { data, mimeType }
      });
    });
  }

  parts.push({ text: prompt });

  const response = await withRetry(() => ai.models.generateContent({
    model: 'gemini-3-pro-image-preview',
    contents: [{ parts }],
    config: { imageConfig: { aspectRatio: aspectRatio as any, imageSize: "1K" } },
  }));

  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) return `data:image/png;base64,${part.inlineData.data}`;
  }
  throw new Error('Failed to generate image');
}

export async function generateVideo(imageUri: string, prompt: string, ratio: string, referenceImages: string[] = []) {
  const ai = getAi();
  const mimeType = imageUri.split(';')[0].split(':')[1] || 'image/png';
  const base64Data = imageUri.split(',')[1];
  let aspectRatio = ratio === '9:16' ? '9:16' : '16:9';
  let resolution = '720p'; // Use 720p for better compatibility with image-to-video generation

  const safePrompt = prompt && prompt.trim() !== '' ? prompt : 'A beautiful scene with subtle motion';

  // We use veo-3.1-fast-generate-preview with the generated image as the starting frame.
  // We do not pass referenceImages here because the generated image already reflects the style,
  // and passing both image and referenceImages can cause 500 Internal Errors.
  let operation = await withRetry(async () => {
    return await ai.models.generateVideos({
      model: 'veo-3.1-fast-generate-preview',
      prompt: safePrompt,
      image: { imageBytes: base64Data, mimeType: mimeType },
      config: {
        numberOfVideos: 1,
        resolution: resolution as any,
        aspectRatio: aspectRatio as any
      },
    });
  }, 3, 5000);

  while (!operation.done) {
    await new Promise(resolve => setTimeout(resolve, 10000));
    operation = await withRetry(() => ai.operations.getVideosOperation({ operation }));
  }

  if (operation.error) {
    console.error('Video generation operation error:', operation.error);
    throw new Error(`Video generation failed: ${operation.error.message || JSON.stringify(operation.error)}`);
  }

  const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
  if (!downloadLink) {
    console.error('Operation done but no download link:', operation);
    throw new Error('Failed to generate video: No download link in response');
  }

  const apiKey = customApiKey || process.env.API_KEY || process.env.GEMINI_API_KEY;
  const response = await withRetry(async () => {
    const res = await fetch(downloadLink, { headers: { 'x-goog-api-key': apiKey! } });
    if (!res.ok) throw new Error(`Failed to fetch video: ${res.status} ${res.statusText}`);
    return res;
  });
  const blob = await response.blob();
  return URL.createObjectURL(blob);
}

function pcmBase64ToWavUrl(base64: string, sampleRate: number = 24000): string {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) bytes[i] = binaryString.charCodeAt(i);

  const buffer = bytes.buffer;
  const wavBuffer = encodeWAV(new Int16Array(buffer), sampleRate);
  const blob = new Blob([wavBuffer], { type: 'audio/wav' });
  return URL.createObjectURL(blob);
}

function encodeWAV(samples: Int16Array, sampleRate: number) {
  const buffer = new ArrayBuffer(44 + samples.length * 2);
  const view = new DataView(buffer);
  const writeString = (view: DataView, offset: number, string: string) => {
    for (let i = 0; i < string.length; i++) view.setUint8(offset + i, string.charCodeAt(i));
  };

  writeString(view, 0, 'RIFF');
  view.setUint32(4, 36 + samples.length * 2, true);
  writeString(view, 8, 'WAVE');
  writeString(view, 12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  writeString(view, 36, 'data');
  view.setUint32(40, samples.length * 2, true);

  let offset = 44;
  for (let i = 0; i < samples.length; i++, offset += 2) view.setInt16(offset, samples[i], true);
  return view;
}
