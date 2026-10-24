/**
 * MSK YTDL — Interactive UI & Real-Time Release Sync Script
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

  // 5. GitHub Releases Live Syncer
  // Ensures any user clicking download gets the absolute latest release built on GitHub
  syncLatestRelease();

  // 6. User Download Toast Notifications
  setupDownloadFeedback();
});

/**
 * Connect to GitHub API to dynamically pull the latest release assets,
 * tag version, file sizes, and direct CDN URLs.
 */
async function syncLatestRelease() {
  const GITHUB_REPO = 'msk-ytdl/msk-ytdl';
  const API_URL = `https://api.github.com/repos/${GITHUB_REPO}/releases/latest`;

  // Permanent direct download links supported natively by GitHub Releases CDN
  const defaultApkUrl = `https://github.com/${GITHUB_REPO}/releases/latest/download/MSK-YTDL.apk`;
  const defaultExeUrl = `https://github.com/${GITHUB_REPO}/releases/latest/download/MSK-YTDL.exe`;
  const defaultZipUrl = `https://github.com/${GITHUB_REPO}/releases/latest/download/MSK-YTDL-Windows-x64.zip`;

  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error(`GitHub API returned status ${response.status}`);
    }
    const release = await response.json();
    const tagName = release.tag_name || 'v1.0.0';
    const assets = release.assets || [];

    // Locate assets (supporting MSK-YTDL.* and fallback wildcard matching)
    let apkAsset = assets.find(a => a.name === 'MSK-YTDL.apk') || assets.find(a => a.name.toLowerCase().endsWith('.apk'));
    let exeAsset = assets.find(a => a.name === 'MSK-YTDL.exe') || assets.find(a => a.name.toLowerCase().endsWith('.exe'));
    let zipAsset = assets.find(a => a.name.toLowerCase().endsWith('.zip'));

    const apkUrl = apkAsset ? apkAsset.browser_download_url : defaultApkUrl;
    const exeUrl = exeAsset ? exeAsset.browser_download_url : defaultExeUrl;
    const zipUrl = zipAsset ? zipAsset.browser_download_url : defaultZipUrl;

    // Update buttons in DOM
    const heroAndroid = document.getElementById('hero-btn-android');
    const heroWindows = document.getElementById('hero-btn-windows');
    const dlApkBtn = document.getElementById('dl-apk-btn');
    const dlWinBtn = document.getElementById('dl-win-btn');
    const dlZipBtn = document.getElementById('dl-zip-btn');

    if (heroAndroid) heroAndroid.href = apkUrl;
    if (dlApkBtn) dlApkBtn.href = apkUrl;
    if (heroWindows) heroWindows.href = exeUrl;
    if (dlWinBtn) dlWinBtn.href = exeUrl;
    if (dlZipBtn) dlZipBtn.href = zipUrl;

    // Update version badges across page
    document.querySelectorAll('.badge-version').forEach(badge => {
      badge.textContent = `MSK YTDL ${tagName}`;
    });

    // Update Android file size and meta
    if (apkAsset && apkAsset.size) {
      const mb = (apkAsset.size / (1024 * 1024)).toFixed(1);
      const apkMeta = heroAndroid ? heroAndroid.querySelector('.btn-meta') : null;
      if (apkMeta) apkMeta.textContent = `Direct APK • ${tagName} • ${mb} MB`;
      const specApkSize = document.getElementById('spec-apk-size');
      if (specApkSize) specApkSize.textContent = `${mb} MB`;
    }

    // Update Windows file size and meta
    if (exeAsset && exeAsset.size) {
      const mb = (exeAsset.size / (1024 * 1024)).toFixed(1);
      const winMeta = heroWindows ? heroWindows.querySelector('.btn-meta') : null;
      if (winMeta) winMeta.textContent = `Direct EXE • ${tagName} • ${mb} MB`;
      const specWinSize = document.getElementById('spec-win-size');
      if (specWinSize) specWinSize.textContent = `Standalone EXE (${mb} MB)`;
    }

    // Update release info indicators
    const liveIndicator = document.getElementById('live-release-indicator');
    if (liveIndicator) {
      liveIndicator.innerHTML = `<span class="live-dot"></span> Latest: <strong>${tagName}</strong>`;
      liveIndicator.style.display = 'inline-flex';
    }

    console.log(`[MSK YTDL] Synced latest release assets for ${tagName}`);
  } catch (error) {
    console.warn('[MSK YTDL] Using permanent GitHub CDN latest release URLs:', error);
  }
}

/**
 * Provide instant toast feedback when user clicks download
 */
function setupDownloadFeedback() {
  const downloadButtons = document.querySelectorAll('#hero-btn-android, #hero-btn-windows, #dl-apk-btn, #dl-win-btn, #dl-zip-btn');
  downloadButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const isAndroid = btn.id.includes('android') || btn.id.includes('apk');
      const filename = isAndroid ? 'MSK-YTDL.apk' : 'MSK-YTDL.exe';
      showToast(`⚡ Starting download for latest <strong>${filename}</strong>...`);
    });
  });
}

/**
 * Toast Notification Helper
 */
function showToast(messageHtml) {
  let toast = document.getElementById('dl-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'dl-toast';
    toast.className = 'dl-toast';
    document.body.appendChild(toast);
  }

  toast.innerHTML = messageHtml;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 4000);
}
