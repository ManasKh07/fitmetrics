// FitMetrics — search.js
// Loaded on every page. Works standalone — no redirect needed.

var CALC_LIST = [
  {name:"BMI Calculator", url:"/calculators/bmi-calculator.html"},
  {name:"TDEE Calculator", url:"/calculators/tdee-calculator.html"},
  {name:"Macro Calculator", url:"/calculators/macro-calculator.html"},
  {name:"Body Fat Calculator", url:"/calculators/body-fat-calculator.html"},
  {name:"Water Intake Calculator", url:"/calculators/water-calculator.html"},
  {name:"Age Calculator", url:"/calculators/age-calculator.html"},
  {name:"Percentage Calculator", url:"/calculators/percentage-calculator.html"},
  {name:"Ideal Weight Calculator", url:"/calculator.html?id=ideal-weight"},
  {name:"Lean Body Mass Calculator", url:"/calculator.html?id=lean-body-mass"},
  {name:"Calorie Deficit Calculator", url:"/calculator.html?id=calorie-deficit"},
  {name:"Calorie Surplus Calculator", url:"/calculator.html?id=calorie-surplus"},
  {name:"Protein Intake Calculator", url:"/calculator.html?id=protein-intake"},
  {name:"Fat Intake Calculator", url:"/calculator.html?id=fat-intake"},
  {name:"Carbohydrate Intake Calculator", url:"/calculator.html?id=carb-intake"},
  {name:"Fibre Intake Calculator", url:"/calculator.html?id=fiber-intake"},
  {name:"Heart Rate Zone Calculator", url:"/calculator.html?id=heart-rate-zones"},
  {name:"VO2 Max Estimator", url:"/calculator.html?id=vo2max"},
  {name:"One Rep Max (1RM) Calculator", url:"/calculator.html?id=one-rep-max"},
  {name:"Push-Up Fitness Test", url:"/calculator.html?id=push-up-test"},
  {name:"Running Pace Calculator", url:"/calculator.html?id=running-pace"},
  {name:"Steps to Calories Calculator", url:"/calculator.html?id=steps-to-calories"},
  {name:"Sleep Calculator", url:"/calculator.html?id=sleep-calculator"},
  {name:"BMI Prime Calculator", url:"/calculator.html?id=bmi-prime"},
  {name:"Waist-to-Height Ratio", url:"/calculator.html?id=waist-to-height"},
  {name:"Waist-to-Hip Ratio", url:"/calculator.html?id=waist-to-hip"},
  {name:"Army Body Fat Calculator", url:"/calculator.html?id=army-body-fat"},
  {name:"Exercise Calorie Burn", url:"/calculator.html?id=calorie-burn-exercise"},
  {name:"Pregnancy Weight Gain", url:"/calculator.html?id=pregnancy-weight"},
  {name:"Due Date Calculator", url:"/calculator.html?id=due-date"},
  {name:"Body Surface Area Calculator", url:"/calculator.html?id=body-surface-area"},
  {name:"Nicotine Intake Calculator", url:"/calculator.html?id=nicotine-calculator"},
  {name:"Child Calorie Calculator", url:"/calculator.html?id=calorie-intake-children"},
  {name:"Alcohol Units Calculator", url:"/calculator.html?id=alcohol-units"},
  {name:"BMI for Children", url:"/calculator.html?id=bmi-children"},
  {name:"Pace to Speed Converter", url:"/calculator.html?id=pace-to-speed"},
  {name:"Resting Metabolic Rate", url:"/calculator.html?id=resting-metabolic-rate"}
];

function searchCalcs(q) {
  var input = document.getElementById('hdr-search') || document.getElementById('header-search');
  var box = document.getElementById('hdr-results') || document.getElementById('hdr-results-home');
  if (!box) return;
  q = (q || '').trim().toLowerCase();
  if (!q) { box.innerHTML = ''; box.style.display = 'none'; return; }
  var matches = CALC_LIST.filter(function(c) {
    return c.name.toLowerCase().includes(q);
  }).slice(0, 8);
  if (!matches.length) {
    box.innerHTML = '<div class="hdr-no-result">No results for "' + q + '"</div>';
    box.style.display = 'block';
    return;
  }
  box.innerHTML = matches.map(function(c) {
    return '<a href="' + c.url + '" class="hdr-result-item">' + c.name + '</a>';
  }).join('');
  box.style.display = 'block';
}

// Also called on index.html inline search bar
function filterCalcs(q) {
  q = (q || '').toLowerCase().trim();
  var cards = document.querySelectorAll('.calc-card');
  var labels = document.querySelectorAll('.calc-category-label');
  var seeAll = document.querySelector('.see-all-row');
  if (!q) {
    cards.forEach(function(c) { c.style.display = ''; });
    labels.forEach(function(l) { l.style.display = ''; });
    if (seeAll) seeAll.style.display = '';
    return;
  }
  cards.forEach(function(c) {
    c.style.display = c.textContent.toLowerCase().includes(q) ? '' : 'none';
  });
  labels.forEach(function(label) {
    var grid = label.nextElementSibling;
    if (!grid) return;
    var visible = Array.from(grid.querySelectorAll('.calc-card')).some(function(c) {
      return c.style.display !== 'none';
    });
    label.style.display = visible ? '' : 'none';
  });
  if (seeAll) seeAll.style.display = 'none';
  // Also update header dropdown
  updateHeaderDropdown(q);
}

function updateHeaderDropdown(q) {
  var box = document.getElementById('hdr-results-home');
  if (!box) return;
  q = (q || '').trim().toLowerCase();
  if (!q) { box.innerHTML = ''; box.style.display = 'none'; return; }
  var matches = CALC_LIST.filter(function(c) {
    return c.name.toLowerCase().includes(q);
  }).slice(0, 6);
  if (!matches.length) {
    box.innerHTML = '<div class="hdr-no-result">Scroll down to see filtered results</div>';
    box.style.display = 'block';
    return;
  }
  box.innerHTML = matches.map(function(c) {
    return '<a href="' + c.url + '" class="hdr-result-item">' + c.name + '</a>';
  }).join('');
  box.style.display = 'block';
}

function goRandom(e) {
  if (e) e.preventDefault();
  window.location = CALC_LIST[Math.floor(Math.random() * CALC_LIST.length)].url;
}

function goRandomHome(e) {
  if (e) e.preventDefault();
  // On homepage, use relative URLs
  var r = CALC_LIST[Math.floor(Math.random() * CALC_LIST.length)];
  window.location = r.url;
}

// Close dropdown when clicking outside
document.addEventListener('click', function(e) {
  var ids = ['hdr-results', 'hdr-results-home'];
  ids.forEach(function(id) {
    var box = document.getElementById(id);
    if (box && !e.target.closest('#hdr-search') && !e.target.closest('#header-search') && !e.target.closest('#' + id)) {
      box.style.display = 'none';
    }
  });
});

// Active nav highlight
(function() {
  var links = document.querySelectorAll('nav a');
  var path = window.location.pathname;
  links.forEach(function(a) {
    var href = a.getAttribute('href') || '';
    var clean = href.replace('../', '').replace('./', '').replace(/^\//, '');
    if (clean && (path.endsWith(clean) || path.endsWith('/' + clean))) {
      a.classList.add('active');
    }
  });
})();
