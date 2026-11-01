#!/usr/bin/env bash
set -euo pipefail

cat <<'EOF' >> "${HOME}/.miseos-git-aliases"
alias ms="miseos repo status"
alias ma="miseos prep stage"
alias mc="miseos prep commit -m"
alias mp="miseos dispatch push"
alias ml="miseos trace log"
alias mh="miseos hold stash"
alias mr="miseos undo commit"
EOF

echo "MiseOS Git aliases written to ~/.miseos-git-aliases"
echo "Add this to your shell profile: source ~/.miseos-git-aliases"
