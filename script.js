/* ===================================
   HASSAN AQEL SERVICES - JAVASCRIPT
   المطور: حسن عاقل - النسخة النهائية
   =================================== */

// --- 1. إعدادات القائمة والملاحة ---
const mobileMenuBtn = document.getElementById("mobileMenuBtn");
const navMenu = document.getElementById("navMenu");

if (mobileMenuBtn) {
  mobileMenuBtn.addEventListener("click", () => {
    const isExpanded = navMenu.classList.toggle("active");
    mobileMenuBtn.setAttribute("aria-expanded", isExpanded); // تحديث خاصية التوسع
  });
  navMenu.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", () => navMenu.classList.remove("active"));
  });
}
// --- 2. التحكم في التمرير (Scroll) ---
const navbar = document.querySelector(".navbar");
const backToTopBtn = document.getElementById("backToTop");

window.addEventListener("scroll", () => {
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

  // 1. إظهار زر العودة للأعلى وظل القائمة
  if (scrollTop > 300) {
    if (backToTopBtn) backToTopBtn.classList.add("show");
    if (navbar) navbar.style.boxShadow = "0 10px 15px -3px rgba(0, 0, 0, 0.1)";
  } else {
    if (backToTopBtn) backToTopBtn.classList.remove("show");
    if (navbar) navbar.style.boxShadow = "0 4px 6px -1px rgba(0, 0, 0, 0.1)";
  }

  // 2. تأثير Reveal (ظهور العناصر)
  revealOnScroll();
});

// --- إضافة هذا الجزء الضروري لجعل الزر "يشتغل" عند الضغط ---
if (backToTopBtn) {
  backToTopBtn.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth", // للصعود بشكل ناعم وسلس
    });
  });
}

function revealOnScroll() {
  const reveals = document.querySelectorAll(
    ".service-card, .feature-item, .pricing-card"
  );
  reveals.forEach((reveal) => {
    const windowHeight = window.innerHeight;
    const revealTop = reveal.getBoundingClientRect().top;
    if (revealTop < windowHeight - 100) {
      reveal.style.opacity = "1";
      reveal.style.transform = "translateY(0)";
    }
  });
}

// --- 3. التبويبات (Pricing Tabs) ---
document.querySelectorAll(".tab-btn").forEach((button) => {
  button.addEventListener("click", () => {
    document
      .querySelectorAll(".tab-btn, .tab-content")
      .forEach((el) => el.classList.remove("active"));
    button.classList.add("active");
    const target = document.getElementById(button.getAttribute("data-tab"));
    if (target) target.classList.add("active");
  });
});

// ===================================
// 4. العدادات المتحركة (Animated Counter)
// ===================================

function animateCounter(element) {
  const target = parseInt(element.getAttribute("data-target"));
  const duration = 2000; // مدة الأنميشن بالملي ثانية (ثانيتين)
  const stepTime = 20; // تحديث كل 20 ملي ثانية
  const increment = target / (duration / stepTime);
  let current = 0;

  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      element.textContent =
        target + (element.textContent.includes("%") ? "%" : "+");
      clearInterval(timer);
    } else {
      element.textContent = Math.floor(current);
    }
  }, stepTime);
}

// مراقب الظهور (Intersection Observer) بتعديلات مضمونة
const statsObserverOptions = {
  threshold: 0.2, // سيبدأ العداد بمجرد ظهور 20% فقط من القسم (أفضل للموبايل)
  rootMargin: "0px",
};

const statsObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const statNumbers = entry.target.querySelectorAll(".stat-number");
      statNumbers.forEach((num) => {
        // التأكد من أن العداد لم يعمل من قبل
        if (!num.classList.contains("animated")) {
          animateCounter(num);
          num.classList.add("animated");
        }
      });
      // توقف عن مراقبة القسم بعد تفعيل الأنميشن مرة واحدة
      observer.unobserve(entry.target);
    }
  });
}, statsObserverOptions);

// تفعيل المراقب على قسم الإحصائيات
document.addEventListener("DOMContentLoaded", () => {
  const statsSection = document.querySelector(".stats");
  if (statsSection) {
    statsObserver.observe(statsSection);
  } else {
    // إذا لم يجد الكلاس، يبحث عن أي حاوية داخلها stat-number
    const fallbackSection = document.querySelector(".about");
    if (fallbackSection) statsObserver.observe(fallbackSection);
  }
});

// --- 4. نظام التنبيهات (Notifications) ---
function showNotification(message, type = "info") {
  const notification = document.createElement("div");
  notification.className = `notification notification-${type}`;
  notification.textContent = message;
  notification.style.cssText = `
        position: fixed; bottom: 20px; left: 20px; padding: 16px 24px;
        border-radius: 8px; font-weight: 600; z-index: 10000;
        background: ${
          type === "success"
            ? "#10b981"
            : type === "error"
            ? "#ef4444"
            : "#3b82f6"
        };
        color: white; animation: slideInUp 0.3s ease-out;
    `;
  document.body.appendChild(notification);
  setTimeout(() => {
    notification.style.opacity = "0";
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

// --- 5. معالجة طلبات الواتساب (الفورمات) ---

// أ- فورم التواصل العام (النسخة السريعة)
const contactForm = document.getElementById("contactForm");
if (contactForm) {
  contactForm.addEventListener("submit", (e) => {
    e.preventDefault();

    // جلب البيانات
    const name = contactForm.querySelector('input[type="text"]').value;
    const phone = contactForm.querySelector('input[type="tel"]').value;
    const msg = contactForm.querySelector("textarea").value;

    // تشفير الرسالة
    const baseMsg = encodeURIComponent(
      `*رسالة تواصل لطلب جديد* ✉️\n` +
        `------------------\n` +
        `*الاسم:* ${name}\n` +
        `*الهاتف:* ${phone}\n` +
        `*الرسالة:* ${msg}`
    );

    // استخدام الرابط السريع (API) بدلاً من wa.me
    const finalUrl = `https://api.whatsapp.com/send?phone=963985910015&text=${baseMsg}`;

    // تنفيذ الأمر
    showNotification("جاري التحويل للواتساب...", "success");

    // فتح الرابط
    window.open(finalUrl, "_blank");

    // تصفير النموذج
    contactForm.reset();
  });
}

// ب- فورم طلب الخدمة السريع (النسخة الأسرع والأضمن)
const whatsappOrderForm = document.getElementById("whatsappOrderForm");
if (whatsappOrderForm) {
  whatsappOrderForm.addEventListener("submit", function (e) {
    e.preventDefault();

    // جلب القيم
    const name = document.getElementById("custName").value;
    const service = document.getElementById("serviceType").value;
    const link = document.getElementById("accountLink").value;
    const payment = document.getElementById("paymentMethod").value;
    const dateStr = new Date().toLocaleDateString("ar-EG");

    // تجهيز النص
    const messageText =
      `*🔔 طلب خدمة جديد*\n` +
      `------------------\n` +
      `*👤 العميل:* ${name}\n` +
      `*🛠 الخدمة:* ${service}\n` +
      `*🔗 الرابط:* ${link}\n` +
      `*💰 الدفع:* ${payment}\n` +
      `*📅 التاريخ:* ${dateStr}\n` +
      `------------------\n` +
      `_يرجى إرفاق صورة الإيصال للرد على طلبك_`;

    const encodedMessage = encodeURIComponent(messageText);
    const phone = "963985910015";

    // --- الحل الجذري للسرعة ---
    // استخدام api.whatsapp.com بدلاً من wa.me لأنه أسرع في التوجيه
    const finalUrl = `https://api.whatsapp.com/send?phone=${phone}&text=${encodedMessage}`;

    // إظهار إشعار للمستخدم
    showNotification("جاري فتح واتساب مباشرة...", "success");

    // الفتح في نفس النافذة أسرع من نافذة جديدة في بعض المتصفحات،
    // لكن إذا كنت تفضل نافذة جديدة اتركها _blank
    setTimeout(() => {
      window.open(finalUrl, "_blank");
    }, 500);

    // تصفير الفورم
    whatsappOrderForm.reset();
  });
}

// --- 6. مراقبة الدفع ---
const paymentSelect = document.getElementById("paymentMethod");
const detailsBox = document.getElementById("paymentDetailsBox");

if (paymentSelect) {
  paymentSelect.addEventListener("change", function () {
    const val = this.value;
    if (val === "سيريتل كاش" || val === "MTN كاش") {
      detailsBox.style.display = "block";
      detailsBox.className =
        "payment-details-box " +
        (val === "سيريتل كاش" ? "syriatel-style" : "mtn-style");
      document.getElementById("paymentTitleText").innerText =
        "رقم حساب " + val + ":";
    } else {
      detailsBox.style.display = "none";
    }
  });
}

// --- 7. تهيئة أولية ---
document.addEventListener("DOMContentLoaded", () => {
  // إخفاء عناصر الـ Reveal مبدئياً
  document
    .querySelectorAll(".service-card, .feature-item, .pricing-card")
    .forEach((el) => {
      el.style.opacity = "0";
      el.style.transform = "translateY(30px)";
      el.style.transition = "all 0.6s ease-out";
    });
  console.log("Akel Services - Ready ✅");
});
