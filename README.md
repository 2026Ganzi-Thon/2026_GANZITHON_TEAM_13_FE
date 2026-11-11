# 1분 미션 (간지톤 Team 13 FE)

의욕이 없을 때 1분이면 시작할 수 있는 작은 행동을 제안하는 서비스. 모바일 웹 기준(최대 폭 430px).

## 실행

```bash
npm install
npm run dev     # 개발 서버
npm run build   # 타입 체크 + 빌드
```

## 구조

```
src/
  pages/        화면 1개 = 파일 1개 (Figma 프레임 단위)
  components/   Page(헤더/푸터 레이아웃), Button, Toggle, TabLayout ...
  hooks/        useCountdown
  lib/          데이터·상태 (아래 참고)
  styles/       base.css(토큰, 리셋), ui.css(공통 UI)
```

## 백엔드 연동 지점

현재는 localStorage와 로컬 데이터로 동작한다. API가 열리면 `lib/` 파일의 내부만 바꾸면 화면 코드는 그대로 쓴다.

| 파일 | 현재 | 연동 대상 |
| --- | --- | --- |
| `lib/missions.ts` | 기획 문서의 미션 18개 | 미션 API |
| `lib/records.ts` | localStorage (완료 / 쉬어간 날) | 기록, 쉬기·건너뛴 날 API |
| `lib/settings.ts` | localStorage | 설정 API |
| `lib/places.ts` | 임시 장소 데이터 | 위치 API |

## 라우트

`/` 스플래시 → `/onboarding` → `/home`(홈·기록·설정 탭) → `/mission/:place` → `/run/:id` → `/done`
쉬기: `/rest` → `/breathing` / 장소: `/location` → `/places`
