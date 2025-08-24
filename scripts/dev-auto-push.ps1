param(
    [string]$BranchName = "develop",
    [string]$CommitMessage = "🔄 Auto-commit: Incremental development update",
    [bool]$AutoPush = $true
)

Write-Host "🚀 Galaxies Collide - Auto Development Push" -ForegroundColor Blue
Write-Host "Branch: $BranchName" -ForegroundColor Yellow
Write-Host "Message: $CommitMessage" -ForegroundColor Yellow

# Check current branch
$CurrentBranch = git branch --show-current
Write-Host "📍 Current branch: $CurrentBranch" -ForegroundColor Blue

# Switch to target branch if needed
if ($CurrentBranch -ne $BranchName) {
    Write-Host "🔄 Switching to $BranchName branch..." -ForegroundColor Yellow
    git checkout $BranchName
}

# Stage all changes
Write-Host "📦 Staging changes..." -ForegroundColor Blue
git add -A

# Create commit
Write-Host "💾 Creating commit..." -ForegroundColor Blue
git commit -m $CommitMessage

# Push if auto-push is enabled
if ($AutoPush) {
    Write-Host "🚀 Pushing to remote..." -ForegroundColor Blue
    git push origin $BranchName
    Write-Host "✅ Pushed successfully!" -ForegroundColor Green
}

Write-Host "🎉 Auto development push completed!" -ForegroundColor Green
