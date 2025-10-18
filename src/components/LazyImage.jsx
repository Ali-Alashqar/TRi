import { useState, useEffect, useRef } from 'react';
import { cn } from '../lib/utils';

export default function LazyImage({ 
  src, 
  alt, 
  className,
  placeholder = 'https://via.placeholder.com/400x225?text=Loading...',
  ...props 
}) {
  const [imageSrc, setImageSrc] = useState(placeholder);
  const [imageLoaded, setImageLoaded] = useState(false);
  const imgRef = useRef(null);

  useEffect(() => {
    let observer;
    
    if (imgRef.current) {
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const img = new Image();
              img.src = src;
              img.onload = () => {
                setImageSrc(src);
                setImageLoaded(true);
              };
              observer.unobserve(entry.target);
            }
          });
        },
        { rootMargin: '50px' }
      );

      observer.observe(imgRef.current);
    }

    return () => {
      if (observer && imgRef.current) {
        observer.unobserve(imgRef.current);
      }
    };
  }, [src]);

  return (
    <img
      ref={imgRef}
      src={imageSrc}
      alt={alt}
      className={cn(
        'transition-opacity duration-300',
        imageLoaded ? 'opacity-100' : 'opacity-50',
        className
      )}
      loading="lazy"
      {...props}
    />
  );
}

