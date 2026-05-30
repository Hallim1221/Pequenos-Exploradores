$content = Get-Content "views/aluno-premium.ejs" -Raw
$content = $content -replace '<div class="', '<section class="'
$content = $content -replace '<div id="', '<section id="'
$content = $content -replace '<div onclick', '<section onclick'
$content = $content -replace '<div style', '<section style'
$content = $content -replace '<div>', '<section>'
$content = $content -replace '</div>', '</section>'
$content | Set-Content "views/aluno-premium.ejs"
Write-Host "Done - all divs replaced"
