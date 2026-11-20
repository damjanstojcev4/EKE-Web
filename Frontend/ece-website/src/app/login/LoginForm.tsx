"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ApiError, getCurrentAdmin, login } from "@/lib/admin-api";
import s from "./login.module.css";

function Eye({ visible }: { visible: boolean }) {
  return <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/>{visible && <path d="m3 3 18 18"/>}</svg>;
}

export default function LoginForm() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [visible, setVisible] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const errorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let active = true;
    void getCurrentAdmin().then(() => { if (active) router.replace("/admin/"); }).catch(() => {
      // An expired or absent session is expected on the sign-in page.
    });
    return () => { active = false; };
  }, [router]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    setError(""); setBusy(true);
    try {
      await login(username.trim(), password);
      setPassword(""); setVisible(false);
      router.replace("/admin/");
    } catch (cause) {
      setPassword(""); setVisible(false);
      setError(cause instanceof ApiError && cause.status === 401
        ? "The username or password is incorrect. Please try again."
        : cause instanceof Error ? cause.message : "Unable to sign in. Please try again.");
      requestAnimationFrame(() => errorRef.current?.focus());
    } finally { setBusy(false); }
  }

  return <main className={s.page} data-text-reveal="off">
    <section className={s.story} aria-label="EKE workspace">
      <Link href="/" className={s.logo} aria-label="EKE homepage"><img src="/assets/eke-logo-symbol.svg" alt=""/><img src="/assets/eke-logo-wordmark.svg" alt="EKE"/></Link>
      <div className={s.storyText}><span className={s.eyebrow}>EKE · CONTENT & COMMUNITY</span><h1>Good things<br/>start with <em>you.</em></h1><p>A space for your projects, stories and the communities you bring together.</p></div>
      <div className={s.art} aria-hidden="true"><span/><span/><span/></div>
      <p className={s.motto}>Empowering communities. Creating opportunities.</p>
    </section>
    <section className={s.formSection} aria-labelledby="login-heading">
      <Link className={s.back} href="/">← Back to website</Link>
      <div className={s.formWrap}>
        <span className={s.workspace}>ADMIN WORKSPACE</span>
        <h2 id="login-heading">Welcome back.</h2>
        <p className={s.intro}>Sign in to manage EKE’s projects, news and messages.</p>
        <form onSubmit={submit} aria-busy={busy}>
          {error && <div ref={errorRef} tabIndex={-1} className={s.error} role="alert">{error}</div>}
          <label htmlFor="username">Username</label>
          <input id="username" name="username" autoComplete="username" autoCapitalize="none" spellCheck={false} maxLength={100} required value={username} onChange={event => setUsername(event.target.value)} disabled={busy} placeholder="Enter your username"/>
          <label htmlFor="password">Password</label>
          <div className={s.password}>
            <input id="password" name="password" type={visible ? "text" : "password"} autoComplete="current-password" required value={password} onChange={event => setPassword(event.target.value)} disabled={busy} placeholder="Enter your password"/>
            <button type="button" className={s.eye} aria-label={visible ? "Hide password" : "Show password"} aria-pressed={visible} aria-controls="password" onClick={() => setVisible(current => !current)} disabled={busy}><Eye visible={visible}/></button>
          </div>
          <button className={s.submit} type="submit" disabled={busy}>{busy ? "Signing in…" : "Sign in"}<span aria-hidden="true">↗</span></button>
          <p className={s.access}>Access is for EKE administrators. Contact your workspace administrator if you need an account or password assistance.</p>
        </form>
      </div>
      <footer className={s.footer}>EKE · European Cultural Epicenter, Bitola</footer>
    </section>
  </main>;
}
