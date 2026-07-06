const header = document.getElementById("js-header");

// スクロールパディング: ヘッダー高さ + 余白をCSS変数に反映してアンカーリンクのオフセットを調整
function updateScrollPadding() {
  document.documentElement.style.setProperty("--header-height", header.offsetHeight + 30 + "px");
}
updateScrollPadding();
window.addEventListener("resize", updateScrollPadding);

// スクロール時にヘッダーへ影をつける
window.addEventListener("scroll", function () {
  if (window.scrollY > 0) {
    header.classList.add("is-scrolled");
  } else {
    header.classList.remove("is-scrolled");
  }
});

const hamburger = document.getElementById("js-hamburger");
const nav = document.getElementById("js-nav");

const backToTop = document.getElementById("js-back-to-top");

// ページトップへ戻るボタン: 300px以上スクロールで表示、クリックで先頭へ
if (backToTop) {
  window.addEventListener("scroll", function () {
    if (window.scrollY > 300) {
      backToTop.classList.add("is-visible");
    } else {
      backToTop.classList.remove("is-visible");
    }
  });

  backToTop.addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

// ハンバーガーメニュー: 開閉トグル・外クリックで閉じる・リンククリックで閉じる
if (hamburger && nav) {
  function closeMenu() {
    nav.classList.remove("is-open");
    hamburger.setAttribute("aria-expanded", "false");
    hamburger.setAttribute("aria-label", "メニューを開く");
  }

  hamburger.addEventListener("click", function () {
    const isOpen = nav.classList.toggle("is-open");
    hamburger.setAttribute("aria-expanded", String(isOpen));
    hamburger.setAttribute("aria-label", isOpen ? "メニューを閉じる" : "メニューを開く");
  });

  document.addEventListener("click", function (e) {
    if (!header.contains(e.target)) {
      closeMenu();
    }
  });

  nav.querySelectorAll(".l-header__link").forEach(function (link) {
    link.addEventListener("click", closeMenu);
  });
}
