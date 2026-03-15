// FitMetrics — calculators-data.js
// All dynamic calculators. Add new entries here — no new HTML files needed.
// Each calculator can have: title, desc, icon, category, fields[], calculate(f), interpret(result), faq[], related[]

const CALCULATORS = {

"ideal-weight": {
  title: "Ideal Weight Calculator",
  desc: "A height-based estimate of healthy body weight using the Devine formula. Useful as a rough reference — not a target to obsess over.",
  icon: "⚖", category: "Body",
  fields: [
    { id:"iw_gender", label:"Sex", type:"select", options:[["male","Male"],["female","Female"]] },
    { id:"iw_height", label:"Height", type:"number", placeholder:"e.g. 175",
      unit:{ id:"iw_height_unit", options:[["cm","cm"],["ft","ft"]] } }
  ],
  stats: { title:"Ideal Weight by Height", header:["Height","Ideal Weight (M / F)"], rows:[["160 cm","54 / 49 kg"],["165 cm","57 / 53 kg"],["170 cm","61 / 56 kg"],["175 cm","65 / 60 kg"],["180 cm","69 / 63 kg"],["185 cm","73 / 67 kg"]], note:"Devine formula. ±5 kg for frame size." },
  calculate(f) {
    let h = parseFloat(f.iw_height);
    if (isNaN(h) || h <= 0) return null;
    if (f.iw_height_unit === "ft") h = h * 30.48;
    const inches = h / 2.54;
    let base = f.iw_gender === "male" ? 50 + 2.3*(inches-60) : 45.5 + 2.3*(inches-60);
    base = Math.max(base, 30);
    const lb = (base * 2.205).toFixed(1);
    return { value: base.toFixed(1) + " kg  /  " + lb + " lb", label:"Ideal body weight (Devine formula)",
      category: base < 55 ? "Light frame" : base < 75 ? "Medium frame" : "Tall frame",
      interpretation: "Your ideal weight range is approximately " + (base-5).toFixed(0) + "–" + (base+5).toFixed(0) + " kg. This is an estimate based on height alone. A healthy weight considers muscle mass, bone structure, and overall fitness — not just a single number. Use this alongside your <a href='/calculators/bmi-calculator.html'>BMI</a> and <a href='/calculators/body-fat-calculator.html'>body fat %</a> for a fuller picture." };
  },
  faq:[["Is ideal weight the same as healthy weight?","Not exactly. Ideal weight is just a height-based estimate. A truly healthy weight also factors in muscle mass, bone density, and body composition — two people can have identical 'ideal weights' and look completely different."],["Which formula is used?","The Devine formula, published in 1974 and still used in clinical settings today. It was originally developed for drug dosing, not aesthetics."]],
  related:["bmi-calculator","body-fat-calculator","tdee-calculator"]
},

"lean-body-mass": {
  title: "Lean Body Mass Calculator",
  desc: "Calculate your lean body mass — muscles, bones, organs, water. Everything that isn't fat. This number drives your metabolism more than your total weight does.",
  icon: "💪", category: "Body",
  fields: [
    { id:"lbm_gender", label:"Sex", type:"select", options:[["male","Male"],["female","Female"]] },
    { id:"lbm_weight", label:"Weight", type:"number", placeholder:"e.g. 75",
      unit:{ id:"lbm_wu", options:[["kg","kg"],["lb","lb"]] } },
    { id:"lbm_height", label:"Height", type:"number", placeholder:"e.g. 175",
      unit:{ id:"lbm_hu", options:[["cm","cm"],["ft","ft"]] } }
  ],

  calculate(f) {
    let w = parseFloat(f.lbm_weight), h = parseFloat(f.lbm_height);
    if (isNaN(w) || isNaN(h) || w <= 0 || h <= 0) return null;
    if (f.lbm_wu==="lb") w = w*0.4536;
    if (f.lbm_hu==="ft") h = h*30.48;
    const lbm = f.lbm_gender==="male" ? 0.407*w+0.267*h-19.2 : 0.252*w+0.473*h-48.3;
    const fatMass = w - lbm;
    const bfPct = ((fatMass/w)*100).toFixed(1);
    return { value: lbm.toFixed(1) + " kg", label:"Lean body mass (Boer formula)",
      category:"Fat mass: " + fatMass.toFixed(1) + " kg  |  Body fat: " + bfPct + "%",
      interpretation:"Your lean mass of " + lbm.toFixed(1) + " kg includes muscles, bones, organs and water. Lean mass determines your basal metabolic rate — people with more lean mass burn more calories at rest. Resistance training increases lean mass, raising metabolism and improving body composition even without weight loss." };
  },
  faq:[["What is lean body mass?","Everything except fat — muscles, bones, organs, and water. It's the part of your body that burns calories, moves weight, and keeps you alive."],["Why does it matter?","Your lean mass sets your baseline metabolism. More lean mass means more calories burned at rest, which is why building muscle makes fat loss easier over time."]],
  related:["body-fat-calculator","bmi-calculator","tdee-calculator"]
},

"calorie-deficit": {
  title: "Calorie Deficit Calculator",
  desc: "Find out exactly how many calories to eat daily to lose weight at a pace that won't make you miserable.",
  icon: "📉", category: "Nutrition",
  fields: [
    { id:"cd_gender", label:"Sex", type:"select", options:[["male","Male"],["female","Female"]] },
    { id:"cd_age", label:"Age", type:"number", placeholder:"e.g. 28" },
    { id:"cd_weight", label:"Weight", type:"number", placeholder:"e.g. 80",
      unit:{ id:"cd_wu", options:[["kg","kg"],["lb","lb"]] } },
    { id:"cd_height", label:"Height", type:"number", placeholder:"e.g. 175",
      unit:{ id:"cd_hu", options:[["cm","cm"],["ft","ft"]] } },
    { id:"cd_activity", label:"Activity Level", type:"select", options:[["1.2","Sedentary"],["1.375","Light exercise"],["1.55","Moderate exercise"],["1.725","Very active"]] },
    { id:"cd_loss", label:"Weight loss per week", type:"select", options:[["0.25","0.25 kg / 0.5 lb (gentle)"],["0.5","0.5 kg / 1 lb (moderate)"],["0.75","0.75 kg / 1.5 lb (fast)"],["1","1 kg / 2 lb (aggressive)"]] }
  ],
  stats: { title:"Deficit vs Weekly Loss", header:["Daily Deficit","~Weekly Loss"], rows:[["250 kcal","~0.25 kg"],["500 kcal","~0.5 kg"],["750 kcal","~0.75 kg"],["1,000 kcal","~1 kg"]], note:"1 kg fat ≈ 7,700 kcal. Min 1,200 kcal/day (F), 1,500 (M)." },
  calculate(f) {
    let w=parseFloat(f.cd_weight), h=parseFloat(f.cd_height);
    const age=parseFloat(f.cd_age), act=parseFloat(f.cd_activity), loss=parseFloat(f.cd_loss);
    if (isNaN(age) || isNaN(w) || isNaN(h) || w <= 0 || h <= 0) return null;
    if (f.cd_wu==="lb") w=w*0.4536;
    if (f.cd_hu==="ft") h=h*30.48;
    const bmr = f.cd_gender==="male" ? 10*w+6.25*h-5*age+5 : 10*w+6.25*h-5*age-161;
    const tdee = bmr*act;
    const target = tdee-((loss*7700)/7);
    return { value: Math.round(target) + " kcal/day",
      label:"Daily calorie target for " + loss + " kg/week loss",
      category:"Your TDEE: " + Math.round(tdee) + " kcal/day",
      interpretation:"Eating " + Math.round(target) + " kcal per day creates a deficit of approximately " + Math.round(tdee-target) + " kcal/day. At this rate you will lose roughly " + loss + " kg per week. A deficit of 300–500 kcal/day is sustainable long-term. Ensure you eat at least 1,200 kcal (women) or 1,500 kcal (men) per day to avoid nutritional deficiencies." };
  },
  faq:[["How big a deficit is safe?","A 300–500 kcal/day deficit is the sweet spot — fast enough to see progress, slow enough to not feel terrible. Bigger deficits tend to increase muscle loss and are hard to sustain."],["Will I lose muscle on a deficit?","You'll lose some if you're not careful. Eating enough protein (1.6–2.4g per kg of bodyweight) and doing resistance training are the two things that protect muscle while cutting."]],
  related:["tdee-calculator","macro-calculator","protein-intake"]
},

"calorie-surplus": {
  title: "Calorie Surplus Calculator",
  desc: "Find out how many calories to eat daily to build muscle without piling on unnecessary fat.",
  icon: "📈", category: "Nutrition",
  fields: [
    { id:"cs_gender", label:"Sex", type:"select", options:[["male","Male"],["female","Female"]] },
    { id:"cs_age", label:"Age", type:"number", placeholder:"e.g. 25" },
    { id:"cs_weight", label:"Weight", type:"number", placeholder:"e.g. 70",
      unit:{ id:"cs_wu", options:[["kg","kg"],["lb","lb"]] } },
    { id:"cs_height", label:"Height", type:"number", placeholder:"e.g. 175",
      unit:{ id:"cs_hu", options:[["cm","cm"],["ft","ft"]] } },
    { id:"cs_activity", label:"Activity Level", type:"select", options:[["1.2","Sedentary"],["1.375","Light exercise"],["1.55","Moderate exercise"],["1.725","Very active"]] },
    { id:"cs_goal", label:"Surplus size", type:"select", options:[["200","Lean bulk (+200 kcal)"],["350","Moderate bulk (+350 kcal)"],["500","Aggressive bulk (+500 kcal)"]] }
  ],

  calculate(f) {
    let w=parseFloat(f.cs_weight), h=parseFloat(f.cs_height);
    const age=parseFloat(f.cs_age), act=parseFloat(f.cs_activity), surplus=parseFloat(f.cs_goal);
    if (isNaN(age) || isNaN(w) || isNaN(h) || w <= 0 || h <= 0) return null;
    if (f.cs_wu==="lb") w=w*0.4536;
    if (f.cs_hu==="ft") h=h*30.48;
    const bmr = f.cs_gender==="male" ? 10*w+6.25*h-5*age+5 : 10*w+6.25*h-5*age-161;
    const tdee = bmr*act;
    const target = tdee+surplus;
    return { value: Math.round(target) + " kcal/day",
      label:"Daily calorie target for muscle gain",
      category:"Surplus: +" + surplus + " kcal above your TDEE of " + Math.round(tdee),
      interpretation:"A surplus of " + surplus + " kcal/day above your maintenance provides the energy needed for muscle protein synthesis. A lean bulk (+200 kcal) minimises fat gain. A moderate bulk (+350 kcal) balances speed of gain with body composition. Most of the surplus weight should come from increased protein and carbohydrate intake around training sessions." };
  },
  faq:[["How much muscle can I gain per month?","Beginners with good training and nutrition can realistically gain 1–2 kg/month. Intermediate lifters are closer to 0.5–1 kg. Anyone promising more is probably selling something."],["What is a lean bulk?","A lean bulk uses a small surplus (200–300 kcal) to build muscle slowly while minimising fat gain. It requires more patience but less time cutting afterward."]],
  related:["tdee-calculator","protein-intake","macro-calculator"]
},

"protein-intake": {
  title: "Protein Intake Calculator",
  desc: "Work out how much protein you actually need per day. Most people — even regular gym-goers — are eating less than they think.",
  icon: "🥩", category: "Nutrition",
  fields: [
    { id:"pi_weight", label:"Weight", type:"number", placeholder:"e.g. 75",
      unit:{ id:"pi_wu", options:[["kg","kg"],["lb","lb"]] } },
    { id:"pi_goal", label:"Goal", type:"select", options:[["1.6","Maintain muscle"],["2.0","Build muscle"],["2.4","Athlete / heavy training"],["1.2","Lose weight (preserve muscle)"]] }
  ],
  stats: { title:"Protein in Common Foods", header:["Food (100g)","Protein"], rows:[["Chicken breast","31g"],["Tuna (canned)","26g"],["Eggs (whole)","13g"],["Greek yogurt","10g"],["Tofu (firm)","17g"],["Lentils (cooked)","9g"]], note:"Protein provides 4 kcal per gram." },
  calculate(f) {
    let w=parseFloat(f.pi_weight);
    if (isNaN(w) || w <= 0) return null;
    if (f.pi_wu==="lb") w=w*0.4536;
    const g=parseFloat(f.pi_goal);
    const grams = Math.round(w*g);
    const kcal = grams*4;
    const meals = Math.round(grams/30);
    return { value: grams + "g / day",
      label:"Daily protein target (" + g + "g per kg body weight)",
      category:kcal + " kcal from protein  |  ~" + meals + " protein-rich meals",
      interpretation:"Aim to spread your " + grams + "g of protein across " + meals + " meals of 25–35g each. This distributes amino acid availability throughout the day, maximising muscle protein synthesis. Best sources include chicken, fish, eggs, Greek yogurt, cottage cheese, tofu, and legumes. Each gram of protein provides 4 kcal." };
  },
  faq:[["Can I eat too much protein?","For healthy adults it's hard to cause real harm. Above 2.2g/kg you get diminishing returns for muscle building, but there's no evidence of harm up to 3.5g/kg if kidneys are healthy."],["What are the best protein sources?","Chicken, fish, eggs, Greek yogurt, cottage cheese, tofu, lentils, and chickpeas. Whey protein is fine if whole food sources aren't enough — it's not magic though."]],
  related:["macro-calculator","tdee-calculator","calorie-deficit"]
},

"fat-intake": {
  title: "Fat Intake Calculator",
  desc: "Work out your daily fat target in grams. Fat got a bad reputation in the 90s — it doesn't deserve it.",
  icon: "🥑", category: "Nutrition",
  fields: [
    { id:"fi_calories", label:"Daily Calorie Target (kcal)", type:"number", placeholder:"e.g. 2000" },
    { id:"fi_pct", label:"Fat percentage of diet", type:"select", options:[["20","20% (low fat)"],["30","30% (standard)"],["35","35% (moderate high)"],["40","40% (high fat / keto)"]] }
  ],

  calculate(f) {
    const cal=parseFloat(f.fi_calories), pct=parseFloat(f.fi_pct);
    if (isNaN(cal) || cal <= 0) return null;
    const grams=Math.round((cal*pct/100)/9);
    return { value: grams + "g / day",
      label:"Daily fat intake at " + pct + "% of " + cal + " kcal",
      category:Math.round(grams*9) + " kcal from fat  |  " + grams + "g ÷ 3 meals = " + Math.round(grams/3) + "g per meal",
      interpretation:"At " + pct + "% of your calories from fat, you should consume " + grams + "g per day. Prioritise unsaturated fats (olive oil, avocados, nuts, fatty fish) over saturated fats, and avoid trans fats entirely. Fat provides 9 kcal per gram — the highest of any macronutrient — so portion sizes should be measured carefully." };
  },
  faq:[["Is fat bad for you?","No — and the research from the last 20 years has largely cleared it. Fat is essential for hormones, brain function, and absorbing fat-soluble vitamins. The type matters more than the total amount."],["What are healthy fats?","Unsaturated fats from avocados, nuts, olive oil, and fatty fish are the ones to prioritise. Saturated fat is fine in moderation. Trans fats (partially hydrogenated oils) are the ones to actually avoid."]],
  related:["macro-calculator","calorie-deficit","protein-intake"]
},

"carb-intake": {
  title: "Carbohydrate Intake Calculator",
  desc: "Calculate your daily carbohydrate needs based on your calorie target and diet style.",
  icon: "🍚", category: "Nutrition",
  fields: [
    { id:"ci_calories", label:"Daily Calorie Target (kcal)", type:"number", placeholder:"e.g. 2000" },
    { id:"ci_pct", label:"Carb percentage", type:"select", options:[["10","10% (keto)"],["20","20% (low carb)"],["40","40% (moderate)"],["50","50% (standard)"],["60","60% (high carb / endurance)"]] }
  ],
  stats: { title:"Carbs in Common Foods", header:["Food (100g)","Carbs"], rows:[["Oats (dry)","66g"],["Brown rice (cooked)","23g"],["Sweet potato","20g"],["Banana","23g"],["Lentils (cooked)","20g"],["Wholegrain bread","41g"]], note:"Carbs provide 4 kcal per gram." },
  calculate(f) {
    const cal=parseFloat(f.ci_calories), pct=parseFloat(f.ci_pct);
    if (isNaN(cal) || cal <= 0) return null;
    const grams=Math.round((cal*pct/100)/4);
    return { value: grams + "g / day",
      label:"Daily carbohydrate intake at " + pct + "% of " + cal + " kcal",
      category:Math.round(grams*4) + " kcal from carbs  |  ~" + Math.round(grams/3) + "g per meal",
      interpretation:"At " + pct + "% carbohydrates, you should consume " + grams + "g per day. Choose complex carbohydrates — oats, brown rice, sweet potatoes, whole grains, legumes — over refined sources. Carbohydrates provide 4 kcal per gram and are the body's preferred fuel for high-intensity exercise and brain function." };
  },
  faq:[["Do carbs cause weight gain?","Eating more calories than you burn causes weight gain — carbs are just one way to get there. They're actually the body's preferred fuel for exercise and the brain runs almost exclusively on glucose."],["What is a low carb diet?","Generally under 100g/day. Keto is more extreme — under 50g/day — to push the body into ketosis. Both can work for weight loss, they're just not magic."]],
  related:["macro-calculator","calorie-deficit","fat-intake"]
},

"fiber-intake": {
  title: "Daily Fibre Intake Calculator",
  desc: "Calculate your recommended daily fibre intake based on age and sex.",
  icon: "🌾", category: "Nutrition",
  fields: [
    { id:"fib_gender", label:"Sex", type:"select", options:[["male","Male"],["female","Female"]] },
    { id:"fib_age", label:"Age", type:"number", placeholder:"e.g. 30" }
  ],

  calculate(f) {
    const age=parseFloat(f.fib_age);
    if (isNaN(age) || age <= 0) return null;
    let target = f.fib_gender==="male" ? (age<=50?38:30) : (age<=50?25:21);
    const current_avg = f.fib_gender==="male" ? 18 : 15;
    return { value: target + "g / day",
      label:"Recommended daily fibre (Academy of Nutrition guidelines)",
      category:"Most adults get only " + current_avg + "g — you need " + (target-current_avg) + "g more",
      interpretation:"To reach " + target + "g of fibre daily, aim for: 1 serving of oats (4g) + 2 servings of vegetables (8g) + 1 apple (4g) + 1 serving of beans or lentils (8g) + wholegrain bread (3–4g per slice). Fibre feeds beneficial gut bacteria, stabilises blood sugar, lowers LDL cholesterol, and reduces colorectal cancer risk." };
  },
  faq:[["Why is fibre important?","Beyond digestion, fibre feeds the beneficial bacteria in your gut, slows glucose absorption (fewer blood sugar spikes), lowers LDL cholesterol, and is associated with lower colorectal cancer risk. Most people get roughly half what they need."],["What foods are high in fibre?","Legumes are the king — lentils and chickpeas pack 7–9g per 100g cooked. After that: oats, vegetables, fruit, and whole grains. Switching from white to wholegrain bread alone adds a few grams per day."]],
  related:["macro-calculator","calorie-deficit","water-calculator"]
},

"heart-rate-zones": {
  title: "Heart Rate Zone Calculator",
  desc: "Find your 5 heart rate training zones. Most people train too hard too often — knowing your zones fixes that.",
  icon: "❤", category: "Fitness",
  fields: [
    { id:"hrz_age", label:"Age", type:"number", placeholder:"e.g. 30" },
    { id:"hrz_rhr", label:"Resting Heart Rate (bpm)", type:"number", placeholder:"e.g. 60" }
  ],
  stats: { title:"Zone Training Benefits", header:["Zone","Primary Benefit"], rows:[["Z1 (50–60%)","Active recovery"],["Z2 (60–70%)","Fat burning & aerobic base"],["Z3 (70–80%)","Aerobic fitness"],["Z4 (80–90%)","Lactate threshold"],["Z5 (90–100%)","Peak speed & VO2 max"]], note:"MHR = 220 − age (estimated)." },
  calculate(f) {
    const age=parseFloat(f.hrz_age), rhr=parseFloat(f.hrz_rhr);
    if (isNaN(age) || isNaN(rhr) || age <= 0 || rhr <= 0) return null;
    const mhr=220-age, hrr=mhr-rhr;
    const z=(lo,hi)=>[Math.round(rhr+hrr*lo),Math.round(rhr+hrr*hi)];
    const zones=[z(0.5,0.6),z(0.6,0.7),z(0.7,0.8),z(0.8,0.9),z(0.9,1.0)];
    const zStr = zones.map((z,i)=>"Z"+(i+1)+": "+z[0]+"–"+z[1]).join("  |  ");
    return { value: "Max HR: " + mhr + " bpm",
      label: zStr,
      category:"Karvonen formula  |  Resting HR: " + rhr + " bpm",
      interpretation:"<strong>Zone 1 ("+zones[0][0]+"–"+zones[0][1]+" bpm):</strong> Recovery — very easy, fat burning. Use for active recovery days.<br><strong>Zone 2 ("+zones[1][0]+"–"+zones[1][1]+" bpm):</strong> Aerobic base — builds mitochondria and fat-burning efficiency. Most of your training should be here.<br><strong>Zone 3 ("+zones[2][0]+"–"+zones[2][1]+" bpm):</strong> Aerobic — moderate effort. Improves cardiovascular fitness.<br><strong>Zone 4 ("+zones[3][0]+"–"+zones[3][1]+" bpm):</strong> Threshold — hard effort, raises lactate threshold and speed.<br><strong>Zone 5 ("+zones[4][0]+"–"+zones[4][1]+" bpm):</strong> Maximum — all-out sprints. Develops peak power and VO2 max." };
  },
  faq:[["What is Zone 2 training?","Zone 2 is easy enough that you can hold a conversation. It builds mitochondria, improves fat burning, and develops aerobic base. Elite endurance athletes spend 70–80% of their training here — most amateurs do the opposite."],["How do I measure resting heart rate?","First thing in the morning before you get up. Lie still, count beats for 60 seconds. Do this a few days in a row and take the average."]],
  related:["tdee-calculator","calorie-deficit","vo2max"]
},

"vo2max": {
  title: "VO2 Max Estimator",
  desc: "Estimate your VO2 max from a simple run test. It's the closest thing fitness has to an overall score.",
  icon: "🫁", category: "Fitness",
  fields: [
    { id:"vo2_time", label:"1.5 mile run time (minutes)", type:"number", placeholder:"e.g. 12" },
    { id:"vo2_age", label:"Age", type:"number", placeholder:"e.g. 30" },
    { id:"vo2_gender", label:"Sex", type:"select", options:[["male","Male"],["female","Female"]] }
  ],

  calculate(f) {
    const t=parseFloat(f.vo2_time), age=parseFloat(f.vo2_age);
    if (isNaN(t) || isNaN(age) || t <= 0 || age <= 0) return null;
    const vo2=(3.5+(483/t)).toFixed(1);
    const male_cats=[[55,"Superior"],[45,"Excellent"],[38,"Good"],[30,"Fair"],[0,"Poor"]];
    const female_cats=[[50,"Superior"],[40,"Excellent"],[33,"Good"],[25,"Fair"],[0,"Poor"]];
    const cats = f.vo2_gender==="male" ? male_cats : female_cats;
    const cat = cats.find(c=>vo2>=c[0])[1];
    const avg = f.vo2_gender==="male" ? "40–45" : "35–40";
    return { value: vo2 + " ml/kg/min",
      label:"Estimated VO2 Max (" + cat + " for your age and sex)",
      category:"Average for adults aged " + age + ": " + avg + " ml/kg/min",
      interpretation:"VO2 max is the maximum rate at which your body can consume oxygen during intense exercise — the gold standard measure of cardiovascular fitness. A score of " + vo2 + " ml/kg/min is rated <strong>" + cat + "</strong>. VO2 max can be improved by 10–15% through consistent aerobic training, particularly Zone 2 endurance work and high-intensity interval training." };
  },
  faq:[["What is a good VO2 max?","For men, above 45 ml/kg/min is excellent. For women, above 40 ml/kg/min. Elite marathon runners are typically 70+. For context, the average untrained adult is around 35–40."],["Can VO2 max be improved?","Yes, significantly — up to 10–15% with consistent training. Zone 2 endurance work builds the aerobic base; high-intensity intervals push the ceiling higher."]],
  related:["heart-rate-zones","tdee-calculator","calorie-deficit"]
},

"one-rep-max": {
  title: "One Rep Max (1RM) Calculator",
  desc: "Estimate your one rep max without the injury risk of actually attempting it. Uses both Epley and Brzycki formulas and averages them.",
  icon: "🏋", category: "Fitness",
  fields: [
    { id:"orm_weight", label:"Weight lifted", type:"number", placeholder:"e.g. 100",
      unit:{ id:"orm_wu", options:[["kg","kg"],["lb","lb"]] } },
    { id:"orm_reps", label:"Reps performed", type:"number", placeholder:"e.g. 8" }
  ],
  stats: { title:"Training % of 1RM", header:["Goal","% of 1RM","Reps"], rows:[["Max strength","90–100%","1–3"],["Strength","80–90%","3–6"],["Hypertrophy","65–80%","6–12"],["Endurance","50–65%","12–20+"]], note:"Recalculate every 4–6 weeks as strength improves." },
  calculate(f) {
    let w=parseFloat(f.orm_weight);
    const r=parseFloat(f.orm_reps);
    if (!w||!r) return null;
    if (r >= 37) return { value:"—", label:"Please enter fewer than 37 reps for an accurate estimate.", category:"", interpretation:"" };
    if (f.orm_wu==="lb") w=w*0.4536;
    const epley=w*(1+r/30);
    const brzycki=w*(36/(37-r));
    const avg=((epley+brzycki)/2);
    const p = (pct)=>(avg*pct/100).toFixed(1);
    return { value: avg.toFixed(1) + " kg  /  " + (avg*2.205).toFixed(1) + " lb",
      label:"Estimated 1RM (average of Epley & Brzycki formulas)",
      category:"90%: " + p(90) + "kg  |  80%: " + p(80) + "kg  |  70%: " + p(70) + "kg  |  60%: " + p(60) + "kg",
      interpretation:"Your estimated 1RM is " + avg.toFixed(1) + " kg. Training zones based on this: <strong>Strength (85–95%):</strong> " + p(85) + "–" + p(95) + "kg for 1–5 reps. <strong>Hypertrophy (65–85%):</strong> " + p(65) + "–" + p(85) + "kg for 6–12 reps. <strong>Endurance (50–65%):</strong> " + p(50) + "–" + p(65) + "kg for 15+ reps. Recalculate every 4–6 weeks as you get stronger." };
  },
  faq:[["Why not just attempt a 1RM?","Attempting a true 1RM without a spotter, proper warm-up, and experience is how people get hurt. Estimating from a submaximal set (3–5 reps) is accurate enough for programming and much safer."],["What percentage should I train at?","Hypertrophy (muscle size): 65–85%. Strength: 85–95%. Power: 50–70% but moving fast. Most beginners should stay in the hypertrophy range and build a base first."]],
  related:["tdee-calculator","protein-intake","calorie-surplus"]
},

"push-up-test": {
  title: "Push-Up Fitness Test Calculator",
  desc: "See how your push-up count stacks up against age and sex norms. Humbling for some, reassuring for others.",
  icon: "💪", category: "Fitness",
  fields: [
    { id:"put_gender", label:"Sex", type:"select", options:[["male","Male"],["female","Female"]] },
    { id:"put_age", label:"Age", type:"number", placeholder:"e.g. 30" },
    { id:"put_reps", label:"Push-ups completed", type:"number", placeholder:"e.g. 25" }
  ],

  calculate(f) {
    const age=parseFloat(f.put_age), reps=parseFloat(f.put_reps);
    if (isNaN(age) || isNaN(reps) || age <= 0 || reps <= 0) return null;
    const std={ male:[[17,21],[21,27],[15,21],[13,17],[11,15]], female:[[12,16],[13,18],[11,14],[9,12],[7,10]] };
    const idx=age<30?0:age<40?1:age<50?2:age<60?3:4;
    const [avg,good]=std[f.put_gender][idx];
    const cat=reps>=good?"Excellent":reps>=avg?"Good":reps>=avg*0.7?"Average":"Below average";
    const next = cat==="Excellent" ? "Maintain with 3–4 sessions/week" : "Target: " + good + " reps for 'Excellent'";
    return { value: reps + " reps — " + cat,
      label:"Push-up fitness rating for your age and sex",
      category:next,
      interpretation:"For your age group (" + (age<30?"under 30":age<40?"30s":age<50?"40s":age<60?"50s":"60+") + "), the average is " + avg + " reps and 'Good' begins at " + good + " reps. Push-ups test upper body endurance and relative strength. To improve, train 3–4 times per week using progressive overload — add 1–2 reps per session until you reach your target." };
  },
  faq:[["How often should I do push-ups?","3–4 times per week with rest days. Muscles grow during recovery, not during the workout itself — daily push-ups without rest days stall progress."],["Do push-ups actually build muscle?","Yes, especially chest, shoulders, and triceps. Once standard push-ups get easy, try archer push-ups, decline, or add a weighted vest to keep progressing."]],
  related:["one-rep-max","tdee-calculator","protein-intake"]
},

"running-pace": {
  title: "Running Pace Calculator",
  desc: "Calculate your running pace per km or mile from any distance and time. Also shows projected finish times for 5K, 10K, half, and full marathon.",
  icon: "🏃", category: "Fitness",
  fields: [
    { id:"rp_dist", label:"Distance", type:"number", placeholder:"e.g. 10",
      unit:{ id:"rp_du", options:[["km","km"],["mi","miles"]] } },
    { id:"rp_hours", label:"Hours", type:"number", placeholder:"0" },
    { id:"rp_mins", label:"Minutes", type:"number", placeholder:"e.g. 55" },
    { id:"rp_secs", label:"Seconds", type:"number", placeholder:"0" }
  ],
  stats: { title:"Common Race Finish Times", header:["Race","Good Amateur Pace"], rows:[["5K","5:00–6:30 /km"],["10K","5:15–6:45 /km"],["Half Marathon","5:30–7:00 /km"],["Marathon","5:45–7:30 /km"]], note:"Improve ~3–5% per year with consistent training." },
  calculate(f) {
    let d=parseFloat(f.rp_dist);
    const h=parseFloat(f.rp_hours)||0, m=parseFloat(f.rp_mins)||0, s=parseFloat(f.rp_secs)||0;
    if (!d) return null;
    if (f.rp_du==="mi") d=d*1.60934;
    const totalSecs=h*3600+m*60+s;
    const paceSecPerKm=totalSecs/d;
    const pm=Math.floor(paceSecPerKm/60), ps=Math.round(paceSecPerKm%60).toString().padStart(2,"0");
    const kmh=(d/(totalSecs/3600)).toFixed(2);
    const mph=(kmh*0.621371).toFixed(2);
    const fiveK=((5*paceSecPerKm)/60).toFixed(1), tenK=((10*paceSecPerKm)/60).toFixed(1), hm=((21.1*paceSecPerKm)/60).toFixed(1), fm=((42.2*paceSecPerKm)/60).toFixed(1);
    return { value: pm + ":" + ps + " /km  |  " + Math.floor(paceSecPerKm*1.60934/60) + ":" + Math.round((paceSecPerKm*1.60934)%60).toString().padStart(2,"0") + " /mile",
      label:"Running pace at " + kmh + " km/h (" + mph + " mph)",
      category:"5K: " + fiveK + " min  |  10K: " + tenK + " min  |  Half: " + hm + " min  |  Full: " + fm + " min",
      interpretation:"At your current pace of " + pm + ":" + ps + " /km you would complete a 5K in " + fiveK + " minutes and a 10K in " + tenK + " minutes. A good recreational 5K is under 30 minutes (6:00/km). To improve pace, incorporate weekly interval training (short fast efforts at Zone 4–5) alongside your steady-state runs." };
  },
  faq:[["What is a good 5K pace?","Under 30 minutes (6:00/km) is a solid goal for recreational runners. Under 25 minutes means you're getting serious. Under 20 minutes puts you in competitive amateur territory."],["How do I improve my running pace?","Interval training once or twice a week plus consistent easy mileage is the most effective combination. Most runners improve fastest when they slow down their easy runs and actually push their hard ones."]],
  related:["heart-rate-zones","vo2max","calorie-burn-exercise"]
},

"steps-to-calories": {
  title: "Steps to Calories Calculator",
  desc: "Convert your step count to estimated calories burned. Also puts the '10,000 steps' myth in perspective.",
  icon: "👟", category: "Fitness",
  fields: [
    { id:"stc_steps", label:"Daily Steps", type:"number", placeholder:"e.g. 8000" },
    { id:"stc_weight", label:"Weight", type:"number", placeholder:"e.g. 70",
      unit:{ id:"stc_wu", options:[["kg","kg"],["lb","lb"]] } }
  ],

  calculate(f) {
    let w=parseFloat(f.stc_weight);
    const steps=parseFloat(f.stc_steps);
    if (isNaN(steps) || isNaN(w) || steps <= 0 || w <= 0) return null;
    if (f.stc_wu==="lb") w=w*0.4536;
    const total=Math.round(steps*0.0004*w);
    const km=(steps/1350).toFixed(1);
    const weekly=total*7, monthly=total*30;
    return { value: total + " kcal",
      label:"Estimated calories burned — approximately " + km + " km walked",
      category:"Weekly: ~" + weekly.toLocaleString() + " kcal  |  Monthly: ~" + monthly.toLocaleString() + " kcal",
      interpretation:"Walking " + steps.toLocaleString() + " steps burns approximately " + total + " kcal for a " + w.toFixed(0) + " kg person. The widely cited 10,000 steps/day target was originally a marketing figure, but research supports 7,000–10,000 daily steps for meaningful cardiovascular health benefits. Each 2,000 additional daily steps reduces cardiovascular mortality risk by approximately 8% in adults." };
  },
  faq:[["How accurate is this?","It's an estimate — actual burn varies with your stride length, pace, terrain, and individual metabolism. Think of it as a ballpark, not a precise readout."],["Where did 10,000 steps come from?","A Japanese pedometer marketing campaign from 1965. That said, research does support that 7,000–10,000 daily steps correlates with meaningful cardiovascular health benefits — the number just wasn't based on science originally."]],
  related:["tdee-calculator","calorie-deficit","water-calculator"]
},

"sleep-calculator": {
  title: "Sleep Calculator",
  desc: "Find the best times to wake up based on 90-minute sleep cycles. Waking mid-cycle is why you feel groggy even after 8 hours.",
  icon: "😴", category: "Wellness",
  fields: [
    { id:"sl_hour", label:"Bedtime — Hour (0–23)", type:"number", placeholder:"e.g. 22" },
    { id:"sl_min", label:"Bedtime — Minute", type:"number", placeholder:"e.g. 30" }
  ],
  stats: { title:"Sleep Needs by Age (NSF)", header:["Age Group","Recommended"], rows:[["Teenagers (14–17)","8–10 hours"],["Young adults (18–25)","7–9 hours"],["Adults (26–64)","7–9 hours"],["Older adults (65+)","7–8 hours"]], note:"Each 90-min cycle = light + deep + REM sleep." },
  calculate(f) {
    const h=parseFloat(f.sl_hour), m=parseFloat(f.sl_min)||0;
    if (isNaN(h)) return null;
    const fallAsleep=14;
    const cycles=[4,5,6];
    const times=cycles.map(c=>{
      const total=h*60+m+fallAsleep+c*90;
      const wh=Math.floor(total/60)%24, wm=total%60;
      return (c*1.5)+"h ("+c+" cycles): "+wh.toString().padStart(2,"0")+":"+wm.toString().padStart(2,"0");
    });
    return { value: "Wake up at one of these times:",
      label: times.join("  |  "),
      category:"Includes ~14 minutes to fall asleep  |  Best: 6 cycles (9h) or 5 cycles (7.5h)",
      interpretation:"Each sleep cycle lasts approximately 90 minutes and includes light sleep, deep sleep, and REM sleep. Waking between cycles — rather than in the middle of one — means you emerge from lighter sleep and feel more refreshed. <strong>6 cycles (9h)</strong> is ideal for recovery and muscle growth. <strong>5 cycles (7.5h)</strong> is optimal for most adults. Avoid 4 cycles (6h) regularly — it significantly reduces REM sleep." };
  },
  faq:[["What is a sleep cycle?","About 90 minutes of light sleep → deep sleep → REM sleep. REM is where memory consolidation and emotional processing happen. Cutting sleep short consistently means less REM."],["How many cycles do I need?","Most adults need 5–6 complete cycles (7.5–9 hours). 4 cycles (6 hours) is survivable short-term but chronic short sleep accumulates a real cognitive and health debt."]],
  related:["tdee-calculator","water-calculator","heart-rate-zones"]
},

"bmi-prime": {
  title: "BMI Prime Calculator",
  desc: "BMI Prime tells you how far above or below the healthy weight ceiling you are. A score of 1.0 means you're exactly at the upper limit of healthy.",
  icon: "📊", category: "Body",
  fields: [
    { id:"bp_weight", label:"Weight", type:"number", placeholder:"e.g. 70",
      unit:{ id:"bp_wu", options:[["kg","kg"],["lb","lb"]] } },
    { id:"bp_height", label:"Height", type:"number", placeholder:"e.g. 175",
      unit:{ id:"bp_hu", options:[["cm","cm"],["ft","ft"]] } }
  ],

  calculate(f) {
    let w=parseFloat(f.bp_weight), h=parseFloat(f.bp_height);
    if (isNaN(w) || isNaN(h) || w <= 0 || h <= 0) return null;
    if (f.bp_wu==="lb") w=w*0.4536;
    if (f.bp_hu==="ft") h=h*30.48;
    const bmi=w/Math.pow(h/100,2);
    const prime=(bmi/25).toFixed(2);
    const cat=prime<0.74?"Underweight":prime<=1.0?"Healthy weight":prime<=1.2?"Overweight":"Obese";
    return { value: prime + " BMI Prime",
      label:"Ratio to upper healthy weight limit of BMI 25 (BMI: " + bmi.toFixed(1) + ")",
      category:cat,
      interpretation:"A BMI Prime of 1.0 means your BMI is exactly 25 — the upper boundary of healthy weight. Your score of " + prime + " means your BMI is " + ((prime-1)*100).toFixed(0) + "% " + (prime>1?"above":"below") + " this threshold. BMI Prime makes it easier to compare weight status across different populations that use different BMI cutoffs." };
  },
  faq:[["What does BMI Prime of 1.0 mean?","Your BMI is exactly 25 — the top of the healthy range. Below 1.0 means you're within healthy weight. Above means you're over it by that proportion."],["Is BMI Prime better than BMI?","It's the same calculation expressed differently. The advantage is it makes the math intuitive — 1.2 means 20% over the healthy ceiling, regardless of which population you're comparing."]],
  related:["bmi-calculator","body-fat-calculator","ideal-weight"]
},

"waist-to-height": {
  title: "Waist-to-Height Ratio Calculator",
  desc: "Calculate your waist-to-height ratio. The rule is simple: keep your waist under half your height. Research suggests it predicts heart disease risk better than BMI.",
  icon: "📏", category: "Body",
  fields: [
    { id:"wth_waist", label:"Waist circumference", type:"number", placeholder:"e.g. 80",
      unit:{ id:"wth_wu", options:[["cm","cm"],["in","inches"]] } },
    { id:"wth_height", label:"Height", type:"number", placeholder:"e.g. 175",
      unit:{ id:"wth_hu", options:[["cm","cm"],["ft","ft"]] } }
  ],
  stats: { title:"Waist-to-Height Reference", header:["Ratio","Category"], rows:[["< 0.4","Underweight"],["0.4 – 0.5","Healthy"],["0.5 – 0.6","Overweight"],["≥ 0.6","Obese"]], note:"Keep your waist less than half your height." },
  calculate(f) {
    let w=parseFloat(f.wth_waist), h=parseFloat(f.wth_height);
    if (isNaN(w) || isNaN(h) || w <= 0 || h <= 0) return null;
    if (f.wth_wu==="in") w=w*2.54;
    if (f.wth_hu==="ft") h=h*30.48;
    const ratio=(w/h).toFixed(2);
    const cat=ratio<0.4?"Underweight":ratio<=0.5?"Healthy":ratio<=0.6?"Overweight":"Obese";
    const diff=(0.5*h-w).toFixed(1);
    return { value: ratio + " WHtR",
      label:"Waist-to-height ratio — keep it under 0.5",
      category:cat + (diff>0?" — " + diff + "cm waist reduction to reach healthy range":" — within healthy range"),
      interpretation:"The simple rule: keep your waist circumference less than half your height. Your ratio of " + ratio + " is " + cat.toLowerCase() + ". Waist-to-height ratio is a stronger predictor of cardiovascular risk than BMI because it specifically captures abdominal fat — which is more metabolically dangerous than fat in other areas." };
  },
  faq:[["Why is waist-to-height ratio useful?","Because it specifically flags abdominal fat, which is more metabolically dangerous than fat elsewhere. BMI can't tell where fat is stored — this can."],["What is the healthy range?","Under 0.5. The simple version: your waist should be less than half your height. That's it."]],
  related:["bmi-calculator","body-fat-calculator","waist-to-hip"]
},

"waist-to-hip": {
  title: "Waist-to-Hip Ratio Calculator",
  desc: "Calculate your waist-to-hip ratio and see where you fall on cardiovascular risk. Apple shape vs pear shape actually matters metabolically.",
  icon: "📐", category: "Body",
  fields: [
    { id:"wh_gender", label:"Sex", type:"select", options:[["male","Male"],["female","Female"]] },
    { id:"wh_waist", label:"Waist circumference", type:"number", placeholder:"e.g. 80",
      unit:{ id:"wh_wu", options:[["cm","cm"],["in","inches"]] } },
    { id:"wh_hip", label:"Hip circumference", type:"number", placeholder:"e.g. 100",
      unit:{ id:"wh_hu", options:[["cm","cm"],["in","inches"]] } }
  ],

  calculate(f) {
    let w=parseFloat(f.wh_waist), h=parseFloat(f.wh_hip);
    if (isNaN(w) || isNaN(h) || w <= 0 || h <= 0) return null;
    if (f.wh_wu==="in") w=w*2.54;
    if (f.wh_hu==="in") h=h*2.54;
    const ratio=(w/h).toFixed(2);
    const male_thresholds=[[0.9,"Low risk"],[0.99,"Moderate risk"],[99,"High risk"]];
    const female_thresholds=[[0.8,"Low risk"],[0.85,"Moderate risk"],[99,"High risk"]];
    const thresholds = f.wh_gender==="male" ? male_thresholds : female_thresholds;
    const cat = thresholds.find(t=>ratio<=t[0])[1];
    return { value: ratio + " WHR",
      label:"Waist-to-hip ratio (" + cat + ")",
      category:"WHO threshold for " + f.wh_gender + "s: " + (f.wh_gender==="male"?"0.90":"0.85") + " for low risk",
      interpretation:"Your waist-to-hip ratio of " + ratio + " indicates <strong>" + cat + "</strong>. The WHO recommends below 0.90 for men and 0.85 for women for low cardiovascular risk. A higher ratio indicates more abdominal fat relative to hip fat — the 'apple shape' which carries significantly higher metabolic risk than the 'pear shape' associated with hip and thigh fat distribution." };
  },
  faq:[["What does a high WHR mean?","More fat concentrated around the abdomen relative to the hips. Abdominal fat is metabolically active in ways that increase risk of heart disease, type 2 diabetes, and stroke."],["What is the ideal WHR?","WHO recommends below 0.90 for men and 0.85 for women for low cardiovascular risk. Below those numbers you're in the clear."]],
  related:["waist-to-height","body-fat-calculator","bmi-calculator"]
},

"army-body-fat": {
  title: "Army Body Fat Calculator",
  desc: "Calculate body fat using the US Army circumference method — just a tape measure, no calipers or underwater weighing required.",
  icon: "🪖", category: "Body",
  stats: { title:"US Army BF% Standards", header:["Age","Max (M)","Max (F)"], rows:[["17–20","20%","28%"],["21–27","22%","30%"],["28–39","24%","32%"],["40+","26%","34%"]], note:"Exceeding limits requires enrolment in Army Weight Control Program." },
  fields: [
    { id:"abf_gender", label:"Sex", type:"select", options:[["male","Male"],["female","Female"]] },
    { id:"abf_height", label:"Height", type:"number", placeholder:"e.g. 178",
      unit:{ id:"abf_hu", options:[["cm","cm"],["in","inches"]] } },
    { id:"abf_neck", label:"Neck circumference", type:"number", placeholder:"e.g. 38",
      unit:{ id:"abf_nu", options:[["cm","cm"],["in","inches"]] } },
    { id:"abf_waist", label:"Waist circumference", type:"number", placeholder:"e.g. 85",
      unit:{ id:"abf_wu", options:[["cm","cm"],["in","inches"]] } },
    { id:"abf_hip", label:"Hip circumference (women only)", type:"number", placeholder:"e.g. 100",
      unit:{ id:"abf_hpu", options:[["cm","cm"],["in","inches"]] } }
  ],
  calculate(f) {
    let h=parseFloat(f.abf_height), neck=parseFloat(f.abf_neck), waist=parseFloat(f.abf_waist), hip=parseFloat(f.abf_hip)||0;
    if (isNaN(h) || isNaN(neck) || isNaN(waist) || h <= 0 || neck <= 0 || waist <= 0) return null;
    if (f.abf_hu==="in") h=h*2.54;
    if (f.abf_nu==="in") neck=neck*2.54;
    if (f.abf_wu==="in") waist=waist*2.54;
    if (f.abf_hpu==="in") hip=hip*2.54;
    let bf;
    if (f.abf_gender==="male") bf=86.01*Math.log10(waist-neck)-70.041*Math.log10(h)+36.76;
    else bf=163.205*Math.log10(waist+hip-neck)-97.684*Math.log10(h)-78.387;
    bf=Math.max(bf,2).toFixed(1);
    const cat=bf<14?"Lean/Athletic":bf<20?"Fitness":bf<25?"Acceptable":bf<30?"Overweight":"Obese";
    const army_std = f.abf_gender==="male" ? "below 20–26% depending on age" : "below 28–36% depending on age";
    return { value: bf + "% body fat",
      label:"US Army circumference method estimate",
      category:cat + "  |  US Army standard: " + army_std,
      interpretation:"Your estimated body fat of " + bf + "% falls in the <strong>" + cat + "</strong> category. The US Army method is accurate to within 3–4% when measurements are taken carefully. For more precision, consider a DEXA scan. To reduce body fat, a calorie deficit combined with resistance training (to preserve muscle) is most effective." };
  },
  faq:[["How accurate is the Army method?","Within 3–4% when measurements are taken carefully and consistently. Take measurements in the morning before eating, and measure in the same spot each time."],["What are the Army body fat standards?","It varies by age. Men: 20% (17–20 yrs) up to 26% (40+). Women: 28–34% across the same age range. Exceeding limits triggers the Army Weight Control Program."]],
  related:["body-fat-calculator","bmi-calculator","waist-to-hip"]
},

"calorie-burn-exercise": {
  title: "Exercise Calorie Burn Calculator",
  desc: "Estimate how many calories you burn during exercise. Fair warning: fitness trackers usually overestimate this by 20–30%.",
  icon: "🔥", category: "Fitness",
  fields: [
    { id:"cbe_weight", label:"Weight", type:"number", placeholder:"e.g. 70",
      unit:{ id:"cbe_wu", options:[["kg","kg"],["lb","lb"]] } },
    { id:"cbe_exercise", label:"Exercise type", type:"select", options:[
      ["8","Running (8 km/h — jogging)"],["11","Running (11 km/h — fast)"],["4","Walking (brisk)"],
      ["7","Cycling (moderate)"],["10","Cycling (vigorous)"],["6","Swimming"],
      ["5","Weight training"],["9","HIIT"],["3","Yoga / stretching"],["6","Jump rope"]
    ]},
    { id:"cbe_mins", label:"Duration (minutes)", type:"number", placeholder:"e.g. 45" }
  ],
  calculate(f) {
    let w=parseFloat(f.cbe_weight);
    const met=parseFloat(f.cbe_exercise), mins=parseFloat(f.cbe_mins);
    if (isNaN(w) || isNaN(mins) || w <= 0 || mins <= 0) return null;
    if (f.cbe_wu==="lb") w=w*0.4536;
    const kcal=Math.round((met*3.5*w/200)*mins);
    const weekly=kcal*3, perKg=(kcal/w).toFixed(1);
    return { value: kcal + " kcal",
      label:"Estimated calories burned in " + mins + " minutes",
      category:"Per kg: " + perKg + " kcal/kg  |  3x/week: " + weekly + " kcal/week",
      interpretation:"This " + mins + "-minute session burns approximately " + kcal + " kcal — equivalent to " + Math.round(kcal/100*28) + "g of body fat if sustained consistently. Doing this 3 times per week creates an extra " + weekly + " kcal burn. Note: calorie burn is often overestimated by fitness trackers. Combine exercise with diet management for best results." };
  },
  faq:[["What is MET?","Metabolic Equivalent of Task — a measure of how hard an activity is relative to sitting still. Running has a MET of ~8–11. Walking is ~3–4. It's the basis for most calorie burn estimates."],["Does muscle mass affect calorie burn?","Yes, noticeably. More muscle means a higher resting metabolism AND more calories burned during exercise for the same effort. It's one of the better long-term reasons to lift weights."]],
  related:["tdee-calculator","steps-to-calories","calorie-deficit"]
},

"pregnancy-weight": {
  title: "Pregnancy Weight Gain Calculator",
  desc: "How much weight should you gain during pregnancy? It depends on your starting BMI. This uses Institute of Medicine guidelines.",
  icon: "🤱", category: "Wellness",
  fields: [
    { id:"pg_weight", label:"Pre-pregnancy weight", type:"number", placeholder:"e.g. 65",
      unit:{ id:"pg_wu", options:[["kg","kg"],["lb","lb"]] } },
    { id:"pg_height", label:"Height", type:"number", placeholder:"e.g. 165",
      unit:{ id:"pg_hu", options:[["cm","cm"],["ft","ft"]] } },
    { id:"pg_twins", label:"Pregnancy type", type:"select", options:[["single","Single baby"],["twins","Twins"]] }
  ],
  stats: { title:"Weight Gain by Pre-Preg BMI", header:["BMI Category","Recommended Gain"], rows:[["Underweight (<18.5)","12.5–18 kg"],["Healthy (18.5–24.9)","11.5–16 kg"],["Overweight (25–29.9)","7–11.5 kg"],["Obese (≥30)","5–9 kg"]], note:"Source: Institute of Medicine (IOM)." },
  calculate(f) {
    let w=parseFloat(f.pg_weight), h=parseFloat(f.pg_height);
    if (isNaN(w) || isNaN(h) || w <= 0 || h <= 0) return null;
    if (f.pg_wu==="lb") w=w*0.4536;
    if (f.pg_hu==="ft") h=h*30.48;
    const bmi=w/Math.pow(h/100,2);
    const twins=f.pg_twins==="twins";
    let range;
    if (twins) range=bmi<18.5?"22–28 kg":bmi<25?"17–25 kg":bmi<30?"14–23 kg":"11–19 kg";
    else range=bmi<18.5?"12.5–18 kg":bmi<25?"11.5–16 kg":bmi<30?"7–11.5 kg":"5–9 kg";
    const cat=bmi<18.5?"Underweight":bmi<25?"Healthy weight":bmi<30?"Overweight":"Obese";
    return { value: range,
      label:"Recommended total pregnancy weight gain (Institute of Medicine guidelines)",
      category:"Pre-pregnancy BMI: " + bmi.toFixed(1) + " (" + cat + ")",
      interpretation:"Based on your pre-pregnancy BMI of " + bmi.toFixed(1) + " (" + cat + "), the recommended total weight gain is " + range + ". This is based on Institute of Medicine guidelines. Weight gain should be gradual — approximately 1–2 kg in the first trimester and 0.3–0.5 kg per week thereafter. Always follow your midwife or doctor's personalised advice." };
  },
  faq:[["Why does pre-pregnancy weight matter?","Your starting BMI affects how much weight gain is healthy. Gaining too little or too much both carry risks — for different reasons. These guidelines exist to reduce those risks, not for aesthetic reasons."],["Is it safe to diet during pregnancy?","No. This isn't the time for calorie restriction. Focus on nutrient-dense food, adequate protein, and following your midwife's guidance."]],
  related:["bmi-calculator","water-calculator","calorie-deficit"]
},

"due-date": {
  title: "Pregnancy Due Date Calculator",
  desc: "Calculate your estimated due date from your last period. Worth knowing: only about 5% of babies actually arrive on their due date.",
  icon: "🗓", category: "Wellness",
  fields: [
    { id:"dd_lmp", label:"First day of last menstrual period", type:"date" },
    { id:"dd_cycle", label:"Average cycle length (days)", type:"number", placeholder:"e.g. 28" }
  ],

  calculate(f) {
    const lmp=new Date(f.dd_lmp), cycle=parseFloat(f.dd_cycle)||28;
    if (isNaN(lmp.getTime())) return null;
    const due=new Date(lmp);
    due.setDate(due.getDate()+280+(cycle-28));
    const daysLeft=Math.round((due-new Date())/86400000);
    const weeks=Math.floor((280+(cycle-28)-daysLeft)/7);
    return { value: due.toLocaleDateString("en-GB",{year:"numeric",month:"long",day:"numeric"}),
      label:"Estimated due date (Naegele's rule, adjusted for cycle length)",
      category:daysLeft>0?(daysLeft+" days to go — currently approx. week "+weeks+" of pregnancy"):"Due date passed",
      interpretation:"Your estimated due date is " + due.toLocaleDateString("en-GB",{month:"long",day:"numeric",year:"numeric"}) + ". Only about 5% of babies are born on their exact due date — most arrive within 2 weeks either side. This calculation uses Naegele's rule (280 days from LMP) adjusted for your " + cycle + "-day cycle. Your healthcare provider may adjust this based on early ultrasound measurements." };
  },
  faq:[["How accurate is the due date?","Only 5% of babies arrive on the exact date. Most come within 2 weeks either side. Think of it as a target window, not a deadline."],["What is Naegele's rule?","The standard method: add 280 days to the first day of your last period, then adjust for cycle length if it's not 28 days. Your healthcare provider may adjust further based on early ultrasound."]],
  related:["pregnancy-weight","water-calculator","bmi-calculator"]
},

"body-surface-area": {
  title: "Body Surface Area Calculator",
  desc: "Calculate your body surface area using the Mosteller formula. Mostly used in medical contexts — chemotherapy dosing, burn assessment, cardiac output.",
  icon: "🧬", category: "Body",
  fields: [
    { id:"bsa_weight", label:"Weight", type:"number", placeholder:"e.g. 70",
      unit:{ id:"bsa_wu", options:[["kg","kg"],["lb","lb"]] } },
    { id:"bsa_height", label:"Height", type:"number", placeholder:"e.g. 175",
      unit:{ id:"bsa_hu", options:[["cm","cm"],["ft","ft"]] } }
  ],
  stats: { title:"Average BSA Reference", header:["Group","Average BSA"], rows:[["Adult male","1.9 m²"],["Adult female","1.6 m²"],["Child (10 yrs)","1.14 m²"],["Child (5 yrs)","0.76 m²"],["Neonate","0.25 m²"]], note:"Mosteller formula: √(height × weight ÷ 3600)." },
  calculate(f) {
    let w=parseFloat(f.bsa_weight), h=parseFloat(f.bsa_height);
    if (isNaN(w) || isNaN(h) || w <= 0 || h <= 0) return null;
    if (f.bsa_wu==="lb") w=w*0.4536;
    if (f.bsa_hu==="ft") h=h*30.48;
    const bsa=Math.sqrt((h*w)/3600).toFixed(2);
    const avg_m=1.9, avg_f=1.6;
    return { value: bsa + " m²",
      label:"Body surface area (Mosteller formula)",
      category:"Average adult male: 1.9 m²  |  Average adult female: 1.6 m²",
      interpretation:"Your body surface area of " + bsa + " m² is calculated using the Mosteller formula. BSA is used in medicine to calculate chemotherapy drug doses, burn injury severity assessments, and cardiac output measurements, because it correlates better with metabolism than body weight alone. It is also used to calculate body surface area percentage affected in skin conditions." };
  },
  faq:[["Why is BSA used in medicine instead of weight?","Because body weight alone is a poor predictor of how drugs distribute through the body. BSA correlates better with metabolism and organ function, which is why it's preferred for chemotherapy dosing."],["What is average BSA?","Around 1.9 m² for adult men and 1.6 m² for adult women. Newborns are about 0.25 m²."]],
  related:["bmi-calculator","ideal-weight","lean-body-mass"]
},

"nicotine-calculator": {
  title: "Nicotine Intake Calculator",
  desc: "Estimate how much nicotine you actually absorb daily from cigarettes or tobacco. The number is lower than most people expect.",
  icon: "🚭", category: "Wellness",
  fields: [
    { id:"nic_type", label:"Product type", type:"select", options:[["12","Cigarette (standard)"],["20","Cigarette (strong)"],["4","Light cigarette"],["8","Cigar"],["0.5","Nicotine patch (mg/h)"]] },
    { id:"nic_count", label:"Number per day", type:"number", placeholder:"e.g. 10" }
  ],

  calculate(f) {
    const mg=parseFloat(f.nic_type), count=parseFloat(f.nic_count);
    if (!count) return null;
    const absorbed=(mg*0.1*count).toFixed(1);
    const total=(mg*count).toFixed(1);
    const weekly=(absorbed*7).toFixed(0);
    return { value: absorbed + " mg nicotine absorbed/day",
      label:"Total nicotine in products: " + total + "mg  |  Absorbed: ~10%",
      category:"Weekly absorbed: ~" + weekly + " mg",
      interpretation:"Only about 10% of the nicotine in a cigarette is actually absorbed into the bloodstream. Your " + count + " cigarettes/day provide " + total + "mg of nicotine, of which approximately " + absorbed + "mg is absorbed. Nicotine dependence typically develops at intakes above 5–10mg/day absorbed. If you are considering quitting, nicotine replacement therapy (NRT) can help manage withdrawal symptoms." };
  },
  faq:[["How much nicotine is actually absorbed from a cigarette?","Only about 1–2 mg of the ~12 mg in a cigarette enters the bloodstream. The rest burns off or is exhaled. The absorbed amount is still enough to create dependence quickly."],["At what level does dependence develop?","Typically above 5–10 mg absorbed per day. Even occasional smoking can establish dependence patterns faster than most people expect."]],
  related:["tdee-calculator","water-calculator","bmi-calculator"]
},

"calorie-intake-children": {
  title: "Child Calorie Calculator",
  desc: "Rough estimate of daily calorie needs for children aged 2–17. Treat it as a ballpark — children's needs vary a lot and they're usually good at self-regulating hunger.",
  icon: "👦", category: "Nutrition",
  fields: [
    { id:"cc_gender", label:"Sex", type:"select", options:[["male","Boy"],["female","Girl"]] },
    { id:"cc_age", label:"Age (years)", type:"number", placeholder:"e.g. 10" },
    { id:"cc_activity", label:"Activity level", type:"select", options:[["1.0","Sedentary"],["1.3","Moderately active"],["1.6","Active"]] }
  ],
  stats: { title:"Child Calorie Needs (Moderate Activity)", header:["Age","Boys","Girls"], rows:[["2–3","1,000–1,400","1,000–1,200"],["4–8","1,200–1,600","1,200–1,400"],["9–13","1,600–2,000","1,400–1,800"],["14–18","2,000–2,600","1,800–2,000"]], note:"Source: USDA Dietary Guidelines." },
  calculate(f) {
    const age=parseFloat(f.cc_age), act=parseFloat(f.cc_activity);
    if (isNaN(age) || age <= 0) return null;
    let bmr;
    if (f.cc_gender==="male") bmr=88.362+13.397*30+4.799*140-5.677*age;
    else bmr=447.593+9.247*28+3.098*135-4.330*age;
    const cal=Math.round(bmr*act);
    return { value: cal + " kcal/day",
      label:"Estimated daily calorie needs for a " + age + "-year-old " + (f.cc_gender==="male"?"boy":"girl"),
      category:"Based on average height/weight for age group",
      interpretation:"This is an estimate based on average growth charts. Individual children vary significantly based on height, weight, growth stage and activity level. Children should not count calories strictly — focus on balanced meals, regular active play, and listening to natural hunger and fullness cues. Consult a paediatrician if you have concerns about your child's growth or weight." };
  },
  faq:[["Should children count calories?","Generally no — it can do more harm than good. Healthy eating habits, regular activity, and listening to hunger cues matter far more than hitting a number. If there are genuine concerns about weight or growth, a paediatrician is the right person to talk to."],["What affects a child's calorie needs?","Age, sex, height, weight, growth stage, and activity level — all of which change constantly. That's why these are estimates, not prescriptions."]],
  related:["water-calculator","fiber-intake","protein-intake"]
},

"alcohol-units": {
  title: "Alcohol Units Calculator",
  desc: "Calculate alcohol units and calories in any drink. Useful for tracking against weekly guidelines — and for seeing how many hidden calories are in a Friday night.",
  icon: "🍺", category: "Wellness",
  fields: [
    { id:"au_volume", label:"Volume (ml)", type:"number", placeholder:"e.g. 500" },
    { id:"au_abv", label:"ABV / Strength (%)", type:"number", placeholder:"e.g. 5" }
  ],

  calculate(f) {
    const vol=parseFloat(f.au_volume), abv=parseFloat(f.au_abv);
    if (isNaN(vol) || isNaN(abv) || vol <= 0 || abv <= 0) return null;
    const units=(vol*abv)/1000;
    const cal=Math.round(units*56+vol*0.03);
    const weekly=(units*7).toFixed(1);
    const cat=units<=2?"Low — within single drink guidelines":units<=4?"Moderate":"High — above recommended single serving";
    return { value: units.toFixed(1) + " units  |  ~" + cal + " kcal",
      label:"Alcohol units in this drink",
      category:cat + "  |  If consumed daily: " + weekly + " units/week (limit: 14)",
      interpretation:"This drink contains " + units.toFixed(1) + " alcohol units and approximately " + cal + " calories. The UK NHS recommends no more than 14 units per week for both men and women, spread across 3 or more days. If consumed daily, this drink would contribute " + weekly + " units per week. Alcohol provides 7 kcal per gram with no nutritional value — liquid calories are a common hidden source in diet tracking." };
  },
  faq:[["What are the weekly alcohol guidelines?","NHS recommends no more than 14 units per week for both men and women, spread over at least 3 days. That's roughly 6 pints of average-strength beer or 10 small glasses of wine."],["How many calories are in alcohol?","7 kcal per gram — more than protein or carbs, less than fat. A pint of lager is roughly 180–220 kcal. A large glass of wine is around 200 kcal. It adds up fast and doesn't fill you up."]],
  related:["calorie-deficit","tdee-calculator","water-calculator"]
},

"bmi-children": {
  title: "BMI Calculator for Children",
  desc: "BMI for children aged 2–19. Important: adult BMI cutoffs don't apply here — children need age- and sex-specific percentile charts.",
  icon: "🧒", category: "Body",
  fields: [
    { id:"bmic_age", label:"Age (years)", type:"number", placeholder:"e.g. 12" },
    { id:"bmic_gender", label:"Sex", type:"select", options:[["male","Boy"],["female","Girl"]] },
    { id:"bmic_weight", label:"Weight", type:"number", placeholder:"e.g. 45",
      unit:{ id:"bmic_wu", options:[["kg","kg"],["lb","lb"]] } },
    { id:"bmic_height", label:"Height", type:"number", placeholder:"e.g. 150",
      unit:{ id:"bmic_hu", options:[["cm","cm"],["ft","ft"]] } }
  ],
  stats: { title:"BMI-for-Age Percentile (CDC)", header:["Percentile","Category"], rows:[["Below 5th","Underweight"],["5th – 84th","Healthy weight"],["85th – 94th","Overweight"],["95th and above","Obese"]], note:"Children require age- and sex-specific charts — adult cutoffs do not apply." },
  calculate(f) {
    let w=parseFloat(f.bmic_weight), h=parseFloat(f.bmic_height);
    const age=parseFloat(f.bmic_age);
    if (isNaN(age) || isNaN(w) || isNaN(h) || w <= 0 || h <= 0) return null;
    if (f.bmic_wu==="lb") w=w*0.4536;
    if (f.bmic_hu==="ft") h=h*30.48;
    const bmi=(w/Math.pow(h/100,2)).toFixed(1);
    const cat=bmi<14?"Underweight":bmi<19?"Healthy weight":bmi<23?"Overweight":"Obese";
    return { value: bmi + " BMI",
      label:"General estimate — children's BMI must be interpreted by age percentile",
      category:cat + " (general estimate — consult a paediatrician for full assessment)",
      interpretation:"Important: adult BMI categories do not apply to children. Children's BMI must be interpreted using age- and sex-specific percentile charts. A BMI that is healthy for a 12-year-old is different from a healthy BMI for a 6-year-old. This result (" + bmi + ") is a general guide only. Please consult your child's paediatrician or use official growth chart tools for an accurate assessment." };
  },
  faq:[["Is BMI reliable for children?","Only when interpreted using age- and sex-specific percentile charts — not adult cutoffs. A BMI of 17 might be healthy for a 6-year-old and underweight for a 16-year-old. Always involve a paediatrician for a full assessment."],["What is a healthy BMI for a 12-year-old?","It depends on their sex and growth stage. Doctors use CDC or WHO growth charts to place children on a percentile curve — that context is what matters, not the raw number."]],
  related:["bmi-calculator","calorie-intake-children","ideal-weight"]
},

"pace-to-speed": {
  title: "Pace to Speed Converter",
  desc: "Convert running pace (min/km or min/mile) to speed in km/h or mph. Also shows projected 5K and 10K finish times.",
  icon: "⚡", category: "Fitness",
  fields: [
    { id:"pts_pace_min", label:"Pace — Minutes", type:"number", placeholder:"e.g. 5" },
    { id:"pts_pace_sec", label:"Pace — Seconds", type:"number", placeholder:"e.g. 30" },
    { id:"pts_unit", label:"Pace unit", type:"select", options:[["km","per km"],["mi","per mile"]] }
  ],

  calculate(f) {
    const m=parseFloat(f.pts_pace_min)||0, s=parseFloat(f.pts_pace_sec)||0;
    if ((isNaN(m) && isNaN(s)) || (m <= 0 && s <= 0)) return null;
    const totalMin=m+s/60;
    let kmh;
    if (f.pts_unit==="km") kmh=60/totalMin;
    else kmh=(60/totalMin)*1.60934;
    const mph=(kmh*0.621371).toFixed(2);
    const fiveK=(5/(kmh/60)).toFixed(1), tenK=(10/(kmh/60)).toFixed(1);
    return { value: kmh.toFixed(2) + " km/h  |  " + mph + " mph",
      label:"Running speed at " + m + ":" + s.toString().padStart(2,"0") + " per " + (f.pts_unit==="km"?"km":"mile"),
      category:"5K finish: " + fiveK + " min  |  10K finish: " + tenK + " min",
      interpretation:"At " + kmh.toFixed(1) + " km/h you would complete a 5K in " + fiveK + " minutes. Common reference points: 6:00/km (10 km/h) = easy jogging, 5:00/km (12 km/h) = good recreational pace, 4:00/km (15 km/h) = strong club runner, 3:00/km (20 km/h) = elite level." };
  },
  faq:[["What pace is 10 km/h?","6:00 per km — a comfortable jogging pace for most people. It's also roughly a 30-minute 5K, which is a common beginner goal."],["What is a marathon qualifying pace?","The Boston Marathon for men aged 18–34 requires around 4:17/km (6:54/mile). Most runners spend years working toward that."]],
  related:["running-pace","heart-rate-zones","calorie-burn-exercise"]
},

"resting-metabolic-rate": {

  title: "Resting Metabolic Rate (RMR) Calculator",
  desc: "Calculate the calories your body burns just to stay alive — breathing, heartbeat, temperature regulation. This is the floor your daily intake shouldn't go below.",
  icon: "🧪", category: "Nutrition",
  fields: [
    { id:"rmr_gender", label:"Sex", type:"select", options:[["male","Male"],["female","Female"]] },
    { id:"rmr_weight", label:"Weight", type:"number", placeholder:"e.g. 70",
      unit:{ id:"rmr_wu", options:[["kg","kg"],["lb","lb"]] } },
    { id:"rmr_height", label:"Height", type:"number", placeholder:"e.g. 175",
      unit:{ id:"rmr_hu", options:[["cm","cm"],["ft","ft"]] } },
    { id:"rmr_age", label:"Age", type:"number", placeholder:"e.g. 30" }
  ],
  stats: { title:"Average RMR by Age & Sex", header:["Age","Men","Women"], rows:[["20–29","1,800–2,000","1,450–1,600"],["30–39","1,750–1,950","1,400–1,550"],["40–49","1,700–1,900","1,350–1,500"],["50–59","1,650–1,850","1,300–1,450"],["60+","1,550–1,750","1,250–1,400"]], note:"RMR decreases ~1–2% per decade after age 30." },
  calculate(f) {
    let w=parseFloat(f.rmr_weight), h=parseFloat(f.rmr_height);
    const age=parseFloat(f.rmr_age);
    if (isNaN(w) || isNaN(h) || isNaN(age) || w <= 0 || h <= 0 || age <= 0) return null;
    if (f.rmr_wu==="lb") w=w*0.4536;
    if (f.rmr_hu==="ft") h=h*30.48;
    const rmr=f.rmr_gender==="male"?10*w+6.25*h-5*age+5:10*w+6.25*h-5*age-161;
    const perHour=(rmr/24).toFixed(0);
    const perMin=(rmr/1440).toFixed(2);
    return { value: Math.round(rmr) + " kcal/day",
      label:"Resting Metabolic Rate (Mifflin-St Jeor equation)",
      category:perHour + " kcal/hour  |  " + perMin + " kcal/minute  |  Just to stay alive",
      interpretation:"Your body burns " + Math.round(rmr) + " kcal per day purely to maintain vital functions — breathing, heartbeat, brain activity, temperature regulation and cell maintenance. This is your floor: eating below this long-term is not recommended. To find your full daily needs including activity, use our <a href='/calculators/tdee-calculator.html'>TDEE calculator</a>. Building muscle increases RMR because muscle tissue burns more calories at rest than fat tissue." };
  },
  faq:[["What is the difference between RMR and BMR?","Very similar. BMR is measured in a fully fasted, resting lab state. RMR is slightly higher because it includes minor everyday activity. In practice, most people use the terms interchangeably."],["Can I actually increase my metabolic rate?","Yes — building muscle is the most reliable way. Muscle tissue burns more calories at rest than fat tissue does. Adequate protein intake and regular resistance training are the main levers."]],
  related:["tdee-calculator","calorie-deficit","lean-body-mass"]
}

};

// Related calculator display name map
const CALC_NAMES = {
  "bmi-calculator": { desc:"Body mass index check", name:"BMI Calculator",          icon:"⚖", link:"/calculators/bmi-calculator.html" },
  "macro-calculator": { desc:"Protein, carbs & fat split", name:"Macro Calculator",        icon:"🥗", link:"/calculators/macro-calculator.html" },
  "tdee-calculator": { desc:"Daily calorie burn", name:"TDEE Calculator",         icon:"🔥", link:"/calculators/tdee-calculator.html" },
  "body-fat-calculator": { desc:"Body fat % estimate", name:"Body Fat Calculator",     icon:"📊", link:"/calculators/body-fat-calculator.html" },
  "water-calculator": { desc:"Daily hydration goal", name:"Water Intake",            icon:"💧", link:"/calculators/water-calculator.html" },
  "age-calculator": { desc:"Exact age calculation", name:"Age Calculator",          icon:"🎂", link:"/calculators/age-calculator.html" },
  "percentage-calculator": { desc:"Quick percentage math", name:"Percentage Calculator",   icon:"%",  link:"/calculators/percentage-calculator.html" },
};
Object.keys(CALCULATORS).forEach(id => {
  if (!CALC_NAMES[id]) {
    CALC_NAMES[id] = { name:CALCULATORS[id].title, icon:CALCULATORS[id].icon, desc:CALCULATORS[id].desc ? CALCULATORS[id].desc.slice(0,50) : "", link:"/calculator.html?id="+id };
  }
});
