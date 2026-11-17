(() => {
  const scope = document.getElementById('scope');
  const query = document.getElementById('query');
  const status = document.getElementById('result-count');
  const empty = document.querySelector('.empty');
  const normalize = text => text.normalize('NFKC').toLowerCase().replace(/[–—-]/g, ' ').trim();
  const synonyms = {
    'User Modeling': '用户建模与理解 user modelling understanding',
    'Trust Calibration': '人机信任校准 reliance confidence',
    'Explainable AI': '可解释性 可解释人工智能 explainability xai',
    'Human-AI Collaboration': '人机协同 人机协作 人智协同 混合智能 hybrid intelligence',
    'AI4Science / Social Science': 'AI4SocialScience 科学发现 社会科学'
  };
  const entries = Array.from(document.querySelectorAll('.paper'), el => {
    const areas = el.dataset.areas.split('|');
    const text = ['h3', '.authors', '.venue', '.areas'].map(key => el.querySelector(key).textContent);
    return {el, areas, text: normalize([...text, ...areas.map(area => synonyms[area] || '')].join(' '))};
  });
  const selectedCount = entries.filter(({el}) => el.hasAttribute('data-selected')).length;
  scope.querySelector('[value="Selected"]').textContent = `Selected papers (${selectedCount})`;
  scope.querySelector('[value="All"]').textContent = `All papers (${entries.length})`;
  function render() {
    const words = normalize(query.value).split(/\s+/).filter(Boolean);
    let count = 0;
    for (const {el, areas, text} of entries) {
      const included = scope.value === 'All' || (scope.value === 'Selected' ? el.hasAttribute('data-selected') : areas.includes(scope.value));
      el.hidden = !(included && words.every(word => text.includes(word)));
      if (!el.hidden) count++;
    }
    status.textContent = `${count} ${count === 1 ? 'paper' : 'papers'} shown`;
    empty.hidden = count !== 0;
  }
  // Typing from the initial selection searches the archive. Explicit area choices narrow the results.
  query.addEventListener('input', () => { if (query.value.trim() && scope.value === 'Selected') scope.value = 'All'; render(); });
  scope.addEventListener('change', render);
  document.querySelector('.reset').addEventListener('click', () => { query.value = ''; scope.value = 'All'; render(); query.focus(); });
  render();
  document.querySelector('.paper-tools').hidden = false;
})();
