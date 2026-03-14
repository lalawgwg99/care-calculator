"use client";

import { useState, useEffect } from "react";

interface Task {
  id: string;
  name: string;
  difficulty: 1 | 2 | 3;
  duration: string;
  steps: string[];
  benefit: string;
  emoji: string;
}

interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  bgColor: string;
  tasks: Task[];
}

const CATEGORIES: Category[] = [
  {
    id: "physical",
    name: "身體活動",
    icon: "🏃",
    color: "text-emerald-700",
    bgColor: "bg-emerald-50 border-emerald-100",
    tasks: [
      {
        id: "chair-squat",
        name: "扶椅子站立練習",
        difficulty: 1,
        duration: "10 分鐘",
        steps: ["坐在穩固的椅子上", "雙手扶椅背或扶手", "慢慢站起來，數到 3", "停頓 2 秒，再慢慢坐下", "重複 5~10 次"],
        benefit: "增強大腿肌力，改善平衡感，降低跌倒風險",
        emoji: "🪑",
      },
      {
        id: "walk-indoor",
        name: "室內走動練習",
        difficulty: 1,
        duration: "15 分鐘",
        steps: ["在家中走廊或客廳來回行走", "保持抬頭挺胸", "如需要可使用助行器", "每天早晚各走一次"],
        benefit: "維持步行能力，促進血液循環，提振精神",
        emoji: "👣",
      },
      {
        id: "shoulder-rotation",
        name: "肩頸放鬆操",
        difficulty: 1,
        duration: "10 分鐘",
        steps: ["坐正，雙腳平放地面", "緩慢地將頭向左轉，停留 5 秒", "再向右轉，停留 5 秒", "聳肩再放鬆，重複 5 次", "手臂向前伸展，交替進行"],
        benefit: "緩解頸部緊繃，改善上肢循環，減少肌肉僵硬",
        emoji: "🔄",
      },
      {
        id: "balance-single",
        name: "單腳站立平衡",
        difficulty: 2,
        duration: "5 分鐘",
        steps: ["站在穩固家具旁（如流理台、牆壁）", "單手輕扶支撐物", "慢慢抬起一腳，離地約 5 公分", "維持 10~30 秒，再換腳", "若感覺不穩立刻放腳"],
        benefit: "顯著改善平衡能力，是預防跌倒最有效的訓練之一",
        emoji: "🦩",
      },
      {
        id: "stair-step",
        name: "原地踏步運動",
        difficulty: 2,
        duration: "10 分鐘",
        steps: ["站在穩固的椅子旁", "緩慢地抬起左膝（膝蓋約至腰高）", "放下，再抬起右膝", "保持節奏，做 20~30 步", "配合呼吸，不要憋氣"],
        benefit: "鍛鍊腿部肌力與協調，改善心肺功能",
        emoji: "🥾",
      },
      {
        id: "stretch-full",
        name: "全身伸展操",
        difficulty: 3,
        duration: "15 分鐘",
        steps: ["坐在椅子上，深呼吸 3 次", "雙手高舉過頭，伸展 10 秒", "前彎嘗試碰膝蓋，保持 10 秒", "雙腳踝畫圓轉動各 10 次", "最後深呼吸放鬆"],
        benefit: "提升關節活動度，緩解整體肌肉緊繃",
        emoji: "🧘",
      },
    ],
  },
  {
    id: "cognitive",
    name: "認知訓練",
    icon: "🧠",
    color: "text-purple-700",
    bgColor: "bg-purple-50 border-purple-100",
    tasks: [
      {
        id: "memory-word",
        name: "圖卡記憶遊戲",
        difficulty: 1,
        duration: "10 分鐘",
        steps: ["準備 5~10 張物品圖卡（或用手機圖片）", "讓長輩看牌 30 秒後翻面", "請他說出記得的圖片", "逐漸增加圖片數量"],
        benefit: "訓練短期記憶力，也是失智症早期評估的好方法",
        emoji: "🃏",
      },
      {
        id: "sudoku-simple",
        name: "簡單數字填格",
        difficulty: 1,
        duration: "15 分鐘",
        steps: ["準備簡單的 4×4 數字填格或找字遊戲", "鼓勵長輩獨自完成", "若卡住給予提示，不急著給答案", "完成後給予稱讚"],
        benefit: "鍛鍊邏輯思維與注意力，保持大腦活躍",
        emoji: "🔢",
      },
      {
        id: "story-recall",
        name: "說故事回憶",
        difficulty: 2,
        duration: "20 分鐘",
        steps: ["請長輩描述一件過去的美好回憶", "家人可以提問引導細節", "例如：「那時候吃了什麼？」", "可以拿出老照片輔助"],
        benefit: "刺激長期記憶，增強語言表達，強化家庭連結",
        emoji: "📖",
      },
      {
        id: "pattern-copy",
        name: "圖形描繪練習",
        difficulty: 2,
        duration: "15 分鐘",
        steps: ["準備一張簡單圖案（如房子、花朵）", "請長輩照著描繪或畫出來", "不要批評，鼓勵過程", "完成後可以用色鉛筆上色"],
        benefit: "訓練手眼協調與空間認知，預防認知退化",
        emoji: "✏️",
      },
      {
        id: "cooking-simple",
        name: "參與簡單備餐",
        difficulty: 2,
        duration: "20 分鐘",
        steps: ["請長輩協助洗菜、剝蒜或折青菜", "說明每個步驟，一起完成", "讓長輩在能力範圍內主導", "用餐時提到「這是您幫忙做的」"],
        benefit: "維持日常生活技能，增加成就感，刺激多種感官",
        emoji: "🥬",
      },
      {
        id: "music-recall",
        name: "音樂懷舊療法",
        difficulty: 1,
        duration: "20 分鐘",
        steps: ["播放長輩年輕時喜愛的歌曲", "鼓勵他跟著哼唱", "問問歌曲背後的記憶與故事", "可以一起輕輕打拍子"],
        benefit: "音樂能觸發深層記憶，改善情緒，減少焦慮",
        emoji: "🎵",
      },
    ],
  },
  {
    id: "social",
    name: "社交互動",
    icon: "👥",
    color: "text-blue-700",
    bgColor: "bg-blue-50 border-blue-100",
    tasks: [
      {
        id: "video-call",
        name: "視訊聯絡親友",
        difficulty: 1,
        duration: "20 分鐘",
        steps: ["幫助長輩使用平板或手機視訊", "事先聯絡對方安排好時間", "陪在旁邊協助操作", "聊聊近況、看看孫子們"],
        benefit: "維持社交連結，減少孤獨感，是心理健康的重要支柱",
        emoji: "📹",
      },
      {
        id: "board-game",
        name: "桌遊或牌九",
        difficulty: 1,
        duration: "30 分鐘",
        steps: ["與家人或照顧者一起玩簡單桌遊", "選擇長輩熟悉的遊戲（如麻將、撲克牌）", "降低規則難度，重在參與", "保持輕鬆愉快的氣氛"],
        benefit: "刺激認知功能，帶來樂趣，增進家人互動",
        emoji: "🎲",
      },
      {
        id: "community-activity",
        name: "參加社區活動",
        difficulty: 2,
        duration: "2 小時",
        steps: ["查詢附近長照中心、社區關懷站活動", "陪同長輩前往", "鼓勵與其他長輩互動", "活動結束後聊聊感受"],
        benefit: "擴大社交圈，建立支持網絡，增加生活樂趣",
        emoji: "🌿",
      },
      {
        id: "letter-writing",
        name: "寫信或卡片",
        difficulty: 1,
        duration: "20 分鐘",
        steps: ["準備信紙、信封和筆", "請長輩寫信給遠方家人或老朋友", "若書寫困難，可口述由家人代寫", "一起準備寄出"],
        benefit: "表達情感，維持與親友的聯繫，提升自我價值感",
        emoji: "✉️",
      },
    ],
  },
  {
    id: "daily",
    name: "日常生活",
    icon: "🌅",
    color: "text-amber-700",
    bgColor: "bg-amber-50 border-amber-100",
    tasks: [
      {
        id: "self-grooming",
        name: "自行梳洗練習",
        difficulty: 1,
        duration: "15 分鐘",
        steps: ["準備好所有用品放在伸手可及處", "讓長輩自己完成力所能及的部分", "只在需要時給予協助", "稱讚每一個完成的步驟"],
        benefit: "維持自主能力，建立自我尊嚴，延緩依賴",
        emoji: "🪥",
      },
      {
        id: "simple-cooking",
        name: "簡單烹飪練習",
        difficulty: 2,
        duration: "20 分鐘",
        steps: ["選擇安全簡單的食物（如沙拉、泡茶）", "讓長輩主導，家人在旁守護", "使用防燙、防滑的輔具", "一起享用成果"],
        benefit: "維持生活技能，產生成就感，刺激感官",
        emoji: "☕",
      },
      {
        id: "plant-care",
        name: "照顧盆栽植物",
        difficulty: 1,
        duration: "10 分鐘",
        steps: ["準備一盆容易照顧的植物（如多肉植物）", "讓長輩負責澆水、施肥", "一起觀察植物生長變化", "幫植物命名，建立情感連結"],
        benefit: "培養責任感，接觸自然有療癒效果，維持規律作息",
        emoji: "🌱",
      },
      {
        id: "journaling",
        name: "日記或心情記錄",
        difficulty: 1,
        duration: "10 分鐘",
        steps: ["準備簡單的筆記本", "每天記錄一件今日發生的事", "也可以畫圖代替文字", "定期回頭翻閱，回味美好時光"],
        benefit: "整理思緒，記錄美好片刻，有助認知功能與情緒健康",
        emoji: "📒",
      },
      {
        id: "room-organization",
        name: "整理個人物品",
        difficulty: 1,
        duration: "20 分鐘",
        steps: ["讓長輩整理自己的抽屜或書架", "不要替他做決定，讓他選擇", "可以趁機聊聊物品背後的故事", "讚美整齊的成果"],
        benefit: "增加自主感，刺激認知，讓長輩覺得仍有掌控能力",
        emoji: "🗂️",
      },
    ],
  },
];

const WEEK_KEY = `reablement-week-${new Date().getFullYear()}-${Math.ceil((new Date().getDate()) / 7)}`;

export default function ReablementCards() {
  const [activeCategory, setActiveCategory] = useState("physical");
  const [completed, setCompleted] = useState<Set<string>>(new Set());

  useEffect(() => {
    try {
      const saved = localStorage.getItem(WEEK_KEY);
      if (saved) setCompleted(new Set(JSON.parse(saved)));
    } catch {}
  }, []);

  const toggleTask = (taskId: string) => {
    setCompleted((prev) => {
      const next = new Set(prev);
      if (next.has(taskId)) next.delete(taskId); else next.add(taskId);
      try { localStorage.setItem(WEEK_KEY, JSON.stringify([...next])); } catch {}
      return next;
    });
  };

  const allTasks = CATEGORIES.flatMap((c) => c.tasks);
  const totalCompleted = allTasks.filter((t) => completed.has(t.id)).length;
  const weeklyRate = Math.round((totalCompleted / allTasks.length) * 100);

  const category = CATEGORIES.find((c) => c.id === activeCategory)!;

  return (
    <div className="bg-white rounded-[28px] shadow-apple border border-apple-gray-200/60 overflow-hidden">
      <div className="bg-gradient-to-r from-amber-50 to-yellow-50 px-6 py-5 border-b border-amber-100/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-[28px]">🌟</span>
            <div>
              <h2 className="text-[18px] font-bold text-apple-gray-900">微光復能任務卡</h2>
              <p className="text-[13px] text-amber-800/60 mt-0.5">每週復能活動，點亮生活光芒</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-[22px] font-bold text-amber-600">{weeklyRate}%</div>
            <div className="text-[11px] text-amber-700">本週進度</div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-3 h-2 bg-amber-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-amber-400 rounded-full transition-all duration-500"
            style={{ width: `${weeklyRate}%` }}
          />
        </div>
        <div className="text-[12px] text-amber-700 mt-1">{totalCompleted} / {allTasks.length} 項完成</div>
      </div>

      {/* Category Tabs */}
      <div className="flex border-b border-apple-gray-100 overflow-x-auto">
        {CATEGORIES.map((cat) => {
          const catCompleted = cat.tasks.filter((t) => completed.has(t.id)).length;
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex-1 min-w-[80px] py-3 px-2 text-center transition-colors ${
                activeCategory === cat.id
                  ? `${cat.color} border-b-2 border-current`
                  : "text-apple-gray-500 hover:text-apple-gray-700"
              }`}
            >
              <div className="text-[18px]">{cat.icon}</div>
              <div className="text-[11px] font-medium mt-0.5">{cat.name}</div>
              {catCompleted > 0 && (
                <div className="text-[10px] opacity-60">{catCompleted}/{cat.tasks.length}</div>
              )}
            </button>
          );
        })}
      </div>

      {/* Task Cards */}
      <div className="p-4 space-y-3">
        {category.tasks.map((task) => {
          const isDone = completed.has(task.id);
          return (
            <div
              key={task.id}
              className={`rounded-[20px] border-2 p-4 transition-all ${
                isDone ? "border-emerald-200 bg-emerald-50" : `${category.bgColor}`
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 flex-1">
                  <span className="text-[24px] shrink-0">{task.emoji}</span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`font-bold text-[15px] ${isDone ? "text-emerald-700 line-through" : category.color}`}>
                        {task.name}
                      </span>
                      <span className="text-[12px]">{"⭐".repeat(task.difficulty)}</span>
                    </div>
                    <div className="text-[12px] text-apple-gray-500 mb-2">⏱ {task.duration}</div>

                    {!isDone && (
                      <>
                        <div className="text-[12px] font-medium text-apple-gray-600 mb-1">步驟：</div>
                        <ol className="space-y-0.5 mb-2">
                          {task.steps.map((step, i) => (
                            <li key={i} className="text-[12px] text-apple-gray-600 flex gap-1.5">
                              <span className="shrink-0 text-apple-gray-400">{i + 1}.</span>
                              {step}
                            </li>
                          ))}
                        </ol>
                        <div className="text-[12px] bg-white/60 rounded-[10px] px-2.5 py-1.5 text-apple-gray-600">
                          💪 <strong>好處：</strong>{task.benefit}
                        </div>
                      </>
                    )}

                    {isDone && (
                      <div className="text-[13px] text-emerald-600 font-medium">✓ 本週已完成！太棒了</div>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => toggleTask(task.id)}
                  className={`shrink-0 w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${
                    isDone
                      ? "bg-emerald-500 border-emerald-500 text-white"
                      : `border-current ${category.color} hover:bg-white/50`
                  }`}
                >
                  {isDone ? "✓" : ""}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="px-4 pb-4 text-center text-[12px] text-apple-gray-400">
        進度每週重置，今天就開始吧！
      </div>
    </div>
  );
}
