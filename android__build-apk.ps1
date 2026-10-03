# Requires JDK 17 and Android SDK Platform 35 + Build Tools 35.0.0.
$ErrorActionPreference = 'Stop'
Set-Location $PSScriptRoot
$gradleVersion = '8.11.1'
$toolsDir = Join-Path $PSScriptRoot '.build-tools'
$gradleExe = Join-Path $toolsDir "gradle-$gradleVersion\bin\gradle.bat"
if (!(Test-Path $gradleExe)) {
    New-Item -ItemType Directory -Force -Path $toolsDir | Out-Null
    $zipPath = Join-Path $toolsDir 'gradle.zip'
    $url = "https://services.gradle.org/distributions/gradle-$gradleVersion-bin.zip"
    Invoke-WebRequest $url -OutFile $zipPath
    $expected = (Invoke-RestMethod "$url.sha256").Trim().ToLowerInvariant()
    $actual = (Get-FileHash $zipPath -Algorithm SHA256).Hash.ToLowerInvariant()
    if ($actual -ne $expected) { throw 'Gradle SHA256 verification failed.' }
    Expand-Archive $zipPath -DestinationPath $toolsDir -Force
    Remove-Item $zipPath
}
Copy-Item '..\web\index.html' 'app\src\main\assets\index.html' -Force
& $gradleExe --no-daemon assembleDebug
if ($LASTEXITCODE -ne 0) { throw 'APK build failed. Check Java and Android SDK paths.' }
Write-Host 'APK: app\build\outputs\apk\debug\app-debug.apk'
