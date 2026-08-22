import React, { useState, useRef } from 'react';
import './bbasket.css';
import basketImg from './imos/basket.png';
import bottleImg from './imos/로2.png';
import blackPotImg from './imos/블랙팟.png';
import cushionImg from './imos/쿠션.png';
import perfumeImg from './imos/향수.png';
import nailImg from './imos/네일.png';
import oliveyoungImg from './imos/olvlogo.png';
import amoreImg from './imos/apf.png';
import innisfreeImg from './imos/innis.png';
import lushImg from './imos/lu.png';
import BbasketGuide from './bbasketGuide';

export const getBrandTotalCount = (basket, brandId) =>
  Object.values(basket[brandId] || {}).reduce((a, b) => a + b, 0);

export const INITIAL_CATEGORIES = [
  {
    id: 'skin',
    title: '스킨병',
    desc: '기초/케어제품(플라스틱,유리)',
    image: bottleImg,
    items: ['기초스킨', '바디', '클렌징', '헤어', '선케어', '핸드크림'],
  },
  {
    id: 'cushion',
    title: '쿠션',
    desc: '메이크업_쿠션 및 팩트',
    image: cushionImg,
    items: ['쿠션', '팩트'],
    note: '퍼프 제외',
  },
  {
    id: 'perfume',
    title: '향수병',
    desc: '향수 및 실내용 방향 제품',
    image: perfumeImg,
    items: ['향수', '디퓨저(방향제)'],
  },
  {
    id: 'lush',
    title: '블랙/화이트팟',
    desc: '45g 이상 러쉬 전용 팟 용기',
    image: blackPotImg,
    items: ['블랙팟', '화이트팟'],
    note: '투명한 플라스틱공병 제외',
  },
  {
    id: 'etc',
    title: '기타',
    desc: '별도 분류가 필요한 공병',
    image: nailImg,
    items: ['네일리무버'],
  },
];

export const BRAND_OPTIONS = [
  {
    id: 'oliveyoung',
    number: '1번',
    name: '올리브영',
    image: oliveyoungImg,
    content: '올리브영 제품 \n OR \n 어디 브랜드인지 잘 모르겠어요!',
  },
  {
    id: 'amore',
    number: '2번',
    name: '아모레퍼시픽 계열 브랜드',
    image: amoreImg,
    content: '설화수 /미장센/ 헤라/ 아이오페/ 마몽드/ 라네즈/ 려/ 일리윤',
  },
  {
    id: 'innisfree',
    number: '3번',
    name: '이니스프리',
    image: innisfreeImg,
    content: '이니스프리 제품 ',
  },
  {
    id: 'lush',
    number: '4번',
    name: '러쉬',
    image: lushImg,
    content: '러쉬 제품',
  },
];

const BRAND_ACCEPTED_ITEMS = {
  oliveyoung: {
    skin: ['기초스킨', '클렌징', '헤어', '선케어', '바디', '핸드크림'],
    cushion: ['쿠션', '팩트'],
  },
  amore: {
    skin: ['기초스킨', '클렌징', '헤어', '바디', '핸드크림'],
    cushion: ['쿠션', '팩트'],
    perfume: ['향수'],
  },
  innisfree: {
    skin: ['기초스킨', '선케어', '클렌징', '헤어', '핸드크림'],
    perfume: ['향수', '디퓨저(방향제)'],
    etc: ['네일리무버'],
  },
  lush: {
    lush: ['블랙팟', '화이트팟'],
  },
};

/*계산기 메인*/
export default function BasketPage({ onNavigate, savedRecords, setSavedRecords }) {

  // 브랜드별 바구니 내역
  const [basketByBrand, setBasketByBrand] = useState({});
  // 담은 순서를 저장하는 배열
  const [addedOrder, setAddedOrder] = useState([]);
  // 현재 계산 
  const [calculationId, setCalculationId] = useState(() => Date.now().toString());
  // 현재 화면
  const [page, setPage] = useState('bottle');
  // 현재 선택된 필터 브랜드
  const [activeBrandId, setActiveBrandId] = useState('');
  // 커스텀 경고창
  const [warningMessage, setWarningMessage] = useState('');
  const cardsContainerRef = useRef(null);

  // 현재 선택된 브랜드 
  const activeBrand = BRAND_OPTIONS.find((brand) => brand.id === activeBrandId);
  // 현재 선택된 브랜드 항목
  const activeBasket = activeBrandId ? basketByBrand[activeBrandId] || {} : {};

  /*브랜드별 수거 품목 필터링*/
  const getVisibleItems = (category) => {
    if (!activeBrandId) {
      return category.items;
    }
    return BRAND_ACCEPTED_ITEMS[activeBrandId]?.[category.id] || [];
  };

  /*화면에 노출할 카테고리 목록*/
  const visibleCategories = INITIAL_CATEGORIES
    .map((category) => ({
      ...category,
      visibleItems: getVisibleItems(category),
    }))
    .filter((category) => category.visibleItems.length > 0);

  /*브랜드 필터 버튼 클릭*/
  const handleBrandFilterClick = (brandId) => {
    if (activeBrandId === brandId) {
      setActiveBrandId('');
      return;
    }
    setActiveBrandId(brandId);

    // 브랜드 선택 시 공병 카드 선택 영역으로 자동 포커스
    setTimeout(() => {
      cardsContainerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  /*바구니에 공병 추가*/
  const handleAddCategory = (categoryId) => {
    if (!activeBrandId) {
      return;
    }

    if (totalItemsCount >= 30) {
      setWarningMessage('바구니에는 최대 30개의 공병만 담을 수 있습니다!');
      return;
    }

    // 담는 순서 추가
    setAddedOrder((prev) => {
      const exists = prev.some((item) => item.brandId === activeBrandId && item.categoryId === categoryId);
      if (!exists) {
        return [...prev, { brandId: activeBrandId, categoryId }];
      }
      return prev;
    });

    setBasketByBrand((prev) => ({
      ...prev,
      [activeBrandId]: {
        ...(prev[activeBrandId] || {}),
        [categoryId]: ((prev[activeBrandId] || {})[categoryId] || 0) + 1,
      },
    }));
  };

  /*공병 수량 재헌*/
  const handleCategoryCountChange = (categoryId, type) => {
    if (!activeBrandId) {
      return;
    }

    if (type === 'plus' && totalItemsCount >= 30) {
      setWarningMessage('바구니에는 최대 30개의 공병만 \n담을 수 있습니다!');
      return;
    }

    // 담는 순서 업데이트
    if (type === 'plus') {
      setAddedOrder((prev) => {
        const exists = prev.some((item) => item.brandId === activeBrandId && item.categoryId === categoryId);
        if (!exists) {
          return [...prev, { brandId: activeBrandId, categoryId }];
        }
        return prev;
      });
    } else if (type === 'minus') {
      const currentCount = basketByBrand[activeBrandId]?.[categoryId] || 0;
      if (currentCount <= 1) {
        setAddedOrder((prev) =>
          prev.filter((item) => !(item.brandId === activeBrandId && item.categoryId === categoryId))
        );
      }
    }

    setBasketByBrand((prev) => {
      const currentBrandBasket = prev[activeBrandId] || {};
      const currentCount = currentBrandBasket[categoryId] || 0;
      const nextBrandBasket = { ...currentBrandBasket };

      if (type === 'minus' && currentCount <= 1) {
        delete nextBrandBasket[categoryId];
      } else {
        nextBrandBasket[categoryId] = type === 'plus' ? currentCount + 1 : currentCount - 1;
      }

      const nextBasketByBrand = { ...prev };
      if (Object.keys(nextBrandBasket).length === 0) {
        delete nextBasketByBrand[activeBrandId];
      } else {
        nextBasketByBrand[activeBrandId] = nextBrandBasket;
      }

      return nextBasketByBrand;
    });
  };

  /* 장바구니 초기화 */
  const handleResetBasket = () => {
    setBasketByBrand({});
    setAddedOrder([]);
    setCalculationId(Date.now().toString());
  };

  /* 특정 브랜드의 총 담긴 공병 개수 */
  const getBrandTotalCountLocal = (brandId) => getBrandTotalCount(basketByBrand, brandId);

  /* 현재 바구니에 담긴 공병이 존재하는 브랜드*/
  const selectedBrandIds = BRAND_OPTIONS
    .map((brand) => brand.id)
    .filter((brandId) => getBrandTotalCountLocal(brandId) > 0);

  /* 바구니에 담긴 모든 브랜드의 총 공병 합산 수량*/
  const totalItemsCount = selectedBrandIds.reduce((sum, brandId) => sum + getBrandTotalCountLocal(brandId), 0);



  /* 전체 선택된 아이템들의 종합 요약 텍스트 생성*/
  const selectedItemsSummary = (() => {
    const orderedBrandIds = [];
    addedOrder.forEach(({ brandId }) => {
      if (!orderedBrandIds.includes(brandId)) {
        orderedBrandIds.push(brandId);
      }
    });

    return orderedBrandIds
      .map((brandId) => {
        const brand = BRAND_OPTIONS.find((option) => option.id === brandId);
        const brandCategories = addedOrder
          .filter((item) => item.brandId === brandId)
          .map(({ categoryId }) => {
            const category = INITIAL_CATEGORIES.find((cat) => cat.id === categoryId);
            const count = basketByBrand[brandId]?.[categoryId] || 0;
            if (count === 0) return null;
            return `${category.title} ${count}개`;
          })
          .filter(Boolean);

        if (brandCategories.length === 0) return null;
        return `${brand.name}: ${brandCategories.join(', ')}`;
      })
      .filter(Boolean)
      .join(' / ');
  })();

  /* 가이드 페이지로 이동했을 때 */
  if (page === 'guide' && selectedBrandIds.length > 0) {
    return (
      <BbasketGuide
        basketByBrand={basketByBrand}
        setPage={setPage}
        savedRecords={savedRecords}
        setSavedRecords={setSavedRecords}
        onNavigate={onNavigate}
        resetBasket={handleResetBasket}
        calculationId={calculationId}
        selectedBrandIds={selectedBrandIds}
        totalItemsCount={totalItemsCount}
      />
    );
  }

  return (
    <div className="basket-page">
      <div className="basket-select-section">
        <div className="basket-main-visual">
          <div className="basket-visual-box">
            <img className="mock-basket-img" src={basketImg} alt="공병 " />
            <span className="visual-tag">공병 계산기</span>
          </div>
          <p className="visual-subtext">브랜드 로고를 선택하면 수거 가능 품목만 보여요. </p>
          <h1 className="visual-main-title">브랜드와 공병 종류를 선택하세요.</h1>
        </div>
        <div className="brand-filter-section">
          <div className="brand-filter-row">
            {BRAND_OPTIONS.map((brand) => (
              <button
                className={`brand-filter-button ${activeBrandId === brand.id ? 'is-selected' : ''}`}
                type="button"
                key={brand.id}
                onClick={() => handleBrandFilterClick(brand.id)}
              >
                <img src={brand.image} alt={`${brand.name} 로고`} />
                <span className="brand-name-text">{brand.name}</span>
                <span className="brand-desc-center">{brand.content}</span>
              </button>
            ))}
          </div>
          {activeBrand && (
            <span className="active-brand-copy">
              현재 {activeBrand.name}에서 수거 가능한 항목만 표시 중입니다.
            </span>
          )}
        </div>

        {/* 공병 종류 선택 */}
        <div ref={cardsContainerRef} className="basket-cards-container">
          {visibleCategories.map((category) => {
            const categoryCount = activeBasket[category.id] || 0;
            const isSelectedCategory = categoryCount > 0;

            return (
              <div key={category.id} className={`basket-simple-card ${category.id} ${isSelectedCategory ? 'is-active' : ''}`}>

                {/* 상단 공병 종류 */}
                <div className="card-top-info">
                  <h2 className="card-title">{category.title}</h2>
                </div>

                {/* 공병 아이콘 */}
                <div className="card-center-visual">
                  <img className="card-center-img" src={category.image} alt={`${category.title} 이미지`} />
                </div>

                {/* 상세 설명 + 예외 품목 경고 */}
                <p className="card-desc-text">{category.desc}</p>
                <span className={`item-warn-note ${category.note ? '' : 'is-empty'}`}>
                  {category.note || '\u00A0'}
                </span>

                {/* 브랜드에서 허용하는 세부 품목들 칩 */}
                <div className="card-items-wrapper">
                  {category.visibleItems.map((item) => (
                    <div key={item} className="item-chip-row">
                      <span className="item-chip-name">{item}</span>
                    </div>
                  ))}
                </div>

                {/* +/-*/}
                <div className="category-add-area">
                  {isSelectedCategory ? (
                    <div className="category-count-box">
                      <button onClick={() => handleCategoryCountChange(category.id, 'minus')}>-</button>
                      <input type="text" value={categoryCount} readOnly />
                      <button onClick={() => handleCategoryCountChange(category.id, 'plus')}>+</button>
                    </div>
                  ) : (
                    <button
                      className="category-add-btn"
                      disabled={!activeBrandId}
                      onClick={() => handleAddCategory(category.id)}
                    >
                      {activeBrandId ? '담기' : '브랜드 선택'}
                    </button>
                  )}
                </div>

              </div>
            );
          })}
        </div>
        <div className="common-warning-box">
          <strong>🚫 수거 불가능 품목</strong>
          <p>💄 색조 화장품 용기 ·💅네일용품 · 🧲 철제 용기 · 🪥 치약/칫솔 · 🧰 미용 소품 · ⚡ 헤어가전 · 샘플용기</p>
        </div>
        <div className={`basket-bottom-bar ${totalItemsCount > 0 ? 'active' : ''}`}>
          <div>
            <strong>총 {totalItemsCount}개 선택</strong>
            <p>
              {totalItemsCount > 0 ? selectedItemsSummary : '브랜드 로고를 선택한 뒤 공병을 담아주세요.'}
            </p>
          </div>
          <div className="bottom-bar-buttons" style={{ display: 'flex', gap: '8px' }}>
            <button
              className="basket-reset-button"
              type="button"
              onClick={handleResetBasket}
            >
              초기화
            </button>
            <button
              className="basket-next-button"
              disabled={totalItemsCount === 0}
              onClick={() => {
                setCalculationId(Date.now().toString());
                setPage('guide');
                window.scrollTo(0, 0);
              }}
            >
              next
            </button>
          </div>
        </div>

      </div>
      {warningMessage && (
        <div className="custom-alert-overlay" onClick={() => setWarningMessage('')}>
          <div className="custom-alert-box" onClick={(e) => e.stopPropagation()}>
            <span className="alert-box-icon">⚠️</span>
            <p className="alert-box-message">{warningMessage}</p>
            <button className="alert-box-button" onClick={() => setWarningMessage('')}>
              확인
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
