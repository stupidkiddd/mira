Hi!

# MIRA

一款以失蹤案件與舊電腦為開端的網頁解密遊戲。

目前已完成步驟 01–09 的試玩流程：

1. 閱讀林以晴失蹤案件簡介
2. 解開舊電腦的四位數密碼
3. 調查虛構桌面及瀏覽紀錄
4. 進入景隆銀行 MIRA 內部驗收網站
5. 恢復 MIRA-QA-E017 本機異常記錄
6. 使用 MIRA 的精確資料搜尋
7. 找到林以晴留下的異常訊息
8. 查看項目成員及最近測試記錄
9. 以關聯編號 E017 找到回應評分記錄

進度、已開啟視窗、調查筆記及視窗位置會自動保存在瀏覽器本機。

## Development

```bash
npm install
npm run dev
```

建議使用寬度至少 1024 像素的電腦瀏覽器遊玩。

## Deployment

Push to the `main` branch to build and deploy the app to GitHub Pages. In the
repository's **Settings → Pages**, set **Source** to **GitHub Actions** before the
first deployment.
