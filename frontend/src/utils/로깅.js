// 🐥🐥🐥🐥🐥 로깅 유틸리티
const isDevelopment = process.env.NODE_ENV === 'development';

export const logger = {
  log: (...args) => {
    if (isDevelopment) {
  
    }
  },
  
  error: (...args) => {
    if (isDevelopment) {
  
    }
  },
  
  warn: (...args) => {
    if (isDevelopment) {
  
    }
  },
  
  info: (...args) => {
    if (isDevelopment) {
      console.info(...args);
    }
  }
};

// 🐥🐥🐥🐥🐥 성능 측정 유틸리티
export const performance = {
  start: (label) => {
    if (isDevelopment) {
      console.time(label);
    }
  },
  
  end: (label) => {
    if (isDevelopment) {
      console.timeEnd(label);
    }
  }
};
