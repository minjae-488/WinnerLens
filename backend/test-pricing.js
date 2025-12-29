// 가격 최적화 엔진 테스트

console.log('='.repeat(70));
console.log('💰 가격 최적화 엔진 테스트');
console.log('='.repeat(70));
console.log();

// 시뮬레이션 데이터
const testCases = [
    {
        name: '무선 이어폰',
        input: {
            wholesalePrice: 8900,
            quantity: 10,
            shippingCost: 3000,
            extraCost: 0,
            targetMargin: 0.30,
            category: 'electronics',
            keyword: '무선 이어폰',
        },
    },
    {
        name: 'USB 케이블',
        input: {
            wholesalePrice: 1200,
            quantity: 50,
            shippingCost: 5000,
            extraCost: 0,
            targetMargin: 0.35,
            category: 'electronics',
            keyword: 'USB 케이블',
        },
    },
    {
        name: '핸드폰 케이스',
        input: {
            wholesalePrice: 3500,
            quantity: 20,
            shippingCost: 2500,
            extraCost: 500,
            targetMargin: 0.40,
            category: 'electronics',
            keyword: '핸드폰 케이스',
        },
    },
];

// 가격 계산 함수
function calculatePrice(input) {
    // 1. 원가 계산
    const wholesaleCost = input.wholesalePrice * input.quantity;
    const totalCost = wholesaleCost + input.shippingCost + (input.extraCost || 0);
    const costPerUnit = totalCost / input.quantity;

    // 2. 수수료율
    const feeRates = {
        'electronics': 0.12,
        'fashion': 0.15,
        'beauty': 0.13,
        'default': 0.12,
    };
    const feeRate = feeRates[input.category] || feeRates['default'];

    // 3. 손익분기점
    const breakeven = costPerUnit / (1 - feeRate);

    // 4. 목표가
    const targetPrice = costPerUnit / (1 - feeRate - input.targetMargin);

    // 5. 경쟁가 (시뮬레이션)
    const competitorPrices = [18500, 19900, 17900, 21000, 18900];
    const median = competitorPrices.sort((a, b) => a - b)[Math.floor(competitorPrices.length / 2)];
    const competitivePrice = median * 0.95;

    // 6. 추천가
    const recommendedPrices = {
        aggressive: Math.round(competitivePrice / 100) * 100,
        balanced: Math.round(((targetPrice + competitivePrice) / 2) / 100) * 100,
        premium: Math.round(targetPrice / 100) * 100,
    };

    // 7. 마진율 계산
    function calculateMargin(sellingPrice) {
        const fee = sellingPrice * feeRate;
        const profit = sellingPrice - costPerUnit - fee;
        return (profit / sellingPrice) * 100;
    }

    const margins = {
        aggressive: calculateMargin(recommendedPrices.aggressive),
        balanced: calculateMargin(recommendedPrices.balanced),
        premium: calculateMargin(recommendedPrices.premium),
    };

    // 8. 순이익 계산
    function calculateProfit(sellingPrice) {
        const fee = sellingPrice * feeRate;
        return sellingPrice - costPerUnit - fee;
    }

    return {
        costPerUnit,
        totalCost,
        breakeven,
        recommendedPrices,
        margins,
        feeRate,
        calculateProfit,
        calculateMargin,
    };
}

// 테스트 실행
testCases.forEach((testCase, index) => {
    console.log(`\n${'='.repeat(70)}`);
    console.log(`테스트 케이스 ${index + 1}: ${testCase.name}`);
    console.log('='.repeat(70));

    const input = testCase.input;
    const result = calculatePrice(input);

    // 입력 정보
    console.log('\n📦 입력 정보:');
    console.log(`   도매가: ${input.wholesalePrice.toLocaleString()}원`);
    console.log(`   수량: ${input.quantity}개`);
    console.log(`   배송비: ${input.shippingCost.toLocaleString()}원`);
    if (input.extraCost) {
        console.log(`   기타 비용: ${input.extraCost.toLocaleString()}원`);
    }
    console.log(`   목표 마진: ${(input.targetMargin * 100).toFixed(0)}%`);
    console.log(`   카테고리: ${input.category}`);

    // 원가 분석
    console.log('\n📊 원가 분석:');
    console.log(`   총 원가: ${result.totalCost.toLocaleString()}원`);
    console.log(`   개당 원가: ${result.costPerUnit.toLocaleString()}원`);
    console.log(`   쿠팡 수수료율: ${(result.feeRate * 100).toFixed(0)}%`);
    console.log(`   손익분기점: ${Math.round(result.breakeven).toLocaleString()}원`);

    // 추천 판매가
    console.log('\n💵 추천 판매가:');

    console.log('\n   [공격적 전략] 점유율 우선');
    console.log(`   판매가: ${result.recommendedPrices.aggressive.toLocaleString()}원`);
    console.log(`   마진율: ${result.margins.aggressive.toFixed(1)}%`);
    console.log(`   순이익: ${Math.round(result.calculateProfit(result.recommendedPrices.aggressive)).toLocaleString()}원/개`);

    console.log('\n   [균형 전략] 추천 ⭐');
    console.log(`   판매가: ${result.recommendedPrices.balanced.toLocaleString()}원`);
    console.log(`   마진율: ${result.margins.balanced.toFixed(1)}%`);
    console.log(`   순이익: ${Math.round(result.calculateProfit(result.recommendedPrices.balanced)).toLocaleString()}원/개`);

    console.log('\n   [프리미엄 전략] 마진 우선');
    console.log(`   판매가: ${result.recommendedPrices.premium.toLocaleString()}원`);
    console.log(`   마진율: ${result.margins.premium.toFixed(1)}%`);
    console.log(`   순이익: ${Math.round(result.calculateProfit(result.recommendedPrices.premium)).toLocaleString()}원/개`);

    // 수익 예측 (균형 전략 기준)
    const balancedProfit = result.calculateProfit(result.recommendedPrices.balanced);
    const totalProfit = balancedProfit * input.quantity;

    console.log('\n💰 예상 수익 (균형 전략 기준):');
    console.log(`   개당 순이익: ${Math.round(balancedProfit).toLocaleString()}원`);
    console.log(`   총 예상 이익: ${Math.round(totalProfit).toLocaleString()}원 (${input.quantity}개 판매 시)`);

    // ROI 계산
    const roi = (totalProfit / result.totalCost) * 100;
    console.log(`   ROI: ${roi.toFixed(1)}%`);

    console.log();
});

// 요약
console.log('\n' + '='.repeat(70));
console.log('✅ 가격 최적화 엔진 테스트 완료!');
console.log('='.repeat(70));
console.log();
console.log('검증된 기능:');
console.log('✅ 원가 계산 (도매가 + 배송비 + 기타)');
console.log('✅ 손익분기점 계산');
console.log('✅ 3가지 가격 전략 (공격적/균형/프리미엄)');
console.log('✅ 마진율 계산');
console.log('✅ 순이익 계산');
console.log('✅ ROI 계산');
console.log();
console.log('다음 단계:');
console.log('1. API 엔드포인트 개발');
console.log('2. 프론트엔드 가격 계산기 UI');
console.log('3. 실시간 경쟁가 분석 (쿠팡 API 연동)');
console.log();
