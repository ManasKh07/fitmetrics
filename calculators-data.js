const CALCULATORS = {

  "ideal-weight": {
    title: "Ideal Weight Calculator",
    desc: "Find your ideal body weight based on height and gender using the Devine formula.",
    icon: "⚖",
    category: "Body",
    fields: [
      { id: "iw_gender", label: "Sex", type: "select", options: [["male","Male"],["female","Female"]] },
      { id: "iw_height", label: "Height (cm)", type: "number", placeholder: "e.g. 175" }
    ],
    calculate(f) {
      const h = parseFloat(f.iw_height), g = f.iw_gender;
      if (!h) return null;
      const inches = h / 2.54;
      let base = g === "male" ? 50 + 2.3 * (inches - 60) : 45.5 + 2.3 * (inches - 60);
      base = Math.max(base, 30);
      return { value: base.toFixed(1) + " kg", label: "Ideal body weight (Devine formula)", category: base < 50 ? "Light frame" : base < 75 ? "Medium frame" : "Tall frame" };
    },
    faq: [
      ["Is ideal weight the same as healthy weight?", "Ideal weight is an estimate based on height. Healthy weight also considers muscle mass, bone density and body composition."],
      ["Which formula is used?", "This calculator uses the Devine formula, one of the most widely used in clinical settings."]
    ],
    related: ["bmi", "body-fat-calculator", "tdee-calculator"]
  },

  "lean-body-mass": {
    title: "Lean Body Mass Calculator",
    desc: "Calculate your lean body mass — the weight of everything in your body except fat.",
    icon: "💪",
    category: "Body",
    fields: [
      { id: "lbm_gender", label: "Sex", type: "select", options: [["male","Male"],["female","Female"]] },
      { id: "lbm_weight", label: "Weight (kg)", type: "number", placeholder: "e.g. 75" },
      { id: "lbm_height", label: "Height (cm)", type: "number", placeholder: "e.g. 175" }
    ],
    calculate(f) {
      const w = parseFloat(f.lbm_weight), h = parseFloat(f.lbm_height), g = f.lbm_gender;
      if (!w || !h) return null;
      const lbm = g === "male"
        ? 0.407 * w + 0.267 * h - 19.2
        : 0.252 * w + 0.473 * h - 48.3;
      return { value: lbm.toFixed(1) + " kg", label: "Lean body mass (Boer formula)", category: "Fat mass: " + (w - lbm).toFixed(1) + " kg" };
    },
    faq: [
      ["What is lean body mass?", "Lean body mass includes muscles, bones, organs and water — everything except body fat."],
      ["Why does lean body mass matter?", "It determines your basal metabolic rate and is a key indicator of physical fitness."]
    ],
    related: ["body-fat-calculator", "bmi", "tdee-calculator"]
  },

  "calorie-deficit": {
    title: "Calorie Deficit Calculator",
    desc: "Calculate exactly how many calories to eat daily to lose weight at your target pace.",
    icon: "📉",
    category: "Nutrition",
    fields: [
      { id: "cd_gender", label: "Sex", type: "select", options: [["male","Male"],["female","Female"]] },
      { id: "cd_age", label: "Age", type: "number", placeholder: "e.g. 28" },
      { id: "cd_weight", label: "Weight (kg)", type: "number", placeholder: "e.g. 80" },
      { id: "cd_height", label: "Height (cm)", type: "number", placeholder: "e.g. 175" },
      { id: "cd_activity", label: "Activity Level", type: "select", options: [["1.2","Sedentary"],["1.375","Light exercise"],["1.55","Moderate exercise"],["1.725","Very active"]] },
      { id: "cd_loss", label: "Weight loss per week (kg)", type: "select", options: [["0.25","0.25 kg (gentle)"],["0.5","0.5 kg (moderate)"],["0.75","0.75 kg (fast)"],["1","1 kg (aggressive)"]] }
    ],
    calculate(f) {
      const g = f.cd_gender, age = parseFloat(f.cd_age), w = parseFloat(f.cd_weight), h = parseFloat(f.cd_height), act = parseFloat(f.cd_activity), loss = parseFloat(f.cd_loss);
      if (!age || !w || !h) return null;
      const bmr = g === "male" ? 10*w + 6.25*h - 5*age + 5 : 10*w + 6.25*h - 5*age - 161;
      const tdee = bmr * act;
      const target = tdee - (loss * 1000 / 7);
      return { value: Math.round(target) + " kcal/day", label: "Daily calorie target for " + loss + " kg/week loss", category: "Your TDEE: " + Math.round(tdee) + " kcal" };
    },
    faq: [
      ["How big a deficit is safe?", "A deficit of 500 kcal/day is generally considered safe and sustainable for most people."],
      ["Will I lose muscle on a deficit?", "Eating adequate protein and doing resistance training helps preserve muscle during a calorie deficit."]
    ],
    related: ["tdee-calculator", "macro-calculator", "protein-intake"]
  },

  "calorie-surplus": {
    title: "Calorie Surplus Calculator",
    desc: "Find out how many calories to eat daily to gain muscle without excess fat.",
    icon: "📈",
    category: "Nutrition",
    fields: [
      { id: "cs_gender", label: "Sex", type: "select", options: [["male","Male"],["female","Female"]] },
      { id: "cs_age", label: "Age", type: "number", placeholder: "e.g. 25" },
      { id: "cs_weight", label: "Weight (kg)", type: "number", placeholder: "e.g. 70" },
      { id: "cs_height", label: "Height (cm)", type: "number", placeholder: "e.g. 175" },
      { id: "cs_activity", label: "Activity Level", type: "select", options: [["1.2","Sedentary"],["1.375","Light exercise"],["1.55","Moderate exercise"],["1.725","Very active"]] },
      { id: "cs_goal", label: "Surplus size", type: "select", options: [["200","Lean bulk (+200 kcal)"],["350","Moderate bulk (+350 kcal)"],["500","Aggressive bulk (+500 kcal)"]] }
    ],
    calculate(f) {
      const g = f.cs_gender, age = parseFloat(f.cs_age), w = parseFloat(f.cs_weight), h = parseFloat(f.cs_height), act = parseFloat(f.cs_activity), surplus = parseFloat(f.cs_goal);
      if (!age || !w || !h) return null;
      const bmr = g === "male" ? 10*w + 6.25*h - 5*age + 5 : 10*w + 6.25*h - 5*age - 161;
      const tdee = bmr * act;
      const target = tdee + surplus;
      return { value: Math.round(target) + " kcal/day", label: "Daily calorie target for muscle gain", category: "Surplus: +" + surplus + " kcal above TDEE" };
    },
    faq: [
      ["How much muscle can I gain per month?", "Beginners can gain 1–2 kg of muscle per month. Intermediate lifters typically gain 0.5–1 kg per month."],
      ["What is a lean bulk?", "A lean bulk uses a small surplus (200–300 kcal) to minimise fat gain while building muscle gradually."]
    ],
    related: ["tdee-calculator", "protein-intake", "macro-calculator"]
  },

  "protein-intake": {
    title: "Protein Intake Calculator",
    desc: "Calculate your optimal daily protein intake based on body weight and fitness goal.",
    icon: "🥩",
    category: "Nutrition",
    fields: [
      { id: "pi_weight", label: "Weight (kg)", type: "number", placeholder: "e.g. 75" },
      { id: "pi_goal", label: "Goal", type: "select", options: [["1.6","Maintain muscle"],["2.0","Build muscle"],["2.4","Athlete / heavy training"],["1.2","Lose weight (preserve muscle)"]] }
    ],
    calculate(f) {
      const w = parseFloat(f.pi_weight), g = parseFloat(f.pi_goal);
      if (!w) return null;
      const grams = (w * g).toFixed(0);
      return { value: grams + "g / day", label: "Daily protein target", category: Math.round(grams * 4) + " kcal from protein" };
    },
    faq: [
      ["Can I eat too much protein?", "For healthy adults, intakes up to 3.5g/kg are generally considered safe but unnecessary."],
      ["What are the best protein sources?", "Chicken, fish, eggs, Greek yogurt, lentils and tofu are all excellent high-protein foods."]
    ],
    related: ["macro-calculator", "tdee-calculator", "calorie-deficit"]
  },

  "fat-intake": {
    title: "Fat Intake Calculator",
    desc: "Find out how many grams of fat you should eat daily based on your calorie needs.",
    icon: "🥑",
    category: "Nutrition",
    fields: [
      { id: "fi_calories", label: "Daily Calorie Target (kcal)", type: "number", placeholder: "e.g. 2000" },
      { id: "fi_pct", label: "Fat percentage of diet", type: "select", options: [["20","20% (low fat)"],["30","30% (standard)"],["35","35% (moderate high)"],["40","40% (high fat / keto)"]] }
    ],
    calculate(f) {
      const cal = parseFloat(f.fi_calories), pct = parseFloat(f.fi_pct);
      if (!cal) return null;
      const grams = ((cal * pct / 100) / 9).toFixed(0);
      return { value: grams + "g / day", label: "Daily fat intake at " + pct + "% of calories", category: Math.round(grams * 9) + " kcal from fat" };
    },
    faq: [
      ["Is fat bad for you?", "Dietary fat is essential for hormone production, brain function and vitamin absorption. The type of fat matters more than the amount."],
      ["What are healthy fats?", "Unsaturated fats from avocados, nuts, olive oil and fatty fish are beneficial for cardiovascular health."]
    ],
    related: ["macro-calculator", "calorie-deficit", "protein-intake"]
  },

  "carb-intake": {
    title: "Carbohydrate Intake Calculator",
    desc: "Calculate your daily carbohydrate needs based on your calorie target and diet style.",
    icon: "🍚",
    category: "Nutrition",
    fields: [
      { id: "ci_calories", label: "Daily Calorie Target (kcal)", type: "number", placeholder: "e.g. 2000" },
      { id: "ci_pct", label: "Carb percentage of diet", type: "select", options: [["10","10% (keto)"],["20","20% (low carb)"],["40","40% (moderate)"],["50","50% (standard)"],["60","60% (high carb / endurance)"]] }
    ],
    calculate(f) {
      const cal = parseFloat(f.ci_calories), pct = parseFloat(f.ci_pct);
      if (!cal) return null;
      const grams = ((cal * pct / 100) / 4).toFixed(0);
      return { value: grams + "g / day", label: "Daily carb intake at " + pct + "% of calories", category: Math.round(grams * 4) + " kcal from carbs" };
    },
    faq: [
      ["Do carbs cause weight gain?", "Excess calories cause weight gain, not carbs specifically. Carbohydrates are the body's preferred energy source."],
      ["What is a low carb diet?", "A low carb diet typically limits carbs to under 100g per day. Keto diets go below 50g per day."]
    ],
    related: ["macro-calculator", "calorie-deficit", "fat-intake"]
  },

  "fiber-intake": {
    title: "Daily Fiber Intake Calculator",
    desc: "Calculate your recommended daily fibre intake based on age, sex and calorie intake.",
    icon: "🌾",
    category: "Nutrition",
    fields: [
      { id: "fib_gender", label: "Sex", type: "select", options: [["male","Male"],["female","Female"]] },
      { id: "fib_age", label: "Age", type: "number", placeholder: "e.g. 30" }
    ],
    calculate(f) {
      const age = parseFloat(f.fib_age), g = f.fib_gender;
      if (!age) return null;
      let target;
      if (g === "male") target = age <= 50 ? 38 : 30;
      else target = age <= 50 ? 25 : 21;
      return { value: target + "g / day", label: "Recommended daily fibre intake", category: "Based on Academy of Nutrition guidelines" };
    },
    faq: [
      ["Why is fibre important?", "Fibre supports digestion, stabilises blood sugar, lowers cholesterol and promotes a healthy gut microbiome."],
      ["What foods are high in fibre?", "Legumes, oats, vegetables, fruits and whole grains are excellent sources of dietary fibre."]
    ],
    related: ["macro-calculator", "calorie-deficit", "water-calculator"]
  },

  "heart-rate-zones": {
    title: "Heart Rate Zone Calculator",
    desc: "Find your 5 training heart rate zones based on your maximum heart rate.",
    icon: "❤",
    category: "Fitness",
    fields: [
      { id: "hrz_age", label: "Age", type: "number", placeholder: "e.g. 30" },
      { id: "hrz_rhr", label: "Resting Heart Rate (bpm)", type: "number", placeholder: "e.g. 60" }
    ],
    calculate(f) {
      const age = parseFloat(f.hrz_age), rhr = parseFloat(f.hrz_rhr);
      if (!age || !rhr) return null;
      const mhr = 220 - age;
      const hrr = mhr - rhr;
      const zones = [
        ["Zone 1 — Recovery", Math.round(rhr + hrr*0.5), Math.round(rhr + hrr*0.6)],
        ["Zone 2 — Aerobic base", Math.round(rhr + hrr*0.6), Math.round(rhr + hrr*0.7)],
        ["Zone 3 — Aerobic", Math.round(rhr + hrr*0.7), Math.round(rhr + hrr*0.8)],
        ["Zone 4 — Threshold", Math.round(rhr + hrr*0.8), Math.round(rhr + hrr*0.9)],
        ["Zone 5 — Max", Math.round(rhr + hrr*0.9), mhr]
      ];
      const lines = zones.map(z => z[0] + ": " + z[1] + "–" + z[2] + " bpm").join(" | ");
      return { value: "Max HR: " + mhr + " bpm", label: lines, category: "Karvonen formula" };
    },
    faq: [
      ["What is Zone 2 training?", "Zone 2 is a low-intensity aerobic zone that improves fat burning efficiency and cardiovascular endurance."],
      ["How do I measure resting heart rate?", "Measure your pulse first thing in the morning before getting out of bed for the most accurate reading."]
    ],
    related: ["tdee-calculator", "calorie-deficit", "vo2max"]
  },

  "vo2max": {
    title: "VO2 Max Estimator",
    desc: "Estimate your VO2 max — a key measure of cardiovascular fitness — from a simple run test.",
    icon: "🫁",
    category: "Fitness",
    fields: [
      { id: "vo2_time", label: "1.5 mile run time (minutes)", type: "number", placeholder: "e.g. 12" },
      { id: "vo2_age", label: "Age", type: "number", placeholder: "e.g. 30" },
      { id: "vo2_gender", label: "Sex", type: "select", options: [["male","Male"],["female","Female"]] }
    ],
    calculate(f) {
      const t = parseFloat(f.vo2_time), age = parseFloat(f.vo2_age), g = f.vo2_gender;
      if (!t || !age) return null;
      const vo2 = 3.5 + (483 / t);
      let category;
      if (g === "male") {
        if (vo2 >= 55) category = "Superior";
        else if (vo2 >= 45) category = "Excellent";
        else if (vo2 >= 38) category = "Good";
        else if (vo2 >= 30) category = "Fair";
        else category = "Poor";
      } else {
        if (vo2 >= 50) category = "Superior";
        else if (vo2 >= 40) category = "Excellent";
        else if (vo2 >= 33) category = "Good";
        else if (vo2 >= 25) category = "Fair";
        else category = "Poor";
      }
      return { value: vo2.toFixed(1) + " ml/kg/min", label: "Estimated VO2 Max", category };
    },
    faq: [
      ["What is a good VO2 max?", "For men, above 45 ml/kg/min is considered excellent. For women, above 40 ml/kg/min is excellent."],
      ["Can VO2 max be improved?", "Yes. Regular aerobic exercise, especially Zone 2 training and interval training, can significantly improve VO2 max."]
    ],
    related: ["heart-rate-zones", "tdee-calculator", "calorie-deficit"]
  },

  "one-rep-max": {
    title: "One Rep Max (1RM) Calculator",
    desc: "Calculate your one rep max for any lift using the Epley or Brzycki formula.",
    icon: "🏋",
    category: "Fitness",
    fields: [
      { id: "orm_weight", label: "Weight lifted (kg)", type: "number", placeholder: "e.g. 100" },
      { id: "orm_reps", label: "Number of reps performed", type: "number", placeholder: "e.g. 8" }
    ],
    calculate(f) {
      const w = parseFloat(f.orm_weight), r = parseFloat(f.orm_reps);
      if (!w || !r) return null;
      const epley = w * (1 + r / 30);
      const brzycki = w * (36 / (37 - r));
      const avg = ((epley + brzycki) / 2).toFixed(1);
      return { value: avg + " kg", label: "Estimated 1RM (average of Epley & Brzycki)", category: "80% of 1RM: " + (avg * 0.8).toFixed(1) + " kg" };
    },
    faq: [
      ["Why not just attempt a 1RM?", "Testing 1RM directly carries injury risk. Calculating it from submaximal lifts is safer and accurate enough for programming."],
      ["What percentage should I train at?", "For hypertrophy, 65–85% of 1RM. For strength, 85–95%. For power, 50–70%."]
    ],
    related: ["tdee-calculator", "protein-intake", "calorie-surplus"]
  },

  "push-up-test": {
    title: "Push-Up Fitness Test Calculator",
    desc: "Find out your push-up fitness level based on age, sex and reps completed.",
    icon: "💪",
    category: "Fitness",
    fields: [
      { id: "put_gender", label: "Sex", type: "select", options: [["male","Male"],["female","Female"]] },
      { id: "put_age", label: "Age", type: "number", placeholder: "e.g. 30" },
      { id: "put_reps", label: "Push-ups completed", type: "number", placeholder: "e.g. 25" }
    ],
    calculate(f) {
      const g = f.put_gender, age = parseFloat(f.put_age), reps = parseFloat(f.put_reps);
      if (!age || !reps) return null;
      const standards = {
        male: [[17,21],[21,27],[15,21],[13,17],[11,15]],
        female: [[12,16],[13,18],[11,14],[9,12],[7,10]]
      };
      const idx = age < 30 ? 0 : age < 40 ? 1 : age < 50 ? 2 : age < 60 ? 3 : 4;
      const [avg, good] = standards[g][idx];
      const category = reps >= good ? "Excellent" : reps >= avg ? "Good" : reps >= avg * 0.7 ? "Average" : "Below average";
      return { value: reps + " reps", label: "Your push-up count", category };
    },
    faq: [
      ["How often should I do push-ups?", "3–4 times per week with rest days in between allows adequate recovery for strength and endurance gains."],
      ["Do push-ups build muscle?", "Yes. Push-ups train the chest, shoulders and triceps. Weighted or archer push-up variations increase the challenge."]
    ],
    related: ["one-rep-max", "tdee-calculator", "protein-intake"]
  },

  "running-pace": {
    title: "Running Pace Calculator",
    desc: "Calculate your running pace per kilometre or mile from your distance and finish time.",
    icon: "🏃",
    category: "Fitness",
    fields: [
      { id: "rp_dist", label: "Distance (km)", type: "number", placeholder: "e.g. 10" },
      { id: "rp_hours", label: "Time — Hours", type: "number", placeholder: "0" },
      { id: "rp_mins", label: "Time — Minutes", type: "number", placeholder: "e.g. 55" },
      { id: "rp_secs", label: "Time — Seconds", type: "number", placeholder: "0" }
    ],
    calculate(f) {
      const d = parseFloat(f.rp_dist), h = parseFloat(f.rp_hours)||0, m = parseFloat(f.rp_mins)||0, s = parseFloat(f.rp_secs)||0;
      if (!d) return null;
      const totalSecs = h*3600 + m*60 + s;
      const paceSecPerKm = totalSecs / d;
      const pm = Math.floor(paceSecPerKm / 60);
      const ps = Math.round(paceSecPerKm % 60).toString().padStart(2,"0");
      const speedKmh = (d / (totalSecs / 3600)).toFixed(1);
      return { value: pm + ":" + ps + " /km", label: "Your running pace", category: "Speed: " + speedKmh + " km/h" };
    },
    faq: [
      ["What is a good 5K pace?", "For recreational runners, under 30 minutes (6:00/km) is a common goal. Competitive runners aim for under 20 minutes."],
      ["How do I improve my running pace?", "Interval training, tempo runs and consistent weekly mileage all help improve running speed over time."]
    ],
    related: ["heart-rate-zones", "vo2max", "calorie-deficit"]
  },

  "steps-to-calories": {
    title: "Steps to Calories Calculator",
    desc: "Convert your daily step count into estimated calories burned based on your weight.",
    icon: "👟",
    category: "Fitness",
    fields: [
      { id: "stc_steps", label: "Daily Steps", type: "number", placeholder: "e.g. 8000" },
      { id: "stc_weight", label: "Weight (kg)", type: "number", placeholder: "e.g. 70" }
    ],
    calculate(f) {
      const steps = parseFloat(f.stc_steps), w = parseFloat(f.stc_weight);
      if (!steps || !w) return null;
      const calPerStep = 0.0004 * w;
      const total = Math.round(steps * calPerStep);
      return { value: total + " kcal", label: "Estimated calories burned from walking", category: "≈ " + (steps / 1350).toFixed(1) + " km walked" };
    },
    faq: [
      ["How accurate is this?", "This is an estimate. Actual burn varies with stride length, terrain and individual metabolism."],
      ["How many steps burn 500 calories?", "For a 70 kg person, approximately 10,000–12,000 steps burns around 500 calories."]
    ],
    related: ["tdee-calculator", "calorie-deficit", "water-calculator"]
  },

  "sleep-calculator": {
    title: "Sleep Calculator",
    desc: "Find the best times to wake up based on 90-minute sleep cycles to feel fully rested.",
    icon: "😴",
    category: "Wellness",
    fields: [
      { id: "sl_hour", label: "Bedtime — Hour", type: "number", placeholder: "e.g. 22" },
      { id: "sl_min", label: "Bedtime — Minute", type: "number", placeholder: "e.g. 30" }
    ],
    calculate(f) {
      const h = parseFloat(f.sl_hour), m = parseFloat(f.sl_min)||0;
      if (isNaN(h)) return null;
      const fallAsleep = 14;
      const cycles = [4,5,6];
      const times = cycles.map(c => {
        const totalMins = h*60 + m + fallAsleep + c*90;
        const wh = Math.floor(totalMins / 60) % 24;
        const wm = totalMins % 60;
        return c + " cycles (" + (c*1.5) + "h): " + wh.toString().padStart(2,"0") + ":" + wm.toString().padStart(2,"0");
      });
      return { value: "Best wake times", label: times.join(" | "), category: "Includes ~14 min to fall asleep" };
    },
    faq: [
      ["What is a sleep cycle?", "A sleep cycle is approximately 90 minutes and includes light sleep, deep sleep and REM sleep stages."],
      ["How many sleep cycles do I need?", "Most adults need 5–6 complete cycles (7.5–9 hours) per night for optimal rest and recovery."]
    ],
    related: ["tdee-calculator", "water-calculator", "heart-rate-zones"]
  },

  "bmi-prime": {
    title: "BMI Prime Calculator",
    desc: "Calculate your BMI Prime — a ratio that shows how close you are to the upper healthy weight limit.",
    icon: "📊",
    category: "Body",
    fields: [
      { id: "bp_weight", label: "Weight (kg)", type: "number", placeholder: "e.g. 70" },
      { id: "bp_height", label: "Height (cm)", type: "number", placeholder: "e.g. 175" }
    ],
    calculate(f) {
      const w = parseFloat(f.bp_weight), h = parseFloat(f.bp_height);
      if (!w || !h) return null;
      const bmi = w / Math.pow(h/100, 2);
      const prime = (bmi / 25).toFixed(2);
      const cat = prime < 0.74 ? "Underweight" : prime <= 1.0 ? "Healthy" : prime <= 1.2 ? "Overweight" : "Obese";
      return { value: prime, label: "BMI Prime (ratio to upper healthy limit of 25)", category: cat + " — BMI: " + bmi.toFixed(1) };
    },
    faq: [
      ["What does BMI Prime of 1.0 mean?", "A BMI Prime of 1.0 means your BMI is exactly 25 — the upper boundary of healthy weight."],
      ["Is BMI Prime better than BMI?", "BMI Prime makes it easier to compare health status across different upper-limit standards used globally."]
    ],
    related: ["bmi-calculator", "body-fat-calculator", "ideal-weight"]
  },

  "waist-to-height": {
    title: "Waist-to-Height Ratio Calculator",
    desc: "Calculate your waist-to-height ratio — a simple and accurate indicator of abdominal fat risk.",
    icon: "📏",
    category: "Body",
    fields: [
      { id: "wth_waist", label: "Waist circumference (cm)", type: "number", placeholder: "e.g. 80" },
      { id: "wth_height", label: "Height (cm)", type: "number", placeholder: "e.g. 175" }
    ],
    calculate(f) {
      const w = parseFloat(f.wth_waist), h = parseFloat(f.wth_height);
      if (!w || !h) return null;
      const ratio = (w / h).toFixed(2);
      const cat = ratio < 0.4 ? "Underweight" : ratio <= 0.5 ? "Healthy" : ratio <= 0.6 ? "Overweight" : "Obese";
      return { value: ratio, label: "Waist-to-height ratio", category: cat + " — keep it under 0.5" };
    },
    faq: [
      ["Why is waist-to-height ratio useful?", "It identifies central obesity which is a stronger predictor of heart disease and diabetes than BMI alone."],
      ["What is the healthy range?", "A ratio below 0.5 is considered healthy for most adults. The simple rule is 'keep your waist less than half your height'."]
    ],
    related: ["bmi-calculator", "body-fat-calculator", "waist-to-hip"]
  },

  "waist-to-hip": {
    title: "Waist-to-Hip Ratio Calculator",
    desc: "Calculate your waist-to-hip ratio and assess your risk of cardiovascular disease.",
    icon: "📐",
    category: "Body",
    fields: [
      { id: "wh_gender", label: "Sex", type: "select", options: [["male","Male"],["female","Female"]] },
      { id: "wh_waist", label: "Waist circumference (cm)", type: "number", placeholder: "e.g. 80" },
      { id: "wh_hip", label: "Hip circumference (cm)", type: "number", placeholder: "e.g. 100" }
    ],
    calculate(f) {
      const g = f.wh_gender, w = parseFloat(f.wh_waist), h = parseFloat(f.wh_hip);
      if (!w || !h) return null;
      const ratio = (w / h).toFixed(2);
      let cat;
      if (g === "male") cat = ratio <= 0.9 ? "Low risk" : ratio <= 0.99 ? "Moderate risk" : "High risk";
      else cat = ratio <= 0.8 ? "Low risk" : ratio <= 0.85 ? "Moderate risk" : "High risk";
      return { value: ratio, label: "Waist-to-hip ratio", category: cat };
    },
    faq: [
      ["What does a high WHR mean?", "A high waist-to-hip ratio indicates excess abdominal fat, which is linked to higher risk of heart disease, stroke and diabetes."],
      ["What is the ideal WHR?", "WHO recommends below 0.9 for men and 0.85 for women for low cardiovascular risk."]
    ],
    related: ["waist-to-height", "body-fat-calculator", "bmi-calculator"]
  },

  "army-body-fat": {
    title: "Army Body Fat Calculator",
    desc: "Calculate body fat percentage using the US Army circumference method.",
    icon: "🪖",
    category: "Body",
    fields: [
      { id: "abf_gender", label: "Sex", type: "select", options: [["male","Male"],["female","Female"]] },
      { id: "abf_height", label: "Height (cm)", type: "number", placeholder: "e.g. 178" },
      { id: "abf_neck", label: "Neck circumference (cm)", type: "number", placeholder: "e.g. 38" },
      { id: "abf_waist", label: "Waist circumference (cm)", type: "number", placeholder: "e.g. 85" },
      { id: "abf_hip", label: "Hip circumference (cm — women only)", type: "number", placeholder: "e.g. 100" }
    ],
    calculate(f) {
      const g = f.abf_gender, h = parseFloat(f.abf_height), neck = parseFloat(f.abf_neck), waist = parseFloat(f.abf_waist), hip = parseFloat(f.abf_hip)||0;
      if (!h || !neck || !waist) return null;
      let bf;
      if (g === "male") {
        bf = 86.01 * Math.log10(waist - neck) - 70.041 * Math.log10(h) + 36.76;
      } else {
        bf = 163.205 * Math.log10(waist + hip - neck) - 97.684 * Math.log10(h) - 78.387;
      }
      bf = Math.max(bf, 2).toFixed(1);
      const cat = bf < 14 ? "Lean" : bf < 20 ? "Fitness" : bf < 25 ? "Acceptable" : "Excess";
      return { value: bf + "%", label: "Body fat estimate (US Army method)", category: cat };
    },
    faq: [
      ["How accurate is the Army method?", "It is accurate to within 3–4% and is widely used for fitness assessments when DEXA scans are unavailable."],
      ["What are the Army body fat standards?", "The US Army allows up to 20% for men aged 17–20 and up to 26% for women in the same age group."]
    ],
    related: ["body-fat-calculator", "bmi-calculator", "waist-to-hip"]
  },

  "calorie-burn-exercise": {
    title: "Exercise Calorie Burn Calculator",
    desc: "Estimate how many calories you burn during different types of exercise.",
    icon: "🔥",
    category: "Fitness",
    fields: [
      { id: "cbe_weight", label: "Weight (kg)", type: "number", placeholder: "e.g. 70" },
      { id: "cbe_exercise", label: "Exercise type", type: "select", options: [
        ["8","Running (8 km/h)"],["11","Running (11 km/h)"],["4","Walking (brisk)"],
        ["7","Cycling (moderate)"],["10","Cycling (vigorous)"],["6","Swimming"],
        ["5","Weight training"],["9","HIIT"],["3","Yoga"],["6","Jump rope"]
      ]},
      { id: "cbe_mins", label: "Duration (minutes)", type: "number", placeholder: "e.g. 45" }
    ],
    calculate(f) {
      const w = parseFloat(f.cbe_weight), met = parseFloat(f.cbe_exercise), mins = parseFloat(f.cbe_mins);
      if (!w || !mins) return null;
      const kcal = Math.round((met * 3.5 * w / 200) * mins);
      return { value: kcal + " kcal", label: "Estimated calories burned", category: "MET value: " + met };
    },
    faq: [
      ["What is MET?", "MET (Metabolic Equivalent of Task) measures how much energy an activity uses relative to resting. Running has a higher MET than walking."],
      ["Does muscle mass affect calorie burn?", "Yes. People with more muscle mass burn more calories at rest and during exercise."]
    ],
    related: ["tdee-calculator", "steps-to-calories", "calorie-deficit"]
  },

  "pregnancy-weight": {
    title: "Pregnancy Weight Gain Calculator",
    desc: "Calculate recommended total weight gain during pregnancy based on your pre-pregnancy BMI.",
    icon: "🤱",
    category: "Wellness",
    fields: [
      { id: "pg_weight", label: "Pre-pregnancy weight (kg)", type: "number", placeholder: "e.g. 65" },
      { id: "pg_height", label: "Height (cm)", type: "number", placeholder: "e.g. 165" },
      { id: "pg_twins", label: "Pregnancy type", type: "select", options: [["single","Single baby"],["twins","Twins"]] }
    ],
    calculate(f) {
      const w = parseFloat(f.pg_weight), h = parseFloat(f.pg_height), twins = f.pg_twins === "twins";
      if (!w || !h) return null;
      const bmi = w / Math.pow(h/100, 2);
      let range;
      if (twins) range = bmi < 18.5 ? "22–28 kg" : bmi < 25 ? "17–25 kg" : bmi < 30 ? "14–23 kg" : "11–19 kg";
      else range = bmi < 18.5 ? "12.5–18 kg" : bmi < 25 ? "11.5–16 kg" : bmi < 30 ? "7–11.5 kg" : "5–9 kg";
      const cat = bmi < 18.5 ? "Underweight" : bmi < 25 ? "Healthy weight" : bmi < 30 ? "Overweight" : "Obese";
      return { value: range, label: "Recommended total pregnancy weight gain", category: "Pre-pregnancy BMI: " + bmi.toFixed(1) + " (" + cat + ")" };
    },
    faq: [
      ["Why does pre-pregnancy weight matter?", "Women who start pregnancy at a healthy BMI have lower risk of complications. Weight gain guidelines are adjusted accordingly."],
      ["Is it safe to diet during pregnancy?", "Calorie restriction during pregnancy is not recommended. Focus on nutrient-dense foods rather than calorie cutting."]
    ],
    related: ["bmi-calculator", "water-calculator", "calorie-deficit"]
  },

  "due-date": {
    title: "Pregnancy Due Date Calculator",
    desc: "Calculate your estimated due date based on your last menstrual period.",
    icon: "🗓",
    category: "Wellness",
    fields: [
      { id: "dd_lmp", label: "First day of last menstrual period", type: "date" },
      { id: "dd_cycle", label: "Average cycle length (days)", type: "number", placeholder: "e.g. 28" }
    ],
    calculate(f) {
      const lmp = new Date(f.dd_lmp), cycle = parseFloat(f.dd_cycle)||28;
      if (isNaN(lmp.getTime())) return null;
      const due = new Date(lmp);
      due.setDate(due.getDate() + 280 + (cycle - 28));
      const opts = { year:"numeric", month:"long", day:"numeric" };
      const daysLeft = Math.round((due - new Date()) / 86400000);
      return { value: due.toLocaleDateString("en-GB", opts), label: "Estimated due date (Naegele's rule)", category: daysLeft > 0 ? daysLeft + " days to go" : "Due date passed" };
    },
    faq: [
      ["How accurate is the due date?", "Only about 5% of babies are born on their exact due date. Most arrive within 2 weeks either side."],
      ["What is Naegele's rule?", "Naegele's rule adds 280 days (40 weeks) to the first day of the last menstrual period to estimate the due date."]
    ],
    related: ["pregnancy-weight", "water-calculator", "bmi-calculator"]
  },

  "body-surface-area": {
    title: "Body Surface Area Calculator",
    desc: "Calculate your total body surface area (BSA) — commonly used in medical dosing calculations.",
    icon: "🧬",
    category: "Body",
    fields: [
      { id: "bsa_weight", label: "Weight (kg)", type: "number", placeholder: "e.g. 70" },
      { id: "bsa_height", label: "Height (cm)", type: "number", placeholder: "e.g. 175" }
    ],
    calculate(f) {
      const w = parseFloat(f.bsa_weight), h = parseFloat(f.bsa_height);
      if (!w || !h) return null;
      const bsa = Math.sqrt((h * w) / 3600).toFixed(2);
      return { value: bsa + " m²", label: "Body surface area (Mosteller formula)", category: "Used in medical drug dosing calculations" };
    },
    faq: [
      ["Why is BSA used in medicine?", "BSA is used to calculate chemotherapy doses, burn injury severity and cardiac output because it correlates better with metabolism than body weight alone."],
      ["What is average BSA for adults?", "The average BSA for adult men is approximately 1.9 m² and for adult women is approximately 1.6 m²."]
    ],
    related: ["bmi-calculator", "ideal-weight", "lean-body-mass"]
  },

  "nicotine-calculator": {
    title: "Nicotine Intake Calculator",
    desc: "Estimate your daily nicotine intake from cigarettes or other tobacco products.",
    icon: "🚭",
    category: "Wellness",
    fields: [
      { id: "nic_type", label: "Product type", type: "select", options: [["12","Cigarette (standard)"],["20","Cigarette (strong)"],["4","Light cigarette"],["8","Cigar"],["0.5","Nicotine patch (mg/h)"]] },
      { id: "nic_count", label: "Number per day", type: "number", placeholder: "e.g. 10" }
    ],
    calculate(f) {
      const mg = parseFloat(f.nic_type), count = parseFloat(f.nic_count);
      if (!count) return null;
      const absorbed = (mg * 0.1 * count).toFixed(1);
      const total = (mg * count).toFixed(1);
      return { value: absorbed + " mg absorbed", label: "Estimated nicotine absorbed per day", category: "Total nicotine in products: " + total + " mg" };
    },
    faq: [
      ["How much nicotine is absorbed from a cigarette?", "Only about 1–2 mg of the roughly 12 mg of nicotine in a cigarette is actually absorbed into the bloodstream."],
      ["At what level is nicotine toxic?", "Toxic doses start at around 30–60 mg for adults, though individual sensitivity varies."]
    ],
    related: ["tdee-calculator", "water-calculator", "bmi-calculator"]
  },

  "calorie-intake-children": {
    title: "Child Calorie Calculator",
    desc: "Estimate the recommended daily calorie intake for children aged 2–17.",
    icon: "👦",
    category: "Nutrition",
    fields: [
      { id: "cc_gender", label: "Sex", type: "select", options: [["male","Boy"],["female","Girl"]] },
      { id: "cc_age", label: "Age (years)", type: "number", placeholder: "e.g. 10" },
      { id: "cc_activity", label: "Activity level", type: "select", options: [["1.0","Sedentary"],["1.3","Moderately active"],["1.6","Active"]] }
    ],
    calculate(f) {
      const g = f.cc_gender, age = parseFloat(f.cc_age), act = parseFloat(f.cc_activity);
      if (!age) return null;
      let bmr;
      if (g === "male") bmr = 88.362 + 13.397*30 + 4.799*140 - 5.677*age;
      else bmr = 447.593 + 9.247*28 + 3.098*135 - 4.330*age;
      const cal = Math.round(bmr * act);
      return { value: cal + " kcal/day", label: "Estimated daily calorie needs", category: "Based on average weight/height for age" };
    },
    faq: [
      ["Should children count calories?", "Children should not count calories strictly. Focus on balanced meals, regular activity and listening to hunger cues."],
      ["What affects a child's calorie needs?", "Age, sex, height, weight, growth stage and physical activity level all affect calorie requirements for children."]
    ],
    related: ["water-calculator", "fiber-intake", "protein-intake"]
  },

  "alcohol-units": {
    title: "Alcohol Units Calculator",
    desc: "Calculate how many alcohol units are in your drink and compare to weekly guidelines.",
    icon: "🍺",
    category: "Wellness",
    fields: [
      { id: "au_volume", label: "Volume (ml)", type: "number", placeholder: "e.g. 500" },
      { id: "au_abv", label: "ABV / Strength (%)", type: "number", placeholder: "e.g. 5" }
    ],
    calculate(f) {
      const vol = parseFloat(f.au_volume), abv = parseFloat(f.au_abv);
      if (!vol || !abv) return null;
      const units = (vol * abv) / 1000;
      const cal = Math.round(units * 56 + vol * 0.03);
      const weekly = (units * 7).toFixed(1);
      const cat = units <= 2 ? "Low" : units <= 4 ? "Moderate" : "High";
      return { value: units.toFixed(1) + " units", label: "Units in this drink — approx " + cal + " kcal", category: cat + " — if daily: " + weekly + " units/week (limit: 14)" };
    },
    faq: [
      ["What are UK weekly alcohol guidelines?", "The NHS recommends no more than 14 units per week for both men and women, spread over 3+ days."],
      ["How many calories are in alcohol?", "Alcohol contains 7 kcal per gram — more than protein or carbohydrates but less than fat."]
    ],
    related: ["calorie-deficit", "tdee-calculator", "water-calculator"]
  },

  "bmi-children": {
    title: "BMI Calculator for Children",
    desc: "Calculate BMI for children and teens aged 2–19 and see the percentile category.",
    icon: "🧒",
    category: "Body",
    fields: [
      { id: "bmic_age", label: "Age (years)", type: "number", placeholder: "e.g. 12" },
      { id: "bmic_gender", label: "Sex", type: "select", options: [["male","Boy"],["female","Girl"]] },
      { id: "bmic_weight", label: "Weight (kg)", type: "number", placeholder: "e.g. 45" },
      { id: "bmic_height", label: "Height (cm)", type: "number", placeholder: "e.g. 150" }
    ],
    calculate(f) {
      const age = parseFloat(f.bmic_age), w = parseFloat(f.bmic_weight), h = parseFloat(f.bmic_height);
      if (!age || !w || !h) return null;
      const bmi = (w / Math.pow(h/100, 2)).toFixed(1);
      const cat = bmi < 14 ? "Underweight" : bmi < 19 ? "Healthy weight" : bmi < 23 ? "Overweight" : "Obese";
      return { value: bmi, label: "BMI (consult a doctor for percentile classification)", category: cat + " (general estimate — not age-percentile)" };
    },
    faq: [
      ["Is BMI reliable for children?", "BMI for children must be interpreted by percentile for age and sex, not the same cutoffs as adults. Always consult a paediatrician."],
      ["What is a healthy BMI for a 12-year-old?", "This varies significantly by sex and age. Your doctor uses growth charts to assess healthy weight in children."]
    ],
    related: ["bmi-calculator", "calorie-intake-children", "ideal-weight"]
  },

  "pace-to-speed": {
    title: "Pace to Speed Converter",
    desc: "Convert running pace (min/km or min/mile) to speed in km/h or mph and vice versa.",
    icon: "⚡",
    category: "Fitness",
    fields: [
      { id: "pts_pace_min", label: "Pace — Minutes", type: "number", placeholder: "e.g. 5" },
      { id: "pts_pace_sec", label: "Pace — Seconds", type: "number", placeholder: "e.g. 30" }
    ],
    calculate(f) {
      const m = parseFloat(f.pts_pace_min)||0, s = parseFloat(f.pts_pace_sec)||0;
      if (!m && !s) return null;
      const totalMin = m + s/60;
      const kmh = (60 / totalMin).toFixed(2);
      const mph = (kmh * 0.621371).toFixed(2);
      return { value: kmh + " km/h", label: "Running speed", category: mph + " mph" };
    },
    faq: [
      ["What pace is 10 km/h?", "10 km/h equals a pace of 6:00 per kilometre — a comfortable jogging speed for most people."],
      ["What is a marathon qualifying pace?", "Boston Marathon qualifying times for men aged 18–34 require approximately 4:17 per kilometre (6:54 per mile)."]
    ],
    related: ["running-pace", "heart-rate-zones", "calorie-burn-exercise"]
  },

  "resting-metabolic-rate": {
    title: "Resting Metabolic Rate (RMR) Calculator",
    desc: "Calculate your resting metabolic rate — the calories your body burns at complete rest.",
    icon: "🧪",
    category: "Nutrition",
    fields: [
      { id: "rmr_gender", label: "Sex", type: "select", options: [["male","Male"],["female","Female"]] },
      { id: "rmr_weight", label: "Weight (kg)", type: "number", placeholder: "e.g. 70" },
      { id: "rmr_height", label: "Height (cm)", type: "number", placeholder: "e.g. 175" },
      { id: "rmr_age", label: "Age", type: "number", placeholder: "e.g. 30" }
    ],
    calculate(f) {
      const g = f.rmr_gender, w = parseFloat(f.rmr_weight), h = parseFloat(f.rmr_height), age = parseFloat(f.rmr_age);
      if (!w || !h || !age) return null;
      const rmr = g === "male" ? 10*w + 6.25*h - 5*age + 5 : 10*w + 6.25*h - 5*age - 161;
      return { value: Math.round(rmr) + " kcal/day", label: "Resting Metabolic Rate (Mifflin-St Jeor)", category: "Your body burns this just staying alive" };
    },
    faq: [
      ["What is the difference between RMR and BMR?", "They are very similar. BMR is measured in a completely fasted, resting state. RMR is slightly higher as it includes minor activity."],
      ["Can I increase my metabolic rate?", "Yes. Building muscle mass, eating adequate protein and regular exercise all help raise your metabolic rate over time."]
    ],
    related: ["tdee-calculator", "calorie-deficit", "lean-body-mass"]
  }

};

// Related calculator display names map
const CALC_NAMES = {
  "bmi-calculator": { name: "BMI Calculator", icon: "⚖", link: "/calculators/bmi-calculator.html" },
  "macro-calculator": { name: "Macro Calculator", icon: "🥗", link: "/calculators/macro-calculator.html" },
  "tdee-calculator": { name: "TDEE Calculator", icon: "🔥", link: "/calculators/tdee-calculator.html" },
  "body-fat-calculator": { name: "Body Fat Calculator", icon: "📊", link: "/calculators/body-fat-calculator.html" },
  "water-calculator": { name: "Water Intake", icon: "💧", link: "/calculators/water-calculator.html" },
};
// For dynamic calcs, link to calculator.html?id=
Object.keys(CALCULATORS).forEach(id => {
  if (!CALC_NAMES[id]) {
    CALC_NAMES[id] = { name: CALCULATORS[id].title, icon: CALCULATORS[id].icon, link: "/calculator.html?id=" + id };
  }
});
