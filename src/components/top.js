import React from 'react';
import './top.css';
import logoImg from './imos/BottleFolw.png';
import basketImg from './imos/상단바구니.png';

function Top({ onNavigate, savedRecords = [], currentView = 'home', isLeafPaused = false }) {

  const handleMenuClick = (targetView) => {
    if (onNavigate) {
      onNavigate(targetView); // mainApp의 view 상태를 변경->화면 전환
    }
  };

  const cartCount = savedRecords.length;

  return (
    <header className={`top-header ${currentView === 'calculator' ? 'is-hover-reveal' : 'is-fixed'}`}>
      <div className={`leaf-container ${(isLeafPaused || currentView === 'Recode') ? 'is-paused' : ''}`}>
        <span className="leaf-item leaf-1">🍃</span>
        <span className="leaf-item leaf-2">🍂</span>
        <span className="leaf-item leaf-3">🌿</span>
        <span className="leaf-item leaf-4">🍁</span>
      </div>
      <div className="top-nav-container">

        {/* 좌측 상단-로고 */}
        <div className="top-logo" onClick={() => handleMenuClick('home')}>
          <img
            src={logoImg}
            alt="bottleflow 로고"
            className="logo-image"
          />
        </div>

        {/* 우측 -메뉴들 */}
        <div className="top-right-wrapper">
          <nav className="top-desktop-menu">
            <ul className="desktop-menu-list">
              <li onClick={() => handleMenuClick('home')}>메인으로</li>
              <li onClick={() => handleMenuClick('tabs')}>브랜드 솔루션</li>
              <li onClick={() => handleMenuClick('calculator')}>공병 계산기</li>
            </ul>
          </nav>

          {/* 우측 끝-바구니 */}
          <div className="top-right-actions">
            <button className="nav-action-btn cart-btn" onClick={() => handleMenuClick('Recode')} title="기록 바구니">
              <img
                src={basketImg}
                alt="기록 바구니"
                className="nav-cart-image"
              />
              {/* 바구니 개수 뱃지*/}
              {cartCount > 0 && (
                <span className="nav-cart-badge">{cartCount}</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Top;
