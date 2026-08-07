# scripts/bump-version.ps1
# 自動更新 Service Worker (sw.js) 與系統版本號

param(
    [string]$Notes = ""
)

$today = Get-Date -Format "yyyy.MM.dd"
$swPath = Join-Path $PSScriptRoot "..\sw.js"
$swPath = [System.IO.Path]::GetFullPath($swPath)

if (!(Test-Path $swPath)) {
    Write-Error "找不到 sw.js: $swPath"
    exit 1
}

$swContent = Get-Content $swPath -Raw -Encoding UTF8

# 匹配現有的 BUILD_VERSION = 'yyyy.MM.dd-N'
$verRegex = [regex]"const BUILD_VERSION = '(\d{4}\.\d{2}\.\d{2})-(\d+)';"
$match = $verRegex.Match($swContent)

if ($match.Success) {
    $curDate = $match.Groups[1].Value
    $curNum = [int]$match.Groups[2].Value

    if ($curDate -eq $today) {
        $newNum = $curNum + 1
    } else {
        $newNum = 1
    }
    $newVer = "${today}-${newNum}"
} else {
    $newVer = "${today}-1"
}

$newSwContent = $verRegex.Replace($swContent, "const BUILD_VERSION = '$newVer';")
[System.IO.File]::WriteAllText($swPath, $newSwContent, (New-Object System.Text.UTF8Encoding($false)))

Write-Host "✅ 成功將 Service Worker 版本更新為: $newVer" -ForegroundColor Green
if ($Notes) {
    Write-Host "📝 版本備註: $Notes" -ForegroundColor Cyan
}
