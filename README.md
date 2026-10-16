# 短劇場 · Demo

ReelShort 式直式短劇平台演示版（手機優先單頁網站）。注意：本 repo 的 branch 係 `master`（唯一 branch），唔係 `main`。

- 線上網址：https://shortdrama-demo.vercel.app
- 源碼：https://github.com/eva318chan/shortdrama-demo

## 功能

- **劇場**：直式全屏短劇資訊流，上下滑動切換，點擊暫停／播放，點讚
- **金幣解鎖**：前 3 部免費，其餘每部 10 金幣解鎖（演示流程，每日可領 50 金幣）
- **片庫**：按類型篩選（古裝甜寵／武俠動作／神話傳說／玄幻／美食／歷史戰爭／AI武俠／親情／懷舊／西遊）
- **我的**：金幣餘額、已解鎖、觀看歷史（`localStorage` 本機儲存）
- 10 部示範短劇，影片經壓縮作串流演示

## 技術棧

- HTML + CSS + vanilla JavaScript（`index.html`、`app.js`），無 framework、無 build step、無後端
- 影片：`videos/` 目錄 10 條示範 mp4；海報圖：`posters/`
- 用戶狀態（金幣、解鎖、歷史）全放瀏覽器 `localStorage`，無伺服器端帳號
- Hosting：Vercel（連接 GitHub `master` branch，push 即自動 deploy）

## 資料夾／檔案

| 路徑 | 說明 |
|---|---|
| `index.html` | 全站版面及樣式（手機全屏、scroll-snap feed） |
| `app.js` | 前端邏輯：feed 播放控制、金幣解鎖流程、片庫篩選、localStorage |
| `videos/` | 10 條示範短劇 mp4（檔名如 `18.mp4`、`4c.mp4`） |
| `posters/` | 對應海報圖（`18.jpg` 對 `18.mp4`，如此類推） |

## 說明

演示版：影片為示範內容，不作永久儲存；無正式會員、支付及版權結算系統。如要轉正式版，需另建後端（帳號、金幣交易、版權方結算）。

## 本地開發

`python3 -m http.server` 後用手機或瀏覽器手機模式開 `http://localhost:8000` 預覽（直式全屏設計，桌面睇效果會打折）。

## Deploy

Vercel 已連接本 repo 的 `master` branch：push 上 `master` 即自動 deploy 到 https://shortdrama-demo.vercel.app。

## 維護注意事項

- 加新劇：`videos/`＋`posters/` 加同名檔案，並喺 `app.js` 的劇集清單加一項。
- 注意 repo 大小：影片檔會令 repo 變大，大量加片前考慮轉用對象儲存（如 Cloudflare R2／Stream）。
