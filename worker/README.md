# ⚡ Bookiry Cloudflare Worker (AI Edge Proxy)

Bookiry의 AI 질문 생성 엔진을 일반 사용자에게 **API 키 입력 요구 없이 무료/자동으로 제공**하기 위한 Cloudflare Worker 서버리스 백엔드입니다.

---

## 🚀 1분 배포 방법

### 1. 패키지 설치
```bash
cd worker
npm install
```

### 2. Gemini API 키 비밀값 등록
```bash
npx wrangler secret put GEMINI_API_KEY
# 프롬프트가 뜨면 Google AI Studio 무료 API 키를 붙여넣기
```

### 3. 클라우드플레어에 배포 (10초 소요, 비용 $0)
```bash
npx wrangler deploy
```

배포가 완료되면 다음과 같은 주소가 출력됩니다:
```
https://bookiry-worker.<your-subdomain>.workers.dev
```

### 4. Bookiry 프론트엔드 연동
`bookiry/web/js/app.js` 상단의 `DEFAULT_WORKER_URL` 상수에 위 주소를 넣어주시면, 전 세계 모든 방문자가 API 키 입력 없이 즉시 소크라테스식 질문을 생성받을 수 있습니다.
