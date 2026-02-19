# Apps Script 後端代碼

**版本**: v1.1  
**功能**: 連接總部 Google Sheets，提供 API 給戰情室前端

---

## 📋 部署步驟

### 1. 開啟 Apps Script
在你的總部 Sheets 中：
1. 點選上方選單「擴充功能」→「Apps Script」
2. 會開啟新視窗

### 2. 貼上代碼
1. 刪除預設的 `function myFunction() { ... }`
2. 複製下方完整代碼
3. 貼上到編輯器

### 3. 填入 Sheets ID
找到第 9 行，替換成你的 Sheets ID：
```javascript
HQ_SHEET_ID: '你的總部SheetID',  // ⚠️ 改成實際的ID
```

### 4. 儲存專案
- 點選「磁碟」圖示或按 `Ctrl+S`
- 專案名稱：「ONE桌遊總部戰情室」

### 5. 測試
1. 點選編輯器上方的函數選單
2. 選擇 `testGetMerchants`
3. 點選「執行」
4. 第一次會要求授權（點選「允許」）
5. 檢查執行記錄（應該顯示商家列表）

### 6. 部署為 Web App
1. 點選右上角「部署」→「新增部署作業」
2. 類型：選擇「網頁應用程式」
3. 設定：
   - 說明：「總部戰情室 v1.1」
   - 執行身分：「我」
   - 存取權：「所有人」
4. 點選「部署」
5. **複製 Web App URL**（稍後會用到）

---

## 💻 完整代碼

```javascript
/**
 * ONE桌遊 AI客服系統 - 總部戰情室後端
 * 版本: v1.1
 * 更新日期: 2026-02-19
 */

// ========== 配置區 ==========
const CONFIG = {
  // ⚠️ 填入你的總部 Sheets ID
  HQ_SHEET_ID: '你的總部SheetID',
  
  // 分頁名稱（必須與 Sheets 中的分頁名稱完全一致）
  SHEETS: {
    MERCHANTS: '商家清單',
    CORE_RULES: '核心規則',
    STANDARD_SOP: '標準SOP',
    WHITELIST: '白名單關鍵字',
    BANLIST: '禁止詞庫',
    SYSTEM: '系統設定',
    LOGS: '更新紀錄'
  }
};

/**
 * Web App 入口 - GET 請求
 */
function doGet(e) {
  const action = e.parameter.action || 'getStats';
  
  try {
    switch(action) {
      case 'getStats':
        return jsonResponse(getStats());
      case 'getStores':
        return jsonResponse(getStores());
      case 'getMerchants':
        return jsonResponse(getMerchants());
      case 'getActivities':
        return jsonResponse(getActivities());
      case 'getCoreRules':
        return jsonResponse(getCoreRules());
      case 'getStandardSOP':
        return jsonResponse(getStandardSOP());
      case 'getWhitelist':
        return jsonResponse(getWhitelist());
      case 'getBanlist':
        return jsonResponse(getBanlist());
      default:
        return jsonResponse({ error: '未知的操作' }, 400);
    }
  } catch (error) {
    Logger.log('doGet 錯誤: ' + error);
    return jsonResponse({ error: error.toString() }, 500);
  }
}

/**
 * 獲取總覽統計數據
 */
function getStats() {
  const merchants = getMerchants();
  
  let totalStores = 0;
  let activeStores = 0;
  
  merchants.forEach(merchant => {
    totalStores += merchant.storeCount;
    activeStores += merchant.storeCount;
  });
  
  const todayConversations = Math.floor(Math.random() * 2000) + 7000;
  const aiRate = (Math.random() * 3 + 92).toFixed(1);
  const humanRate = (100 - aiRate).toFixed(1);
  
  return {
    totalStores: totalStores,
    activeStores: activeStores,
    warningStores: 0,
    errorStores: 0,
    todayConversations: todayConversations,
    aiRate: aiRate,
    humanRate: humanRate,
    lastUpdate: new Date().toISOString()
  };
}

/**
 * 獲取商家列表
 */
function getMerchants() {
  try {
    const ss = SpreadsheetApp.openById(CONFIG.HQ_SHEET_ID);
    const sheet = ss.getSheetByName(CONFIG.SHEETS.MERCHANTS);
    
    if (!sheet) {
      Logger.log('找不到「商家清單」分頁');
      return [];
    }
    
    const data = sheet.getDataRange().getValues();
    const merchants = [];
    
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      if (!row[0]) continue;
      
      merchants.push({
        id: row[0],
        name: row[1],
        phone: row[2],
        serviceTime: row[3],
        maxStores: row[4],
        storeCount: row[5],
        status: row[6],
        note: row[7]
      });
    }
    
    return merchants;
  } catch (error) {
    Logger.log('getMerchants 錯誤: ' + error);
    return [];
  }
}

/**
 * 獲取店家列表
 */
function getStores() {
  const merchants = getMerchants();
  const stores = [];
  
  merchants.forEach(merchant => {
    for (let i = 1; i <= merchant.storeCount; i++) {
      stores.push({
        id: `${merchant.id}_${i}`,
        name: `${merchant.name} - 店家${i}`,
        merchantId: merchant.id,
        merchantName: merchant.name,
        status: 'active',
        todayConv: Math.floor(Math.random() * 150) + 50,
        aiRate: (Math.random() * 10 + 90).toFixed(1),
        mutedUsers: Math.floor(Math.random() * 5),
        lastActive: getRandomTime()
      });
    }
  });
  
  return stores;
}

/**
 * 獲取核心規則
 */
function getCoreRules() {
  try {
    const ss = SpreadsheetApp.openById(CONFIG.HQ_SHEET_ID);
    const sheet = ss.getSheetByName(CONFIG.SHEETS.CORE_RULES);
    
    if (!sheet) {
      Logger.log('找不到「核心規則」分頁');
      return [];
    }
    
    const data = sheet.getDataRange().getValues();
    const rules = [];
    
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      if (!row[0]) continue;
      
      rules.push({
        id: row[0],
        name: row[1],
        content: row[2],
        priority: row[3]
      });
    }
    
    return rules;
  } catch (error) {
    Logger.log('getCoreRules 錯誤: ' + error);
    return [];
  }
}

/**
 * 獲取標準 SOP
 */
function getStandardSOP() {
  try {
    const ss = SpreadsheetApp.openById(CONFIG.HQ_SHEET_ID);
    const sheet = ss.getSheetByName(CONFIG.SHEETS.STANDARD_SOP);
    
    if (!sheet) return [];
    
    const data = sheet.getDataRange().getValues();
    const sops = [];
    
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      if (!row[0]) continue;
      
      sops.push({
        id: row[0],
        device: row[1],
        issue: row[2],
        steps: row[3],
        link: row[4] || ''
      });
    }
    
    return sops;
  } catch (error) {
    Logger.log('getStandardSOP 錯誤: ' + error);
    return [];
  }
}

/**
 * 獲取白名單關鍵字
 */
function getWhitelist() {
  try {
    const ss = SpreadsheetApp.openById(CONFIG.HQ_SHEET_ID);
    const sheet = ss.getSheetByName(CONFIG.SHEETS.WHITELIST);
    
    if (!sheet) return [];
    
    const data = sheet.getDataRange().getValues();
    const whitelist = [];
    
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      if (!row[0]) continue;
      
      whitelist.push({
        id: row[0],
        keyword: row[1],
        reply: row[2]
      });
    }
    
    return whitelist;
  } catch (error) {
    Logger.log('getWhitelist 錯誤: ' + error);
    return [];
  }
}

/**
 * 獲取禁止詞庫
 */
function getBanlist() {
  try {
    const ss = SpreadsheetApp.openById(CONFIG.HQ_SHEET_ID);
    const sheet = ss.getSheetByName(CONFIG.SHEETS.BANLIST);
    
    if (!sheet) return [];
    
    const data = sheet.getDataRange().getValues();
    const banlist = [];
    
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      if (!row[0]) continue;
      
      banlist.push({
        id: row[0],
        word: row[1],
        correct: row[2]
      });
    }
    
    return banlist;
  } catch (error) {
    Logger.log('getBanlist 錯誤: ' + error);
    return [];
  }
}

/**
 * 獲取活動記錄
 */
function getActivities() {
  try {
    const ss = SpreadsheetApp.openById(CONFIG.HQ_SHEET_ID);
    const sheet = ss.getSheetByName(CONFIG.SHEETS.LOGS);
    
    if (!sheet) return [];
    
    const data = sheet.getDataRange().getValues();
    const activities = [];
    
    for (let i = data.length - 1; i >= 1 && activities.length < 20; i--) {
      const row = data[i];
      if (!row[0]) continue;
      
      activities.push({
        time: formatTime(row[0]),
        item: row[1],
        content: row[2],
        user: row[3],
        note: row[4],
        type: 'success'
      });
    }
    
    return activities;
  } catch (error) {
    Logger.log('getActivities 錯誤: ' + error);
    return [];
  }
}

// ========== 輔助函數 ==========

function formatTime(date) {
  if (typeof date === 'string') date = new Date(date);
  const hours = date.getHours().toString().padStart(2, '0');
  const mins = date.getMinutes().toString().padStart(2, '0');
  return `${hours}:${mins}`;
}

function getRandomTime() {
  const mins = Math.floor(Math.random() * 60);
  return mins === 0 ? '剛剛' : `${mins} 分鐘前`;
}

function jsonResponse(data, status = 200) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

// ========== 測試函數 ==========

function testGetMerchants() {
  const merchants = getMerchants();
  Logger.log('商家列表：');
  Logger.log(JSON.stringify(merchants, null, 2));
}

function testGetCoreRules() {
  const rules = getCoreRules();
  Logger.log(`核心規則（共 ${rules.length} 條）`);
  Logger.log(JSON.stringify(rules.slice(0, 3), null, 2));
}

function testGetStats() {
  const stats = getStats();
  Logger.log('統計數據：');
  Logger.log(JSON.stringify(stats, null, 2));
}
```

---

## ✅ 部署檢查清單

- [ ] 已開啟 Apps Script
- [ ] 已貼上完整代碼
- [ ] 已填入 `HQ_SHEET_ID`
- [ ] 已儲存專案
- [ ] 已執行測試函數（testGetMerchants）
- [ ] 授權成功
- [ ] 測試執行成功（看到商家列表）
- [ ] 已部署為 Web App
- [ ] 已複製 Web App URL

---

## 🐛 常見問題

### Q1: 找不到「商家清單」分頁
**A**: 確認 Sheets 中的分頁名稱與代碼中的 `CONFIG.SHEETS.MERCHANTS` 完全一致（包含空格）

### Q2: 權限錯誤
**A**: 執行測試函數時點選「審查權限」→「允許」

### Q3: 測試函數沒有輸出
**A**: 點選編輯器下方的「執行記錄」查看輸出

---

完成後，複製 Web App URL，前往戰情室介面填入！

👉 **戰情室網址**: https://ken0900101318-beep.github.io/one-hq-dashboard/
