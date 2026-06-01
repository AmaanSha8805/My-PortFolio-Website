/**
 * Amaan Shaikh Portfolio — Developer Command Center
 * Vanilla JavaScript
 */

(function () {
  'use strict';

  const GITHUB_USERNAME = 'AmaanSha8805';
  const TYPING_ROLES = [
    'Software Engineer',
    'Full Stack Developer',
    'AI Enthusiast'
  ];

  /* ---- DOM Ready ---- */
  document.addEventListener('DOMContentLoaded', init);

  function init() {
    setupLoader();
    setupNavigation();
    setupTypingAnimation();
    setupScrollReveal();
    setupCounters();
    setupSkillBars();
    setupTerminal();
    setupContactForm();
    setupBackToTop();
    setupYear();
    fetchGitHubData();
    generateContribGrid();
  }

  /* ---- Loading Screen ---- */
  function setupLoader() {
    const loader = document.getElementById('loader');
    window.addEventListener('load', () => {
      setTimeout(() => {
        loader.classList.add('hidden');
        document.body.classList.add('loaded');
        triggerHeroAnimations();
      }, 1800);
    });
  }

  function triggerHeroAnimations() {
    document.querySelectorAll('.hero .reveal').forEach((el, i) => {
      setTimeout(() => el.classList.add('visible'), i * 150);
    });
  }

  /* ---- Navigation ---- */
  function setupNavigation() {
    const header = document.getElementById('header');
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.getElementById('navLinks');
    const links = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
      header.classList.toggle('scrolled', window.scrollY > 50);
    });

    navToggle.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('open');
      navToggle.classList.toggle('active', isOpen);
      navToggle.setAttribute('aria-expanded', isOpen);
    });

    links.forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        navToggle.classList.remove('active');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });

    const sections = document.querySelectorAll('section[id]');
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            links.forEach(link => {
              link.classList.toggle(
                'active',
                link.getAttribute('href') === `#${entry.target.id}`
              );
            });
          }
        });
      },
      { rootMargin: '-40% 0px -55% 0px' }
    );
    sections.forEach(section => observer.observe(section));
  }

  /* ---- Typing Animation ---- */
  function setupTypingAnimation() {
    const el = document.getElementById('typingText');
    if (!el) return;

    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function type() {
      const current = TYPING_ROLES[roleIndex];
      el.textContent = isDeleting
        ? current.substring(0, charIndex - 1)
        : current.substring(0, charIndex + 1);

      if (!isDeleting) {
        charIndex++;
        if (charIndex > current.length) {
          isDeleting = true;
          setTimeout(type, 2000);
          return;
        }
      } else {
        charIndex--;
        if (charIndex === 0) {
          isDeleting = false;
          roleIndex = (roleIndex + 1) % TYPING_ROLES.length;
        }
      }

      const speed = isDeleting ? 40 : 80;
      setTimeout(type, speed);
    }

    setTimeout(type, 1000);
  }

  /* ---- Scroll Reveal ---- */
  function setupScrollReveal() {
    const reveals = document.querySelectorAll('.reveal:not(.hero .reveal)');

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );

    reveals.forEach(el => observer.observe(el));
  }

  /* ---- Animated Counters ---- */
  function setupCounters() {
    const counters = document.querySelectorAll('.stat-num');
    let animated = false;

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting && !animated) {
            animated = true;
            counters.forEach(counter => animateCounter(counter));
          }
        });
      },
      { threshold: 0.5 }
    );

    const statsEl = document.querySelector('.hero-stats');
    if (statsEl) observer.observe(statsEl);
  }

  function animateCounter(el) {
    const target = parseInt(el.dataset.target, 10);
    const duration = 1500;
    const start = performance.now();

    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(eased * target);
      if (progress < 1) requestAnimationFrame(update);
      else el.textContent = target;
    }

    requestAnimationFrame(update);
  }

  /* ---- Skill Progress Bars ---- */
  function setupSkillBars() {
    const fills = document.querySelectorAll('.skill-fill');
    let animated = false;

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting && !animated) {
            animated = true;
            fills.forEach(fill => {
              const level = fill.dataset.level;
              fill.style.setProperty('--level', `${level}%`);
              fill.classList.add('animated');
              fill.style.width = `${level}%`;
            });
          }
        });
      },
      { threshold: 0.15 }
    );

    const skillsSection = document.getElementById('skills');
    if (skillsSection) observer.observe(skillsSection);
  }

  /* ---- Terminal ---- */
  function setupTerminal() {
    const input = document.getElementById('terminalInput');
    const output = document.getElementById('terminalOutput');
    if (!input || !output) return;

    const commands = {
      help: () => 'Available commands: whoami, skills, projects, contact, clear, help',
      whoami: () => 'Amaan Shaikh',
      skills: () => 'Java, React, AWS, AI, Android Development',
      projects: () => 'ASTRAA, CerenMobile, Calisthenics Pro',
      contact: () => 'Email: amaanshaikhss510@gmail.com | LinkedIn: linkedin.com/in/amaan510',
      clear: () => null
    };

    input.addEventListener('keydown', e => {
      if (e.key !== 'Enter') return;
      e.preventDefault();

      const cmd = input.value.trim().toLowerCase();
      appendLine(`<span class="cmd">$ ${escapeHtml(input.value.trim() || '')}</span>`);

      if (cmd === 'clear') {
        output.innerHTML = '';
      } else if (commands[cmd]) {
        const result = commands[cmd]();
        if (result) appendLine(`<span class="output">${escapeHtml(result)}</span>`);
      } else if (cmd) {
        appendLine(`<span class="output">Command not found: ${escapeHtml(cmd)}. Type 'help' for available commands.</span>`);
      }

      input.value = '';
      output.scrollTop = output.scrollHeight;
    });

    function appendLine(html) {
      const p = document.createElement('p');
      p.className = 'terminal-line';
      p.innerHTML = html;
      output.appendChild(p);
    }
  }

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  /* ---- Contact Form ---- */
  function setupContactForm() {
    const form = document.getElementById('contactForm');
    const resumeBtn = document.getElementById('downloadResume');

    if (form) {
      form.addEventListener('submit', e => {
        e.preventDefault();
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const message = document.getElementById('message').value.trim();

        const subject = encodeURIComponent(`Portfolio Contact from ${name}`);
        const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`);
        window.location.href = `mailto:amaanshaikhss510@gmail.com?subject=${subject}&body=${body}`;
      });
    }

    if (resumeBtn) {
      resumeBtn.addEventListener('click', e => {
        e.preventDefault();
        alert('Resume download will be available once you upload your resume PDF to the assets folder.');
      });
    }
  }

  /* ---- Back to Top ---- */
  function setupBackToTop() {
    const btn = document.getElementById('backToTop');
    if (!btn) return;

    window.addEventListener('scroll', () => {
      btn.classList.toggle('visible', window.scrollY > 600);
    });

    btn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ---- Year ---- */
  function setupYear() {
    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();
  }

  /* ---- GitHub API ---- */
  async function fetchGitHubData() {
    try {
      const [userRes, reposRes] = await Promise.all([
        fetch(`https://api.github.com/users/${GITHUB_USERNAME}`),
        fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=6`)
      ]);

      if (!userRes.ok || !reposRes.ok) throw new Error('GitHub API error');

      const user = await userRes.json();
      const repos = await reposRes.json();

      updateGitHubStats(user, repos);
      renderLanguages(repos);
      renderRepos(repos);
    } catch {
      showGitHubFallback();
    }
  }

  function updateGitHubStats(user, repos) {
    setText('ghRepos', user.public_repos ?? '—');
    setText('ghFollowers', user.followers ?? '—');
    setText('ghFollowing', user.following ?? '—');

    const totalStars = repos.reduce((sum, r) => sum + (r.stargazers_count || 0), 0);
    setText('ghStars', totalStars);
  }

  function setText(id, value) {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
  }

  function renderLanguages(repos) {
    const container = document.getElementById('langBars');
    if (!container) return;

    const langCounts = {};
    repos.forEach(repo => {
      if (repo.language) {
        langCounts[repo.language] = (langCounts[repo.language] || 0) + 1;
      }
    });

    const langs = Object.entries(langCounts).sort((a, b) => b[1] - a[1]);
    if (langs.length === 0) {
      container.innerHTML = '<p class="text-muted">No language data available</p>';
      return;
    }

    const total = langs.reduce((s, [, c]) => s + c, 0);
    const colors = {
      JavaScript: '#f1e05a',
      TypeScript: '#3178c6',
      Python: '#3572A5',
      Java: '#b07219',
      HTML: '#e34c26',
      CSS: '#563d7c',
      'Jupyter Notebook': '#DA5B0B',
      default: '#3b82f6'
    };

    container.innerHTML = langs
      .map(([lang, count]) => {
        const pct = Math.round((count / total) * 100);
        const color = colors[lang] || colors.default;
        return `
          <div class="lang-bar-item">
            <div class="lang-bar-header">
              <span class="lang-bar-name">${escapeHtml(lang)}</span>
              <span class="lang-bar-pct">${pct}%</span>
            </div>
            <div class="lang-bar-track">
              <div class="lang-bar-fill" style="width: ${pct}%; background: ${color};"></div>
            </div>
          </div>`;
      })
      .join('');
  }

  function renderRepos(repos) {
    const container = document.getElementById('repoList');
    if (!container) return;

    if (!repos.length) {
      container.innerHTML = '<p class="text-muted">No repositories found</p>';
      return;
    }

    container.innerHTML = repos
      .slice(0, 5)
      .map(
        repo => `
        <a href="${repo.html_url}" target="_blank" rel="noopener noreferrer" class="repo-item">
          <h4>${escapeHtml(repo.name)}</h4>
          <p>${escapeHtml(repo.description || 'No description')}</p>
          <div class="repo-meta">
            ${repo.language ? `<span>● ${escapeHtml(repo.language)}</span>` : ''}
            <span>★ ${repo.stargazers_count}</span>
            <span>⑂ ${repo.forks_count}</span>
          </div>
        </a>`
      )
      .join('');
  }

  function showGitHubFallback() {
    setText('ghRepos', '—');
    setText('ghFollowers', '—');
    setText('ghFollowing', '—');
    setText('ghStars', '—');

    const langBars = document.getElementById('langBars');
    const repoList = document.getElementById('repoList');
    if (langBars) langBars.innerHTML = '<p class="text-muted">Unable to load GitHub data</p>';
    if (repoList) repoList.innerHTML = `<p class="text-muted">Visit <a href="https://github.com/${GITHUB_USERNAME}" class="text-accent" target="_blank" rel="noopener noreferrer">github.com/${GITHUB_USERNAME}</a></p>`;
  }

  /* ---- Contribution Grid ---- */
  function generateContribGrid() {
    const grid = document.getElementById('contribGrid');
    if (!grid) return;

    const weeks = 52;
    const days = 7;
    let html = '';

    for (let w = 0; w < weeks; w++) {
      for (let d = 0; d < days; d++) {
        const level = Math.random() > 0.65 ? Math.ceil(Math.random() * 4) : 0;
        html += `<div class="contrib-cell" data-level="${level}" title="Activity level ${level}"></div>`;
      }
    }

    grid.innerHTML = html;
  }
})();
