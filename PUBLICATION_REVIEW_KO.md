# 공개 배포 사전 검토

검토일: 2026-10-04 (한국시간). 개발 관점의 자료 검토이며 법률 의견서가 아닙니다.

**판정: 현재 C&C 에셋을 포함한 독립 웹 TD의 공개 배포가 확실히 허용된다고 확인하지 못했습니다.**
코드를 GPL로 공개하거나 무료로 서비스한다는 사실만으로 모든 에셋의 재배포 권한이 생기지는 않습니다. 반대로 모든 비상업 C&C 모드가 금지되어 있다고 단정할 근거도 없습니다.

## 실제 프로젝트 점검

| 항목 | 확인한 상태 | 공개 시 판단 |
| --- | --- | --- |
| 신규 JS 게임 로직·UI·빌드 코드 | 프로젝트 GPL-3.0-or-later 선언 | 해당 코드의 고지·소스 제공 조건 유지 |
| assets.json / 기존 생성 HTML | 원작 및 CAmod 변형 유닛·건물·지형 그림 내장 | 코드 GPL과 별도로 EA 모드 정책 적용 범위와 개별 제작자 권리 확인 필요 |
| 새 terrain-pack.json | 기존 Jungle 타일을 다시 분리한 데이터 | 포맷 변환·크롭은 원본 권리를 없애지 않음 |
| 새 audio-pack.json | CAmod 리비전에서 받은 짧은 효과음 6종, AUD→MP3 | 음악과 구별되지만 EA/원제작자 에셋 권리는 유지됨 |
| BGM 기능 | 사용자가 기기에서 파일 선택, Blob URL로 재생 | 원작 OST를 배포물에 포함하거나 서버로 전송하지 않음 |
| Field Pixel | Galmuri 2.40.3 서브셋, 이름 변경 | SIL OFL 1.1 및 저작권 고지 보존 |
| Field UI | Noto 서브셋 | 기존 OFL·저작권 문서 유지 |
| 공개 Pages | v0.3.1 게시 요청에 따라 배포 진행 | 허용 범위와 개별 에셋 권리 미확인 사항은 유지 |

## EA 공식 문서에서 확인한 내용

[Command & Conquer Franchise Modding Guidelines, Revision 2 (2025)](https://www.ea.com/games/command-and-conquer/command-and-conquer-remastered/news/modding-faq)는 C&C 게임·세계관의 수정과 확장에 관한 커뮤니티 모드를 대상으로 합니다. 비상업·무료 배포, 거래 기능 및 광고 제한, 타인의 권리 존중, 비공식 고지와 홍보 방식 조건이 있습니다. 허용은 제한적이며 철회될 수 있습니다.

원작 **음악 파일의 모드 포함은 명시적으로 금지**되어 있습니다. 원작 OST를 이 저장소에 추가하지 않습니다. 웹사이트 상단과 저장소 루트 고지 문서에는 EA 비공식 고지가 요구됩니다. 개발본에 해당 고지를 추가했지만 그것이 별도의 허락을 대신하지는 않습니다.

[EA 일반 콘텐츠 정책](https://help.ea.com/en/articles/security-and-rules/ea-content-policy/)도 팬 프로젝트를 무제한 허용하지 않으며, 파생 게임과 제3자 음원 등의 사용을 제한합니다. C&C에는 별도 모드 지침이 있으므로 일반 팬게임 금지 문구만으로 C&C 모드까지 모두 금지된다고 해석해서는 안 됩니다.

[OpenRA Legal](https://www.openra.net/legal/)은 원작 게임 에셋이 GPL 대상이 아니며 EA 소유라고 설명합니다. 무료 배포판 기반 에셋 제공이 C&C 지침의 취지에 맞는다는 OpenRA의 설명은 확인되지만, 이를 우리 독립 웹게임에 대한 개별 승인으로 볼 수는 없습니다.

## 이 프로젝트에서 남은 쟁점

이 게임은 기존 C&C/OpenRA 실행 환경에 설치하는 모드가 아니라, 추출한 그림과 자체 JS 로직으로 실행되는 별도 웹 타워디펜스입니다. EA 지침의 모드 범위에 포함되는지에 대한 명시적 확인을 확보하지 못했습니다. CAmod에 들어 있는 제3자 수정 에셋도 개별 사용 조건을 모두 확인한 상태가 아닙니다.

따라서 “무료이고 GitHub Pages이므로 문제없다”는 결론은 낼 수 없습니다. 같은 이유로 GitHub의 Public 저장소, 다운로드 HTML, Pages 모두 배포 검토 대상입니다. 출처 표기와 GPL 파일만으로 이 쟁점이 해소되지는 않습니다.

원작 느낌을 유지하려면 해당 사용 형태의 권한을 확인하는 편이 좋습니다. 공개 배포의 불확실성을 줄이려면 재배포 조건이 명확한 독자 제작/적법하게 라이선스된 그림·효과음으로 교체할 수 있습니다. 현재 저장소를 임의로 비공개 전환하거나 Pages를 중지하지 않았습니다.

## 겨울·사막 자료 조사

기준: CAmod `b67e287461c4e1086a3ba46d8c0dcb1bb4dd6748` 트리와 로컬 타일셋 설정.

| 배경 | 확인된 자료 | 상태 |
| --- | --- | --- |
| Jungle | clear1.jun, d03.jun, 나무·바위 | 현재 구현 |
| Winter | bits/winter/clear1.win, d03.win, winter.pal 및 수목 | v0.3.1에 기본 바닥·길·수목 적용 |
| Snow | tilesets/snow.yaml, bits/snow/ 및 snow.mix 참조 | 추가 원본 데이터 의존성 확인 필요 |
| Desert | tilesets/desert.yaml, bits/desert/clear1a.des 및 다수 오브젝트 | 설정의 clear1.des 등은 원본 desert.mix에도 의존; 저장소만으로 완전한 묶음인지 미확인 |

[Winter 타일셋](https://github.com/Inq8/CAmod/blob/b67e287461c4e1086a3ba46d8c0dcb1bb4dd6748/mods/ca/tilesets/winter.yaml) · [Desert 타일셋](https://github.com/Inq8/CAmod/blob/b67e287461c4e1086a3ba46d8c0dcb1bb4dd6748/mods/ca/tilesets/desert.yaml)

파일을 볼 수 있다는 것과 독립 게임에서 자유롭게 재배포할 수 있다는 것은 별개입니다. 겨울·사막 그래픽도 위 에셋 권리 검토를 적용합니다.

## 후속 배포 기록

2026-10-04 사용자가 위 검토 이후 적용·게시를 요청했습니다. 요청에 따라 v0.3.1 배포를 진행하며, 위 권리 검토의 미확인 사항이 해소되었다는 의미는 아닙니다. 원작 OST는 배포하지 않습니다.
