import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";

export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleCallback = async () => {
      const { data, error } = await supabase.auth.getSession();
      console.log("Callback session:", data.session, error);

      if (data.session) {
        navigate("/chatbot", { replace: true });
      } else {
        navigate("/login", { replace: true });
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
