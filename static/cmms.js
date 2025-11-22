// CMMS frontend-only JavaScript using localStorage
const STORAGE_ASSETS = 'cmms_assets_v1';
const STORAGE_WOS = 'cmms_workorders_v1';

function loadJSON(key) {
  try {
    return JSON.parse(localStorage.getItem(key) || '[]');
  } catch (e) {
    return [];
  }
}

function saveJSON(key, arr) {
  localStorage.setItem(key, JSON.stringify(arr));
}

// Assets
function getAssets() { return loadJSON(STORAGE_ASSETS); }
function saveAssets(a) { saveJSON(STORAGE_ASSETS, a); }
function addAsset(name, location) {
  const items = getAssets();
  const nextId = items.length ? Math.max(...items.map(i=>i.id)) + 1 : 1;
  items.unshift({id: nextId, name, location, created_at: new Date().toISOString()});
  saveAssets(items);
  return items;
}

function renderAssetsTable(tbodySelector) {
  const items = getAssets();
  const tbody = document.querySelector(tbodySelector);
  if (!tbody) return;
  tbody.innerHTML = '';
  if (!items.length) {
    const r = document.createElement('tr');
    r.innerHTML = `<td colspan="4">No assets yet.</td>`;
    tbody.appendChild(r);
    return;
  }
  for (const a of items) {
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${a.id}</td><td>${escapeHtml(a.name)}</td><td>${escapeHtml(a.location||'')}</td><td>${new Date(a.created_at).toLocaleString()}</td>`;
    tbody.appendChild(tr);
  }
}

// Work Orders
function getWorkOrders() { return loadJSON(STORAGE_WOS); }
function saveWorkOrders(a) { saveJSON(STORAGE_WOS, a); }
function addWorkOrder(asset_id, description) {
  const items = getWorkOrders();
  const nextId = items.length ? Math.max(...items.map(i=>i.id)) + 1 : 1;
  items.unshift({id: nextId, asset_id: asset_id || null, description, status: 'open', created_at: new Date().toISOString()});
  saveWorkOrders(items);
  return items;
}

function renderWorkOrdersTable(tbodySelector) {
  const items = getWorkOrders();
  const tbody = document.querySelector(tbodySelector);
  if (!tbody) return;
  tbody.innerHTML = '';
  if (!items.length) {
    const r = document.createElement('tr');
    r.innerHTML = `<td colspan="5">No work orders yet.</td>`;
    tbody.appendChild(r);
    return;
  }
  for (const w of items) {
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${w.id}</td><td>${w.asset_id || '-'}</td><td>${escapeHtml(w.description)}</td><td>${escapeHtml(w.status)}</td><td>${new Date(w.created_at).toLocaleString()}</td>`;
    tbody.appendChild(tr);
  }
}

function escapeHtml(s){ return String(s||'').replace(/[&<>"]+/g, function(match){
  return ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[match]);
}); }

// Dashboard counts
function renderDashboardCounts(assetSelector, woSelector) {
  const assets = getAssets();
  const wos = getWorkOrders();
  const aEl = document.querySelector(assetSelector);
  const wEl = document.querySelector(woSelector);
  if (aEl) aEl.textContent = assets.length;
  if (wEl) wEl.textContent = wos.length;
}

// Utilities to populate asset select
function populateAssetSelect(selectSelector) {
  const s = document.querySelector(selectSelector);
  if (!s) return;
  const items = getAssets();
  s.innerHTML = '<option value="">-- Select asset (optional) --</option>' + items.map(a=>`<option value="${a.id}">${escapeHtml(a.name)}</option>`).join('');
}

// Optional simple seeding (only if empty)
function seedIfEmpty(){
  if (!getAssets().length) {
    saveAssets([{id:1,name:'HVAC Unit #1',location:'Building A - Roof',created_at:new Date().toISOString()},{id:2,name:'Generator 12',location:'Building B - Basement',created_at:new Date().toISOString()}]);
  }
  if (!getWorkOrders().length) {
    saveWorkOrders([{id:1,asset_id:1,description:'Inspect condenser coil',status:'open',created_at:new Date().toISOString()}]);
  }
}

// Expose useful functions for inline handlers
window.CMMS = { addAsset, renderAssetsTable, renderDashboardCounts, addWorkOrder, renderWorkOrdersTable, populateAssetSelect, seedIfEmpty };
