import React, { useState, useEffect } from 'react';
import './companytabs.css';
import logoOliveyoung from './imos/olv.png';
import logoAmore from './imos/아모레.png';
import logoInnisfree from './imos/이니스.png';
import logoLush from './imos/러쉬.png';

const APPLE_STYLE_BRAND_INFO = {
  oliveyoung: {
    title: "Beauty Cycle",
    summary: "집구석 모든 공병의 재탄생!",
    sections: [
      {
        tag: "수거 방식",
        headline: "가까운 매장 방문. 제한 없는 즉시 반납.",
        desc: "근처 올리브영 매장을 포함한 전 매장에 방문하여 편하게 반납하실 수 있습니다.\n하루에 한 번씩 언제든 참여 가능합니다.",
        visual: "📍"
      },
      {
        tag: "수거 가능품목",
        headline: "브랜드 상관없이, 모든 플라스틱 용기.",
        desc: "올리브영에서 판매하는 제품뿐만 아니라 타사 브랜드 화장품의 스킨케어, 클렌징, 선케어, \n바디/헤어케어 제품 등의 본품 용기를 환영합니다.",
        visual: "🧴"
      },
      {
        tag: "참여 혜택",
        headline: "공병의 재탄생. 즉시 사용 가능한 할인 쿠폰.",
        desc: "공병 반납 참여 시 올리브영 매장에서 2만원 이상 구매 시 사용할 수 있는\n2,000원 상당의 모바일 할인 쿠폰을 즉시 제공받으실 수 있습니다.",
        visual: "🎁"
      },
      {
        tag: "세척 방법",
        headline: "깨끗하게 비우고 , 완전하게 건조.",
        desc: "용기 내부의 잔여 내용물이 없도록 물로 깨끗이 씻어낸 뒤 완전히 건조하고, \n외부 라벨 스티커를 떼어낸 뒤 반납해 주세요.",
        visual: "🧼"
      },
      {
        tag: "불가능 지점",
        headline: "일부 복합몰 및 특수 매장 제외.",
        desc: "대형마트, 백화점, 아울렛 등 복합 쇼핑몰 내 입점된 특수 매장 및 일부 소규모 지점에서는 수거가 불가능할 수 있으니 방문 전 확인이 필요합니다.",
        visual: "⚠️"
      },
      {
        tag: "재활용 방식",
        headline: "새로운 화장품 용기와 유용한 생활용품으로.",
        desc: "수거된 공병들은 고품질 플라스틱(PCR) 원료로 재생 가공되어 새로운 화장품 용기로 재제작되거나, 친환경 굿즈로 재탄생합니다.",
        visual: "♻️"
      }
    ]
  },
  amore: {
    title: "Amore Recycle",
    summary: "아모레 브랜드 유저라면 필수! 집에서도 쉽게 자연지키기",
    sections: [
      {
        tag: "수거 방식",
        headline: "매장 직접 반납 OR 문 앞 온라인 신청.",
        desc: "아모레퍼시픽 계열 브랜드 오프라인 매장 반납은 물론, 공병 10개 이상 적립 시 \n아모레몰에서 무상 온라인 수거를 신청하여 문 앞에 내놓으실 수 있습니다.",
        visual: "📦",
        applyLink: "https://www.amoremall.com/kr/ko/my/page/recycle",
        applyLabel: "아모레몰 온라인 수거 신청하기"
      },
      {
        tag: "수거 가능품목",
        headline: "아모레퍼시픽 계열 브랜드 본품 공병 일체.",
        desc: "설화수, 헤라, 아이오페, 한율, 라네즈, 마몽드, 일리윤, 려, 미장센 등 \n아모레퍼시픽 그룹 산하 브랜드의 스킨케어, 메이크업(쿠션), 향수 용기 본품을 수거합니다.",
        visual: "🧴"
      },
      {
        tag: "참여 혜택",
        headline: "의미 있는 뷰티포인트 리워드.",
        desc: "공병 1개당 뷰티포인트 300P를 적립해 드리며, \n온라인으로 묶음 신청 시 1,000p 적립이 가능합니다.",
        visual: "🎁"
      },
      {
        tag: "세척 방법",
        headline: "자르고 비우기. 완전한 자원 순환을 위한 기초.",
        desc: "잔여물을 비우고 헹군 후 말려야 하며, 특히 튜브 제품은 가위로 반을 갈라 \n내부를 깨끗이 닦아낸 다음 잘린 조각들을 모아서 반납해야 합니다.",
        visual: "🧼"
      },
      {
        tag: "불가능 지점",
        headline: "백화점 매장 및 타 브랜드 편집숍 제외.",
        desc: "백화점 내 단독 카운터나 타사 멀티 편집숍에 입점된 형태의 매장에서는 \n공병 수거 서비스 접수가 제한될 수 있습니다.",
        visual: "❌"
      },
      {
        tag: "재활용 방식",
        headline: "Upcycling과 친환경 벤치 제작.",
        desc: "회수된 플라스틱 및 유리 공병들은 원료화 공정을 거쳐 친환경 화장품 패키지 제작뿐만 아니라 업사이클링 예술품이나 공공 벤치 제작 등 도시 재생 프로젝트에 기여합니다.",
        visual: "♻️"
      }
    ]
  },
  innisfree: {
    title: "Bottle Re:Play",
    summary: "자연으로 돌아가는 공병",
    sections: [
      {
        tag: "수거 방식",
        headline: "매장 방문 OR 이니스프리몰 온라인 수거 신청.",
        desc: "가까운 이니스프리 매장에 방문하시거나, 공병 10개 이상 모였을 때 이니스프리 공식 온라인몰을 통해 무료 택배 수거를 간편히 신청하실 수 있습니다.",
        visual: "📦",
        applyLink: "https://www.innisfree.com/kr/ko/or/ebotlct",
        applyLabel: "이니스프리몰 온라인 수거 신청하기"
      },
      {
        tag: "수거 가능품목",
        headline: "이니스프리 브랜드 유리/플라스틱 본품.",
        desc: "이니스프리 공식 스킨케어, 클렌징, 선케어, 핸드크림, 향수/디퓨저, \n유리/플라스틱 재질 용기 및 네일리무버 공병을 수거 범위로 인정합니다.",
        visual: "🧴"
      },
      {
        tag: "참여 혜택",
        headline: "환경 보호의 리워드.",
        desc: "기본 공병 개당 300P를 적립해주며,(온/오프 총) 월 최대 3,000p까지 적립 가능합니다! ",
        visual: "🎁"
      },
      {
        tag: "세척 방법",
        headline: "액체를 비우고, 크림은 닦아내고.",
        desc: "스킨, 세럼 등 액체는 가볍게 헹구고, 수분크림 등 점성이 있는 제형은 \n휴지로 내부를 닦아낸 다음 씻어 완전히 건조하여 반납해야 합니다.",
        visual: "🧼"
      },
      {
        tag: "불가능 지점",
        headline: "마트 입점 매장 및 일부 면세점 매장 제외.",
        desc: "대형마트 내부 입점 매장 및 아울렛, 면세점 내 위치한 일부 이니스프리 매장에서는 \n전산이나 수거 인프라 한계로 인해 공병 접수가 불가능할 수 있습니다.",
        visual: "⚠️"
      },
      {
        tag: "재활용 방식",
        headline: "Bottle Re:Play 자원 재순환.",
        desc: "회수된 이니스프리 유리 공병은 분쇄되어 다시 친환경 유리 용기로 제작되며, \n플라스틱 공병들은 인테리어 마감재나 친환경 매장 선반 가구로 재자원화됩니다.",
        visual: "♻️"
      }
    ]
  },
  lush: {
    title: "Bring It Back",
    summary: "친환경을 위한 리턴",
    sections: [
      {
        tag: "수거 방식",
        headline: "다섯 개를 모아, 매장으로 향하세요.",
        desc: "깨끗하게 세척한 러쉬의 빈 팟 용기 5개를 가방에 담아 \n백화점 또는 로드숍 러쉬 오프라인 매장에 방문하시어 직원에 제출하시면 됩니다.",
        visual: "📍"
      },
      {
        tag: "수거 가능품목",
        headline: "러쉬의 오리지널 블랙팟 / 화이트팟 용기.",
        desc: "용기 하단에 재활용 마크 PP(폴리프로필렌) 소재 표기가 있고,\n 용량이 45g 이상인 러쉬 오리지널 블랙팟 또는 화이트팟 제품 용기가 수거 대상입니다.",
        visual: "🧴"
      },
      {
        tag: "참여 혜택",
        headline: "프레쉬 마스크팩 교환 OR 즉시 할인.",
        desc: "모아주신 공병 5개는 25,000원 상당의 러쉬 프레쉬 마스크팩 1개로 즉시 맞교환되거나,\n 개당 1,000원 매장 현장 즉시 할인 혜택으로 자유롭게 선택하실 수 있습니다.",
        visual: "🎁"
      },
      {
        tag: "세척 방법",
        headline: "완벽하게, 물기 없이.",
        desc: "내부에 남아 있는 마스크팩이나 워시 찌꺼기를 깨끗하게 세척하고 \n완전히 건조하여 지참해야 합니다.",
        visual: "🧼"
      },
      {
        tag: "불가능 지점",
        headline: "스파 전용 지점 및 온라인 택배 수거 불가.",
        desc: "러쉬 스파 트리트먼트 전용 지점 등 일부 특수 매장에서는 물류 한계로 현장 수거가 불가능할 수 있으며, 온라인/택배를 통한 공병 접수는 지원하지 않습니다.",
        visual: "⚠️"
      },
      {
        tag: "재활용 방식",
        headline: "Bring It Back 순환 폐루프 재생 공정.",
        desc: "수거된 팟 용기들은 러쉬 재생 공장으로 이송되어 잘게 분쇄되고 펠릿 형태로 성형된 후,\n 100% 다시 새로운 러쉬 블랙팟 용기와 뚜껑으로 재탄생합니다.",
        visual: "♻️"
      }
    ]
  }
};

function CompanyTabs({ onNavigate, setIsLeafPaused }) {
  // 선택된 브랜드를 관리하는 상태 
  const [activeBrand, setActiveBrand] = useState(null);

  // 컴포넌트 없을 시 나뭇잎 동작
  useEffect(() => {
    return () => {
      if (setIsLeafPaused) {
        setIsLeafPaused(false);
      }
    };
  }, [setIsLeafPaused]);

  // 로고 클릭 시 레이아웃을 전환
  const handleLogoClick = (brand) => {
    setActiveBrand(brand);
    if (setIsLeafPaused) {
      setIsLeafPaused(true); // 브랜드 상세로-> 나뭇잎 정지
    }
  };

  // 다시 로고 보이는 페이지로 되돌아가는 
  const handleReset = (e) => {
    e.stopPropagation(); // 부모 클릭 이벤트 방지
    setActiveBrand(null);
    if (setIsLeafPaused) {
      setIsLeafPaused(false); // 브랜드 선택 페이지에서는 다시 나뭇잎작동
    }
  };

  return (
    <div className={`page-container ${activeBrand ? 'active-layout' : ''}`}>
      {!activeBrand && (
        <div className="top-title-area">
          <span className="top-subtitle">BRAND SOLUTION</span>
          <h1 className="top-main-title">브랜드를 선택하세요.</h1>
          <p className="top-desc-text">지구를 위한 4가지 특별한 솔루션, 지금 바로 한눈에 !</p>
        </div>
      )}
      <div className="logo-wrapper">
        <div
          className={`logo-item ${activeBrand === 'oliveyoung' ? 'move-up' : ''} ${activeBrand && activeBrand !== 'oliveyoung' ? 'fade-out' : ''}`}
          onClick={() => handleLogoClick('oliveyoung')}
        >
          <div className="logo-card" style={{ background: "linear-gradient(#4070089d, #e8f7d89d)" }}>
            <img src={logoOliveyoung} alt="Olive Young" width="150" height="150" />
          </div>
        </div>
        <div
          className={`logo-item ${activeBrand === 'amore' ? 'move-up' : ''} ${activeBrand && activeBrand !== 'amore' ? 'fade-out' : ''}`}
          onClick={() => handleLogoClick('amore')}
        >
          <div className="logo-card" style={{ background: "linear-gradient(#2358709d, #e0f4fd9d)" }}>
            <img src={logoAmore} alt="Amorepacific" width="220" height="220" />
          </div>
        </div>
        <div
          className={`logo-item innisfree-item ${activeBrand === 'innisfree' ? 'move-up ' : ''} ${activeBrand && activeBrand !== 'innisfree' ? 'fade-out' : ''}`}
          onClick={() => handleLogoClick('innisfree')}
        >
          <div className="logo-card" style={{ background: "linear-gradient(#54916b94, #cee2d694)" }}>
            <img src={logoInnisfree} alt="Innisfree" width="220" height="220" />
          </div>
        </div>

        <div
          className={`logo-item ${activeBrand === 'lush' ? 'move-up' : ''} ${activeBrand && activeBrand !== 'lush' ? 'fade-out' : ''}`}
          onClick={() => handleLogoClick('lush')}
        >
          <div className="logo-card" style={{ background: "linear-gradient(#5c5a5aff, #ccc7c7ff)" }}>
            <img src={logoLush} alt="Lush" width="220" height="220" />
          </div>
        </div>

      </div>
      {activeBrand && APPLE_STYLE_BRAND_INFO[activeBrand] && (
        <>
          <button className="floating-reset-btn" onClick={handleReset}>
            브랜드 목록
          </button>

          {/* 상세메뉴리스트버튼*/}
          <div className="quick-nav-container">
            <div className="quick-nav-menu">
              {APPLE_STYLE_BRAND_INFO[activeBrand].sections.map((sec, idx) => (
                <button
                  key={idx}
                  className="quick-nav-item"
                  onClick={() => {
                    const el = document.getElementById(`section-${idx}`);
                    if (el) {
                      el.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                >
                  {sec.tag}
                </button>
              ))}
            </div>
            <button className="quick-nav-trigger-btn">
              메뉴
            </button>
          </div>

          <div className="apple-scroll-container">
            <div className="apple-fullscreen-section intro-section">
              <div className="apple-section-content">
                <span className="apple-tag">BRAND SOLUTION</span>
                <h1 className="apple-headline">{APPLE_STYLE_BRAND_INFO[activeBrand].title}</h1>
                <p className="apple-desc">{APPLE_STYLE_BRAND_INFO[activeBrand].summary}</p>
                <div className="scroll-indicator">스크롤하여 상세 가이드 보기 ↓</div>
              </div>
            </div>
            {APPLE_STYLE_BRAND_INFO[activeBrand].sections.map((sec, idx) => (
              <div key={idx} id={`section-${idx}`} className="apple-fullscreen-section">
                <div className="apple-section-content">
                  <span className="apple-tag">{sec.tag}</span>
                  <h2 className="apple-headline">{sec.headline}</h2>
                  <p className="apple-desc">{sec.desc}</p>
                  {sec.visual && (
                    <div className="apple-graphic">
                      {sec.visual === 'lu' ? (
                        <img src={logoLush} alt="Lush" width="130" height="100" style={{ objectFit: 'contain' }} />
                      ) : (
                        <span className="apple-emoji-graphic">{sec.visual}</span>
                      )}
                    </div>
                  )}
                  {sec.applyLink && (
                    <a
                      href={sec.applyLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="apply-link-btn"
                    >
                      🔗 {sec.applyLabel}
                    </a>
                  )}
                </div>
              </div>
            ))}

            <div className="apple-fullscreen-section end-section">
              <div className="apple-section-content">
                <span className="apple-tag">READY TO START?</span>
                <h2 className="apple-headline">지구를 위한 작은 실천,<br />지금 시작해 보세요.</h2>
                <button className="reset-btn apple-reset-btn" onClick={(e) => { e.stopPropagation(); onNavigate && onNavigate('calculator'); }}>공병 계산기로 가기</button>
              </div>
            </div>
          </div>
        </>
      )}

    </div>
  );
}

export default CompanyTabs;