/**
 * ONE桌遊 AI客服系統 - 商家 Sheets 自動建立腳本
 * 版本: v1.0
 * 更新日期: 2026-02-19
 * 
 * 使用方式：
 * 1. 新建一個空白 Google Sheets
 * 2. 開啟「擴充功能」→「Apps Script」
 * 3. 貼上這段代碼
 * 4. 執行 createMerchantSheets() 函數
 * 5. 完成！
 */

/**
 * 主函數：一鍵建立完整的商家 Sheets
 */
function createMerchantSheets() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  
  // 重新命名 Sheets
  ss.rename('ONE桌遊AI客服-商家設定（範例）');
  
  // 刪除預設的 Sheet1
  const defaultSheet = ss.getSheetByName('工作表1') || ss.getSheetByName('Sheet1');
  if (defaultSheet) {
    ss.deleteSheet(defaultSheet);
  }
  
  // 建立所有分頁
  Logger.log('開始建立分頁...');
  createMerchantInfoSheet(ss);
  createAISettingsSheet(ss);
  createMerchantRulesSheet(ss);
  createRefundPolicySheet(ss);
  createStoreListSheet(ss);
  createStoreInfoSheet(ss);
  createConversationLogsSheet(ss);
  
  Logger.log('✅ 商家 Sheets 建立完成！');
  SpreadsheetApp.getUi().alert('✅ 建立完成！\n\n已建立 7 個分頁並填入範例資料。\n\n下一步：\n1. 修改商家資訊\n2. 設定 AI 個性\n3. 新增商家規則\n4. 填入店家資訊');
}

/**
 * 分頁 1：商家資訊
 */
function createMerchantInfoSheet(ss) {
  const sheet = ss.insertSheet('商家資訊');
  
  // 標題行
  const headers = [['項目', '內容']];
  sheet.getRange(1, 1, 1, 2).setValues(headers);
  sheet.getRange(1, 1, 1, 2).setFontWeight('bold').setBackground('#4a5568').setFontColor('#ffffff');
  
  // 資料
  const data = [
    ['商家ID', 'MERCHANT_001'],
    ['商家名稱', 'Ken 的商家（範例）'],
    ['聯絡電話', '0912-345-678'],
    ['客服時間', '10:00-22:00'],
    ['緊急聯絡人', 'Ken'],
    ['緊急電話', '0912-345-678'],
    ['LINE Notify Token', '（選填）'],
    ['總部Sheets ID', '（填入總部規則庫ID）'],
    ['啟用狀態', '啟用'],
    ['備註', '這是範例商家']
  ];
  
  sheet.getRange(2, 1, data.length, 2).setValues(data);
  
  // 格式化
  sheet.setColumnWidth(1, 200);
  sheet.setColumnWidth(2, 400);
  sheet.setFrozenRows(1);
  
  Logger.log('✅ 商家資訊分頁建立完成');
}

/**
 * 分頁 2：AI設定
 */
function createAISettingsSheet(ss) {
  const sheet = ss.insertSheet('AI設定');
  
  const headers = [['設定項目', '設定值']];
  sheet.getRange(1, 1, 1, 2).setValues(headers);
  sheet.getRange(1, 1, 1, 2).setFontWeight('bold').setBackground('#4a5568').setFontColor('#ffffff');
  
  const data = [
    ['AI個性', '親切友善'],
    ['AI名稱', '小助手'],
    ['回話字數限制', '150'],
    ['創意度', '0.7'],
    ['API供應商', 'OpenAI'],
    ['模型', 'gpt-4'],
    ['首購優惠', '啟用'],
    ['首購折扣', '9折'],
    ['整潔換券', '啟用'],
    ['整潔券金額', '50'],
    ['', ''],
    ['=== AI個性選項說明 ===', ''],
    ['親切友善', '語氣溫暖、使用emoji、主動關心'],
    ['專業簡潔', '語氣正式、重點明確、不用emoji'],
    ['活潑幽默', '語氣輕鬆、偶爾幽默、使用網路用語'],
    ['耐心細緻', '詳細說明、分步驟解釋、確認理解'],
    ['高效快速', '簡短明確、直接重點、避免廢話']
  ];
  
  sheet.getRange(2, 1, data.length, 2).setValues(data);
  
  sheet.setColumnWidth(1, 200);
  sheet.setColumnWidth(2, 400);
  sheet.setFrozenRows(1);
  
  Logger.log('✅ AI設定分頁建立完成');
}

/**
 * 分頁 3：商家規則
 */
function createMerchantRulesSheet(ss) {
  const sheet = ss.insertSheet('商家規則');
  
  const headers = [['規則ID', '規則名稱', '觸發條件', '規則內容', '優先級', '啟用狀態']];
  sheet.getRange(1, 1, 1, 6).setValues(headers);
  sheet.getRange(1, 1, 1, 6).setFontWeight('bold').setBackground('#4a5568').setFontColor('#ffffff');
  
  const rules = [
    ['MERCHANT_R001', '特殊活動優惠', '客人詢問價格、優惠、活動', '目前有「春節特惠」活動，全場8折，2/1-2/15有效。請主動提及。', 8, '啟用'],
    ['MERCHANT_R002', '會員專屬福利', '客人提到會員、VIP', '會員享有：1. 9折優惠 2. 生日當月免費1小時 3. 優先訂位。請主動說明。', 7, '啟用'],
    ['MERCHANT_R003', '包場服務說明', '客人詢問包場、團體、多人', '10人以上可包場，提前3天預約，享9折優惠。聯絡電話：0912-345-678', 7, '啟用'],
    ['MERCHANT_R004', '新客優惠', '首次預約的客人', '首次預約享9折優惠，歡迎加入LINE好友獲取優惠碼', 7, '啟用'],
    ['MERCHANT_R005', '深夜優惠時段', '客人詢問22:00後時段', '22:00-24:00深夜時段享8折優惠（週一至週四）', 6, '啟用']
  ];
  
  sheet.getRange(2, 1, rules.length, 6).setValues(rules);
  
  sheet.setColumnWidth(1, 130);
  sheet.setColumnWidth(2, 150);
  sheet.setColumnWidth(3, 200);
  sheet.setColumnWidth(4, 500);
  sheet.setColumnWidth(5, 80);
  sheet.setColumnWidth(6, 100);
  sheet.setFrozenRows(1);
  
  Logger.log('✅ 商家規則分頁建立完成（5條範例規則）');
}

/**
 * 分頁 4：退單政策
 */
function createRefundPolicySheet(ss) {
  const sheet = ss.insertSheet('退單政策');
  
  const headers = [['政策項目', '設定值']];
  sheet.getRange(1, 1, 1, 2).setValues(headers);
  sheet.getRange(1, 1, 1, 2).setFontWeight('bold').setBackground('#4a5568').setFontColor('#ffffff');
  
  const data = [
    ['提前取消時限（小時）', '24'],
    ['超過時限處理方式', '扣款'],
    ['扣款比例（%）', '30'],
    ['退款方式', '原路退回'],
    ['退款處理時間', '3-5個工作天'],
    ['特殊情況處理', '天災、疫情、設備故障全額退款'],
    ['緊急聯絡電話', '0912-345-678'],
    ['', ''],
    ['=== 退單規則說明 ===', ''],
    ['24小時前取消', '提前24小時以上取消預約，全額退款'],
    ['24小時內取消', '預約開始前24小時內取消，扣除訂金30%'],
    ['已開始使用', '已開始使用後無法取消，不予退款'],
    ['特殊情況', '天災、疫情、設備故障等不可抗力，全額退款']
  ];
  
  sheet.getRange(2, 1, data.length, 2).setValues(data);
  
  sheet.setColumnWidth(1, 250);
  sheet.setColumnWidth(2, 400);
  sheet.setFrozenRows(1);
  
  Logger.log('✅ 退單政策分頁建立完成');
}

/**
 * 分頁 5：店家清單
 */
function createStoreListSheet(ss) {
  const sheet = ss.insertSheet('店家清單');
  
  const headers = [['店家ID', '店家名稱', '地址', '預約網址', '啟用狀態']];
  sheet.getRange(1, 1, 1, 5).setValues(headers);
  sheet.getRange(1, 1, 1, 5).setFontWeight('bold').setBackground('#4a5568').setFontColor('#ffffff');
  
  const stores = [
    ['STORE_001', 'ONE桌遊 土城店', '新北市土城區xxx路xxx號', 'https://...', '啟用'],
    ['STORE_002', 'ONE桌遊 新莊店', '新北市新莊區xxx路xxx號', 'https://...', '啟用'],
    ['STORE_003', 'ONE桌遊 板橋店', '新北市板橋區xxx路xxx號', 'https://...', '啟用']
  ];
  
  sheet.getRange(2, 1, stores.length, 5).setValues(stores);
  
  sheet.setColumnWidth(1, 120);
  sheet.setColumnWidth(2, 180);
  sheet.setColumnWidth(3, 300);
  sheet.setColumnWidth(4, 250);
  sheet.setColumnWidth(5, 100);
  sheet.setFrozenRows(1);
  
  Logger.log('✅ 店家清單分頁建立完成（3家範例店）');
}

/**
 * 分頁 6：店家資訊
 */
function createStoreInfoSheet(ss) {
  const sheet = ss.insertSheet('店家資訊');
  
  const headers = [['店家ID', '項目', '內容']];
  sheet.getRange(1, 1, 1, 3).setValues(headers);
  sheet.getRange(1, 1, 1, 3).setFontWeight('bold').setBackground('#4a5568').setFontColor('#ffffff');
  
  const data = [
    // 土城店
    ['STORE_001', '店家名稱', 'ONE桌遊 土城店'],
    ['STORE_001', '地址', '新北市土城區xxx路xxx號'],
    ['STORE_001', '電話', '02-2222-3333'],
    ['STORE_001', '預約網址', 'https://...'],
    ['STORE_001', 'Google評論', 'https://g.page/xxx'],
    ['STORE_001', 'Wifi密碼', 'one12345'],
    ['STORE_001', '營業時間', '10:00-24:00'],
    ['STORE_001', '座位分類', '一般桌/包廂'],
    ['STORE_001', '一般桌價格', '$200/小時'],
    ['STORE_001', '包廂價格', '$300/小時'],
    ['STORE_001', '有花/無花', '有花+$50/小時'],
    ['STORE_001', '飲料機', '有'],
    ['STORE_001', '飲水機', '有'],
    ['STORE_001', '電視', '每桌都有'],
    ['STORE_001', '停車資訊', '路邊停車'],
    ['STORE_001', '交通資訊', '捷運永寧站步行5分鐘'],
    ['', '', ''],
    // 新莊店
    ['STORE_002', '店家名稱', 'ONE桌遊 新莊店'],
    ['STORE_002', '地址', '新北市新莊區xxx路xxx號'],
    ['STORE_002', '電話', '02-3333-4444'],
    ['STORE_002', '預約網址', 'https://...'],
    ['STORE_002', 'Wifi密碼', 'one54321'],
    ['STORE_002', '營業時間', '10:00-24:00'],
    ['STORE_002', '一般桌價格', '$180/小時'],
    ['STORE_002', '包廂價格', '$280/小時'],
    ['STORE_002', '交通資訊', '捷運新莊站步行8分鐘'],
    ['', '', ''],
    // 板橋店
    ['STORE_003', '店家名稱', 'ONE桌遊 板橋店'],
    ['STORE_003', '地址', '新北市板橋區xxx路xxx號'],
    ['STORE_003', '電話', '02-4444-5555'],
    ['STORE_003', '預約網址', 'https://...'],
    ['STORE_003', 'Wifi密碼', 'one99999'],
    ['STORE_003', '營業時間', '12:00-02:00'],
    ['STORE_003', '一般桌價格', '$220/小時'],
    ['STORE_003', '包廂價格', '$320/小時'],
    ['STORE_003', '交通資訊', '捷運板橋站步行3分鐘']
  ];
  
  sheet.getRange(2, 1, data.length, 3).setValues(data);
  
  sheet.setColumnWidth(1, 120);
  sheet.setColumnWidth(2, 180);
  sheet.setColumnWidth(3, 400);
  sheet.setFrozenRows(1);
  
  Logger.log('✅ 店家資訊分頁建立完成（3家店完整資訊）');
}

/**
 * 分頁 7：對話記錄
 */
function createConversationLogsSheet(ss) {
  const sheet = ss.insertSheet('對話記錄');
  
  const headers = [['時間戳記', '店家ID', '用戶ID', '客人訊息', 'AI回覆', '是否轉真人', '處理人員']];
  sheet.getRange(1, 1, 1, 7).setValues(headers);
  sheet.getRange(1, 1, 1, 7).setFontWeight('bold').setBackground('#4a5568').setFontColor('#ffffff');
  
  const logs = [
    [new Date(), 'STORE_001', 'Uabc123', '請問價格？', '您好！土城店的價格是...（範例）', '否', '-'],
    [new Date(), 'STORE_001', 'Uabc123', 'wifi密碼？', 'Wifi密碼是：one12345', '否', '-']
  ];
  
  sheet.getRange(2, 1, logs.length, 7).setValues(logs);
  
  sheet.setColumnWidth(1, 180);
  sheet.setColumnWidth(2, 120);
  sheet.setColumnWidth(3, 120);
  sheet.setColumnWidth(4, 250);
  sheet.setColumnWidth(5, 400);
  sheet.setColumnWidth(6, 100);
  sheet.setColumnWidth(7, 120);
  sheet.setFrozenRows(1);
  
  Logger.log('✅ 對話記錄分頁建立完成');
}

/**
 * 取得當前 Sheets ID（建立完成後使用）
 */
function getSheetId() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const id = ss.getId();
  Logger.log('Sheets ID: ' + id);
  SpreadsheetApp.getUi().alert('📋 商家 Sheets ID\n\n' + id + '\n\n請複製此 ID：\n1. 填入總部「商家清單」\n2. 填入本 Sheets「商家資訊」的「總部Sheets ID」');
}

/**
 * 測試：讀取商家規則
 */
function testReadMerchantRules() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('商家規則');
  
  if (!sheet) {
    Logger.log('找不到「商家規則」分頁');
    return;
  }
  
  const data = sheet.getDataRange().getValues();
  Logger.log('商家規則：');
  
  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    if (!row[0]) continue;
    
    Logger.log(`規則ID: ${row[0]}`);
    Logger.log(`規則名稱: ${row[1]}`);
    Logger.log(`觸發條件: ${row[2]}`);
    Logger.log(`規則內容: ${row[3]}`);
    Logger.log(`優先級: ${row[4]}`);
    Logger.log(`啟用狀態: ${row[5]}`);
    Logger.log('---');
  }
}

/**
 * 測試：讀取店家資訊
 */
function testReadStoreInfo() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('店家資訊');
  
  if (!sheet) {
    Logger.log('找不到「店家資訊」分頁');
    return;
  }
  
  const storeId = 'STORE_001'; // 測試讀取土城店
  const data = sheet.getDataRange().getValues();
  const storeData = {};
  
  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    if (row[0] === storeId) {
      storeData[row[1]] = row[2];
    }
  }
  
  Logger.log('店家資訊（' + storeId + '）：');
  Logger.log(JSON.stringify(storeData, null, 2));
}
