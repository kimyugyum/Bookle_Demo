'use client';

import { useState, useRef, useEffect } from 'react';
import { Button, Input, StepShell, BookleLogo } from '@/components/ui';

interface VerifyStepProps {
  onNext: (phone: string) => void;
  onBack: () => void;
}

export function VerifyStep({ onNext, onBack }: VerifyStepProps) {
  const [phone, setPhone] = useState('');
  const [codeSent, setCodeSent] = useState(false);
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(180);
  const [verified, setVerified] = useState(false);
  const [sending, setSending] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Countdown timer
  useEffect(() => {
    if (!codeSent || timer <= 0 || verified) return;
    const t = setInterval(() => setTimer((p) => p - 1), 1000);
    return () => clearInterval(t);
  }, [codeSent, timer, verified]);

  const formatPhone = (v: string) => {
    const digits = v.replace(/\D/g, '').slice(0, 11);
    if (digits.length <= 3) return digits;
    if (digits.length <= 7) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
    return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
  };

  const handleSendCode = async () => {
    setSending(true);
    await new Promise((r) => setTimeout(r, 1200));
    setSending(false);
    setCodeSent(true);
    setTimer(180);
  };

  const handleCodeChange = (idx: number, val: string) => {
    if (!/^\d*$/.test(val)) return;
    const next = [...code];
    next[idx] = val.slice(-1);
    setCode(next);
    if (val && idx < 5) inputRefs.current[idx + 1]?.focus();
    // Auto-verify when all 6 digits entered
    if (next.every((d) => d !== '') && next.join('') === '123456') {
      setVerifying(true);
      setTimeout(() => {
        setVerifying(false);
        setVerified(true);
      }, 800);
    }
  };

  const handleKeyDown = (idx: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !code[idx] && idx > 0) {
      inputRefs.current[idx - 1]?.focus();
    }
  };

  const mmss = `${String(Math.floor(timer / 60)).padStart(2, '0')}:${String(timer % 60).padStart(2, '0')}`;

  return (
    <StepShell step={3} totalSteps={5} onBack={onBack}
      stepLabels={['회원가입', '인증', '취향', '책 등록', '매칭']}
    >
      <div className="space-y-6 animate-fade-in-up">
        <div className="space-y-1">
          <BookleLogo size="sm" />
          <h2 className="text-xl font-bold text-[#111827]">본인 인증</h2>
          <p className="text-sm text-[#6B7280]">안전한 거래를 위해 휴대폰을 인증해 주세요</p>
        </div>

        {/* Phone input */}
        <div className="flex gap-2">
          <div className="flex-1">
            <Input
              label="휴대폰 번호"
              placeholder="010-0000-0000"
              value={phone}
              onChange={(e) => setPhone(formatPhone(e.target.value))}
              disabled={codeSent}
              type="tel"
            />
          </div>
          <div className="pt-6">
            <Button
              variant={codeSent ? 'secondary' : 'primary'}
              size="md"
              onClick={handleSendCode}
              loading={sending}
              disabled={phone.replace(/\D/g, '').length < 11}
              className="whitespace-nowrap"
            >
              {codeSent ? '재전송' : '인증번호 발송'}
            </Button>
          </div>
        </div>

        {/* Code input */}
        {codeSent && (
          <div className="space-y-3 animate-fade-in-up">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-[#374151]">인증번호 (6자리)</label>
              {!verified && (
                <span className={`text-sm font-mono font-semibold ${timer < 30 ? 'text-red-500' : 'text-[#1A6B3C]'}`}>
                  {mmss}
                </span>
              )}
            </div>
            <div className="flex gap-2">
              {code.map((digit, idx) => (
                <input
                  key={idx}
                  ref={(el) => { inputRefs.current[idx] = el; }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleCodeChange(idx, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(idx, e)}
                  disabled={verified}
                  className={`w-full aspect-square text-center text-lg font-bold rounded-xl border-2 transition-all duration-200
                    ${verified
                      ? 'border-[#1A6B3C] bg-[#E8F5EE] text-[#1A6B3C]'
                      : digit
                      ? 'border-[#1A6B3C] bg-white text-[#111827]'
                      : 'border-[#E5E7EB] bg-white text-[#111827]'}
                    focus:border-[#1A6B3C] focus:ring-2 focus:ring-[#1A6B3C]/15`}
                />
              ))}
            </div>
            <p className="text-xs text-[#9CA3AF]">
              {verified ? '✅ 인증 완료!' : '데모용 인증번호: 123456'}
            </p>
          </div>
        )}

        {/* Trust badges */}
        <div className="flex gap-3 p-3 rounded-2xl bg-[#F9FAFB] border border-[#E5E7EB]">
          {[
            { icon: '🔒', text: '개인정보 암호화' },
            { icon: '✅', text: '실명 인증' },
            { icon: '🛡️', text: '안전 거래 보장' },
          ].map((b) => (
            <div key={b.text} className="flex-1 flex flex-col items-center gap-1">
              <span className="text-lg">{b.icon}</span>
              <span className="text-xs text-[#6B7280] text-center">{b.text}</span>
            </div>
          ))}
        </div>

        <Button
          size="lg"
          disabled={!verified}
          loading={verifying}
          onClick={() => onNext(phone)}
        >
          {verified ? '다음으로' : '인증을 완료해 주세요'}
        </Button>
      </div>
    </StepShell>
  );
}
