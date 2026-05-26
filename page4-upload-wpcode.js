let ga4Data = null;
let shopifyData = null;
let modelingStatus = 'unknown';
let ga4DateRange = null;

function selectModeling(v) {
  modelingStatus = v;
  ['yes','no','unknown'].forEach(k => {
    document.getElementById('mod-' + k).classList.toggle('selected', k === v);
  });
}

function handleFile(type, input) {
  const file = input.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function(e) {
    const parsed = parseCSV(e.target.result);
    if (type === 'ga4') {
      ga4Data = parsed;
      const zone = document.getElementById('ga4-zone');
      zone.classList.add('loaded');
      zone.querySelector('.uz-icon').className = 'ti ti-circle-check uz-icon';
      zone.querySelector('.uz-title').textContent = 'GA4 transactions loaded';
      zone.querySelector('.uz-sub').textContent = parsed.rows.length + ' rows detected';
      if (parsed.dateRange) {
        ga4DateRange = parsed.dateRange;
        const dd = document.getElementById('date-detect');
        document.getElementById('date-detect-text').textContent = 'Date range detected from GA4 file: ' + parsed.dateRange;
        dd.style.display = 'flex';
      }
    } else {
      shopifyData = parsed;
      const zone = document.getElementById('shopify-zone');
      zone.classList.add('loaded');
      zone.querySelector('.uz-icon').className = 'ti ti-circle-check uz-icon';
      zone.querySelector('.uz-title').textContent = 'Shopify payments loaded';
      zone.querySelector('.uz-sub').textContent = parsed.rows.length + ' rows detected';
    }
    updateRunBtn();
  };
  reader.readAsText(file);
}

function parseCSV(text) {
  const lines = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n').split('\n');
  let dateRange = null;
  let headerIdx = -1;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('Start date:')) {
      const s = lines[i].match(/(\d{8})/);
      const e = lines[i+1] ? lines[i+1].match(/(\d{8})/) : null;
      if (s) {
        const fmt = d => d[1].slice(0,4) + '-' + d[1].slice(4,6) + '-' + d[1].slice(6,8);
        dateRange = fmt(s) + (e ? ' to ' + fmt(e) : '');
      }
    }
    if (lines[i] && !lines[i].startsWith('#') && lines[i].includes(',')) {
      headerIdx = i; break;
    }
  }
  if (headerIdx === -1) return { rows: [], headers: [], dateRange };
  const headers = parseCSVLine(lines[headerIdx]);
  const rows = [];
  for (let i = headerIdx + 1; i < lines.length; i++) {
    if (!lines[i].trim()) continue;
    const vals = parseCSVLine(lines[i]);
    const obj = {};
    headers.forEach((h, idx) => { obj[h.trim()] = (vals[idx] || '').trim().replace(/^"|"$/g, ''); });
    rows.push(obj);
  }
  return { rows, headers, dateRange };
}

function parseCSVLine(line) {
  const result = [];
  let cur = ''; let inQ = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (c === '"') { inQ = !inQ; }
    else if (c === ',' && !inQ) { result.push(cur); cur = ''; }
    else { cur += c; }
  }
  result.push(cur);
  return result;
}

function updateRunBtn() {
  const btn = document.getElementById('run-btn');
  const hint = document.getElementById('run-hint');
  if (ga4Data && shopifyData) {
    btn.disabled = false;
    hint.style.display = 'none';
  } else {
    btn.disabled = true;
    hint.style.display = 'block';
  }
}

function runAnalysis() {
  if (!ga4Data || !shopifyData) {
    const err = document.getElementById('error-msg');
    err.style.display = 'flex';
    document.getElementById('error-text').textContent = 'Please upload both files before running the analysis.';
    return;
  }

  const ga4Map = {};
  let ga4TotalRev = 0;
  ga4Data.rows.forEach(r => {
    const id = (r['Transaction ID'] || r['transaction_id'] || '').trim().replace(/^#/, '');
    const rev = parseFloat(r['Purchase revenue'] || r['purchase_revenue'] || r['Revenue'] || 0) || 0;
    if (id) { ga4Map[id] = rev; ga4TotalRev += rev; }
  });

  const shopMap = {};
  let shopTotalRev = 0;
  shopifyData.rows.forEach(r => {
    const kind = (r['Transaction kind'] || r['transaction_kind'] || '').trim().toLowerCase();
    if (kind && kind !== 'sale') return;
    const id = (r['Order ID'] || r['order_id'] || r['Name'] || '').trim().replace(/^#/, '');
    const amt = parseFloat(r['Transaction amount'] || r['transaction_amount'] || r['Total'] || 0) || 0;
    if (id && id !== '0') { shopMap[id] = amt; shopTotalRev += amt; }
  });

  let matched = 0, ga4Only = 0, shopOnly = 0;
  let matchedGA4Rev = 0, matchedShopRev = 0;
  let diffs = [];
  let zeroRevCount = 0;

  Object.keys(ga4Map).forEach(id => {
    if (id in shopMap) {
      matched++;
      matchedGA4Rev += ga4Map[id];
      matchedShopRev += shopMap[id];
      diffs.push(ga4Map[id] - shopMap[id]);
      if (ga4Map[id] === 0) zeroRevCount++;
    } else {
      ga4Only++;
    }
  });
  Object.keys(shopMap).forEach(id => { if (!(id in ga4Map)) shopOnly++; });

  const totalShopify = matched + shopOnly;
  const matchRate = totalShopify > 0 ? (matched / totalShopify) * 100 : 0;
  const revVariance = shopTotalRev > 0 ? Math.abs(ga4TotalRev - shopTotalRev) / shopTotalRev * 100 : 0;
  const sortedDiffs = diffs.slice().sort((a, b) => a - b);
  const medianDiff = sortedDiffs.length > 0 ? sortedDiffs[Math.floor(sortedDiffs.length / 2)] : 0;

  let grade, gradeColor, gradeDesc;
  if (matchRate >= 95) { grade = 'A'; gradeColor = '#1a7a3c'; gradeDesc = 'Excellent. Your GA4 ecommerce data is highly reliable. Minor gaps are expected and within normal range.'; }
  else if (matchRate >= 90) { grade = 'A-'; gradeColor = '#1a7a3c'; gradeDesc = 'Very good. Normal data loss from ad blockers and browser privacy. Your data is reliable for reporting.'; }
  else if (matchRate >= 85) { grade = 'B+'; gradeColor = '#27ae60'; gradeDesc = 'Good. Above average for most ecommerce properties. A few specific issues are worth investigating.'; }
  else if (matchRate >= 80) { grade = 'B'; gradeColor = '#27ae60'; gradeDesc = 'Good overall but meaningful gaps exist. Some revenue reporting decisions should be made with caution.'; }
  else if (matchRate >= 75) { grade = 'C+'; gradeColor = '#f0b429'; gradeDesc = 'Acceptable but notable blind spots. Budget and ROAS calculations are affected.'; }
  else if (matchRate >= 65) { grade = 'C'; gradeColor = '#f0b429'; gradeDesc = 'Needs attention. Roughly 1 in 4 of your orders is invisible to GA4. Fix the issues below before trusting this data for decisions.'; }
  else if (matchRate >= 55) { grade = 'D'; gradeColor = '#e67e22'; gradeDesc = 'Significant tracking problems. Do not use GA4 revenue data for budget or ROAS decisions until resolved.'; }
  else { grade = 'F'; gradeColor = '#c0392b'; gradeDesc = 'Critical. GA4 is missing the majority of your orders. Your analytics setup needs immediate attention.'; }

  if (revVariance > 15 && !(Math.abs(medianDiff) < 10)) {
    if (grade === 'A') grade = 'A-';
    else if (grade === 'A-') grade = 'B+';
    else if (grade === 'B+') grade = 'B';
    else if (grade === 'B') grade = 'C+';
    else if (grade === 'C+') grade = 'C';
    else if (grade === 'C') grade = 'D';
  }

  const callouts = [];
  if (shopOnly > 0) {
    const pct = Math.round(shopOnly / totalShopify * 100);
    callouts.push({ type: 'danger', icon: 'ti-alert-circle', text: shopOnly.toLocaleString() + ' Shopify orders (' + pct + '%) have no matching GA4 transaction. These are real sales that GA4 never captured. This is the most important issue to investigate.' });
  }
  if (Math.abs(medianDiff) > 0.5 && Math.abs(medianDiff) < 20) {
    callouts.push({ type: 'warn', icon: 'ti-receipt', text: 'The median revenue difference on matched orders is $' + Math.abs(medianDiff).toFixed(2) + '. GA4 is likely capturing subtotal only while Shopify includes shipping costs. Confirm what your purchase event sends as the revenue value.' });
  } else if (revVariance > 15) {
    callouts.push({ type: 'warn', icon: 'ti-receipt', text: 'Revenue variance of ' + revVariance.toFixed(1) + '% between GA4 and Shopify. This goes beyond a shipping field mismatch. Review your purchase event revenue configuration in GTM.' });
  }
  if (modelingStatus === 'yes') {
    callouts.push({ type: 'info', icon: 'ti-cpu', text: 'GA4 behavioral modeling is active. Some transactions in your report are estimated by Google to fill consent-related gaps, not directly observed. Your actual tag coverage may be lower than the match rate suggests.' });
  }
  if (ga4Only > 10) {
    callouts.push({ type: 'info', icon: 'ti-arrows-exchange', text: ga4Only + ' transactions appear in GA4 but not in Shopify. Common causes: cancelled orders still counted in GA4, test orders, or a date range mismatch between exports.' });
  }
  if (zeroRevCount > 5) {
    callouts.push({ type: 'warn', icon: 'ti-currency-dollar-off', text: zeroRevCount + ' GA4 transactions recorded $0 in revenue. These are likely tag misfires where a purchase event fired without a revenue value attached.' });
  }

  const results = {
    grade, gradeColor, gradeDesc, matchRate, matched, shopOnly, ga4Only,
    totalShopify, ga4TotalRev, shopTotalRev, revVariance, medianDiff,
    zeroRevCount, callouts, modelingStatus,
    dateRange: ga4DateRange || 'the selected period'
  };

  sessionStorage.setItem('nobsCheckerResults', JSON.stringify(results));
  window.location.href = '/ga4-checker/results';
}

updateRunBtn();
