# Third-party notices / 제3자 자료 고지

## 1. 신규 프로젝트 코드

이 프로젝트에 새로 작성된 JavaScript, Python, HTML/CSS UI 및 검증 코드는 GPL-3.0-or-later로 배포합니다. [LICENSE](LICENSE)를 참고하세요. 기존 자료와 그 권리를 신규 코드의 것으로 주장하지 않습니다.

## 2. Combined Arms / CAmod

- 원본 저장소: https://github.com/Inq8/CAmod
- 추출 리비전: `b67e287461c4e1086a3ba46d8c0dcb1bb4dd6748`
- 원본 코드 라이선스 문서: [LICENSE.md](https://github.com/Inq8/CAmod/blob/b67e287461c4e1086a3ba46d8c0dcb1bb4dd6748/LICENSE.md), [COPYING](https://github.com/Inq8/CAmod/blob/b67e287461c4e1086a3ba46d8c0dcb1bb4dd6748/COPYING)
- 저작자·기여자: [AUTHORS](upstream-notices/AUTHORS). 주요 CA 개발자로 Inq와 Darkademic이 기록되어 있습니다. 전체 크레딧은 원문을 보존했습니다.
- 사용 범위: `mods/ca/bits/`의 선별 SHP/TMP/팔레트, 유닛 시퀀스·명칭 등.
- 포함 위치: `assets.json` 및 이 데이터를 내장한 생성 HTML, 스크린샷.
- 변경: RGBA 스프라이트 시트 변환, 미리보기 크롭, 차체/포탑 합성 또는 분리 표시, 적 팀 색상을 붉은색으로 변경, Jungle 지형 합성, 실제 도로 타일 일부를 이어 이동 경로 구성.
- 선별 32종의 파일 이름·팔레트 정보는 `provenance.json`에 기록했습니다.

CAmod의 저장소 라이선스는 신규 코드의 GPL 선택 참고 자료입니다. 저장소 루트의 GPL 문서만으로 모든 개별 그림의 별도 권리를 확인했다고 주장하지 않습니다.

## 3. 원작 Command & Conquer 자료와 상표

[OpenRA 공식 Legal 페이지](https://www.openra.net/legal/)는 OpenRA 코드와 원작 게임 에셋의 권리를 구분합니다. 원작 게임 에셋은 GPL의 적용 대상이 아니며 Electronic Arts Inc.의 자산으로 설명되어 있습니다.

이 프로젝트에는 C&C 계열 원작 자료 및 CAmod 변형 자료가 포함되어 있습니다. 해당 그림·상표의 권리는 각 권리자에게 남으며 이 프로젝트의 GPL 선언은 그 권리를 재허가하지 않습니다. 모든 그림을 상업적으로 이용할 수 있다는 보증이나 퍼블릭 도메인이라는 선언을 하지 않습니다.

## 4. OpenRA 포맷 참고

- 프로젝트: https://github.com/OpenRA/OpenRA
- 법적 안내: https://www.openra.net/legal/
- 참고 구현: SHP TD/TS, TMP RA 로더, LCW 및 XOR delta 압축 처리.
- 이 게임은 JavaScript로 작성된 별도의 TD 구현이며 OpenRA의 전체 게임 엔진을 포함하지 않습니다.
- `make_assets.py`는 이전 도감 프로젝트의 `decoder.py`를 사용하는 선택적 자료 생성 도구입니다. 기존 `assets.json`으로 일반 빌드할 때에는 해당 도구가 필요하지 않습니다.

## 5. Noto Sans CJK KR

- 프로젝트: https://github.com/notofonts/noto-cjk
- 원본 글꼴: `Sans/OTF/Korean/NotoSansCJKkr-Regular.otf`
- 포함 파일: `web/field-ui.woff`와 생성 HTML 내 글꼴 데이터.
- 변경: UI에 필요한 문자만 남기고 WOFF로 변환한 서브셋.
- 라이선스: SIL Open Font License 1.1. [원문](upstream-notices/Noto-OFL.txt).
- 글꼴 메타데이터의 저작권 표기는 `upstream-notices/Noto-Copyright.txt`에 보존했습니다.

## 6. 배포물과 개발 도구 구분

`upstream-notices/AUTHORS`는 CAmod/OpenRA의 원본 크레딧을 보존한 문서입니다. 이 문서에 나오는 모든 라이브러리가 현재 JavaScript 게임에 포함된다는 의미는 아닙니다.

안드로이드 소스는 AndroidX WebKit 의존성을 선언합니다. 이 저장소에는 컴파일된 AndroidX 바이너리나 APK를 포함하지 않았습니다. Pillow/fontTools, Node.js와 Playwright는 개발·검증 도구이며 실행 HTML에 해당 라이브러리를 번들하지 않습니다.

## 7. v0.3.0 개발본 추가 자료 (공개 배포 보류)

- `terrain-pack.json`: 위 CAmod 리비전의 Jungle clear1/d03/p01~p04, 나무와 바위를 재사용 가능한 PNG 타일로 분리했습니다. 새 에셋 권한을 부여하는 변환이 아닙니다.
- `audio-pack.json`: 같은 리비전의 `mods/ca/bits/audio/{mgun2,bazook1,tnkfire3,tnklaser,xplosml2,xplobig4}.aud`를 브라우저 재생용 MP3로 변환했습니다. 각각의 원본 경로·리비전·SHA-256이 JSON에 들어 있습니다. 효과음은 원본 권리자의 권리를 유지합니다.
- 원작 음악 파일은 포함하지 않습니다. 사용자가 선택한 로컬 파일의 반복 재생 기능만 제공합니다.
- `web/field-pixel.woff2`: [Galmuri](https://github.com/quiple/galmuri) 공식 npm 패키지 2.40.3의 Galmuri11을 UI 문자용으로 서브셋 처리하고 Field Pixel로 이름을 변경했습니다. 저작권: © 2019–2025 Lee Minseo. 라이선스: SIL OFL 1.1, [원문](upstream-notices/Galmuri-OFL.md). `subset_font.py`로 변환합니다. 원본 폰트 패키지는 이 저장소에 포함하지 않습니다.
- 신규 효과음 및 폰트는 생성 HTML과 Android assets에도 함께 포함됩니다. Android의 중복 파일에 같은 조건이 적용됩니다.
- [공개 배포 검토](PUBLICATION_REVIEW_KO.md)의 미확인 쟁점을 해결하기 전까지 이 개발본의 공개 배포를 보류합니다.

### v0.3.1 Winter terrain

CAmod 리비전 `b67e287461c4e1086a3ba46d8c0dcb1bb4dd6748`의 `mods/ca/bits/winter/clear1.win`, `d03.win`, `p01.win`~`p04.win`, `t01.win`~`t03.win`, `tc01.win`~`tc03.win`, `winter.pal`을 PNG로 변환·배치했습니다. 원본 및 변형 에셋 권리는 원권리자에게 유지됩니다. 상세 기술 검토: [TERRAIN_REVIEW_KO.md](docs/TERRAIN_REVIEW_KO.md).
