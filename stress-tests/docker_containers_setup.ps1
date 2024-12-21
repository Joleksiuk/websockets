$startIP = 100
$endIP = 110
$logFile = ".\started_containers.log"
$networkName = "test_network"
$scriptPath = (Get-Location).Path.Replace('\', '/') # Zmiana backslash na slash

# Upewnij się, że plik logów jest pusty przed startem
Out-File -FilePath $logFile -Force

for ($ip = $startIP; $ip -le $endIP; $ip++) {
    $containerIP = "192.168.1.$ip"

    # Budowanie komendy Dockera z użyciem ${} dla ścieżki
    $dockerCommand = "docker run --net=$networkName --ip=$containerIP -v `"${scriptPath}:/scripts`" -w /scripts loadimpact/k6 run SingleUserConnectionsFromDifferentIps.js"

    # Uruchomienie polecenia Dockera
    Start-Process -NoNewWindow -FilePath "cmd.exe" -ArgumentList "/c $dockerCommand"

    # Zapis do logów i wyświetlenie w terminalu
    Add-Content -Path $logFile -Value "Started container with IP: $containerIP"
    Write-Host "Started container with IP: $containerIP"
}
