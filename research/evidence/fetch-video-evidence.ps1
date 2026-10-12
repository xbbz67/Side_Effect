$ErrorActionPreference = 'Stop'
foreach ($videoEntry in @(@{Stem='video-official';Id='tGGV8ixHG8w'},@{Stem='video-skytiger';Id='vVcEQWEbTK8'})) {
    $videoStem = $videoEntry.Stem
    if (!(Test-Path -LiteralPath "research/evidence/$videoStem.html")) {
        curl.exe -sS -L --fail --max-time 30 "https://www.youtube.com/watch?v=$($videoEntry.Id)" -o "research/evidence/$videoStem.html"
    }
    node research/evidence/inspect-video.cjs $videoStem
    $videoData = Get-Content -LiteralPath "research/evidence/$videoStem-player.json" -Raw | ConvertFrom-Json
    $captionUrl = $videoData.captions.playerCaptionsTracklistRenderer.captionTracks[0].baseUrl
    if ($captionUrl) { curl.exe -sS -L --fail --max-time 30 ($captionUrl + '&fmt=json3') -o "research/evidence/$videoStem-captions.json" }
    $storySpec = $videoData.storyboards.playerStoryboardSpecRenderer.spec
    if ($storySpec) {
        $specParts = $storySpec.Split('|')
        $storyLevel = $specParts.Length - 2
        $levelParts = $specParts[-1].Split('#')
        $frameCount = [int]$levelParts[2]
        $sheetCapacity = [int]$levelParts[3] * [int]$levelParts[4]
        $sheetCount = [int][Math]::Ceiling($frameCount / $sheetCapacity)
        for ($sheetIndex=0; $sheetIndex -lt $sheetCount; $sheetIndex++) {
            $sheetName = $levelParts[6].Replace('$M', [string]$sheetIndex)
            $sheetUrl = $specParts[0].Replace('$L',[string]$storyLevel).Replace('$N',$sheetName) + '&sigh=' + $levelParts[7]
            curl.exe -sS -L --fail --max-time 30 $sheetUrl -o "research/evidence/$videoStem-storyboard-$sheetIndex.jpg"
        }
        @{level=$storyLevel;frameCount=$frameCount;width=[int]$levelParts[0];height=[int]$levelParts[1];columns=[int]$levelParts[3];rows=[int]$levelParts[4];intervalMs=[int]$levelParts[5];sheets=$sheetCount} | ConvertTo-Json | Set-Content -LiteralPath "research/evidence/$videoStem-storyboard-index.json" -Encoding UTF8
    }
}
