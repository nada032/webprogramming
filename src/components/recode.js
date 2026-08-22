import React, { useState } from 'react';
import './recode.css';
import receiptImg from './imos/receipt.png';
import { BRAND_OPTIONS, INITIAL_CATEGORIES } from './bbasket';

/*기록보관 */
export default function Recode({ savedRecords = [], setSavedRecords, onNavigate }) {
  // 상세조회->선택된 레코드 상태관리
  const [selectedRecord, setSelectedRecord] = useState(null);
  // 삭제 대기중인 레코드 ID 상태관리
  const [deleteTargetId, setDeleteTargetId] = useState(null);

  // 카드삭제 확정 
  const handleConfirmDelete = () => {
    if (!deleteTargetId) return;
    setSavedRecords((prev) => prev.filter((r) => r.id !== deleteTargetId));
    if (selectedRecord && selectedRecord.id === deleteTargetId) {
      setSelectedRecord(null);
    }
    setDeleteTargetId(null);
  };



  // 각 단계를 간단한 텍스트(러쉬 1개 매장 방문 _1,000원 혜택)로 변환
  const getShortStepText = (step) => {
    if (!step) return '';

    // 1. 브랜드 
    let brandName = '';
    if (step.brand.includes('러쉬')) brandName = '러쉬';
    else if (step.brand.includes('이니스프리')) brandName = '이니스프리';
    else if (step.brand.includes('아모레퍼시픽')) brandName = '아모레퍼시픽';
    else if (step.brand.includes('올리브영')) brandName = '올리브영';
    else {
      brandName = step.brand.split(' ')[0] || '';
    }

    // 2. 수량 
    let countText = '';
    const countMatch = step.highlight.match(/(\d+)개/);
    if (countMatch) {
      countText = `${countMatch[1]}개`;
    } else {
      const boxMatch = step.highlight.match(/(\d+)상자/);
      if (boxMatch) {
        const eachMatch = step.highlight.match(/(\d+)개씩/);
        if (eachMatch) {
          const total = parseInt(eachMatch[1], 10) * parseInt(boxMatch[1], 10);
          countText = `${total}개`;
        } else {
          countText = `${boxMatch[1]}상자`;
        }
      } else {
        const numMatch = step.highlight.match(/\d+/);
        countText = numMatch ? `${numMatch[0]}개` : '';
      }
    }

    // 3. 반납방식 
    let method = '매장 방문';
    if (step.brand.includes('온라인') || (step.badge && step.badge.includes('온라인')) || (step.detail && step.detail.includes('온라인'))) {
      method = '온라인 신청';
    } else if (step.brand.includes('방문')) {
      method = '매장 방문';
    }

    // 4. 혜택 
    let benefitText = '';
    const benefitMatch = (step.highlight + ' ' + step.detail).match(/(\d{1,3}(,\d{3})*)(원|P)/);
    if (benefitMatch) {
      benefitText = ` _${benefitMatch[0]} 혜택`;
    } else if (step.highlight.includes('쿠폰') || step.detail.includes('쿠폰')) {
      benefitText = ' _쿠폰 혜택';
    }

    return `${brandName} ${countText} ${method}${benefitText}`.trim().replace(/\s+/g, ' ');
  };

  // 선택된 카드 브랜드별 공병 합계 계산용 
  const getBrandTotalCount = (record, brandId) => {
    if (!record || !record.basketByBrand) return 0;
    return Object.values(record.basketByBrand[brandId] || {}).reduce((a, b) => a + b, 0);
  };

  return (
    <div className="basket-page saved-list-page">
      <button
        className="brand-back-button"
        type="button"
        onClick={() => onNavigate('calculator')}
      >
        계산기로 이동
      </button>

      <div className="basket-select-section">
        <div className="guide-header">
          <p className="guide-subtitle">기록 바구니</p>
          <h1 className="guide-main-title">기록을 모아보세요.</h1>
          <div className="guide-badge-info">
            이전에 담아둔 꿀조합 공병 반납 기록들을 모아 확인해 보세요.
          </div>
        </div>

        {savedRecords.length > 0 && (
          <div className="cumulative-carbon-section">
            <div className="earth-animation-wrapper">
              <span className="spinning-earth">🌍</span>
              <span className="floating-leaf leaf-pos-1">🍃</span>
              <span className="floating-leaf leaf-pos-2">🍃</span>
            </div>
            <div className="cumulative-text-area">
              <p className="cumulative-label">모든 기록 실천 시,</p>
              <h2 className="cumulative-value">
                당신의 순간이 지구에게 <strong className="carbon-saved-num-wrapper"><span className="rolling-number">{savedRecords.reduce((sum, r) => sum + (r.totalItemsCount * 500), 0).toLocaleString()}년</span></strong>을 선물했어요!
              </h2>
              <div className="carbon-equivalent-add">
                <p className="supplement-txt">* 누적 CO₂ 약 <strong>{savedRecords.reduce((sum, r) => sum + (r.totalItemsCount * 45), 0).toLocaleString()}g</strong>을 정화할 수 있습니다.</p>
                <p className="supplement-txt">이는 플라스틱 컵 하나가 지구에서 자연분해되는 데 필요한 시간을 완전히 아낀 것과 같습니다.</p>
              </div>
            </div>
          </div>
        )}
        <div className="saved-list-container">
          {savedRecords.length === 0 ? (
            <div style={{ textAlign: 'center', color: '#888', padding: '60px 0' }}>
              <span style={{ fontSize: '3rem', display: 'block', marginBottom: '10px' }}>🌱</span>
              <p>아직 담아둔 공병 조합 기록이 없습니다.</p>
            </div>
          ) : (
            <div className="saved-cards-grid">
              {[...savedRecords]
                .sort((a, b) => Number(b.id) - Number(a.id))
                .map((record) => (
                  <div
                    key={record.id}
                    className="saved-record-card"
                    onClick={() => setSelectedRecord(record)}
                  >
                    <div className="card-info-group">
                      <div className="card-text-details">
                        <h3 className="card-title-text">{record.title}</h3>
                        <p className="card-meta-text">{record.savedAt}</p>
                      </div>
                    </div>
                    <div className="card-action-group">
                      <span className="card-count-badge">
                        총 <strong>{record.totalItemsCount}</strong>개 공병
                      </span>
                      <button
                        className="card-delete-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeleteTargetId(record.id);
                        }}
                      >
                        삭제
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>

      {/* 축약본 팝업 틀 */}
      {selectedRecord && (
        <div className="title-modal-overlay" onClick={() => setSelectedRecord(null)}>
          <div className="detail-modal-box" onClick={(e) => e.stopPropagation()}>
            {/* 닫기 */}
            <button className="detail-modal-close" onClick={() => setSelectedRecord(null)}>×</button>

            <div className="detail-modal-header">
              <span className="detail-header-tag">상세 영수증</span>
              <h2 className="detail-modal-title">{selectedRecord.title}</h2>
              <p className="detail-modal-date">저장일시: {selectedRecord.savedAt}</p>
            </div>

            <div className="detail-modal-scroll-content">
              {/*  영수증 */}
              <div className="detail-receipt-container">
                <div className="detail-receipt-box" style={{ borderImageSource: `url(${receiptImg})` }}>
                  <div className="receipt-total-title">
                    Total: <span className="total-highlight-red">{selectedRecord.totalItemsCount}</span>개
                  </div>
                  <div className="receipt-brand-breakdown">
                    {BRAND_OPTIONS.map((brand) => {
                      const count = getBrandTotalCount(selectedRecord, brand.id);
                      if (count === 0) return null;
                      const brandBasket = selectedRecord.basketByBrand[brand.id] || {};
                      return (
                        <div key={brand.id} className="receipt-brand-row-group">
                          <div className="receipt-brand-row-item">
                            <span className="receipt-brand-name">{brand.name}</span>
                            <span className="receipt-brand-count"><strong>{count}</strong>개</span>
                          </div>
                          <div className="receipt-category-sublist">
                            {Object.entries(brandBasket).map(([categoryId, catCount]) => {
                              if (catCount === 0) return null;
                              const category = INITIAL_CATEGORIES.find((cat) => cat.id === categoryId);
                              const categoryName = category ? category.title : categoryId;
                              return (
                                <div key={categoryId} className="receipt-category-subitem">
                                  <span className="receipt-category-name">-{categoryName}</span>
                                  <span className="receipt-category-count"><strong>{catCount}</strong></span>
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

              <div className="detail-divider">
                <span className="divider-text">저장된 조합 정보</span>
              </div>

              {/* 축약 내용 */}
              <div className="detail-combinations-list-short">
                {(selectedRecord.combinations || [selectedRecord.combinationData]).map((comp, compIdx) => {
                  if (!comp) return null;
                  const numEmoji = compIdx === 0 ? '1️⃣' : '2️⃣';
                  return (
                    <div key={comp.type || compIdx} className="short-combination-box">
                      <h4 className="short-comp-title">{numEmoji} {(comp.totalValue || 0).toLocaleString()}원 상당 혜택</h4>

                      {/* 숫자 아래 내용 목록 */}
                      <div className="short-steps-list">
                        {comp.steps.map((step, idx) => (
                          <div key={idx} className="short-step-item">
                            <span className="short-step-bullet">•</span>
                            <span className="short-step-text">{getShortStepText(step)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 삭제팝업 */}
      {deleteTargetId && (
        <div className="title-modal-overlay" onClick={() => setDeleteTargetId(null)}>
          <div className="title-modal-box" onClick={(e) => e.stopPropagation()}>
            <h3 className="modal-title">🗑️ 기록 삭제</h3>
            <p className="modal-subtitle" style={{ fontSize: '0.92rem', lineHeight: '1.6', margin: '20px 0 24px', fontWeight: '700', color: '#333' }}>
              정말로 이 저장 기록(<strong>{savedRecords.find(r => r.id === deleteTargetId)?.title || ''}</strong>)을<br />삭제하시겠습니까?
            </p>

            <div className="modal-button-group">
              <button className="modal-btn cancel" onClick={() => setDeleteTargetId(null)}>
                취소
              </button>
              <button className="modal-btn confirm" style={{ backgroundColor: '#cf234e' }} onClick={handleConfirmDelete}>
                삭제하기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
