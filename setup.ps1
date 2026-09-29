$ErrorActionPreference = "Stop"

# Create legacy_static
New-Item -ItemType Directory -Force -Path "legacy_static"

# Move old files
$items = Get-ChildItem -Path . -Exclude "legacy_static", ".git", "setup.ps1"
foreach ($item in $items) {
    Move-Item -Path $item.FullName -Destination "legacy_static"
}

# Create new Next.js app in a temp folder
npx -y create-next-app@latest temp_next --js --tailwind=false --eslint --app --src-dir --import-alias "@/*" --use-npm --yes

# Move Next.js files to root
$nextItems = Get-ChildItem -Path "temp_next" -Force
foreach ($item in $nextItems) {
    Move-Item -Path $item.FullName -Destination .
}

# Remove temp folder
Remove-Item -Recurse -Force "temp_next"
