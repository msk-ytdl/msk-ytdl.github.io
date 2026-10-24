/**
 * MSK YTDL — Interactive UI Script
 * Publisher: MSK Software Solutions
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Device Detection (Android vs Windows)
  const userAgent = navigator.userAgent || navigator.vendor || window.opera;
  const isAndroid = /android/i.test(userAgent);
  const isWindows = /windows/i.test(userAgent);
  const deviceHintText = document.getElementById('detected-os-text');
  const heroAndroidBtn = document.getElementById('hero-btn-android');
  const heroWindowsBtn = document.getElementById('hero-btn-windows');
  const cardAndroid = document.getElementById('card-android');
  const cardWindows = document.getElementById('card-windows');

  if (isAndroid) {
    if (deviceHintText) deviceHintText.innerHTML = '📱 <strong>Android detected!</strong> We recommend downloading the APK below.';
    if (heroAndroidBtn) heroAndroidBtn.classList.add('glow-pulse');
    switchTab('android-guide');
  } else if (isWindows) {
    if (deviceHintText) deviceHintText.innerHTML = '💻 <strong>Windows PC detected!</strong> Standalone package ready to run.';
    if (heroWindowsBtn) heroWindowsBtn.classList.add('glow-pulse');
    switchTab('windows-guide');
  } else {
    if (deviceHintText) deviceHintText.innerHTML = '✨ Available for <strong>Android</strong> and <strong>Windows</strong> PCs.';
  }

  // 2. Tab Switching for Installation Guide
  const tabButtons = document.querySelectorAll('.tab-btn');
  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-tab');
      switchTab(targetId);
    });
  });

  function switchTab(tabId) {
    tabButtons.forEach(b => {
      if (b.getAttribute('data-tab') === tabId) {
        b.classList.add('active');
      } else {
        b.classList.remove('active');
      }
    });

    const guides = document.querySelectorAll('.guide-content');
    guides.forEach(g => {
      if (g.id === tabId) {
        g.classList.add('active');
      } else {
        g.classList.remove('active');
      }
    });
  }

  // 3. FAQ Accordion Interaction
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');

    questionBtn.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');

      // Close all others
      faqItems.forEach(other => {
        other.classList.remove('open');
        const otherAnswer = other.querySelector('.faq-answer');
        if (otherAnswer) otherAnswer.style.maxHeight = null;
      });

      if (!isOpen) {
        item.classList.add('open');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });

  // 4. Navbar Scroll Blur & Shadow
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.style.borderBottomColor = 'rgba(255, 179, 0, 0.2)';
      navbar.style.boxShadow = '0 10px 30px -10px rgba(0, 0, 0, 0.8)';
    } else {
      navbar.style.borderBottomColor = 'rgba(255, 255, 255, 0.08)';
      navbar.style.boxShadow = 'none';
    }
  });
});
