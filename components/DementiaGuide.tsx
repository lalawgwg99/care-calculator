"use client";

import { useState } from "react";

interface Behavior {
  id: string;
  title: string;
  situation: string;
  doSteps: string[];
  dontSteps: string[];
  seekHelp: string;
}

const BEHAVIORS: Behavior[] = [
  {
    id: "night",
    title: "半夜不睡、傍晚躁動",
    situation:
      "失智長輩常日夜顛倒：白天嗜睡、傍晚開始焦躁（日落症候群），半夜起床走動、翻找東西。這多半和生理時鐘混亂、環境光線與白天活動量不足有關，不是不聽話。",
    doSteps: [
      "先固定作息：每天同一時間起床、吃飯、就寢，白天盡量帶去曬太陽、活動身體",
      "白天小睡不超過 30 分鐘，傍晚避免再睡，免得晚上更睡不著",
      "傍晚就把室內燈光打開、拉上窗簾，減少陰影與昏暗造成的錯覺和不安",
      "睡前避免咖啡、濃茶與利尿的飲食；半夜醒來先安撫、陪上廁所或喝口水，不要強迫他躺回去睡",
      "臥室到廁所的動線留夜燈、清走雜物，減少半夜跌倒風險",
    ],
    dontSteps: [
      "不要用責罵或講道理的方式逼他睡覺，只會增加焦慮",
      "不要自行給長輩吃安眠藥或家人的助眠藥——可能加重混亂與跌倒風險，要先問醫師",
      "不要白天讓他一直躺床補眠，會讓日夜顛倒更嚴重",
    ],
    seekHelp:
      "若連續多晚完全無法入睡、白天精神明顯變差，或突然出現急性混亂（分不清人地時、說話顛倒），可能是感染、脫水或藥物影響，應儘速就醫，不要只當成失智的自然進程。",
  },
  {
    id: "going-out",
    title: "一直想出門、吵著要回家",
    situation:
      "明明在家，卻說「我要回家」；或趁家人不注意就往外走。這常是因為他認不出這裡是家、感到不安想回到「熟悉的地方」，或有未完成的事（接孩子、去上班）掛在心上。走失是失智家庭最怕的意外之一，要先做預防。",
    doSteps: [
      "先回應情緒，不要急著糾正：「好，我們等一下再回去，你先坐著喝杯茶」——先接住不安，再轉移注意",
      "用他喜歡的事岔開：一起看舊照片、聽老歌、請他幫忙摺衣服或挑菜，給他一件「有事可做」的事",
      "找出觸發情境：是看到外套、鑰匙、包包就想出門嗎？把這些物品收離視線，門口可加門簾讓門「看起來不像門」",
      "預防走失先做好：申請愛心手鍊、衣物繡上姓名電話、使用定位裝置，並到警局辦理指紋捺印建檔",
      "通知鄰里與常去的店家：留一張長輩近照與聯絡電話，請大家看到他獨自外出時聯繫你",
    ],
    dontSteps: [
      "不要爭辯「這就是你家」或強拉他回來，容易激發更大的恐慌與抗拒",
      "不要把大門反鎖把人獨自留在家裡——火災等緊急狀況時他無法逃生",
      "走失後不要等「他自己會回來」，超過黃金時間找回難度大增，要立刻報警",
    ],
    seekHelp:
      "走失當下立刻撥 110 報警並通知失智症關懷專線 0800-474-580 協尋。平時反覆強烈想外出、伴隨攻擊行為時，請回診與醫師討論是否需要調整藥物或照護安排。",
  },
  {
    id: "stolen",
    title: "懷疑東西被偷、藏錢不見",
    situation:
      "錢包、存摺、首飾「不見了」，認定是家人或看護偷的。這是失智症最常見的妄想類型，主因是記憶退化：他把東西藏在某處後忘了位置，無法理解是自己放的，只好推論「被人拿走」。他不是故意誣賴人。",
    doSteps: [
      "先同理，不反駁：「錢不見了你一定很緊張，我們一起找找看」——站在他那邊找，而不是替自己辯護",
      "摸清他的藏東西習慣：抽屜夾層、枕頭下、包包內襯、冰箱——失智長輩藏物品的位置通常固定那幾個",
      "重要證件、存摺與大量現金改由家人保管，長輩手邊留少量零用錢和一個「找得到東西」的固定位置",
      "準備備用品：眼鏡、鑰匙、錢包買一模一樣的備份，找不到時可以平順地替換",
      "若他懷疑的人是外籍看護，先私下查明再處理，避免當面對質讓照護關係破裂；必要時請他信賴的家人出面緩和",
    ],
    dontSteps: [
      "不要說「明明是你自己藏的」「你又來了」，指責只會讓他更確信有人在害他",
      "不要當面跟他對質辯論偷竊不存在，他會把你的反駁當成「你們串通好」",
      "不要把所有財物一次全部沒收，他的「什麼都被拿走」感受會更強烈",
    ],
    seekHelp:
      "若妄想越來越頻繁、出現幻聽幻視、或因懷疑而拒絕吃藥吃飯、攻擊家人，請回診神經內科或精神科評估；突然加重的妄想也要排除泌尿道感染、脫水等身體因素。",
  },
  {
    id: "bathing",
    title: "拒絕洗澡",
    situation:
      "衛福部新營醫院的衛教資料指出，約 68% 的進階失智患者曾拒絕照護，洗澡是最常見的戰場。原因往往很具體：怕冷、怕水聲、怕跌倒、不理解為什麼要脫衣服、或覺得隱私被侵犯——不是故意找碴。",
    doSteps: [
      "記住五字訣「停、找、拆、選、換」：停——先停下強迫；找——找出真正抗拒的原因；拆——把洗澡拆成洗臉、洗手、擦澡等小步；選——給有限選擇「先洗頭還是先沖身體？」；換——換時間、換方法、換協助的人",
      "選他精神最好、最放鬆的時段洗，避開傍晚躁動期；浴室先放熱水暖房、水溫調好再請他進去",
      "降低恐怖感：蓮蓬頭水聲改小、先用毛巾擦澡過渡、浴室放防滑椅讓他坐著洗",
      "不必天天全身洗：天氣冷或狀態差時，重點部位擦澡、更換衣物即可，衛生達標比「有沒有洗澡」重要",
      "有時換個人就成功：由他最信任的家人協助，或改請居家服務員來洗，同性協助者通常抗拒較低",
    ],
    dontSteps: [
      "不要硬拉硬脫，多人架著洗——一次可怕的經驗會讓之後每次洗澡都更抗拒",
      "不要用「你很臭」羞辱他，他對氣味的感知可能已經退化，只會感到被嫌棄",
      "不要在其他家人或訪客面前討論他的洗澡問題，保留他的尊嚴",
    ],
    seekHelp:
      "若因拒絕清潔出現皮膚炎、傷口感染、嚴重異味影響社交，或合併攻擊行為，請與失智共照中心或居家護理師討論照護技巧；長照 2.0 的居家服務（BA02 洗澡協助）可申請專業人員到宅協助，撥 1966 申請。",
  },
  {
    id: "repeating",
    title: "重複問話、重複做同一件事",
    situation:
      "「今天星期幾？」「中午吃什麼？」五分鐘問一次。他不是故意煩人，而是短期記憶受損——問完就忘，加上心裡其實有焦慮：怕錯過事情、怕被丟下。重複問話通常是「我很不安」的訊號。",
    doSteps: [
      "每次都當第一次聽到，用同樣平穩的語氣簡短回答；回答完順勢帶一句接下來的安排：「吃完飯我們去散步」，讓他有預期",
      "把答案寫下來：白板或便條寫上今天行程與他最常問的事，指給他看——文字提醒比口頭回答留得久",
      "找出問題背後的焦慮：一直問「兒子什麼時候來」可能是想念或怕被遺忘，安排固定時間通電話，讓等待有終點",
      "給他手邊有事做：摺毛巾、挑豆子、看相簿，重複性活動能安撫焦慮、減少問話頻率",
      "家人輪流休息：重複問話對照顧者的消耗是累積的，安排喘息時間不是偷懶，是為了走更長的路",
    ],
    dontSteps: [
      "不要說「我剛剛才講過」「你問幾次了」，他真的不記得，被指正只會受傷又更焦慮",
      "不要故意給不同答案測試他，或拿他的重複問話開玩笑",
      "不要完全不理會——冷處理會被他解讀成「沒人理我」，焦慮升高、問得更頻繁",
    ],
    seekHelp:
      "重複問話本身多屬病程表現，但若短期內「突然」大幅惡化，合併嗜睡、食慾下降或發燒，可能是感染或其他急性問題，應就醫檢查，不要全部歸因於失智。",
  },
];

export default function DementiaGuide() {
  const [active, setActive] = useState(BEHAVIORS[0].id);
  const cur = BEHAVIORS.find((b) => b.id === active) ?? BEHAVIORS[0];

  return (
    <div className="space-y-5">
      <section className="bg-white rounded-[14px] shadow-apple border border-apple-gray-200/60 p-5">
        <div className="flex flex-wrap gap-2" role="tablist" aria-label="選擇行為情境">
          {BEHAVIORS.map((b) => (
            <button
              key={b.id}
              role="tab"
              aria-selected={active === b.id}
              onClick={() => setActive(b.id)}
              className={`px-4 py-2 rounded-full text-[13px] font-semibold transition-colors ${
                active === b.id
                  ? "bg-teal-600 text-white"
                  : "bg-apple-gray-100 text-apple-gray-600 hover:bg-apple-gray-200"
              }`}
            >
              {b.title}
            </button>
          ))}
        </div>

        <div className="mt-5">
          <p className="text-[14px] text-apple-gray-600 leading-relaxed bg-apple-gray-50 rounded-lg p-4">{cur.situation}</p>

          <h3 className="font-bold text-[15px] text-teal-800 mt-5 mb-2">當下這樣做</h3>
          <ol className="space-y-2">
            {cur.doSteps.map((s, i) => (
              <li key={i} className="flex gap-2.5 text-[14px] leading-relaxed text-apple-gray-700">
                <span className="shrink-0 w-5 h-5 rounded-full bg-teal-600 text-white text-[12px] font-bold flex items-center justify-center mt-0.5">
                  {i + 1}
                </span>
                <span>{s}</span>
              </li>
            ))}
          </ol>

          <h3 className="font-bold text-[15px] text-rose-700 mt-5 mb-2">不要這樣做</h3>
          <ul className="space-y-2">
            {cur.dontSteps.map((s, i) => (
              <li key={i} className="flex gap-2.5 text-[14px] leading-relaxed text-apple-gray-700">
                <span className="shrink-0 text-rose-500 font-bold mt-px">✕</span>
                <span>{s}</span>
              </li>
            ))}
          </ul>

          <div className="mt-5 bg-amber-50 border border-amber-200 rounded-lg p-4">
            <div className="text-[13px] font-bold text-amber-900 mb-1">⚠️ 什麼時候要求助或就醫</div>
            <p className="text-[13px] text-amber-800 leading-relaxed">{cur.seekHelp}</p>
          </div>
        </div>
      </section>

      <section className="bg-white rounded-[14px] shadow-apple border border-apple-gray-200/60 p-5">
        <h2 className="font-bold text-[16px] text-apple-gray-900 mb-3">求助資源（先存進手機）</h2>
        <div className="grid sm:grid-cols-2 gap-3 text-[13px] leading-relaxed">
          <div className="bg-apple-gray-50 rounded-lg p-3">
            <div className="font-semibold text-apple-gray-900">失智症關懷專線 0800-474-580</div>
            <div className="text-apple-gray-500 mt-0.5">台灣失智症協會，周一至周五 9:00–21:00。照護諮詢、走失協尋、支持團體轉介。</div>
          </div>
          <div className="bg-apple-gray-50 rounded-lg p-3">
            <div className="font-semibold text-apple-gray-900">長照專線 1966</div>
            <div className="text-apple-gray-500 mt-0.5">申請居家服務、喘息服務、失智共同照護中心轉介的統一入口。</div>
          </div>
          <div className="bg-apple-gray-50 rounded-lg p-3">
            <div className="font-semibold text-apple-gray-900">失智共同照護中心</div>
            <div className="text-apple-gray-500 mt-0.5">各縣市皆有，由醫院承辦：確診協助、個案管理、家屬支持課程與照護技巧訓練。</div>
          </div>
          <div className="bg-apple-gray-50 rounded-lg p-3">
            <div className="font-semibold text-apple-gray-900">緊急狀況 110 / 119</div>
            <div className="text-apple-gray-500 mt-0.5">走失立即打 110；受傷、急性混亂、疑似中風等緊急狀況打 119。</div>
          </div>
          <div className="bg-apple-gray-50 rounded-lg p-3">
            <div className="font-semibold text-apple-gray-900">家庭照顧者關懷專線 0800-507-272</div>
            <div className="text-apple-gray-500 mt-0.5">照顧者自己的情緒與壓力支持，先照顧好自己才能照顧家人。</div>
          </div>
          <div className="bg-apple-gray-50 rounded-lg p-3">
            <div className="font-semibold text-apple-gray-900">愛心手鍊與指紋建檔</div>
            <div className="text-apple-gray-500 mt-0.5">走失預防：向各縣市社會局或失智症協會申請愛心手鍊；至警察局辦理指紋捺印，走失時更容易辨識身分。</div>
          </div>
        </div>
      </section>

    </div>
  );
}
