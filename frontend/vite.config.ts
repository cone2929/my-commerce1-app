import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [react()],
    server: {
        port: 3001,
        hmr: {
            port: 3001,
            overlay: true, // 에러 오버레이 활성화
        },
        watch: {
            usePolling: true,
            interval: 100, // 폴링 간격 단축
        },
        // 🔥 완전한 핫리로드를 위한 추가 설정
        host: true, // 모든 네트워크 인터페이스에서 접근 가능
        strictPort: true, // 포트가 사용 중이면 에러 발생
        open: false, // 자동 브라우저 열기 비활성화 (Electron에서 처리)
    },
    // 🔥 빌드 최적화
    build: {
        outDir: 'dist',
        sourcemap: true,
        rollupOptions: {
            output: {
                manualChunks: {
                    vendor: ['react', 'react-dom'],
                    ui: ['@heroicons/react', 'lucide-react'],
                }
            }
        }
    },
    // 🔥 개발 환경 최적화
    optimizeDeps: {
        include: ['react', 'react-dom', '@heroicons/react', 'lucide-react']
    },
    test: {
        globals: true,
        environment: 'jsdom',
        setupFiles: './src/setupTests.js', // 파일명/경로에 맞게 수정
    },
});