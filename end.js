/* ==========================================================================
   1. جزء التحقق والباسورد (Auth & Lock Screen)
   ========================================================================== */
class Auth {
  static #K = "2132026"; // كلمة السر الخاصة بك بحروف صغيرة

  static validate(v) {
    return new Promise((ok, fail) =>
      setTimeout(() => (v.toLowerCase() === Auth.#K ? ok() : fail()), 700)
    );
  }
}

class LockController {
  constructor({ onUnlock }) {
    this._cb = onUnlock;
    
    this.$s = document.getElementById("lock-screen"); 
    this.$i = document.getElementById("pw");          
    this.$b = document.getElementById("pw-btn");      
    this.$e = document.getElementById("err-msg");     

    if (!this.$s || !this.$i || !this.$b) {
      console.warn("تنبيه: بعض عناصر شاشة القفل لم تظهر بعد.");
      return;
    }
    
    this.$b.addEventListener("click", () => this._go());
    this.$i.addEventListener("keydown", (e) => e.key === "Enter" && this._go());
  }

  async _go() {
    const v = this.$i.value.trim();
    if (!v) return;
    
    this._busy(true);
    if (this.$e) this.$e.textContent = ""; 
    
    try {
      await Auth.validate(v); 
      
      this.$s.classList.add("hidden"); 
      
      this.$s.addEventListener("transitionend", () => {
        document.getElementById("lock-page").classList.add("pages-hidden"); 
        if (typeof this._cb === "function") this._cb();
      }, { once: true });

    } catch {
      this._busy(false);
      this.$i.value = ""; 
      if (this.$e) this.$e.textContent = "Try again, my love…"; 
      
      this.$i.classList.remove("shake");
      void this.$i.offsetWidth; 
      this.$i.classList.add("shake");
    }
  }
  
  _busy(on) {
    this.$b.disabled = on;
    this.$b.classList.toggle("loading", on); 
  }
}

/* ==========================================================================
   2. دالة إظهار وإخفاء رسائل Dr المتتابعة (Toggle Messages)
   ========================================================================== */
function showp(button) {
  let text = button.nextElementSibling;
  if (text.style.display === "block") {
      text.style.display = "none";
  } else {
      text.style.display = "block";
  }
}

/* ==========================================================================
   3. الدالة الموحدة لصناعة وتطيير القلوب (Universal Heart Engine)
   ========================================================================== */
function createHeart(isContinuous = false, customContainer = null) {
  const heart = document.createElement("div");
  heart.classList.add("heart");
  
  const heartTypes = ['❤', '💖', '🌸', '✨', '💕'];
  heart.innerText = heartTypes[Math.floor(Math.random() * heartTypes.length)];

  if (isContinuous && customContainer) {
      heart.style.left = Math.random() * 95 + "%";
      heart.style.fontSize = Math.random() * 20 + 10 + "px";
      const duration = Math.random() * 3 + 2;
      heart.style.animationDuration = duration + "s";
      
      customContainer.appendChild(heart);
      setTimeout(() => { heart.remove(); }, duration * 1000);
  } else {
      heart.style.left = Math.random() * 100 + 'vw';
      const randomX = (Math.random() * 200 - 100) + 'px';
      heart.style.setProperty('--randomX', randomX);
      
      const duration = Math.random() * 2 + 1.5;
      heart.style.animationDuration = duration + 's';
      
      document.body.appendChild(heart);
      setTimeout(() => { heart.remove(); }, duration * 1000);
  }
}

/* ==========================================================================
   4. ربط أحداث التنقل والدخول عند تحميل الصفحة (Page Flow & Lifecycle)
   ========================================================================== */
document.addEventListener("DOMContentLoaded", () => {

  // [أ] تشغيل متحكم شاشة القفل أولاً عند فتح الصفحة
  window._lockController = new LockController({
    onUnlock: () => {
      // عندما يكتب المستخدم الباسورد الصحيح، نقوم بإظهار شاشة الـ Loading فوراً
      const loadingScreen = document.getElementById('loading-screen');
      if (loadingScreen) {
        loadingScreen.classList.remove('pages-hidden');
        
        // محاكاة بقاء الـ Loading يعمل لمدة 2.5 ثانية ثم يختفي لينتقل لصفحة الترحيب
        setTimeout(() => {
          loadingScreen.classList.add('hidden');
          loadingScreen.addEventListener("transitionend", () => {
             loadingScreen.classList.add('pages-hidden');
             
             // بعد اختفاء الـ Loading تظهر الصفحة الأولى الترحيبية تلقائياً
             const firstPage = document.getElementById("firstpage");
             if (firstPage) firstPage.classList.remove("pages-hidden");
          }, { once: true });
        }, 500);
      }
    }
  });

  // [ب] الانتقال من الصفحة الأولى (firstpage) إلى صفحة الرسائل (messages-page)
  window.showfirstpage = function() {
      const firstPage = document.getElementById("firstpage");
      const messagesPage = document.getElementById("messages-page");
      
      if (firstPage) firstPage.classList.add("pages-hidden");
      if (messagesPage) messagesPage.classList.remove("pages-hidden");
  };

  // [ج] زر الانتقال من الرسائل إلى اللحظات السعيدة
  const storyBtn = document.getElementById("enter-story-btn");
  if (storyBtn) {
      storyBtn.addEventListener('click', () => {
          for (let i = 0; i < 30; i++) { createHeart(false); }
          document.getElementById("messages-page").classList.add("pages-hidden");
          const momentsPage = document.getElementById("moments-page");
          if (momentsPage) momentsPage.classList.remove("pages-hidden");
      });
  }

  // [د] زر الانتقال من اللحظات السعيدة لألبوم الصور المتراكمة
  const momentsBtn = document.getElementById("see-together-btn");
  if (momentsBtn) {
      momentsBtn.addEventListener('click', () => {
          for (let i = 0; i < 30; i++) { createHeart(false); }
          document.getElementById("moments-page").classList.add("pages-hidden");
          const phoneContainer = document.querySelector(".phone-container");
          if (phoneContainer) phoneContainer.classList.remove("pages-hidden");
      });
  }

  /* ==========================================================================
     5. ألبوم كروت الصور المتراكمة (Photos Stack) والتمرير (Swipe)
     ========================================================================== */
  const cardCover = document.getElementById("cardCover");
  const photos = document.querySelectorAll(".stack-photo");

  if (cardCover) {
      cardCover.addEventListener("click", () => {
          cardCover.classList.add("opened");
          arrangeStack(); 
      });
  }

  // ميكانيزم تطيير الكروت عند الضغط عليها كـ Swipe out
  photos.forEach((photo) => {
      photo.addEventListener("click", () => {
          if (cardCover.classList.contains("opened") && !photo.classList.contains("end-card")) {
              photo.classList.add("swipe-out");
              setTimeout(() => {
                  arrangeStack();
              }, 300);
          }
      });
  });

  function arrangeStack() {
      let visibleIndex = 0;
      photos.forEach((photo) => {
          if (!photo.classList.contains("swipe-out")) {
              if (visibleIndex === 0) {
                  photo.style.transform = "scale(1) translateY(0px) rotate(0deg)";
                  photo.style.zIndex = 50;
              } else if (visibleIndex === 1) {
                  photo.style.transform = "scale(0.95) translateY(10px) rotate(2deg)";
                  photo.style.zIndex = 40;
              } else if (visibleIndex === 2) {
                  photo.style.transform = "scale(0.90) translateY(20px) rotate(-2deg)";
                  photo.style.zIndex = 30;
              } else {
                  photo.style.transform = "scale(0.85) translateY(30px)";
                  photo.style.zIndex = 20;
              }
              visibleIndex++;
          }
      });
  }
});