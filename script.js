// パスワード設定
const CORRECT_PASSWORD = 'influencerz2024';

// DOM要素の取得
const loginScreen = document.getElementById('loginScreen');
const mainContent = document.getElementById('mainContent');
const passwordInput = document.getElementById('passwordInput');
const errorMessage = document.getElementById('errorMessage');

// 初期化
document.addEventListener('DOMContentLoaded', function () {
  // 現在の日付を設定
  const currentDate = new Date().toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  document.getElementById('currentDate').textContent = currentDate;

  // ログイン状態をチェック
  checkLoginStatus();

  // パスワード入力でEnterキーを有効にする
  passwordInput.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
      checkPassword();
    }
  });

  // ログイン画面の入力フィールドにフォーカス
  setTimeout(() => {
    passwordInput.focus();
  }, 500);
});

// ログイン状態のチェック
function checkLoginStatus() {
  const isLoggedIn = sessionStorage.getItem('influencerz_logged_in');
  if (isLoggedIn === 'true') {
    showMainContent();
  } else {
    showLoginScreen();
  }
}

// パスワードチェック
function checkPassword() {
  const password = passwordInput.value.trim();

  if (password === '') {
    showError('パスワードを入力してください');
    return;
  }

  if (password === CORRECT_PASSWORD) {
    // ログイン成功
    sessionStorage.setItem('influencerz_logged_in', 'true');
    hideError();

    // ローディング表示
    const button = document.querySelector('.login-form button');
    const originalText = button.innerHTML;
    button.innerHTML = '<div class="loading"></div> 認証中...';
    button.disabled = true;

    // アニメーション効果でメインコンテンツを表示
    setTimeout(() => {
      showMainContent();
      button.innerHTML = originalText;
      button.disabled = false;
      passwordInput.value = '';
    }, 1500);
  } else {
    // ログイン失敗
    showError('パスワードが正しくありません');
    passwordInput.value = '';
    passwordInput.focus();

    // 入力フィールドをシェイクアニメーション
    passwordInput.style.animation = 'shake 0.5s ease-in-out';
    setTimeout(() => {
      passwordInput.style.animation = '';
    }, 500);
  }
}

// エラーメッセージ表示
function showError(message) {
  errorMessage.textContent = message;
  errorMessage.classList.add('show');
}

// エラーメッセージ非表示
function hideError() {
  errorMessage.classList.remove('show');
}

// ログイン画面表示
function showLoginScreen() {
  loginScreen.style.display = 'flex';
  mainContent.style.display = 'none';
}

// メインコンテンツ表示
function showMainContent() {
  loginScreen.style.display = 'none';
  mainContent.style.display = 'block';

  // フェードインアニメーション
  mainContent.style.opacity = '0';
  setTimeout(() => {
    mainContent.style.transition = 'opacity 0.5s ease-in-out';
    mainContent.style.opacity = '1';
  }, 100);
}

// ログアウト
function logout() {
  if (confirm('ログアウトしますか？')) {
    sessionStorage.removeItem('influencerz_logged_in');
    mainContent.style.transition = 'opacity 0.3s ease-in-out';
    mainContent.style.opacity = '0';

    setTimeout(() => {
      showLoginScreen();
      mainContent.style.opacity = '1';
      mainContent.style.transition = '';
    }, 300);
  }
}

// セクション表示
function showSection(sectionId) {
  // 全てのセクションを非表示
  const sections = document.querySelectorAll('.section');
  sections.forEach(section => {
    section.classList.remove('active');
  });

  // 指定されたセクションを表示
  const targetSection = document.getElementById(sectionId);
  if (targetSection) {
    targetSection.classList.add('active');
  }

  // ナビゲーションボタンの状態更新
  const navButtons = document.querySelectorAll('.nav-btn');
  navButtons.forEach(btn => {
    btn.classList.remove('active');
  });

  // アクティブなボタンを設定
  const activeButton = document.querySelector(`[onclick="showSection('${sectionId}')"]`);
  if (activeButton) {
    activeButton.classList.add('active');
  }

  // トップにスクロール
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });

  // セクション切り替えアニメーション
  if (targetSection) {
    targetSection.style.transform = 'translateY(20px)';
    targetSection.style.opacity = '0';

    setTimeout(() => {
      targetSection.style.transition = 'all 0.3s ease-out';
      targetSection.style.transform = 'translateY(0)';
      targetSection.style.opacity = '1';
    }, 50);

    setTimeout(() => {
      targetSection.style.transition = '';
    }, 350);
  }

  // Google Analytics風のページビュー追跡（オプション）
  if (typeof gtag !== 'undefined') {
    gtag('config', 'GA_MEASUREMENT_ID', {
      page_title: sectionId,
      page_location: window.location.href + '#' + sectionId
    });
  }
}

// スムーススクロール
function smoothScrollTo(elementId) {
  const element = document.getElementById(elementId);
  if (element) {
    element.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  }
}

// カードホバー効果
document.addEventListener('DOMContentLoaded', function () {
  const cards = document.querySelectorAll('.overview-card');
  cards.forEach(card => {
    card.addEventListener('mouseenter', function () {
      this.style.transform = 'translateY(-8px) scale(1.02)';
    });

    card.addEventListener('mouseleave', function () {
      this.style.transform = 'translateY(0) scale(1)';
    });
  });
});

// プログレスバー（スクロール進捗）
function updateScrollProgress() {
  const scrollTop = window.pageYOffset;
  const docHeight = document.body.offsetHeight - window.innerHeight;
  const scrollPercent = (scrollTop / docHeight) * 100;

  let progressBar = document.getElementById('scrollProgress');
  if (!progressBar) {
    progressBar = document.createElement('div');
    progressBar.id = 'scrollProgress';
    progressBar.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: ${scrollPercent}%;
            height: 3px;
            background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
            z-index: 1001;
            transition: width 0.1s ease;
        `;
    document.body.appendChild(progressBar);
  } else {
    progressBar.style.width = scrollPercent + '%';
  }
}

// スクロールイベント
window.addEventListener('scroll', updateScrollProgress);

// キーボードショートカット
document.addEventListener('keydown', function (e) {
  // Ctrl/Cmd + 数字キーでセクション切り替え
  if ((e.ctrlKey || e.metaKey) && !e.shiftKey && !e.altKey) {
    switch (e.key) {
      case '1':
        e.preventDefault();
        showSection('overview');
        break;
      case '2':
        e.preventDefault();
        showSection('presentation');
        break;
      case '3':
        e.preventDefault();
        showSection('worksheet');
        break;
      case '4':
        e.preventDefault();
        showSection('cases');
        break;
    }
  }

  // ESCキーでログアウト確認
  if (e.key === 'Escape' && sessionStorage.getItem('influencerz_logged_in') === 'true') {
    logout();
  }
});

// ページ離脱時の警告（編集中のワークシートがある場合）
window.addEventListener('beforeunload', function (e) {
  const currentSection = document.querySelector('.section.active');
  if (currentSection && currentSection.id === 'worksheet') {
    // ワークシートで何か入力されている場合のみ警告
    const inputs = currentSection.querySelectorAll('input, textarea');
    let hasContent = false;
    inputs.forEach(input => {
      if (input.value.trim() !== '') {
        hasContent = true;
      }
    });

    if (hasContent) {
      e.preventDefault();
      e.returnValue = '入力中のデータが失われる可能性があります。ページを離れますか？';
    }
  }
});

// パフォーマンス監視
function logPerformance() {
  if ('performance' in window) {
    setTimeout(() => {
      const perfData = performance.getEntriesByType('navigation')[0];
      console.log('Page Load Performance:', {
        domContentLoaded: perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart,
        loadComplete: perfData.loadEventEnd - perfData.loadEventStart,
        totalTime: perfData.loadEventEnd - perfData.fetchStart
      });
    }, 0);
  }
}

// Service Worker登録（オフライン対応）
if ('serviceWorker' in navigator) {
  window.addEventListener('load', function () {
    navigator.serviceWorker.register('/sw.js')
      .then(function (registration) {
        console.log('ServiceWorker registered successfully');
      })
      .catch(function (error) {
        console.log('ServiceWorker registration failed');
      });
  });
}

// ダークモード切り替え（オプション機能）
function toggleDarkMode() {
  document.body.classList.toggle('dark-mode');
  const isDarkMode = document.body.classList.contains('dark-mode');
  localStorage.setItem('darkMode', isDarkMode ? 'enabled' : 'disabled');
}

// ダークモード設定の復元
document.addEventListener('DOMContentLoaded', function () {
  const darkMode = localStorage.getItem('darkMode');
  if (darkMode === 'enabled') {
    document.body.classList.add('dark-mode');
  }
});

// エラーハンドリング
window.addEventListener('error', function (e) {
  console.error('JavaScript Error:', e.error);
  // プロダクション環境では、エラーを分析サービスに送信
});

// 印刷時の最適化
window.addEventListener('beforeprint', function () {
  // 印刷時にサイドバーやナビゲーションを非表示
  document.body.classList.add('printing');
});

window.addEventListener('afterprint', function () {
  document.body.classList.remove('printing');
});

// パフォーマンス監視実行
logPerformance();

// アニメーション用CSS追加
const style = document.createElement('style');
style.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-5px); }
        75% { transform: translateX(5px); }
    }

    .dark-mode {
        --bg-color: #1f2937;
        --bg-secondary: #374151;
        --text-color: #f9fafb;
        --text-light: #d1d5db;
        --border-color: #4b5563;
    }

    @media print {
        .printing .header,
        .printing .nav,
        .printing .footer,
        .printing .logout-btn {
            display: none !important;
        }
        
        .printing .main {
            padding-top: 0 !important;
        }
    }

    .section {
        opacity: 1;
        transform: translateY(0);
    }
`;
document.head.appendChild(style); 
