'use client';

import { useState, useRef, useEffect } from 'react';
import { X, Send, ArrowLeftRight, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ChatPartner {
  name: string;
  theirBook: string;
  myBook: string;
}

interface Message {
  id: number;
  from: 'me' | 'them';
  text: string;
  time: string;
}

const AVATAR_COLORS = ['#7C3AED', '#DB2777', '#0284C7', '#D97706', '#059669'];
function nameColor(name: string) {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) | 0;
  return AVATAR_COLORS[Math.abs(h) % AVATAR_COLORS.length];
}

const INITIAL_MESSAGES: Message[] = [
  { id: 1, from: 'them', text: '안녕하세요! 교환 수락해주셔서 감사해요 😊', time: '오전 10:32' },
  { id: 2, from: 'me',   text: '반갑습니다! 책 상태가 정말 좋더라고요', time: '오전 10:34' },
  { id: 3, from: 'them', text: '네, 정말 아끼던 책인데 좋은 분께 가길 잘 됐네요. 배송은 어떻게 하실 건가요?', time: '오전 10:35' },
  { id: 4, from: 'me',   text: '편의점 택배 이용하려고요! 운임은 반반 어떠세요?', time: '오전 10:37' },
  { id: 5, from: 'them', text: '좋아요! 주소 공유해드릴게요 📦', time: '오전 10:38' },
];

const AUTO_REPLIES = [
  '알겠습니다! 확인했어요 😊',
  '네, 좋아요!',
  '감사합니다 🙏',
  '조금만 기다려 주세요!',
];

export function ChatModal({ partner, onClose }: { partner: ChatPartner; onClose: () => void }) {
  const [messages, setMessages]   = useState<Message[]>(INITIAL_MESSAGES);
  const [input, setInput]         = useState('');
  const [expanded, setExpanded]   = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragDelta, setDragDelta] = useState(0);
  const [replyIdx, setReplyIdx]   = useState(0);
  const dragStartY = useRef(0);
  const baseOffset = useRef(0);
  const bottomRef  = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const onDragStart = (e: React.TouchEvent) => {
    dragStartY.current = e.touches[0].clientY;
    baseOffset.current = expanded ? 0 : window.innerHeight * 0.20;
    setIsDragging(true);
  };

  const onDragMove = (e: React.TouchEvent) => {
    const delta = e.touches[0].clientY - dragStartY.current;
    setDragDelta(Math.max(-baseOffset.current, delta));
  };

  const onDragEnd = (e: React.TouchEvent) => {
    setIsDragging(false);
    const delta = e.changedTouches[0].clientY - dragStartY.current;
    if (delta < -60) setExpanded(true);
    else if (delta > 80) {
      if (expanded) setExpanded(false);
      else onClose();
    }
    setDragDelta(0);
  };

  const now = () =>
    new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', hour12: true });

  const sendMessage = () => {
    if (!input.trim()) return;
    const text = input.trim();
    setMessages((prev) => [...prev, { id: Date.now(), from: 'me', text, time: now() }]);
    setInput('');
    setTimeout(() => {
      setMessages((prev) => [...prev, {
        id: Date.now() + 1,
        from: 'them',
        text: AUTO_REPLIES[replyIdx % AUTO_REPLIES.length],
        time: now(),
      }]);
      setReplyIdx((i) => i + 1);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-60 overflow-hidden" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40" />
      <div
        className="absolute bottom-0 left-0 right-0 max-w-md mx-auto h-[92dvh] bg-white rounded-t-3xl flex flex-col will-change-transform"
        style={{
          transform: `translateY(calc(${expanded ? 0 : 20}dvh + ${dragDelta}px))`,
          transition: isDragging ? 'none' : 'transform 0.35s cubic-bezier(0.32, 0.72, 0, 1)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 핸들 */}
        <div
          className="shrink-0 pt-3 pb-2 flex flex-col items-center touch-none cursor-grab active:cursor-grabbing"
          onTouchStart={onDragStart}
          onTouchMove={onDragMove}
          onTouchEnd={onDragEnd}
          onClick={() => { setExpanded((v) => !v); setDragDelta(0); }}
        >
          <div className="w-10 h-1 rounded-full bg-[#E5E7EB]" />
          <ChevronDown
            size={14}
            className={cn('text-[#D1D5DB] mt-1 transition-transform duration-300', expanded && 'rotate-180')}
          />
        </div>

        {/* 헤더 */}
        <div className="shrink-0 px-5 py-3 border-b border-[#F3F4F6] flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-2xl flex items-center justify-center text-white font-bold text-base shrink-0"
            style={{ background: nameColor(partner.name) }}
          >
            {partner.name[0]}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-[#111827]">{partner.name}</p>
            <div className="flex items-center gap-1 text-[10px] text-[#9CA3AF] mt-0.5">
              <span className="truncate max-w-[80px]">{partner.myBook}</span>
              <ArrowLeftRight size={9} className="shrink-0" />
              <span className="truncate max-w-[80px]">{partner.theirBook}</span>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-[#9CA3AF] shrink-0">
            <X size={20} />
          </button>
        </div>

        {/* 메시지 리스트 */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 min-h-0">
          <p className="text-center text-[10px] text-[#D1D5DB] mb-2">교환이 수락된 후 대화가 시작됐어요</p>
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={cn('flex gap-2 items-end', msg.from === 'me' ? 'flex-row-reverse' : 'flex-row')}
            >
              {msg.from === 'them' && (
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center text-white text-[10px] font-bold shrink-0 mb-1"
                  style={{ background: nameColor(partner.name) }}
                >
                  {partner.name[0]}
                </div>
              )}
              <div className={cn('max-w-[72%] flex flex-col gap-0.5', msg.from === 'me' ? 'items-end' : 'items-start')}>
                <div
                  className={cn(
                    'px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed',
                    msg.from === 'me'
                      ? 'bg-[#1A6B3C] text-white rounded-br-md'
                      : 'bg-[#F3F4F6] text-[#111827] rounded-bl-md'
                  )}
                >
                  {msg.text}
                </div>
                <span className="text-[9px] text-[#D1D5DB]">{msg.time}</span>
              </div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        {/* 입력 */}
        <div className="shrink-0 px-4 py-3 border-t border-[#F3F4F6] bg-white flex gap-2 items-center">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') sendMessage(); }}
            placeholder="메시지를 입력하세요..."
            className="flex-1 h-10 bg-[#F3F4F6] rounded-xl px-3 text-sm text-[#111827] placeholder:text-[#9CA3AF] focus:outline-none"
          />
          <button
            onClick={sendMessage}
            disabled={!input.trim()}
            className="w-10 h-10 rounded-xl bg-[#1A6B3C] text-white flex items-center justify-center disabled:opacity-40 transition-opacity shrink-0"
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
