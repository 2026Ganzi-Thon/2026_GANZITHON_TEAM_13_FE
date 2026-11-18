# 쉼표 (간지톤 Team 13 FE)

의욕이 없을 때 1분이면 시작할 수 있는 작은 행동을 제안하는 서비스. 모바일 웹 기준(최대 폭 430px).

## 실행

```bash
npm install
npm run dev     # 개발 서버
npm run build   # 타입 체크 + 빌드
```

## 백엔드 연결

`.env.example`을 `.env`로 복사한다.

```
VITE_API_BASE_URL=/__api                    # 비우면 서버 없이 로컬 데이터로 동작
VITE_API_PROXY_TARGET=http://127.0.0.1:8000 # 개발 서버가 /__api 요청을 이 주소로 전달 (CORS 회피)
```

배포 환경에서는 `VITE_API_BASE_URL`에 서버 주소를 직접 넣고, 서버에서 CORS를 허용해야 한다.
서버가 응답하지 않거나 401/501을 주면 화면은 로컬 데이터로 이어서 동작한다.

| 기능 | 엔드포인트 | 연동 위치 |
| --- | --- | --- |
| 미션 목록 / 랜덤 추천 | `GET /missions`, `GET /missions/random` | `lib/missions.ts` |
| 미션 시작·완료·그만두기 | `POST /mission-sessions[/{id}/complete\|cancel]` | `lib/activity.ts` |
| 지난 활동 / 기록 삭제 | `GET·DELETE /mission-sessions` | `lib/activity.ts` |
| 쉬기·건너뛴 날, 호흡법 | `/rest/guidance`, `/rest/breathing`, `/rest/records` | `lib/activity.ts`, `pages/Rest.tsx`, `pages/Breathing.tsx` |
| 장소 추천 | `GET /places/recommendations` | `lib/places.ts` |
| 알림 설정 | `PATCH /settings/notifications` | `lib/settings.ts` |

요청·응답 타입은 `src/api/endpoints.ts` 한 곳에 있다.

## 구조

```
src/
  api/          fetch 래퍼(client.ts), 엔드포인트와 타입(endpoints.ts)
  lib/          서버 우선 → 실패 시 로컬 폴백 로직 (missions, activity, places, settings)
  pages/        화면 1개 = 파일 1개
  components/   Page, Button, MissionItem, TabLayout, Mascot ...
  hooks/        useCountdown, useLoad
  styles/       base.css(색·폰트 토큰), ui.css(공통 UI)
```

색상과 폰트는 `styles/base.css` 상단 변수만 바꾸면 된다.
