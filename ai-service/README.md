# WinnerLens AI Service

FastAPI 기반 AI 서비스

## 시작하기

```bash
# 가상환경 생성
python -m venv venv

# 가상환경 활성화 (Windows)
.\venv\Scripts\activate

# 의존성 설치
pip install -r requirements.txt

# 개발 서버 실행
uvicorn main:app --reload --port 8000
```

서버: [http://localhost:8000](http://localhost:8000)
문서: [http://localhost:8000/docs](http://localhost:8000/docs)

## 기술 스택

- **Framework**: FastAPI
- **Language**: Python 3.11
- **AI**: OpenAI GPT-4, LangChain
