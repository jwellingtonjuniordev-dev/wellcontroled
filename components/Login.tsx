"use client";
import {
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  ShieldCheck,
  Target,
  TrendingUp,
} from "lucide-react";
import { useState, type FormEvent } from "react";
import { Brand } from "./Brand";
import { ThemeButton } from "./ThemeButton";
export function Login({
  onLogin,
  onRegister,
  loading = false,
  realAuth = false,
  theme,
  onTheme,
}: {
  onLogin: (email: string, password: string) => Promise<void> | void;
  onRegister?: (email: string, password: string) => Promise<void> | void;
  loading?: boolean;
  realAuth?: boolean;
  theme: "light" | "dark";
  onTheme: () => void;
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [register, setRegister] = useState(false);
  const [error, setError] = useState("");
  async function submit(e: FormEvent) {
    e.preventDefault();
    if (!email.includes("@") || password.length < (realAuth ? 8 : 4)) {
      setError(
        `Introduza um e-mail válido e uma senha com pelo menos ${realAuth ? 8 : 4} caracteres.`,
      );
      return;
    }
    setError("");
    try {
      if (register && onRegister) await onRegister(email, password);
      else await onLogin(email, password);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Não foi possível autenticar.",
      );
    }
  }
  return (
    <main className="login-page">
      <section className="login-promo">
        <div className="promo-top">
          <Brand />
        </div>
        <div className="promo-main">
          <h1>
            Controle suas finanças.
            <br />
            Conquiste seus <em>objetivos.</em>
          </h1>
          <p>
            Um lugar para acompanhar o seu dinheiro, organizar despesas e
            planear o futuro.
          </p>
          <div className="promo-features">
            <div>
              <ShieldCheck size={21} />
              <span>Segurança e confiança</span>
            </div>
            <div>
              <TrendingUp size={21} />
              <span>Acompanhe o seu progresso</span>
            </div>
            <div>
              <Target size={21} />
              <span>Conquiste as suas metas</span>
            </div>
          </div>
        </div>
        <div className="promo-bottom">PLANEIE · CONTROLE · REALIZE</div>
      </section>
      <section className="login-form-area">
        <div className="login-theme">
          <ThemeButton theme={theme} onToggle={onTheme} />
        </div>
        <form className="login-form" onSubmit={submit}>
          <div className="login-mobile-brand">
            <Brand />
          </div>
          <div className="form-icon">
            <LockKeyhole size={26} />
          </div>
          <h2>Bem-vindo de volta!</h2>
          <p>Aceda à sua conta WellControled.</p>
          <label htmlFor="email">E-mail</label>
          <div className="input-wrap">
            <Mail size={18} />
            <input
              id="email"
              type="email"
              placeholder="seu@email.com"
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <label htmlFor="password">Senha</label>
          <div className="input-wrap">
            <LockKeyhole size={18} />
            <input
              id="password"
              type={show ? "text" : "password"}
              placeholder="••••••••"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              aria-label={show ? "Ocultar senha" : "Mostrar senha"}
              onClick={() => setShow(!show)}
            >
              {show ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {error && (
            <p className="error-msg" role="alert">
              {error}
            </p>
          )}
          <button
            className="primary-button full"
            type="submit"
            disabled={loading}
          >
            {loading
              ? "A processar..."
              : register
                ? "Criar conta"
                : "Entrar na conta"}
          </button>
          {realAuth ? (
            <div className="demo-note">
              <button
                type="button"
                className="link-button"
                onClick={() => setRegister(!register)}
              >
                {register ? "Já tem conta? Entrar" : "Não tem conta? Registar"}
              </button>
            </div>
          ) : (
            <div className="demo-note">
              Modo demonstração: utilize apenas dados fictícios.
            </div>
          )}
        </form>
        <p className="login-footer">© WellControled · Controle suas finanças</p>
      </section>
    </main>
  );
}
