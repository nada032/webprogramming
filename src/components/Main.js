import React, { useState, useEffect } from 'react';
import './Main.css';
import iceBg from './imos/ice2.jpg';


function Main({ onNavigate }) {
  const slides = [
    {
      type: 'intro',
      title: '지구를 살리는 작은 실천',
      description: '다 쓴 화장품 공병, 버리지 말고 지구에게 시간을 선물하세요.'
    },
    {
      type: 'start',
      label: '지구 지키기',
      value: '500년의 시간',
      description: '플라스틱 컵 하나가 지구에서 완전히 사라지기까지 약 500년, 재활용으로 그 시간을 멈출 수 있습니다.'
    },
    {
      type: 'stat',
      label: '자원 회수',
      value: '연간 약 295톤',
      description: '연간 295톤의 공병이 버려지는 대신, 완벽한 자원으로 다시 태어납니다.'
    },
    {
      type: 'stat',
      label: '북극 빙하',
      value: '연간 약 1,770㎡',
      description: '국제 규격 축구장 4분의 1 면적의 북극 빙하를 매년 녹지 않게 보호합니다.'
    },
    {
      type: 'stat',
      label: '탄소 배출 상쇄',
      value: '지구 약 90바퀴',
      description: '승용차로 지구 90바퀴를 달릴 때 나오는 온실가스를 매년 깨끗하게 지워내고 있습니다.'
    },
    {
      type: 'stat',
      label: '소나무 대체 효과',
      value: '약 10만 4천 그루',
      description: '매년 30년생 소나무 10만 4천 그루를 새로 심는 것과 똑같은 청정 가치를 만들어냅니다.'
    },

  ];

  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 8000);
    return () => clearInterval(timer);
  }, [slides.length, currentSlide]);

  return (
    <div className="main-page-container">
      {/* 메안배너 */}
      <section
        className="main-banner"
        style={{
          backgroundImage: `url(${iceBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <div className="banner-text-slider">
          <div className="banner-slides-wrapper" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
            {slides.map((slide, idx) => (
              <div
                key={idx}
                className={`banner-slide-item ${idx === currentSlide ? 'active' : ''}`}
              >
                {slide.type === 'intro' ? (
                  <div className="banner-text">
                    <h1>{slide.title}</h1>
                    <p>{slide.description}</p>
                  </div>
                ) : (
                  <div className="banner-stat-slide">
                    <div className="banner-stat-badge">
                      <span className="banner-stat-label">{slide.label}</span>
                    </div>
                    <h1 className="banner-stat-value">{slide.value}</h1>
                    <p className="banner-stat-desc">{slide.description}</p>

                    {slide.label === '지구 지키기' && idx === currentSlide && (
                      <div className="banner-protect-animation">
                        <span className="wiggle-hourglass">⏳</span>
                        <span className="floating-earth-emoji">🌎</span>
                      </div>
                    )}

                    {slide.label === '자원 회수' && idx === currentSlide && (
                      <div className="banner-recycle-animation">
                        <span className="recycle-icon">♻️</span>
                        <span className="diamond-icon">💎</span>
                      </div>
                    )}

                    {slide.label === '탄소 배출 상쇄' && idx === currentSlide && (
                      <div className="banner-car-animation">
                        <span className="running-car">🚗</span>
                        <div className="smoke-container">
                          <span className="smoke smoke-1">💨</span>
                          <span className="smoke smoke-2">💨</span>
                        </div>
                      </div>
                    )}

                    {slide.label === '북극 빙하' && idx === currentSlide && (
                      <div className="banner-cloud-animation">
                        <div className="clouds-container">
                          <span className="cloud-emoji " style={{ left: '-80px' }}>☁️</span>
                          <span className="cloud-emoji " style={{ left: '0px' }}>☁️</span>
                          <span className="cloud-emoji " style={{ left: '80px' }}>☁️</span>
                        </div>
                        <span className="glacier-emoji">🧊</span>
                      </div>
                    )}

                    {slide.label === '소나무 대체 효과' && idx === currentSlide && (
                      <div className="banner-growing-trees">
                        <span className="growing-tree tree-1">🌲</span>
                        <span className="growing-tree tree-2">🌲</span>
                        <span className="growing-tree tree-3">🌲</span>
                        <span className="growing-tree tree-4">🌲</span>
                        <span className="growing-tree tree-5">🌲</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
          {/* 슬라이드 조절점 */}
          <div className="banner-dots">
            {slides.map((_, idx) => (
              <span
                key={idx}
                className={`banner-dot ${idx === currentSlide ? 'active' : ''}`}
                onClick={() => setCurrentSlide(idx)}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="menu-cards-section">
        <h2>무엇을 도와드릴까요?</h2>
        <div className="cards-grid">
          <div className="menu-card" onClick={() => onNavigate('tabs')}>
            <div className="card-icon">🌍</div>
            <h3>브랜드 솔루션</h3>
            <p>아모레퍼시픽, 올리브영, 이니스프리, 러쉬의 공병 수거 기준과 혜택을 한눈에 확인하세요.</p>
            <span className="go-btn">바로가기 →</span>
          </div>

          <div className="menu-card" onClick={() => onNavigate('calculator')}>
            <div className="card-icon">🌱</div>
            <h3>공병 계산기</h3>
            <p>내가 모은 공병들을 가상 장바구니에 담아 예상 적립금과 환경 기여도를 미리 계산해 보세요.</p>
            <span className="go-btn">바로가기 →</span>
          </div>

          <div className="menu-card" onClick={() => onNavigate('Recode')}>
            <div className="card-icon">🔖</div>
            <h3>기록 바구니</h3>
            <p>저장해둔 기록을 한눈에 확인하세요.</p>
            <span className="go-btn">바로가기 →</span>
          </div>
        </div>
      </section>
    </div >
  );
}

export default Main;
