# Define the image or other filter criteria for containers to remove
$imageName = "loadimpact/k6"  # Change this if needed

# Get a list of all containers matching the image or filter
$containers = docker ps -a --filter "ancestor=$imageName" --format "{{.ID}}"

if ($containers) {
    Write-Host "Removing containers created from image '$imageName'..."
    foreach ($container in $containers) {
        docker rm -f $container
        Write-Host "Removed container: $container"
    }
    Write-Host "All containers removed successfully!"
} else {
    Write-Host "No containers found for image '$imageName'."
}
