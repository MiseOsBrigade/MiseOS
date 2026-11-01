# Apply Mise OS Update Kit

From the root of `MiseOsBrigade/Mise-OS`, copy this kit into the repository.

```bash
cp -R /path/to/mise-os-repo-update-kit/. .
npm install
npm run doctor
npm run brand:folders
git add .
git commit -m "feat: add Mise OS intro, brand system, and repo roamer"
git push origin main
```

The GitHub connector could not push this directly because the repository returned `404 Not Found` and no installed repositories were visible to the connector.
