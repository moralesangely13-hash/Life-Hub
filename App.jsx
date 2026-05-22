import { useState, useEffect, useRef } from "react";
import { ChevronDown, ChevronRight, Search, ArrowLeft, Upload, Sparkles } from "lucide-react";

const STYLE = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,500;0,700;1,500&family=Nunito:wght@300;400;500;600;700;800&display=swap');
*{box-sizing:border-box;margin:0;padding:0;}
body{overflow:hidden;background:linear-gradient(135deg,#fdf0f7 0%,#faf0ff 50%,#f0f7ff 100%);}
.pf{font-family:'Playfair Display',serif;}
.nu{font-family:'Nunito',sans-serif;}
.glass{background:rgba(255,255,255,0.72);backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px);border:1px solid rgba(249,168,212,0.28);border-radius:20px;box-shadow:0 4px 24px rgba(249,168,212,0.14);}
.glass-sm{background:rgba(255,255,255,0.65);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);border:1px solid rgba(249,168,212,0.22);border-radius:14px;box-shadow:0 2px 12px rgba(249,168,212,0.1);}
.inp{width:100%;font-family:'Nunito',sans-serif;font-size:13px;padding:8px 12px;border-radius:12px;background:rgba(255,255,255,0.75);border:1px solid #fce4ec;color:#7c4d7e;outline:none;transition:border-color .2s;}
.inp:focus{border-color:#f9a8d4;}
.inp::placeholder{color:#f3a8c9;}
textarea.inp{resize:none;}
.btn{font-family:'Nunito',sans-serif;font-size:12px;font-weight:700;padding:8px 16px;border-radius:12px;border:none;cursor:pointer;transition:all .2s;color:#fff;}
.btn:hover{opacity:.88;transform:translateY(-1px);}
.scroll{overflow-y:auto;}
.scroll::-webkit-scrollbar{width:4px;height:4px;}
.scroll::-webkit-scrollbar-thumb{background:#fce4ec;border-radius:99px;}
.card-hover{transition:all .22s;}
.card-hover:hover{transform:translateY(-2px) scale(1.01);box-shadow:0 8px 28px rgba(249,168,212,0.22);}
@keyframes fadeIn{from{opacity:0;transform:translateY(8px);}to{opacity:1;transform:none;}}
.fadein{animation:fadeIn .35s ease both;}
@keyframes float{0%,100%{transform:translateY(0);}50%{transform:translateY(-8px);}}
.blob{position:fixed;border-radius:50%;pointer-events:none;z-index:0;}
`;

const QUOTES = [
  "You are doing better than you think 🌸",
  "Every day is a fresh beginning, love ✨",
  "Your creativity is your superpower 💫",
  "Slow progress is still progress, darling 🍃",
  "You deserve all the peace you seek 🕊️",
  "Dream it. Plan it. Live it 🌷",
  "Your ideas are worth capturing 📝",
  "Today is full of beautiful possibilities 🌼",
  "Rest is also productive, gorgeous 🌙",
  "You are the main character 🎀",
];

const moods = [
  { emoji: '🌸', label: 'blooming' },
  { emoji: '✨', label: 'inspired' },
  { emoji: '🛋️', label: 'cozy' },
  { emoji: '😴', label: 'tired' },
  { emoji: '🌧️', label: 'meh' },
  { emoji: '💪', label: 'motivated' },
  { emoji: '😰', label: 'anxious' },
  { emoji: '🥰', label: 'grateful' },
  { emoji: '🌈', label: 'happy' },
  { emoji: '🫠', label: 'overwhelmed' },
  { emoji: '🍓', label: 'excited' },
  { emoji: '🌻', label: 'hopeful' }
];

const HABITS = [
  { id: "w", l: "Drink water 💧" },
  { id: "m", l: "Move body 🧘" },
  { id: "s", l: "Skincare 🧴" },
  { id: "r", l: "Read 📖" },
  { id: "j", l: "Journal ✍️" },
  { id: "sl", l: "Sleep 8h 🌙" },
  { id: "g", l: "Gratitude 🙏" },
];

const PASTELS = ["#fce4ec", "#f3e5f5", "#e8eaf6", "#e0f2fe", "#e8f5e9", "#fff8e1", "#fdf6f0", "#fce8f3", "#e3f2fd", "#f0fdf4", "#fdf4ff", "#fffbeb"];

const NAV = [
  {
    id: "work", label: "Work & Career", emoji: "💼", color: "#fce8f3", accent: "#f48fb1",
    folders: [
      { id: "teaching", label: "Teaching", emoji: "📚", subareas: ["Didactic Resources", "Educational Projects", "Teaching Practice", "Lesson Planning", "Evaluations", "Teaching Portfolio", "Educational Platforms"] },
      { id: "work-f", label: "Work", emoji: "💻", subareas: ["Interviews", "CVs", "Work Projects", "Remote Jobs", "Freelancing", "Important Documents"] },
    ],
  },
  { id: "creative", label: "Creative Studio", emoji: "🎨", color: "#f3e5f5", accent: "#c084fc", subareas: ["Branding", "Content Ideas", "TikTok Ideas", "Gaming Content", "Avatar", "Rebranding", "Content Vault"] },
  { id: "hobbies", label: "Hobbies & Skills", emoji: "🌈", color: "#fef3c7", accent: "#f59e0b", subareas: ["Sewing", "Gaming", "Design", "Languages", "Cooking"] },
  { id: "health", label: "Health & Wellness", emoji: "💚", color: "#dcfce7", accent: "#4ade80", subareas: ["Fitness", "Physical Health", "Mental Health", "Sleep", "Period Tracker"] },
  { id: "beauty", label: "Self Care & Beauty", emoji: "🌷", color: "#fce4ec", accent: "#f48fb1", subareas: ["Skincare", "Makeup & Beauty", "Hair Care", "Fashion Inspiration"] },
  { id: "finances", label: "Finances", emoji: "💸", color: "#e0f2fe", accent: "#38bdf8", subareas: ["Expenses", "Income", "Savings", "Wishlist", "Goals", "Business Ideas", "Important Purchases", "Budgeting"] },
  { id: "curiosities", label: "Random Curiosities", emoji: "🔭", color: "#fef9c3", accent: "#fbbf24", subareas: ["Rabbit Holes", "Random Thoughts", "Existential Questions", "Interesting Topics", "Creative Ideas", "Things To Research", "Movie Analysis"] },
  { id: "spiritual", label: "Spiritual", emoji: "✝️", color: "#fdf4ff", accent: "#e879f9", subareas: ["Reflections", "Gratitude", "Spiritual Journal", "Bible Verses", "Prayer", "Personal Growth"] },
  { id: "social", label: "Social & Connections", emoji: "💌", color: "#fff1f2", accent: "#fb7185", subareas: ["Important People", "Last Contact", "Social Reminders", "Relationship Goals", "Healthy Boundaries", "Emotional Connections"] },
];

const SUB_EMOJIS = {
  "Didactic Resources": "📚", "Educational Projects": "🏫", "Teaching Practice": "👩‍🏫", "Lesson Planning": "📝", Evaluations: "✅", "Teaching Portfolio": "🗂️", "Educational Platforms": "💻",
  Interviews: "🎙️", CVs: "📄", "Work Projects": "💻", "Remote Jobs": "🏠", Freelancing: "💼", "Important Documents": "📁",
  Branding: "🎀", "Content Ideas": "📱", "TikTok Ideas": "🎬", "Gaming Content": "🕹️", Avatar: "👩‍🎨", Rebranding: "✨", "Content Vault": "🗃️",
  Sewing: "🧵", Gaming: "🎮", Design: "🎨", Languages: "🗣️", Cooking: "🍳",
  Fitness: "💪", "Physical Health": "🩺", "Mental Health": "🧠", Sleep: "😴", "Period Tracker": "🩸",
  Skincare: "🧴", "Makeup & Beauty": "💄", "Hair Care": "💇‍♀️", "Fashion Inspiration": "👗",
  Expenses: "🧾", Income: "💵", Savings: "🏦", Wishlist: "🛍️", Goals: "🎯", "Business Ideas": "💡", "Important Purchases": "💳", Budgeting: "📊",
  "Rabbit Holes": "🐇", "Random Thoughts": "💭", "Existential Questions": "🌌", "Interesting Topics": "🔎", "Creative Ideas": "💡", "Things To Research": "📌", "Movie Analysis": "🎬",
  Reflections: "🕊️", Gratitude: "🙏", "Spiritual Journal": "📖", "Bible Verses": "✝️", Prayer: "🤍", "Personal Growth": "🌱",
  "Important People": "👥", "Last Contact": "📞", "Social Reminders": "💌", "Relationship Goals": "🌹", "Healthy Boundaries": "🛡️", "Emotional Connections": "💞",
};

const getEmoji = (sub) => SUB_EMOJIS[sub] || "🌸";
const todayStr = new Date().toISOString().slice(0, 10);
const rp = () => PASTELS[Math.floor(Math.random() * PASTELS.length)];

const TABS = [
  { k: "notes", e: "📝", l: "Notes" },
  { k: "links", e: "🔗", l: "Links" },
  { k: "ideas", e: "💡", l: "Ideas" },
  { k: "gallery", e: "🖼️", l: "Gallery" },
  { k: "board", e: "🎨", l: "Moodboard" },
  { k: "guide", e: "✨", l: "Guide" },
];

const GUIDE = {
  spiritual: [
    "God can work even in quiet seasons. Take a moment to ask: what is He teaching me right now?",
    "A gentle reminder: you do not have to carry everything alone. Write one thing you want to surrender today.",
    "Faith is also choosing peace when your mind feels loud. Breathe, pray, and take one small step.",
    "Reflection prompt: Where did I see love, protection, or guidance today?",
    "Prayer idea: God, give me wisdom for what I cannot control and peace for what I cannot fix.",
    "Spiritual journaling prompt: What blessing did I almost overlook today?",
  ],
  finances: [
    "Money check-in: before buying something, ask if it supports your goals or only your mood.",
    "Try a 24-hour pause before non-essential purchases. Future you will thank you.",
    "Budget prompt: What expense gave me peace, and what expense gave me stress?",
    "Savings tip: choose one tiny amount to save today. Small consistency matters.",
    "Finance reflection: What can I delay, reduce, or replace this week?",
    "Before spending, ask: is this urgent, useful, or emotional?",
  ],
  health: [
    "Wellness check: drink water, relax your shoulders, and ask your body what it needs.",
    "Mental health prompt: What emotion is asking for attention today?",
    "Sleep tip: reduce screens 20 minutes before bed and create a softer nighttime routine.",
    "Fitness reminder: movement should support you, not punish you.",
    "Self-care idea: do one small thing that makes your body feel safe.",
    "Take one gentle step: stretch, breathe, hydrate, or rest.",
  ],
  beauty: [
    "Beauty tip: simple routines done consistently work better than too many products at once.",
    "Skincare reminder: observe your skin before applying products. Is it dry, oily, sensitive, or tired?",
    "Makeup idea: choose one feature to highlight today instead of doing everything.",
    "Hair care tip: gentle handling matters. Avoid pulling when your hair is wet.",
    "Style prompt: What outfit would make me feel soft, confident, and comfortable?",
    "Beauty is also care. Do it softly, not from pressure.",
  ],
  work: [
    "Productivity tip: choose one priority and give it 25 focused minutes.",
    "Career prompt: What skill would make future opportunities easier for me?",
    "Teaching idea: turn one topic into a simple activity, example, and quick assessment.",
    "Work reminder: progress counts even if it is not perfect yet.",
    "Planning tip: write the next smallest step, not the whole mountain.",
    "If the task feels too big, reduce it to one action you can finish today.",
  ],
  creative: [
    "Creative prompt: make a messy first version. Editing comes later.",
    "Content idea: document the process, not only the final result.",
    "Design tip: choose 2 fonts, 3 colors, and one clear message.",
    "Branding prompt: What feeling should people get when they see your work?",
    "Creativity reminder: inspiration comes faster when you start.",
    "Your aesthetic is stronger when it has a clear emotion behind it.",
  ],
  hobbies: [
    "Skill tip: practice one tiny technique today instead of trying to master everything.",
    "Hobby reminder: joy is a valid reason to spend time on something.",
    "Sewing prompt: What small project can I finish without overwhelming myself?",
    "Gaming reflection: What cozy moment or idea can I save from today?",
    "Learning tip: repeat basics until they feel natural.",
    "Hobbies are not wasted time. They keep your personality alive.",
  ],
  social: [
    "Connection prompt: Who makes me feel calm, respected, and safe?",
    "Boundary reminder: love should not require losing yourself.",
    "Social idea: send one kind message to someone who matters.",
    "Reflection: What relationship gives me energy, and what relationship drains me?",
    "Reminder: healthy connection feels peaceful, not confusing.",
    "You can care about people and still protect your peace.",
  ],
  curiosities: [
    "Research prompt: What question keeps coming back to my mind?",
    "Curiosity tip: save the idea now, explore it later.",
    "Creative thinking: connect two random topics and see what idea appears.",
    "Reflection: Why does this topic attract me right now?",
    "Learning reminder: curiosity is a sign that your mind is alive.",
    "A random thought can become a project if you give it structure.",
  ],
};

function useLS(key, init) {
  const [v, sv] = useState(() => {
    try {
      const s = localStorage.getItem(key);
      return s ? JSON.parse(s) : init;
    } catch {
      return init;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(v));
    } catch {}
  }, [key, v]);

  return [v, sv];
}

function compressImage(file, maxWidth = 900, quality = 0.68) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const img = new Image();

      img.onload = () => {
        const canvas = document.createElement("canvas");
        const scale = Math.min(maxWidth / img.width, 1);

        canvas.width = img.width * scale;
        canvas.height = img.height * scale;

        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        resolve(canvas.toDataURL("image/jpeg", quality));
      };

      img.onerror = reject;
      img.src = e.target.result;
    };

    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function generateGuide(section, subarea) {
  const base = GUIDE[section.id] || [
    "Start with one small step. You do not need to figure out everything today.",
    "Write what you know, what you feel, and what you want to understand next.",
    "This space is yours. Use it softly, honestly, and without pressure.",
  ];

  const extra = [
    `For ${subarea}, focus on one clear intention today.`,
    `Ask yourself: what would make ${subarea} feel lighter or more organized?`,
    `Save one note, one idea, or one image that represents ${subarea}.`,
    `What is one tiny action that could improve this area of your life today?`,
  ];

  const all = [...base, ...extra];
  return all[Math.floor(Math.random() * all.length)];
}

function MiniCalendar() {
  const [m, setM] = useState(new Date());
  const y = m.getFullYear();
  const mo = m.getMonth();
  const fd = new Date(y, mo, 1).getDay();
  const dim = new Date(y, mo + 1, 0).getDate();
  const tn = new Date().getDate();
  const tm = new Date().getMonth();
  const ty = new Date().getFullYear();
  const cells = [...Array(fd).fill(null), ...Array.from({ length: dim }, (_, i) => i + 1)];

  return (
    <div className="nu" style={{ padding: "16px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px" }}>
        <button onClick={() => setM(new Date(y, mo - 1))} style={{ background: "none", border: "none", cursor: "pointer", color: "#f48fb1", fontSize: "18px" }}>‹</button>
        <span style={{ fontSize: "13px", fontWeight: 700, color: "#7c4d7e" }}>{m.toLocaleString("default", { month: "long" })} {y}</span>
        <button onClick={() => setM(new Date(y, mo + 1))} style={{ background: "none", border: "none", cursor: "pointer", color: "#f48fb1", fontSize: "18px" }}>›</button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: "3px", textAlign: "center" }}>
        {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
          <div key={i} style={{ fontSize: "11px", color: "#f9a8d4", fontWeight: 700, padding: "3px 0" }}>{d}</div>
        ))}

        {cells.map((d, i) => (
          <div
            key={i}
            style={{
              fontSize: "12px",
              padding: "4px 0",
              borderRadius: "50%",
              background: d === tn && mo === tm && y === ty ? "linear-gradient(135deg,#f9a8d4,#c084fc)" : "transparent",
              color: d === tn && mo === tm && y === ty ? "#fff" : d ? "#7c4d7e" : "transparent",
              fontWeight: d === tn && mo === tm && y === ty ? 700 : 400,
            }}
          >
            {d || ""}
          </div>
        ))}
      </div>
    </div>
  );
}

function MoodTracker() {
  const [mood, setMood] = useLS(`bloom_mood_${todayStr}`, null);

  return (
    <div className="nu" style={{ padding: "16px" }}>
      <p style={{ fontSize: "13px", fontWeight: 700, color: "#7c4d7e", marginBottom: "12px" }}>How are you feeling today? 🌸</p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(6,1fr)", gap: "6px" }}>
        {MOODS.map((m) => (
          <button
            key={m.l}
            onClick={() => setMood(m.l)}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "3px",
              padding: "8px 4px",
              borderRadius: "12px",
              border: "none",
              cursor: "pointer",
              background: mood === m.l ? "#fce4ec" : "transparent",
              fontFamily: "Nunito,sans-serif",
            }}
          >
            <span style={{ fontSize: "18px" }}>{m.e}</span>
            <span style={{ fontSize: "10px", color: "#f48fb1", fontWeight: 600 }}>{m.l}</span>
          </button>
        ))}
      </div>

      {mood && <p style={{ textAlign: "center", fontSize: "12px", color: "#f48fb1", marginTop: "8px", fontStyle: "italic" }}>Feeling {mood} today 💕</p>}
    </div>
  );
}

function HabitTracker() {
  const [done, setDone] = useLS(`bloom_habits_${todayStr}`, {});
  const pct = Math.round((Object.values(done).filter(Boolean).length / HABITS.length) * 100);

  return (
    <div className="nu" style={{ padding: "16px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
        <p style={{ fontSize: "13px", fontWeight: 700, color: "#7c4d7e" }}>Today's Habits ✨</p>
        <span style={{ fontSize: "12px", color: "#c084fc", fontWeight: 700 }}>{pct}%</span>
      </div>

      <div style={{ height: "4px", background: "#fce4ec", borderRadius: "99px", marginBottom: "12px", overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${pct}%`, background: "linear-gradient(90deg,#f9a8d4,#c084fc)", borderRadius: "99px", transition: "width .4s" }} />
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
        {HABITS.map((h) => (
          <button
            key={h.id}
            onClick={() => setDone((p) => ({ ...p, [h.id]: !p[h.id] }))}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "8px 10px",
              borderRadius: "12px",
              border: "none",
              cursor: "pointer",
              background: done[h.id] ? "#fce4ec" : "rgba(255,255,255,0.6)",
              fontFamily: "Nunito,sans-serif",
              textAlign: "left",
            }}
          >
            <div
              style={{
                width: "18px",
                height: "18px",
                borderRadius: "50%",
                border: `2px solid ${done[h.id] ? "#f48fb1" : "#fce4ec"}`,
                background: done[h.id] ? "#f48fb1" : "transparent",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              {done[h.id] && <span style={{ color: "#fff", fontSize: "10px", fontWeight: 700 }}>✓</span>}
            </div>

            <span style={{ fontSize: "12px", color: done[h.id] ? "#f9a8d4" : "#7c4d7e", textDecoration: done[h.id] ? "line-through" : "none", fontWeight: 500 }}>{h.l}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function Priorities() {
  const [items, setItems] = useLS(`bloom_prio_${todayStr}`, []);
  const [inp, setInp] = useState("");

  const add = () => {
    if (!inp.trim()) return;
    setItems((p) => [...p, { id: Date.now(), t: inp.trim(), d: false }]);
    setInp("");
  };

  return (
    <div className="nu" style={{ padding: "16px" }}>
      <p style={{ fontSize: "13px", fontWeight: 700, color: "#7c4d7e", marginBottom: "10px" }}>Today's Priorities 🎯</p>

      <div style={{ display: "flex", gap: "6px", marginBottom: "10px" }}>
        <input className="inp" value={inp} onChange={(e) => setInp(e.target.value)} onKeyDown={(e) => e.key === "Enter" && add()} placeholder="Add a priority..." />
        <button className="btn" onClick={add} style={{ background: "linear-gradient(135deg,#f9a8d4,#c084fc)", padding: "8px 14px", flexShrink: 0 }}>+</button>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
        {items.map((item) => (
          <div key={item.id} style={{ display: "flex", alignItems: "center", gap: "8px", padding: "6px 8px", borderRadius: "10px", background: item.d ? "#fdf4ff" : "rgba(255,255,255,0.5)" }}>
            <button onClick={() => setItems((p) => p.map((i) => i.id === item.id ? { ...i, d: !i.d } : i))} style={{ width: "16px", height: "16px", borderRadius: "50%", border: `2px solid ${item.d ? "#c084fc" : "#f9a8d4"}`, background: item.d ? "#c084fc" : "transparent", flexShrink: 0, cursor: "pointer" }} />
            <span style={{ flex: 1, fontSize: "12px", color: item.d ? "#d8b4fe" : "#7c4d7e", textDecoration: item.d ? "line-through" : "none" }}>{item.t}</span>
            <button onClick={() => setItems((p) => p.filter((i) => i.id !== item.id))} style={{ background: "none", border: "none", cursor: "pointer", color: "#f9a8d4", fontSize: "12px" }}>✕</button>
          </div>
        ))}
      </div>
    </div>
  );
}

function BrainDump() {
  const [v, sv] = useLS("bloom_braindump", "");

  return (
    <div className="nu" style={{ padding: "16px" }}>
      <p style={{ fontSize: "13px", fontWeight: 700, color: "#7c4d7e", marginBottom: "4px" }}>Brain Dump 🌀</p>
      <p style={{ fontSize: "11px", color: "#f9a8d4", marginBottom: "10px", fontStyle: "italic" }}>Let it all out, no judgment here...</p>
      <textarea className="inp" rows={5} value={v} onChange={(e) => sv(e.target.value)} placeholder="Dump everything on your mind... thoughts, worries, ideas, dreams ✨" />
    </div>
  );
}

function QuoteWidget() {
  const day = new Date().getDay() + new Date().getDate();
  const q = QUOTES[day % QUOTES.length];

  return (
    <div className="nu pf" style={{ padding: "20px", textAlign: "center" }}>
      <div style={{ fontSize: "28px", marginBottom: "10px" }}>✨</div>
      <p style={{ fontSize: "14px", fontStyle: "italic", color: "#7c4d7e", lineHeight: 1.6, fontWeight: 500 }}>{q}</p>
    </div>
  );
}

function WorkspaceView({ section, subarea, onBack }) {
  const key = `${section.id}_${subarea.replace(/\W/g, "_").toLowerCase()}`;

  const [tab, setTab] = useState("notes");
  const [notes, setNotes] = useLS(`ws_n_${key}`, []);
  const [links, setLinks] = useLS(`ws_l_${key}`, []);
  const [ideas, setIdeas] = useLS(`ws_i_${key}`, []);
  const [imgs, setImgs] = useLS(`ws_g_${key}`, []);
  const [board, setBoard] = useLS(`ws_b_${key}`, []);
  const [guide, setGuide] = useLS(`ws_ai_${key}`, []);

  const [nt, sNt] = useState("");
  const [ntitle, sNtitle] = useState("");
  const [lu, sLu] = useState("");
  const [ltitle, sLtitle] = useState("");
  const [ldesc, sLdesc] = useState("");
  const [ii, sIi] = useState("");
  const [bi, sBi] = useState("");

  const boardRef = useRef(null);

  const addNote = () => {
    if (!nt.trim()) return;
    setNotes((p) => [...p, { id: Date.now(), title: ntitle, body: nt, color: rp(), date: new Date().toLocaleDateString() }]);
    sNt("");
    sNtitle("");
  };

  const addLink = () => {
    if (!lu.trim()) return;
    const url = lu.startsWith("http") ? lu : `https://${lu}`;
    setLinks((p) => [...p, { id: Date.now(), url, title: ltitle || url, desc: ldesc, date: new Date().toLocaleDateString() }]);
    sLu("");
    sLtitle("");
    sLdesc("");
  };

  const addIdea = () => {
    if (!ii.trim()) return;
    setIdeas((p) => [...p, { id: Date.now(), text: ii, color: rp() }]);
    sIi("");
  };

  const addBoardText = () => {
    if (!bi.trim()) return;
    setBoard((p) => [...p, { id: Date.now(), type: "text", text: bi, color: rp(), x: 15 + Math.random() * 45, y: 12 + Math.random() * 45, w: 170 }]);
    sBi("");
  };

  const addGuide = () => {
    setGuide((p) => [{ id: Date.now(), text: generateGuide(section, subarea), date: new Date().toLocaleDateString() }, ...p]);
  };

  const handleGallery = async (e) => {
    try {
      const files = Array.from(e.target.files || []);
      if (!files.length) return;

      const images = await Promise.all(
        files
          .filter((f) => f.type.startsWith("image/"))
          .map(async (f) => ({
            id: Date.now() + Math.random(),
            src: await compressImage(f, 900, 0.68),
            name: f.name,
          }))
      );

      setImgs((p) => [...p, ...images]);
      e.target.value = "";
    } catch {
      alert("No se pudo subir la imagen. Intenta con otra más liviana.");
    }
  };

  const handleBoardImages = async (e) => {
    try {
      const files = Array.from(e.target.files || []);
      if (!files.length) return;

      const images = await Promise.all(
        files
          .filter((f) => f.type.startsWith("image/"))
          .map(async (f) => ({
            id: Date.now() + Math.random(),
            type: "image",
            src: await compressImage(f, 700, 0.66),
            name: f.name,
            x: 8 + Math.random() * 55,
            y: 8 + Math.random() * 50,
            w: 170,
          }))
      );

      setBoard((p) => [...p, ...images]);
      e.target.value = "";
    } catch {
      alert("No se pudo subir la imagen al moodboard.");
    }
  };

  const startDrag = (e, id) => {
    e.preventDefault();
    e.stopPropagation();

    const point = e.touches ? e.touches[0] : e;
    const item = board.find((b) => b.id === id);
    if (!item || !boardRef.current) return;

    const rect = boardRef.current.getBoundingClientRect();
    const startX = point.clientX;
    const startY = point.clientY;
    const ox = item.x;
    const oy = item.y;

    const move = (ev) => {
      const p = ev.touches ? ev.touches[0] : ev;
      const nx = Math.max(0, Math.min(86, ox + ((p.clientX - startX) / rect.width) * 100));
      const ny = Math.max(0, Math.min(86, oy + ((p.clientY - startY) / rect.height) * 100));

      setBoard((prev) => prev.map((b) => b.id === id ? { ...b, x: nx, y: ny } : b));
    };

    const stop = () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseup", stop);
      window.removeEventListener("touchmove", move);
      window.removeEventListener("touchend", stop);
    };

    window.addEventListener("mousemove", move);
    window.addEventListener("mouseup", stop);
    window.addEventListener("touchmove", move, { passive: false });
    window.addEventListener("touchend", stop);
  };

  const Empty = ({ e, t }) => (
    <div style={{ textAlign: "center", padding: "32px 16px" }}>
      <div style={{ fontSize: "32px", marginBottom: "8px" }}>{e}</div>
      <p style={{ fontSize: "12px", color: "#f9a8d4", fontStyle: "italic" }}>{t}</p>
    </div>
  );

  return (
    <div className="nu fadein" style={{ display: "flex", flexDirection: "column", height: "100%", overflow: "hidden" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "14px 16px 8px", borderBottom: "1px solid #fce4ec", flexShrink: 0 }}>
        <button onClick={onBack} style={{ background: "#fce4ec", border: "none", cursor: "pointer", borderRadius: "10px", padding: "6px 10px", color: "#f48fb1", fontSize: "13px", display: "flex", alignItems: "center", gap: "4px" }}>
          <ArrowLeft size={14} /> Back
        </button>

        <div>
          <div style={{ fontSize: "11px", color: "#f9a8d4" }}>{section.emoji} {section.label}</div>
          <h2 className="pf" style={{ fontSize: "18px", color: "#5d3060", fontWeight: 700 }}>{getEmoji(subarea)} {subarea}</h2>
        </div>
      </div>
<div
  className="glass-sm"
  style={{
    margin: "14px 16px 4px",
    padding: "16px",
    flexShrink: 0,
    borderRadius: "20px",
    background: "rgba(255,255,255,0.65)",
    border: "1px solid #fce4ec"
  }}
>
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: "8px",
      marginBottom: "10px"
    }}
  >
    <span style={{ fontSize: "20px" }}>✨</span>

    <h3
      className="pf"
      style={{
        fontSize: "17px",
        color: "#5d3060",
        margin: 0
      }}
    >
      Smart Insight for {subarea}
    </h3>
  </div>

  <p
    style={{
      fontSize: "13px",
      color: "#7c4d7e",
      lineHeight: 1.7,
      margin: 0
    }}
  >
    {generateGuide(section, subarea)}
  </p>
</div>
      <div style={{ display: "flex", gap: "4px", padding: "10px 16px 0", overflowX: "auto", flexShrink: 0 }}>
        {TABS.map((t) => (
          <button
            key={t.k}
            onClick={() => setTab(t.k)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "5px",
              padding: "6px 12px",
              borderRadius: "10px",
              border: "none",
              cursor: "pointer",
              fontSize: "12px",
              fontWeight: 700,
              fontFamily: "Nunito,sans-serif",
              whiteSpace: "nowrap",
              background: tab === t.k ? section.accent : "rgba(255,255,255,0.6)",
              color: tab === t.k ? "#fff" : "#7c4d7e",
            }}
          >
            {t.e} {t.l}
          </button>
        ))}
      </div>

      <div className="scroll fadein" style={{ flex: 1, padding: "14px 16px", overflowY: "auto" }}>
        {tab === "notes" && (
          <div>
            <div className="glass-sm" style={{ padding: "14px", marginBottom: "14px" }}>
              <input className="inp" value={ntitle} onChange={(e) => sNtitle(e.target.value)} placeholder="Note title (optional)..." style={{ marginBottom: "8px" }} />
              <textarea className="inp" rows={4} value={nt} onChange={(e) => sNt(e.target.value)} placeholder="Write your note here... ✨" style={{ marginBottom: "8px" }} />
              <button className="btn" onClick={addNote} style={{ background: `linear-gradient(135deg,${section.accent},#c084fc)` }}>Add Note 📝</button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {notes.map((n) => (
                <div key={n.id} className="card-hover" style={{ padding: "14px", borderRadius: "16px", background: n.color, position: "relative" }}>
                  <button onClick={() => setNotes((p) => p.filter((i) => i.id !== n.id))} style={{ position: "absolute", top: "8px", right: "8px", background: "rgba(255,255,255,0.6)", border: "none", cursor: "pointer", borderRadius: "50%", width: "20px", height: "20px", fontSize: "11px", color: "#f48fb1" }}>✕</button>
                  {n.title && <h4 style={{ fontSize: "13px", fontWeight: 700, color: "#5d3060", marginBottom: "6px" }}>{n.title}</h4>}
                  <p style={{ fontSize: "13px", color: "#7c4d7e", lineHeight: 1.6, whiteSpace: "pre-wrap" }}>{n.body}</p>
                  <p style={{ fontSize: "11px", color: "rgba(124,77,126,0.5)", marginTop: "8px" }}>{n.date}</p>
                </div>
              ))}

              {notes.length === 0 && <Empty e="📝" t="No notes yet. Add your first one." />}
            </div>
          </div>
        )}

        {tab === "links" && (
          <div>
            <div className="glass-sm" style={{ padding: "14px", marginBottom: "14px" }}>
              <input className="inp" value={ltitle} onChange={(e) => sLtitle(e.target.value)} placeholder="Link title..." style={{ marginBottom: "8px" }} />
              <input className="inp" value={lu} onChange={(e) => sLu(e.target.value)} placeholder="URL..." style={{ marginBottom: "8px" }} />
              <input className="inp" value={ldesc} onChange={(e) => sLdesc(e.target.value)} placeholder="Description..." style={{ marginBottom: "8px" }} />
              <button className="btn" onClick={addLink} style={{ background: `linear-gradient(135deg,${section.accent},#c084fc)` }}>Save Link 🔗</button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {links.map((l) => (
                <div key={l.id} className="glass-sm card-hover" style={{ padding: "14px", position: "relative" }}>
                  <button onClick={() => setLinks((p) => p.filter((i) => i.id !== l.id))} style={{ position: "absolute", top: "8px", right: "8px", background: "rgba(255,255,255,0.6)", border: "none", cursor: "pointer", borderRadius: "50%", width: "20px", height: "20px", fontSize: "11px", color: "#f48fb1" }}>✕</button>
                  <h4 style={{ fontSize: "13px", fontWeight: 700, color: "#5d3060", marginBottom: "4px" }}>{l.title}</h4>
                  {l.desc && <p style={{ fontSize: "12px", color: "#7c4d7e", marginBottom: "6px" }}>{l.desc}</p>}
                  <a href={l.url} target="_blank" rel="noopener noreferrer" style={{ fontSize: "12px", color: "#c084fc", wordBreak: "break-all" }}>{l.url}</a>
                </div>
              ))}

              {links.length === 0 && <Empty e="🔗" t="No links saved yet." />}
            </div>
          </div>
        )}

        {tab === "ideas" && (
          <div>
            <div style={{ display: "flex", gap: "6px", marginBottom: "14px" }}>
              <input className="inp" value={ii} onChange={(e) => sIi(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addIdea()} placeholder="Capture a quick idea... 💡" />
              <button className="btn" onClick={addIdea} style={{ background: `linear-gradient(135deg,${section.accent},#c084fc)`, flexShrink: 0, padding: "8px 14px" }}>+</button>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
              {ideas.map((id) => (
                <div key={id.id} className="card-hover" style={{ padding: "14px", borderRadius: "16px", background: id.color, position: "relative" }}>
                  <button onClick={() => setIdeas((p) => p.filter((i) => i.id !== id.id))} style={{ position: "absolute", top: "6px", right: "6px", background: "rgba(255,255,255,0.6)", border: "none", cursor: "pointer", borderRadius: "50%", width: "18px", height: "18px", fontSize: "10px", color: "#f48fb1" }}>✕</button>
                  <div style={{ fontSize: "20px", marginBottom: "6px" }}>💡</div>
                  <p style={{ fontSize: "12px", color: "#7c4d7e", lineHeight: 1.5 }}>{id.text}</p>
                </div>
              ))}

              {ideas.length === 0 && <div style={{ gridColumn: "1/-1" }}><Empty e="💡" t="No ideas yet. Start capturing your sparks." /></div>}
            </div>
          </div>
        )}

        {tab === "gallery" && (
          <div>
            <label className="btn" style={{ background: `linear-gradient(135deg,${section.accent},#c084fc)`, display: "inline-flex", alignItems: "center", gap: "6px", marginBottom: "14px", cursor: "pointer" }}>
              <Upload size={14} /> Upload Images
              <input type="file" accept="image/*" multiple style={{ display: "none" }} onChange={handleGallery} />
            </label>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(140px,1fr))", gap: "12px" }}>
              {imgs.map((img) => (
                <div key={img.id} className="card-hover" style={{ borderRadius: "16px", overflow: "hidden", position: "relative", aspectRatio: "1" }}>
                  <img src={img.src} alt={img.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  <button onClick={() => setImgs((p) => p.filter((i) => i.id !== img.id))} style={{ position: "absolute", top: "6px", right: "6px", background: "rgba(255,255,255,0.85)", border: "none", cursor: "pointer", borderRadius: "50%", width: "22px", height: "22px", fontSize: "11px", color: "#f48fb1" }}>✕</button>
                </div>
              ))}

              {imgs.length === 0 && <div style={{ gridColumn: "1/-1" }}><Empty e="🖼️" t="No images yet. Upload some inspiration." /></div>}
            </div>
          </div>
        )}

        {tab === "board" && (
          <div>
            <div style={{ display: "flex", gap: "6px", marginBottom: "12px", flexWrap: "wrap" }}>
              <input className="inp" value={bi} onChange={(e) => sBi(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addBoardText()} placeholder="Add a quote, vibe, word, goal..." />
              <button className="btn" onClick={addBoardText} style={{ background: `linear-gradient(135deg,${section.accent},#c084fc)` }}>Add Text</button>

              <label className="btn" style={{ background: `linear-gradient(135deg,${section.accent},#c084fc)`, cursor: "pointer" }}>
                Add Images
                <input type="file" accept="image/*" multiple style={{ display: "none" }} onChange={handleBoardImages} />
              </label>
            </div>

            <div ref={boardRef} style={{ position: "relative", height: "520px", borderRadius: "22px", background: "linear-gradient(135deg,#fff7fb,#fdf4ff,#f0f9ff)", border: "1px dashed #f9a8d4", overflow: "hidden" }}>
              {board.map((b) => (
                <div
                  key={b.id}
                  onMouseDown={(e) => startDrag(e, b.id)}
                  onTouchStart={(e) => startDrag(e, b.id)}
                  className="card-hover"
                  style={{
                    position: "absolute",
                    left: `${b.x}%`,
                    top: `${b.y}%`,
                    width: b.w || 160,
                    cursor: "move",
                    zIndex: 2,
                  }}
                >
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setBoard((p) => p.filter((i) => i.id !== b.id));
                    }}
                    style={{
                      position: "absolute",
                      top: "-8px",
                      right: "-8px",
                      zIndex: 4,
                      background: "rgba(255,255,255,.9)",
                      border: "none",
                      borderRadius: "50%",
                      width: "24px",
                      height: "24px",
                      color: "#f48fb1",
                      cursor: "pointer",
                    }}
                  >
                    ✕
                  </button>

                  {b.type === "image" ? (
                    <img src={b.src} alt={b.name} style={{ width: "100%", borderRadius: "18px", boxShadow: "0 8px 20px rgba(0,0,0,.12)", display: "block" }} />
                  ) : (
                    <div style={{ padding: "12px 16px", borderRadius: "18px", background: b.color, color: "#7c4d7e", fontWeight: 700, fontSize: "13px", boxShadow: "0 8px 20px rgba(249,168,212,.18)" }}>
                      {b.text}
                    </div>
                  )}
                </div>
              ))}

              {board.length === 0 && (
                <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", color: "#f9a8d4", fontSize: "13px", fontStyle: "italic", padding: "20px" }}>
                  🎨 Your moodboard is ready. Add images, quotes, colors, memories and ideas.
                </div>
              )}
            </div>
          </div>
        )}

        {tab === "guide" && (
          <div>
            <div className="glass-sm" style={{ padding: "16px", marginBottom: "14px", textAlign: "center" }}>
              <Sparkles size={22} color={section.accent} />
              <h3 className="pf" style={{ fontSize: "18px", color: "#5d3060", margin: "8px 0" }}>{getEmoji(subarea)} Smart Guide</h3>
              <p style={{ fontSize: "12px", color: "#7c4d7e", marginBottom: "12px" }}>
                Generate guidance, reflection prompts, reminders or tips for this space.
              </p>
              <button className="btn" onClick={addGuide} style={{ background: `linear-gradient(135deg,${section.accent},#c084fc)` }}>Generate Message ✨</button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {guide.map((g) => (
                <div key={g.id} className="card-hover" style={{ padding: "16px", borderRadius: "18px", background: "#fff", border: "1px solid #fce4ec", position: "relative" }}>
                  <button onClick={() => setGuide((p) => p.filter((i) => i.id !== g.id))} style={{ position: "absolute", top: "8px", right: "8px", background: "#fce4ec", border: "none", cursor: "pointer", borderRadius: "50%", width: "22px", height: "22px", fontSize: "11px", color: "#f48fb1" }}>✕</button>
                  <p style={{ fontSize: "14px", lineHeight: 1.7, color: "#7c4d7e", paddingRight: "20px" }}>{g.text}</p>
                  <p style={{ fontSize: "11px", color: "#f9a8d4", marginTop: "8px" }}>{g.date}</p>
                </div>
              ))}

              {guide.length === 0 && <Empty e="✨" t="Generate your first message for this space." />}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function SectionView({ section, onBack, onSub }) {
  return (
    <div className="nu fadein scroll" style={{ flex: 1, overflowY: "auto" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "14px 16px 12px", borderBottom: "1px solid #fce4ec" }}>
        <button onClick={onBack} style={{ background: "#fce4ec", border: "none", cursor: "pointer", borderRadius: "10px", padding: "6px 10px", color: "#f48fb1", fontSize: "13px", display: "flex", alignItems: "center", gap: "4px" }}>
          <ArrowLeft size={14} /> Home
        </button>

        <div>
          <h2 className="pf" style={{ fontSize: "20px", color: "#5d3060", fontWeight: 700 }}>{section.emoji} {section.label}</h2>
          <p style={{ fontSize: "11px", color: "#f9a8d4" }}>Choose a workspace to open</p>
        </div>
      </div>

      <div style={{ padding: "16px" }}>
        {section.folders ? (
          section.folders.map((folder) => (
            <div key={folder.id} style={{ marginBottom: "20px" }}>
              <p style={{ fontSize: "12px", fontWeight: 700, color: "#c084fc", marginBottom: "10px", letterSpacing: "0.05em", textTransform: "uppercase" }}>{folder.emoji} {folder.label}</p>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                {folder.subareas.map((sub) => (
                  <button key={sub} onClick={() => onSub(sub)} className="card-hover" style={{ padding: "16px", borderRadius: "16px", border: "none", cursor: "pointer", background: section.color, textAlign: "left", fontFamily: "Nunito,sans-serif" }}>
                    <div style={{ fontSize: "20px", marginBottom: "6px" }}>{getEmoji(sub)}</div>
                    <div style={{ fontSize: "12px", fontWeight: 700, color: "#5d3060", lineHeight: 1.3 }}>{sub}</div>
                  </button>
                ))}
              </div>
            </div>
          ))
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
            {(section.subareas || []).map((sub) => (
              <button key={sub} onClick={() => onSub(sub)} className="card-hover" style={{ padding: "16px", borderRadius: "16px", border: "none", cursor: "pointer", background: section.color, textAlign: "left", fontFamily: "Nunito,sans-serif" }}>
                <div style={{ fontSize: "20px", marginBottom: "6px" }}>{getEmoji(sub)}</div>
                <div style={{ fontSize: "12px", fontWeight: 700, color: "#5d3060", lineHeight: 1.3 }}>{sub}</div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function Dashboard({ onSection }) {
  const [obs, setObs] = useLS("bloom_obs", "");
  const [qnote, setQnote] = useLS("bloom_qnote", "");

  return (
    <div className="nu scroll fadein" style={{ flex: 1, overflowY: "auto", padding: "16px", display: "flex", flexDirection: "column", gap: "14px" }}>
      <div className="glass" style={{ padding: "20px", textAlign: "center", background: "linear-gradient(135deg,rgba(249,168,212,0.2),rgba(192,132,252,0.15))" }}>
        <div style={{ fontSize: "32px", marginBottom: "8px", animation: "float 3s ease-in-out infinite" }}>🌸</div>
        <h1 className="pf" style={{ fontSize: "22px", color: "#5d3060", fontWeight: 700, marginBottom: "4px" }}>Good day, lovely!</h1>
        <p style={{ fontSize: "12px", color: "#c084fc" }}>{new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</p>
      </div>

      <div className="glass"><QuoteWidget /></div>
      <div className="glass"><MoodTracker /></div>
      <div className="glass"><Priorities /></div>
      <div className="glass"><HabitTracker /></div>
      <div className="glass"><MiniCalendar /></div>

      <div className="glass" style={{ padding: "16px" }}>
        <p style={{ fontSize: "13px", fontWeight: 700, color: "#7c4d7e", marginBottom: "4px" }}>Currently Obsessed With 🌟</p>
        <textarea className="inp" rows={3} value={obs} onChange={(e) => setObs(e.target.value)} placeholder="Right now I'm obsessed with..." />
      </div>

      <div className="glass" style={{ padding: "16px" }}>
        <p style={{ fontSize: "13px", fontWeight: 700, color: "#7c4d7e", marginBottom: "8px" }}>Quick Note 🗒️</p>
        <textarea className="inp" rows={3} value={qnote} onChange={(e) => setQnote(e.target.value)} placeholder="Anything quick you don't want to forget..." />
      </div>

      <div className="glass"><BrainDump /></div>

      <div className="glass" style={{ padding: "16px" }}>
        <p style={{ fontSize: "13px", fontWeight: 700, color: "#7c4d7e", marginBottom: "12px" }}>Quick Access ✨</p>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px" }}>
          {NAV.map((s) => (
            <button key={s.id} onClick={() => onSection(s)} className="card-hover" style={{ padding: "12px 8px", borderRadius: "14px", border: "none", cursor: "pointer", background: s.color, textAlign: "center", fontFamily: "Nunito,sans-serif" }}>
              <div style={{ fontSize: "22px", marginBottom: "4px" }}>{s.emoji}</div>
              <div style={{ fontSize: "10px", fontWeight: 700, color: "#5d3060", lineHeight: 1.3 }}>{s.label}</div>
            </button>
          ))}
        </div>
      </div>

      <div style={{ height: "16px" }} />
    </div>
  );
}

function Sidebar({ open, setOpen, onHome, onSection, onSub, currentSection }) {
  const [exp, setExp] = useState({});
  const [fexp, setFexp] = useState({});
  const [q, setQ] = useState("");

  const isMobile = () => window.innerWidth < 768;
  const tog = (id) => setExp((p) => ({ ...p, [id]: !p[id] }));
  const togF = (id) => setFexp((p) => ({ ...p, [id]: !p[id] }));

  const handleCategoryClick = (s) => {
    onSection(s);
    if (open) tog(s.id);
    if (isMobile()) setOpen(false);
  };

  const handleSubClick = (s, sub) => {
    onSub(s, sub);
    if (isMobile()) setOpen(false);
  };

  const handleHomeClick = () => {
    onHome();
    if (isMobile()) setOpen(false);
  };

  return (
    <>
      {open && (
        <div
          onClick={() => setOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.12)",
            zIndex: 15,
            display: window.innerWidth < 768 ? "block" : "none",
          }}
        />
      )}

      <div
        style={{
          width: open ? "240px" : "52px",
          flexShrink: 0,
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: "linear-gradient(180deg,#fdf0f7 0%,#faf0ff 100%)",
          borderRight: "1px solid #fce4ec",
          transition: "width .28s ease, transform .28s ease",
          overflow: "hidden",
          zIndex: 20,
          position: window.innerWidth < 768 ? "fixed" : "relative",
          left: 0,
          top: 0,
          bottom: 0,
          transform: window.innerWidth < 768 && !open ? "translateX(-100%)" : "translateX(0)",
          boxShadow: window.innerWidth < 768 && open ? "8px 0 30px rgba(249,168,212,0.25)" : "none",
        }}
      >
        <div style={{ padding: "14px", display: "flex", alignItems: "center", gap: "10px", borderBottom: "1px solid #fce4ec", flexShrink: 0 }}>
          <div style={{ width: "30px", height: "30px", borderRadius: "50%", background: "linear-gradient(135deg,#f9a8d4,#c084fc)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "15px", flexShrink: 0 }}>🌸</div>
          {open && <span className="pf nu" style={{ fontSize: "20px", fontWeight: 700, color: "#5d3060", letterSpacing: "-0.5px" }}>bloom</span>}
        </div>

        {open && (
          <div style={{ padding: "10px 12px", flexShrink: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: "6px", background: "rgba(255,255,255,0.7)", border: "1px solid #fce4ec", borderRadius: "10px", padding: "6px 10px" }}>
              <Search size={13} color="#f9a8d4" />
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search..." style={{ background: "transparent", border: "none", outline: "none", fontSize: "12px", color: "#7c4d7e", width: "100%", fontFamily: "Nunito,sans-serif" }} />
            </div>
          </div>
        )}

        <nav className="scroll" style={{ flex: 1, overflowY: "auto", padding: "4px 0" }}>
          <button onClick={handleHomeClick} className="nu" style={{ width: "100%", display: "flex", alignItems: "center", gap: "10px", padding: "10px 14px", background: "none", border: "none", cursor: "pointer", color: "#7c4d7e", fontSize: "13px", fontWeight: 600 }}>
            <span style={{ fontSize: "17px", flexShrink: 0 }}>🏠</span>
            {open && <span>Dashboard</span>}
          </button>

          {NAV.map((s) => {
            const match = !q || s.label.toLowerCase().includes(q.toLowerCase()) ||
              (s.subareas || []).some((x) => x.toLowerCase().includes(q.toLowerCase())) ||
              (s.folders || []).some((f) => f.subareas.some((x) => x.toLowerCase().includes(q.toLowerCase())));

            if (!match) return null;

            return (
              <div key={s.id}>
                <button
                  onClick={() => handleCategoryClick(s)}
                  className="nu"
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    padding: "10px 14px",
                    background: currentSection?.id === s.id ? "#fce8f3" : "none",
                    border: "none",
                    cursor: "pointer",
                    color: "#7c4d7e",
                    fontSize: "13px",
                    fontWeight: 600,
                  }}
                >
                  <span style={{ fontSize: "17px", flexShrink: 0 }}>{s.emoji}</span>
                  {open && (
                    <>
                      <span style={{ flex: 1, textAlign: "left" }}>{s.label}</span>
                      {exp[s.id] ? <ChevronDown size={12} color="#f9a8d4" /> : <ChevronRight size={12} color="#f9a8d4" />}
                    </>
                  )}
                </button>

                {open && exp[s.id] && (
                  <div style={{ marginLeft: "28px", borderLeft: "1px solid #fce4ec", paddingLeft: "8px" }}>
                    {s.folders ? s.folders.map((f) => (
                      <div key={f.id}>
                        <button onClick={() => togF(f.id)} className="nu" style={{ width: "100%", display: "flex", alignItems: "center", gap: "6px", padding: "6px 8px", background: "none", border: "none", cursor: "pointer", color: "#c084fc", fontSize: "11px", fontWeight: 700, borderRadius: "8px" }}>
                          <span>{f.emoji}</span>
                          <span style={{ flex: 1, textAlign: "left" }}>{f.label}</span>
                          {fexp[f.id] ? <ChevronDown size={10} /> : <ChevronRight size={10} />}
                        </button>

                        {fexp[f.id] && f.subareas.filter((x) => !q || x.toLowerCase().includes(q.toLowerCase())).map((sub) => (
                          <button key={sub} onClick={() => handleSubClick(s, sub)} className="nu" style={{ display: "block", width: "100%", textAlign: "left", padding: "5px 8px", paddingLeft: "16px", background: "none", border: "none", cursor: "pointer", color: "#9d7fa0", fontSize: "11px", borderRadius: "8px" }}>
                            {getEmoji(sub)} {sub}
                          </button>
                        ))}
                      </div>
                    )) : (s.subareas || []).filter((x) => !q || x.toLowerCase().includes(q.toLowerCase())).map((sub) => (
                      <button key={sub} onClick={() => handleSubClick(s, sub)} className="nu" style={{ display: "block", width: "100%", textAlign: "left", padding: "5px 8px", background: "none", border: "none", cursor: "pointer", color: "#9d7fa0", fontSize: "11px", borderRadius: "8px" }}>
                        {getEmoji(sub)} {sub}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        <button onClick={() => setOpen((p) => !p)} className="nu" style={{ padding: "12px", borderTop: "1px solid #fce4ec", background: "none", border: "none", cursor: "pointer", color: "#f9a8d4", fontSize: "12px", fontWeight: 700 }}>
          {open ? "← collapse" : "→"}
        </button>
      </div>
    </>
  );
}

export default function App() {
  const [page, setPage] = useState("dashboard");
  const [section, setSection] = useState(null);
  const [subarea, setSubarea] = useState(null);
  const [sideOpen, setSideOpen] = useState(window.innerWidth >= 768);

  const goHome = () => {
    setPage("dashboard");
    setSection(null);
    setSubarea(null);
  };

  const goSection = (s) => {
    setSection(s);
    setSubarea(null);
    setPage("section");
  };

  const goSub = (s, sub) => {
    setSection(s);
    setSubarea(sub);
    setPage("workspace");
  };

  const titleMap = {
    dashboard: "🌸 My Bloom Dashboard",
    section: section ? `${section.emoji} ${section.label}` : "",
    workspace: subarea ? `${getEmoji(subarea)} ${subarea}` : "",
  };

  return (
    <div className="nu" style={{ display: "flex", height: "100vh", overflow: "hidden", position: "relative", background: "linear-gradient(135deg,#fdf0f7 0%,#faf0ff 50%,#f0f7ff 100%)" }}>
      <style>{STYLE}</style>

      <div className="blob" style={{ top: "-80px", right: "-80px", width: "320px", height: "320px", background: "radial-gradient(circle,rgba(249,168,212,0.18) 0%,transparent 70%)" }} />
      <div className="blob" style={{ bottom: "-80px", left: "-60px", width: "280px", height: "280px", background: "radial-gradient(circle,rgba(192,132,252,0.12) 0%,transparent 70%)" }} />
      <div className="blob" style={{ top: "40%", right: "10%", width: "200px", height: "200px", background: "radial-gradient(circle,rgba(251,191,36,0.08) 0%,transparent 70%)" }} />

      <Sidebar open={sideOpen} setOpen={setSideOpen} onHome={goHome} onSection={goSection} onSub={goSub} currentSection={section} />

      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", position: "relative", zIndex: 1, width: "100%" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 16px", borderBottom: "1px solid #fce4ec", background: "rgba(255,255,255,0.6)", backdropFilter: "blur(12px)", flexShrink: 0 }}>
          <button onClick={() => setSideOpen((p) => !p)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: "18px", color: "#f48fb1", padding: "4px", lineHeight: 1 }}>☰</button>
          <h1 className="pf" style={{ fontSize: "17px", color: "#5d3060", fontWeight: 700, flex: 1 }}>{titleMap[page]}</h1>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <button style={{ background: "none", border: "none", cursor: "pointer", fontSize: "16px", color: "#f48fb1" }}>🔔</button>
            <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "linear-gradient(135deg,#f9a8d4,#c084fc)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px", cursor: "pointer" }}>🌸</div>
          </div>
        </div>

        <div style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" }}>
          {page === "dashboard" && <Dashboard onSection={goSection} />}
          {page === "section" && section && <SectionView section={section} onBack={goHome} onSub={(sub) => goSub(section, sub)} />}
          {page === "workspace" && section && subarea && <WorkspaceView section={section} subarea={subarea} onBack={() => { setSubarea(null); setPage("section"); }} />}
        </div>
      </div>
    </div>
  );
}
