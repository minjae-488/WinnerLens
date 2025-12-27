export default function Home() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-24">
            <div className="z-10 max-w-5xl w-full items-center justify-center font-mono text-sm">
                <h1 className="text-4xl font-bold text-center mb-4">
                    🏆 WinnerLens
                </h1>
                <p className="text-xl text-center text-gray-600 mb-8">
                    AI 기반 쿠팡 셀러 자동화 플랫폼
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
                    <div className="p-6 border rounded-lg hover:border-blue-500 transition-colors">
                        <h2 className="text-xl font-semibold mb-2">🔍 트렌드 분석</h2>
                        <p className="text-gray-600">실시간 검색 트렌드 기반 상품 추천</p>
                    </div>
                    <div className="p-6 border rounded-lg hover:border-blue-500 transition-colors">
                        <h2 className="text-xl font-semibold mb-2">📊 스코어링</h2>
                        <p className="text-gray-600">다차원 분석으로 성공 가능성 예측</p>
                    </div>
                    <div className="p-6 border rounded-lg hover:border-blue-500 transition-colors">
                        <h2 className="text-xl font-semibold mb-2">🤖 AI 생성</h2>
                        <p className="text-gray-600">GPT-4 기반 고품질 리스팅 자동 생성</p>
                    </div>
                    <div className="p-6 border rounded-lg hover:border-blue-500 transition-colors">
                        <h2 className="text-xl font-semibold mb-2">✅ 자동 검수</h2>
                        <p className="text-gray-600">정책 준수 자동 확인 및 수정 제안</p>
                    </div>
                </div>
                <div className="mt-8 text-center">
                    <p className="text-sm text-gray-500">
                        Phase 1 개발 중... 🚀
                    </p>
                </div>
            </div>
        </main>
    );
}
