/**
 * 疾病資料模組 — 根據長輩的健康狀況，影響整個平台的建議
 *
 * 每個 ConditionProfile 就像一個「濾鏡」，套在所有模組上：
 * - 財務報表加入疾病特有的額外費用
 * - 法律導航調整推薦優先級
 * - 復能任務篩選適合的任務類型
 * - 溝通模組提供疾病專屬情境
 */

export type ConditionId =
  | "dementia"
  | "stroke"
  | "cancer"
  | "diabetes"
  | "parkinson"
  | "kidney"
  | "fracture"
  | "other";

export type Trajectory = "slow-decline" | "episodic" | "sudden" | "terminal";

export interface AdditionalCost {
  label: string;
  monthlyEstimate: number;
  note: string;
}

export interface TimelinePhase {
  phase: string;
  cmsRange: [number, number];
  durationHint: string;
  keyActions: string[];
  warning: string;
}

export interface ConditionProfile {
  id: ConditionId;
  name: string;
  icon: string;
  trajectory: Trajectory;
  avgDurationYears: [number, number];
  description: string;
  financialNote: string;
  additionalCosts: AdditionalCost[];
  timeline: TimelinePhase[];
  dietaryFlags: string[];
  reablementFocus: string[];
  communicationTips: string[];
  priorityLegalDocs: string[];
  warningSignsForFacility: string[];
}

export const CONDITION_PROFILES: Record<ConditionId, ConditionProfile> = {
  dementia: {
    id: "dementia",
    name: "失智症",
    icon: "🧠",
    trajectory: "slow-decline",
    avgDurationYears: [5, 12],
    description: "認知功能逐漸退化，從健忘到無法自理，病程通常緩慢但不可逆。",
    financialNote: "病程長，照顧費用累積極高。中後期可能需要 24 小時看護或機構照顧。",
    additionalCosts: [
      { label: "失智日照中心（超出長照額度部分）", monthlyEstimate: 3000, note: "有認知刺激活動的日照收費較高" },
      { label: "防走失裝置（GPS 手環）", monthlyEstimate: 300, note: "月租型 GPS 追蹤器" },
      { label: "居家安全改造", monthlyEstimate: 500, note: "門鎖、瓦斯安全裝置等，月攤費用" },
    ],
    timeline: [
      {
        phase: "早期（輕度）",
        cmsRange: [2, 3],
        durationHint: "約 2-4 年",
        keyActions: [
          "盡早確診並取得身心障礙證明",
          "辦理意定監護（趁長輩還能表達意願）",
          "討論財產信託安排",
          "開始使用日照中心或失智據點",
        ],
        warning: "這是辦理法律文件的最後窗口，千萬不要拖！",
      },
      {
        phase: "中期（中度）",
        cmsRange: [4, 5],
        durationHint: "約 2-4 年",
        keyActions: [
          "評估是否需要全天候照顧",
          "考慮聘請外籍看護或入住機構",
          "注意吞嚥功能變化，調整飲食",
          "申請喘息服務，照顧者自己也要休息",
        ],
        warning: "照顧者燃盡風險最高的階段，務必善用喘息服務。",
      },
      {
        phase: "後期（重度）",
        cmsRange: [6, 8],
        durationHint: "約 1-4 年",
        keyActions: [
          "學習臥床照顧技巧",
          "評估管灌餵食需求",
          "準備預立醫療決定（若尚未簽署）",
          "家屬心理支持與悲傷輔導",
        ],
        warning: "此階段長輩可能已無法辨認家人，家屬的情緒支持非常重要。",
      },
    ],
    dietaryFlags: ["吞嚥困難（需軟食/泥狀餐）", "忘記吃飯或重複吃", "不認得食物"],
    reablementFocus: ["認知刺激", "社交互動", "簡單日常任務"],
    communicationTips: [
      "不要否認或爭辯，順著長輩的世界回應",
      "用簡短、明確的句子溝通",
      "避免問「你記不記得？」",
      "用觸摸和眼神接觸建立連結",
    ],
    priorityLegalDocs: ["trust-guardianship", "disability-cert", "advance-directive"],
    warningSignsForFacility: [
      "長輩有新的瘀青或無法解釋的傷口",
      "長輩情緒突然改變（更退縮或更躁動）",
      "護理師無法說出長輩的日常狀況",
      "失智專區是否有足夠的活動空間",
    ],
  },

  stroke: {
    id: "stroke",
    name: "中風",
    icon: "🫀",
    trajectory: "sudden",
    avgDurationYears: [3, 10],
    description: "突發性腦部血管病變，造成肢體癱瘓或語言障礙，前 6 個月是復健黃金期。",
    financialNote: "初期復健費用高，穩定後費用降低。復健期的密集投入會決定長期恢復程度。",
    additionalCosts: [
      { label: "自費復健（物理/職能治療）", monthlyEstimate: 8000, note: "健保有次數限制，超出需自費" },
      { label: "輔具（輪椅、拐杖、AFO）", monthlyEstimate: 800, note: "月攤費用，部分可申請補助" },
      { label: "居家無障礙改造", monthlyEstimate: 600, note: "斜坡、扶手、加寬門框等，月攤" },
    ],
    timeline: [
      {
        phase: "急性期",
        cmsRange: [5, 8],
        durationHint: "住院 1-4 週",
        keyActions: [
          "盡快轉入復健病房",
          "申請重大傷病卡",
          "評估長照需求，撥打 1966",
          "家屬學習基礎照顧技巧",
        ],
        warning: "出院前就要開始申請長照服務，不要等到回家才手忙腳亂！",
      },
      {
        phase: "復健黃金期",
        cmsRange: [3, 6],
        durationHint: "前 6 個月",
        keyActions: [
          "密集復健（物理、職能、語言治療）",
          "申請居家復能服務",
          "改造居家環境（無障礙）",
          "評估輔具需求",
        ],
        warning: "前 6 個月的復健投入決定了長期恢復程度，這筆錢不能省！",
      },
      {
        phase: "穩定期",
        cmsRange: [2, 5],
        durationHint: "長期",
        keyActions: [
          "維持復健，預防二次中風",
          "慢性病管理（血壓、血糖）",
          "社區活動參與",
          "定期回診追蹤",
        ],
        warning: "二次中風風險高，務必遵從醫囑服藥控制三高。",
      },
    ],
    dietaryFlags: ["低鈉低油飲食", "吞嚥困難（需增稠劑）", "單手進食輔助"],
    reablementFocus: ["肢體復健", "日常自理能力", "平衡訓練"],
    communicationTips: [
      "語言障礙的長輩需要更多耐心等待回應",
      "可用圖卡或手勢輔助溝通",
      "避免代替長輩把話說完",
      "鼓勵每一個小進步",
    ],
    priorityLegalDocs: ["disability-cert", "advance-directive"],
    warningSignsForFacility: [
      "是否有完善的復健設備和治療師",
      "肢體關節是否有攣縮跡象",
      "翻身頻率是否足夠（預防壓瘡）",
      "餵食方式是否安全（防嗆咳）",
    ],
  },

  cancer: {
    id: "cancer",
    name: "癌症",
    icon: "🎗️",
    trajectory: "episodic",
    avgDurationYears: [1, 5],
    description: "病程起伏大，治療期→穩定期→可能復發。照顧負擔隨治療階段波動。",
    financialNote: "治療費（尤其標靶/免疫）+ 照顧費雙軌並行，財務壓力最大。重大傷病卡可大幅減輕負擔。",
    additionalCosts: [
      { label: "自費標靶/免疫藥物", monthlyEstimate: 40000, note: "因藥物和癌別差異極大，此為中位數估算" },
      { label: "營養補充品", monthlyEstimate: 3000, note: "癌症專用營養品、麩醯胺酸等" },
      { label: "交通費（頻繁回診）", monthlyEstimate: 2000, note: "化療期間每週需回診" },
    ],
    timeline: [
      {
        phase: "治療期",
        cmsRange: [3, 7],
        durationHint: "依治療計畫而定",
        keyActions: [
          "申請重大傷病卡（免部分負擔）",
          "確認商業保險理賠條件",
          "申請長照服務（化療期間體力差）",
          "營養管理（維持體重和免疫力）",
        ],
        warning: "重大傷病卡是最重要的一步，可省下大量醫療費！",
      },
      {
        phase: "穩定/追蹤期",
        cmsRange: [1, 3],
        durationHint: "數月至數年",
        keyActions: [
          "定期追蹤檢查",
          "恢復日常活動",
          "心理調適支持",
          "營養與體力恢復",
        ],
        warning: "穩定期也需要定期追蹤，不可大意。",
      },
      {
        phase: "安寧緩和期",
        cmsRange: [5, 8],
        durationHint: "依個人狀況",
        keyActions: [
          "討論是否啟動安寧緩和照護",
          "簽署預立醫療決定 (AD)",
          "居家安寧或安寧病房選擇",
          "家屬心理支持與悲傷輔導",
        ],
        warning: "安寧不是放棄，是讓最後的日子有品質、有尊嚴。",
      },
    ],
    dietaryFlags: ["化療後食慾不振", "口腔黏膜受損（需軟食）", "特殊營養需求"],
    reablementFocus: ["體力維持", "疼痛管理", "心理支持"],
    communicationTips: [
      "不要迴避談論病情，但尊重長輩的節奏",
      "避免過度樂觀的空話（「一定會好」）",
      "傾聽比建議更重要",
      "陪伴就是最好的支持",
    ],
    priorityLegalDocs: ["advance-directive", "disability-cert"],
    warningSignsForFacility: [
      "疼痛控制是否到位",
      "安寧照護團隊是否完整",
      "情緒和心靈支持是否有提供",
      "家屬探訪時間是否彈性",
    ],
  },

  diabetes: {
    id: "diabetes",
    name: "糖尿病",
    icon: "💉",
    trajectory: "slow-decline",
    avgDurationYears: [5, 20],
    description: "慢性代謝疾病，控制不佳會導致腎病變、視網膜病變、截肢等嚴重併發症。",
    financialNote: "初期費用不高，但併發症一旦出現，醫療和照顧費用會急劇上升。",
    additionalCosts: [
      { label: "血糖監測耗材（試紙、針頭）", monthlyEstimate: 1500, note: "連續血糖監測器費用更高" },
      { label: "胰島素或口服藥自費部分", monthlyEstimate: 500, note: "健保有給付，自費部分不多" },
      { label: "特殊飲食/營養諮詢", monthlyEstimate: 1000, note: "糖尿病專用配方或營養師諮詢" },
    ],
    timeline: [
      {
        phase: "控制期",
        cmsRange: [1, 2],
        durationHint: "持續",
        keyActions: [
          "定期回診追蹤 HbA1c",
          "飲食控制與運動",
          "學習血糖自我監測",
          "定期篩檢併發症（眼底、腎功能）",
        ],
        warning: "糖尿病本身不可怕，可怕的是併發症。定期追蹤是關鍵！",
      },
      {
        phase: "併發症出現期",
        cmsRange: [3, 6],
        durationHint: "依併發症類型",
        keyActions: [
          "密集管理併發症",
          "可能需要洗腎（腎病變）",
          "視力退化照護",
          "足部護理（預防截肢）",
        ],
        warning: "腎病變需洗腎後，每週 3 次、每次 4 小時，照顧負擔劇增。",
      },
    ],
    dietaryFlags: ["嚴格控醣", "低 GI 飲食", "腎病變需限制蛋白質和鉀", "足量水分"],
    reablementFocus: ["血糖自我管理", "足部運動", "飲食控制"],
    communicationTips: [
      "不要責怪長輩「偷吃」，理解控醣的困難",
      "用正向鼓勵取代限制命令",
      "一起吃飯時全家配合健康飲食",
    ],
    priorityLegalDocs: ["disability-cert"],
    warningSignsForFacility: [
      "餐點是否符合糖尿病飲食要求",
      "是否有定時測血糖的紀錄",
      "足部護理是否到位",
      "胰島素注射是否按時",
    ],
  },

  parkinson: {
    id: "parkinson",
    name: "帕金森氏症",
    icon: "🤲",
    trajectory: "slow-decline",
    avgDurationYears: [5, 15],
    description: "神經退化疾病，從手抖、動作遲緩開始，逐漸影響行走和日常自理。",
    financialNote: "藥物費用穩定，但跌倒風險極高，住院和骨折手術是最大的隱形支出。",
    additionalCosts: [
      { label: "自費藥物（左旋多巴補充）", monthlyEstimate: 1500, note: "部分新藥需自費" },
      { label: "防跌改造和輔具", monthlyEstimate: 800, note: "防滑地板、扶手、助行器等月攤" },
      { label: "物理/職能治療（超出健保部分）", monthlyEstimate: 3000, note: "維持活動能力的關鍵投資" },
    ],
    timeline: [
      {
        phase: "早期",
        cmsRange: [1, 3],
        durationHint: "約 3-5 年",
        keyActions: [
          "規律服藥，不可自行調整劑量",
          "開始物理治療（維持活動能力）",
          "居家防跌改造",
          "參加帕金森病友團體",
        ],
        warning: "帕金森的藥物需精準控制時間和劑量，看護務必了解用藥時程！",
      },
      {
        phase: "中後期",
        cmsRange: [4, 7],
        durationHint: "約 3-8 年",
        keyActions: [
          "防跌是最重要的事（骨折=急速退化）",
          "吞嚥評估（帕金森後期常有吞嚥困難）",
          "情緒管理（憂鬱是常見共病）",
          "評估全天候照顧需求",
        ],
        warning: "一次跌倒骨折可能讓帕金森患者直接臥床，防跌永遠是第一優先。",
      },
    ],
    dietaryFlags: ["高纖飲食（便秘是常見問題）", "服藥前後避免高蛋白（影響藥效）", "進食速度慢需耐心"],
    reablementFocus: ["步態訓練", "平衡訓練", "精細動作練習", "吞嚥訓練"],
    communicationTips: [
      "說話可能變小聲或含糊，耐心傾聽",
      "等待長輩表達完再回應",
      "面部表情可能僵硬，不代表沒有情緒",
    ],
    priorityLegalDocs: ["disability-cert", "advance-directive"],
    warningSignsForFacility: [
      "用藥時間是否精確（帕金森藥物對時間極度敏感）",
      "環境是否有完善的防跌措施",
      "是否有足夠的復健活動",
      "便秘問題是否被妥善處理",
    ],
  },

  kidney: {
    id: "kidney",
    name: "腎臟病/洗腎",
    icon: "🫘",
    trajectory: "slow-decline",
    avgDurationYears: [5, 15],
    description: "慢性腎病變導致需要定期洗腎（血液透析或腹膜透析），每週 3 次往返醫院。",
    financialNote: "洗腎本身健保全額給付（重大傷病），但交通費和體力消耗是最大隱形成本。",
    additionalCosts: [
      { label: "洗腎日交通費", monthlyEstimate: 3000, note: "每週 3 次，來回計程車或交通接送" },
      { label: "特殊飲食（低磷低鉀低鈉）", monthlyEstimate: 2000, note: "飲食限制多，食材和調理成本較高" },
      { label: "營養補充品（洗腎專用）", monthlyEstimate: 1500, note: "洗腎會流失蛋白質和水溶性維生素" },
    ],
    timeline: [
      {
        phase: "洗腎初期",
        cmsRange: [3, 5],
        durationHint: "適應期約 1-3 個月",
        keyActions: [
          "申請重大傷病卡",
          "選擇洗腎方式（血透或腹透）",
          "安排每週 3 次的接送",
          "學習飲食限制",
        ],
        warning: "重大傷病卡讓洗腎費用幾乎全免，務必第一時間申請！",
      },
      {
        phase: "長期洗腎",
        cmsRange: [3, 6],
        durationHint: "長期",
        keyActions: [
          "維持洗腎品質，定期抽血追蹤",
          "管控水分攝取",
          "瘻管/導管照護",
          "預防感染",
        ],
        warning: "洗腎日體力消耗大，非洗腎日的日常照顧也不能忽略。",
      },
    ],
    dietaryFlags: ["限磷（避免乳製品、堅果）", "限鉀（避免香蕉、番茄）", "限水", "適量高品質蛋白"],
    reablementFocus: ["體力維持", "非洗腎日活動", "血管通路照護"],
    communicationTips: [
      "洗腎後長輩可能很疲倦，不要在這時候要求太多",
      "理解飲食限制帶來的挫折感",
      "鼓勵非洗腎日的社交活動",
    ],
    priorityLegalDocs: ["disability-cert", "advance-directive"],
    warningSignsForFacility: [
      "洗腎接送是否準時可靠",
      "餐點是否符合腎臟病飲食限制",
      "瘻管/導管照護是否妥當",
      "體重和水分攝取是否有記錄",
    ],
  },

  fracture: {
    id: "fracture",
    name: "骨折/關節退化",
    icon: "🦴",
    trajectory: "sudden",
    avgDurationYears: [1, 5],
    description: "跌倒導致髖關節骨折，或嚴重膝關節退化需置換手術，術後復健決定恢復品質。",
    financialNote: "手術費健保給付，但術後復健和居家照顧是主要支出。復健期通常 3-6 個月。",
    additionalCosts: [
      { label: "術後居家照顧（短期）", monthlyEstimate: 5000, note: "出院後 1-3 個月最需要密集照顧" },
      { label: "復健（物理治療）", monthlyEstimate: 4000, note: "超出健保給付的自費復健" },
      { label: "輔具（助行器、輪椅）", monthlyEstimate: 500, note: "月攤費用，部分可申請補助" },
    ],
    timeline: [
      {
        phase: "術後急性期",
        cmsRange: [4, 7],
        durationHint: "1-4 週",
        keyActions: [
          "出院前申請長照服務",
          "準備居家無障礙環境",
          "安排密集復健計畫",
          "學習傷口和引流管照護",
        ],
        warning: "骨折後 48 小時內未開始活動，臥床併發症風險大增！",
      },
      {
        phase: "復健期",
        cmsRange: [2, 5],
        durationHint: "3-6 個月",
        keyActions: [
          "堅持每日復健",
          "漸進式恢復行走",
          "強化肌力預防再次跌倒",
          "骨質疏鬆治療（預防再骨折）",
        ],
        warning: "復健很痛苦，但放棄復健 = 永久失能。家屬的鼓勵是最大動力。",
      },
    ],
    dietaryFlags: ["高鈣飲食", "補充維生素 D", "足量蛋白質（肌肉恢復）"],
    reablementFocus: ["站立訓練", "步行訓練", "肌力訓練", "平衡訓練"],
    communicationTips: [
      "復健很痛，不要說「忍一忍就好了」",
      "慶祝每一個小里程碑",
      "理解長輩對再次跌倒的恐懼",
    ],
    priorityLegalDocs: ["disability-cert"],
    warningSignsForFacility: [
      "復健設備和治療師是否充足",
      "翻身頻率是否足夠（預防壓瘡）",
      "下床活動的安排是否積極",
      "環境是否有防跌措施",
    ],
  },

  other: {
    id: "other",
    name: "其他/一般失能",
    icon: "🏥",
    trajectory: "slow-decline",
    avgDurationYears: [3, 10],
    description: "因老化或其他原因導致的功能退化，需要不同程度的日常生活協助。",
    financialNote: "費用取決於照顧需求等級，善用長照服務可有效控制支出。",
    additionalCosts: [],
    timeline: [
      {
        phase: "目前狀態",
        cmsRange: [1, 8],
        durationHint: "依個人狀況",
        keyActions: [
          "申請長照服務評估",
          "了解可用的照顧資源",
          "評估居家環境安全性",
          "建立照顧支持網絡",
        ],
        warning: "越早開始使用長照服務，退化速度越慢。",
      },
    ],
    dietaryFlags: ["均衡飲食", "足量蛋白質", "充足水分"],
    reablementFocus: ["日常生活能力", "社交活動", "體能維持"],
    communicationTips: [
      "尊重長輩的自主權",
      "用鼓勵而非命令的方式",
      "讓長輩參與決策",
    ],
    priorityLegalDocs: ["disability-cert"],
    warningSignsForFacility: [
      "整體清潔和氛圍",
      "護理人員態度是否友善",
      "活動安排是否多元",
      "餐點品質和選擇",
    ],
  },
};

export const CONDITION_OPTIONS = Object.values(CONDITION_PROFILES).filter(
  (c) => c.id !== "other"
);

/**
 * 根據選擇的疾病，取得額外月費用估算
 */
export function getAdditionalMonthlyCost(conditionIds: ConditionId[]): number {
  return conditionIds.reduce((total, id) => {
    const profile = CONDITION_PROFILES[id];
    if (!profile) return total;
    return total + profile.additionalCosts.reduce((s, c) => s + c.monthlyEstimate, 0);
  }, 0);
}

/**
 * 根據疾病組合，取得合併的飲食注意事項
 */
export function getCombinedDietaryFlags(conditionIds: ConditionId[]): string[] {
  const flags = new Set<string>();
  conditionIds.forEach((id) => {
    const profile = CONDITION_PROFILES[id];
    if (profile) profile.dietaryFlags.forEach((f) => flags.add(f));
  });
  return Array.from(flags);
}

/**
 * 根據疾病組合，取得優先法律文件（去重、按優先級排序）
 */
export function getPriorityLegalDocs(conditionIds: ConditionId[]): string[] {
  const docs: string[] = [];
  const seen = new Set<string>();
  conditionIds.forEach((id) => {
    const profile = CONDITION_PROFILES[id];
    if (profile) {
      profile.priorityLegalDocs.forEach((d) => {
        if (!seen.has(d)) {
          seen.add(d);
          docs.push(d);
        }
      });
    }
  });
  return docs;
}
