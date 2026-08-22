import React, { useState, useEffect } from 'react';
import './floatingCart.css';

export default function FloatingCart({ savedRecords = [], setSavedRecords, onNavigate }) {
  const cartCount = savedRecords.length;
  const [displayCount, setDisplayCount] = useState(savedRecords.length);
  const [isShaking, setIsShaking] = useState(false);

  const [showScrollTop, setShowScrollTop] = useState(false);

  // savedRecords.length가 변경될 때마다 뱃지 흔들림 효과 유발 및 애니메이션 종료 후 숫자 변경
  useEffect(() => {
    if (cartCount !== displayCount) {
      setIsShaking(true);
      const shakeTimer = setTimeout(() => {
        setIsShaking(false);
      }, 400); // 흔들림 애니메이션 시간 (0.4초)

      const countTimer = setTimeout(() => {
        setDisplayCount(cartCount);
      }, 400); // 0.4초 후에 숫자를 변경

      return () => {
        clearTimeout(shakeTimer);
        clearTimeout(countTimer);
      };
    }
  }, [cartCount, displayCount]);

  // 스크롤 감지하여 맨 위로 가기 버튼 노출 여부 결정
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 80) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // displayCount가 0이 되었을 때 즉시 업데이트 처리
  useEffect(() => {
    if (cartCount === 0) {
      setDisplayCount(0);
    }
  }, [cartCount]);



  // 바구니버튼 클릭 시 목록 페이지로 
  const handleCartClick = () => {
    if (onNavigate) {
      onNavigate('Recode');
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <div className="floating-cart-container">
      {/* 바구니 이미지 버튼 -> SVG 라인 드로잉 벡터 아이콘으로 대체 */}
      <button className="cart-emoji-button" onClick={handleCartClick} title="바구니 보관함 가기">
        <svg viewBox="0 0 24 24" className="cart-svg-icon">
          <rect x="3" y="8" width="18" height="13" rx="2" ry="2" />
          <path d="M8 8V6a4 4 0 0 1 8 0v2" />
        </svg>
        {/* 개수 뱃지 */}
        {displayCount > 0 && (
          <span className={`cart-badge-count ${isShaking ? 'is-shaking' : ''}`}>
            {displayCount}
          </span>
        )}
      </button>

      {/* 맨 위로 가기 버튼 */}
      {showScrollTop && (
        <button className="scroll-top-button" onClick={scrollToTop} title="맨 위로 이동">
          🡡
        </button>
      )}
    </div>
  );
}
