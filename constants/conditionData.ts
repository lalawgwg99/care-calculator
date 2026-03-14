export interface ConditionProfile {
  id: string;
  icon: string;
  name: string;
  englishName: string;
  color: string;
  bgColor: string;
  prevalence: string;
  description: string;
  cmsProgression: {
    early: { range: string; description: string };
    moderate: { range: string; description: string };
    advanced: { range: string; description: string };
  };
  specialNeeds: string[];
  recommendedServices: string[];
  caregiverTips: string[];
  redFlags: string[];
}

export const CONDITION_PROFILES: ConditionProfile[] = [
  {
    id: "dementia",
    icon: "🧠",
    name: "失智症",
    englishName: "Dementia",
    color: "text-purple-700",
    bgColor: "bg-purple-50 border-purple-100",
    prevalence: "65 歲以上約 8%，80 歲以上約 20%",
    description: "失智症是一種進行性腦部疾病，影響記憶、思維、行為和日常功能。最常見類型為阿茲海默症（佔 60~70%）。",
    cmsProgression: {
      early: { range: "CMS 2~3", description: "輕度認知障礙，日常生活仍可部分自理，需提醒服藥、協助理財" },
      moderate: { range: "CMS 4~5", description: "中度失智，需要持續陪伴，可能出現遊走行為，個人衛生需協助" },
      advanced: { range: "CMS 6~8", description: "重度失智，幾乎全依賴照顧，可能喪失語言能力，需全面生活協助" },
    },
    specialNeeds: [
      "安全環境改造（防遊走門鎖、危險物品收納）",
      "結構化日常作息（降低焦慮）",
      "音樂治療、懷舊治療等非藥物療法",
      "照顧者心理支持（倦怠風險高）",
    ],
    recommendedServices: ["居家服務（協助ADL）", "日間照顧中心（社交刺激）", "喘息服務", "失智症日間照顧專區"],
    caregiverTips: [
      "以簡單、溫和的語氣溝通，避免爭論錯誤記憶",
      "保持規律作息，有助穩定情緒",
      "適時利用喘息服務照顧自己",
    ],
    redFlags: ["突然意識混亂", "攻擊行為", "吞嚥困難", "長時間不認識家人"],
  },
  {
    id: "stroke",
    icon: "💉",
    name: "中風",
    englishName: "Stroke",
    color: "text-red-700",
    bgColor: "bg-red-50 border-red-100",
    prevalence: "台灣每年約 3 萬人新發中風，是失能主要原因之一",
    description: "中風（腦血管疾病）因腦部血流中斷或出血導致腦細胞受損，依影響部位不同，可造成肢體偏癱、語言障礙、認知障礙等。",
    cmsProgression: {
      early: { range: "CMS 2~3", description: "輕度功能障礙，單側肢體無力，需復健，可行走但需輔助" },
      moderate: { range: "CMS 4~5", description: "中度障礙，移位需協助，語言表達困難，日常生活需部分依賴" },
      advanced: { range: "CMS 6~8", description: "嚴重偏癱或昏迷，全依賴照顧，需鼻胃管或氣切管理" },
    },
    specialNeeds: [
      "積極復健（物理治療、職能治療、語言治療）",
      "吞嚥評估與訓練（預防吸入性肺炎）",
      "居家無障礙環境改造",
      "預防再中風（血壓、血糖控制）",
    ],
    recommendedServices: ["復健治療（物理/職能/語言）", "居家護理", "輔具申請（電動輪椅、移位機）", "日間照顧"],
    caregiverTips: [
      "黃金復健期為中風後 6 個月，應積極安排復健",
      "學習正確的移位與翻身技巧，保護長輩與自己",
      "定期回診追蹤，調整藥物避免再中風",
    ],
    redFlags: ["突然再次出現口眼歪斜", "意識改變", "吞嚥嗆咳頻繁", "傷口感染"],
  },
  {
    id: "parkinsons",
    icon: "🤝",
    name: "帕金森氏症",
    englishName: "Parkinson's Disease",
    color: "text-orange-700",
    bgColor: "bg-orange-50 border-orange-100",
    prevalence: "60 歲以上約 1%，台灣約有 7~8 萬名患者",
    description: "帕金森氏症是一種進行性神經退化疾病，主要影響動作控制，特徵包括手抖、僵硬、動作遲緩及平衡障礙。",
    cmsProgression: {
      early: { range: "CMS 2~3", description: "輕微顫抖與動作緩慢，日常生活大致自理，服藥效果良好" },
      moderate: { range: "CMS 4~5", description: "走路不穩易跌倒，需要協助穿衣、沐浴，開關期波動明顯" },
      advanced: { range: "CMS 6~8", description: "嚴重運動障礙，可能需要輪椅或臥床，吞嚥功能受影響" },
    },
    specialNeeds: [
      "防跌措施（居家環境改造、使用助行器）",
      "規律服藥管理（開關期現象）",
      "語言治療（音量變小）",
      "便秘管理（自律神經失調）",
    ],
    recommendedServices: ["居家服務", "物理治療（步態訓練）", "職能治療（精細動作）", "語言治療"],
    caregiverTips: [
      "準時給藥是關鍵，開關期時避免安排複雜活動",
      "鼓勵參與太極拳或舞蹈等運動改善平衡",
      "觀察跌倒高風險時段（通常為關期）",
    ],
    redFlags: ["突然跌倒次數增加", "嗆咳頻繁", "意識混亂（可能是藥物副作用）", "嚴重便秘超過 3 天"],
  },
  {
    id: "fracture",
    icon: "🦴",
    name: "骨折 / 跌倒後遺症",
    englishName: "Fracture / Fall Injury",
    color: "text-teal-700",
    bgColor: "bg-teal-50 border-teal-100",
    prevalence: "65 歲以上每年約 30% 發生跌倒，髖關節骨折一年內死亡率約 20%",
    description: "老年骨折（尤其是髖關節和脊椎骨折）常造成長期臥床，是造成失能的重要原因，也容易引發憂鬱與認知退化。",
    cmsProgression: {
      early: { range: "CMS 2~3", description: "術後恢復期，可輔助行走，需物理治療，心理適應調整期" },
      moderate: { range: "CMS 4~5", description: "行動能力下降，需要輔具（助行器/輪椅），日常生活需協助" },
      advanced: { range: "CMS 6~8", description: "長期臥床，皮膚照顧（預防褥瘡）、尿道照顧需求高" },
    },
    specialNeeds: [
      "術後積極復健（物理治療）",
      "骨質疏鬆治療（預防再骨折）",
      "居家防跌改造（扶手、防滑墊、移除障礙物）",
      "心理支持（術後憂鬱常見）",
    ],
    recommendedServices: ["物理治療（步態與肌力訓練）", "職能治療（日常活動訓練）", "輔具申請", "居家護理（換藥）"],
    caregiverTips: [
      "骨折後第一年是跌倒再發風險最高的時期，環境改造不可拖延",
      "鈣質與維生素D補充有助於骨密度恢復",
      "鼓勵長輩克服跌倒恐懼，漸進式恢復活動",
    ],
    redFlags: ["傷口紅腫熱痛（感染徵象）", "手術部位突然劇痛", "長期臥床出現紅斑（褥瘡前兆）", "深部靜脈血栓症狀（腿部腫脹）"],
  },
];

export interface TimelineStage {
  stage: string;
  cmsRange: string;
  duration: string;
  monthlyCost: { low: number; high: number };
  keyNeeds: string[];
  color: string;
}

export const CARE_TIMELINE: TimelineStage[] = [
  {
    stage: "早期照顧",
    cmsRange: "CMS 2~3",
    duration: "數月至數年",
    monthlyCost: { low: 5000, high: 18000 },
    keyNeeds: ["定期評估", "輕度居家服務", "輔具申請", "家人教育訓練"],
    color: "bg-emerald-100 border-emerald-300 text-emerald-800",
  },
  {
    stage: "中期照顧",
    cmsRange: "CMS 4~5",
    duration: "1~5 年",
    monthlyCost: { low: 18000, high: 40000 },
    keyNeeds: ["全日/半日照顧安排", "交通接送服務", "醫療照護整合", "喘息服務規劃"],
    color: "bg-amber-100 border-amber-300 text-amber-800",
  },
  {
    stage: "晚期照顧",
    cmsRange: "CMS 6~8",
    duration: "數月至數年",
    monthlyCost: { low: 40000, high: 100000 },
    keyNeeds: ["24小時照顧需求", "住宿式機構評估", "安寧療護討論", "家人身心支持"],
    color: "bg-rose-100 border-rose-300 text-rose-800",
  },
];

export interface ChecklistCategory {
  category: string;
  icon: string;
  items: string[];
}

export const FACILITY_CHECKLIST: ChecklistCategory[] = [
  {
    category: "安全環境",
    icon: "🔒",
    items: [
      "走廊與浴室設有防滑地板與扶手",
      "有緊急呼叫系統",
      "出入口設有門禁管控",
      "消防設備齊全（灑水器、滅火器）",
      "夜間有足夠照明",
    ],
  },
  {
    category: "醫療照護",
    icon: "🏥",
    items: [
      "有護理師 24 小時駐場",
      "定期有醫師巡診（頻率）",
      "備有基本醫療設備（血壓計、血氧機）",
      "急救流程清楚（就醫轉介機制）",
      "藥物管理制度完善",
    ],
  },
  {
    category: "生活品質",
    icon: "🌿",
    items: [
      "房間整潔、通風、採光良好",
      "有多元活動（音樂、手工藝、體能）",
      "伙食多樣、營養均衡，可客製化",
      "有戶外空間或散步場所",
      "尊重個人隱私與生活習慣",
    ],
  },
  {
    category: "費用透明",
    icon: "💰",
    items: [
      "月費項目明確列示（含額外費用）",
      "有書面合約，退費條款清楚",
      "說明政府補助如何計算",
      "費用調漲有事先通知機制",
      "沒有不合理的押金要求",
    ],
  },
  {
    category: "家屬溝通",
    icon: "👨‍👩‍👧",
    items: [
      "定期提供長輩健康狀況報告",
      "家屬可自由探訪（了解限制條件）",
      "有申訴管道與服務改善機制",
      "工作人員態度親切、有耐心",
      "歡迎事先參觀，可與現住長輩或家屬交流",
    ],
  },
];
