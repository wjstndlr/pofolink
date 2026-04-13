# 포폴링크 (PoFoLink) MVP 구현 체크리스트

## Phase 0: 프로젝트 초기 세팅
- [ ] Next.js 14 프로젝트 생성 (`app` 라우터, TypeScript, Tailwind CSS)
- [ ] 필수 의존성 설치 (`supabase-js`, `zustand`, `pdf-parse`, `openai`, `browser-image-compression` 등)
- [ ] Supabase 프로젝트 생성 및 연동 (`.env.local`에 키 설정)
- [ ] OpenAI API 키 설정 (`.env.local`)
- [ ] shadcn/ui 초기화 및 테마 설정

## Phase 1: 데이터 모델 및 상태 관리
- [ ] `types/portfolio.ts` 작성: `PortfolioData`, `Project`, `Activity` 등 타입 인터페이스 정의
- [ ] `store/portfolioStore.ts` 작성: Zustand를 활용한 전역 상태 관리 (데이터 저장, 수정 액션 구현)

## Phase 2: 기존 템플릿 마이그레이션 (Props-driven 변환)
- [ ] `Templete_code` (로컬 폴더)에 있는 템플릿 소스 파일을 `poFoLink/components/portfolio` 등으로 복사 및 구조 이식
- [ ] `HeroSection.tsx` 리팩토링: 하드코딩된 데이터를 Props로 교체
- [ ] `AboutSection.tsx` 리팩토링: 하드코딩된 데이터를 Props로 교체
- [ ] `ProjectsSection.tsx` 리팩토링: 하드코딩된 데이터를 Props로 교체
- [ ] `ActivitiesSection.tsx` 리팩토링: 하드코딩된 데이터를 Props로 교체
- [ ] `PortfolioTemplate.tsx` 작성: 최상위 컴포넌트에서 모든 Props를 받아 하위 섹션으로 전달
- [ ] 템플릿 하단에 "포폴링크로 제작됨" 워터마크 추가

## Phase 3: 백엔드 API (서버 액션/라우트)
- [ ] `/api/parse-resume` 작성 (PDF 파싱): `pdf-parse`를 사용하여 텍스트 추출 로직 구현
- [ ] `/api/parse-resume` 작성 (OpenAI): 추출된 텍스트를 GPT-4o-mini에 전달하여 JSON으로 구조화하는 프롬프트 및 파싱 로직 구현
- [ ] `/api/upload-image` 작성: 이미지를 Supabase Storage에 업로드하고 Public URL을 반환하는 로직 구현
- [ ] `/api/publish` 작성: 사용자가 입력한 username 중복 체크 로직 구현
- [ ] `/api/publish` 작성: 최종 파싱+수정된 JSON 데이터를 Supabase `portfolios` DB에 저장하는 로직 구현

## Phase 4: 랜딩 및 업로드 페이지 (UI)
- [ ] `app/page.tsx` 디자인 구조화 (히어로 배너, 예시 링크)
- [ ] `PdfDropZone.tsx` 컴포넌트 구현: 드래그 앤 드롭으로 PDF 파일 업로드UI
- [ ] 업로드 로딩 뷰 구현: AI 파싱 진행 중임을 알리는 스피너 또는 애니메이션 표시
- [ ] 업로드 성공 시 파싱된 데이터를 Zustand 스토어에 저장하고 `/workspace`로 리다이렉트

## Phase 5: 워크스페이스 편집 폼 (UI)
- [ ] `app/workspace/page.tsx` 화면 레이아웃 구성 (좌측: 입력 폼, 우측: 실시간 미리보기)
- [ ] 기본 정보 입력 폼 구현 (`ProfileForm.tsx`)
- [ ] 기술 스택 입력 폼 구현 (`SkillsForm.tsx`)
- [ ] 프로젝트 입력 폼 구현 (`ProjectForm.tsx`): 텍스트 입력 및 이미지 업로드 버튼 포함
- [ ] 활동 내역 입력 폼 구현 (`ActivityForm.tsx`): 텍스트 입력 및 이미지 업로드 버튼 포함
- [ ] 이미지 업로드 시 브라우저 단에서 용량 압축 로직 (`browser-image-compression`) 적용 및 Storage 업로드 연결
- [ ] 좌측 폼 변경 사항이 우측 미리보기 패널에 즉각 반영되도록 Zustand 동기화

## Phase 6: 포트폴리오 발행 및 고유 링크 (UI/SSR)
- [ ] `app/publish/page.tsx` 생성: username(link slug) 설정 UI 구현
- [ ] username 중복 검사 및 발행 버튼 클릭 시 DB 저장 처리
- [ ] 발행 완료 후 생성된 고유 링크(예: `/p/{username}`) 복사 버튼 제공
- [ ] `app/p/[username]/page.tsx` 생성 (오픈 페이지): SSR 방식으로 URL의 username을 이용해 DB에서 JSON 데이터를 Fetch
- [ ] Fetch한 데이터를 `PortfolioTemplate.tsx`에 전달하여 실제 뷰 렌더링

## Phase 7: 마무리 및 테스트
- [ ] 전체 플로우 E2E 테스트 (업로드 -> 파싱 -> 편집 -> 이미지 추가 -> 발행 -> 확인)
- [ ] 모바일/태블릿 반응형 UI 점검 (특히 리뷰 및 편집 폼)
- [ ] Vercel 배포 및 환경 변수 설정
- [ ] (선택) 와일드카드 서브도메인 설정 검토 (MVP 이후)
