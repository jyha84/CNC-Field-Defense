#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"
mkdir -p .build-tools
if [ ! -f .build-tools/gradle-8.11.1/bin/gradle ]; then
  curl -fL https://services.gradle.org/distributions/gradle-8.11.1-bin.zip -o .build-tools/gradle.zip
  curl -fL https://services.gradle.org/distributions/gradle-8.11.1-bin.zip.sha256 -o .build-tools/checksum
  python3 - <<'PY'
import hashlib,pathlib
p=pathlib.Path('.build-tools')
assert hashlib.sha256((p/'gradle.zip').read_bytes()).hexdigest()==(p/'checksum').read_text().strip(), 'Gradle SHA256 verification failed'
PY
  unzip -q .build-tools/gradle.zip -d .build-tools
  rm .build-tools/gradle.zip
fi
cp ../web/index.html app/src/main/assets/index.html
bash .build-tools/gradle-8.11.1/bin/gradle --no-daemon assembleDebug
