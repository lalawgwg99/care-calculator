export interface DialogOption {
  text: string;
  stressDelta: number; // negative = good, positive = bad
  reaction: string;
  expertNote: string;
  technique: string;
}

export interface Scenario {
  id: string;
  category: string;
  elderName: string;
  elderAge: number;
  context: string;
  elderSays: string;
  options: [DialogOption, DialogOption, DialogOption];
  difficulty: 1 | 2 | 3;
}

export const SCENARIOS: Scenario[] = [
  {
    id: "stolen-passbook",
    category: "被害妄想",
    elderName: "媽媽",
    elderAge: 78,
    context: "媽媽翻了半天的抽屜，突然轉頭指著你，滿臉憤怒。",
    elderSays: "你把我的存摺偷走了！我要報警！",
    difficulty: 1,
    options: [
      {
        text: "媽，沒有人偷！你自己忘記放哪裡了啦！",
        stressDelta: 3,
        reaction: "媽媽更激動了：「你還敢說沒有！一定是你！」聲音越來越大，拍桌子。",
        expertNote: "否認和反駁會加劇失智長輩的焦慮。他們的「被偷」感受是真實的，只是對現實的解讀出了問題。正面衝突只會讓雙方都更痛苦。",
        technique: "❌ 否認爭辯",
      },
      {
        text: "好擔心哦，那我們一起找找看好不好？",
        stressDelta: -2,
        reaction: "媽媽的怒氣稍微消了：「好…你幫我找找…」她跟著你一起翻找，過了一會兒就忘記在生氣了。",
        expertNote: "「同理回應 + 一起行動」是最佳策略。不否認她的感受，用行動轉移注意力。在找的過程中，長輩通常會漸漸忘記為什麼在找。",
        technique: "✅ 同理回應 + 轉移注意力",
      },
      {
        text: "存摺在我這裡保管，你放心啦。",
        stressDelta: 1,
        reaction: "媽媽懷疑地看著你：「為什麼在你那裡？你果然拿走了…」",
        expertNote: "雖然是實話，但對失智長輩來說「在你那裡」= 「被你拿走了」。這會確認她的妄想，讓情況更複雜。",
        technique: "⚠️ 不當確認",
      },
    ],
  },
  {
    id: "go-home",
    category: "時空混淆",
    elderName: "爸爸",
    elderAge: 82,
    context: "晚上 8 點，爸爸突然穿好鞋子站在門口，堅持要出門。",
    elderSays: "我要回家！這裡不是我家！快讓我走！",
    difficulty: 2,
    options: [
      {
        text: "爸，這就是你家啊！你看，你的照片都掛在牆上！",
        stressDelta: 2,
        reaction: "爸爸搖頭：「不是！我家不長這樣！我要回嘉義的老家！」他更焦躁，開始拉門把。",
        expertNote: "失智長輩說的「回家」不一定是地理上的家，而是「回到安心的地方」。用現實證據反駁，只會讓他覺得你不懂他。",
        technique: "❌ 現實導向（不適用於此情境）",
      },
      {
        text: "好，我們準備一下再走。你肚子餓不餓？要不要先吃點東西？",
        stressDelta: -2,
        reaction: "爸爸猶豫了一下：「嗯…好吧，吃完再走。」坐下吃東西後，漸漸忘記要出門的事。",
        expertNote: "先接受他的感受（「好」），再用日常需求轉移注意力。吃東西、喝茶、看照片都是很好的轉移方式。不需要刻意「糾正」他。",
        technique: "✅ 先接受再轉移",
      },
      {
        text: "現在太晚了不能出去，明天再說！",
        stressDelta: 2,
        reaction: "爸爸更焦急：「不行！我現在就要走！你不能關著我！」開始大聲吼叫。",
        expertNote: "直接拒絕會讓長輩覺得被限制自由，引發更大的情緒反應。尤其是「明天再說」在失智的世界裡沒有意義。",
        technique: "❌ 直接拒絕",
      },
    ],
  },
  {
    id: "dead-spouse",
    category: "時空混淆",
    elderName: "媽媽",
    elderAge: 85,
    context: "媽媽突然問起已經過世 3 年的爸爸。",
    elderSays: "你爸爸怎麼還沒回來？他去哪裡了？晚餐都涼了。",
    difficulty: 3,
    options: [
      {
        text: "媽，爸走了三年了，你忘記了嗎？",
        stressDelta: 3,
        reaction: "媽媽愣住了，然後開始哭：「什麼？他走了？」她彷彿重新經歷了喪夫之痛。",
        expertNote: "每次被告知「他已經走了」，失智長輩都像第一次聽到一樣心碎。你讓她一天「失去」丈夫很多次，這是最殘忍的做法——雖然你說的是事實。",
        technique: "❌ 殘酷的事實（避免使用）",
      },
      {
        text: "爸爸今天有事，晚一點才會到。先吃飯吧，不然菜涼了。",
        stressDelta: -2,
        reaction: "媽媽點點頭：「也是，他一向都很忙。先吃吧。」安心地坐下吃飯。",
        expertNote: "這是「善意的模糊回應」。不說謊、不否認、不傷害。爸爸「有事」是模糊的真實（在另一個世界有事），而且成功轉移到吃飯。有些家屬會覺得「這是欺騙」，但在失智照顧中，保護長輩的情緒比堅持事實更重要。",
        technique: "✅ 善意模糊 + 轉移注意力",
      },
      {
        text: "（沉默不語，假裝沒聽見）",
        stressDelta: 1,
        reaction: "媽媽更焦急：「你怎麼不說話？是不是出了什麼事？」開始不安地站起來走來走去。",
        expertNote: "沉默或迴避會讓長輩更焦慮。她需要一個回應，即使是模糊的回應也好過沒有回應。",
        technique: "⚠️ 迴避（不建議）",
      },
    ],
  },
  {
    id: "refuse-bath",
    category: "拒絕照顧",
    elderName: "爸爸",
    elderAge: 80,
    context: "爸爸已經三天沒洗澡了，身上開始有味道。你試著帶他去浴室。",
    elderSays: "我不要洗澡！我很乾淨！你不要碰我！",
    difficulty: 2,
    options: [
      {
        text: "爸，你已經三天沒洗了，身上有味道了，趕快去洗！",
        stressDelta: 3,
        reaction: "爸爸退後兩步，把門關上：「我說不洗就不洗！滾出去！」之後一整天都不理你。",
        expertNote: "指出「有味道」會讓長輩覺得被嫌棄、沒有尊嚴。失智長輩拒絕洗澡常見原因：怕冷、怕水、空間焦慮、不知道洗澡是什麼，或曾經有不好的洗澡經驗。",
        technique: "❌ 直指問題（傷害尊嚴）",
      },
      {
        text: "爸，你摸摸看這條新毛巾好軟喔！要不要試試看新的沐浴乳？香香的。",
        stressDelta: -1,
        reaction: "爸爸摸了摸毛巾：「嗯…這個還不錯。」被新東西吸引，跟著你走到浴室。",
        expertNote: "用「新東西」或「舒適感」引導，不提「洗澡」這個讓他抗拒的詞。讓觸覺和嗅覺引導他自然地走進浴室。",
        technique: "✅ 感官引導",
      },
      {
        text: "那我們先泡腳就好，不洗澡。暖暖的很舒服。",
        stressDelta: -2,
        reaction: "爸爸想了想：「泡腳…可以吧。」坐下泡腳後覺得很舒服，你趁機用毛巾幫他擦身體。",
        expertNote: "「先泡腳」降低了抗拒的門檻。從小範圍的身體接觸開始，讓他感到舒適後再慢慢擴大清潔範圍。這是專業照顧者最常用的技巧。",
        technique: "✅ 降低門檻 + 漸進式照顧",
      },
    ],
  },
  {
    id: "sundown-anxiety",
    category: "日落症候群",
    elderName: "媽媽",
    elderAge: 76,
    context: "每天傍晚 5 點左右，媽媽都會開始焦躁不安，在客廳來回走動。",
    elderSays: "不對…不對…有什麼事…我要做什麼…（不停搓手、來回踱步）",
    difficulty: 2,
    options: [
      {
        text: "媽，你坐下來休息一下！不要一直走來走去！",
        stressDelta: 2,
        reaction: "媽媽聽了更焦躁：「你不要管我！我就是覺得不對…」走動得更快了。",
        expertNote: "日落症候群不是長輩故意的，而是大腦退化導致傍晚時神經系統更混亂。要求她「坐下」就像要求一個焦慮發作的人「放輕鬆」一樣無效。",
        technique: "❌ 命令制止",
      },
      {
        text: "（打開燈，放柔和的音樂）媽，來，我們一起來摺毛巾。",
        stressDelta: -2,
        reaction: "燈光亮起後，媽媽看起來比較安定。坐下來摺毛巾，手有事做，焦慮慢慢緩解。",
        expertNote: "日落症候群的關鍵應對：1) 提前開燈（減少陰影造成的不安）2) 減少環境刺激 3) 給予有節奏的重複性活動（摺衣服、撥豆子），讓手有事做可安定情緒。",
        technique: "✅ 環境調整 + 有節奏的活動",
      },
      {
        text: "媽你怎麼了？要不要去看醫生？是不是哪裡不舒服？",
        stressDelta: 1,
        reaction: "媽媽搖頭：「我不知道…我也不知道怎麼了…」焦慮加上困惑，情緒更複雜了。",
        expertNote: "連續問問題會增加失智長輩的認知負擔。她已經很混亂了，被追問只會更慌。日落症候群通常不需要就醫，而是環境和活動的調整。",
        technique: "⚠️ 過度追問",
      },
    ],
  },
  {
    id: "repeated-question",
    category: "重複行為",
    elderName: "爸爸",
    elderAge: 79,
    context: "爸爸在過去一小時內，已經問了你 15 次同樣的問題。",
    elderSays: "今天星期幾？我們要去哪裡？（已經問了第 16 次）",
    difficulty: 1,
    options: [
      {
        text: "爸！我已經跟你說了十幾次了！今天星期三！你到底有沒有在聽！",
        stressDelta: 3,
        reaction: "爸爸低下頭，不說話了。但過了 3 分鐘又問：「今天星期幾？」只是這次聲音更小、更怯。",
        expertNote: "他不是「沒在聽」，是大腦真的記不住。你的怒氣他雖然記不住原因，但「被罵的恐懼感」會留在情緒記憶中。他會開始害怕跟你說話。",
        technique: "❌ 發怒責怪",
      },
      {
        text: "今天星期三。（用和第一次一樣的語氣回答）",
        stressDelta: -1,
        reaction: "爸爸點點頭：「哦…星期三。」過幾分鐘可能還會問，但目前安心了。",
        expertNote: "每一次對他來說都是「第一次問」。用平穩、一致的語氣回答，就像第一次回答一樣。這需要極大的耐心，但這是對他最好的方式。如果真的受不了，可以離開房間幾分鐘讓自己喘口氣。",
        technique: "✅ 耐心一致回應",
      },
      {
        text: "（在紙上大大地寫「今天星期三，在家休息」貼在他看得到的地方）",
        stressDelta: -2,
        reaction: "爸爸看到紙條：「哦，星期三啊。」接下來幾次他自己看紙條就不問了。",
        expertNote: "外部記憶輔助（白板、紙條、時鐘）非常有效。把關鍵資訊寫在長輩視線範圍內，可以大幅減少重複提問。這也減輕了照顧者的精神負擔。",
        technique: "✅ 外部記憶輔助",
      },
    ],
  },
  {
    id: "accuse-caregiver",
    category: "被害妄想",
    elderName: "奶奶",
    elderAge: 88,
    context: "外籍看護 Rina 哭著打電話給你，說奶奶又指控她偷東西。",
    elderSays: "那個外國人偷了我的金手鐲！你們為什麼找這種人來！把她趕走！",
    difficulty: 3,
    options: [
      {
        text: "奶奶，Rina 不會偷東西的，她照顧你很認真。是你自己忘記放哪了。",
        stressDelta: 2,
        reaction: "奶奶大怒：「你幫外人說話！你們都合起來欺負我！」把 Rina 做的晚餐推到地上。",
        expertNote: "在長輩面前「幫看護說話」會讓她覺得被孤立。妄想的對象通常是最親近的照顧者，因為她把所有的混亂都投射到身邊的人身上。",
        technique: "❌ 當面反駁",
      },
      {
        text: "奶奶，那個手鐲很重要對不對？我來幫你找。Rina 你先去廚房。",
        stressDelta: -2,
        reaction: "奶奶接受了：「對，很重要，是你爺爺送的…」你邊找邊聽她說故事，她漸漸平靜下來。",
        expertNote: "1) 先隔開當事人（讓 Rina 離開現場）2) 認同物品的重要性 3) 一起行動 4) 引導長輩說故事（喚起正面記憶）。記得私下安撫 Rina，跟她解釋這是疾病，不是她的錯。",
        technique: "✅ 隔離 + 同理 + 正面引導",
      },
      {
        text: "好，我打電話叫仲介換一個看護。",
        stressDelta: 2,
        reaction: "換了新看護後，奶奶在第三天又說：「這個新來的也偷我東西！」",
        expertNote: "換看護不會解決被害妄想。新看護來了一樣會被指控。頻繁更換反而讓長輩更焦慮（環境不穩定），也讓看護市場對你的家庭產生負面觀感。",
        technique: "❌ 逃避問題根源",
      },
    ],
  },
  {
    id: "night-wandering",
    category: "遊走",
    elderName: "爸爸",
    elderAge: 81,
    context: "凌晨 2 點，你發現爸爸穿好衣服站在家門口，手上拿著一個袋子。",
    elderSays: "我要去上班，遲到了老闆會罵人。",
    difficulty: 2,
    options: [
      {
        text: "爸，你退休十幾年了！現在半夜兩點！快回去睡覺！",
        stressDelta: 3,
        reaction: "爸爸困惑又焦急：「胡說！我明明還沒退休！你不要擋我的路！」推開你要出門。",
        expertNote: "他活在過去的時空裡，「退休十幾年」這個事實在他的世界不存在。強行拉回現實只會製造衝突和恐慌，還可能發生推擠等危險。",
        technique: "❌ 現實衝突",
      },
      {
        text: "爸，今天公司放假，你忘記了嗎？老闆有打電話來說不用去。",
        stressDelta: -1,
        reaction: "爸爸猶豫了：「放假？真的嗎？」你點點頭，他放下袋子：「那…我再睡一下。」",
        expertNote: "進入他的世界，用他能接受的邏輯回應。「公司放假」是在他的認知框架內的合理解釋。重要的是結果：他安全地回到床上了。",
        technique: "✅ 進入他的世界",
      },
      {
        text: "爸，先不急，我送你去。先吃個東西，等計程車來。",
        stressDelta: -2,
        reaction: "爸爸安心了：「好，那你送我。」坐下吃東西後，困意上來，不知不覺在沙發上睡著了。",
        expertNote: "不反駁、不阻止，用「幫助他」的方式轉移目標。吃東西、等車的過程自然消耗了他的焦慮和精力。這是經驗豐富的照顧者最常用的深夜應對法。",
        technique: "✅ 配合 + 自然消耗",
      },
    ],
  },
  {
    id: "mirror-stranger",
    category: "認知退化",
    elderName: "媽媽",
    elderAge: 84,
    context: "媽媽看著浴室的鏡子，突然尖叫起來。",
    elderSays: "有人！那裡有人在看我！你們把那個人趕走！",
    difficulty: 3,
    options: [
      {
        text: "媽，那是你自己啊！是鏡子！",
        stressDelta: 2,
        reaction: "媽媽更害怕了：「才不是我！那個人一直在看我！」她退到角落不敢動。",
        expertNote: "失智後期的長輩可能無法辨認鏡中的自己。強調「那是你」不僅無法理解，還可能更恐怖——「怎麼會有一個長得像我的陌生人？」",
        technique: "❌ 強調現實",
      },
      {
        text: "好，我把那個人請走。（用布蓋住鏡子）走了喔，你看，沒有人了。",
        stressDelta: -2,
        reaction: "媽媽看了看：「真的走了…」鬆了一口氣，讓你帶她離開浴室。",
        expertNote: "最有效的做法就是直接消除恐懼來源。蓋住鏡子或把鏡子拆掉。在失智照顧環境中，大面積鏡子常常是問題來源。居家可考慮將不必要的鏡子移除或遮蓋。",
        technique: "✅ 消除恐懼來源",
      },
      {
        text: "媽你是不是眼睛看不清楚？我帶你去看眼科。",
        stressDelta: 1,
        reaction: "媽媽搖頭：「我看得很清楚！就是有人！你不信我！」更委屈了。",
        expertNote: "把問題歸因於「她的問題」（眼睛不好）會讓她覺得不被相信。在她的感知中，那個「人」是真實的。",
        technique: "⚠️ 錯誤歸因",
      },
    ],
  },
  {
    id: "eating-confusion",
    category: "日常照顧",
    elderName: "爸爸",
    elderAge: 83,
    context: "爸爸剛吃完午餐 20 分鐘，又走到廚房翻冰箱。",
    elderSays: "怎麼還沒吃飯？你們都不給我吃飯！要餓死我嗎！",
    difficulty: 1,
    options: [
      {
        text: "爸，你剛吃過了！桌上碗都還沒收！你看！",
        stressDelta: 2,
        reaction: "爸爸生氣了：「我才沒有！你騙人！你就是不想讓我吃東西！」",
        expertNote: "用「證據」反駁失智長輩只會讓他覺得被冤枉。碗還在桌上對你是證據，對他來說毫無意義——他真的不記得吃過了。",
        technique: "❌ 用證據反駁",
      },
      {
        text: "好，我幫你準備一點水果和餅乾。",
        stressDelta: -2,
        reaction: "爸爸高興地坐下吃水果：「嗯，好吃。」吃了一小盤就滿足了。",
        expertNote: "準備少量點心比爭論「你吃過了」有效一百倍。可以把正餐份量減少，保留一些食物當「額外供應」。重複進食的長輩要注意總熱量，但不需要每次都硬擋。",
        technique: "✅ 少量滿足 + 不爭論",
      },
      {
        text: "等一下哦，飯還在煮。你先看個電視。",
        stressDelta: -1,
        reaction: "爸爸坐下看電視，等了一會兒就忘記要吃飯了。",
        expertNote: "轉移注意力也是有效策略。但如果長輩真的餓了（失智有時影響飽食感），還是要適度給食物。",
        technique: "✅ 轉移注意力",
      },
    ],
  },
];

export const SCORE_TITLES = [
  { min: 0, max: 30, title: "初心照顧者", subtitle: "別灰心！看完專家解析就能進步", emoji: "💪" },
  { min: 31, max: 60, title: "成長中的照顧者", subtitle: "你已經掌握了基本技巧", emoji: "🌱" },
  { min: 61, max: 80, title: "溫柔的照顧者", subtitle: "你的同理心讓長輩感到安心", emoji: "🌸" },
  { min: 81, max: 100, title: "照顧達人", subtitle: "你的應對非常專業，長輩很幸福", emoji: "⭐" },
];

export const TECHNIQUE_CATEGORIES = [
  "同理回應",
  "轉移注意力",
  "環境調整",
  "善意模糊",
  "降低門檻",
  "外部記憶輔助",
  "進入他的世界",
  "感官引導",
];
