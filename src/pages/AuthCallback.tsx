import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";

export default function AuthCallback() {
  const navigate = useNavigate();
  const hasHandled = useRef(false);

  useEffect(() => {
    const handleCallback = async () => {
      if (hasHandled.current) return;
      hasHandled.current = true;

      const code = new URLSearchParams(window.location.search).get("code");
      
      console.log("Current URL:", window.location.href);

      if (code) {
        const { data, error } = await supabase.auth.exchangeCodeForSession(code);
        console.log("Exchange result:", data, error);

        if (error) {
          console.error("OAuth callback error:", error.message);
          navigate("/login", { replace: true });
          return;
        }

        if (data.session) {
          navigate("/chatbot", { replace: true });
        } else {
          navigate("/login", { replace: true });
        }
      } else {
        // Fallback to getSession if no code in URL (already processed or implicit flow fallback)
        const { data, error } = await supabase.auth.getSession();
        console.log("Session fallback:", data.session, error);
        
        if (data.session) {
          navigate("/chatbot", { replace: true });
        } else {
          navigate("/login", { replace: true });
        }
      }
    };

    handleCallback();
  }, [navigate]);

  return (
    <div className="h-full flex items-center justify-center bg-slate-50">
      <div className="flex flex-col items-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-brand-500 mb-4"></div>
        <p className="text-slate-600">Logging you in...</p>
      </div>
    </div>
  );
}
