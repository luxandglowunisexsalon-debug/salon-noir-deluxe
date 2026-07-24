import { useState, useMemo } from "react";
import { Eye, EyeOff, Check, X } from "lucide-react";

export interface PasswordRule {
  id: string;
  label: string;
  test: (v: string) => boolean;
}

export const DEFAULT_RULES: PasswordRule[] = [
  { id: "len", label: "At least 8 characters", test: (v) => v.length >= 8 },
  { id: "upper", label: "One uppercase letter (A–Z)", test: (v) => /[A-Z]/.test(v) },
  { id: "lower", label: "One lowercase letter (a–z)", test: (v) => /[a-z]/.test(v) },
  { id: "num", label: "One number (0–9)", test: (v) => /\d/.test(v) },
  { id: "sym", label: "One symbol (!@#$…)", test: (v) => /[^A-Za-z0-9]/.test(v) },
];

export function scorePassword(v: string, rules = DEFAULT_RULES) {
  const passed = rules.filter((r) => r.test(v)).length;
  let score = passed; // 0..5
  if (v.length >= 12) score = Math.min(5, score + 1);
  if (/(.)\1\1/.test(v)) score = Math.max(0, score - 1); // repeated chars
  return Math.min(5, score);
}

const LABELS = ["Too weak", "Weak", "Fair", "Good", "Strong", "Excellent"];
const COLORS = [
  "bg-destructive",
  "bg-destructive/80",
  "bg-amber-500",
  "bg-yellow-500",
  "bg-emerald-500",
  "bg-emerald-600",
];

export function PasswordField({
  label,
  value,
  onChange,
  placeholder,
  required,
  autoComplete = "new-password",
  showStrength = false,
  rules = DEFAULT_RULES,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  required?: boolean;
  autoComplete?: string;
  showStrength?: boolean;
  rules?: PasswordRule[];
}) {
  const [visible, setVisible] = useState(false);
  const score = useMemo(() => scorePassword(value, rules), [value, rules]);
  const results = useMemo(() => rules.map((r) => ({ ...r, ok: r.test(value) })), [value, rules]);

  return (
    <div className="block">
      <label className="block">
        <span className="eyebrow">{label}</span>
        <div className="relative">
          <input
            type={visible ? "text" : "password"}
            required={required}
            autoComplete={autoComplete}
            value={value}
            placeholder={placeholder}
            onChange={(e) => onChange(e.target.value)}
            className="mt-2 w-full border-b border-border bg-transparent py-3 pr-10 text-sm text-charcoal outline-none transition placeholder:text-muted-foreground/60 focus:border-charcoal"
          />
          <button
            type="button"
            onClick={() => setVisible((v) => !v)}
            aria-label={visible ? "Hide password" : "Show password"}
            className="absolute right-0 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center text-muted-foreground transition hover:text-charcoal"
            tabIndex={-1}
          >
            {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </label>

      {showStrength && (
        <div className="mt-3 space-y-3">
          <div className="flex items-center gap-2">
            <div className="flex flex-1 gap-1">
              {[0, 1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className={`h-1 flex-1 rounded transition-colors ${
                    value && i < score ? COLORS[score] : "bg-border"
                  }`}
                />
              ))}
            </div>
            <span
              className={`text-[10px] tracking-[0.2em] uppercase ${
                value ? "text-charcoal" : "text-muted-foreground"
              }`}
            >
              {value ? LABELS[score] : "—"}
            </span>
          </div>

          <ul className="grid grid-cols-1 gap-1.5 sm:grid-cols-2">
            {results.map((r) => (
              <li
                key={r.id}
                className={`flex items-center gap-2 text-[11px] transition ${
                  r.ok ? "text-emerald-700" : "text-muted-foreground"
                }`}
              >
                <span
                  className={`grid h-4 w-4 place-items-center rounded-full border ${
                    r.ok ? "border-emerald-600 bg-emerald-50" : "border-border bg-transparent"
                  }`}
                >
                  {r.ok ? <Check className="h-2.5 w-2.5" /> : <X className="h-2.5 w-2.5 opacity-40" />}
                </span>
                <span>{r.label}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export function isPasswordStrong(v: string, rules = DEFAULT_RULES) {
  return rules.every((r) => r.test(v));
}
