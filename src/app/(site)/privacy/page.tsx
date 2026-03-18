import Link from "next/link";

export default function PrivacyPolicy() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-20 min-h-screen">
      <nav className="flex items-center gap-2 text-xs text-slate-400 font-medium mb-8">
        <Link href="/" className="hover:text-primary transition-colors">Home</Link>
        <span className="material-symbols-outlined text-[14px]">chevron_right</span>
        <span className="text-slate-600 dark:text-slate-300 font-semibold">Privacy Policy</span>
      </nav>

      <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight mb-10">
        Privacy Policy
      </h1>

      <div className="prose prose-slate dark:prose-invert max-w-none space-y-8 text-slate-600 dark:text-slate-400 leading-relaxed">
        <section>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Our Commitment</h2>
          <p>
            At The-Wallet-Lab, we are committed to protecting your privacy while providing a seamless shopping experience. 
            We utilize modern web technologies to ensure your preferences are remembered and your journey is personalized.
          </p>
        </section>

        <section className="bg-primary/5 dark:bg-primary/10 p-8 rounded-3xl border border-primary/10">
          <h2 className="text-2xl font-bold text-primary mb-4">Data Usage Disclosure</h2>
          <p className="font-medium text-slate-900 dark:text-slate-200">
            "We use local storage to remember your wishlist and session data to improve your shopping experience and analyze our website traffic."
          </p>
        </section>

        <section>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Local Storage</h3>
          <p>
            We use browser-based local storage to save your wishlist items. This ensures that even if you close your browser or return days later, 
            your favorite products will still be waiting for you without requiring an account.
          </p>
        </section>

        <section>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Session Data & Tracking</h3>
          <p>
            We use session data and UTM parameters to understand where our visitors come from (e.g., Instagram, TikTok, Facebook). 
            This helps us optimize our advertising and ensure we provide content that interests our community. 
            Session data is temporary and is typically cleared when you close your browser session.
          </p>
        </section>

        <section className="pt-10 border-t border-slate-200 dark:border-white/10">
          <p className="text-xs text-slate-400 uppercase tracking-widest font-bold">
            Last Updated: March 2026
          </p>
        </section>
      </div>
    </div>
  );
}
