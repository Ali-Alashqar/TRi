# 🚀 نشر سريع على Render.com

## الإعدادات المطلوبة فقط

عند إنشاء Web Service على Render.com، استخدم هذه الإعدادات:

### ⚙️ الإعدادات الأساسية

```
Name: technest
Environment: Node
Build Command: npm install --legacy-peer-deps && npm run build
Start Command: npm start
```

### 🔑 بيانات الدخول للوحة التحكم

```
URL: https://your-app.onrender.com/login
Username: technest_admin_2025
Password: TN@SecurePass#2025!Admin
```

⚠️ **غير كلمة المرور فوراً بعد أول تسجيل دخول!**

---

## ✅ تم إصلاح المشاكل التالية:

1. ✅ إزالة تعارض مديري الحزم (npm/pnpm/yarn)
2. ✅ إصلاح تعارضات التبعيات (date-fns, react-day-picker)
3. ✅ تنزيل Express من v5 إلى v4 (نسخة مستقرة)
4. ✅ إضافة `.npmrc` للتعامل مع peer dependencies
5. ✅ تحسين إعدادات البناء والتشغيل

## 📦 محتويات الحزمة:

- ✅ جميع ملفات المصدر (src/)
- ✅ ملفات الإعدادات المحدثة
- ✅ السيرفر المحسّن (server.js)
- ✅ فيديو المقدمة (intro.mp4)
- ✅ دليل النشر بالعربية
- ✅ ملف README شامل
- ✅ ملف `.npmrc` للتعامل مع التبعيات

## 🎯 الخطوات:

1. افتح [Render.com](https://render.com)
2. اضغط **New +** → **Web Service**
3. ارفع الملفات أو اربط GitHub
4. استخدم الإعدادات أعلاه (مهم جداً: `--legacy-peer-deps`)
5. اضغط **Create Web Service**
6. انتظر 3-5 دقائق
7. ✅ تم!

---

## 🔧 التبعيات المحدثة:

- `express`: v4.21.2 (بدلاً من v5 - أكثر استقراراً)
- `date-fns`: v3.6.0 (بدلاً من v4 - متوافق مع react-day-picker)
- جميع التبعيات الأخرى محدثة ومتوافقة

---

**للمزيد من التفاصيل، راجع: DEPLOYMENT_GUIDE_AR.md**

