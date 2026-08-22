import React, { useState, useRef } from 'react';
import './bbasketGuide.css';
import treeImg from './imos/tree.png';
import co2Img from './imos/co2.png';
import receiptImg from './imos/receipt.png';
import { BRAND_OPTIONS, INITIAL_CATEGORIES, getBrandTotalCount } from './bbasket';
import FloatingCart from './floatingCart';

export default function BbasketGuide({ basketByBrand, setPage, savedRecords, setSavedRecords, onNavigate, resetBasket, calculationId, selectedBrandIds, totalItemsCount }) {
  // 생애 첫 스위치
  const [isFirstTime, setIsFirstTime] = useState(false);

  // 바구니 담기 / 타이틀 팝업 관리
  const [isTitleModalOpen, setIsTitleModalOpen] = useState(false);
  const [targetCombinationType, setTargetCombinationType] = useState(null);
  const [inputTitle, setInputTitle] = useState('');
  const [inputTitleError, setInputTitleError] = useState('');

  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [pendingCardType, setPendingCardType] = useState(null);

  // 현재 장바구니 품목들/체크 상태 동기화
  const currentSnapshotId = JSON.stringify(basketByBrand);
  const activeSelectedTypes = (savedRecords || [])
    .filter(r => r.calculationId === calculationId)
    .reduce((acc, r) => {
      if (r.combinationType === 'both') {
        acc.push('best1', 'best2');
      } else {
        acc.push(r.combinationType);
      }
      return acc;
    }, []);

  const isBest1Selected = activeSelectedTypes.includes('best1');
  const isBest2Selected = activeSelectedTypes.includes('best2');

  const handleToggleCard = (cardType) => {
    const isSelected = activeSelectedTypes.includes(cardType);

    if (isSelected) {
      // 이미 담겼다면 취소 
      setSavedRecords((prev) => {
        return prev.map((r) => {
          if (r.calculationId === calculationId) {
            if (r.combinationType === 'both') {
              //  제외하고 다른 카드만
              const remainingType = cardType === 'best1' ? 'best2' : 'best1';
              const remainingCombs = (r.combinations || []).filter(c => c.type !== cardType);
              return {
                ...r,
                combinationType: remainingType,
                combinationData: remainingCombs[0] || r.combinationData,
                combinations: remainingCombs
              };
            } else if (r.combinationType === cardType) {
              // 단독 저장->레코드 자체 삭제
              return null;
            }
          }
          return r;
        }).filter(Boolean);
      });
      return;
    }

    // 담기X->추가-> 2개 카드 묶음
    const existingRecord = (savedRecords || []).find(r => r.calculationId === calculationId);

    if (existingRecord) {
      // 이미 한 장 저장->2개 카드 묶음 저장 확인
      setPendingCardType(cardType);
      setIsConfirmModalOpen(true);
      return;
    }

    // 기존 레코드 x->타이틀 입력창
    setTargetCombinationType(cardType);
    setInputTitle('');
    setInputTitleError('');
    setIsTitleModalOpen(true);
  };

  const handleConfirmGroupSave = () => {
    const existingRecord = (savedRecords || []).find(r => r.calculationId === calculationId);
    if (!pendingCardType || !existingRecord) return;

    const targetCombData = pendingCardType === 'best1' ? recommendations.best1 : recommendations.best2;
    const newCombObj = {
      type: pendingCardType,
      title: targetCombData.title,
      totalValue: targetCombData.totalValue,
      points: targetCombData.points,
      cash: targetCombData.cash,
      coupons: targetCombData.coupons,
      steps: targetCombData.steps.map(s => ({
        brand: s.brand,
        highlight: s.highlight,
        detail: s.detail,
        badge: s.badge
      }))
    };

    setSavedRecords((prev) =>
      prev.map((r) => {
        if (r.id === existingRecord.id) {
          const prevCombs = r.combinations || [r.combinationData];
          // 중복 저장 방지
          const filteredCombs = prevCombs.filter(c => c.type !== pendingCardType);
          return {
            ...r,
            combinationType: 'both',
            combinations: [...filteredCombs, newCombObj]
          };
        }
        return r;
      })
    );

    setIsConfirmModalOpen(false);
  };

  const handleSaveRecord = () => {
    if (!inputTitle.trim()) {
      setInputTitleError('보관할 이름을 입력해 주세요.');
      return;
    }

    const isDuplicate = (savedRecords || []).some(
      (r) => r.title.trim().toLowerCase() === inputTitle.trim().toLowerCase()
    );

    if (isDuplicate) {
      setInputTitleError('이미 사용 중인 이름입니다. 다른 이름을 입력해 주세요.');
      return;
    }

    const targetCombData = targetCombinationType === 'best1' ? recommendations.best1 : recommendations.best2;
    const combObj = {
      type: targetCombinationType,
      title: targetCombData.title,
      totalValue: targetCombData.totalValue,
      points: targetCombData.points,
      cash: targetCombData.cash,
      coupons: targetCombData.coupons,
      steps: targetCombData.steps.map(s => ({
        brand: s.brand,
        highlight: s.highlight,
        detail: s.detail,
        badge: s.badge
      }))
    };

    const newRecord = {
      id: Date.now().toString(),
      calculationId: calculationId,
      title: inputTitle.trim(),
      savedAt: new Date().toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      basketSnapshotId: currentSnapshotId,
      basketByBrand: JSON.parse(JSON.stringify(basketByBrand)),
      totalItemsCount: totalItemsCount,
      combinationType: targetCombinationType,
      combinationData: combObj,
      combinations: [combObj]
    };

    setSavedRecords((prev) => [...prev, newRecord]);
    setIsTitleModalOpen(false);
  };

  const recommendRef = useRef(null);
  const impossibleRef = useRef(null);
  const cleaningRef = useRef(null);

  const scrollToRecommend = () => {
    recommendRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };
  const scrollToImpossible = () => {
    impossibleRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };
  const scrollToCleaning = () => {
    cleaningRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const getBrandTotalCountLocal = (brandId) => getBrandTotalCount(basketByBrand, brandId);

  //보너스 스위치 O
  const showBonusToggle = selectedBrandIds.includes('amore') || selectedBrandIds.includes('innisfree');

  //꿀조합 추천
  const calculateBestCombinations = (firstTimeBonus) => {
    const innisfreeCount = getBrandTotalCountLocal('innisfree');
    const amoreCount = getBrandTotalCountLocal('amore');
    const lushCount = getBrandTotalCountLocal('lush');
    const oliveyoungCount = getBrandTotalCountLocal('oliveyoung');

    const totalInput = innisfreeCount + amoreCount + lushCount + oliveyoungCount;
    if (totalInput === 0) return null;


    // 1. 혜택 극대화 

    let comb1Steps = [];
    let comb1Points = 0;
    let comb1Cash = 0;
    let comb1Coupons = 0;

    // A. 러쉬 (L) -> 5개당 마스크팩 교환, 남은 건 즉시 할인
    if (lushCount > 0) {
      const packs = Math.floor(lushCount / 5);
      const leftovers = lushCount % 5;
      if (packs > 0) {
        comb1Steps.push({
          brand: '러쉬 매장 방문',
          highlight: `마스크팩 ${packs}개 교환 + ${leftovers}개 즉시 할인`,
          detail: `블랙/화이트팟 ${lushCount}개 중 ${packs * 5}개는 마스크팩 ${packs}개로 교환, 남은 ${leftovers}개는 개당 1,000원 즉시 할인 받기`,
          badge: '마스크팩 교환 + 할인'
        });
        comb1Cash += packs * 25000 + leftovers * 1000;
      } else {
        comb1Steps.push({
          brand: '러쉬 매장 방문',
          highlight: `전량 즉시 매장 할인 (${(lushCount * 1000).toLocaleString()}원 할인)`,
          detail: `블랙/화이트팟 ${lushCount}개 전량 즉시 매장 할인 받기`,
          badge: '즉시 할인'
        });
        comb1Cash += lushCount * 1000;
      }
    }

    // 아모레퍼시픽 오프라인 매장 월 한도: 10개 (이니스프리 남은 수량과 아모레 수량이 이를 공유)
    let remainingAmoreStoreLimit = 10;

    let inniToAmoreStore1 = 0;
    let amoreToAmoreStore1 = 0;
    let inniToOY1 = 0;
    let amoreToOY1 = 0;
    let oyToOY1 = 0;

    // B. 이니스프리 (I) -> 이니스프리 10개(3,000p) 반납, 남은 건 아모레 오프라인(개당 500p) 반납
    if (innisfreeCount > 0) {
      const toInni = Math.min(innisfreeCount, 10);
      const leftoverInni = innisfreeCount - toInni;
      comb1Steps.push({
        brand: '이니스프리 매장 방문',
        highlight: `${toInni}개 반납 (${toInni * 300}P 적립)`,
        detail: `이니스프리 공병 중 ${toInni}개 반납 (월 최대 한도 3,000P )`,
        badge: '이니스프리 300P 적립'
      });
      comb1Points += toInni * 300;

      if (leftoverInni > 0) {
        const toAmoreStore = Math.min(leftoverInni, remainingAmoreStoreLimit);
        remainingAmoreStoreLimit -= toAmoreStore;
        if (toAmoreStore > 0) {
          inniToAmoreStore1 += toAmoreStore;
        }

        const leftoverOY = leftoverInni - toAmoreStore;
        if (leftoverOY > 0) {
          inniToOY1 += leftoverOY;
        }
      }
    }

    // C. 아모레퍼시픽 (A) -> 아모레 매장 반납 (개당 500p, 남은 월 한도 내)
    if (amoreCount > 0) {
      const toAmoreStore = Math.min(amoreCount, remainingAmoreStoreLimit);
      remainingAmoreStoreLimit -= toAmoreStore;
      if (toAmoreStore > 0) {
        amoreToAmoreStore1 += toAmoreStore;
      }

      const leftoverOY = amoreCount - toAmoreStore;
      if (leftoverOY > 0) {
        amoreToOY1 += leftoverOY;
      }
    }

    // D. 올리브영 (O) -> 올리브영 반납
    if (oliveyoungCount > 0) {
      oyToOY1 += oliveyoungCount;
    }

    // 아모레퍼시픽 매장 방문 통합
    const totalAmoreStore1 = inniToAmoreStore1 + amoreToAmoreStore1;
    if (totalAmoreStore1 > 0) {
      let parts = [];
      if (inniToAmoreStore1 > 0) parts.push(`이니스프리 ${inniToAmoreStore1}개`);
      if (amoreToAmoreStore1 > 0) parts.push(`아모레퍼시픽 ${amoreToAmoreStore1}개`);

      comb1Steps.push({
        brand: '아모레퍼시픽 매장 방문',
        highlight: `${totalAmoreStore1}개 반납 (${(totalAmoreStore1 * 500).toLocaleString()}P 적립)`,
        detail: `${parts.join(', ')} 반납 (아모레퍼시픽 매장 반납 개당 500P 혜택)`,
        badge: '아모레퍼시픽 500P 적립'
      });
      comb1Points += totalAmoreStore1 * 500;
    }

    // 올리브영 매장 방문 통합
    const totalOY1 = inniToOY1 + amoreToOY1 + oyToOY1;
    if (totalOY1 > 0) {
      let parts = [];
      if (inniToOY1 > 0) parts.push(`이니스프리 ${inniToOY1}개`);
      if (amoreToOY1 > 0) parts.push(`아모레퍼시픽 ${amoreToOY1}개`);
      if (oyToOY1 > 0) parts.push(`올리브영 ${oyToOY1}개`);

      comb1Steps.push({
        brand: '올리브영 매장 방문',
        highlight: `${totalOY1}개 반납 (할인 쿠폰 획득)`,
        detail: `${parts.join(', ')} 반납 시 올리브영 앱 할인 쿠폰(2,000~3,000원권) 획득`,
        badge: '올리브영 쿠폰'
      });
      comb1Coupons += 1;
    }

    // 쿠폰 1장을 2,500원 환산 
    const totalComb1Value = comb1Points + comb1Cash + (comb1Coupons > 0 ? 2500 : 0);


    // 꿀조합 2. 온라인 +편의성 
    let comb2Steps = [];
    let comb2Points = 0;
    let comb2Cash = 0;
    let comb2Coupons = 0;

    // A. 러쉬 (L) -> 전량 즉시 현금 할인
    if (lushCount > 0) {
      comb2Steps.push({
        brand: '러쉬 매장 방문',
        highlight: `전량 즉시 매장 할인 (${(lushCount * 1000).toLocaleString()}원 할인)`,
        detail: `블랙/화이트팟 ${lushCount}개 전량 즉시 매장 할인 받기`,
        badge: '즉시 할인'
      });
      comb2Cash += lushCount * 1000;
    }

    let inniToOY2 = 0;
    let amoreToOY2 = 0;
    let oyToOY2 = 0;

    // B. 이니스프리 (I) -> 온라인 신청 (10개 이상 가능)
    if (innisfreeCount > 0) {
      if (innisfreeCount >= 10) {
        let pts = 3000; // 10개 한도 3,000p
        let highlightText = `10개 온라인 무료 수거 신청 (${pts.toLocaleString()}P 적립)`;
        let detailText = `이니스프리 공병 중 10개 온라인 무료 수거 신청 (뷰티포인트 3,000P 적립)`;
        if (firstTimeBonus) {
          pts += 5000;
          highlightText = `10개 온라인 무료 수거 신청 (${pts.toLocaleString()}P 적립)`;
          detailText += ` + 이니스프리 생애 첫 온라인 수거 5,000P 보너스 적립!`;
        }
        comb2Steps.push({
          brand: '이니스프리 온라인 수거',
          highlight: highlightText,
          detail: detailText,
          badge: '온라인 3,000P 적립'
        });
        comb2Points += pts;

        const leftover = innisfreeCount - 10;
        if (leftover > 0) {
          inniToOY2 += leftover;
        }
      } else {
        inniToOY2 += innisfreeCount;
      }
    }

    // C. 아모레퍼시픽 (A) -> 온라인 신청 (10개 이상 가능, 박스당 1,000p)
    if (amoreCount > 0) {
      if (amoreCount >= 10) {
        // 박스당 1,000p 꿀팁 반영
        const boxes = Math.floor(amoreCount / 10);
        const leftover = amoreCount % 10;
        let pts = boxes * 1000;
        let highlightText = `10개씩 ${boxes}상자 (${pts.toLocaleString()}P 적립)`;
        let detailText = `아모레퍼시픽 공병 ${amoreCount}개 중 ${boxes * 10}개를 10개씩 각각 ${boxes}개의 상자에 분할 포장하여 온라인 무료 수거 신청 (상자 분할 꿀팁!)`;

        if (firstTimeBonus) {
          pts += 5000;
          highlightText = `10개씩 ${boxes}상자 (${pts.toLocaleString()}P 적립)`;
          detailText += ` + 아모레퍼시픽 생애 첫 온라인 수거 5,000P 보너스 적립!`;
        }
        comb2Steps.push({
          brand: '아모레퍼시픽 온라인 수거',
          highlight: highlightText,
          detail: detailText,
          badge: `온라인 ${boxes}개 상자 수거`
        });
        comb2Points += pts;

        if (leftover > 0) {
          amoreToOY2 += leftover;
        }
      } else {
        amoreToOY2 += amoreCount;
      }
    }

    // D. 올리브영 (O) -> 올리브영 반납
    if (oliveyoungCount > 0) {
      oyToOY2 += oliveyoungCount;
    }

    // 올리브영 매장 방문 통합
    const totalOY2 = inniToOY2 + amoreToOY2 + oyToOY2;
    if (totalOY2 > 0) {
      let parts = [];
      if (inniToOY2 > 0) parts.push(`이니스프리 ${inniToOY2}개`);
      if (amoreToOY2 > 0) parts.push(`아모레퍼시픽 ${amoreToOY2}개`);
      if (oyToOY2 > 0) parts.push(`올리브영 ${oyToOY2}개`);

      comb2Steps.push({
        brand: '올리브영 매장 방문',
        highlight: `${totalOY2}개 반납 (할인 쿠폰 획득)`,
        detail: `${parts.join(', ')} 반납 시 올리브영 앱 할인 쿠폰(2,000~3,000원권) 획득`,
        badge: '올리브영 쿠폰'
      });
      comb2Coupons += 1;
    }

    const totalComb2Value = comb2Points + comb2Cash + (comb2Coupons > 0 ? 2500 : 0);

    return {
      best1: {
        title: '📦 온라인 신청 및 편의성 중심 조합',
        steps: comb2Steps,
        points: comb2Points,
        cash: comb2Cash,
        coupons: comb2Coupons,
        totalValue: totalComb2Value
      },
      best2: {
        title: '💰 포인트 및 혜택 극대화 조합 ',
        steps: comb1Steps,
        points: comb1Points,
        cash: comb1Cash,
        coupons: comb1Coupons,
        totalValue: totalComb1Value
      }
    };
  };

  const recommendations = calculateBestCombinations(showBonusToggle && isFirstTime);
  const isRecommendationsEqual = recommendations && JSON.stringify(recommendations.best1.steps) === JSON.stringify(recommendations.best2.steps);

  // 정규식으로 숫자+개/상자 패턴
  const renderHighlight = (text) => {
    if (!text) return null;
    const regex = /(\d+)(개|상자)/g;
    const parts = [];
    let lastIndex = 0;
    let match;
    while ((match = regex.exec(text)) !== null) {
      const matchIndex = match.index;
      if (matchIndex > lastIndex) {
        parts.push(text.substring(lastIndex, matchIndex));
      }
      parts.push(
        <strong key={matchIndex} className="highlight-number">
          {match[1]}
        </strong>
      );
      parts.push(match[2]);
      lastIndex = regex.lastIndex;
    }
    if (lastIndex < text.length) {
      parts.push(text.substring(lastIndex));
    }
    return parts.length > 0 ? parts : text;
  };

  return (
    <div className="basket-page guide-page">
      <button
        className="brand-back-button"
        type="button"
        onClick={() => {
          if (activeSelectedTypes.length > 0 && resetBasket) {
            resetBasket();
          }
          setPage('bottle');
          window.scrollTo(0, 0);
        }}
      >
        Back
      </button>

      {/* 플로팅 바구니 버튼 */}
      <FloatingCart
        savedRecords={savedRecords}
        setSavedRecords={setSavedRecords}
        onNavigate={onNavigate}
      />

      <div className="basket-select-section">

        {/* 상단 */}
        <div className="guide-header">
          <p className="guide-subtitle">공병 수거 솔루션</p>
          <h1 className="guide-main-title">꿀조합 가이드</h1>
          <div className="guide-badge-info">
            아래{' '}
            <span onClick={scrollToRecommend} className="guide-nav-link">
              조합
            </span>
            과{' '}
            <span onClick={scrollToImpossible} className="guide-nav-link">
              불가능 지점
            </span>
            {' '}/{' '}
            <span onClick={scrollToCleaning} className="guide-nav-link">
              세척 방법
            </span>
            을 확인하세요.<br></br>
            <p>빨간색 글씨를 클릭하면 해당 위치로 이동합니다.</p>
          </div>
        </div>

        {/* 탄소- */}
        <div className="carbon-saving-section no-box">
          <div className="carbon-animation-box">
            <img className="carbon-tree" src={treeImg} alt="나무" />
            <img className="carbon-cloud cloud-1" src={co2Img} alt="CO2" />
            <img className="carbon-cloud cloud-2" src={co2Img} alt="CO2" />
            <img className="carbon-cloud cloud-3" src={co2Img} alt="CO2" />
            <img className="carbon-cloud cloud-4" src={co2Img} alt="CO2" />
            <img className="carbon-cloud cloud-5" src={co2Img} alt="CO2" />
            <img className="carbon-cloud cloud-6" src={co2Img} alt="CO2" />
            <img className="carbon-cloud cloud-7" src={co2Img} alt="CO2" />
          </div>
          <div className="carbon-info-box">
            <h2 className="carbon-saved-text">
              소나무 한 그루는 <strong className="carbon-saved-num-wrapper"><span key={totalItemsCount} className="rolling-number">{totalItemsCount * 25}</span></strong> 일 , <strong className="carbon-saved-num-wrapper"><span key={totalItemsCount} className="rolling-number">하루</span></strong> 만에.
            </h2>
            <p className="carbon-desc">
              CO₂ <span style={{ color: 'green' }}>{(totalItemsCount * 45).toLocaleString()}</span>g을 당신의 작은 실천으로 하루 만에 감축이 가능해집니다.
            </p>
          </div>
        </div>

        {/*영수증 */}
        <div className="guide-total-box-container">
          <div className="guide-total-box" style={{ borderImageSource: `url(${receiptImg})` }}>
            <div className="total-count-title">
              Total:<span style={{ color: '#cf234eff' }}>{totalItemsCount}</span>개
            </div>
            <div className="brand-breakdown-list">
              {selectedBrandIds.map((brandId) => {
                const brand = BRAND_OPTIONS.find((b) => b.id === brandId);
                const count = getBrandTotalCountLocal(brandId);
                const brandBasket = basketByBrand[brandId] || {};
                return (
                  <div key={brandId} className="brand-breakdown-group">
                    <div className="brand-breakdown-item">
                      <span className="brand-name-lbl">{brand.name}</span>
                      <span className="brand-count-lbl"><strong>{count}</strong>개</span>
                    </div>
                    <div className="brand-detail-list">
                      {Object.entries(brandBasket).map(([categoryId, catCount]) => {
                        if (catCount === 0) return null;
                        const category = INITIAL_CATEGORIES.find((cat) => cat.id === categoryId);
                        const categoryName = category ? category.title : categoryId;
                        return (
                          <div key={categoryId} className="brand-detail-item">
                            <span className="brand-detail-name">-{categoryName}</span>
                            <span className="brand-detail-count"><strong>{catCount}</strong></span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* 보너스 스위치  */}
        {showBonusToggle && (
          <div className="bonus-toggle-container">
            <label className="bonus-toggle-label">
              <input
                type="checkbox"
                className="bonus-toggle-input"
                checked={isFirstTime}
                onChange={() => setIsFirstTime(!isFirstTime)}
              />
              <span className="bonus-toggle-slider"></span>
              아모레,이니스프리 생애 첫 온라인 공병 수거 신청 보너스(+5,000P)
            </label>
          </div>
        )}

        <p className="basket-guide">꿀조합을 선택하면 바구니에 저장됩니다.<br></br> 기록을 남겨보세요.</p>

        {/* 꿀조합 결과 */}
        {recommendations && (
          <div ref={recommendRef} className={`guide-recommend-container ${isRecommendationsEqual ? 'single-card' : ''}`}>

            {/* 1 /추천 조합 카드 */}
            <div className={`recommend-card best-one ${isBest1Selected ? 'is-selected' : ''}`}>
              <div className="card-badge-label recommend">
                {isRecommendationsEqual ? '추천 조합' : 'BEST 1'}
              </div>
              <h2 className="recommend-card-title">{recommendations.best1.title}</h2>

              <div className="recommend-benefit-summary">
                <div className="benefit-item">
                  <span className="benefit-label">예상 총 가치</span>
                  <span className="benefit-value highlight">
                    {(recommendations.best1.totalValue).toLocaleString()}원 상당
                  </span>
                </div>
                <div className="benefit-details">
                  {recommendations.best1.points > 0 && <span>뷰티포인트 +{recommendations.best1.points.toLocaleString()}P</span>}
                  {recommendations.best1.cash > 0 && <span>할인/마스크팩 +{recommendations.best1.cash.toLocaleString()}원</span>}
                  {recommendations.best1.coupons > 0 && <span>올영 할인쿠폰 +{recommendations.best1.coupons}장</span>}
                </div>
              </div>

              <div className="split-delivery-list">
                <h3>반납 방법 안내</h3>
                {recommendations.best1.steps.map((step, idx) => {
                  const firstSpaceIdx = step.brand.indexOf(' ');
                  const brandName = firstSpaceIdx !== -1 ? step.brand.slice(0, firstSpaceIdx) : step.brand;
                  const actionName = firstSpaceIdx !== -1 ? step.brand.slice(firstSpaceIdx) : '';
                  const isOnline = actionName.includes('온라인');

                  // BRAND_OPTIONS에서 일치하는 브랜드 로고 찾기
                  const brandObj = BRAND_OPTIONS.find(b =>
                    b.name.startsWith(brandName.slice(0, 3)) || brandName.startsWith(b.name.slice(0, 3))
                  );

                  return (
                    <div key={idx} className={`split-item ${isOnline ? 'online-step' : 'store-step'}`}>
                      <span className={`split-brand-badge ${isOnline ? 'online-badge' : 'store-badge'}`}>
                        {brandObj && (
                          <span className="step-logo-wrapper">
                            <img
                              src={brandObj.image}
                              alt={brandName}
                              className={`step-brand-logo ${brandObj.id}`}
                            />
                          </span>
                        )}
                        <strong className="brand-name-emphasized">{brandName}</strong>
                        <span className="action-name-text">
                          {actionName.trim()}
                          {isOnline && ' 🚚'}
                        </span>
                      </span>
                      <p className="split-highlight">{renderHighlight(step.highlight)}</p>
                      <p className="split-detail">{step.detail}</p>
                      {step.brand === '올리브영 매장 방문' && (
                        <p className="split-tip">
                          💡 <strong>팁:</strong> 올리브영은 1일 1쿠폰만 발행되므로, 올리브영을 자주 방문하신다면 공병을 나누어 갈 때마다 쿠폰을 받는 것이 더 유리합니다!
                        </p>
                      )}
                      {step.brand === '이니스프리 온라인 수거' && (
                        <a
                          href="https://www.innisfree.com/kr/ko/or/ebotlct"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="online-pickup-link-btn"
                        >
                          이니스프리 수거 신청 바로가기
                        </a>
                      )}
                      {step.brand === '아모레퍼시픽 온라인 수거' && (
                        <a
                          href="https://www.amoremall.com/kr/ko/my/page/recycle"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="online-pickup-link-btn"
                        >
                          아모레퍼시픽 수거 신청 바로가기
                        </a>
                      )}
                    </div>
                  );
                })}
                <button
                  className={`recommend-card-select-btn ${isBest1Selected ? 'active' : ''}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleToggleCard('best1');
                  }}
                >
                  {isBest1Selected ? '✓ 취소' : '저장'}
                </button>
              </div>
            </div>

            {/* 2 */}
            {!isRecommendationsEqual && (
              <div className={`recommend-card best-two ${isBest2Selected ? 'is-selected' : ''}`}>
                <div className="card-badge-label alternate">BEST 2</div>
                <h2 className="recommend-card-title">{recommendations.best2.title}</h2>

                <div className="recommend-benefit-summary">
                  <div className="benefit-item">
                    <span className="benefit-label">예상 총 가치</span>
                    <span className="benefit-value">
                      {(recommendations.best2.totalValue).toLocaleString()}원 상당
                    </span>
                  </div>
                  <div className="benefit-details">
                    {recommendations.best2.points > 0 && <span>뷰티포인트 +{recommendations.best2.points.toLocaleString()}P</span>}
                    {recommendations.best2.cash > 0 && <span>할인/마스크팩 +{recommendations.best2.cash.toLocaleString()}원</span>}
                    {recommendations.best2.coupons > 0 && <span>올영 할인쿠폰 +{recommendations.best2.coupons}장</span>}
                  </div>
                </div>

                <div className="split-delivery-list">
                  <h3>반납 방법 안내</h3>
                  {recommendations.best2.steps.map((step, idx) => {
                    const firstSpaceIdx = step.brand.indexOf(' ');
                    const brandName = firstSpaceIdx !== -1 ? step.brand.slice(0, firstSpaceIdx) : step.brand;
                    const actionName = firstSpaceIdx !== -1 ? step.brand.slice(firstSpaceIdx) : '';
                    const isOnline = actionName.includes('온라인');

                    // BRAND_OPTIONS에서 일치하는 브랜드 로고 찾기
                    const brandObj = BRAND_OPTIONS.find(b =>
                      b.name.startsWith(brandName.slice(0, 3)) || brandName.startsWith(b.name.slice(0, 3))
                    );

                    return (
                      <div key={idx} className={`split-item ${isOnline ? 'online-step' : 'store-step'}`}>
                        <span className={`split-brand-badge ${isOnline ? 'online-badge' : 'store-badge'}`}>
                          {brandObj && (
                            <span className="step-logo-wrapper">
                              <img
                                src={brandObj.image}
                                alt={brandName}
                                className={`step-brand-logo ${brandObj.id}`}
                              />
                            </span>
                          )}
                          <strong className="brand-name-emphasized">{brandName}</strong>
                          <span className="action-name-text">
                            {actionName.trim()}
                            {isOnline && ' 🚚'}
                          </span>
                        </span>
                        <p className="split-highlight">{renderHighlight(step.highlight)}</p>
                        <p className="split-detail">{step.detail}</p>
                        {step.brand === '올리브영 매장 방문' && (
                          <p className="split-tip">
                            💡 <strong>팁:</strong> 올리브영은 1일 1쿠폰만 발행되므로, 올리브영을 자주 방문하신다면 공병을 나누어 갈 때마다 쿠폰을 받는 것이 더 유리합니다!
                          </p>
                        )}
                        {step.brand === '이니스프리 온라인 수거' && (
                          <a
                            href="https://www.innisfree.com/kr/ko/or/ebotlct"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="online-pickup-link-btn"
                          >
                            이니스프리 수거 신청 바로가기 ↗
                          </a>
                        )}
                        {step.brand === '아모레퍼시픽 온라인 수거' && (
                          <a
                            href="https://www.amoremall.com/kr/ko/my/page/recycle"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="online-pickup-link-btn"
                          >
                            아모레퍼시픽 수거 신청 바로가기 ↗
                          </a>
                        )}
                      </div>
                    );
                  })}
                  <button
                    className={`recommend-card-select-btn ${isBest2Selected ? 'active' : ''}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleCard('best2');
                    }}
                  >
                    {isBest2Selected ? '✓ 취소' : '저장'}
                  </button>
                </div>
              </div>
            )}

          </div>
        )}

        {/* 수거 불가능 지점*/}
        <div ref={impossibleRef} className="guide-impossible-container-box">
          <div className="impossible-header">
            <span className="impossible-icon">📍</span>
            <h3 className="impossible-title">수거 불가능 지점 안내</h3>
          </div>

          <div className="impossible-content-layout">
            {/* 공통 불가능 지점 */}
            <div className="impossible-section">
              <h4 className="impossible-section-title">⚠️ 공통 수거 불가능 지점</h4>
              <ul className="impossible-list">
                <li>
                  <strong>대형마트 및 마트 입점 지점:</strong> 마트 내부에 위치한 매장에서는 수거가 불가능합니다.<br></br>
                  <span className="impossible-brand-badge oliveyoung">올리브영</span>
                  <span className="impossible-brand-badge amore">아모레</span>
                  <span className="impossible-brand-badge innisfree">이니스프리</span>
                </li>
                <li>
                  <strong>백화점, 복합몰 및 아울렛 입점 지점:</strong> 백화점/복합쇼핑몰/아울렛 매장에서는 수거가 불가능합니다.<br></br>
                  <span className="impossible-brand-badge oliveyoung">올리브영</span>
                  <span className="impossible-brand-badge innisfree">이니스프리</span>
                </li>
              </ul>
            </div>

            {/* 브랜드별 추가 불가능 지점 */}
            <div className="impossible-section">
              <h4 className="impossible-section-title brand-title">🔍 브랜드별 추가 불가능 지점</h4>
              <ul className="impossible-list">
                <li>
                  <strong>올리브영:</strong> 공항 및 역사 내 입점 매장
                </li>
                <li>
                  <strong>아모레퍼시픽 계열 브랜드:</strong> 편집샵 매장
                </li>
                <li>
                  <strong>이니스프리:</strong> 면세점
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* 세척  */}
        <div ref={cleaningRef} className="guide-cleaning-container-box">
          <div className="cleaning-header">
            <span className="cleaning-icon">🧼</span>
            <h3 className="cleaning-title">올바른 공병 세척 방법 안내</h3>
          </div>

          <div className="cleaning-important-banner">
            <strong>⚠️ 중요</strong>
            <p>내용물 비운 후 세척 & 건조 시켜야 곰팡이나 오염없이 용기 재활용이 가능합니다.</p>
          </div>

          <div className="cleaning-content-layout">
            <ul className="cleaning-list">
              <li><strong>액체류:</strong> 내용물이 없도록 깨끗하게 비워주세요.</li>
              <li><strong>크림 / 밤류:</strong> 내부를 휴지로 먼저 닦아낸 뒤, 주방세제로 가볍게 세척 후 건조합니다.</li>
              <li><strong>오일류:</strong> 따뜻한 물과 주방세제 한 방울을 섞어서 세척 후 건조합니다.</li>
              <li><strong>튜브류:</strong> 용기를 반으로 잘라 안쪽을 깨끗이 비운 뒤, 잘린 용기까지 모두 함께 반납해야 합니다.</li>
              <li><strong>쿠션 / 팩트류:</strong> 리필 부분을 제거한 후 반납해 주세요.</li>
              <li className="cleaning-label-step"><strong>라벨 제거 (올리브영만 해당):</strong> 용기 외부의 비닐 및 라벨 스티커는 깨끗하게 제거해 주세요.</li>
            </ul>
          </div>
        </div>

        {/* 기록 팝업 */}
        {isTitleModalOpen && (
          <div className="title-modal-overlay" onClick={() => setIsTitleModalOpen(false)}>
            <div className="title-modal-box" onClick={(e) => e.stopPropagation()}>
              <h3 className="modal-title">🔖기록 보관</h3>
              <p className="modal-subtitle">이 공병 수거 조합을 보관할 이름을 입력해 주세요.</p>

              <input
                type="text"
                className="modal-input"
                value={inputTitle}
                onChange={(e) => {
                  setInputTitle(e.target.value);
                  if (e.target.value.trim()) {
                    setInputTitleError('');
                  }
                }}
                placeholder="원하는 타이틀을 입력하세요."
                maxLength={30}
                autoFocus
              />

              {inputTitleError && (
                <p className="modal-error-message">{inputTitleError}</p>
              )}

              <div className="modal-button-group">
                <button className="modal-btn cancel" onClick={() => setIsTitleModalOpen(false)}>
                  취소
                </button>
                <button className="modal-btn confirm" onClick={handleSaveRecord}>
                  저장하기
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 그룹 저장 y/n  */}
        {isConfirmModalOpen && (
          <div className="title-modal-overlay" onClick={() => setIsConfirmModalOpen(false)}>
            <div className="title-modal-box" onClick={(e) => e.stopPropagation()}>
              <h3 className="modal-title">🔖추가 보관</h3>
              <p className="modal-subtitle" style={{ fontSize: '0.92rem', lineHeight: '1.6', margin: '20px 0 24px', fontWeight: '700', color: '#333' }}>
                방금 저장한 카드(<strong>{(savedRecords || []).find(r => r.basketSnapshotId === currentSnapshotId)?.title || ''}</strong>)와<br />같이 묶어서 저장할까요?
              </p>

              <div className="modal-button-group">
                <button className="modal-btn cancel" onClick={() => {
                  setIsConfirmModalOpen(false);
                  // 노-> 타이틀 입력창
                  setTargetCombinationType(pendingCardType);
                  setInputTitle('');
                  setInputTitleError('');
                  setIsTitleModalOpen(true);
                }}>
                  아니오 (새로 저장)
                </button>
                <button className="modal-btn confirm" onClick={handleConfirmGroupSave}>
                  네
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
