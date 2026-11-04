# Install

## Install into an existing repository

```bash
./install.sh /path/to/repo
```

## Manual install

```bash
cp -R .github /path/to/repo/
cp -R scripts /path/to/repo/
cp -R docs /path/to/repo/
cp -R examples /path/to/repo/
```

## Commit

```bash
git checkout -b ci/mise-enhanced-gpu-pack-a-punch
git add .github scripts docs examples
git commit -m "Add Mise enhanced GPU Pack-a-Punch workflow machine"
git push -u origin ci/mise-enhanced-gpu-pack-a-punch
```

## First run

Open a pull request. The CPU workflow will measure, risk-score, run supported quality checks, and upload evidence. GPU jobs remain disabled until you use manual dispatch or add the `gpu-ok` label.
