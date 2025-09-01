import { useCallback, useMemo, useRef, useState, useEffect } from 'react';

// 🐥🐥🐥🐥🐥 디바운스 훅
export const useDebounce = (callback, delay) => {
  const timeoutRef = useRef(null);
  
  return useCallback((...args) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    timeoutRef.current = setTimeout(() => {
      callback(...args);
    }, delay);
  }, [callback, delay]);
};

// 🐥🐥🐥🐥🐥 쓰로틀 훅
export const useThrottle = (callback, delay) => {
  const lastCall = useRef(0);
  
  return useCallback((...args) => {
    const now = Date.now();
    
    if (now - lastCall.current >= delay) {
      lastCall.current = now;
      callback(...args);
    }
  }, [callback, delay]);
};

// 🐥🐥🐥🐥🐥 메모이제이션된 필터링
export const useFilteredData = (data, filterFn, dependencies = []) => {
  return useMemo(() => {
    return data.filter(filterFn);
  }, [data, filterFn, ...dependencies]);
};

// 🐥🐥🐥🐥🐥 메모이제이션된 정렬
export const useSortedData = (data, sortFn, dependencies = []) => {
  return useMemo(() => {
    return [...data].sort(sortFn);
  }, [data, sortFn, ...dependencies]);
};

// 🐥🐥🐥🐥🐥 이미지 지연 로딩
export const useLazyImage = (src, placeholder = '') => {
  const [imageSrc, setImageSrc] = useState(placeholder);
  const [isLoaded, setIsLoaded] = useState(false);
  
  useEffect(() => {
    if (!src) return;
    
    const img = new Image();
    img.src = src;
    
    img.onload = () => {
      setImageSrc(src);
      setIsLoaded(true);
    };
    
    img.onerror = () => {
      setImageSrc(placeholder);
      setIsLoaded(false);
    };
  }, [src, placeholder]);
  
  return { imageSrc, isLoaded };
};

// 🐥🐥🐥🐥🐥 가상화를 위한 아이템 청크 생성
export const createItemChunks = (items, chunkSize = 20) => {
  const chunks = [];
  for (let i = 0; i < items.length; i += chunkSize) {
    chunks.push(items.slice(i, i + chunkSize));
  }
  return chunks;
};

// 🐥🐥🐥🐥🐥 메모리 사용량 최적화
export const optimizeMemoryUsage = () => {
  // 🐥🐥🐥🐥🐥 가비지 컬렉션 힌트
  if (window.gc) {
    window.gc();
  }
  
  // 🐥🐥🐥🐥🐥 이미지 캐시 정리
  if ('caches' in window) {
    caches.keys().then(names => {
      names.forEach(name => {
        if (name.includes('image-cache')) {
          caches.delete(name);
        }
      });
    });
  }
};

// 🐥🐥🐥🐥🐥 성능 모니터링
export const performanceMonitor = {
  start: (label) => {
    if (performance && performance.mark) {
      performance.mark(`${label}-start`);
    }
  },
  
  end: (label) => {
    if (performance && performance.mark && performance.measure) {
      performance.mark(`${label}-end`);
      performance.measure(label, `${label}-start`, `${label}-end`);
      
      const measure = performance.getEntriesByName(label)[0];
      if (measure && measure.duration > 100) {

      }
    }
  }
};
