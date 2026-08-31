const projects = document.querySelectorAll('.project');
const dialog = document.querySelector('.lightbox');
const dialogImage = document.querySelector('#lightbox-image');
const dialogTitle = document.querySelector('#lightbox-title');
const orbit = document.querySelector('.gallery--orbit');
const orbitName = document.querySelector('#orbit-name');
const orbitMeta = document.querySelector('#orbit-meta');
const orbitReset = document.querySelector('.orbit-reset');
const detail = document.querySelector('.project-detail');
const detailMedia = document.querySelector('.detail-media');
const detailImage = document.querySelector('#detail-image');
const detailVideo = document.querySelector('#detail-video');
const detailGallery = document.querySelector('#detail-gallery');
const detailGalleryScrollbar = document.querySelector('#detail-gallery-scrollbar');
const detailGalleryScrollbarThumb = document.querySelector('#detail-gallery-scrollbar-thumb');
const detailTitle = document.querySelector('#detail-title');
const detailMeta = document.querySelector('#detail-meta');
const detailCopy = document.querySelector('.detail-copy');
const detailOriginal = document.querySelector('#detail-original');
const footerEmailLink = document.querySelector('.footer-email');
const footerEmailAddress = document.querySelector('.footer-email-address');
const aboutCover = document.querySelector('.about-cover');
const languageButtons = document.querySelectorAll('[data-language]');
const filterButtons = document.querySelectorAll('[data-filter]');
let currentLanguage = 'cn';
let activeFilter = 'all';
let activeProject = null;
let detailRevealTimer;
let detailVideoTimer;
let detailGalleryObserver;
const plainDetailProjects = new Set(['flower', 'woman', 'dream', 'skyMirror', 'future']);
let returnedOrbitFrame;
let mosaicEnterTimer;
let returnLayoutFrame;

const aboutCoverSources = {
  cn: 'assets/about-cn.png',
  en: 'assets/about-en.png',
  jp: 'assets/about-jp.png',
};

function setOrbitScrollLocked(locked) {
  document.documentElement.classList.toggle('orbit-scroll-locked', locked);
  document.body.classList.toggle('is-orbit-scroll-locked', locked);
}

const translations = {
  cn: {
    lang: 'zh-CN', documentTitle: '梁璐 — 作品集', mainNav: '主导航', languageSwitch: '语言切换', backToTop: '回到顶部', wordmarkName: '梁璐',
    navWorks: '作品', navAbout: '关于', navContact: '联系', introEyebrow: 'Selected works · 2021—2026',
    introTitle: '把感受<br />做成可见的形状。', introCopy: '三维、影像与手作之间，<br />寻找材料和情绪的临界点。', scrollWorks: '向下浏览',
    workTitle: '作品集', orbitLabel: '旋转作品环', orbitTitle: 'Works', workFilters: '作品分类筛选', filter3d: '3D', filterVideo: 'video', filterDesign: 'design', aboutEyebrow: 'About',
    contactEmail: 'lianglu1112@126.com', footerNote: 'Designed with intention',
    closePreview: '关闭预览', closeDetail: '关闭作品详情', back: '返回', viewWork: '查看', viewImage: '查看原图', viewVideo: '查看视频', hoverName: '名称', hoverTime: '制作时间', hoverType: '类型', hoverMasterProject: '研究生毕业设计', hoverUndergraduateProject: '本科毕业设计', type3d: '3D', typeUiUx: 'UI/UX设计', type3dBook: '3D，实物书', typeFilm18: '18min短片', typeFilm17: '17min短片', typeHandcraft: '手工', typeInteractive: '互动动画', typePublicService: '1min公益广告',
    orbitHomeName: '', orbitHomeMeta: '', orbitFocusName: 'kiuso', orbitFocusMeta: '焦点作品 · 点击任意作品查看详情',
    projects: {
      flower: { title: '花的轨道', meta: '2026.5', copy: '个人制作' },
      woman: { title: '女', meta: '3D/2026.6', copy: '个人制作' },
      palmFish: { title: '手心鱼梦', meta: '3D/2025.11', copy: '个人制作' },
      dream: { title: '梦', meta: '3D/2026.3', copy: '个人制作' },
      skyMirror: { title: '天空之镜', meta: '3D/2026.3', copy: '个人制作' },
      future: { title: '未来', meta: '3D/2026.3', copy: '个人制作' },
      collection: { title: 'collation', meta: 'UI/UX设计 / 2022.12', copy: '个人制作' },
      kiuso: { title: 'kiuso', meta: '3D，实物书', detailMeta: '3D，实物书|研究生毕业设计', copy: '个人制作|「Minamiku Art Next Collection 2026」出展|SICF Fukuoka2026出展' },
      island: { title: '漂浮岛屿', meta: '3D/2026.3', copy: '个人制作' },
      monica: { title: '遇见莫妮卡', meta: '18min短片', detailMeta: '18min短片|本科毕业设计', copy: '3人主创团队|剪辑、同期录音、美术' },
      lili: { title: '里里', meta: '17min短片', copy: '7人主创团队/制片/美术/同期录音/调色' },
      smell: { title: '香料气味可视化', meta: '手工/2023', copy: '个人制作' },
      herGone: { title: '消失的她', meta: '互动动画', copy: '4人主创团队/人物形象设计/部分动画制作/项目进度管理/人物配音|获中国高等院校影视学会（CCAVA）学院奖-「动画-数字媒体作品单元」学生组二等奖' },
      blocks: { title: '积木人生', meta: '1min公益广告', copy: '4人主创团队/导演|获中国高等院校影视学会（CCAVA）学院奖-短视频单元学生组三等奖' },
      foNext: { title: 'Fo-Next', meta: 'UI/UX设计 / 2023.3', copy: '个人制作' }
    }
  },
  en: {
    lang: 'en', documentTitle: 'Liang Lu — Selected Works', mainNav: 'Main navigation', languageSwitch: 'Language selector', backToTop: 'Back to top', wordmarkName: 'Liang Lu',
    navWorks: 'Works', navAbout: 'About', navContact: 'Contact', introEyebrow: 'Selected works · 2021—2026',
    introTitle: 'Giving feeling<br />a visible form.', introCopy: 'Between 3D, moving image and making,<br />I look for the threshold of material and emotion.', scrollWorks: 'Explore works',
    workTitle: 'Works', orbitLabel: 'Rotating work orbit', orbitTitle: 'Works', workFilters: 'Work filters', filter3d: '3D', filterVideo: 'video', filterDesign: 'design', aboutEyebrow: 'About',
    contactEmail: 'lianglu1112@126.com', footerNote: 'Designed with intention',
    closePreview: 'Close preview', closeDetail: 'Close work detail', back: 'Back', viewWork: 'View', viewImage: 'View image', viewVideo: 'Watch film', hoverName: 'Title', hoverTime: 'Date', hoverType: 'Type', hoverMasterProject: 'Master’s graduation project', hoverUndergraduateProject: 'Undergraduate graduation project', type3d: '3D', typeUiUx: 'UI/UX Design', type3dBook: '3D / Physical book', typeFilm18: '18-min short film', typeFilm17: '17-min short film', typeHandcraft: 'Handcraft', typeInteractive: 'Interactive animation', typePublicService: '1-min public service film',
    orbitHomeName: '', orbitHomeMeta: '', orbitFocusName: 'kiuso', orbitFocusMeta: 'Featured work · Select any work to view details',
    projects: {
      flower: { title: 'Flower Orbit', meta: 'May 2026', copy: 'Independent project' },
      woman: { title: 'Woman', meta: '3D / Jun. 2026', copy: 'Independent project' },
      palmFish: { title: 'Palm Fish Dream', meta: '3D / Nov. 2025', copy: 'Independent project' },
      dream: { title: 'Dream', meta: '3D / Mar. 2026', copy: 'Independent project' },
      skyMirror: { title: 'Mirror of the Sky', meta: '3D / Mar. 2026', copy: 'Independent project' },
      future: { title: 'Future', meta: '3D / Mar. 2026', copy: 'Independent project' },
      collection: { title: 'collation', meta: 'UI/UX Design / Dec. 2022', copy: 'Independent project' },
      kiuso: { title: 'kiuso', meta: '3D / Artist’s book', detailMeta: '3D / Artist’s book|Master’s graduation project', copy: 'Independent project|Exhibited at Minamiku Art Next Collection 2026|Exhibited at SICF Fukuoka 2026' },
      island: { title: 'Floating Island', meta: '3D / Mar. 2026', copy: 'Independent project' },
      monica: { title: 'Meet Monica', meta: '18-min short film', detailMeta: '18-min short film|Undergraduate graduation project', copy: 'Three-person core team|Editing / Production sound / Art direction' },
      lili: { title: 'Lili', meta: '17-min short film', copy: 'Seven-person core team / Producer / Art direction / Production sound / Colour grading' },
      smell: { title: 'Spice Scent Visualization', meta: 'Handcraft / 2023', copy: 'Independent project' },
      herGone: { title: 'Her Gone', meta: 'Interactive animation', copy: 'Four-person core team / Character design / Partial animation / Production management / Voice acting|Second Prize, CCAVA Academy Award — Animation & Digital Media Student Category' },
      blocks: { title: 'Building Block Life', meta: '1-min public service film', copy: 'Four-person core team / Director|Third Prize, CCAVA Academy Award — Short Video Student Category' },
      foNext: { title: 'Fo-Next', meta: 'UI/UX Design / Mar. 2023', copy: 'Independent project' }
    }
  },
  jp: {
    lang: 'ja', documentTitle: '梁璐 — 作品集', mainNav: 'メインナビゲーション', languageSwitch: '言語切替', backToTop: 'ページ上部へ', wordmarkName: 'Liang Lu',
    navWorks: '作品', navAbout: '私について', navContact: '連絡', introEyebrow: 'Selected works · 2021—2026',
    introTitle: '感覚を<br />見えるかたちに。', introCopy: '3D、映像、手作りのあいだで、<br />素材と感情の境界を探しています。', scrollWorks: '作品を見る',
    workTitle: '作品集', orbitLabel: '回転する作品リング', orbitTitle: 'Works', workFilters: '作品カテゴリー', filter3d: '3D', filterVideo: '映像', filterDesign: 'デザイン', aboutEyebrow: 'About',
    contactEmail: 'lianglu1112@gmail.com', footerNote: 'Designed with intention',
    closePreview: 'プレビューを閉じる', closeDetail: '作品詳細を閉じる', back: '戻る', viewWork: '見る', viewImage: '画像を見る', viewVideo: '映像を見る', hoverName: '作品名', hoverTime: '制作時期', hoverType: '種類', hoverMasterProject: '大学院修了制作', hoverUndergraduateProject: '大学卒業制作', hoverWorkInProgress: '制作中・随時更新', type3d: '3D', typeUiUx: 'UI/UXデザイン', type3dBook: '3D・実物書', typeFilm18: '映像', typeFilm17: '映像', typeHandcraft: '手作り', typeInteractive: 'インタラクティブアニメーション', typePublicService: '映像',
    orbitHomeName: '', orbitHomeMeta: '', orbitFocusName: 'kiuso', orbitFocusMeta: '注目作品 · 作品を選択して詳細を見る',
    projects: {
      flower: { title: '花の軌道', meta: '2026.5', copy: '個人制作' },
      woman: { title: '女', meta: '3D / 2026.6', copy: '個人制作' },
      palmFish: { title: '手のひらの魚の夢', meta: '3D / 2025.11', copy: '個人制作' },
      dream: { title: '夢', meta: '3D / 2026.3', copy: '個人制作' },
      skyMirror: { title: '空の鏡', meta: '3D / 2026.3', copy: '個人制作' },
      future: { title: '未来', meta: '3D / 2026.3', copy: '個人制作' },
      collection: { title: 'collation', meta: 'UI/UXデザイン / 2022.12', copy: '個人制作' },
      kiuso: { title: '木うそ', meta: '3D・実物書', detailMeta: '3D・実物書|大学院修了制作|制作中・随時更新', copy: '個人制作|「Minamiku Art Next Collection 2026」出展|SICF Fukuoka 2026 出展' },
      island: { title: '浮遊する島', meta: '3D / 2026.3', copy: '個人制作' },
      monica: { title: 'モニカとの出会い', meta: '映像 / 18分', detailMeta: '映像 / 18分|大学卒業制作', copy: '3人による主創チーム|編集・同期録音・美術' },
      lili: { title: '里里', meta: '映像 / 17分', detailMeta: '映像 / 17分', copy: '7人による主創チーム / プロデューサー / 美術 / 同期録音 / カラーグレーディング' },
      smell: { title: '香料の香りの可視化', meta: '手作り / 2023', copy: '個人制作' },
      herGone: { title: '消えた彼女', meta: '映像 / インタラクティブアニメーション', detailMeta: '映像 / インタラクティブアニメーション', copy: '4人による主創チーム / キャラクターデザイン / 一部アニメーション制作 / 進行管理 / 声優|中国高等院校映像学会（CCAVA）学院賞「アニメーション・デジタルメディア作品部門」学生組 二等賞' },
      blocks: { title: '積み木人生', meta: '映像 / 1分公益広告', detailMeta: '映像 / 1分公益広告', copy: '4人による主創チーム / 監督|中国高等院校映像学会（CCAVA）学院賞・ショートビデオ部門 学生組 三等賞' },
      foNext: { title: 'Fo-Next', meta: 'UI/UXデザイン / 2023.3', copy: '個人制作' }
    }
  }
};

const projectHoverDetails = {
  flower: { time: '2026.5', type: 'type3d' },
  woman: { time: '2026.6', type: 'type3d' },
  palmFish: { time: '2025.11', type: 'type3d' },
  dream: { time: '2026.3', type: 'type3d' },
  skyMirror: { time: '2026.3', type: 'type3d' },
  future: { time: '2026.3', type: 'type3d' },
  collection: { time: '2022.12', type: 'typeUiUx' },
  kiuso: { time: 'hoverMasterProject', type: 'type3dBook', note: 'hoverWorkInProgress' },
  island: { time: '2026.3', type: 'type3d' },
  monica: { time: 'hoverUndergraduateProject', type: 'typeFilm18' },
  lili: { time: '2021.3–6', type: 'typeFilm17' },
  smell: { time: '2023', type: 'typeHandcraft' },
  herGone: { time: '2020.11–2021.1', type: 'typeInteractive' },
  blocks: { time: '2020.10–2021.1', type: 'typePublicService' },
  foNext: { time: '2023.3', type: 'typeUiUx' }
};

function getText(key) {
  return translations[currentLanguage][key] || translations.cn[key] || '';
}

function getProjectPrimarySource(project) {
  if (currentLanguage === 'cn' && project.dataset.cnSrc) return project.dataset.cnSrc;
  return project.dataset.src;
}

function getProjectGallerySources(project) {
  const gallery = currentLanguage === 'cn' && project.dataset.cnGallery
    ? project.dataset.cnGallery
    : project.dataset.gallery;
  return (gallery || '').split('|').filter(Boolean);
}

function getProjectThumbnailSource(project) {
  if (currentLanguage === 'cn' && project.dataset.cnThumbnail) return project.dataset.cnThumbnail;
  return project.dataset.thumbnail;
}

function populateDetailGallery(project, gallerySources) {
  const galleryLabels = (project.dataset.galleryLabels || '').split('|');
  detailGallery.replaceChildren();
  gallerySources.forEach((source, index) => {
    const item = document.createElement('figure');
    item.className = 'detail-gallery-item';
    const image = document.createElement('img');
    image.src = source;
    image.alt = `${project.dataset.title} 图片 ${index + 1}`;
    image.loading = 'eager';
    image.addEventListener('load', syncDetailGalleryScrollbar, { once:true });
    item.append(image);

    const label = galleryLabels[index];
    if (label) {
      const caption = document.createElement('figcaption');
      caption.className = 'detail-gallery-label';
      caption.textContent = label;
      item.classList.add('has-label');
      item.append(caption);
    }

    detailGallery.append(item);
  });
}

function updateDetailText(project) {
  const isVideo = project.dataset.type === 'video';
  detailTitle.textContent = project.dataset.title;
  detailMeta.textContent = (project.dataset.detailMeta || project.querySelector('.project-meta span').textContent).replaceAll('|', '\n');
  detailCopy.textContent = (project.dataset.detailCopy || getText('independentProject') || '个人制作').replaceAll('|', '\n');
  detailOriginal.href = project.dataset.external || (isVideo ? project.dataset.video : project.dataset.src);
  detailOriginal.innerHTML = `${getText(isVideo ? 'viewVideo' : 'viewImage')} <span>↗</span>`;
}

function updateOrbitText() {
  const isFocused = orbit.classList.contains('is-zoomed');
  orbitName.textContent = getText(isFocused ? 'orbitFocusName' : 'orbitHomeName');
  orbitMeta.textContent = getText(isFocused ? 'orbitFocusMeta' : 'orbitHomeMeta');
}

function updateProjectHoverInfo(project, projectText) {
  const info = project.querySelector('.project-hover-info');
  const hoverDetail = projectHoverDetails[project.dataset.projectId];
  if (!info || !hoverDetail) return;
  info.querySelector('[data-hover="name"]').textContent = projectText.title;
  info.querySelector('[data-hover="time"]').textContent = getText(hoverDetail.time) || hoverDetail.time;
  info.querySelector('[data-hover="type"]').textContent = getText(hoverDetail.type);
  const note = info.querySelector('[data-hover="note"]');
  const noteText = hoverDetail.note ? getText(hoverDetail.note) : '';
  note.textContent = noteText;
  note.hidden = !noteText;
}

function applyFilter(filter) {
  activeFilter = activeFilter === filter ? 'all' : filter;
  projects.forEach((project) => {
    const categories = project.dataset.category.split(/\s+/);
    const isMatch = activeFilter === 'all' || categories.includes(activeFilter);
    project.hidden = false;
    project.classList.remove('is-filter-hidden');
    project.classList.toggle('is-filter-match', activeFilter !== 'all' && isMatch);
    project.setAttribute('aria-hidden', 'false');
  });
  orbit.classList.toggle('is-filtering', activeFilter !== 'all');
  orbit.dataset.activeFilter = activeFilter;
  filterButtons.forEach((button) => {
    const isActive = button.dataset.filter === activeFilter;
    button.classList.toggle('is-active', isActive);
    button.setAttribute('aria-pressed', String(isActive));
  });
}

function applyLanguage(language) {
  if (!translations[language]) return;
  currentLanguage = language;
  document.documentElement.lang = translations[language].lang;
  document.title = translations[language].documentTitle;
  document.querySelectorAll('[data-i18n]').forEach((element) => {
    element.textContent = getText(element.dataset.i18n);
  });
  document.querySelectorAll('[data-i18n-html]').forEach((element) => {
    element.innerHTML = getText(element.dataset.i18nHtml);
  });
  document.querySelectorAll('[data-i18n-aria-label]').forEach((element) => {
    element.setAttribute('aria-label', getText(element.dataset.i18nAriaLabel));
  });
  const contactEmail = getText('contactEmail');
  footerEmailLink.href = `mailto:${contactEmail}`;
  footerEmailAddress.textContent = contactEmail;
  aboutCover.src = aboutCoverSources[language];
  projects.forEach((project) => {
    const projectText = translations[language].projects[project.dataset.projectId];
    if (!projectText) return;
    project.dataset.title = projectText.title;
    project.dataset.detailCopy = projectText.copy;
    if (projectText.detailMeta) project.dataset.detailMeta = projectText.detailMeta;
    else delete project.dataset.detailMeta;
    project.querySelector('.project-meta p').textContent = projectText.title;
    project.querySelector('.project-meta span').textContent = projectText.meta;
    project.querySelector('.project-action').innerHTML = `${getText('viewWork')} <b>↗</b>`;
    const thumbnailSource = getProjectThumbnailSource(project);
    if (thumbnailSource) project.querySelector('img').src = thumbnailSource;
    updateProjectHoverInfo(project, projectText);
  });
  languageButtons.forEach((button) => {
    const isActive = button.dataset.language === language;
    button.classList.toggle('is-active', isActive);
    button.setAttribute('aria-pressed', String(isActive));
  });
  updateOrbitText();
  if (activeProject && detail.classList.contains('is-open')) {
    updateDetailText(activeProject);
    if (activeProject.dataset.cnSrc || activeProject.dataset.cnGallery) {
      const primarySource = getProjectPrimarySource(activeProject);
      const gallerySources = getProjectGallerySources(activeProject);
      detailImage.src = primarySource;
      detailImage.alt = activeProject.querySelector('img').alt;
      detail.style.setProperty('--detail-cover', `url("${encodeURI(primarySource)}")`);
      if (detail.classList.contains('is-revealed') && gallerySources.length) {
        populateDetailGallery(activeProject, gallerySources);
        detailImage.hidden = true;
        detailGallery.hidden = false;
        detailGallery.scrollTop = 0;
        setupDetailGalleryMotion();
        window.requestAnimationFrame(syncDetailGalleryScrollbar);
      }
    }
    window.requestAnimationFrame(fitDetailTitle);
  }
  try { window.localStorage.setItem('portfolio-language', language); } catch (_) {}
}

function startReturnedOrbit() {
  window.cancelAnimationFrame(returnedOrbitFrame);
  const startedAt = performance.now();
  const animate = (now) => {
    const radius = window.innerWidth <= 700
      ? Math.min(window.innerWidth * .35, 230)
      : Math.min(window.innerWidth * .32, 390);
    const spin = ((now - startedAt) / 42000) * 360;
    projects.forEach((project, index) => {
      const angle = 270 + index * (360 / projects.length) + spin;
      project.style.transform = `translate(-50%, -50%) rotate(${angle}deg) translateY(${-radius}px) rotate(${-angle}deg)`;
    });
    returnedOrbitFrame = window.requestAnimationFrame(animate);
  };
  returnedOrbitFrame = window.requestAnimationFrame(animate);
}

function fitDetailTitle() {
  detailTitle.style.fontSize = '';
  let size = parseFloat(window.getComputedStyle(detailTitle).fontSize);
  const infoStyle = window.getComputedStyle(detailTitle.parentElement);
  const availableWidth = detailTitle.parentElement.clientWidth - parseFloat(infoStyle.paddingLeft) - parseFloat(infoStyle.paddingRight);
  while (detailTitle.scrollWidth > availableWidth && size > 16) {
    size -= 1;
    detailTitle.style.fontSize = `${size}px`;
  }
}

function syncDetailGalleryScrollbar() {
  const hasOverflow = !detailGallery.hidden && detailGallery.scrollHeight > detailGallery.clientHeight;
  detailGalleryScrollbar.hidden = !hasOverflow;
  if (!hasOverflow) return;

  const thumbHeight = Math.max(36, (detailGallery.clientHeight / detailGallery.scrollHeight) * detailGallery.clientHeight);
  const maxOffset = detailGallery.clientHeight - thumbHeight;
  const scrollableHeight = detailGallery.scrollHeight - detailGallery.clientHeight;
  const offset = scrollableHeight ? (detailGallery.scrollTop / scrollableHeight) * maxOffset : 0;

  detailGalleryScrollbarThumb.style.height = `${thumbHeight}px`;
  detailGalleryScrollbarThumb.style.transform = `translateY(${offset}px)`;
}

function setupDetailGalleryMotion() {
  detailGalleryObserver?.disconnect();
  const images = detailGallery.querySelectorAll('img');
  if (!images.length) return;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    images.forEach((image) => image.classList.add('is-gallery-visible'));
    return;
  }

  detailGalleryObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      entry.target.classList.toggle('is-gallery-visible', entry.isIntersecting && entry.intersectionRatio >= 0.12);
    });
  }, {
    root: detailGallery,
    threshold: [0, 0.12, 0.3]
  });

  images.forEach((image) => detailGalleryObserver.observe(image));
}

detailGallery.addEventListener('scroll', syncDetailGalleryScrollbar);
window.addEventListener('resize', syncDetailGalleryScrollbar);

projects.forEach((project) => {
  const inner = document.createElement('div');
  inner.className = 'project-inner';
  while (project.firstChild) inner.append(project.firstChild);
  project.append(inner);
  const info = document.createElement('div');
  info.className = 'project-hover-info';
  info.setAttribute('aria-hidden', 'true');
  info.innerHTML = '<div class="project-hover-title"><p data-hover="name"></p></div><dl><div><dd data-hover="time"></dd></div><div><dd data-hover="type"></dd></div></dl><p class="project-hover-note" data-hover="note" hidden></p>';
  project.append(info);
});

function openProject(project) {
  window.clearTimeout(detailRevealTimer);
  window.clearTimeout(detailVideoTimer);
  detailGalleryObserver?.disconnect();
  detailGalleryObserver = undefined;
  activeProject = project;
  const gallerySources = getProjectGallerySources(project);
  const primarySource = getProjectPrimarySource(project);
  const hasEmbeddedVideo = project.dataset.embedVideo === 'true';

  detailGallery.hidden = true;
  detailGalleryScrollbar.hidden = true;
  detailVideo.pause();
  detailVideo.hidden = true;
  detailVideo.removeAttribute('src');
  detailVideo.load();
  populateDetailGallery(project, gallerySources);

  detailImage.src = primarySource;
  detailImage.alt = project.querySelector('img').alt;
  detail.style.setProperty('--detail-cover', `url("${encodeURI(primarySource)}")`);
  detailImage.hidden = false;
  if (hasEmbeddedVideo) {
    detailVideo.src = project.dataset.video;
    detailVideo.load();
  }
  updateDetailText(project);
  const hideOriginal = project.dataset.hideOriginal === 'true';
  detailOriginal.hidden = hideOriginal;
  detail.classList.remove('is-video');
  detail.classList.toggle('has-gallery', gallerySources.length > 0);
  detail.classList.toggle('has-video-link', project.dataset.type === 'video');
  detail.classList.toggle('is-plain-detail', plainDetailProjects.has(project.dataset.projectId));
  detail.classList.toggle('is-without-original', hideOriginal);
  detail.classList.toggle('is-portrait', project.dataset.orientation === 'portrait');
  detail.classList.add('is-open');
  detail.setAttribute('aria-hidden', 'false');
  document.body.classList.add('detail-open');
  window.requestAnimationFrame(() => {
    detailRevealTimer = window.setTimeout(() => {
      detail.classList.add('is-revealed');
      if (gallerySources.length) {
        detailImage.hidden = true;
        detailGallery.hidden = false;
        detailGallery.scrollTop = 0;
        setupDetailGalleryMotion();
        window.requestAnimationFrame(syncDetailGalleryScrollbar);
      } else if (hasEmbeddedVideo) {
        detailVideoTimer = window.setTimeout(() => {
          detailImage.hidden = true;
          detailVideo.hidden = false;
          detailVideo.currentTime = 0;
          detailVideo.play().catch(() => {});
        }, 900);
      }
      window.requestAnimationFrame(fitDetailTitle);
    }, 2000);
  });
}

function closeProjectDetail() {
  window.clearTimeout(detailRevealTimer);
  window.clearTimeout(detailVideoTimer);
  detailGalleryObserver?.disconnect();
  detailGalleryObserver = undefined;
  detailVideo.pause();
  detailVideo.hidden = true;
  detailGallery.hidden = true;
  detailGallery.replaceChildren();
  detailGalleryScrollbar.hidden = true;
  detail.classList.remove('is-revealed');
  document.body.classList.remove('detail-open');
  window.setTimeout(() => {
    detail.classList.remove('is-open');
    detail.classList.remove('is-video');
    detail.classList.remove('has-gallery');
    detail.classList.remove('has-video-link');
    detail.classList.remove('is-plain-detail');
    detail.classList.remove('is-without-original');
    detail.classList.remove('is-portrait');
    detail.style.removeProperty('--detail-cover');
    detail.setAttribute('aria-hidden', 'true');
  }, 900);
}

function resetOrbit() {
  window.cancelAnimationFrame(returnedOrbitFrame);
  window.cancelAnimationFrame(returnLayoutFrame);
  projects.forEach((project) => project.style.removeProperty('transform'));
  orbit.classList.remove('is-zoomed', 'is-focusing');
  orbit.classList.remove('is-returned', 'is-melius-enter');
  orbit.classList.add('is-mosaic', 'is-return-layout', 'is-return-enter');
  setOrbitScrollLocked(false);
  document.body.classList.remove('is-opening', 'is-intro-zoom', 'is-resetting', 'is-orbit-home');
  updateOrbitText();
  orbitReset.hidden = true;
  returnLayoutFrame = window.requestAnimationFrame(() => {
    returnLayoutFrame = window.requestAnimationFrame(() => {
      orbit.classList.remove('is-return-enter');
    });
  });
}

function settleOnRing() {
  window.cancelAnimationFrame(returnedOrbitFrame);
  window.cancelAnimationFrame(returnLayoutFrame);
  orbit.classList.remove('is-returned', 'is-mosaic', 'is-return-layout', 'is-return-enter');
  orbit.classList.remove('is-melius-enter');
  projects.forEach((project) => project.style.removeProperty('transform'));
  orbit.classList.add('is-zoomed', 'is-focusing');
  setOrbitScrollLocked(true);
  updateOrbitText();
  orbitReset.hidden = false;
  document.body.classList.remove('is-opening', 'is-intro-zoom', 'is-orbit-home');
}

function playOpening() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    resetOrbit();
    return;
  }

  window.setTimeout(() => {
    document.body.classList.remove('is-opening');
    document.body.classList.add('is-intro-zoom');
    window.setTimeout(resetOrbit, 2600);
  }, 2000);
}

projects.forEach((project) => {
  project.addEventListener('click', () => openProject(project));
  project.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      openProject(project);
    }
  });
});

orbitReset.addEventListener('click', resetOrbit);
languageButtons.forEach((button) => {
  button.addEventListener('click', () => applyLanguage(button.dataset.language));
});
document.addEventListener('click', (event) => {
  const button = event.target.closest('[data-filter]');
  if (!button) return;
  event.preventDefault();
  event.stopPropagation();
  applyFilter(button.dataset.filter);
});
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && detail.classList.contains('is-open')) {
    closeProjectDetail();
  } else if (event.key === 'Escape' && orbit.classList.contains('is-zoomed') && !dialog.open) {
    resetOrbit();
  }
});
document.querySelector('.close').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', (event) => {
  if (event.target === dialog) dialog.close();
});
document.querySelector('.detail-close').addEventListener('click', closeProjectDetail);
detail.addEventListener('click', (event) => {
  if (event.target === detail || event.target === detailMedia) closeProjectDetail();
});
window.addEventListener('load', () => {
  let savedLanguage = 'cn';
  try { savedLanguage = window.localStorage.getItem('portfolio-language') || 'cn'; } catch (_) {}
  applyLanguage(savedLanguage);
  playOpening();
}, { once: true });

setOrbitScrollLocked(true);
