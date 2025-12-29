/**
 * 1866 크롤러 PoC 테스트 스크립트
 * 
 * 실행 방법:
 * npx ts-node scripts/test-1866-crawler.ts
 */

import { CrawlerFactory } from '../src/services/crawling/crawler.factory';

async function testCrawler() {
    console.log('='.repeat(60));
    console.log('1866 크롤러 PoC 테스트 시작');
    console.log('='.repeat(60));
    console.log();

    try {
        // 1. 크롤러 생성
        console.log('📦 크롤러 인스턴스 생성...');
        const crawler = CrawlerFactory.create('1866');
        console.log('✅ 크롤러 생성 완료\n');

        // 2. 상품 검색 테스트
        console.log('🔍 상품 검색 테스트...');
        console.log('키워드: "무선 이어폰"\n');

        const searchResults = await crawler.search('무선 이어폰', {
            sortBy: 'price',
            limit: 5,
        });

        console.log(`✅ 검색 완료: ${searchResults.length}개 상품 발견\n`);

        // 검색 결과 출력
        searchResults.forEach((product, index) => {
            console.log(`[${index + 1}] ${product.name}`);
            console.log(`    가격: ${product.price.toLocaleString()}원`);
            console.log(`    최소 주문: ${product.minOrderQty}개`);
            console.log(`    배송비: ${product.shippingCost.toLocaleString()}원`);
            console.log(`    URL: ${product.url}`);
            console.log();
        });

        // 3. 최저가 상품 찾기 테스트
        console.log('💰 최저가 상품 찾기 테스트...\n');

        const lowestPriceProduct = await crawler.getLowestPrice('무선 이어폰');

        if (lowestPriceProduct) {
            console.log('✅ 최저가 상품 발견:');
            console.log(`    상품명: ${lowestPriceProduct.name}`);
            console.log(`    가격: ${lowestPriceProduct.price.toLocaleString()}원`);
            console.log(`    최소 주문: ${lowestPriceProduct.minOrderQty}개`);
            console.log();

            // 원가 계산 예시
            const totalCost = (lowestPriceProduct.price * lowestPriceProduct.minOrderQty) +
                lowestPriceProduct.shippingCost;
            const costPerUnit = totalCost / lowestPriceProduct.minOrderQty;

            console.log('📊 원가 계산:');
            console.log(`    도매가: ${lowestPriceProduct.price.toLocaleString()}원`);
            console.log(`    수량: ${lowestPriceProduct.minOrderQty}개`);
            console.log(`    배송비: ${lowestPriceProduct.shippingCost.toLocaleString()}원`);
            console.log(`    총 원가: ${totalCost.toLocaleString()}원`);
            console.log(`    개당 원가: ${costPerUnit.toLocaleString()}원`);
            console.log();

            // 4. 상품 상세 조회 테스트
            console.log('📄 상품 상세 조회 테스트...\n');

            const productDetail = await crawler.getProductDetail(lowestPriceProduct.id);

            console.log('✅ 상세 정보 조회 완료:');
            console.log(`    상품명: ${productDetail.name}`);
            console.log(`    가격: ${productDetail.price.toLocaleString()}원`);
            console.log(`    이미지 수: ${productDetail.images.length}개`);
            console.log(`    설명 길이: ${productDetail.description?.length || 0}자`);
            console.log(`    스펙 항목: ${Object.keys(productDetail.specifications || {}).length}개`);
            console.log();

            // 스펙 출력
            if (productDetail.specifications) {
                console.log('📋 상품 스펙:');
                Object.entries(productDetail.specifications).forEach(([key, value]) => {
                    console.log(`    ${key}: ${value}`);
                });
                console.log();
            }

            // 이미지 URL 출력
            console.log('🖼️  이미지 URL:');
            productDetail.images.forEach((url, index) => {
                console.log(`    [${index + 1}] ${url}`);
            });
            console.log();
        }

        // 5. 테스트 완료
        console.log('='.repeat(60));
        console.log('✅ 모든 테스트 완료!');
        console.log('='.repeat(60));
        console.log();
        console.log('다음 단계:');
        console.log('1. 실제 1866 사이트 구조 분석');
        console.log('2. 크롤러 셀렉터 수정');
        console.log('3. 가격 최적화 엔진 구현');
        console.log('4. API 엔드포인트 개발');
        console.log();

    } catch (error: any) {
        console.error('❌ 테스트 실패:', error.message);
        console.error(error.stack);
        process.exit(1);
    }
}

// 테스트 실행
testCrawler();
