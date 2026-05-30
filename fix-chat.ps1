$content = Get-Content "views/aluno-premium.ejs" -Raw
$content = $content -replace "goTo\('chat-page'\)", "goTo('chat')"
$content | Set-Content "views/aluno-premium.ejs"
Write-Host "Fixed chat navigation"
