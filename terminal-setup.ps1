# Terminal setup script for VSCode integration

# Ensure .vscode directory exists
$vscodePath = Join-Path -Path (Get-Location) -ChildPath ".vscode"
if (-not (Test-Path -Path $vscodePath)) {
    New-Item -Path $vscodePath -ItemType Directory
}

# Create or update settings.json
$settingsPath = Join-Path -Path $vscodePath -ChildPath "settings.json"
$settings = @{
    "terminal.integrated.automationShell.windows" = "cmd.exe"
    "terminal.integrated.defaultProfile.windows" = "PowerShell"
    "terminal.integrated.profiles.windows" = @{
        "PowerShell" = @{
            "source" = "PowerShell"
            "icon" = "terminal-powershell"
        }
        "Command Prompt" = @{
            "source" = "PowerShell"
            "path" = @(
                '${env:windir}\Sysnative\cmd.exe'
                '${env:windir}\System32\cmd.exe'
            )
        }
    }
    "terminal.integrated.shell.windows" = "C:\Windows\System32\WindowsPowerShell\v1.0\powershell.exe"
    "terminal.integrated.shellArgs.windows" = @(
        "-NoProfile"
        "-ExecutionPolicy"
        "Bypass"
    )
}
$settingsJson = ConvertTo-Json -InputObject $settings -Depth 5
Set-Content -Path $settingsPath -Value $settingsJson

# Create or update keybindings.json
$keybindingsPath = Join-Path -Path $vscodePath -ChildPath "keybindings.json"
$keybindings = @(
    @{
        "key" = "shift+enter"
        "command" = "workbench.action.terminal.sendSequence"
        "args" = @{
            "text" = "`u000D"
        }
        "when" = "terminalFocus"
    }
)
$keybindingsJson = ConvertTo-Json -InputObject $keybindings -Depth 5
Set-Content -Path $keybindingsPath -Value $keybindingsJson

Write-Host "VSCode terminal Shift+Enter key binding installed successfully!" -ForegroundColor Green
Write-Host "Please restart VSCode for the changes to take effect."