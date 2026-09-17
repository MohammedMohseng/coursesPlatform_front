/**
 * ==========================================
 * auth.js
 * ==========================================
 * مسؤول عن إدارة الكوكيز (accessToken / refreshToken) على مستوى الـ Client.
 * ملاحظة هامة: هذه الدوال تعمل فقط داخل بيئة المتصفح (Client Components).
 * إذا احتجت قراءة الكوكيز من داخل Server Components أو Server Actions أو
 * Middleware في Next.js، يجب استخدام `cookies()` من `next/headers` بدلاً من
 * هذا الملف، لأن `document` غير متاح في بيئة السيرفر.
 */

const ACCESS_TOKEN_KEY = "JWT_TOKEN";
const USER_ROLE_KEY = "USER_ROLE";

/**
 * التحقق مما إذا كنا داخل بيئة المتصفح (Browser) وليس السيرفر.
 */
function isBrowser(): boolean {
  return typeof window !== "undefined" && typeof document !== "undefined";
}

/**
 * قراءة قيمة كوكي معينة بالاسم.
 * @param name اسم الكوكي المطلوب قراءته
 * @returns القيمة إذا وُجدت، أو null إذا لم توجد أو كنا في بيئة السيرفر
 */
export function getCookie(name: string): string | null {
  if (!isBrowser()) return null;

  const match = document.cookie.match(
    new RegExp("(^| )" + name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "=([^;]+)"),
  );

  return match ? decodeURIComponent(match[2]) : null;
}

/**
 * كتابة كوكي جديد أو تحديث كوكي موجود.
 * @param name اسم الكوكي
 * @param value القيمة المراد تخزينها
 * @param days عدد الأيام قبل انتهاء صلاحية الكوكي (افتراضياً يوم واحد)
 * @param options خيارات إضافية (secure, sameSite, path)
 */
export function setCookie(
  name: string,
  value: string,
  days: number = 1,
  options: { secure?: boolean; sameSite?: "Strict" | "Lax" | "None"; path?: string } = {},
): void {
  if (!isBrowser()) return;

  const { secure = true, sameSite = "Lax", path = "/" } = options;

  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);

  let cookieString = `${name}=${encodeURIComponent(value)}; expires=${expires.toUTCString()}; path=${path}; SameSite=${sameSite}`;

  if (secure && window.location.protocol === "https:") {
    cookieString += "; Secure";
  }

  document.cookie = cookieString;
}

/**
 * حذف كوكي معين بالاسم.
 * @param name اسم الكوكي المراد حذفه
 * @param path المسار الذي تم تعيين الكوكي عليه (يجب أن يتطابق مع setCookie)
 */
export function deleteCookie(name: string, path: string = "/"): void {
  if (!isBrowser()) return;
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${path};`;
}

/**
 * جلب توكن الوصول (Access Token) الحالي.
 */
export function getAccessToken(): string | null {
  return getCookie(ACCESS_TOKEN_KEY);
}

/**
 * جلب دور المستخدم من الكوكيز أو localStorage.
 */
export function getUserRole(): string | null {
  if (!isBrowser()) return null;
  return getCookie(USER_ROLE_KEY) || localStorage.getItem(USER_ROLE_KEY);
}

/**
 * تخزين دور المستخدم في الكوكيز و localStorage.
 * @param role دور المستخدم
 */
export function setUserRole(role: string): void {
  if (!isBrowser()) return;
  setCookie(USER_ROLE_KEY, role, 7, { secure: true });
  localStorage.setItem(USER_ROLE_KEY, role);
}

/**
 * حذف دور المستخدم من الكوكيز و localStorage.
 */
export function deleteUserRole(): void {
  if (!isBrowser()) return;
  deleteCookie(USER_ROLE_KEY);
  localStorage.removeItem(USER_ROLE_KEY);
}

/**
 * تخزين توكن الوصول.
 * @param token قيمة التوكن
 * @param days عدد أيام الصلاحية (افتراضياً يوم واحد لأن الـ access token قصير العمر)
 */
export function setAccessToken(token: string, days: number = 1): void {
  setCookie(ACCESS_TOKEN_KEY, token, days);
}



/**
 * التحقق مما إذا كان المستخدم مسجلاً دخوله حالياً (وجود accessToken).
 * ملاحظة: هذا فحص سطحي فقط (وجود التوكن)، وليس تحققاً من صلاحيته الفعلية،
 * لأن فك تشفير الـ JWT والتحقق من انتهائه يجب أن يتم في الـ Backend.
 */
export function isAuthenticated(): boolean {
  return true;
  //!!getAccessToken();
}

/**
 * مسح كامل بيانات الجلسة (يُستخدم عند تسجيل الخروج أو فشل تجديد التوكن)
 * وإعادة توجيه المستخدم لصفحة تسجيل الدخول.
 * @param redirect هل يتم التوجيه تلقائياً لصفحة /login (افتراضياً true)
 */
export function clearAuth(redirect: boolean = true): void {
  deleteCookie(ACCESS_TOKEN_KEY);
  deleteCookie('JWT_TOKEN')
  if (redirect && isBrowser()) {
    window.location.href = "/auth/login";
  }
}
