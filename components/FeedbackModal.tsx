"use client";

import { useEffect, useState } from "react";

const FIRST_VISIT_KEY = "feedback-modal-first-visit";
const DISMISSED_KEY = "feedback-modal-dismissed";
const TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000;

export default function FeedbackModal() {
  const [visible, setVisible] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    try {
      // Already seen and dismissed — never show again
      if (localStorage.getItem(DISMISSED_KEY)) return;

      const firstVisit = localStorage.getItem(FIRST_VISIT_KEY);

      if (!firstVisit) {
        // Very first visit: record timestamp, do NOT show yet
        localStorage.setItem(FIRST_VISIT_KEY, String(Date.now()));
        return;
      }

      // Show only after 24 hours have passed since first visit
      if (Date.now() - Number(firstVisit) >= TWENTY_FOUR_HOURS) {
        setVisible(true);
      }
    } catch {
      // localStorage unavailable (e.g. private browsing with strict settings)
    }
  }, []);

  function dismiss() {
    try {
      localStorage.setItem(DISMISSED_KEY, "1");
    } catch {
      // ignore
    }
    setVisible(false);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!feedback.trim()) return;

    const subject = encodeURIComponent("Situation Monitor — Geri Bildirim");
    const body = encodeURIComponent(feedback.trim());
    window.open(`mailto:aydinbahadirtuna@gmail.com?subject=${subject}&body=${body}`, "_blank");

    setSubmitted(true);
    setTimeout(dismiss, 1500);
  }

  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      style={{ background: "rgba(3,7,18,0.80)", backdropFilter: "blur(4px)" }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="feedback-title"
        className="relative w-full max-w-md bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl p-6 flex flex-col gap-5 animate-fade-in"
      >
        {/* Close */}
        <button
          onClick={dismiss}
          aria-label="Kapat"
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-200 transition-colors"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M2 2l14 14M16 2 2 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>

        {/* Header */}
        <div className="flex flex-col gap-1 pr-6">
          <h2 id="feedback-title" className="text-base font-semibold text-gray-100">
            Merhaba 👋
          </h2>
          <p className="text-sm text-gray-400 leading-relaxed">
            Situation Monitor'u kullandığın için teşekkürler. Eklememi istediğin bir özellik ya da
            beğenmediğin bir şey varsa duymak isterim.
          </p>
        </div>

        {/* Contact */}
        <div className="flex flex-col gap-2 bg-gray-800/60 rounded-xl p-4 text-sm">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">İletişim</p>
          <a
            href="mailto:aydinbahadirtuna@gmail.com"
            className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="4" width="20" height="16" rx="2" />
              <path d="m2 7 10 7 10-7" />
            </svg>
            aydinbahadirtuna@gmail.com
          </a>
          <a
            href="https://x.com/IchBinBaho"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
          >
            <svg width="15" height="15" viewBox="0 0 1200 1227" fill="currentColor">
              <path d="M714.163 519.284 1160.89 0h-105.86L667.137 450.887 357.328 0H0l468.492 681.821L0 1226.37h105.866l409.625-476.152 327.181 476.152H1200L714.137 519.284h.026ZM569.165 687.828l-47.468-67.894-377.686-540.24h162.604l304.797 435.991 47.468 67.894 396.2 566.721H892.476L569.165 687.854v-.026Z" />
            </svg>
            @IchBinBaho
          </a>
          <a
            href="https://github.com/AydinTuna"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2Z" />
            </svg>
            AydinTuna
          </a>
        </div>

        {/* Form */}
        {submitted ? (
          <p className="text-sm text-emerald-400 text-center py-2">
            Teşekkürler! E-posta istemcin açılıyor…
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Önerinizi ya da şikayetinizi buraya yazın…"
              rows={3}
              className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-sm text-gray-100 placeholder-gray-600 resize-none focus:outline-none focus:border-gray-500 transition-colors"
            />
            <div className="flex items-center gap-3">
              <button
                type="submit"
                disabled={!feedback.trim()}
                className="flex-1 bg-white text-gray-900 font-medium text-sm rounded-xl py-2.5 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Gönder
              </button>
              <button
                type="button"
                onClick={dismiss}
                className="flex-1 text-sm text-gray-500 hover:text-gray-300 transition-colors py-2.5"
              >
                Şimdi değil
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
