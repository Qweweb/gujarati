# Add project specific ProGuard rules here.
# You can control the set of applied configuration files using the
# proguardFiles setting in build.gradle.
#
# For more details, see
#   http://developer.android.com/guide/developing/tools/proguard.html

# ── WebView JavaScript Interface (Capacitor bridge) ────────────────
-keepclassmembers class * {
    @android.webkit.JavascriptInterface <methods>;
}
-keepattributes JavascriptInterface

# ── Capacitor Core ─────────────────────────────────────────────────
-keep class com.getcapacitor.** { *; }
-keep class com.capacitorjs.** { *; }
-keep @com.getcapacitor.annotation.CapacitorPlugin class * { *; }
-keep @com.getcapacitor.annotation.PluginMethod class * { *; }

# ── Firebase ───────────────────────────────────────────────────────
-keep class com.google.firebase.** { *; }
-keep class com.google.android.gms.** { *; }
-dontwarn com.google.firebase.**
-dontwarn com.google.android.gms.**

# ── Ionic / Cordova plugins ────────────────────────────────────────
-keep class io.ionic.** { *; }
-dontwarn io.ionic.**

# ── Kotlin & Coroutines ────────────────────────────────────────────
-dontwarn kotlin.**
-keep class kotlin.** { *; }
-keepclassmembers class ** {
    @kotlin.jvm.JvmStatic *;
    @kotlin.jvm.JvmField *;
}

# ── Gson / JSON serialization ──────────────────────────────────────
-keepattributes Signature
-keepattributes *Annotation*
-keep class com.google.gson.** { *; }
-keep class sun.misc.Unsafe { *; }

# ── Preserve line numbers for crash debugging ──────────────────────
-keepattributes SourceFile,LineNumberTable
-renamesourcefileattribute SourceFile

# ── Supabase / OkHttp / Ktor ───────────────────────────────────────
-dontwarn okhttp3.**
-dontwarn okio.**
-keep class okhttp3.** { *; }

# ── Facebook SDK (referenced by capacitor-firebase-authentication) ──
# Facebook SDK is not used in this app but Firebase Auth plugin references it.
# Tell R8 to ignore these missing classes.
-dontwarn com.facebook.**
-dontwarn com.facebook.CallbackManager
-dontwarn com.facebook.CallbackManager$Factory
-dontwarn com.facebook.FacebookCallback
-dontwarn com.facebook.login.LoginManager
-dontwarn com.facebook.login.widget.LoginButton

# ── Google Play Services location (safe to ignore R8 companion warning) ──
-dontwarn com.google.android.gms.internal.location.**
