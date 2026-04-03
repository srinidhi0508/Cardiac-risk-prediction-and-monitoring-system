$rootPath = "D:\cardiac_dashboard\cardio-ai-frontend"

Write-Host ""
Write-Host "===== PROJECT STRUCTURE =====" -ForegroundColor Cyan
Write-Host "Root: $rootPath" -ForegroundColor Yellow
Write-Host ""

$skipFolders = @("node_modules", ".next")

function Show-Tree {
    param (
        [string]$Path,
        [string]$Indent = ""
    )

    $items = Get-ChildItem -Path $Path -ErrorAction SilentlyContinue

    foreach ($item in $items) {
        if ($skipFolders -contains $item.Name) {
            Write-Host "$Indent[SKIP] $($item.Name)/" -ForegroundColor DarkGray
            continue
        }

        if ($item.PSIsContainer) {
            Write-Host "$Indent[DIR]  $($item.Name)/" -ForegroundColor Blue
            Show-Tree -Path $item.FullName -Indent "$Indent    "
        } else {
            Write-Host "$Indent[FILE] $($item.Name)" -ForegroundColor White
        }
    }
}

Show-Tree -Path $rootPath

Write-Host ""
Write-Host "===== DONE - Copy and paste output to Claude =====" -ForegroundColor Cyan