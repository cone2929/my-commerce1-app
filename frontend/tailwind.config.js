module.exports = {
  content: [
    "./index.html",
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // 🐥🐥🐥🐥🐥 CSS 변수들을 Tailwind 색상으로 추가
        'bg-000': 'hsl(var(--bg-000))',
        'bg-100': 'hsl(var(--bg-100))',
        'bg-200': 'hsl(var(--bg-200))',
        'bg-300': 'hsl(var(--bg-300))',
        'bg-400': 'hsl(var(--bg-400))',
        'bg-500': 'hsl(var(--bg-500))',
        'border-100': 'hsl(var(--border-100))',
        'border-200': 'hsl(var(--border-200))',
        'border-300': 'hsl(var(--border-300))',
        'border-400': 'hsl(var(--border-400))',
        'text-000': 'hsl(var(--text-000))',
        'text-100': 'hsl(var(--text-100))',
        'text-200': 'hsl(var(--text-200))',
        'text-300': 'hsl(var(--text-300))',
        'text-400': 'hsl(var(--text-400))',
        'text-500': 'hsl(var(--text-500))',
        'accent-main-000': 'hsl(var(--accent-main-000))',
        'accent-main-100': 'hsl(var(--accent-main-100))',
        'accent-main-200': 'hsl(var(--accent-main-200))',
        'accent-main-900': 'hsl(var(--accent-main-900))',
        'accent-secondary-100': 'hsl(var(--accent-secondary-100))',
        'danger-000': 'hsl(var(--danger-000))',
        'danger-100': 'hsl(var(--danger-100))',
        'danger-200': 'hsl(var(--danger-200))',
        'danger-900': 'hsl(var(--danger-900))',
        'oncolor-100': 'hsl(var(--oncolor-100))',
        'oncolor-200': 'hsl(var(--oncolor-200))',
        'oncolor-300': 'hsl(var(--oncolor-300))',
        'always-white': 'hsl(var(--always-white))',
        'always-black': 'hsl(var(--always-black))',
      },
      fontFamily: {
        'ui': 'var(--font-ui)',
        'ui-serif': 'var(--font-ui-serif)',
        'claude-response': 'var(--font-claude-response)',
        'serif': 'var(--font-serif)',
        'sans-serif': 'var(--font-sans-serif)',
        'system': 'var(--font-system)',
        'dyslexia': 'var(--font-dyslexia)',
        'mono': 'var(--font-mono)',
        'sans': 'var(--font-ui)', // 기본 sans 폰트를 ui 폰트로 설정
        'heading': 'var(--font-ui-serif)', // 헤딩 폰트 추가
      },
      fontSize: {
        'large': ['1.125rem', { lineHeight: '1.75rem' }],
        'small': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem', { lineHeight: '1.5rem' }],
      },
      fontWeight: {
        'base-bold': '600',
      },
      borderWidth: {
        '0.5': '0.5px',
      },
      zIndex: {
        '2': '2',
      },
      // 🐥🐥🐥🐥🐥 플로팅 버튼을 위한 추가 설정
      scale: {
        '98': '0.98',
        '105': '1.05',
        '110': '1.10',
      },
      rotate: {
        '-3': '-3deg',
        '6': '6deg',
      }
    }
  }, 
  plugins: [
    require("@tailwindcss/forms"),
    require("daisyui"),
    require("@tailwindcss/line-clamp"),
  ],
  safelist: [
    'hs-accordion-active:block',
    'hs-accordion-active:hidden',
    'block',
    'hidden',
  ]
}



