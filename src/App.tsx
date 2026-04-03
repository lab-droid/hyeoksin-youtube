/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, ChangeEvent } from 'react';
import { Loader2, Sparkles, Play, Image as ImageIcon, Video, RefreshCw, CheckSquare, Square, Download, Mic, Check, Youtube, HelpCircle, PlusCircle, X } from 'lucide-react';
import { generateScript, oneTouchPlan, generateAudio, generateImage, generateVideo, Cut, Ratio, Style, Voice, CharacterEthnicity, CharacterAge, CharacterGender, setCustomApiKey } from './lib/api';

function ApiKeyModal({ isOpen, onClose, onKeySelected, currentKey }: { isOpen: boolean, onClose: () => void, onKeySelected: (key: string) => void, currentKey: string }) {
  const [manualKey, setManualKey] = useState(currentKey);

  useEffect(() => {
    if (isOpen) {
      setManualKey(currentKey);
    }
  }, [isOpen, currentKey]);

  if (!isOpen) return null;

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualKey.trim()) {
      setCustomApiKey(manualKey.trim());
      onKeySelected(manualKey.trim());
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-zinc-900 p-8 rounded-2xl max-w-md w-full text-center border border-white/10 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-zinc-400 hover:text-white">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>
        <h2 className="text-2xl font-bold text-white mb-4">API 키 설정</h2>
        <p className="text-zinc-400 mb-6 text-sm">
          고품질 이미지 및 영상 생성을 위해 Google Gemini API 키를 입력해주세요.
        </p>

        <form onSubmit={handleManualSubmit} className="space-y-3">
          <input
            type="password"
            value={manualKey}
            onChange={(e) => setManualKey(e.target.value)}
            placeholder="AIzaSy..."
            className="w-full bg-zinc-950 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
          />
          <button
            type="submit"
            disabled={!manualKey.trim()}
            className="w-full bg-red-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-red-500 transition disabled:opacity-50"
          >
            API 키 저장
          </button>
        </form>
        <p className="mt-4 text-xs text-zinc-500">
          입력하신 키는 브라우저 로컬 스토리지에만 안전하게 저장됩니다.
        </p>
      </div>
    </div>
  );
}

function ApiCostModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-zinc-900 p-8 rounded-2xl max-w-2xl w-full border border-white/10 relative shadow-2xl max-h-[90vh] flex flex-col">
        <button onClick={onClose} className="absolute top-4 right-4 text-zinc-400 hover:text-white transition-colors">
          <X className="w-6 h-6" />
        </button>
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
          <span className="text-emerald-500">💰</span> API 비용 안내
        </h2>
        <div className="space-y-6 text-zinc-300 text-sm leading-relaxed overflow-y-auto pr-2 flex-1 custom-scrollbar">
          
          <div className="bg-zinc-800/50 p-4 rounded-xl border border-white/5">
            <h3 className="text-lg font-semibold text-white mb-4">생성 결과물별 예상 소모 비용</h3>
            
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-emerald-400 mb-1">🟢 대본(스크립트) 기획안만 생성</h4>
                <p className="text-zinc-400">Gemini 3.1 Pro 모델 사용. 텍스트 프롬프트 입력 및 대본 출력.</p>
                <p className="font-semibold text-white mt-1">예상 비용: 약 10원 / 건</p>
              </div>
              
              <div>
                <h4 className="font-medium text-yellow-400 mb-1">🟡 숏폼(Shorts)용 5컷짜리 '이미지+음성' 영상 제작</h4>
                <p className="text-zinc-400">대본 생성 + 음성 5번 + 이미지 5장 생성.</p>
                <p className="font-semibold text-white mt-1">예상 비용: 약 215원 / 건</p>
              </div>

              <div>
                <h4 className="font-medium text-orange-400 mb-1">🟠 숏폼용 5컷짜리 '고품질 비디오+음성' 영상 제작</h4>
                <p className="text-zinc-400">대본 생성 + 음성 5번 + 이미지 5장 + 비디오 5클립 생성 (Veo 3.1).</p>
                <p className="font-semibold text-white mt-1">예상 비용: 약 715원 / 건</p>
              </div>

              <div>
                <h4 className="font-medium text-red-400 mb-1">🔴 롱폼 10분 분량 '고품질 비디오+음성' 영상 제작</h4>
                <p className="text-zinc-400">대본 생성 + 음성 100번 + 이미지 100장 + 비디오 100클립 생성 (약 100컷 기준).</p>
                <p className="font-semibold text-white mt-1">예상 비용: 약 14,000원 ~ 17,000원 / 건</p>
              </div>

              <div>
                <h4 className="font-medium text-purple-400 mb-1">🔥 롱폼 20분 분량 '고품질 비디오+음성' 영상 제작</h4>
                <p className="text-zinc-400">대본 생성 + 음성 200번 + 이미지 200장 + 비디오 200클립 생성 (약 200컷 기준).</p>
                <p className="font-semibold text-white mt-1">예상 비용: 약 28,000원 ~ 34,000원 / 건</p>
              </div>
            </div>
          </div>

          <div className="bg-indigo-500/10 p-4 rounded-xl border border-indigo-500/20">
            <h3 className="text-lg font-semibold text-indigo-300 mb-2">💡 비용 최적화 팁</h3>
            <ul className="list-disc list-inside text-indigo-200/80 space-y-1 ml-2">
              <li>모든 컷을 비디오로 만들면 비용이 크게 증가합니다. 필요한 컷만 비디오로 생성하세요.</li>
              <li>이미지와 음성만으로 구성된 슬라이드쇼 형태의 영상을 제작하면 비용을 1/5 수준으로 절감할 수 있습니다.</li>
            </ul>
          </div>

        </div>
      </div>
    </div>
  );
}

function RenderingModal({ isOpen, progress }: { isOpen: boolean, progress: number }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-[100] p-4 backdrop-blur-sm">
      <div className="bg-zinc-900 p-10 rounded-3xl max-w-md w-full text-center border border-white/10 shadow-2xl animate-in zoom-in-95 duration-300">
        <div className="relative w-24 h-24 mx-auto mb-8">
          <div className="absolute inset-0 rounded-full border-4 border-zinc-800" />
          <div 
            className="absolute inset-0 rounded-full border-4 border-indigo-500 border-t-transparent animate-spin" 
            style={{ animationDuration: '2s' }}
          />
          <div className="absolute inset-0 flex items-center justify-center text-2xl font-bold text-white">
            {progress}%
          </div>
        </div>
        
        <h2 className="text-2xl font-bold text-white mb-3">영상 렌더링 중...</h2>
        <p className="text-zinc-400 mb-8 text-sm leading-relaxed">
          고화질 영상을 병합하여 MP4 파일로 변환하고 있습니다.<br />
          영상의 길이에 따라 몇 분 정도 소요될 수 있으니,<br />
          <span className="text-indigo-400 font-semibold">브라우저 창을 닫지 말고 기다려주세요.</span>
        </p>
        
        <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden mb-2">
          <div 
            className="bg-indigo-500 h-full transition-all duration-500 ease-out shadow-[0_0_10px_rgba(99,102,241,0.5)]"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex justify-between text-[10px] text-zinc-500 font-medium uppercase tracking-wider">
          <span>Processing</span>
          <span>Finalizing</span>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [hasKey, setHasKey] = useState(false);
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [isApiCostModalOpen, setIsApiCostModalOpen] = useState(false);
  const [currentApiKey, setCurrentApiKey] = useState('');

  useEffect(() => {
    const storedKey = localStorage.getItem('GEMINI_API_KEY');
    if (storedKey) {
      setCustomApiKey(storedKey);
      setCurrentApiKey(storedKey);
      setHasKey(true);
    }
  }, []);

  const handleKeySelected = (key: string) => {
    setCurrentApiKey(key);
    setHasKey(true);
  };

  const [ratio, setRatio] = useState<Ratio>('16:9');
  const [style, setStyle] = useState<Style>('실제 사진');
  const [characterEthnicity, setCharacterEthnicity] = useState<CharacterEthnicity>('선택 안함');
  const [characterAge, setCharacterAge] = useState<CharacterAge>('선택 안함');
  const [characterGender, setCharacterGender] = useState<CharacterGender>('선택 안함');
  const [topic, setTopic] = useState('');
  const [duration, setDuration] = useState<number>(30);
  const [cuts, setCuts] = useState<Cut[]>([]);
  const [voice, setVoice] = useState<Voice>('Kore');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPlanning, setIsPlanning] = useState(false);
  const [isRendering, setIsRendering] = useState(false);
  const [renderingProgress, setRenderingProgress] = useState(0);
  const [previewing, setPreviewing] = useState(false);
  const [includeSubtitles, setIncludeSubtitles] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentCutIndex, setCurrentCutIndex] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const isPlayingRef = useRef(isPlaying);
  const currentCutIndexRef = useRef(currentCutIndex);

  useEffect(() => {
    isPlayingRef.current = isPlaying;
    currentCutIndexRef.current = currentCutIndex;
  }, [isPlaying, currentCutIndex]);

  const [currentStep, setCurrentStep] = useState(1);
  const [isAutoGenerating, setIsAutoGenerating] = useState(false);
  const [autoProgress, setAutoProgress] = useState(0);
  const [autoStatusText, setAutoStatusText] = useState('');
  const [referenceImages, setReferenceImages] = useState<string[]>([]);
  const [isManualGenerating, setIsManualGenerating] = useState(false);
  const [toast, setToast] = useState<{ message: string, type: 'error' | 'info' | 'success' } | null>(null);

  const showToast = (message: string, type: 'error' | 'info' | 'success' = 'info') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 5000);
  };

  const handleManualProceed = async () => {
    if (!hasKey) {
      setIsApiKeyModalOpen(true);
      return;
    }
    if (!topic) {
      showToast('주제를 입력해주세요.', 'error');
      return;
    }

    setIsManualGenerating(true);
    setAutoProgress(0);
    try {
      if (currentStep === 1) {
        // Step 1 -> 2: Generate Script
        setAutoStatusText('대본 생성 중...');
        await handleGenerateScript();
      } else if (currentStep === 2) {
        // Step 2 -> 3: Generate All Audios
        setAutoStatusText('모든 컷의 음성을 생성합니다...');
        const newCuts = [...cuts];
        for (let i = 0; i < newCuts.length; i++) {
          if (!newCuts[i].audioUrl) {
            const url = await generateAudio(newCuts[i].text, voice);
            newCuts[i].audioUrl = url;
            setCuts([...newCuts]);
          }
          setAutoProgress(Math.round(((i + 1) / newCuts.length) * 100));
        }
        setCurrentStep(3);
      } else if (currentStep === 3) {
        // Step 3 -> 4: Generate All Images
        setAutoStatusText('모든 컷의 이미지를 생성합니다...');
        const newCuts = [...cuts];
        for (let i = 0; i < newCuts.length; i++) {
          if (!newCuts[i].imageUrl) {
            const url = await generateImage(newCuts[i].imagePrompt, ratio);
            newCuts[i].imageUrl = url;
            setCuts([...newCuts]);
          }
          setAutoProgress(Math.round(((i + 1) / newCuts.length) * 100));
        }
        setCurrentStep(4);
      } else if (currentStep === 4) {
        // Step 4 -> 5: Generate All Videos
        setAutoStatusText('모든 컷의 영상을 생성합니다...');
        const newCuts = [...cuts];
        for (let i = 0; i < newCuts.length; i++) {
          if (!newCuts[i].videoUrl) {
            const url = await generateVideo(newCuts[i].imageUrl!, newCuts[i].videoPrompt, ratio, referenceImages);
            newCuts[i].videoUrl = url;
            setCuts([...newCuts]);
          }
          setAutoProgress(Math.round(((i + 1) / newCuts.length) * 100));
        }
        setCurrentStep(5);
      }
    } catch (e: any) {
      handleError(e, '수동 진행 중 오류가 발생했습니다.');
    } finally {
      setIsManualGenerating(false);
      setAutoProgress(0);
      setAutoStatusText('');
    }
  };

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []) as File[];
    if (referenceImages.length + files.length > 20) {
      showToast('최대 20개까지만 업로드할 수 있습니다.', 'error');
      return;
    }

    files.forEach((file: File) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setReferenceImages(prev => [...prev, event.target!.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removeReferenceImage = (index: number) => {
    setReferenceImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleError = (e: any, defaultMessage: string) => {
    console.error(e);
    const errorMessage = e?.message || String(e);
    if (errorMessage.includes('429') || errorMessage.includes('quota')) {
      showToast('API 할당량을 초과했습니다. Google Cloud 결제 설정을 확인하거나 잠시 후 다시 시도해주세요.', 'error');
    } else if (errorMessage.includes('503') || errorMessage.includes('high demand') || errorMessage.includes('UNAVAILABLE')) {
      showToast('현재 AI 모델 사용량이 많아 일시적으로 지연되고 있습니다. 잠시 후 다시 시도해주세요.', 'error');
    } else {
      showToast(defaultMessage, 'error');
    }
  };

  const handleReset = () => {
    setIsResetModalOpen(true);
  };

  const executeReset = () => {
    setTopic('');
    setDuration(30);
    setRatio('16:9');
    setStyle('실제 사진');
    setCharacterEthnicity('선택 안함');
    setCharacterAge('선택 안함');
    setCharacterGender('선택 안함');
    setCuts([]);
    setVoice('Kore');
    setIsGenerating(false);
    setPreviewing(false);
    setIncludeSubtitles(true);
    setIsPlaying(false);
    setCurrentCutIndex(0);
    setCurrentStep(1);
    setIsAutoGenerating(false);
    setAutoProgress(0);
    setAutoStatusText('');
    setReferenceImages([]);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = '';
    }
    setIsResetModalOpen(false);
  };

  const handleGenerateScript = async () => {
    if (!hasKey) {
      setIsApiKeyModalOpen(true);
      return;
    }
    if (!topic) return;
    setIsGenerating(true);
    try {
      const generated = await generateScript(topic, duration, ratio, style, characterEthnicity, characterAge, characterGender, referenceImages);
      if (!generated || generated.length === 0) {
        throw new Error('대본 생성에 실패했습니다. 다른 주제로 시도해주세요.');
      }
      setCuts(generated.map((c: any, i: number) => ({ ...c, id: `cut-${i}` })));
      setCurrentStep(2); // Move to next step
    } catch (e: any) {
      handleError(e, '대본 생성 중 오류가 발생했습니다.');
    }
    setIsGenerating(false);
  };

  const handleOneTouchPlanning = async () => {
    if (!hasKey) {
      setIsApiKeyModalOpen(true);
      return;
    }
    if (referenceImages.length === 0) {
      showToast('먼저 참고 이미지를 업로드해주세요.', 'error');
      return;
    }
    setIsPlanning(true);
    try {
      const result = await oneTouchPlan(referenceImages);
      if (result.topic) setTopic(result.topic);
      if (result.cuts && result.cuts.length > 0) {
        setCuts(result.cuts.map((c: any, i: number) => ({ ...c, id: `cut-${i}` })));
        showToast('이미지를 분석하여 주제와 대본을 생성했습니다.', 'success');
        setCurrentStep(2);
      } else {
        throw new Error('기획안 생성에 실패했습니다.');
      }
    } catch (e: any) {
      handleError(e, '원터치 기획 중 오류가 발생했습니다.');
    }
    setIsPlanning(false);
  };

  const handleAutoGenerateAll = async () => {
    if (!hasKey) {
      setIsApiKeyModalOpen(true);
      return;
    }
    if (!topic) return;
    setIsAutoGenerating(true);
    setAutoProgress(0);
    setAutoStatusText('대본 생성 중...');
    
    try {
      let currentCuts = cuts;
      if (currentCuts.length === 0) {
        const generated = await generateScript(topic, duration, ratio, style, characterEthnicity, characterAge, characterGender, referenceImages);
        if (!generated || generated.length === 0) throw new Error('대본 생성 실패');
        currentCuts = generated.map((c: any, i: number) => ({ ...c, id: `cut-${i}` }));
        setCuts(currentCuts);
      }
      
      const totalTasks = currentCuts.length * 3;
      let completedTasks = 0;
      
      const updateProgress = () => {
        completedTasks++;
        setAutoProgress(Math.round((completedTasks / totalTasks) * 100));
      };

      // 2. Audio
      for (let i = 0; i < currentCuts.length; i++) {
        if (!currentCuts[i].audioUrl) {
          setAutoStatusText(`컷 ${i + 1}/${currentCuts.length} 음성 생성 중...`);
          try {
            const url = await generateAudio(currentCuts[i].text, voice);
            currentCuts[i].audioUrl = url;
            setCuts([...currentCuts]);
          } catch (e) { console.error(e); }
        }
        updateProgress();
      }

      // 3. Image
      for (let i = 0; i < currentCuts.length; i++) {
        if (!currentCuts[i].imageUrl) {
          setAutoStatusText(`컷 ${i + 1}/${currentCuts.length} 이미지 생성 중...`);
          try {
            const url = await generateImage(currentCuts[i].imagePrompt, ratio);
            currentCuts[i].imageUrl = url;
            setCuts([...currentCuts]);
          } catch (e) { console.error(e); }
        }
        updateProgress();
      }

      // 4. Video
      for (let i = 0; i < currentCuts.length; i++) {
        if (!currentCuts[i].videoUrl) {
          setAutoStatusText(`컷 ${i + 1}/${currentCuts.length} 영상 생성 중... (최대 몇 분 소요)`);
          try {
            const url = await generateVideo(currentCuts[i].imageUrl!, currentCuts[i].videoPrompt, ratio, referenceImages);
            currentCuts[i].videoUrl = url;
            setCuts([...currentCuts]);
          } catch (e) { console.error(e); }
        }
        updateProgress();
      }

      setAutoStatusText('모든 작업이 완료되었습니다!');
      setTimeout(() => {
        setIsAutoGenerating(false);
        setCurrentStep(5);
      }, 2000);

    } catch (e: any) {
      handleError(e, '자동화 처리 중 오류가 발생했습니다.');
      setIsAutoGenerating(false);
    }
  };

  const handlePreviewVoice = async () => {
    setPreviewing(true);
    try {
      const url = await generateAudio('안녕하세요, 혁신 유튜브 AI입니다. 제 목소리가 마음에 드시나요?', voice);
      const audio = new Audio(url);
      audio.play();
    } catch (e: any) {
      handleError(e, '음성 미리보기 실패');
    }
    setPreviewing(false);
  };

  const updateCut = (index: number, updates: Partial<Cut>) => {
    setCuts(prev => {
      const newCuts = [...prev];
      newCuts[index] = { ...newCuts[index], ...updates };
      return newCuts;
    });
  };

  const handleGenerateAudio = async (index: number) => {
    const cut = cuts[index];
    updateCut(index, { isGeneratingAudio: true });
    try {
      const url = await generateAudio(cut.text, voice);
      updateCut(index, { audioUrl: url, isGeneratingAudio: false });
    } catch (e: any) {
      updateCut(index, { isGeneratingAudio: false });
      handleError(e, '음성 생성 실패');
    }
  };

  const handleGenerateImage = async (index: number) => {
    const cut = cuts[index];
    updateCut(index, { isGeneratingImage: true });
    try {
      const url = await generateImage(cut.imagePrompt, ratio);
      updateCut(index, { imageUrl: url, isGeneratingImage: false });
    } catch (e: any) {
      updateCut(index, { isGeneratingImage: false });
      handleError(e, '이미지 생성 실패');
    }
  };

  const handleGenerateVideo = async (index: number) => {
    const cut = cuts[index];
    if (!cut.imageUrl) {
      showToast('먼저 이미지를 생성해주세요.', 'error');
      return;
    }
    updateCut(index, { isGeneratingVideo: true });
    try {
      const url = await generateVideo(cut.imageUrl, cut.videoPrompt, ratio, referenceImages);
      updateCut(index, { videoUrl: url, isGeneratingVideo: false });
    } catch (e: any) {
      updateCut(index, { isGeneratingVideo: false });
      handleError(e, '영상 생성 실패. (Veo API는 시간이 걸릴 수 있습니다)');
    }
  };

  const allVideosReady = cuts.length > 0 && cuts.every(c => c.videoUrl);
  const allAudiosReady = cuts.length > 0 && cuts.every(c => c.audioUrl);

  const handlePlay = () => {
    if (!allVideosReady || !allAudiosReady) {
      showToast('모든 컷의 영상과 음성이 생성되어야 합니다.', 'error');
      return;
    }
    setIsPlaying(true);
    setCurrentCutIndex(0);
  };

  useEffect(() => {
    if (isPlaying && videoRef.current) {
      videoRef.current.play().catch(e => console.error(e));
      if (audioRef.current) {
        audioRef.current.play().catch(e => console.error(e));
      }
    }
  }, [currentCutIndex, isPlaying]);

  const handleVideoEnded = () => {
    if (currentCutIndex < cuts.length - 1) {
      setCurrentCutIndex(prev => prev + 1);
    } else {
      setIsPlaying(false);
    }
  };

  const downloadSRT = () => {
    let srt = '';
    let time = 0;
    cuts.forEach((cut, i) => {
      const formatTime = (s: number) => {
        const h = Math.floor(s / 3600).toString().padStart(2, '0');
        const m = Math.floor((s % 3600) / 60).toString().padStart(2, '0');
        const sec = Math.floor(s % 60).toString().padStart(2, '0');
        return `${h}:${m}:${sec},000`;
      };
      const start = formatTime(time);
      time += 3; // Mock duration
      const end = formatTime(time);
      srt += `${i + 1}\n${start} --> ${end}\n${cut.text}\n\n`;
    });
    
    const blob = new Blob([srt], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'subtitles.srt';
    a.click();
  };

  const handleDownloadMP4 = async (resolution: '1080p' | '720p' | '480p' = '1080p') => {
    if (!allVideosReady || !allAudiosReady) {
      showToast('모든 컷의 영상과 음성이 생성되어야 합니다.', 'error');
      return;
    }
    
    setIsRendering(true);
    setRenderingProgress(0);
    setIsPlaying(true);
    setCurrentCutIndex(0);
    
    // Initialize audio context synchronously to preserve user gesture
    let audioCtx: AudioContext | null = null;
    let audioClone: HTMLAudioElement | null = null;
    let dest: MediaStreamAudioDestinationNode | null = null;
    try {
      audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      dest = audioCtx.createMediaStreamDestination();
      audioClone = new Audio(cuts[0].audioUrl);
      audioClone.crossOrigin = "anonymous";
      audioClone.play().catch(e => console.warn('Audio clone play failed', e));
      const source = audioCtx.createMediaElementSource(audioClone);
      source.connect(dest);
      source.connect(audioCtx.destination);
    } catch (e) {
      console.warn('Audio mixing not supported or failed', e);
    }
    
    setTimeout(async () => {
      if (!videoRef.current || !audioRef.current) return;
      
      const canvas = document.createElement('canvas');
      let width = 1920;
      let height = 1080;
      
      if (resolution === '720p') { width = 1280; height = 720; }
      if (resolution === '480p') { width = 854; height = 480; }

      if (ratio === '9:16') { 
        const temp = width; width = height; height = temp; 
      }
      else if (ratio === '1:1') { 
        width = height; 
      }
      else if (ratio === '3:4') { 
        width = Math.round(height * 0.75); 
      }
      
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      
      const canvasStream = (canvas as any).captureStream ? (canvas as any).captureStream(30) : (canvas as any).webkitCaptureStream ? (canvas as any).webkitCaptureStream(30) : null;
      if (!canvasStream) {
        showToast('이 브라우저에서는 영상 렌더링을 지원하지 않습니다. Chrome을 사용해주세요.', 'error');
        setIsPlaying(false);
        setIsRendering(false);
        return;
      }
      
      // Audio mixing
      if (dest && audioClone) {
        audioRef.current.muted = true; // Mute main audio so we don't hear double
        
        const syncAudio = () => {
          if (audioClone && audioRef.current) {
            if (audioClone.src !== audioRef.current.src) {
              audioClone.src = audioRef.current.src;
              audioClone.currentTime = audioRef.current.currentTime;
              audioClone.play().catch(e => console.warn('Audio clone sync play failed', e));
            }
          }
        };
        
        audioRef.current.addEventListener('play', syncAudio);
        audioRef.current.addEventListener('timeupdate', () => {
          if (audioClone && audioRef.current && Math.abs(audioClone.currentTime - audioRef.current.currentTime) > 0.3) {
            audioClone.currentTime = audioRef.current.currentTime;
          }
        });
        // Also sync on source change
        audioRef.current.addEventListener('loadedmetadata', syncAudio);
      }
      
      const combinedStream = new MediaStream([
        ...canvasStream.getVideoTracks(),
        ...(dest ? dest.stream.getAudioTracks() : [])
      ]);

      const types = [
        'video/mp4',
        'video/webm;codecs=h264',
        'video/webm;codecs=vp9',
        'video/webm;codecs=vp8',
        'video/webm'
      ];
      let mimeType = '';
      for (const type of types) {
        if (MediaRecorder.isTypeSupported(type)) {
          mimeType = type;
          break;
        }
      }
      
      const recorder = new MediaRecorder(combinedStream, mimeType ? { mimeType } : undefined);
      const chunks: Blob[] = [];
      
      recorder.ondataavailable = e => {
        if (e.data.size > 0) chunks.push(e.data);
      };
      
      recorder.onstop = () => {
        if (audioRef.current) audioRef.current.muted = false;
        if (audioClone) {
          audioClone.pause();
          audioClone.src = '';
        }
        const blob = new Blob(chunks, { type: mimeType || 'video/webm' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        const ext = (mimeType.includes('mp4') || mimeType.includes('h264')) ? 'mp4' : 'webm';
        a.download = `youtube_shorts_final_${resolution}_${Date.now()}.${ext}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        setIsRendering(false);
        showToast('다운로드가 완료되었습니다.', 'success');
      };
      
      try {
        recorder.start();
      } catch (e) {
        console.error('Failed to start recorder', e);
        showToast('영상 렌더링에 실패했습니다. 브라우저가 지원하지 않는 형식일 수 있습니다.', 'error');
        setIsPlaying(false);
        setIsRendering(false);
        return;
      }
      
      const totalDuration = cuts.reduce((acc, cut) => acc + (audioRef.current?.duration || 5), 0);
      let startTime = Date.now();

      const drawFrame = () => {
        if (ctx && videoRef.current) {
          // object-cover logic
          const videoRatio = videoRef.current.videoWidth / videoRef.current.videoHeight;
          const canvasRatio = width / height;
          let drawWidth = width;
          let drawHeight = height;
          let offsetX = 0;
          let offsetY = 0;

          if (videoRatio > canvasRatio) {
            drawWidth = height * videoRatio;
            offsetX = (width - drawWidth) / 2;
          } else {
            drawHeight = width / videoRatio;
            offsetY = (height - drawHeight) / 2;
          }

          // Clear canvas first
          ctx.fillStyle = 'black';
          ctx.fillRect(0, 0, width, height);
          
          // Draw video as cover background
          ctx.drawImage(videoRef.current, offsetX, offsetY, drawWidth, drawHeight);
          
          if (includeSubtitles) {
            const text = cuts[currentCutIndexRef.current]?.text || '';
            // Subtitle background
            ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
            ctx.fillRect(0, height - (height * 0.18), width, height * 0.18); // Fill to the bottom
            
            // Subtitle text
            ctx.fillStyle = 'white';
            ctx.font = `bold ${Math.round(height * 0.04)}px sans-serif`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(text, width / 2, height - (height * 0.09));
          }

          // Update progress
          const elapsed = (Date.now() - startTime) / 1000;
          const progress = Math.min(Math.round((elapsed / totalDuration) * 100), 99);
          setRenderingProgress(progress);
        }
        
        if (recorder.state === 'recording') {
          requestAnimationFrame(drawFrame);
        }
      };
      
      drawFrame();
      
      // Stop recorder when all cuts are done
      const checkEnd = setInterval(() => {
        if (!isPlayingRef.current) {
          if (recorder.state === 'recording') {
            recorder.stop();
          }
          clearInterval(checkEnd);
        }
      }, 1000);
      
    }, 500);
  };

  const steps = [
    { id: 1, title: '영상 설정 및 대본', icon: Sparkles },
    { id: 2, title: '음성 생성', icon: Mic },
    { id: 3, title: '이미지 생성', icon: ImageIcon },
    { id: 4, title: '영상 생성', icon: Video },
    { id: 5, title: '최종 확인 및 렌더링', icon: Play },
  ];

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50 font-sans selection:bg-indigo-500/30 flex pb-20">
      {toast && (
        <div className={`fixed top-4 left-1/2 -translate-x-1/2 z-[100] px-6 py-3 rounded-xl shadow-2xl border flex items-center gap-3 transition-all animate-in fade-in slide-in-from-top-4 ${
          toast.type === 'error' ? 'bg-red-500/10 border-red-500/20 text-red-400' :
          toast.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' :
          'bg-indigo-500/10 border-indigo-500/20 text-indigo-400'
        }`}>
          <div className="text-sm font-medium">{toast.message}</div>
        </div>
      )}

      <ApiKeyModal 
        isOpen={isApiKeyModalOpen} 
        onClose={() => setIsApiKeyModalOpen(false)} 
        onKeySelected={handleKeySelected} 
        currentKey={currentApiKey} 
      />

      <ApiCostModal
        isOpen={isApiCostModalOpen}
        onClose={() => setIsApiCostModalOpen(false)}
      />

      <RenderingModal 
        isOpen={isRendering} 
        progress={renderingProgress} 
      />

      {isHelpModalOpen && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-zinc-900 p-8 rounded-2xl max-w-2xl w-full border border-white/10 relative shadow-2xl">
            <button onClick={() => setIsHelpModalOpen(false)} className="absolute top-4 right-4 text-zinc-400 hover:text-white transition-colors">
              <X className="w-6 h-6" />
            </button>
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <HelpCircle className="w-6 h-6 text-red-500" />
              사용 방법
            </h2>
            <div className="space-y-4 text-zinc-300 text-sm leading-relaxed max-h-[60vh] overflow-y-auto pr-2">
              <p><strong className="text-white">1. API 키 설정:</strong> 좌측 하단의 'API KEY 설정' 버튼을 눌러 Gemini API 키를 입력합니다.</p>
              <p><strong className="text-white">2. 주제 입력:</strong> 만들고 싶은 영상의 주제를 입력하고 영상 비율, 스타일 등을 선택합니다.</p>
              <p><strong className="text-white">3. 대본 생성:</strong> '대본 생성' 버튼을 누르면 AI가 자동으로 컷별 대본과 이미지/영상 프롬프트를 작성합니다.</p>
              <p><strong className="text-white">4. 음성/이미지/영상 생성:</strong> 각 단계별로 생성 버튼을 누르거나, '전체 자동화' 버튼을 눌러 한 번에 모든 소스를 생성합니다.</p>
              <p><strong className="text-white">5. 최종 확인 및 렌더링:</strong> 마지막 단계에서 생성된 영상을 미리보기하고, 원하는 화질로 다운로드합니다.</p>
              <div className="mt-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
                <p className="text-red-400 font-medium mb-1 flex items-center gap-1">💡 팁</p>
                <ul className="list-disc list-inside space-y-1 text-red-300/80">
                  <li>참조 이미지를 업로드하면 생성되는 이미지와 영상의 스타일을 일정하게 유지할 수 있습니다.</li>
                  <li>마음에 들지 않는 컷은 각 단계에서 개별적으로 '재생성'할 수 있습니다.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {isResetModalOpen && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-zinc-900 p-8 rounded-2xl max-w-sm w-full border border-white/10 relative shadow-2xl text-center">
            <h2 className="text-xl font-bold text-white mb-4">새로 만들기</h2>
            <p className="text-zinc-400 mb-6 text-sm">
              모든 작업 내용이 초기화됩니다.<br/>새로 만드시겠습니까?
            </p>
            <div className="flex gap-3 justify-center">
              <button 
                onClick={() => setIsResetModalOpen(false)}
                className="px-6 py-2 rounded-lg bg-zinc-800 text-white hover:bg-zinc-700 transition-colors text-sm font-medium"
              >
                취소
              </button>
              <button 
                onClick={executeReset}
                className="px-6 py-2 rounded-lg bg-red-600 text-white hover:bg-red-500 transition-colors text-sm font-medium"
              >
                초기화
              </button>
            </div>
          </div>
        </div>
      )}
      
      {(isAutoGenerating || isManualGenerating) && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-zinc-900/90 p-8 rounded-3xl border border-white/10 shadow-2xl max-w-lg w-full space-y-8 relative overflow-hidden">
            {/* Background glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-32 bg-indigo-500/20 blur-[100px] pointer-events-none" />
            
            <div className="text-center space-y-2 relative z-10">
              <div className="w-16 h-16 bg-indigo-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-8 h-8 text-indigo-400 animate-pulse" />
              </div>
              <h2 className="text-2xl font-bold text-white">{isAutoGenerating ? '전체 자동화 진행 중' : '수동 단계 진행 중'}</h2>
              <p className="text-zinc-400 text-sm">AI가 과정을 처리하고 있습니다.</p>
            </div>

            <div className="space-y-6 relative z-10">
              <div className="flex items-center justify-between text-sm font-medium">
                <span className="text-indigo-400">{autoStatusText}</span>
                <span className="text-white">{autoProgress}%</span>
              </div>
              
              <div className="h-3 bg-zinc-950 rounded-full overflow-hidden border border-white/5">
                <div 
                  className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500 ease-out relative overflow-hidden"
                  style={{ width: `${autoProgress}%` }}
                >
                  <div className="absolute inset-0 bg-white/20 animate-[shimmer_2s_infinite]" style={{ backgroundImage: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent)' }} />
                </div>
              </div>

              {/* Step indicators */}
              <div className="grid grid-cols-4 gap-2 text-center text-xs font-medium">
                <div className={`p-2 rounded-lg transition-colors ${autoStatusText.includes('대본') ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30' : cuts.length > 0 ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-zinc-800/50 text-zinc-500'}`}>
                  1. 대본
                </div>
                <div className={`p-2 rounded-lg transition-colors ${autoStatusText.includes('음성') ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30' : cuts.length > 0 && cuts[0]?.audioUrl ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-zinc-800/50 text-zinc-500'}`}>
                  2. 음성
                </div>
                <div className={`p-2 rounded-lg transition-colors ${autoStatusText.includes('이미지') ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30' : cuts.length > 0 && cuts[0]?.imageUrl ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-zinc-800/50 text-zinc-500'}`}>
                  3. 이미지
                </div>
                <div className={`p-2 rounded-lg transition-colors ${autoStatusText.includes('영상') ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30' : cuts.length > 0 && cuts[0]?.videoUrl ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-zinc-800/50 text-zinc-500'}`}>
                  4. 영상
                </div>
              </div>
            </div>
            
            <p className="text-center text-xs text-zinc-500 relative z-10">
              이 작업은 설정에 따라 수 분 정도 소요될 수 있습니다. 창을 닫지 마세요.
            </p>
          </div>
        </div>
      )}
      
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/10 bg-zinc-900/50 flex flex-col fixed inset-y-0 left-0 z-40">
        <div className="h-16 flex items-center gap-3 px-6 border-b border-white/10">
          <div className="w-8 h-8 rounded-lg bg-red-600 flex items-center justify-center shadow-lg shadow-red-500/20">
            <Youtube className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-lg font-bold tracking-tight">혁신 유튜브 AI</h1>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          {steps.map(step => {
            const Icon = step.icon;
            const isActive = currentStep === step.id;
            const isDisabled = step.id > 1 && cuts.length === 0;
            
            let isCompleted = false;
            if (cuts.length > 0) {
              if (step.id === 1) isCompleted = true;
              if (step.id === 2 && cuts.every(c => c.audioUrl)) isCompleted = true;
              if (step.id === 3 && cuts.every(c => c.imageUrl)) isCompleted = true;
              if (step.id === 4 && cuts.every(c => c.videoUrl)) isCompleted = true;
            }

            return (
              <button
                key={step.id}
                onClick={() => !isDisabled && setCurrentStep(step.id)}
                disabled={isDisabled}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all text-sm font-medium ${
                  isActive ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' : 
                  isDisabled ? 'opacity-50 cursor-not-allowed text-zinc-500' : 'text-zinc-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${isActive ? 'bg-indigo-500 text-white' : isCompleted ? 'bg-emerald-500/20 text-emerald-400' : 'bg-zinc-800'}`}>
                    {isCompleted && !isActive ? <Check className="w-3 h-3" /> : step.id}
                  </div>
                  <Icon className="w-4 h-4" />
                  {step.title}
                </div>
                {isCompleted && <div className="w-2 h-2 rounded-full bg-emerald-500" />}
              </button>
            );
          })}
        </nav>
        
        <div className="p-4 space-y-2 border-t border-white/10">
          <button
            onClick={handleReset}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-medium bg-zinc-800/50 text-zinc-300 hover:bg-zinc-800 hover:text-white border border-white/5"
          >
            <PlusCircle className="w-4 h-4" />
            <span>새로 만들기</span>
          </button>
          <button
            onClick={() => setIsHelpModalOpen(true)}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-medium bg-zinc-800/50 text-zinc-300 hover:bg-zinc-800 hover:text-white border border-white/5"
          >
            <HelpCircle className="w-4 h-4" />
            <span>사용방법</span>
          </button>
        </div>

        {/* API Key Status */}
        <div className="p-4 border-t border-white/10">
          <button
            onClick={() => setIsApiKeyModalOpen(true)}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all text-sm font-medium border ${
              hasKey 
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20' 
                : 'bg-red-500/10 text-red-400 border-red-500/20 hover:bg-red-500/20'
            }`}
          >
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${hasKey ? 'bg-emerald-500' : 'bg-red-500 animate-pulse'}`} />
              <span>API KEY {hasKey ? '적용됨' : '미적용'}</span>
            </div>
            <span className="text-xs opacity-60">설정</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 p-8 max-w-4xl mx-auto w-full relative">
        
        {/* Top Right API Cost Button */}
        <div className="absolute top-8 right-8 z-30">
          <button 
            onClick={() => setIsApiCostModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 hover:text-white rounded-full text-sm font-medium border border-white/10 backdrop-blur-md transition-all shadow-lg"
          >
            <span className="text-emerald-400">💰</span> API 비용
          </button>
        </div>

        {/* Hero Banner */}
        <div className="w-full aspect-video max-h-[280px] rounded-3xl overflow-hidden relative mb-8 border border-white/10 shadow-2xl flex-shrink-0 group bg-zinc-950">
          {/* YouTube Logo SVG Background */}
          <div className="absolute inset-0 flex items-center justify-end pr-10 opacity-30 group-hover:opacity-40 group-hover:scale-110 transition-all duration-700">
            <svg viewBox="0 0 100 70" className="w-64 h-64 text-red-600 drop-shadow-[0_0_30px_rgba(220,38,38,0.8)]" fill="currentColor">
              <path d="M97.9,11.1c-1.1-4.3-4.6-7.7-8.9-8.9C80.9,0,50,0,50,0s-30.9,0-38.9,2.2C6.8,3.3,3.3,6.8,2.2,11.1 C0,19.1,0,35,0,35s0,15.9,2.2,23.9c1.1,4.3,4.6,7.7,8.9,8.9C19.1,70,50,70,50,70s30.9,0,38.9-2.2c4.3-1.1,7.7-4.6,8.9-8.9 C100,50.9,100,35,100,35S100,19.1,97.9,11.1z" />
              <polygon fill="white" points="39.8,50 66.2,35 39.8,20" />
            </svg>
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-900/80 to-transparent" />
          <div className="absolute inset-0 flex flex-col justify-center p-10">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-500/20 border border-red-500/30 text-red-400 text-xs font-semibold mb-4 w-fit backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5" />
              Next-Gen Video Creation
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-4 drop-shadow-lg">
              혁신 <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-rose-400">유튜브 AI</span>
            </h1>
            <p className="text-zinc-300 max-w-xl drop-shadow-md text-sm md:text-base leading-relaxed">
              단 몇 번의 클릭으로 완벽한 유튜브 쇼츠와 영상을 제작하세요. AI가 대본부터 음성, 이미지, 영상 렌더링까지 모든 것을 자동으로 완성합니다.
            </p>
          </div>
        </div>

        {currentStep === 1 && (
          <section className="space-y-6 bg-zinc-900/40 p-6 rounded-3xl border border-white/5 animate-in fade-in slide-in-from-bottom-4">
            <h2 className="text-2xl font-semibold flex items-center gap-2">
              <span className="text-indigo-400">1.</span> 영상 설정 및 대본
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="text-sm font-medium text-zinc-400">영상 비율</label>
                <div className="flex flex-wrap gap-2">
                  {(['16:9', '1:1', '3:4', '9:16'] as Ratio[]).map(r => (
                    <button key={r} onClick={() => setRatio(r)} className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${ratio === r ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/20' : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'}`}>
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-sm font-medium text-zinc-400">스타일</label>
                <div className="flex flex-wrap gap-2">
                  {(['실제 사진', '귀여운 졸라맨', '미니멀 인포그래픽', '일본 애니메이션', '영화 스틸컷', '사이버펑크 네온', '수채화 동화', '레트로 픽셀아트', '다크 판타지', '3D 픽사 애니메이션', '시네마틱 브이로그', '빈티지 필름', '참고이미지 톤앤매너'] as Style[]).map(s => (
                    <button key={s} onClick={() => setStyle(s)} className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${style === s ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/20' : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'}`}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="space-y-3">
                <label className="text-sm font-medium text-zinc-400">인물 (선택)</label>
                <div className="flex flex-wrap gap-2">
                  {(['선택 안함', '한국인', '서양인(백인)', '서양인(흑인)'] as CharacterEthnicity[]).map(e => (
                    <button key={e} onClick={() => setCharacterEthnicity(e)} className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${characterEthnicity === e ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/20' : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'}`}>
                      {e}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-sm font-medium text-zinc-400">인물 나이 (선택)</label>
                <div className="flex flex-wrap gap-2">
                  {(['선택 안함', '10세 미만', '10대', '20대', '30대', '40대', '50대', '60대', '70대'] as CharacterAge[]).map(a => (
                    <button key={a} onClick={() => setCharacterAge(a)} className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${characterAge === a ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/20' : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'}`}>
                      {a}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-sm font-medium text-zinc-400">성별 (선택)</label>
                <div className="flex flex-wrap gap-2">
                  {(['선택 안함', '남자', '여자'] as CharacterGender[]).map(g => (
                    <button key={g} onClick={() => setCharacterGender(g)} className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${characterGender === g ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/20' : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'}`}>
                      {g}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-zinc-400 flex items-center gap-2">
                  이미지로 생성 / 참고 이미지 (선택, 최대 20장)
                  <span className="px-2 py-0.5 bg-indigo-500/10 text-indigo-400 text-[10px] font-bold rounded-full border border-indigo-500/20">NEW</span>
                </label>
                <div className="flex items-center gap-2">
                  {referenceImages.length > 0 && (
                    <button 
                      onClick={handleOneTouchPlanning}
                      disabled={isPlanning || isGenerating || isAutoGenerating}
                      className="px-3 py-1.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-lg text-xs font-bold hover:bg-emerald-500/20 transition-all flex items-center gap-1.5 shadow-lg shadow-emerald-500/10"
                    >
                      {isPlanning ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                      원터치 기획
                    </button>
                  )}
                  <span className="text-xs text-zinc-500">{referenceImages.length} / 20</span>
                </div>
              </div>
              <div className="flex flex-wrap gap-3">
                {referenceImages.map((img, i) => (
                  <div key={i} className="relative w-20 h-20 rounded-lg overflow-hidden border border-white/10 group">
                    <img src={img} alt={`Ref ${i}`} className="w-full h-full object-cover" />
                    <button 
                      onClick={() => removeReferenceImage(i)}
                      className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <span className="text-white text-xs font-medium">삭제</span>
                    </button>
                  </div>
                ))}
                {referenceImages.length < 20 && (
                  <label className="w-20 h-20 rounded-lg border border-dashed border-white/20 flex flex-col items-center justify-center cursor-pointer hover:bg-white/5 transition-colors">
                    <ImageIcon className="w-5 h-5 text-zinc-500 mb-1" />
                    <span className="text-[10px] text-zinc-500">추가</span>
                    <input type="file" accept="image/*" multiple className="hidden" onChange={handleImageUpload} />
                  </label>
                )}
              </div>
              <p className="text-xs text-zinc-500">
                업로드한 이미지의 일관성(톤앤매너, 스타일)을 100% 반영하여 영상을 제작합니다.
              </p>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-medium text-zinc-400">주제 및 대본 입력</label>
              <textarea 
                value={topic} onChange={e => setTopic(e.target.value)}
                placeholder="예: 인공지능이 세상을 바꾸는 5가지 방법"
                className="w-full bg-zinc-950 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none h-24"
              />
            </div>

            <div className="flex items-end gap-4">
              <div className="space-y-3 flex-1">
                <label className="text-sm font-medium text-zinc-400">영상 길이 (초)</label>
                <input 
                  type="number" value={duration} onChange={e => setDuration(Number(e.target.value))}
                  className="w-full bg-zinc-950 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={handleGenerateScript} disabled={isGenerating || isAutoGenerating || isManualGenerating || !topic}
                  className="h-[50px] px-6 bg-zinc-800 text-white rounded-xl font-semibold hover:bg-zinc-700 transition-all disabled:opacity-50 flex items-center gap-2"
                >
                  {isGenerating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
                  대본 생성
                </button>
                <button 
                  onClick={handleManualProceed} disabled={isGenerating || isAutoGenerating || isManualGenerating || !topic}
                  className="h-[50px] px-6 bg-zinc-800 text-white rounded-xl font-semibold hover:bg-zinc-700 transition-all disabled:opacity-50 flex items-center gap-2 border border-white/10"
                >
                  {isManualGenerating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Play className="w-5 h-5" />}
                  수동으로 순서대로 진행하기
                </button>
                <button 
                  onClick={handleAutoGenerateAll} disabled={isGenerating || isAutoGenerating || isManualGenerating || !topic}
                  className="h-[50px] px-6 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl font-semibold hover:from-indigo-400 hover:to-purple-400 transition-all disabled:opacity-50 flex items-center gap-2 shadow-lg shadow-indigo-500/20"
                >
                  {isAutoGenerating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
                  전체 자동화 (원클릭 완성)
                </button>
              </div>
            </div>
            
            {cuts.length > 0 && (
              <div className="pt-4 border-t border-white/10 flex justify-end">
                <button 
                  onClick={() => setCurrentStep(2)}
                  className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-500 transition-all"
                >
                  다음 단계로
                </button>
              </div>
            )}
          </section>
        )}

        {currentStep === 2 && cuts.length > 0 && (
          <section className="space-y-6 bg-zinc-900/40 p-6 rounded-3xl border border-white/5 animate-in fade-in slide-in-from-bottom-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold flex items-center gap-2">
                <span className="text-indigo-400">2.</span> 음성 생성
              </h2>
              <div className="flex gap-2">
                <button 
                  onClick={handleManualProceed}
                  disabled={isManualGenerating || isAutoGenerating}
                  className="px-4 py-2 bg-zinc-800 text-white rounded-xl font-semibold hover:bg-zinc-700 transition-all disabled:opacity-50 flex items-center gap-2 text-sm border border-white/10"
                >
                  {isManualGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
                  수동으로 다음 단계 진행
                </button>
                <button 
                  onClick={async () => {
                  setIsAutoGenerating(true);
                  setAutoProgress(0);
                  let completed = 0;
                  const total = cuts.length;
                  for (let i = 0; i < cuts.length; i++) {
                    if (!cuts[i].audioUrl) {
                      setAutoStatusText(`컷 ${i + 1}/${cuts.length} 음성 생성 중...`);
                      try {
                        const url = await generateAudio(cuts[i].text, voice);
                        updateCut(i, { audioUrl: url });
                      } catch (e) {
                        console.error(e);
                      }
                    }
                    completed++;
                    setAutoProgress(Math.round((completed / total) * 100));
                  }
                  setIsAutoGenerating(false);
                }}
                disabled={isAutoGenerating}
                className="px-4 py-2 bg-zinc-800 text-white rounded-xl font-semibold hover:bg-zinc-700 transition-all disabled:opacity-50 flex items-center gap-2 text-sm"
              >
                {isAutoGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Mic className="w-4 h-4" />}
                전체 음성 생성
              </button>
            </div>
          </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-zinc-400">보이스 선택</label>
                <button onClick={handlePreviewVoice} disabled={previewing} className="text-sm flex items-center gap-1 text-indigo-400 hover:text-indigo-300">
                  {previewing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
                  미리듣기
                </button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {([
                  { id: 'Kore', label: '코레', desc: '여성 · 청년' },
                  { id: 'Puck', label: '퍽', desc: '남성 · 청년' },
                  { id: 'Charon', label: '카론', desc: '남성 · 중년' },
                  { id: 'Fenrir', label: '펜리르', desc: '남성 · 노년' },
                  { id: 'Zephyr', label: '제퍼', desc: '여성 · 중년' },
                  { id: 'Aoede', label: '아오에데', desc: '여성 · 청년' },
                  { id: 'Leda', label: '레다', desc: '여성 · 차분함' },
                  { id: 'Orion', label: '오리온', desc: '남성 · 신뢰감' },
                  { id: 'Lyra', label: '라이라', desc: '여성 · 발랄함' },
                ] as const).map(v => (
                  <button 
                    key={v.id} onClick={() => setVoice(v.id as Voice)}
                    className={`p-3 rounded-xl border text-left transition-all ${voice === v.id ? 'border-indigo-500 bg-indigo-500/10' : 'border-white/10 bg-zinc-950 hover:border-white/20'}`}
                  >
                    <div className="font-medium text-white">{v.label}</div>
                    <div className="text-xs text-zinc-500 mt-1">{v.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4 mt-6">
              {cuts.map((cut, index) => (
                <div key={cut.id} className="bg-zinc-950 border border-white/5 rounded-xl p-4 flex flex-col md:flex-row gap-4">
                  <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-sm font-medium shrink-0">
                    {index + 1}
                  </div>
                  <div className="flex-1 space-y-2">
                    <textarea 
                      value={cut.text}
                      onChange={e => updateCut(index, { text: e.target.value })}
                      className="w-full bg-transparent border border-white/10 rounded-lg text-white focus:ring-1 focus:ring-indigo-500 p-2 resize-none h-20 text-sm"
                    />
                  </div>
                  <div className="w-full md:w-64 flex flex-col gap-2 justify-center">
                    <button onClick={() => handleGenerateAudio(index)} disabled={cut.isGeneratingAudio} className="w-full py-2 bg-zinc-800 rounded-lg text-xs font-medium hover:bg-zinc-700 transition flex items-center justify-center gap-2">
                      {cut.isGeneratingAudio ? <Loader2 className="w-3 h-3 animate-spin" /> : <RefreshCw className="w-3 h-3" />}
                      {cut.audioUrl ? '다시 생성' : '생성'}
                    </button>
                    {cut.audioUrl ? (
                      <audio src={cut.audioUrl} controls className="w-full h-8" />
                    ) : (
                      <div className="h-8 flex items-center justify-center text-xs text-zinc-500 bg-zinc-900 rounded-lg border border-white/5">음성 없음</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="pt-4 border-t border-white/10 flex justify-between">
              <button onClick={() => setCurrentStep(1)} className="px-6 py-3 bg-zinc-800 text-white rounded-xl font-semibold hover:bg-zinc-700 transition-all">이전 단계</button>
              <button onClick={() => setCurrentStep(3)} className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-500 transition-all">다음 단계로</button>
            </div>
          </section>
        )}

        {currentStep === 3 && cuts.length > 0 && (
          <section className="space-y-6 bg-zinc-900/40 p-6 rounded-3xl border border-white/5 animate-in fade-in slide-in-from-bottom-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold flex items-center gap-2">
                <span className="text-indigo-400">3.</span> 이미지 생성
              </h2>
              <div className="flex gap-2">
                <button 
                  onClick={handleManualProceed}
                  disabled={isManualGenerating || isAutoGenerating}
                  className="px-4 py-2 bg-zinc-800 text-white rounded-xl font-semibold hover:bg-zinc-700 transition-all disabled:opacity-50 flex items-center gap-2 text-sm border border-white/10"
                >
                  {isManualGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
                  수동으로 다음 단계 진행
                </button>
                <button 
                  onClick={async () => {
                  setIsAutoGenerating(true);
                  setAutoProgress(0);
                  let completed = 0;
                  const total = cuts.length;
                  for (let i = 0; i < cuts.length; i++) {
                    if (!cuts[i].imageUrl) {
                      setAutoStatusText(`컷 ${i + 1}/${cuts.length} 이미지 생성 중...`);
                      try {
                        const url = await generateImage(cuts[i].imagePrompt, ratio);
                        updateCut(i, { imageUrl: url });
                      } catch (e) {
                        console.error(e);
                      }
                    }
                    completed++;
                    setAutoProgress(Math.round((completed / total) * 100));
                  }
                  setIsAutoGenerating(false);
                }}
                disabled={isAutoGenerating}
                className="px-4 py-2 bg-zinc-800 text-white rounded-xl font-semibold hover:bg-zinc-700 transition-all disabled:opacity-50 flex items-center gap-2 text-sm"
              >
                {isAutoGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <ImageIcon className="w-4 h-4" />}
                전체 이미지 생성
              </button>
            </div>
          </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {cuts.map((cut, index) => (
                <div key={cut.id} className="bg-zinc-950 border border-white/5 rounded-2xl p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="font-medium text-zinc-300">컷 {index + 1}</div>
                    <button onClick={() => handleGenerateImage(index)} disabled={cut.isGeneratingImage} className="text-xs flex items-center gap-1 text-indigo-400 hover:text-indigo-300">
                      {cut.isGeneratingImage ? <Loader2 className="w-3 h-3 animate-spin" /> : <RefreshCw className="w-3 h-3" />}
                      {cut.imageUrl ? '재생성' : '생성'}
                    </button>
                  </div>
                  <div className={`w-full bg-zinc-900 rounded-xl overflow-hidden border border-white/5 relative flex items-center justify-center ${ratio === '9:16' ? 'aspect-[9/16]' : ratio === '1:1' ? 'aspect-square' : ratio === '3:4' ? 'aspect-[3/4]' : 'aspect-video'}`}>
                    {cut.imageUrl ? (
                      <img src={cut.imageUrl} alt={`Cut ${index+1}`} className="w-full h-full object-cover" />
                    ) : (
                      <ImageIcon className="w-8 h-8 text-zinc-700" />
                    )}
                    {cut.isGeneratingImage && (
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-sm">
                        <Loader2 className="w-6 h-6 text-white animate-spin" />
                      </div>
                    )}
                  </div>
                  <textarea 
                    value={cut.imagePrompt}
                    onChange={e => updateCut(index, { imagePrompt: e.target.value })}
                    className="w-full bg-transparent border border-white/10 rounded-lg text-zinc-400 focus:ring-1 focus:ring-indigo-500 p-2 resize-none h-20 text-xs"
                  />
                </div>
              ))}
            </div>
            
            <div className="pt-4 border-t border-white/10 flex justify-between">
              <button onClick={() => setCurrentStep(2)} className="px-6 py-3 bg-zinc-800 text-white rounded-xl font-semibold hover:bg-zinc-700 transition-all">이전 단계</button>
              <button onClick={() => setCurrentStep(4)} className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-500 transition-all">다음 단계로</button>
            </div>
          </section>
        )}

        {currentStep === 4 && cuts.length > 0 && (
          <section className="space-y-6 bg-zinc-900/40 p-6 rounded-3xl border border-white/5 animate-in fade-in slide-in-from-bottom-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold flex items-center gap-2">
                <span className="text-indigo-400">4.</span> 영상 생성
              </h2>
              <div className="flex gap-2">
                <button 
                  onClick={handleManualProceed}
                  disabled={isManualGenerating || isAutoGenerating}
                  className="px-4 py-2 bg-zinc-800 text-white rounded-xl font-semibold hover:bg-zinc-700 transition-all disabled:opacity-50 flex items-center gap-2 text-sm border border-white/10"
                >
                  {isManualGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
                  수동으로 다음 단계 진행
                </button>
                <button 
                  onClick={async () => {
                  setIsAutoGenerating(true);
                  setAutoProgress(0);
                  let completed = 0;
                  const total = cuts.length;
                  for (let i = 0; i < cuts.length; i++) {
                    if (!cuts[i].videoUrl && cuts[i].imageUrl) {
                      setAutoStatusText(`컷 ${i + 1}/${cuts.length} 영상 생성 중...`);
                      try {
                        const url = await generateVideo(cuts[i].imageUrl!, cuts[i].videoPrompt, ratio, referenceImages);
                        updateCut(i, { videoUrl: url });
                      } catch (e) {
                        console.error(e);
                      }
                    }
                    completed++;
                    setAutoProgress(Math.round((completed / total) * 100));
                  }
                  setIsAutoGenerating(false);
                }}
                disabled={isAutoGenerating}
                className="px-4 py-2 bg-zinc-800 text-white rounded-xl font-semibold hover:bg-zinc-700 transition-all disabled:opacity-50 flex items-center gap-2 text-sm"
              >
                {isAutoGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Video className="w-4 h-4" />}
                전체 영상 생성
              </button>
            </div>
          </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {cuts.map((cut, index) => (
                <div key={cut.id} className="bg-zinc-950 border border-white/5 rounded-2xl p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="font-medium text-zinc-300">컷 {index + 1}</div>
                    <button onClick={() => handleGenerateVideo(index)} disabled={cut.isGeneratingVideo || !cut.imageUrl} className="text-xs flex items-center gap-1 text-indigo-400 hover:text-indigo-300 disabled:opacity-50">
                      {cut.isGeneratingVideo ? <Loader2 className="w-3 h-3 animate-spin" /> : <RefreshCw className="w-3 h-3" />}
                      {cut.videoUrl ? '재생성' : '생성'}
                    </button>
                  </div>
                  <div className={`w-full bg-zinc-900 rounded-xl overflow-hidden border border-white/5 relative flex items-center justify-center ${ratio === '9:16' ? 'aspect-[9/16]' : ratio === '1:1' ? 'aspect-square' : ratio === '3:4' ? 'aspect-[3/4]' : 'aspect-video'}`}>
                    {cut.videoUrl ? (
                      <video src={cut.videoUrl} autoPlay loop muted playsInline className="w-full h-full object-cover" />
                    ) : cut.imageUrl ? (
                      <img src={cut.imageUrl} alt={`Cut ${index+1}`} className="w-full h-full object-cover opacity-50" />
                    ) : (
                      <Video className="w-8 h-8 text-zinc-700" />
                    )}
                    {cut.isGeneratingVideo && (
                      <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center backdrop-blur-sm">
                        <Loader2 className="w-6 h-6 text-white animate-spin mb-2" />
                        <span className="text-xs text-zinc-300">최대 몇 분 소요될 수 있습니다</span>
                      </div>
                    )}
                  </div>
                  <textarea 
                    value={cut.videoPrompt}
                    onChange={e => updateCut(index, { videoPrompt: e.target.value })}
                    className="w-full bg-transparent border border-white/10 rounded-lg text-zinc-400 focus:ring-1 focus:ring-indigo-500 p-2 resize-none h-20 text-xs"
                  />
                </div>
              ))}
            </div>
            
            <div className="pt-4 border-t border-white/10 flex justify-between">
              <button onClick={() => setCurrentStep(3)} className="px-6 py-3 bg-zinc-800 text-white rounded-xl font-semibold hover:bg-zinc-700 transition-all">이전 단계</button>
              <button onClick={() => setCurrentStep(5)} className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-500 transition-all">다음 단계로</button>
            </div>
          </section>
        )}

        {currentStep === 5 && cuts.length > 0 && (
          <section className="space-y-6 bg-zinc-900/40 p-6 rounded-3xl border border-white/5 animate-in fade-in slide-in-from-bottom-4">
            <h2 className="text-2xl font-semibold flex items-center gap-2">
              <span className="text-indigo-400">5.</span> 최종 확인 및 렌더링
            </h2>

            <div className="flex items-center gap-6">
              <button 
                onClick={() => setIncludeSubtitles(!includeSubtitles)}
                className="flex items-center gap-2 text-sm text-zinc-300 hover:text-white"
              >
                {includeSubtitles ? <CheckSquare className="w-5 h-5 text-indigo-500" /> : <Square className="w-5 h-5" />}
                자막 포함하여 렌더링
              </button>

              {!includeSubtitles && (
                <button onClick={downloadSRT} className="text-sm text-indigo-400 hover:underline flex items-center gap-1">
                  <Download className="w-4 h-4" /> SRT 자막 다운로드
                </button>
              )}
            </div>

            <div className={`bg-black rounded-2xl overflow-hidden relative border border-white/10 max-w-3xl mx-auto flex items-center justify-center ${ratio === '9:16' ? 'aspect-[9/16] max-h-[800px]' : ratio === '1:1' ? 'aspect-square max-h-[600px]' : ratio === '3:4' ? 'aspect-[3/4] max-h-[800px]' : 'aspect-video'}`}>
              {!isPlaying ? (
                <div className="text-center space-y-4">
                  <button 
                    onClick={handlePlay}
                    disabled={!allVideosReady || !allAudiosReady}
                    className="w-16 h-16 bg-white text-black rounded-full flex items-center justify-center mx-auto hover:scale-105 transition-transform disabled:opacity-50 disabled:hover:scale-100"
                  >
                    <Play className="w-8 h-8 ml-1" />
                  </button>
                  <p className="text-sm text-zinc-500">
                    {allVideosReady && allAudiosReady ? '최종 영상 미리보기' : '모든 영상과 음성을 생성해주세요'}
                  </p>
                </div>
              ) : (
                <>
                  <video 
                    ref={videoRef}
                    src={cuts[currentCutIndex].videoUrl}
                    onEnded={handleVideoEnded}
                    className="w-full h-full object-cover"
                  />
                  <audio 
                    ref={audioRef}
                    src={cuts[currentCutIndex].audioUrl}
                  />
                  {includeSubtitles && (
                    <div className="absolute bottom-0 left-0 right-0 h-[18%] bg-black/80 flex items-center justify-center px-8">
                      <div className="text-white text-lg sm:text-2xl font-bold text-center max-w-2xl">
                        {cuts[currentCutIndex].text}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-white/10">
              <button onClick={() => setCurrentStep(4)} className="px-6 py-3 bg-zinc-800 text-white rounded-xl font-semibold hover:bg-zinc-700 transition-all">이전 단계</button>
              
              <div className="flex gap-2">
                <button 
                  onClick={() => handleDownloadMP4('1080p')}
                  disabled={!allVideosReady}
                  className="h-[50px] px-6 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-500 transition-all disabled:opacity-50 flex items-center gap-2 shadow-lg shadow-indigo-500/20"
                >
                  <Download className="w-4 h-4" />
                  1080p 다운로드
                </button>
                <button 
                  onClick={() => handleDownloadMP4('720p')}
                  disabled={!allVideosReady}
                  className="h-[50px] px-6 bg-zinc-700 text-white rounded-xl font-semibold hover:bg-zinc-600 transition-all disabled:opacity-50 flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  720p
                </button>
                <button 
                  onClick={() => handleDownloadMP4('480p')}
                  disabled={!allVideosReady}
                  className="h-[50px] px-6 bg-zinc-700 text-white rounded-xl font-semibold hover:bg-zinc-600 transition-all disabled:opacity-50 flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  480p
                </button>
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
