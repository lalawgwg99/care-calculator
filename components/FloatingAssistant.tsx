"use client";

import { useState, useRef, useEffect } from "react";
import Icon from "@/components/Icon";

const API = "https://ai.taicalc.com/api/ai";
// 瀏覽器會自動帶 Origin（手動設 Origin 會被瀏覽器擋下），不用自己加 header
const QUICK_ASKS = [
  "長照補助怎麼申請",
  "CMS 分級是什麼",
  "喘息服務是什麼",
  "請外籍看護有補助嗎",
];

// 本站核實知識庫：命中關鍵字就直接回正確答案，不經 AI（避免胡說）
const LOCAL_KB: { keys: string[]; answer: string }[] = [
  {
    keys: ["喘息"],
    answer:
      "喘息服務是讓「照顧者」休息的服務：政府出錢安排替代人力來照顧長者，讓天天照顧的家人可以喘口氣、處理自己的事。\nCMS 2-6 級每年額度 $32,340，7-8 級 $48,510，可用於居家喘息、日間照顧或機構喘息。",
  },
  {
    keys: ["怎麼申請", "如何申請", "申請流程", "去哪申請"],
    answer:
      "打 1966 長照專線申請，照管中心會派專員到府評估失能等級（CMS 1-8 級），再依等級擬定照顧計畫、媒合服務單位。",
  },
  {
    keys: ["CMS", "分級", "失能等級", "幾級"],
    answer:
      "CMS 是長照需要等級，共 1-8 級：數字越大失能越重、補助額度越高。1 級沒有補助資格，2 級起才有。實際等級由照管中心專員到府評估認定，不是自己填了算。",
  },
  {
    keys: ["外籍", "外勞", "看護工"],
    answer:
      "聘僱外籍看護的家庭也可以申請長照，但照顧及專業服務額度只給 30%，且限用於專業服務、到宅沐浴車等。目前外籍看護每月薪資約 $20,000，另有就業安定費 $2,000。",
  },
  {
    keys: ["住宿", "機構補助", "安養", "護理之家"],
    answer:
      "住宿式機構補助（2026/9 新制）：CMS 4 級以上，每月 $15,000、全年最高 $180,000，按月認列，一年撥款兩次。",
  },
  {
    keys: ["1966"],
    answer: "1966 是長照服務專線（市話、手機直撥），可諮詢長照問題、申請長照服務。",
  },
  {
    keys: ["費用", "多少錢", "試算", "自付"],
    answer: "可以用本站首頁的 3 題快速試算，約 30 秒算出政府每月補助多少、你每月要準備多少。",
  },
  {
    keys: ["亂說", "不對", "錯誤", "胡說", "你錯"],
    answer: "抱歉，我剛才說錯了。你可以換個問法再問一次，或直接打 1966 問照管中心最準。",
  },
];

function findLocalAnswer(msg: string): string | null {
  for (const entry of LOCAL_KB) {
    if (entry.keys.some((k) => msg.includes(k))) return entry.answer;
  }
  return null;
}

interface Msg {
  role: "user" | "assistant";
  content: string;
}

export default function FloatingAssistant() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showHint, setShowHint] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([
    { role: "assistant", content: "嗨，我是小伴。長照補助、CMS 分級、照顧上的問題，都可以直接問我。" },
  ]);
  const msgBoxRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const lastUserMsg = useRef("");

  const scrollDown = () => {
    requestAnimationFrame(() => {
      if (msgBoxRef.current) msgBoxRef.current.scrollTop = msgBoxRef.current.scrollHeight;
    });
  };

  // 第一次來訪：2.5 秒後冒提示泡泡，12 秒後收掉
  useEffect(() => {
    try {
      if (!localStorage.getItem("carepilot-assistant-seen")) {
        const t1 = setTimeout(() => setShowHint(true), 2500);
        const t2 = setTimeout(() => setShowHint(false), 12000);
        return () => {
          clearTimeout(t1);
          clearTimeout(t2);
        };
      }
    } catch {
      /* 無痕模式就靜默略過 */
    }
  }, []);

  useEffect(scrollDown, [messages, loading, open]);

  // Esc 關閉
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open ]);

  const openChat = () => {
    setOpen(true);
    setShowHint(false);
    try {
      localStorage.setItem("carepilot-assistant-seen", "1");
    } catch {}
    requestAnimationFrame(() => inputRef.current?.focus());
  };

  const send = async (text?: string) => {
    const msg = (text ?? input).trim();
    if (!msg || loading) return;
    lastUserMsg.current = msg;
    const next: Msg[] = [...messages, { role: "user", content: msg }];
    setMessages(next);
    setInput("");
    setError("");
    // 先查本站核實知識庫，命中就直接回，不經 AI
    const local = findLocalAnswer(msg);
    if (local) {
      setMessages((prev) => [...prev, { role: "assistant", content: local }]);
      return;
    }
    setLoading(true);
    try {
      const history = next.slice(-6).map((m) => ({ role: m.role, content: m.content }));
      const res = await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ task: "chat-carepilot", payload: { messages: history } }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(typeof data.error === "string" ? data.error : "failed");
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.text || "抱歉，我現在有點忙，稍後再試一次就好。" },
      ]);
    } catch {
      setError("連線有點不穩，稍後再試一次就好。");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-24 right-4 sm:bottom-8 sm:right-8 z-[70] flex flex-col items-end gap-3">
      {open && (
        <div
          role="dialog"
          aria-label="小伴 AI 助手"
          className="w-[min(380px,calc(100vw-32px))] h-[min(560px,72dvh)] bg-white border border-orange-200/70 rounded-[20px] shadow-[0_20px_50px_rgba(217,119,34,0.22)] flex flex-col overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-apple-orange to-apple-pink text-white shrink-0">
            <div className="flex items-center gap-2.5">
              <span className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
                <Icon name="heart" size={20} />
              </span>
              <div>
                <p className="m-0 text-[15px] font-bold leading-tight">小伴</p>
                <p className="m-0 text-[11px] opacity-85 leading-tight">長照問題、補助試算都可以問</p>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              aria-label="關閉對話"
              className="w-11 h-11 flex items-center justify-center rounded-xl hover:bg-white/15 transition-colors"
            >
              <Icon name="x" size={20} />
            </button>
          </div>

          {/* Messages */}
          <div ref={msgBoxRef} className="flex-1 overflow-y-auto p-3 flex flex-col gap-2.5 bg-orange-50/40">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[85%] px-3.5 py-2.5 rounded-2xl text-[14px] leading-relaxed whitespace-pre-wrap ${
                    m.role === "user"
                      ? "bg-apple-orange text-white rounded-br-md"
                      : "bg-white text-apple-gray-800 border border-orange-100 rounded-bl-md shadow-sm"
                  }`}
                >
                  {m.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white border border-orange-100 rounded-2xl rounded-bl-md px-4 py-2.5 text-[14px] text-apple-orange shadow-sm">
                  輸入中…
                </div>
              </div>
            )}
            {error && (
              <p className="text-[12px] text-apple-red">
                {error}{" "}
                <button
                  onClick={() => send(lastUserMsg.current)}
                  className="text-apple-orange underline bg-transparent border-0 cursor-pointer p-0"
                >
                  重試
                </button>
              </p>
            )}
          </div>

          {/* Quick asks */}
          {messages.length <= 1 && (
            <div className="flex gap-1.5 px-3 pt-2 overflow-x-auto bg-orange-50/40 shrink-0">
              {QUICK_ASKS.map((q) => (
                <button
                  key={q}
                  onClick={() => send(q)}
                  className="shrink-0 text-[12px] px-3 py-1.5 rounded-full border border-orange-300 text-apple-orange bg-white hover:bg-orange-50 transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="p-3 border-t border-orange-100 bg-white shrink-0">
            <div className="flex gap-2">
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && send()}
                maxLength={500}
                placeholder="輸入你的問題…"
                aria-label="輸入問題"
                className="flex-1 min-w-0 border border-orange-200 rounded-xl px-3.5 py-2.5 text-[16px] text-apple-gray-900 placeholder:text-apple-gray-400 focus:outline-none focus:border-apple-orange/60"
              />
              <button
                onClick={() => send()}
                disabled={loading || !input.trim()}
                aria-label="送出"
                className="w-11 h-11 shrink-0 rounded-xl bg-gradient-to-r from-apple-orange to-apple-pink text-white flex items-center justify-center disabled:opacity-40 transition-opacity"
              >
                <Icon name="chat" size={20} />
              </button>
            </div>
            <p className="mt-1.5 text-[11px] text-apple-gray-400 text-center leading-relaxed">
              小伴不是醫生，健康問題請問醫生
            </p>
          </div>
        </div>
      )}

      {/* Hint bubble */}
      {!open && showHint && (
        <button
          onClick={openChat}
          className="bg-white border border-orange-200 shadow-[0_8px_24px_rgba(217,119,34,0.18)] rounded-2xl rounded-br-md px-4 py-2.5 text-[14px] text-apple-gray-800 cursor-pointer max-w-[220px] text-left hover:shadow-lg transition-shadow"
        >
          有長照問題嗎？問小伴
        </button>
      )}

      {/* Floating button */}
      <button
        onClick={() => (open ? setOpen(false) : openChat())}
        aria-label={open ? "關閉小伴" : "開啟小伴 AI 助手"}
        className="w-14 h-14 rounded-full bg-gradient-to-br from-apple-orange to-apple-pink text-white flex items-center justify-center shadow-[0_8px_24px_rgba(217,81,115,0.4)] hover:scale-105 active:scale-95 transition-transform"
      >
        {open ? <Icon name="x" size={24} /> : <Icon name="chat" size={26} />}
      </button>
    </div>
  );
}
