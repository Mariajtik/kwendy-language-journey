/**
 * PasswordInput.tsx
 * Reusable password field with show/hide toggle and visual strength meter.
 * Strength: 0 (vazio) | 1 fraca | 2 média | 3 forte
 */

import { useMemo, useState } from "react";
import { Eye, EyeOff } from "lucide-react";

interface PasswordInputProps {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  showStrength?: boolean;
  className?: string;
}

export function getPasswordStrength(pwd: string): 0 | 1 | 2 | 3 {
  if (!pwd) return 0;
  let score = 0;
  if (pwd.length >= 6) score++;
  if (pwd.length >= 10) score++;
  const variety =
    (/[a-z]/.test(pwd) ? 1 : 0) +
    (/[A-Z]/.test(pwd) ? 1 : 0) +
    (/[0-9]/.test(pwd) ? 1 : 0) +
    (/[^a-zA-Z0-9]/.test(pwd) ? 1 : 0);
  if (variety >= 3) score++;
  return Math.min(score, 3) as 0 | 1 | 2 | 3;
}

const LABELS = ["", "Fraca", "Média", "Forte"];
const COLORS = [
  "transparent",
  "hsl(var(--destructive))",
  "hsl(var(--kwendi-yellow))",
  "hsl(var(--kwendi-green))",
];

const PasswordInput = ({
  value,
  onChange,
  placeholder = "Senha",
  showStrength = true,
  className = "",
}: PasswordInputProps) => {
  const [visible, setVisible] = useState(false);
  const strength = useMemo(() => getPasswordStrength(value), [value]);

  return (
    <div className={`w-full ${className}`}>
      <div className="relative">
        <input
          className="input-duo pr-12"
          type={visible ? "text" : "password"}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-muted-foreground hover:text-foreground"
          aria-label={visible ? "Ocultar senha" : "Mostrar senha"}
        >
          {visible ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
        </button>
      </div>

      {showStrength && value.length > 0 && (
        <div className="mt-2 flex items-center gap-2">
          <div className="flex-1 flex gap-1">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-1.5 flex-1 rounded-full transition-colors"
                style={{
                  background:
                    strength >= i ? COLORS[strength] : "hsl(var(--muted))",
                }}
              />
            ))}
          </div>
          <span
            className="text-xs font-bold w-12 text-right"
            style={{ color: COLORS[strength] }}
          >
            {LABELS[strength]}
          </span>
        </div>
      )}
    </div>
  );
};

export default PasswordInput;