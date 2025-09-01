import React, { useState, useEffect } from 'react';

const UpdateNotification = () => {
  const [updateInfo, setUpdateInfo] = useState(null);
  const [progress, setProgress] = useState(0);
  const [isInstalling, setIsInstalling] = useState(false);

  useEffect(() => {
    // 업데이트 발견
    window.electronAPI?.onUpdateAvailable((data) => {
      setUpdateInfo(data);
    });

    // 다운로드 진행률
    window.electronAPI?.onUpdateProgress((data) => {
      setProgress(data.percent);
    });

    // 설치 중
    window.electronAPI?.onUpdateInstalling((data) => {
      setIsInstalling(true);
    });

    // 에러 발생
    window.electronAPI?.onUpdateError((data) => {
      console.error('Update error:', data);
      setUpdateInfo(null);
      setProgress(0);
      setIsInstalling(false);
    });
  }, []);

  if (isInstalling) {
    return (
      <div style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        background: '#4CAF50',
        color: 'white',
        padding: '15px 20px',
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        zIndex: 9999
      }}>
        <div>🔄 업데이트 설치 중...</div>
        <div style={{ fontSize: '12px', opacity: 0.9 }}>잠시만 기다려주세요</div>
      </div>
    );
  }

  if (updateInfo) {
    return (
      <div style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        background: '#2196F3',
        color: 'white',
        padding: '15px 20px',
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        zIndex: 9999,
        minWidth: '250px'
      }}>
        <div>📦 업데이트 v{updateInfo.version}</div>
        <div style={{ fontSize: '12px', margin: '5px 0' }}>
          {updateInfo.message}
        </div>
        {progress > 0 && (
          <div style={{ marginTop: '10px' }}>
            <div style={{ fontSize: '11px', marginBottom: '5px' }}>
              다운로드 중... {progress}%
            </div>
            <div style={{
              width: '100%',
              height: '4px',
              background: 'rgba(255,255,255,0.3)',
              borderRadius: '2px',
              overflow: 'hidden'
            }}>
              <div style={{
                width: `${progress}%`,
                height: '100%',
                background: 'white',
                transition: 'width 0.3s ease'
              }} />
            </div>
          </div>
        )}
      </div>
    );
  }

  return null;
};

export default UpdateNotification;
