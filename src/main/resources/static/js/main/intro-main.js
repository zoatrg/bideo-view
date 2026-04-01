document.addEventListener('DOMContentLoaded', function () {

  // 1. FAQ 아코디언
  document.querySelectorAll('.intro-faq__trigger').forEach(function (btn) {
    btn.addEventListener('click', function () {
      const content = btn.nextElementSibling;
      const isOpen = btn.getAttribute('aria-expanded') === 'true';

      btn.setAttribute('aria-expanded', String(!isOpen));

      if (isOpen) {
        content.hidden = true;
      } else {
        content.hidden = false;
      }
    });
  });

  // 2. 히어로 비디오 음소거/해제
  const muteBtn = document.getElementById('mute-btn');
  const heroVideo = document.querySelector('.intro-hero__video');
  if (muteBtn && heroVideo) {
    muteBtn.addEventListener('click', function () {
      heroVideo.muted = !heroVideo.muted;
      const useEl = muteBtn.querySelector('use');
      if (useEl) {
        useEl.setAttribute('href', heroVideo.muted ? '#icon-volume-off' : '#icon-volume-up');
      }
      muteBtn.setAttribute('aria-label', heroVideo.muted ? '음소거 해제' : '음소거');
    });
  }

  // 3. 스크롤 페이드업 애니메이션
  var fadeTargets = document.querySelectorAll('.scroll-fade-up');
  if (fadeTargets.length) {
    var fadeObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('show');
          fadeObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

    fadeTargets.forEach(function (el) { fadeObserver.observe(el); });
  }

  // 4. 헤더 스크롤 활성 링크 하이라이트
  var sectionIds = ['hero', 'features', 'faq', 'resources'];
  var navLinks = document.querySelectorAll('.intro-header__nav a[href^="#"]');
  if (navLinks.length) {
    var navObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var id = entry.target.id;
        navLinks.forEach(function (link) {
          if (link.getAttribute('href') === '#' + id) {
            link.classList.add('is-active');
          } else {
            link.classList.remove('is-active');
          }
        });
      });
    }, { rootMargin: '-70px 0px -50% 0px', threshold: 0.2 });

    sectionIds.forEach(function (id) {
      var section = document.getElementById(id);
      if (section) navObserver.observe(section);
    });
  }

  // 5. 모바일 햄버거 메뉴
  var hamburger = document.getElementById('hamburger-btn');
  var nav = document.getElementById('intro-nav');
  var actions = document.querySelector('.intro-header__actions');
  if (hamburger && nav) {
    hamburger.addEventListener('click', function () {
      var isOpen = hamburger.getAttribute('aria-expanded') === 'true';
      hamburger.setAttribute('aria-expanded', String(!isOpen));

      nav.classList.toggle('is-open');
      if (actions) actions.classList.toggle('is-open');
    });
  }

  // 6. 비디오 자동재생 관리 (뷰포트 진입/이탈)
  var videos = document.querySelectorAll('video[autoplay]');
  if (videos.length) {
    var videoObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.play().catch(function () {});
        } else {
          entry.target.pause();
        }
      });
    }, { threshold: 0.25 });

    videos.forEach(function (video) { videoObserver.observe(video); });
  }

  // 7. 시작하기 버튼 → 로그인 모달 (auth-modal.js가 로드되면 showAuthModal 사용)
  document.querySelectorAll('#btn-start, #btn-hero-start, #btn-cta-start').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      if (typeof showAuthModal === 'function') {
        showAuthModal();
      } else {
        window.location.href = '/main';
      }
    });
  });

});
