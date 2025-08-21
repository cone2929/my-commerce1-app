import React from 'react';

const 플로팅버튼 = ({ onClick, 아이콘 = "plus", 제목 = "추가" }) => {
  return (
    <button
      className="floating-button group"
      onClick={onClick}
      title={제목}
      aria-label={제목}
    >
      <div className="floating-button-icon" style={{ width: '18px', height: '18px' }}>
        {아이콘 === "plus" && (
          <svg 
            width="24" 
            height="24" 
            viewBox="0 0 20 20" 
            fill="currentColor" 
            xmlns="http://www.w3.org/2000/svg" 
            className="shrink-0 transition text-always-white" 
            aria-hidden="true"
          >
            <path d="M10 3C10.4142 3 10.75 3.33579 10.75 3.75V9.25H16.25C16.6642 9.25 17 9.58579 17 10C17 10.3882 16.7051 10.7075 16.3271 10.7461L16.25 10.75H10.75V16.25C10.75 16.6642 10.4142 17 10 17C9.58579 17 9.25 16.6642 9.25 16.25V10.75H3.75C3.33579 10.75 3 10.4142 3 10C3 9.58579 3.33579 9.25 3.75 9.25H9.25V3.75C9.25 3.33579 9.58579 3 10 3Z"></path>
          </svg>
        )}
        {아이콘 === "edit" && (
          <svg 
            width="24" 
            height="24" 
            viewBox="0 0 20 20" 
            fill="currentColor" 
            xmlns="http://www.w3.org/2000/svg" 
            className="shrink-0 transition text-always-white" 
            aria-hidden="true"
          >
            <path d="M5.433 13.917l1.262-3.155A4 4 0 017.58 9.42l6.92-6.918a2.121 2.121 0 013 3l-6.92 6.918c-.383.383-.84.685-1.343.886l-3.154 1.262a.5.5 0 01-.65-.65z"></path>
            <path d="M3.5 5.75c0-.69.56-1.25 1.25-1.25H10A.75.75 0 0010 3H4.75A2.75 2.75 0 002 5.75v9.5A2.75 2.75 0 004.75 18h9.5A2.75 2.75 0 0017 15.25V10a.75.75 0 00-1.5 0v5.25c0 .69-.56 1.25-1.25 1.25h-9.5c-.69 0-1.25-.56-1.25-1.25v-9.5z"></path>
          </svg>
        )}
        {아이콘 === "delete" && (
          <svg 
            width="24" 
            height="24" 
            viewBox="0 0 20 20" 
            fill="currentColor" 
            xmlns="http://www.w3.org/2000/svg" 
            className="shrink-0 transition text-always-white" 
            aria-hidden="true"
          >
            <path fillRule="evenodd" d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807c1.242 0 2.27-.875 2.813-1.968l.841-10.518.149.022a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193V3.75A2.75 2.75 0 0011.25 1h-2.5zM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4zM8.58 7.72a.75.75 0 00-1.5.06l.3 7.5a.75.75 0 101.5-.06l-.3-7.5zm4.34.06a.75.75 0 10-1.5-.06l-.3 7.5a.75.75 0 101.5.06l.3-7.5z" clipRule="evenodd"></path>
          </svg>
        )}
        {아이콘 === "search" && (
          <svg 
            width="24" 
            height="24" 
            viewBox="0 0 20 20" 
            fill="currentColor" 
            xmlns="http://www.w3.org/2000/svg" 
            className="shrink-0 transition text-always-white" 
            aria-hidden="true"
          >
            <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" clipRule="evenodd"></path>
          </svg>
        )}
        {아이콘 === "settings" && (
          <svg 
            width="24" 
            height="24" 
            viewBox="0 0 20 20" 
            fill="currentColor" 
            xmlns="http://www.w3.org/2000/svg" 
            className="shrink-0 transition text-always-white" 
            aria-hidden="true"
          >
            <path fillRule="evenodd" d="M7.84 1.804A1 1 0 018.82 1h2.36a1 1 0 01.98.804l.331 1.652a6.993 6.993 0 011.929 1.115l1.598-.54a1 1 0 011.186.447l1.18 2.044a1 1 0 01-.205 1.251l-1.267 1.113a7.047 7.047 0 010 2.228l1.267 1.113a1 1 0 01.206 1.25l-1.18 2.045a1 1 0 01-1.187.447l-1.598-.54a6.993 6.993 0 01-1.93 1.115l-.33 1.652a1 1 0 01-.98.804H8.82a1 1 0 01-.98-.804l-.331-1.652a6.993 6.993 0 01-1.929-1.115l-1.598.54a1 1 0 01-1.186-.447l-1.18-2.044a1 1 0 01.205-1.251l1.267-1.114a7.05 7.05 0 010-2.227L1.821 7.773a1 1 0 01-.206-1.25l1.18-2.045a1 1 0 011.187-.447l1.598.54A6.993 6.993 0 017.51 3.456l.33-1.652zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd"></path>
          </svg>
        )}
      </div>
    </button>
  );
};

export default 플로팅버튼;
