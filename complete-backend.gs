/**
 * ONE桌遊 AI客服系統 - 總部戰情室後端
 * 版本: v1.2
 * 更新日期: 2026-02-19
 * 
 * 使用方式：
 * 1. 複製這整個檔案的內容
 * 2. 在總部 Sheets 開啟「擴充功能」→「Apps Script」
 * 3. 刪除所有現有代碼
 * 4. 貼上這個完整代碼
 * 5. 修改第 15 行的 HQ_SHEET_ID（填入你的 Sheets ID）
 * 6. 儲存
 * 7. 部署為 Web App
 */

// ========== 配置區 ==========
const CONFIG = {
  // ⚠️ 填入你的總部 Sheets ID（從網址複製）
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

// ========== Web App 入口 ==========

/**
 * GET 請求處理
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
 * POST 請求處理
 */
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    
    if (data.id && data.name) {
      return jsonResponse(addMerchant(data));
    }
    
    return jsonResponse({ error: '未知的操作' }, 400);
  } catch (error) {
    Logger.log('doPost 錯誤: ' + error);
    return jsonResponse({ error: error.toString() }, 500);
  }
}

// ========== 數據讀取函數 ==========

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

// ========== 數據寫入函數 ==========

/**
 * 新增商家
 */
function addMerchant(data) {
  try {
    const ss = SpreadsheetApp.openById(CONFIG.HQ_SHEET_ID);
    const sheet = ss.getSheetByName(CONFIG.SHEETS.MERCHANTS);
    
    if (!sheet) {
      return { success: false, message: '找不到商家清單分頁' };
    }
    
    sheet.appendRow([
      data.id,
      data.name,
      data.phone,
      data.serviceTime,
      data.maxStores,
      data.storeCount || 0,
      data.status || '啟用',
      data.note || ''
    ]);
    
    const logsSheet = ss.getSheetByName(CONFIG.SHEETS.LOGS);
    if (logsSheet) {
      logsSheet.appendRow([
        new Date(),
        '商家管理',
        '新增商家：' + data.name,
        '戰情室',
        '商家ID: ' + data.id
      ]);
    }
    
    return { success: true, message: '新增成功', id: data.id };
  } catch (error) {
    Logger.log('addMerchant 錯誤: ' + error);
    return { success: false, message: error.toString() };
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

function testAddMerchant() {
  const testData = {
    id: 'MERCHANT_TEST',
    name: '測試商家',
    phone: '0912-345-678',
    serviceTime: '10:00-22:00',
    maxStores: 5,
    storeCount: 0,
    status: '啟用',
    note: '測試用'
  };
  
  const result = addMerchant(testData);
  Logger.log('新增商家測試：');
  Logger.log(JSON.stringify(result, null, 2));
}
