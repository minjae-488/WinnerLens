import { ICrawler } from './crawler.interface';
import { Crawler1866 } from './1866.crawler';

/**
 * 크롤러 팩토리
 * 사이트 이름에 따라 적절한 크롤러 인스턴스를 생성
 */
export class CrawlerFactory {
    private static instances: Map<string, ICrawler> = new Map();

    /**
     * 크롤러 인스턴스 생성 (싱글톤 패턴)
     */
    static create(site: '1866' | 'domeggook'): ICrawler {
        // 이미 생성된 인스턴스가 있으면 재사용
        if (this.instances.has(site)) {
            return this.instances.get(site)!;
        }

        // 새 인스턴스 생성
        let crawler: ICrawler;

        switch (site) {
            case '1866':
                crawler = new Crawler1866();
                break;

            case 'domeggook':
                // TODO: 도매매 크롤러 구현 후 추가
                throw new Error('도매매 크롤러는 아직 구현되지 않았습니다.');

            default:
                throw new Error(`Unknown site: ${site}`);
        }

        // 인스턴스 캐싱
        this.instances.set(site, crawler);

        return crawler;
    }

    /**
     * 모든 크롤러 인스턴스 초기화
     */
    static reset(): void {
        this.instances.clear();
    }
}
