# 總部 Sheets 自動建立腳本

**⚡ 一鍵建立完整的總部規則庫**

執行一次腳本，自動建立 7 個分頁 + 所有欄位 + 範例資料！

---

## 🚀 使用方式（3分鐘）

### 步驟 1：新建 Google Sheets（30秒）
1. 前往 https://sheets.google.com
2. 點選「空白試算表」

### 步驟 2：開啟 Apps Script（30秒）
1. 在 Sheets 點選上方選單「擴充功能」→「Apps Script」
2. 會開啟新視窗

### 步驟 3：貼上腳本（1分鐘）
1. 刪除預設的 `function myFunction() { ... }`
2. 複製下方完整代碼
3. 貼上到編輯器
4. 點選「儲存」（💾）

### 步驟 4：執行腳本（1分鐘）
1. 點選編輯器上方的函數選單
2. 選擇 `createHQSheets`
3. 點選「執行」（▶️）
4. 第一次執行會要求授權：
   - 點選「審查權限」
   - 選擇你的 Google 帳號
   - 點選「進階」→「前往 xxx（不安全）」
   - 點選「允許」
5. 等待執行完成（約10-15秒）
6. 會彈出提示「✅ 建立完成！」

### 步驟 5：取得 Sheets ID（30秒）
1. 點選函數選單，選擇 `getSheetId`
2. 點選「執行」
3. 會彈出視窗顯示 Sheets ID
4. **複製這個 ID**（下一步會用到）

---

## 💻 完整代碼

```javascript
/**
 * ONE桌遊 AI客服系統 - 總部 Sheets 自動建立腳本
 * 版本: v1.0
 * 更新日期: 2026-02-19
 */

function createHQSheets() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  
  // 重新命名 Sheets
  ss.rename('ONE桌遊AI客服-總部規則庫');
  
  // 刪除預設的 Sheet1
  const defaultSheet = ss.getSheetByName('工作表1') || ss.getSheetByName('Sheet1');
  if (defaultSheet) {
    ss.deleteSheet(defaultSheet);
  }
  
  // 建立所有分頁
  Logger.log('開始建立分頁...');
  createCoreRulesSheet(ss);
  createStandardSOPSheet(ss);
  createMerchantsSheet(ss);
  createWhitelistSheet(ss);
  createBanlistSheet(ss);
  createSystemSheet(ss);
  createLogsSheet(ss);
  
  Logger.log('✅ 總部 Sheets 建立完成！');
  SpreadsheetApp.getUi().alert('✅ 建立完成！\n\n已建立 7 個分頁並填入範例資料。\n\n請複製 Sheets ID 前往部署 Apps Script 後端。');
}

function createCoreRulesSheet(ss) {
  const sheet = ss.insertSheet('核心規則');
  const headers = [['規則ID', '規則名稱', '規則內容', '優先級']];
  sheet.getRange(1, 1, 1, 4).setValues(headers);
  sheet.getRange(1, 1, 1, 4).setFontWeight('bold').setBackground('#4a5568').setFontColor('#ffffff');
  
  const rules = [
    ['CORE_001', '無人店身分設定', '你是ONE桌遊的AI客服，這是無人店，沒有現場人員。嚴禁提及「服務員」「店員」「工作人員」等詞彙，使用「遠端客服」「總部客服」代替。', 10],
    ['CORE_002', '嚴禁提及現場人員', '絕對不可說「我會請現場人員處理」「店員馬上過去」等暗示有現場人員的話。正確說法：「我會立即通知遠端客服為您處理」「總部客服會馬上協助您」', 10],
    ['CORE_003', '白名單驗證機制', '客人若詢問「店內有沒有人」「可以找店員嗎」，需透過白名單關鍵字驗證身分。驗證通過後回覆：「這是無人店哦，有問題都可以直接LINE我」', 9],
    ['CORE_004', '金錢爭議處理', '遇到退款、多收費、折扣爭議等金錢問題，一律回覆：「這部分涉及金額，我會請專人客服與您聯繫處理（30分鐘內）」，並立即推播通知真人客服。', 9],
    ['CORE_005', '安全警報處理', '客人回報「有人受傷」「失火」「打架」「設備冒煙」等緊急狀況，立即推播「🚨緊急通知」給真人客服', 10],
    ['CORE_006', '客訴升級機制', '客人連續3次表達不滿，自動推播通知真人客服介入', 9],
    ['CORE_007', '預約修改限制', '預約更改時間、取消訂單需遵守「提前XX小時」規則（由商家設定）', 8],
    ['CORE_008', '價格資訊來源', '回覆價格時必須從「店家資訊-價格方案」讀取，不可自行編造', 9],
    ['CORE_009', '設備故障通報', '客人回報麻將桌、冷氣、電視故障，先提供標準SOP排除', 8],
    ['CORE_010', 'Wifi密碼查詢', '客人詢問Wifi密碼，從「店家資訊-Wifi密碼」欄位讀取', 7],
    ['CORE_011', '多店家詢問處理', '商家已選店家數量 ≥ 2 時，客人詢問必須先確認是哪一家店', 9],
    ['CORE_012', '單店家直接回覆', '商家已選店家數量 = 1 時，直接提供該店資訊', 9],
    ['CORE_013', '評論引導', '客人表達滿意時，引導留下Google評論', 6],
    ['CORE_014', '首購優惠說明', '若商家有啟用「首購優惠」，在客人詢問價格時主動提及', 7],
    ['CORE_015', '整潔換券活動', '若商家有啟用「整潔換券」，結束後主動提醒', 6],
    ['CORE_016', '禁止詞檢查', '回覆前必須檢查「禁止詞庫」分頁，確保不包含任何禁止詞彙', 10],
    ['CORE_017', '回話字數限制', '單次回覆字數不超過商家設定的「回話字數限制」（預設150字）', 7],
    ['CORE_018', '非營業時間自動回覆', '客服時間外收到訊息，自動回覆營業時間', 8],
    ['CORE_019', '未知問題處理', 'AI無法確定答案時，誠實回覆並通知真人客服', 8]
  ];
  
  sheet.getRange(2, 1, rules.length, 4).setValues(rules);
  sheet.setColumnWidth(1, 120);
  sheet.setColumnWidth(2, 180);
  sheet.setColumnWidth(3, 600);
  sheet.setColumnWidth(4, 80);
  sheet.setFrozenRows(1);
}

function createStandardSOPSheet(ss) {
  const sheet = ss.insertSheet('標準SOP');
  const headers = [['SOP_ID', '設備類型', '故障現象', '排除步驟', '教學連結']];
  sheet.getRange(1, 1, 1, 5).setValues(headers);
  sheet.getRange(1, 1, 1, 5).setFontWeight('bold').setBackground('#4a5568').setFontColor('#ffffff');
  
  const sops = [
    ['SOP_001', '麻將桌', '剛開機張數不對', '1. 檢查檔位開關\n2. 關機等待30秒後重新開機\n3. 確認是否有混牌', ''],
    ['SOP_002', '麻將桌', '卡住或洗牌很久', '1. 長按對角骰子鍵5秒\n2. 等待機器自動重置\n3. 重新按開始鍵', ''],
    ['SOP_003', '麻將桌', '發現異色牌混在一起', '1. 暫停使用\n2. 手動挑出異色牌\n3. 歸回正確牌組\n4. 重新開機測試', ''],
    ['SOP_004', '冷氣', '不冷或溫度調不下來', '1. 確認遙控器電池\n2. 檢查是否為冷氣模式\n3. 調至16-18度測試', ''],
    ['SOP_005', '電視', '無法開機或黑屏', '1. 確認插頭\n2. 檢查延長線開關\n3. 按電源鍵', '']
  ];
  
  sheet.getRange(2, 1, sops.length, 5).setValues(sops);
  sheet.setColumnWidth(1, 100);
  sheet.setColumnWidth(2, 100);
  sheet.setColumnWidth(3, 180);
  sheet.setColumnWidth(4, 500);
  sheet.setColumnWidth(5, 200);
  sheet.setFrozenRows(1);
}

function createMerchantsSheet(ss) {
  const sheet = ss.insertSheet('商家清單');
  const headers = [['商家ID', '商家名稱', '聯絡電話', '客服時間', '店家數量上限', '已選店家數量', '啟用狀態', '備註']];
  sheet.getRange(1, 1, 1, 8).setValues(headers);
  sheet.getRange(1, 1, 1, 8).setFontWeight('bold').setBackground('#4a5568').setFontColor('#ffffff');
  
  const merchants = [
    ['MERCHANT_001', 'Ken 的商家（範例）', '0912-345-678', '10:00-22:00', 10, 3, '啟用', 'VIP商家']
  ];
  
  sheet.getRange(2, 1, merchants.length, 8).setValues(merchants);
  sheet.setColumnWidth(1, 120);
  sheet.setColumnWidth(2, 150);
  sheet.setColumnWidth(3, 120);
  sheet.setColumnWidth(4, 120);
  sheet.setColumnWidth(5, 130);
  sheet.setColumnWidth(6, 130);
  sheet.setColumnWidth(7, 100);
  sheet.setColumnWidth(8, 200);
  sheet.setFrozenRows(1);
}

function createWhitelistSheet(ss) {
  const sheet = ss.insertSheet('白名單關鍵字');
  const headers = [['關鍵字ID', '關鍵字', '回覆內容']];
  sheet.getRange(1, 1, 1, 3).setValues(headers);
  sheet.getRange(1, 1, 1, 3).setFontWeight('bold').setBackground('#4a5568').setFontColor('#ffffff');
  
  const whitelist = [
    ['WL_001', '我是會員', '好的！有問題都可以直接LINE我'],
    ['WL_002', '我有預約', '沒問題！有任何需要都可以告訴我'],
    ['WL_003', '我剛進來', '歡迎光臨！有問題隨時找我'],
    ['WL_004', '我在店裡', '收到！有需要協助的地方嗎？'],
    ['WL_005', '我訂了位', '好的！祝您玩得開心'],
    ['WL_006', '我是客人', '歡迎！有什麼可以幫您的嗎？'],
    ['WL_007', '我預約了', '收到！有問題隨時LINE我'],
    ['WL_008', '我在包廂', '好的！需要什麼協助嗎？'],
    ['WL_009', '我剛結帳', '謝謝光臨！期待下次再見'],
    ['WL_010', '我是今天的客人', '歡迎！有問題都可以問我']
  ];
  
  sheet.getRange(2, 1, whitelist.length, 3).setValues(whitelist);
  sheet.setColumnWidth(1, 120);
  sheet.setColumnWidth(2, 150);
  sheet.setColumnWidth(3, 300);
  sheet.setFrozenRows(1);
}

function createBanlistSheet(ss) {
  const sheet = ss.insertSheet('禁止詞庫');
  const headers = [['禁止詞ID', '禁止詞', '正確說法']];
  sheet.getRange(1, 1, 1, 3).setValues(headers);
  sheet.getRange(1, 1, 1, 3).setFontWeight('bold').setBackground('#4a5568').setFontColor('#ffffff');
  
  const banlist = [
    ['BAN_001', '店員', '遠端客服'],
    ['BAN_002', '服務員', '客服人員'],
    ['BAN_003', '工作人員', '總部客服'],
    ['BAN_004', '現場人員', '遠端協助'],
    ['BAN_005', '櫃台人員', '線上客服'],
    ['BAN_006', '我會請人過去', '我會立即通知遠端客服'],
    ['BAN_007', '馬上有人處理', '客服會立即協助您'],
    ['BAN_008', '請找現場人員', '請直接LINE我'],
    ['BAN_009', '人工客服', '真人客服'],
    ['BAN_010', '店內有人嗎', '這是無人店，有問題都可以LINE我'],
    ['BAN_011', '可以找店長嗎', '我會幫您聯繫專人客服'],
    ['BAN_012', '有沒有員工', '這是無人店哦'],
    ['BAN_013', '我在店裡等', '請保持LINE暢通，客服會盡快聯繫您'],
    ['BAN_014', '我去櫃台', '有問題請直接LINE我'],
    ['BAN_015', '現場沒人', '對的，這是無人店，有問題隨時找我']
  ];
  
  sheet.getRange(2, 1, banlist.length, 3).setValues(banlist);
  sheet.setColumnWidth(1, 120);
  sheet.setColumnWidth(2, 200);
  sheet.setColumnWidth(3, 200);
  sheet.setFrozenRows(1);
}

function createSystemSheet(ss) {
  const sheet = ss.insertSheet('系統設定');
  const headers = [['設定項目', '設定值']];
  sheet.getRange(1, 1, 1, 2).setValues(headers);
  sheet.getRange(1, 1, 1, 2).setFontWeight('bold').setBackground('#4a5568').setFontColor('#ffffff');
  
  const settings = [
    ['LINE_NOTIFY_TOKEN', '（填入實際Token）'],
    ['OPENAI_API_KEY', '（填入實際Key）'],
    ['預設AI供應商', 'OpenAI'],
    ['預設回話字數', '150'],
    ['系統版本', 'v1.0']
  ];
  
  sheet.getRange(2, 1, settings.length, 2).setValues(settings);
  sheet.setColumnWidth(1, 200);
  sheet.setColumnWidth(2, 400);
  sheet.setFrozenRows(1);
}

function createLogsSheet(ss) {
  const sheet = ss.insertSheet('更新紀錄');
  const headers = [['更新時間', '修改項目', '修改內容', '修改人', '備註']];
  sheet.getRange(1, 1, 1, 5).setValues(headers);
  sheet.getRange(1, 1, 1, 5).setFontWeight('bold').setBackground('#4a5568').setFontColor('#ffffff');
  
  const logs = [
    [new Date(), '系統初始化', '建立總部規則表所有分頁', '系統', '初版建立']
  ];
  
  sheet.getRange(2, 1, logs.length, 5).setValues(logs);
  sheet.setColumnWidth(1, 180);
  sheet.setColumnWidth(2, 150);
  sheet.setColumnWidth(3, 300);
  sheet.setColumnWidth(4, 100);
  sheet.setColumnWidth(5, 200);
  sheet.setFrozenRows(1);
}

function getSheetId() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const id = ss.getId();
  Logger.log('Sheets ID: ' + id);
  SpreadsheetApp.getUi().alert('📋 Sheets ID\n\n' + id + '\n\n請複製此 ID 貼到 Apps Script 的 HQ_SHEET_ID');
}
```

---

## ✅ 執行後會建立什麼

### 7 個分頁自動建立：
1. **核心規則** - 19 條完整規則（無人店身分、金錢爭議、安全警報等）
2. **標準SOP** - 5 個故障排除流程（麻將桌、冷氣、電視）
3. **商家清單** - 1 筆範例商家資料
4. **白名單關鍵字** - 10 個驗證關鍵字
5. **禁止詞庫** - 15 個禁止詞與正確說法
6. **系統設定** - API Token 設定欄位
7. **更新紀錄** - 1 筆初始化記錄

### 格式化完成：
- ✅ 標題行（深灰背景 + 白色文字）
- ✅ 凍結第一行
- ✅ 欄位寬度自動調整
- ✅ 所有範例資料填入

---

## 📝 下一步

執行完成後：
1. ✅ 執行 `getSheetId()` 取得 Sheets ID
2. ✅ 複製 Sheets ID
3. ✅ 前往 [後端代碼](./backend-code.md) 部署 Apps Script
4. ✅ 填入 `HQ_SHEET_ID`
5. ✅ 部署為 Web App
6. ✅ 開啟戰情室連接後端

---

**⚡ 3 分鐘內完成總部 Sheets 建立！**
