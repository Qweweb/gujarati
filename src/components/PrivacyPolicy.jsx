import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function PrivacyPolicy() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-900 pb-20">
      {/* Header */}
      <div className="bg-white dark:bg-stone-800 shadow-sm sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <button 
                onClick={() => navigate(-1)}
                className="p-2 -ml-2 rounded-full hover:bg-stone-100 dark:hover:bg-stone-700 text-stone-600 dark:text-stone-300 transition-colors"
              >
                <span className="material-symbols-outlined">arrow_back</span>
              </button>
              <h1 className="text-xl font-bold text-stone-800 dark:text-stone-100 font-gujarati">Privacy Policy</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white dark:bg-stone-800 rounded-2xl p-6 md:p-8 shadow-sm border border-stone-200 dark:border-stone-700 font-sans text-stone-700 dark:text-stone-300 space-y-6">
          
          <div className="text-center mb-8 border-b border-stone-200 dark:border-stone-700 pb-6">
            <h2 className="text-3xl font-black text-teal-600 dark:text-teal-400 mb-2 font-gujarati">પ્રાઇવસી પોલિસી</h2>
            <p className="text-stone-500 dark:text-stone-400">Last updated: June 3, 2026</p>
          </div>

          <section className="space-y-3">
            <h3 className="text-xl font-bold text-stone-900 dark:text-white">1. Introduction</h3>
            <p>
              Welcome to the Gujarati App. We respect your privacy and are committed to protecting your personal data. This privacy policy explains how we collect, use, and safeguard your information when you use our mobile application and website (gujaratiapp.in).
            </p>
          </section>

          <section className="space-y-3">
            <h3 className="text-xl font-bold text-stone-900 dark:text-white">2. Information We Collect</h3>
            <p>We may collect and process the following types of information:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Personal Information:</strong> Name, email address, and profile picture (if you choose to log in using Google Authentication).</li>
              <li><strong>Usage Data:</strong> Information about how you interact with our app, games played, scores, and preferences saved locally on your device.</li>
              <li><strong>Device Information:</strong> We may collect standard diagnostic data to improve app performance and fix crashes.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h3 className="text-xl font-bold text-stone-900 dark:text-white">3. How We Use Your Information</h3>
            <ul className="list-disc pl-5 space-y-2">
              <li>To provide, maintain, and improve our App.</li>
              <li>To manage your account and authentication securely via Supabase.</li>
              <li>To personalize your experience (e.g., tracking game coins, saved settings, and theme preferences).</li>
              <li>To respond to your feedback, comments, and requests.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h3 className="text-xl font-bold text-stone-900 dark:text-white">4. Third-Party Services</h3>
            <p>We use trusted third-party services that may collect information used to identify you:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Google Play Services:</strong> For Android platform integrations.</li>
              <li><strong>Supabase / Google OAuth:</strong> For secure user authentication and login.</li>
              <li><strong>Google Analytics & Microsoft Clarity:</strong> We use these analytics tools to understand how users interact with our app (e.g., page views, button clicks) so we can improve the user experience. These tools collect anonymized usage data and device identifiers.</li>
              <li><strong>Local Storage:</strong> Most of your personal data (biodata, local game scores, offline settings) is stored securely on your own device and is not transmitted to our servers.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h3 className="text-xl font-bold text-stone-900 dark:text-white">5. Data Security</h3>
            <p>
              We prioritize the security of your data. We use industry-standard encryption and security measures to protect your personal information against unauthorized access, alteration, or destruction.
            </p>
          </section>

          <section className="space-y-3">
            <h3 className="text-xl font-bold text-stone-900 dark:text-white">6. Children's Privacy</h3>
            <p>
              Our App is designed for a general audience, including families and children. We do not knowingly collect personal identifiable information from children under 13 without parental consent. If we discover that a child under 13 has provided us with personal information, we immediately delete this from our servers.
            </p>
          </section>

          <section className="space-y-3">
            <h3 className="text-xl font-bold text-stone-900 dark:text-white">7. Changes to This Privacy Policy</h3>
            <p>
              We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page. You are advised to review this Privacy Policy periodically for any changes.
            </p>
          </section>

          <section className="space-y-3">
            <h3 className="text-xl font-bold text-stone-900 dark:text-white">8. Contact Us</h3>
            <p>
              If you have any questions or suggestions about our Privacy Policy, do not hesitate to contact us at:
              <br />
              <strong>Email:</strong> support@gujaratiapp.in
            </p>
          </section>

          <div className="mt-8 p-4 bg-teal-50 dark:bg-teal-900/30 rounded-xl border border-teal-100 dark:border-teal-800 text-sm text-teal-800 dark:text-teal-200">
            <p className="font-gujarati text-center">
              અમે તમારી પ્રાઇવસીનું સન્માન કરીએ છીએ. તમારો મોટાભાગનો ડેટા તમારા પોતાના મોબાઈલમાં જ સુરક્ષિત રહે છે.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
