/**
 * MSK YTDL — Interactive UI & Real-Time Release Sync Script
 * Publisher: MSK Software Solutions
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Dynamic Device Detection & Recommendation Highlighting
  applyDeviceHighlighting();

  // 2. Tab Switching for Installation Guide
  const tabButtons = document.querySelectorAll('.tab-btn');
  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-tab');
      switchTab(targetId);
    });
  });

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

  // 6. User Download Toast Notifications & Chrome Guidance
  setupDownloadFeedback();
});

/**
 * Tab switching helper
 */
function switchTab(tabId) {
  const tabButtons = document.querySelectorAll('.tab-btn');
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

/**
 * Dynamic Device Highlighting & Smart OS Recommendation
 * Automatically highlights the exact download button and download card matching the user's OS
 */
function applyDeviceHighlighting() {
  const userAgent = navigator.userAgent || navigator.vendor || window.opera;
  const isAndroid = /android/i.test(userAgent);
  const isWindows = /windows/i.test(userAgent);

  const deviceHintText = document.getElementById('detected-os-text');
  const heroAndroidBtn = document.getElementById('hero-btn-android');
  const heroWindowsBtn = document.getElementById('hero-btn-windows');
  const cardAndroid = document.getElementById('card-android');
  const cardWindows = document.getElementById('card-windows');
  const badgeAndroid = document.getElementById('badge-android-card');
  const badgeWindows = document.getElementById('badge-windows-card');
  const btnAndroidCard = document.getElementById('dl-apk-btn');
  const btnWindowsCard = document.getElementById('dl-win-btn');
  const androidNotice = document.getElementById('android-chrome-notice');
  const androidTip = document.getElementById('card-android-tip');

  if (isWindows) {
    // --- 1. WINDOWS PC DETECTED ---
    if (deviceHintText) {
      deviceHintText.innerHTML = '💻 <strong>Windows PC detected!</strong> Highlighting standalone package recommended for your system.';
    }

    // Hero Section: Windows button becomes Primary Highlighted
    if (heroWindowsBtn) {
      heroWindowsBtn.classList.remove('btn-windows', 'secondary-btn');
      heroWindowsBtn.classList.add('recommended-btn', 'glow-pulse');
      const meta = heroWindowsBtn.querySelector('.btn-meta');
      if (meta) meta.innerHTML = '⭐ <strong>RECOMMENDED FOR THIS PC</strong> • Direct EXE';
    }
    if (heroAndroidBtn) {
      heroAndroidBtn.classList.remove('btn-android', 'recommended-btn', 'glow-pulse');
      heroAndroidBtn.classList.add('secondary-btn');
    }

    // Download Cards: Windows card becomes Primary Highlighted
    if (cardWindows) {
      cardWindows.classList.remove('card-secondary');
      cardWindows.classList.add('card-primary', 'card-recommended');
      if (badgeWindows) {
        badgeWindows.className = 'card-badge badge-recommended';
        badgeWindows.textContent = 'RECOMMENDED FOR YOUR PC';
      }
      if (btnWindowsCard) {
        btnWindowsCard.className = 'btn btn-download-primary';
      }
    }
    if (cardAndroid) {
      cardAndroid.classList.remove('card-primary', 'card-recommended');
      cardAndroid.classList.add('card-secondary');
      if (badgeAndroid) {
        badgeAndroid.className = 'card-badge badge-neutral';
        badgeAndroid.textContent = 'ANDROID MOBILE';
      }
      if (btnAndroidCard) {
        btnAndroidCard.className = 'btn btn-download-secondary';
      }
    }

    switchTab('windows-guide');

  } else if (isAndroid) {
    // --- 2. ANDROID SMARTPHONE / TABLET DETECTED ---
    if (deviceHintText) {
      deviceHintText.innerHTML = '📱 <strong>Android Phone detected!</strong> Highlighting APK recommended for your mobile device.';
    }

    // Hero Section: Android button becomes Primary Highlighted
    if (heroAndroidBtn) {
      heroAndroidBtn.classList.remove('secondary-btn');
      heroAndroidBtn.classList.add('btn-android', 'recommended-btn', 'glow-pulse');
      const meta = heroAndroidBtn.querySelector('.btn-meta');
      if (meta) meta.innerHTML = '⭐ <strong>RECOMMENDED FOR THIS DEVICE</strong> • Direct APK';
    }
    if (heroWindowsBtn) {
      heroWindowsBtn.classList.remove('recommended-btn', 'glow-pulse');
      heroWindowsBtn.classList.add('btn-windows', 'secondary-btn');
    }

    // Download Cards: Android card becomes Primary Highlighted
    if (cardAndroid) {
      cardAndroid.classList.remove('card-secondary');
      cardAndroid.classList.add('card-primary', 'card-recommended');
      if (badgeAndroid) {
        badgeAndroid.className = 'card-badge badge-recommended';
        badgeAndroid.textContent = 'RECOMMENDED FOR YOUR PHONE';
      }
      if (btnAndroidCard) {
        btnAndroidCard.className = 'btn btn-download-primary';
      }
    }
    if (cardWindows) {
      cardWindows.classList.remove('card-primary', 'card-recommended');
      cardWindows.classList.add('card-secondary');
      if (badgeWindows) {
        badgeWindows.className = 'card-badge badge-neutral';
        badgeWindows.textContent = 'WINDOWS DESKTOP';
      }
      if (btnWindowsCard) {
        btnWindowsCard.className = 'btn btn-download-secondary';
      }
    }

    // Show Chrome mobile download tip
    if (androidNotice) androidNotice.style.display = 'flex';
    if (androidTip) androidTip.style.display = 'block';

    switchTab('android-guide');

  } else {
    // Other devices (Linux, macOS, iPhone)
    if (deviceHintText) {
      deviceHintText.innerHTML = '✨ Available for <strong>Android</strong> smartphones and <strong>Windows</strong> PCs.';
    }
  }
}

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
    const response = await fetch(`${API_URL}?t=${Date.now()}`, { cache: 'no-store' });
    if (!response.ok) {
      throw new Error(`GitHub API returned status ${response.status}`);
    }
    const release = await response.json();
    const tagName = release.tag_name || 'v1.0.0.2';
    const assets = release.assets || [];

    // Locate assets (supporting MSK-YTDL.* and fallback wildcard matching)
    let apkAsset = assets.find(a => a.name === 'MSK-YTDL.apk') || assets.find(a => a.name.toLowerCase().endsWith('.apk'));
    let exeAsset = assets.find(a => a.name === 'MSK-YTDL.exe') || assets.find(a => a.name.toLowerCase().endsWith('.exe'));
    let zipAsset = assets.find(a => a.name.toLowerCase().endsWith('.zip'));

    const apkUrl = apkAsset ? apkAsset.browser_download_url : defaultApkUrl;
    const exeUrl = exeAsset ? exeAsset.browser_download_url : defaultExeUrl;
    const zipUrl = zipAsset ? zipAsset.browser_download_url : defaultZipUrl;

    // Update secondary mirror links to GitHub CDN
    const mirrorApkGithub = document.getElementById('mirror-apk-github');
    const mirrorWinGithub = document.getElementById('mirror-win-github');
    if (mirrorApkGithub) {
      mirrorApkGithub.href = apkUrl;
      mirrorApkGithub.textContent = `⚡ GitHub Official Release CDN (${tagName})`;
    }
    if (mirrorWinGithub) {
      mirrorWinGithub.href = exeUrl;
      mirrorWinGithub.textContent = `⚡ GitHub Official Release CDN (${tagName})`;
    }

    // Ensure primary download buttons use fast same-origin direct download with version cache-buster
    const verParam = encodeURIComponent(tagName);
    const heroAndroid = document.getElementById('hero-btn-android');
    const heroWindows = document.getElementById('hero-btn-windows');
    const dlApkBtn = document.getElementById('dl-apk-btn');
    const dlWinBtn = document.getElementById('dl-win-btn');
    const dlZipBtn = document.getElementById('dl-zip-btn');

    if (heroAndroid) {
      heroAndroid.href = `downloads/MSK-YTDL.apk?v=${verParam}`;
      heroAndroid.setAttribute('download', 'MSK-YTDL.apk');
    }
    if (dlApkBtn) {
      dlApkBtn.href = `downloads/MSK-YTDL.apk?v=${verParam}`;
      dlApkBtn.setAttribute('download', 'MSK-YTDL.apk');
    }
    if (heroWindows) {
      heroWindows.href = `downloads/MSK-YTDL.exe?v=${verParam}`;
      heroWindows.setAttribute('download', 'MSK-YTDL.exe');
    }
    if (dlWinBtn) {
      dlWinBtn.href = `downloads/MSK-YTDL.exe?v=${verParam}`;
      dlWinBtn.setAttribute('download', 'MSK-YTDL.exe');
    }
    if (dlZipBtn) {
      dlZipBtn.href = `downloads/MSK-YTDL-Windows-x64.zip?v=${verParam}`;
      dlZipBtn.setAttribute('download', 'MSK-YTDL-Windows-x64.zip');
    }

    // Update version badges across page
    document.querySelectorAll('.badge-version').forEach(badge => {
      badge.textContent = `MSK YTDL ${tagName}`;
    });

    // Update Android file size
    if (apkAsset && apkAsset.size) {
      const mb = (apkAsset.size / (1024 * 1024)).toFixed(1);
      const specApkSize = document.getElementById('spec-apk-size');
      if (specApkSize) specApkSize.textContent = `${mb} MB`;
    }

    // Update Windows file size
    if (exeAsset && exeAsset.size) {
      const mb = (exeAsset.size / (1024 * 1024)).toFixed(1);
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
    console.warn('[MSK YTDL] Using permanent direct download URLs:', error);
  }
}

/**
 * Provide instant toast feedback and clean download triggering without opening empty tabs
 */
function setupDownloadFeedback() {
  const downloadButtons = document.querySelectorAll('#hero-btn-android, #hero-btn-windows, #dl-apk-btn, #dl-win-btn, #dl-zip-btn');
  downloadButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const isAndroid = btn.id.includes('android') || btn.id.includes('apk');
      if (isAndroid) {
        showToast(`
          <div>
            <strong>⚡ Downloading MSK-YTDL.apk (~26 MB)...</strong>
            <div style="font-size: 0.8rem; color: #FFB300; margin-top: 5px; line-height: 1.4;">
              💡 <strong>Chrome Tip:</strong> If asked <em>"File might be harmful?"</em>, tap <strong>"Download anyway"</strong> at the bottom of your screen!
            </div>
          </div>
        `, 7000);
      } else {
        showToast(`⚡ Starting direct download for latest <strong>MSK-YTDL.exe</strong>...`, 4000);
      }
    });
  });
}

/**
 * Toast Notification Helper
 */
function showToast(messageHtml, duration = 4000) {
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
  }, duration);
}
