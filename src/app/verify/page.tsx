"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

type Phase = "idle" | "posting" | "ok" | "error";

export default function VerifyPage() {
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>("idle");
  const [msg, setMsg] = useState<string>("Ingresa para verificar tu correo.");
  const [resending, setResending] = useState(false);

  // Read token/email from the URL fragment so scanners can't see them
  const { token, email } = useMemo(() => {
    const params = new URLSearchParams(
      (typeof window !== "undefined" ? window.location.hash : "").replace(/^#/, "")
    );
    return {
      token: params.get("token") ?? "",
      email: params.get("email") ?? "",
    };
  }, []);

  // Optional: require a cookie set during signup to reduce false clicks
  function hasSignupCookie() {
    return typeof document !== "undefined" && document.cookie.includes("signup_started=1");
  }

  async function handleVerifyClick(e: React.MouseEvent<HTMLButtonElement>) {
    // Gate on a real user gesture
    if (!e.isTrusted) return; // ignore synthetic
    // Some scanners fire click events; require active user


    if (!token) {
      setPhase("error");
      setMsg("Falta el token de verificación.");
      return;
    }
    // Optional cookie check
    if (!hasSignupCookie()) {
      setPhase("error");
      setMsg("Sesión no válida. Abre el enlace desde el navegador donde te registraste.");
      return;
    }

    setPhase("posting");
    setMsg("Verificando…");
    try {
      // Verify via Better Auth's built-in endpoint
      await authClient.verifyEmail({ query: { token } });
      setPhase("ok");
      setMsg("Correo verificado correctamente. Redirigiendo…");
      setTimeout(() => router.replace("/"), 1000);
    } catch (err) {
      setPhase("error");
      setMsg("No se pudo verificar el correo.");
    }
  }

  async function onResend() {
    if (!email) {
      setPhase("error");
      setMsg("No se puede reenviar: falta la dirección de correo.");
      return;
    }
    try {
      setResending(true);
      // If your Better Auth version exposes a resend helper, use it here instead:
      // await authClient.requestEmailVerification({ body: { email } });
      // Otherwise call a tiny server endpoint you own that triggers sendVerificationEmail
      const r = await fetch("/api/auth/send-verification-email", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!r.ok) throw new Error(await r.text());
      setMsg("Hemos reenviado el correo de verificación.");
    } catch (e) {
      setMsg("No se pudo reenviar el correo.");
    } finally {
      setResending(false);
    }
  }

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl border border-gray-200 p-6 shadow-sm">
        <h1 className="text-lg font-semibold mb-2">Verificación de correo</h1>
        <p className="text-sm text-gray-700">{msg}</p>
        {email && (
          <p className="mt-2 text-xs text-gray-500">
            Dirección: <span className="font-medium">{email}</span>
          </p>
        )}
        <div className="mt-6 flex flex-col gap-3">
          <button
            onClick={handleVerifyClick}
            disabled={phase === "posting" || !token}
            className="inline-flex h-10 items-center justify-center rounded-lg bg-gray-900 px-4 text-sm font-medium text-white hover:opacity-90 disabled:opacity-60 transition"
          >
            {phase === "posting" ? "Verificando…" : "Verificar correo"}
          </button>

          {phase === "error" && (
            <button
              onClick={onResend}
              disabled={resending}
              className="inline-flex h-10 items-center justify-center rounded-lg border px-4 text-sm font-medium hover:bg-gray-50 disabled:opacity-60 transition"
            >
              {resending ? "Reenviando…" : "Reenviar correo de verificación"}
            </button>
          )}

          {phase === "ok" && (
            <button
              onClick={() => router.replace("/")}
              className="inline-flex h-10 items-center justify-center rounded-lg border px-4 text-sm font-medium hover:bg-gray-50 transition"
            >
              Ir al inicio
            </button>
          )}
        </div>

        <p className="mt-4 text-[11px] text-gray-500">
          Por seguridad, este botón requiere una acción manual. Si el problema persiste, solicita un nuevo correo.
        </p>
      </div>
    </div>
  );
}
