# 貢獻指南

感謝你願意為這個專案做出貢獻。

## 開發流程

1. Fork 此倉庫
2. 建立功能分支
3. 完成修改與測試
4. 發送 Pull Request

```bash
git checkout -b feature/your-feature
npm ci
npm run lint
npm test -- --runInBand
npm run build
git commit -m "feat: describe your change"
git push origin feature/your-feature
```

## Commit 規範

建議使用 Conventional Commits：

- `feat:` 新功能
- `fix:` Bug 修正
- `docs:` 文件更新
- `refactor:` 重構
- `test:` 測試更新
- `chore:` 維護項目

## 計算邏輯修改注意事項

若改動 `lib/careCalculator.ts`、`lib/careLogic.ts` 或 `constants/careData.ts`，請在 PR 說明：

1. 資料來源（官方公告或可驗證文件）
2. 受影響的 CMS 等級/身份別/照顧方式
3. 測試覆蓋或驗證方式
