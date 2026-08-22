import React, { useState, useEffect } from 'react';
import './App.css';
import Top from './components/top';
import Main from './components/Main';
import CompanyTabs from './components/companytabs';
import BBasket from './components/bbasket';
import Recode from './components/recode';

function MainApp() {
  // SPA
  const [view, setView] = useState('home');
  const [isLeafPaused, setIsLeafPaused] = useState(false);
  const [tabsKey, setTabsKey] = useState(0);
  const [calculatorKey, setCalculatorKey] = useState(0);

  // 바구니에 담아둔 기록 목록 상태 (로컬스토리지 연동)
  const [savedRecords, setSavedRecords] = useState(() => {
    try {
      const saved = localStorage.getItem('bbasket_saved_records');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  // savedRecords 상태 변경->로컬스토리지에 저장
  useEffect(() => {
    try {
      localStorage.setItem('bbasket_saved_records', JSON.stringify(savedRecords));
    } catch (e) {
      console.error(e);
    }
  }, [savedRecords]);

  // 2. 자식 컴포넌이 부모의 상태를 바꾸는 리모컨
  const onNavigate = (nextView) => {
    setView(nextView);
    setIsLeafPaused(false); // 페이지 이동 시 나뭇잎 동작
    window.scrollTo(0, 0);  // 이동 시 항상 상단화면
    if (nextView === 'tabs') {
      setTabsKey(prev => prev + 1); // 브랜드 솔루션->상세 초기화
    }
    if (nextView === 'calculator') {
      setCalculatorKey(prev => prev + 1); // 공병 계산기->상태 초기화
    }
  };

  // 3. view 상태값->본문 컴포넌트 결정
  const renderContent = () => {
    switch (view) {
      case 'home':
        // 홈 화면->리모컨 전달
        return <Main onNavigate={onNavigate} />;
      case 'tabs':
        // 브랜드 상세설명
        return <CompanyTabs key={tabsKey} onNavigate={onNavigate} setIsLeafPaused={setIsLeafPaused} />;
      case 'calculator':
        // 공병 계산기
        return (
          <BBasket
            key={calculatorKey}
            onNavigate={onNavigate}
            savedRecords={savedRecords}
            setSavedRecords={setSavedRecords}
          />
        );
      case 'Recode':
        // 기록 
        return (
          <Recode
            onNavigate={onNavigate}
            savedRecords={savedRecords}
            setSavedRecords={setSavedRecords}
          />
        );
      default:
        return <Main onNavigate={onNavigate} />;
    }
  };

  return (
    <div className="app-container">
      {/* 상단 헤더 내비바는 고정, onNavigate로 메뉴 클릭 시 화면 전환 */}
      <Top onNavigate={onNavigate} savedRecords={savedRecords} currentView={view} isLeafPaused={isLeafPaused} />

      {/* view 상태에 따라 실시간으로 변함 */}
      <main className="main-content">
        {renderContent()}
      </main>
    </div>
  );
}

export default MainApp;