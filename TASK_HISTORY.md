# 📜 Bookiry 개발 히스토리 (Task History)

이 문서는 ThePathLab 워크스페이스 룰에 따라 Bookiry 프로젝트의 모든 기획, 아키텍처 결정, 기능 구현 내역을 누적 기록하는 마스터 문서입니다.

---

## [2026-09-27] Gemini Flash 실시간 질문 지능 엔진 탑재 & Google Drive OAuth 자동 동기화 배포
- **1. 요청사항**:
  - Obsidian(obsi) 도서 가이드 질문처럼 책의 실제 내용(목차/저자 이론/핵심 개념)을 읽고 날카로운 질문을 생성하도록 Gemini AI 파이프라인 구현.
  - 임의의 책에 대해 단순 템플릿 치환이 아닌 고유한 4대 불꽃(Sparks: Spark, Lens, Quest, Echo) 도출.
  - Google Drive 연동을 통해 사용자의 구글 드라이브에 `Bookiry/[Year]/[도서명 - 저자]/` 폴더와 `00_Index.md`, 완독 시 `01_reading_report.md`가 자동 생성·동기화되는지 실전 테스트 환경 마련.
  - 전 세계 어디서나 접근 가능하도록 [chicstory.github.io/bookiry/](https://chicstory.github.io/bookiry/) 정식 배포.
- **2. 솔루션 & 구현**:
  - **Google Books API + Gemini Flash 2.5/1.5 지능 파이프라인**:
    - `fetchBookSynopsis(title, author)`: 도서 검색 시 Google Books API에서 실제 줄거리, 목차, 저자 정보를 비동기 확보.
    - `generateSparksWithGemini(title, author, synopsis, compass, customIntent)`: 책의 고유 핵심 논점과 유저의 나침반(무드/고민)을 결합하여 JSON 구조의 4대 소크라테스식 질문 실시간 생성.
    - 로딩 중 AI 브루잉 배너(`.ai-sparks-banner`) 및 스켈레톤 상태 피드백 제공.
  - **Google Identity Services (GIS) & Google Drive REST API v3**:
    - `https://www.googleapis.com/auth/drive.file` 공식 스코프 연동.
    - `findOrCreateDriveFolder`: `Bookiry` 루트 폴더 ➔ `2026` 연도 폴더 ➔ `[도서명 - 저자]` 폴더 계층 자동 확인 및 생성.
    - `uploadOrUpdateDriveMarkdown`: 멀티파트 업로드(`multipart/related`)를 통해 `00_Index.md` 및 `01_reading_report.md` 생성/덮어쓰기.
    - 타임라인 생각 메모 추가/삭제 시 조용한 백그라운드 자동 동기화(`autoSyncToDriveSilently`).
    - 동기화 완료 시 `Drive ↗` 원클릭 웹링크 제공.
  - **설정 모달 (⚙️ AI & Cloud Settings)**:
    - 무료 Google AI Studio Gemini API 키 및 Google OAuth Client ID를 브라우저 `localStorage`에 안전하게 1회 등록/관리하는 클린 라이트 모달 제공.
  - **진짜 음성 받아쓰기 엔진 (Web Speech API)**:
    - 2초 딜레이 목업 텍스트를 제거하고, 브라우저 공식 `SpeechRecognition` / `webkitSpeechRecognition` 연동.
    - 독서 안식처 타임라인 마이크(`timelineMicBtn`) 및 랜딩 시뮬레이터 마이크 클릭 시 실시간 음성 스트리밍 텍스트 변환 (`interimResults: true`).
    - 음성으로 말한 내용이 인풋창에 실시간으로 타이핑되고 엔터/전송 시 구글 드라이브 `00_Index.md`에 즉시 자동 누적.
  - **구글 드라이브 양방향 크로스 디바이스 동기화 (Cloud Pull Sync)**:
    - PC와 스마트폰 등 서로 다른 기기 접속 시 로컬스토리지가 분리되어 타임라인 메모가 보이지 않던 한계를 완벽 해소.
    - 독서 안식처 진입 시 구글 드라이브의 해당 도서 `00_Index.md` 파일을 비동기 다운로드하여 `## ✍️ My Reflections` 메모를 파싱(`pullReflectionsFromDriveSilently`).
    - 기기 로컬스토리지와 원격 드라이브 메모를 지능적으로 병합(Merge)하여, PC에서 쓴 메모가 스마트폰 타임라인 화면에 즉시 렌더링되도록 구현.
  - **모바일-퍼스트 레이아웃 전면 최적화 & CSS 캐시 버스터**:
    - 스마트폰 브라우저의 강력한 CSS 캐싱을 해소하기 위해 `base.css?v=20260927_mob3` 및 `components.css?v=20260927_mob3` 쿼리스트링 갱신.
    - 헤더 네비게이션: 긴 이메일을 숨기고 초록 로그인 배지(`🟢 R`) + 톱니바퀴(`⚙️`)가 360px 모바일 화면에서도 100% 1줄에 고정되도록 압축.
    - 독서 안식처 상단 툴바: 우측으로 잘려나가던 4개 액션 버튼(`Print`, `Obsidian`, `Synced ✓`, `Drive ↗`)을 모바일 전용 2x2 타일 그리드로 자동 정렬하여 가로 스크롤/잘림 완벽 해결.
    - AI 키 안내 배너에 `Set Key ➔` 원터치 버튼을 탑재하여 모바일에서도 1초 만에 설정 모달 호출 가능.
  - **글로벌 프로덕션 배포**:
    - [chicstory.github.io/bookiry/](https://chicstory.github.io/bookiry/) 배포 및 메인 브랜치 푸시 완료.
- **3. 결과 & 검증**:
  - 메인 포털 배포 커밋 완료 (`3e111db`).
  - 모바일 반응형 뷰포트(360px~412px) 및 터치 영역 44px+ 규격 100% 준수.
- **4. 주요 합의 사항**:
  - **프라이버시 제일주의(BYOK & BYOS)**: 모든 API 키와 드라이브 파일은 사용자 브라우저와 사용자 개인 구글 드라이브에만 보관되며 별도 서버 DB에 저장되지 않음.
  - 질문 생성 품질과 구글 드라이브 동기화 경험이 만족스러울 때 후속 단계로 가벼운 구독 모델(Stripe) 결제창 도입.

---

## [2026-09-26] Bookiry 프로젝트 발족 및 하이브리드 아키텍처 수립
- **1. 요청사항**: 
  - `bookiry` 프로젝트 폴더 생성 및 초기화.
  - 어제 제미나이 채팅에서 도출된 구조도(Edge Worker + Cache-First NoSQL + Gemini Flash + Google Drive)와 기존 기획안 비교 분석 및 타당성 검토.
- **2. 솔루션 & 구현**:
  - 기존 기획안(Client-Only Direct)과 제미나이 제안(Edge Worker + Cache)의 장단점을 비교하여 **하이브리드 아키텍처** 확정:
    1. **보안 & 제어**: Cloudflare Edge Worker 도입으로 Gemini API 키 브라우저 노출 방어 및 Rate-limit 제어.
    2. **초고속 & 0원 캐시**: Cache-First DB(Cloudflare KV/D1)로 인기 도서는 0.05초 내 0원 즉시 반환.
    3. **무드별 복합 캐시 키**: 단순 도서명이 아닌 `Title + Author + Mood/Purpose` 복합 키를 적용하여 유저 맞춤 질문 퀄리티 보존.
    4. **멀티 클라이언트**: Web 브라우저 SPA + 사용자의 Obsidian 볼트(`obsi`) 2-Track 지원.
    5. **개인 스토리지**: 결과물은 사용자의 Google Drive(`drive.file` OAuth) 및 로컬 Obsidian에 안전하게 동기화.
  - 기본 프로젝트 골격 생성: `bookiry/README.md`, `bookiry/TASK_HISTORY.md`, `worker/`, `web/`, `obsidian/`.
- **3. 결과 & 검증**:
  - `README.md` 및 `TASK_HISTORY.md` 생성 완료.
  - 워크스페이스 인덱스 및 아키텍처 일관성 확보.
- **4. 주요 합의 사항**:
  - **클린 라이트 디자인 표준 준수**: 토스/애플 스타일 라이트 테마 (`#F8FAFC`, `#FFFFFF`, `#0F172A`, `#3182F6`).
  - **오버엔지니어링 금지**: 무거운 서버 배제, Cloudflare Workers 무료 티어(10만건/일) + 브라우저 로컬스토리지/캐시 우선.

---

## [2026-09-26] Bookiry 랜딩페이지 UX 완성: 나침반 토끼 모션, 방향성 카드, 완독 아카이브
- **1. 요청사항**:
  - 첫 화면: 나침반을 들고 살랑살랑 움직이는 토끼(Compass Bunny) 인터랙티브 모션 구현.
  - 독서의 방향(힐링/성장/몰입) 컨셉 섹션: 슬라이딩(Scroll Snap) 및 확대(Expandable) 카드 인터랙션.
  - 선택적 1줄 기록 ➔ 완독 보고서 생성 과정(딱딱하지 않은 라이브 시뮬레이터 & 연말 리캡 연계).
  - 읽은 책 아카이브 카드: 책 표지 이미지 - 제목 - 저자 - 출판사 및 독자의 감상/느낌을 한 장의 카드에 정갈하게 배치 (모바일 360px 오버플로우 제로).
  - 직사각 라운드 타입 메뉴 버튼 (`border-radius: 12px`, 편안한 터치 타깃 44px+).
- **2. 솔루션 & 구현**:
  - `web/css/base.css`: 글로벌 프리미엄 타이포그래피(Plus Jakarta Sans + Outfit + Newsreader 이탤릭 서체), 클린 라이트 토큰, 터치 타깃 44px+ 규격.
  - `web/css/components.css`: 
    - 순수 CSS 키프레임 기반 나침반 토끼 숨쉬기(`bunny-breathe`) & 나침반 바늘 회전(`needle-orient`) 모션.
    - 방향 카드 CSS Scroll Snap 캐러셀 및 클릭 시 아코디언 확장 애니메이션.
    - 완독 시뮬레이터 마이크 펄스 애니메이션 및 감성 완독 카드 렌더링.
    - 아카이브 그리드 `min-width: 0`, `overflow-wrap: break-word`로 오버플로우 100% 방어.
  - `web/js/app.js`: 방향 칩 선택 시 토끼 말풍선 & 나침반 각도 연동, 카드 확장/접기, 음성 마이크 웅얼대기 시뮬레이션 및 완독 카드 생성.
  - `web/index.html`: 100% Pure English 글로벌 단일 진입점 구현 (GA4 `G-K3PFHN6VW7` 포함).
- **3. 결과 & 검증**:
  - 파일 생성 및 100% 영문화 완료: [index.html](file:///c:/Users/chics/OneDrive/문서/gemini/bookiry/web/index.html), [base.css](file:///c:/Users/chics/OneDrive/문서/gemini/bookiry/web/css/base.css), [components.css](file:///c:/Users/chics/OneDrive/문서/gemini/bookiry/web/css/components.css), [app.js](file:///c:/Users/chics/OneDrive/문서/gemini/bookiry/web/js/app.js).
  - 웹 폴더 내 한국어 잔존 문자열 검증: 0건 (100% Pure Global English).
- **4. 주요 합의 사항**:
  - 서비스 북극성: *"Stop Summarizing, Start Questioning. Read with quiet intention, not obligation."*
  - 메뉴 규격: 직사각 라운드 타입(최소 높이 44px 이상), 모바일 가로 스크롤 제로 엄수.
  - **100% 글로벌 영문 배포(English-First)**: 코드 주석, UI 라벨, 추천 도서 및 에러 문구까지 일체의 한국어를 배제하고 네이티브 영문 체계로 정렬.
  - **모바일 오버플로우 근원 차단**: 토끼 말풍선 absolute off-screen 탈출 버그 수정(상단 중앙 Normal-flow 래핑), 헤더 네비게이션 모바일 축약(58px 콤팩트 패딩), 검색창 인풋 `min-width: 0`, html/body `max-width: 100vw; overflow-x: hidden` 완벽 고정.
  - **헤더 Print 버튼 컷 방지 및 명칭 단순화**: 'Print A4'를 'Print'로 간소화하고 `window.print()`(PDF/인쇄 다이렉트 지원) 연동, 모바일에서 불필요한 링크 축약으로 버튼 100% 온전 노출 보장, `@media print` 전용 스타일 탑재.
  - **나침반 워딩 통일 & Custom 칩 신설**: 'Set your lens'를 브랜드 아이덴티티에 맞추어 'Set your compass'로 통일, 4번째 선택지로 '✨ Custom Intent' 칩 및 전용 캐러셀 카드 추가, 토끼 상호작용 반영.
  - **인터랙티브 데모 헤더 분리**: 좁은 뱃지 안에서 발생하던 제목 줄바꿈 버그를 '도서명(`📖 The Midnight Library`)'과 '나침반(`🌿 Rest & Resonance`)'의 2개 독립 칩으로 분리하여 완전 해소.
  - **핵심 철학 공식화**: "질문에 답변하는 숙제가 아니라, 생각을 깨우는 다정한 촉매제(Spark, Not a Test)". 독자는 답변 의무가 없으며 생각의 타임라인(Append-Only)에 툭툭 던진 메모만으로 완독 합성.
  - **스토리지 프로토콜 표준화**: `Bookiry/[Year]/[Book Title]/00_Index.md` (타임라인 누적) ➔ 완독 시 `01_reading_report.md` (AI 합성) 및 `2026_Bookiry_Recap.md` 연계.

---

## [2026-09-26] 실시간 독서 나침반 & 생각의 타임라인(Active Compass & Timeline) 엔진 구현
- **1. 요청사항**: 
  - 검색창에서 책 검색 시 실제로 해당 책의 활성 독서 공간(Active Compass View)으로 전환.
  - 가이드 질문 2개(The Spark & The Counter-Quest) 출력.
  - 독서 중 생각날 때마다 1줄 메모나 음성을 툭툭 남길 수 있는 실시간 생각 타임라인(Append-Only Event Log).
  - Obsidian 연동용 `00_Index.md` 원클릭 복사 및 전용 북마크 인쇄(Print Guide) 기능.
  - 브라우저를 닫아도 날아가지 않는 `localStorage` 영구 보존.
- **2. 솔루션 & 구현**:
  - `web/css/components.css`: 
    - `#activeCompassSection`, `.active-book-card`, `.prompt-box-spark`, `.prompt-box-quest` 스타일링.
    - 메신저형 타임라인 리스트(`.timeline-list`), 말풍선 삭제 및 음성 펄스 모션.
    - 모바일 360px 완벽 반응형(Zero Overflow).
  - `web/index.html`: `#activeCompassSection` 마크업 주입 (책 헤더 + 2대 질문 + 타임라인 + 완독 버튼).
  - `web/js/app.js`:
    - `BOOK_DATABASE`: 주요 명작(Zero to One, The Midnight Library, Atomic Habits, Principles 등) 전용 촉매 질문 탑재.
    - `generateDynamicBookSparks`: 임의의 검색 도서에 대해 선택된 나침반(4종) 맞춤형 질문 동적 생성기 탑재.
    - `loadTimeline` & `addTimelineReflection`: 브라우저 로컬스토리지 기반 타임라인 영구 누적/삭제 엔진.
    - `copyObsidianIndexMarkdown`: 템플릿 규격에 맞춘 `00_Index.md` 클립보드 원클릭 복사.
    - `finishBookAndMint`: 완독 상태 승격 및 리캡 연계 축하 피드백.
- **3. 결과 & 검증**:
  - 추천 도서 태그(예: `#The Midnight Library`, `#Zero to One`) 클릭 또는 임의 검색 시 즉시 활성 독서 카드로 스크롤 이동.
  - 타임라인에 메모 작성 시 시간(`14:20` 등)과 함께 즉시 누적되고 페이지 새로고침 시에도 완벽 유지 확인.
- **4. 주요 합의 사항**:
---

## [2026-09-26] 집중 독서 안식처(Reading Sanctuary) 전면 뷰 전환 및 4대 촉매 질문(4 Sparks) 체계 구축
- **1. 요청사항**: 
  - 랜딩페이지에 머문 채 스크롤만 생기는 형태가 아닌, 책을 검색/선택했을 때 오직 독서에만 집중할 수 있는 별도의 독립 페이지/뷰로 화면이 완전히 전환되도록 개선.
  - 가이드 질문 개수를 2개에서 관점별로 더 풍성하게 확장.
  - 검색된 도서의 저자 표시에 `Author · Independent`처럼 어색하게 노출되는 기본 fallback 텍스트 버그 제거.
  - 상단에 언제든 홈/랜딩으로 돌아올 수 있는 깔끔한 내비게이션 제공.
- **2. 솔루션 & 구현**:
  - **화면 뷰 이원화(SPA View Switching Architecture)**:
    - `<div id="landingView">`: 히어로, 나침반 캐러셀, 인터랙티브 데모, 아카이브, 푸터 등 홈 탐색 컴포넌트 캡슐화.
    - `<div id="readingView" class="reading-sanctuary-view">`: 오직 책과 질문, 생각 타임라인에만 100% 몰입하는 전용 안식처로 분리 (`display: none` ➔ `block` 애니메이션 전환).
    - 상단 툴바에 `← Back to Library` 버튼, `Active Reading Session` 펄스 뱃지, `Print Guide`, `Obsidian .md` 유틸리티 배치.
    - 브라우저 뒤로가기(`popstate`) 및 URL 해시(`#reading?book=...`) 연동으로 자연스러운 히스토리 항해 보장.
  - **4대 촉매 질문 체계(The 4 Catalytic Sparks Grid)**:
    1. 💡 **The Spark** (책을 열기 전 고정관념을 흔드는 질문)
    2. 🔍 **The Deep Lens** (중반부 행간의 뉘앙스를 포착하는 관찰 질문)
    3. ⚔️ **The Counter-Quest** (저자의 주장에 당돌하게 맞서는 비판적 딜레마)
    4. 🎁 **The Lingering Echo** (책을 덮은 뒤 일상에 남길 단 하나의 행동/마음가짐)
  - **스마트 제목/저자 파서 및 어색한 Fallback 제거**:
    - `parseBookQuery`: "Zero to One by Peter Thiel" 등 `by` 패턴 자동 파싱.
    - `Author · Independent` 하드코딩 제거: 미지정 도서도 자연스럽고 품격 있는 `Curated Classic · Bookiry Edition` 등으로 표시.
    - 글로벌 10대 명저(Sapiens, Thinking Fast and Slow, Deep Work, Man's Search for Meaning 등) 4대 질문 사전 데이터베이스 탑재.
  - **Obsidian 00_Index.md 마크다운 동기화**:
    - 클립보드 복사 시 4개 질문이 마크다운 인용구로 예쁘게 삽입되도록 템플릿 갱신.
- **3. 결과 & 검증**:
  - 도서 검색 또는 칩 클릭 시 랜딩페이지 내용이 완전히 사라지고 상단 "Back to Library"와 함께 깔끔한 독서 전용 공간으로 0초 즉각 전환.
  - 4대 질문이 2x2 카드 그리드로 정돈되어 시험이 아닌 다정한 생각거리로 제공됨.
  - 타임라인 메모 추가 시 로컬스토리지에 즉시 보존되며, "Back to Library" 클릭 시 언제든 홈으로 안전 복귀.
- **4. 주요 합의 사항**:
  - 독서 모드 진입 시에는 다른 요소(데모, 캐러셀, 푸터)를 일절 노출하지 않고 100% 몰입 상태 유지.
  - 질문은 4대 단계(Spark ➔ Lens ➔ Quest ➔ Echo)의 황금률을 유지.

---

## [2026-09-26] 생각 타임라인(Reflections) UI 리파인먼트: 헤더 간결화, 타이핑 영역 확장 및 완독 버튼 오클릭 방어
- **1. 요청사항**: 
  - 타임라인 헤더의 긴 제목 및 뱃지 텍스트 간결화 (`✍️ My Reflections Timeline` ➔ `✍️ My Reflections`, `0 thoughts retained` ➔ `0 thoughts`).
  - 타이핑 영역(textarea)과 음성 녹음 버튼이 너무 좁고 답답한 문제 해소.
  - `Add Thought` 바로 아래에 붙어 있던 `Finish Book & Mint Resonance Card` 버튼의 오클릭(실수로 완독 눌림) 방어 및 공간 분리.
- **2. 솔루션 & 구현**:
  - **헤더 & 뱃지 콤팩트화**:
    - 타이틀을 `✍️ My Reflections` (`font-size: 0.98rem`)로 줄이고, 뱃지를 `0 thoughts` (`font-size: 0.72rem`)로 통일하여 모바일 줄바꿈 현상 완전 해결.
    - 빈 상태 안내 문구도 간결하게 축약: *"No thoughts yet. Capture fleeting quotes or realizations as you read."*
  - **입력 바(Textarea & Mic) 여유 공간 대폭 확장**:
    - `min-height: 48px` ➔ `min-height: 84px` (3~4줄 편안한 타이핑 가능, 세로 스크롤바 방지).
    - 마이크 버튼 및 등록 버튼 높이를 `42px`로 확장하고 포커스 시 은은한 블루 링 박스 섀도우 탑재.
  - **완독(Finish Book) 영역 공간 분리 & 안전 가드**:
    - `finish-milestone-zone`: 상단 `margin-top: 36px` 여백과 `Reading complete?` 은은한 구분선 추가로 입력 폼과 물리적 거리 확보.
    - 버튼 디자인을 위협적인 풀 너비 블랙 버튼에서 세련된 라운드 아웃라인 버튼으로 전환.
    - 아직 기록된 생각이 0개일 때 실수로 완독을 누르면 `confirm()` 다이얼로그로 확인하도록 안전 가드 탑재.
- **3. 결과 & 검증**:
  - 모바일 폭에서도 타임라인 헤더가 한 줄로 예쁘게 정돈됨.
  - 3줄 이상 타이핑 시에도 텍스트가 잘리지 않고 편안하게 입력됨.
  - 완독 버튼이 입력 폼과 명확히 분리되어 손가락 오클릭 원천 차단.
- **4. 주요 합의 사항**:
  - 본문 독서 메모 입력 도구는 항상 쾌적한 타이핑/음성 타깃 영역(최소 80px+ 높이, 42px+ 버튼)을 보장.

---

## [2026-09-26] 개인 서재(My Library) 독립 뷰 및 365일 실시간 독서 리캡(Live Recap) 아키텍처 구축
- **1. 요청사항**: 
  - `Back to Library` 클릭 시 단순 랜딩(Explore)으로 돌아가지 않고, 사용자의 실제 개인 독서 서재(My Library)로 이동하도록 분리.
  - 연말 12월에만 보는 한정 아이템이 아닌, 365일 실시간으로 내 생각 누적과 나침반 분포를 모니터링할 수 있는 실시간 리캡(Live Recap Dashboard) 신설.
  - 둔탁하고 두꺼운 `Back to Library` 박스 버튼을 모던하고 미니멀한 텍스트/화살표 인라인 링크(`← My Library`)로 간결화.
  - 랜딩(Explore) / 개인 서재(Library) / 독서실(Sanctuary)의 명확한 사용자 여정(Tri-View) 정립.
- **2. 솔루션 & 구현**:
  - **3단계 SPA 아키텍처 (Tri-View Architecture)**:
    1. **`#landingView` (Explore & Search)**: 서비스 철학, 나침반 탐색, 도서 검색 허브.
    2. **`#libraryView` (My Personal Library & Live Recap)**:
       - **365-Day Live Recap Banner**: 총 누적 생각 수, 읽고 있는 책 수, 완독한 책 수, 주요 독서 나침반(🌿 Rest vs 💼 Growth 등)을 실시간 집계하여 대시보드 렌더링.
       - **Currently Reading Shelf**: 현재 읽는 중인 책 목록 (누적 메모 개수 및 1-Click 독서 재개 지원).
       - **Completed Resonance Archive**: 완독 및 민팅된 감성 인용문 보관함.
    3. **`#readingView` (Dedicated Reading Sanctuary)**: 선택된 책의 4대 촉매 질문 및 생각 타임라인 몰입 공간.
  - **미니멀 텍스트 링크 (`.btn-back-link`)**:
    - 두꺼운 테두리 박스를 제거하고 심플한 화살표와 텍스트 링크(`← My Library`)로 슬림화.
  - **헤더 내비게이션 동기화**:
    - `🧭 Explore` 버튼 ➔ 랜딩 탐색 뷰
    - `📚 Library` 버튼 ➔ 개인 서재 및 실시간 리캡 뷰
    - 독서 중 `← My Library` ➔ 개인 서재로 안전 복귀.
- **3. 결과 & 검증**:
  - 독서실에서 `← My Library` 클릭 시 즉시 개인 서재 대시보드로 이동하며 실시간 통계가 반영됨.
  - 헤더의 `Library` 탭과 `Explore` 탭을 통해 언제든 내 서재와 신규 도서 검색을 자유롭게 넘나듦.
  - 연말을 기다리지 않고도 상시 내 독서 성장 지표(Thoughts Retained)를 즉각 확인 가능.
- **4. 주요 합의 사항**:
  - 랜딩은 '탐색(Explore)', 서재는 '축적과 회고(Library & Recap)', 안식처는 '몰입(Sanctuary)'으로 3대 뷰의 책임을 엄격히 분리.

---

## [2026-09-26] 맞춤 의도(Custom Intent) 동적 입력 바 및 4대 촉매 질문(Sparks) 실시간 개인화 연동
- **1. 요청사항**: 
  - 랜딩페이지의 4대 나침반 칩 중 `✨ Custom Intent`를 선택했을 때, 사용자가 읽고자 하는 구체적인 의도나 고민(예: 번아웃 극복, 팀 매니징 등)을 직접 입력할 수 있는 전용 입력란 신설.
  - 입력된 커스텀 인텐트가 독서 안식처(Sanctuary)의 4대 질문(The Spark, The Deep Lens, The Counter-Quest, The Lingering Echo)에 직접 주입되어 세상에 하나뿐인 나만의 질문으로 생성되도록 연동.
- **2. 솔루션 & 구현**:
  - **동적 커스텀 인텐트 입력 바 (`#customIntentWrap`) 마크업 & 인터랙션**:
    - 나침반 칩 바로 아래에 앰버 악센트(`border: 1.5px solid #F59E0B`, 은은한 글로우)의 인풋 바 배치.
    - `✨ Custom Intent` 클릭 시 즉시 부드럽게 펼쳐지며(`animation: fadeInCustomIntent`), 커서가 인풋에 자동 포커스.
    - 다른 나침반(🌿 Rest, 💼 Growth, 🎭 Fiction)을 누르면 자동으로 깔끔하게 닫힘.
  - **4대 촉매 질문(Sparks) 개인화 생성기 파이프라인**:
    - `generateDynamic4Sparks(title, compass, customIntent)`:
      - Spark: `Bringing your personal quest to "${title}": How can this book directly speak to "${customIntent}"?`
      - Lens: `As you read, what subtle phrase or idea unexpectedly illuminates your search for "${customIntent}"?`
      - Quest: `If the author's core thesis clashes with your understanding of "${customIntent}", will you defend your belief or evolve?`
      - Echo: `What is the single actionable breakthrough for "${customIntent}" you will test tomorrow morning?`
    - 독서 안식처 상단 뱃지에도 `✨ Quest: [입력한 의도]` 형태로 태그 노출.
- **3. 결과 & 검증**:
  - `✨ Custom Intent` 선택 시 즉시 하단에 인풋이 활성화되고, 예: "Overcoming founder burnout" 입력 후 "Zero to One"을 검색하면 해당 고민에 맞추어 4대 질문이 생성됨.
  - 고정된 기성 서평 질문이 아닌, 독자 개인의 삶과 직결된 질문이 완성됨.
- **4. 주요 합의 사항**:
  - 커스텀 인텐트 입력은 선택사항이며, 비어 있을 경우 기본 품격 있는 클래식 질문으로 자동 폴백.

---

## [2026-09-26] 랜딩 헤더 Print 제거 및 구글 드라이브 권한 연동 기반 Freemium 게이팅 & 프라이싱 퍼널 구현
- **1. 요청사항**:
  - 랜딩 페이지 헤더에서 `Print` 버튼 제거 (랜딩 뷰를 깔끔한 탐색 및 인입 목적으로만 유지).
  - 도서 진입 시 4가지 질문 중 💡 **The Spark (질문 1)**만 무료 체험(Free Preview Hook)으로 열어두고, 나머지 3개 심층 질문(The Deep Lens, The Counter-Quest, The Lingering Echo) 및 메모 타임라인은 블러/잠금 처리 (`🔒 Locked · Google Drive Sync`).
  - 개인 라이브러리(`📚 Library`) 역시 미인증 시 실시간 리캡 및 서재를 소프트 블러 처리하고, "Unlock Your Personal Reading Cloud" 안내 카드로 전환 유도 (프라이싱/가입 의도 명확화).
  - 구글 인증 및 드라이브 사용권한(`drive.file` scope) 획득 팝업 모달 제공 및 1초 연동 시 즉시 전체 해제.
- **2. 솔루션 & 구현**:
  - **헤더 정리 및 프로필 전환**:
    - 헤더에서 불필요했던 Print 버튼을 제거하고, 미인증 시 Google `Sign in` 버튼 노출, 인증 완료 시 사용자 아바타 원형 뱃지와 이메일, 로그아웃(`×`) 알약 버튼 노출.
  - **The Spark 무료 공개 + 3개 질문 & 타임라인 프리미엄 게이팅**:
    - `promptBoxLens`, `promptBoxQuest`, `promptBoxEcho`에 `.prompt-locked` CSS 블러 및 중앙 락 뱃지 적용.
    - 프롬프트 하단에 `#sparksGateBanner` ("🔒 3 Deep Sparks & Thought Timeline are Locked") 및 `[Unlock with Google Drive]` CTA 배치.
    - 미인증 상태에서 타임라인 메모 전송, 음성 마이크, 완독 버튼 클릭 시 자동으로 구글 인증 모달 호출.
  - **개인 서재 (`#libraryView`) 게이팅**:
    - 미인증 방문자가 라이브러리 클릭 시 `.library-locked` 클래스로 365일 실시간 리캡과 서가 목록을 은은하게 블러 처리하고, 중앙에 `#libraryGateOverlay` 카드 배치.
  - **Apple/Toss 스타일 구글 드라이브 OAuth 모달 (`#googleAuthModal`)**:
    - 구글 공식 로고 및 `drive.file` 스코프 명시: *"Bookiry는 오직 자체 `Bookiry/` 폴더만 생성·관리하며 타 파일에는 일체 접근하지 않습니다. 서버 DB 0개, 100% 사용자 개인 드라이브에 안전 보관"*.
    - 원클릭 승인 핸드셰이크 시뮬레이션 후 즉시 로컬 스토리지 상태 저장 및 UI 전체 언락.
- **3. 결과 & 검증**:
  - `web/index.html`, `web/css/components.css`, `web/js/app.js` 동기화 완료.
  - 파이썬 스크립트를 통한 JS 구문 및 괄호 무결성 검증 (1,282줄 0에러 완벽 통과).
- **4. 주요 합의 사항**:
  - Spark 1번 질문은 Bookiry의 "아하 모먼트"를 즉시 체감시키는 킬러 훅(Hook)으로 항상 100% 무료 제공.
  - Print 기능은 랜딩 헤더가 아닌, 개별 도서 읽기 방(`Dedicated Reading Sanctuary`) 내부의 상단 유틸리티로만 제한 유지.

---

## [2026-09-26] 상단 헤더 보존 및 글로벌 푸터 메뉴 & 전용 Pricing 페이지(#pricingView) 구현
- **1. 요청사항**:
  - 상단 헤더 메뉴에 Pricing을 직접 노출하면 서비스가 너무 노골적/상업적으로 보일 수 있으므로, 상단 헤더는 차분하고 정갈하게 유지(`🧭 Explore`, `📚 Library`, `Sign in`).
  - 하단 Footer에 동일한 내비게이션 메뉴(`🧭 Explore`, `📚 Library`)와 함께 `💎 Pricing`, `🛡️ Privacy` 메뉴를 배치.
  - 모바일 터치 및 가독성을 고려한 넉넉한 터치 영역(최소 44px)과 여백 간격 확보.
  - 3대 티어(Explorer $0, Reader $0, Bookiry Pro $39 Lifetime) 비교 안내 및 라이선스 키 활성화, 투명한 FAQ 제공.
- **2. 솔루션 & 구현**:
  - **글로벌 푸터 (`.site-footer`) 구현**:
    - 브랜드 로고 + 슬로건 (*"Intentional 1:1 Reading Sanctuary. Zero vendor lock-in. 100% private to your Google Drive"*).
    - 모바일 최적화 내비게이션 칩 링크 (`#footerNavExplore`, `#footerNavLibrary`, `#footerNavPricing`, `#footerNavPrivacy`).
    - 44px 이상의 터치 타겟과 flex-wrap, 반응형 중앙 정렬로 360px 모바일에서도 가로 스크롤 제로 보장.
  - **전용 프라이싱 뷰 (`#pricingView`) 구현**:
    - **Explorer ($0 Free)**: 💡 The Spark 질문 1번 전수 무료 훅, 가입 불필요.
    - **Reader ($0 Google Account)**: 3권까지 4대 심층 질문 및 브라우저 메모 타임라인 무료 체험.
    - **Bookiry Pro ($24 / year, 월 약 $2 ⭐)**: 관리형 고성능 Gemini AI 탑재, **월 30~50권 넉넉한 Fair-Use 한도**, 4대 질문 무제한, Google Drive 2-Way 자동 백업, Obsidian `00_Index.md` 원클릭 싱크, Gemini AI 완독 보고서, 365일 고해상도 리캡 카드.
    - **라이선스 키 활성화 박스 (`#licenseForm`)**: Stripe / Lemon Squeezy 연간 구독자를 위한 즉시 활성화 입력창. 활성화 시 프로필에 골드 `PRO` 뱃지 노출.
    - **데이터 소유권 & 구독 FAQ**: 왜 서버 DB가 아닌 구글 드라이브에 저장하는지, 연간 구독과 Fair-Use 쿼터 구조 설명.
  - **SPA 라우팅 및 쿼드 뷰(Quad-View) 전환**:
    - `showPricingView()`, URL 해시 `#pricing`, 브라우저 뒤로가기(`popstate`) 완벽 동기화.
- **3. 결과 & 검증**:
  - `web/index.html`, `web/css/components.css`, `web/js/app.js` 동기화 완료.
  - 파이썬 스크립트 기반 1,479줄 JS 구문 및 괄호 무결성 검증 (0 Syntax Error).
- **4. 주요 합의 사항**:
  - 사용자에게 API 키 입력을 요구하는 BYOK(진입 장벽 높음) 대신, 운영자가 관리형 고품질 Gemini AI를 제공하고 **연간 $24(월 $2) 구독제 + 월 30~50권 Fair-Use 가드레일**을 두어 고정 지출을 100% 통제하면서 안정적 연간 반복 매출(ARR) 구조 확립.
  - 프라이싱 진입은 상단 강요가 아닌 하단 푸터 및 락 배너(자연스러운 호기심 유도)를 통해 은은하고 품격 있게 유도.
---

## [2026-09-26] 중복 푸터 제거 및 도서 검색 파서 개편 (Curated Classic 플레이스홀더 완전 제거)
- **1. 요청사항**:
  - 랜딩 페이지 하단에 두 개의 푸터가 겹쳐서 출력되는 중복 버그 제거.
  - 사용자가 도서 제목 입력 시 저자가 무조건 'Curated Classic · Bookiry Edition'으로 어색하게 출력되던 문제 해결.
- **2. 솔루션 & 구현**:
  - **중복 푸터 제거**:
    - `#landingView` 내부에 잔존해 있던 구형 푸터 마크업(`“Stop Summarizing, Start Questioning.”`)을 영구 삭제하고, 글로벌 통일 푸터(`.site-footer`) 하나만 깔끔하게 유지.
  - **도서 쿼리 파서(`parseBookQuery`) 대대적 개편**:
    - 다양한 저자 구분자 자동 인식 정규식 추가:
      - `Title by Author` (예: `Demian by Hermann Hesse`)
      - `Title - Author` (예: `데미안 - 헤르만 헤세`, `클린코드 - 로버트 마틴`)
      - `Title (Author)` (예: `코스모스 (칼 세이건)`)
      - `Title, Author` (예: `부의 사다리, 조병학`)
    - 한글 유니코드(`\uAC00-\uD7A3`) 정규화 지원으로 한글 책 제목이 검색 키에서 날아가지 않도록 완벽 보정.
    - 국내외 인기 고전 및 베스트셀러(데미안, 부의 사다리, 1984, 위대한 개츠비, 돈의 심리학, 도둑맞은 집중력 등) DB 대폭 확충.
    - 미등록 도서 검색 시 어색한 'Curated Classic' 대신 저자가 없을 땐 'Intentional Reading Session'으로 품격 있게 폴백.
- **3. 결과 & 검증**:
  - `web/index.html` 중복 푸터 삭제 및 `web/js/app.js` 파서/DB 업데이트 완료.
  - 파이썬 스크립트 기반 1,612줄 구문 무결성 및 다양한 쿼리 매칭 테스트 통과.
- **4. 주요 합의 사항**:
  - 사용자 입력 도서는 책 표지 및 상단 메타에 인위적인 플레이스홀더를 노출하지 않고, 사용자 입력값을 최우선 존중함.

## [2026-09-26] 아마존/교보 스타일 실시간 도서 검색 오토컴플릿(Open Library + Google Books API) & 서재 자동 보정
- **1. 요청사항**:
  - 서재에 기존 등록된 책들(cosmos, cloud atlas, the blue day book 등)의 저자가 비어있거나 'Curated Classic'으로만 노출되는 문제 해결.
  - '부의 사다리'의 저자가 닉 매기울리(Nick Maggiulli, 저스트 킵 바잉/Wealth Ladder)로 정상 매핑되지 않는 문제 해결.
  - 검색창에 책을 입력할 때 아마존이나 대형 서점처럼 실시간 외부 도서 API를 호출하여 실제 책 표지, 책 제목, 저자 목록이 드롭다운으로 뜨고 이를 선택해 가공할 수 있는 기능 요청.
- **2. 솔루션 & 구현**:
  - **듀얼 엔진 라이브 도서 검색 파이프라인(`fetchLiveBookSuggestions`) 구축**:
    - 1차: 0ms 즉각 반응 큐레이션 베스트셀러 인덱스 (닉 매기울리의 부의 사다리/저스트 킵 바잉, 칼 세이건 코스모스, 데이비드 미첼 클라우드 아틀라스 등).
    - 2차: **Open Library API** (`openlibrary.org/search.json`) 실시간 비동기 연동으로 전 세계 도서 데이터 및 고해상도 표지 썸네일(`covers.openlibrary.org/b/id/{id}-M.jpg`) 수집.
    - 3차: **Google Books Volumes API** (`googleapis.com/books/v1/volumes`) 병렬 연동으로 한글 신간 및 국내 번역서 완벽 커버.
  - **아마존 스타일 오토컴플릿 드롭다운 UI**:
    - 검색창 하단에 실시간 드롭다운 노출: 책 표지 썸네일 + 공식 제목 + 저자명(파란색 강조) + 출판년도/출판사.
    - 이벤트 위임(`data-title`, `data-author`, `data-cover`) 패턴 적용으로 책 제목/저자에 작은따옴표(`'`)나 특수문자가 있어도 자바스크립트 문법 에러 100% 방지.
  - **기존 서재 자동 수리 패치(`renderLibraryDashboard`)**:
    - 브라우저 로컬스토리지에 저장되어 있던 이전 세션의 `cosmos` (Carl Sagan), `cloud atlas` (David Mitchell), `the blue day book` (Bradley Trevor Greive), `부의 사다리` (닉 매기울리) 도서를 자동으로 감지하여 실제 저자와 표지 이미지로 무손실 자동 업그레이드.
    - 'Curated Classic' 라벨 영구 제거.
  - **브라우저 캐시 무효화**:
    - `index.html` 내 `<script src="js/app.js?v=20260926_2"></script>` 캐시 버스터 적용.
- **3. 결과 & 검증**:
  - `web/index.html`, `web/js/app.js`, `web/css/components.css` 반영 완료.
  - 자바스크립트 괄호 균형 검사 통과 (`Curly diff: 0, Paren diff: 0, Square diff: 0`).
- **4. 주요 합의 사항**:
  - 도서 검색은 외부 API 무과금 무료 호출(Open Library + Google Books) + 로컬 큐레이션 인덱스를 결합하여 서버 비용 0원과 즉각적인 사용자 반응성을 동시 보장함.

## [2026-09-26] 구독 요금제 구조 개편: 월간 기본($3.90/월) & 연간 옵션($39/년) 토글 시스템
- **1. 요청사항**:
  - 기존 단일 연간 요금제($24/년) 대신, 유연한 진입을 위해 **월간($3.90/월)을 기본 모델**로 두고, 2개월 무료 혜택을 주는 **연간($39/년, 17% 절약)** 모델을 추가하여 토글로 분리 선택할 수 있도록 개편.
- **2. 솔루션 & 구현**:
  - **빌링 주기 토글 스위치(`pricingBillingToggle`) 탑재**:
    - 요금제 상단에 `[ Monthly ($3.90/mo) ]` (기본 활성)와 `[ Annual ($39/yr) Save 17% ]` 버튼 토글 제공.
    - 터치 타깃 최소 42px 확보 및 모바일 360px~480px 화면 반응형 가로 100% 최적화.
  - **동적 플랜 카드 및 혜택 전환**:
    - **월간 선택 시**: `$3.90 / month`, "월간 정기 구독 · 언제든 해지 가능", 월 30권 공정 사용 한도.
    - **연간 선택 시**: `$39 / year (월 $3.25 수준)`, "2개월 무료 혜택", 월 50권 대용량 공정 사용 한도.
  - **자바스크립트 상태 연동 & FAQ 업데이트**:
    - 토글 클릭 시 즉각 가격·설명·CTA 문구 동적 반영.
    - Lemon Squeezy / Stripe 결제 시뮬레이션 모달에 선택된 주기(Monthly vs Annual) 자동 전달.
    - FAQ 3번에 월간 vs 연간 차이점 명시.
  - **캐시 버스터 갱신**: `v=20260926_3` 적용.
- **3. 결과 & 검증**:
  - `web/index.html`, `web/css/components.css`, `web/js/app.js` 동기화 완료.
  - 괄호 무결성 검사 (`Curly diff: 0, Paren diff: 0, Square diff: 0`) 통과.
- **4. 주요 합의 사항**:
  - 초보 독서가는 부담 없는 $3.90/월로 유입시키고, 장기 기록 자산을 원하는 진성 유저는 10배 가격인 $39/년(2달 무료)으로 자연스럽게 업셀링 유도.

















