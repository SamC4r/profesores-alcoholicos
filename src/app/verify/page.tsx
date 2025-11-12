"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

type Phase = "idle" | "posting" | "ok" | "error";

export default function VerifyPage() {
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>("idle");
  const [msg, setMsg] = useState("Verificando…");
  const [resending, setResending] = useState(false);

  // read #token and #email from the fragment
  const { token, email } = useMemo(() => {
    const params = new URLSearchParams(
      (typeof window !== "undefined" ? window.location.hash : "").replace(/^#/, "")
    );
    return {
      token: params.get("token") ?? "",
      email: params.get("email") ?? "",
    };
  }, []);

  useEffect(() => {
    if (!token) {
      setPhase("error");
      setMsg("Falta el token de verificación.");
      return;
    }

    setPhase("posting");
    authClient
      .verifyEmail({ query: { token } })
      .then(() => {
        setPhase("ok");
        setMsg("Correo verificado correctamente.");
        // small pause so the user sees the success, then go home
        const t = setTimeout(() => router.replace("/"), 1200);
        return () => clearTimeout(t);
      })
      .catch((e: any) => {
        setPhase("error");
        setMsg(e?.message || "No se pudo verificar el correo.");
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  async function onResend() {
    if (!email) {
      setMsg("No se puede reenviar: falta el correo.");
      setPhase("error");
      return;
    }
    try {
      setResending(true);
      // --- Choose ONE of the following approaches ---

      // A) If your Better Auth client exposes a resend/request method:
      // await authClient.requestEmailVerification({ body: { email } });

      // B) Or call your own endpoint that triggers sendVerificationEmail on the server:
      const r = await fetch("/api/auth/send-verification-email", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!r.ok) throw new Error(await r.text());

      setMsg("Hemos reenviado el correo de verificación.");
    } catch (e: any) {
      setMsg(e?.message || "No se pudo reenviar el correo.");
    } finally {
      setResending(false);
    }
  }

  function copyToken() {
    if (!token) return;
    navigator.clipboard.writeText(token).catch(() => {});
  }

  function openMailApp() {
    window.location.href = "mailto:";
  }

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl border border-gray-200 p-6 shadow-sm">
        {/* Header */}
        <div className="mb-4 flex items-center gap-3">
          {phase === "posting" && (
            <span className="h-5 w-5 animate-spin rounded-full border-2 border-gray-400 border-t-transparent inline-block" />
          )}
          {phase === "ok" && (
            <span className="inline-flex h-5 w-5 items-center justify-center rounded-full border-2 border-green-600">
              <span className="h-2.5 w-2.5 rounded-full bg-green-600" />
            </span>
          )}
          {phase === "error" && (
            <span className="inline-flex h-5 w-5 items-center justify-center rounded-full border-2 border-red-600">
              <span className="h-2.5 w-2.5 rounded-full bg-red-600" />
            </span>
          )}
          <h1 className="text-lg font-semibold">
            {phase === "posting" && "Verificando tu correo…"}
            {phase === "ok" && "Correo verificado"}
            {phase === "error" && "No se pudo verificar"}
            {phase === "idle" && "Verificación de correo"}
          </h1>
        </div>

        {/* Message */}
        <p className="text-sm text-gray-700">{msg}</p>

        {/* Hint: show email if present */}
        {email && (
          <p className="mt-2 text-xs text-gray-500">
            Dirección: <span className="font-medium">{email}</span>
          </p>
        )}

        {/* Actions */}
        <div className="mt-6 flex flex-col gap-3">
          {phase === "ok" && (
            <button
              onClick={() => router.replace("/")}
              className="inline-flex h-10 items-center justify-center rounded-lg border border-gray-900 px-4 text-sm font-medium hover:bg-gray-900 hover:text-white transition"
            >
              Ir al inicio
            </button>
          )}

          {phase === "error" && (
            <>
              <button
                onClick={onResend}
                disabled={resending}
                className="inline-flex h-10 items-center justify-center rounded-lg bg-gray-900 px-4 text-sm font-medium text-white hover:opacity-90 disabled:opacity-60 transition"
              >
                {resending ? "Reenviando…" : "Reenviar correo de verificación"}
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={copyToken}
                  className="inline-flex h-9 items-center justify-center rounded-md border px-3 text-xs hover:bg-gray-50"
                >
                  Copiar token
                </button>
                <button
                  onClick={openMailApp}
                  className="inline-flex h-9 items-center justify-center rounded-md border px-3 text-xs hover:bg-gray-50"
                >
                  Abrir cliente de correo
                </button>
              </div>

              <p className="text-[11px] text-gray-500">
                Si el problema persiste, solicita un nuevo correo o intenta más tarde.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
