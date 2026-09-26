# 📖 Bookiry (부키리) - 목적 지향형 1:1 액티브 독서 실행 엔진

> **"Stop Summarizing, Start Questioning."**  
> (책 요약은 일주일이면 잊혀집니다. 가벼운 나침반 하나 품고 읽어, 책을 덮었을 때 잔잔하고 또렷한 여운을 남깁니다.)

---

## 🕊️ 0. 서비스의 본질과 철학 (Core Philosophy)

> **"질문에 전부 답변을 받는 것이 목적이 아닙니다.**  
> **질문은 시험이나 숙제가 아니라, 독서 내내 독자의 뇌리에 가벼운 파동을 일으키는 [지적 촉매제(The Spark)]일 뿐입니다."**

- 독자는 질문에 억지로 답할 의무가 없습니다.
- 책을 펴기 전 마음에 **'나침반(질문)'** 하나만 품고 들어가면, 책의 문장들이 이전과 완전히 다른 입체적인 의미로 다가옵니다.
- 책을 읽는 도중 형식에 구애받지 않고 문득 스친 생각, 단편적인 낙서, 음성 웅얼거림을 **'생각의 타임라인(Raw Reflections)'**에 툭툭 던져놓기만 하면 됩니다.
- 책을 덮었을 때(완독 시), AI가 이 소중한 파편들을 엮어 **단정한 완독 보고서(`01_reading_report.md`)**와 **연말 리캡(`2026_Bookiry_Recap.md`)**으로 합성(Synthesis)해 줍니다.

---

## 📂 1. 스토리지 아키텍처 (Obsidian & Google Drive Protocol)

사용자의 개인 저장소(Google Drive `drive.file` 및 Obsidian Vault)에는 아래의 미니멀하고 아름다운 마크다운 트리 구조로 영구 보존됩니다:

```text
📁 Bookiry/
└── 📁 2026/
    ├── 📁 Zero to One/
    │   ├── 00_Index.md              (사전 질문, 프론트매터, 개인 메모 누적 타임라인)
    │   └── 01_reading_report.md     (완독 버튼 클릭 시 Gemini가 합성한 최종 분석 보고서)
    └── 📊 2026_Bookiry_Recap.md      (연말 자동 집계되는 Spotify 스타일 독서 리캡)
```

### 📄 `00_Index.md` 표준 템플릿 규격
```markdown
---
title: "Zero to One"
author: "Peter Thiel"
year: 2026
status: "Reading" # Reading ➔ Completed
tags:
  - bookiry
  - business
  - philosophy
compass: "Work & Growth"
---

# Zero to One

### 💡 The Spark
> "남들은 모두 맞다고 고개를 끄덕이는데, 나 혼자 속으로 '아닌데?' 싶었던 사소한 신념 하나가 있나요?"

### ⚔️ The Baccalauréat
> "저자는 '경쟁은 패배자들의 것이다'라고 단언합니다. 완독 후 당신은 여전히 공정한 경쟁이 사회를 발전시킨다고 믿을 수 있을까요?"

---

## ✍️ My Reflections (생각의 타임라인)
- **14:20** (p.42) 경쟁하지 말고 독점하라는 말... 우리 팀 지금 다른 회사랑 단가 싸움하는 거 완전 바보짓이었네.
- **14:55** (p.88) "0에서 1로 가는 건 기술이고, 1에서 N으로 가는 건 세계화다." 이 문장 블로그 글감으로 꼭 쓰자.
- **15:30** 🎙️ [음성 메모] 내일 회의 때 우리 서비스만의 10배 뛰어난 킬러 기능이 뭔지 물어봐야겠다.
```

---

## 🏛️ 2. 하이브리드 아키텍처 (Hybrid Edge-Cache Engine)

| 비교 항목 | 초기 기획안 (Client-Only Direct) | 어제 제미나이 제안 (Edge Worker + Cache) | **Bookiry 최종 채택 (하이브리드)** |
| :--- | :--- | :--- | :--- |
| **API 키 보안** | ⚠️ 브라우저 노출 위험 or BYOK(사용자 직접 입력) | ✅ Cloudflare Secret 환경변수로 완벽 은닉 | **✅ Edge Worker 환경변수 은닉 + 선택적 BYOK** |
| **속도 & 레이턴시** | ⚠️ 매번 Gemini API 호출 (2~5초 소요) | ⚡ Cache-First (50ms 즉시 응답) | **⚡ 캐시 적중 시 0.05초 / 미적중 시 2초** |
| **운영 고정비** | 🟢 $0 (서버 없음) | 🟢 $0 (Cloudflare Workers 10만 건/일 무료) | **🟢 $0 (Cloudflare Workers + KV/D1 무료 티어)** |
| **도서 질문의 개인화** | 💡 무드/목표별 완벽 맞춤형 | ⚠️ 책 제목만으로 캐시 시 무드 반영 한계 | **💡 복합 캐시 키 (`Title+Author` + `Compass Direction`)** |
| **클라이언트 확장성** | 🌐 Web 브라우저 전용 | 🔌 Obsidian, Web, CLI, REST API 모두 대응 | **🌐 Web SPA (English-First) + 🧠 Obsidian 로컬 연동** |
| **유저 데이터 소장** | 📁 Google Drive (`drive.file`) 완벽 소유 | 📁 Google Drive 자동 동기화 | **📁 Google Drive + Obsidian 로컬 마크다운 완벽 연동** |

---

## 🔄 3. 최종 엔드투엔드 데이터 플로우

```text
[ Clients ]
  ├─ 🌐 Web SPA (100% Pure Global English, Mobile-First)
  └─ 🧠 Obsidian Vault (로컬 마크다운 직접 연동)
       │
       ▼ (1) 도서 검색 & 나침반 전달 (Title, Author, Compass: Healing/Growth/Fiction/Custom)
[ Cloudflare Edge Worker ] (무료 10만건/일)
       │
       ├── DB(KV/D1)에 캐시 존재? 
       │     ├── [YES] ──► 즉시 나침반 질문 반환 (Cache-First, 지연 0.05초, API 비용 0원)
       │     └── [NO]  ──► Google Gemini API (Flash 모델) 호출
       │                     ├── NoSQL DB(KV)에 캐시 적재
       │                     └── Client로 구조화된 JSON 질문 반환
       ▼
[ 독서 중 : 타임라인 메모 누적 (Append-Only Event Log) ]
  • 앱을 껐다 켜도 로컬스토리지에 안전 보존
  • `00_Index.md`의 `## ✍️ My Reflections` 아래에 시간순 불릿 자동 추가
       │
       ▼ (2) 완독 버튼 클릭 ("Finish Book & Mint Resonance Card")
[ Gemini AI 합성 엔진 (Synthesizer) ]
  • 사전 질문(골격) + 독자가 남긴 타임라인 메모(살점) 교차 분석
       │
       ▼ (3) 개인 저장소 발행
[ User Storage ]
  ├─ 📁 Google Drive API (`00_Index.md` 상태를 Completed로 승격 + `01_reading_report.md` 발행)
  └─ 🧠 Obsidian Vault (`[[Zero to One]]` 로컬 그래프 연결 및 연말 리캡 대시보드 반영)
```

---

## 📁 4. 폴더 구조
```
bookiry/
├── README.md               # 서비스 기획 및 아키텍처 정의서 (본 문서)
├── TASK_HISTORY.md         # 개발 작업 히스토리 (워크스페이스 룰 4 준수)
│
├── worker/                 # Cloudflare Edge Worker (Cache-First API)
│   ├── wrangler.toml       # Cloudflare Worker 배포 설정
│   └── src/
│       └── index.js        # Cache 확인 ➡️ Gemini Flash 호출 ➡️ DB 캐시 저장 프록시
│
├── web/                    # 프론트엔드 Web SPA (100% Pure Global English)
│   ├── index.html          # 메인 UI (나침반 토끼, 4대 나침반, 인터랙티브 데모, 서재 아카이브)
│   ├── css/
│   │   ├── base.css        # Plus Jakarta Sans + Newsreader, 슬레이트 라이트 토큰
│   │   └── components.css  # 토끼 모션, 반응형 캐러셀, 제로 오버플로우, @media print
│   └── js/
│       ├── config.js       # 엔드포인트 및 API 설정
│       ├── app.js          # 나침반 칩 반응, 토끼 속삭임, 아코디언 카드, 데모 시뮬레이터
│       └── drive_auth.js   # Google OAuth 및 Google Drive API 연동
│
└── obsidian/               # Obsidian 연동용 스크립트 / 템플릿
    └── bookiry_obsidian_template.md
```
