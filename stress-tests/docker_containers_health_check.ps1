# Liczenie kontenerów na podstawie obrazu 'loadimpact/k6'
$running_containers = (docker ps --filter "ancestor=loadimpact/k6" --format "{{.ID}}" | Measure-Object).Count
Write-Host "Running K6 containers: $running_containers"

# Warunek sprawdzający liczbę kontenerów
if ($running_containers -ge 11) {
    "All containers started successfully!" | Out-File -Append -FilePath .\started_containers_health.log
} else {
    "Some containers failed to start." | Out-File -Append -FilePath .\started_containers_health.log
}
