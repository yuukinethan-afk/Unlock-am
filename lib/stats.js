const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, '..', 'data');
const statsFile = path.join(dataDir, 'stats.json');

if (!fs.existsSync(dataDir)) {
  try {
    fs.mkdirSync(dataDir, { recursive: true });
  } catch (e) {
    console.error('Failed to create data directory:', e);
  }
}

const defaultStats = {
  totalRequests: 0,
  todayPremium: 0,
  lastDate: null
};

function getTodayDateString() {
  return new Date().toISOString().slice(0, 10);
}

function loadStats() {
  try {
    if (fs.existsSync(statsFile)) {
      const raw = fs.readFileSync(statsFile, 'utf8');
      const data = JSON.parse(raw);

      const today = getTodayDateString();
      if (data.lastDate !== today) {
        data.todayPremium = 0;
        data.lastDate = today;
        saveStats(data);
      }
      return data;
    }
  } catch (err) {
    console.error('Error reading stats.json, initializing defaults:', err);
  }
  saveStats(defaultStats);
  return { ...defaultStats };
}

function saveStats(statsObj) {
  try {
    fs.writeFileSync(statsFile, JSON.stringify(statsObj, null, 2), 'utf8');
  } catch (err) {
    console.error('Error writing stats.json:', err);
  }
}

function getStats() {
  const current = loadStats();
  return { ...current };
}

function incrementStats(key) {
  const current = loadStats();
  current[key] = (current[key] || 0) + 1;
  saveStats(current);
  return current;
}

module.exports = { getStats, incrementStats };
