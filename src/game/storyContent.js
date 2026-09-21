export const introPages = [
  {
    eyebrow: '案件檔案／M-240916',
    title: '失蹤人口案件',
    type: 'case',
    fields: [
      ['姓名', '林以晴'],
      ['英文姓名', 'LIN YI QING'],
      ['出生日期', '1996 年 09 月 16 日'],
      ['職業', '景隆銀行客戶服務品質部職員'],
      ['失蹤時間', '14 日前'],
      ['最後聯絡人', '林以澄'],
      ['關係', '妹妹'],
      ['案件狀態', '尚未尋回'],
    ],
  },
  {
    eyebrow: '當事人敘述／01',
    title: '我叫林以澄。',
    type: 'statement',
    paragraphs: [
      '兩星期前，我的姐姐林以晴失蹤了。',
      '她沒有請假，也沒有帶走護照。手機在失蹤當晚關機，銀行戶口從那天起再沒有活動。警方查過醫院、出境紀錄和她經常出入的地方，但仍然沒有找到她。',
      '我是她的妹妹，也是最後一個和她通過電話的人。',
    ],
  },
  {
    eyebrow: '通訊記錄／最後聯絡',
    title: '最後訊息',
    type: 'messages',
    messages: [
      { sender: '林以晴', time: '14 日前　22:16', body: '最近工作有點亂。過幾天再跟你說。' },
      { sender: '林以澄', time: '22:18', body: '好。你回到家告訴我。', outgoing: true, unread: true },
    ],
  },
  {
    eyebrow: '新發現／私人住所',
    title: '舊電腦',
    type: 'laptop',
    paragraphs: [
      '今天，我到姐姐的住所整理警方沒有帶走的私人用品。在一個舊收納箱裏，我找到了一台她已經多年沒有使用的手提電腦。',
      '我把電源接上。',
      '它仍然可以開機。',
    ],
  },
]

export const historyItems = [
  { time: '19:58', title: '景隆銀行｜客服回應品質指引', url: 'intranet.jinglung.internal/quality-guide' },
  { time: '18:26', title: '景隆銀行｜員工文件中心', url: 'staff.jinglung.internal/documents' },
  { time: '19:12', title: '本地新聞｜晚間簡報', url: 'daily-news.local/evening' },
  { time: '17:36', title: '景隆銀行｜服務常見問題', url: 'jinglung.com.hk/support' },
  { time: '20:41', title: 'MIRA 客服系統｜內部驗收版本', subtitle: '僅供景隆銀行指定職員測試', url: 'mira-uat.jinglung.internal', important: true },
]

export const desktopItems = [
  { id: 'documents', label: '文件', glyph: 'doc' },
  { id: 'photos', label: '相片', glyph: 'photo' },
  { id: 'backup', label: '備份', glyph: 'backup' },
  { id: 'recycle', label: '回收筒', glyph: 'bin' },
  { id: 'browser', label: 'Google Chrome', glyph: 'chrome', badge: '上次未正常關閉' },
  { id: 'notes', label: '調查筆記', glyph: 'note' },
  { id: 'computer', label: '此電腦', glyph: 'computer' },
]

export const windowCopy = {
  documents: { title: '文件', emptyTitle: '3 個項目', rows: [['排班表_舊版', '試算表', '2022/11/08'], ['客服用語備忘', '文字文件', '2023/02/17'], ['家居保險', 'PDF 文件', '2021/06/02']] },
  photos: { title: '相片', emptyTitle: '2 個項目', rows: [['IMG_1842', '相片', '2021/09/16'], ['receipt_old', '相片', '2022/01/12']] },
  backup: { title: '備份', emptyTitle: '這個位置沒有可用的備份', rows: [] },
  recycle: { title: '回收筒', emptyTitle: '回收筒是空的', rows: [] },
}

// 所有遊戲內 Chrome 分頁名稱集中在這裏，方便之後逐一命名及修改。
export const browserTabNames = {
  blank: '新分頁',
  history: '瀏覽紀錄',
  mira: 'MIRA 客服系統｜內部驗收版本',
  'system-intro': 'MIRA｜系統介紹',
  'test-detail': 'MIRA-QA-E017｜異常記錄',
  restoring: '正在恢復 MIRA-QA-E017',
  search: 'MIRA｜搜尋資料',
  demo: 'MIRA｜正常回應示範',
  'member-profile': '林以晴｜項目成員資料',
  'recent-test': '最近測試記錄｜林以晴',
  'role-document': 'MIRA 項目分工',
  'access-notice': '權限變更通知',
  'modified-files': '最近修改的文件',
  'other-records': '其他相關記錄',
  'e017-record': 'E017 回應評分記錄',
}
