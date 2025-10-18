import { useEffect, useRef } from 'react';
import { Button } from './ui/button';
import { X } from 'lucide-react';

export default function IntroVideo({ videoUrl, posterUrl, onEnd, onSkip }) {
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.play().catch(err => console.error('Video play error:', err));
    }
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-black flex items-center justify-center overflow-hidden">
      <video
        ref={videoRef}
        src={videoUrl}
        poster={posterUrl}
        className="w-full h-full object-contain md:object-cover"
        onEnded={onEnd}
        playsInline
        muted
        autoPlay
        webkit-playsinline="true"
      />
      <Button
        onClick={onSkip}
        className="absolute top-4 right-4 md:top-8 md:right-8 bg-primary/20 hover:bg-primary/40 backdrop-blur-sm text-white border border-primary"
        size="lg"
      >
        <X className="mr-2 h-4 w-4 md:h-5 md:w-5" />
        <span className="hidden sm:inline">Skip Intro</span>
        <span className="sm:hidden">Skip</span>
      </Button>
    </div>
  );
}

