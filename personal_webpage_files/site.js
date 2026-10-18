const publicationControls = document.querySelector('.publication-controls');
const filters = Array.from(document.querySelectorAll('[data-filter]'));
const publications = Array.from(document.querySelectorAll('.publication'));
const publicationCount = document.getElementById('publicationCount');
const searchInput = document.getElementById('publicationSearch');
const emptyState = document.querySelector('.publication-empty');
let activeCategory = 'Selected';
let previousQuery = '';

const normalize = value => value.normalize('NFKC').toLocaleLowerCase().trim();
const areaKeywords = {
  'User Modeling': 'user modeling understanding personalization human intent 用户建模 用户理解 用户建模与理解',
  'Trust Calibration': 'human AI trust calibration reliance confidence 人机信任 信任校准 人机信任校准',
  'Explainable AI': 'explainability explanations XAI 可解释性 可解释人工智能',
  'Human-AI Collaboration': 'human–AI collaboration hybrid intelligence human machine collaboration 人机协同 人机协作 人智协同 混合智能',
  'AI4Science / Social Science': 'AI4Science AI4SocialScience science social science scientific discovery AI科学 科学发现 社会科学'
};
const publicationIndex = publications.map(publication => ({
  element: publication,
  categories: publication.dataset.category.split(',').map(normalize),
  text: normalize([
    ...['.pub-title', '.pub-authors', '.pub-topline', '.pub-topics'].map(selector => publication.querySelector(selector).textContent),
    ...publication.dataset.category.split(',').map(category => areaKeywords[category.trim()] || '')
  ].join(' '))
}));

function applyFilter(category = activeCategory) {
  activeCategory = category;
  const query = normalize(searchInput.value);
  const terms = query.split(/\s+/).filter(Boolean);
  let visibleCount = 0;

  publicationIndex.forEach(({ element, categories, text }) => {
    const matchesCategory = category === 'All' || categories.includes(normalize(category));
    const isVisible = matchesCategory && terms.every(term => text.includes(term));
    element.hidden = !isVisible;
    if (isVisible) visibleCount += 1;
  });

  filters.forEach(filter => {
    const isActive = filter.dataset.filter === category;
    filter.classList.toggle('active', isActive);
    filter.setAttribute('aria-pressed', String(isActive));
  });

  const noun = visibleCount === 1 ? 'publication' : 'publications';
  const scope = category === 'Selected' ? 'Selected work' : category === 'All' ? 'Full archive' : category;
  publicationCount.textContent = `${visibleCount} ${noun} · ${scope}${query ? ' · Matching your search' : ''}`;
  emptyState.hidden = visibleCount > 0;
}

filters.forEach(filter => filter.addEventListener('click', () => applyFilter(filter.dataset.filter)));
searchInput.addEventListener('input', () => {
  // Start each new search across the full archive, then allow research-area refinement.
  const query = normalize(searchInput.value);
  if (query && !previousQuery) activeCategory = 'All';
  previousQuery = query;
  applyFilter();
});

document.getElementById('resetSearch').addEventListener('click', () => {
  searchInput.value = '';
  previousQuery = '';
  applyFilter('All');
  searchInput.focus();
});

document.querySelectorAll('[data-research-filter]').forEach(link => {
  link.addEventListener('click', () => {
    searchInput.value = '';
    previousQuery = '';
    applyFilter(link.dataset.researchFilter);
  });
});

document.querySelector('.all-count').textContent = publications.length;
// All papers and native disclosure controls remain usable without JavaScript.
applyFilter();
publicationControls.hidden = false;

const navLinks = Array.from(document.querySelectorAll('.navigation a'));
const navSections = navLinks.map(link => ({ link, section: document.querySelector(link.getAttribute('href')) }));
let preferredNavLink = null;
let navUpdatePending = false;
function updateNavigation() {
  const headerBottom = document.querySelector('.site-header').getBoundingClientRect().bottom;
  const atPageEnd = window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2;
  const sectionThreshold = atPageEnd ? window.innerHeight : headerBottom + 80;
  const passedSections = navSections.filter(({ section }) => section.getBoundingClientRect().top <= sectionThreshold);
  const nearest = passedSections.sort((a, b) => b.section.getBoundingClientRect().top - a.section.getBoundingClientRect().top)[0] || navSections[0];
  // Service and teaching sit side by side on desktop; honor the chosen anchor.
  const sameRow = passedSections.filter(({ section }) => Math.abs(section.getBoundingClientRect().top - nearest.section.getBoundingClientRect().top) < 2);
  const current = sameRow.find(({ link }) => link === preferredNavLink) || nearest;
  navLinks.forEach(link => {
    if (link === current.link) link.setAttribute('aria-current', 'location');
    else link.removeAttribute('aria-current');
  });
  navUpdatePending = false;
}
navLinks.forEach(link => link.addEventListener('click', () => { preferredNavLink = link; }));
window.addEventListener('scroll', () => {
  if (!navUpdatePending) {
    navUpdatePending = true;
    requestAnimationFrame(updateNavigation);
  }
}, { passive: true });
window.addEventListener('resize', updateNavigation);
updateNavigation();
