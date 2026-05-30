$content = Get-Content "views/aluno-premium.ejs" -Raw
$content = $content -replace '<button class="btn-sair">Sair</button>', '<button class="btn-sair" onclick="logout()">Sair</button>'
$content | Set-Content "views/aluno-premium.ejs"
Write-Host "Added logout onclick to all Sair buttons"
