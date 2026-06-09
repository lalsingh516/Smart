import { Recipe, MealPlan, Article, Subscriber, Category, SiteSettings } from "../types";

export const INITIAL_CATEGORIES: Category[] = [
  {
    id: "cat-breakfast",
    name: "Breakfast",
    slug: "breakfast",
    description: "Start your morning with high-energy, nutrient-dense plant-based breakfasts designed for easy prepping.",
    type: "recipe"
  },
  {
    id: "cat-lunch",
    name: "Lunch",
    slug: "lunch",
    description: "Portable, fresh, and satisfying vegan luncheons to power you through your workday afternoon.",
    type: "recipe"
  },
  {
    id: "cat-dinner",
    name: "Dinner",
    slug: "dinner",
    description: "Hearty, comforting, and deeply nourishing vegan dinner recipes to wrap up your prep schedule.",
    type: "recipe"
  },
  {
    id: "cat-snacks",
    name: "Snacks",
    slug: "snacks",
    description: "Quick, bite-sized vegan fuel to keep your metabolism active and suppress mid-day sugar crashes.",
    type: "recipe"
  },
  {
    id: "cat-nutrition",
    name: "Nutrition",
    slug: "nutrition",
    description: "Evidence-based guides on vegan macros, micronutrients, vitamin B12, iron intake, and muscle repair.",
    type: "blog"
  },
  {
    id: "cat-prep",
    name: "Meal Prep Advice",
    slug: "meal-prep-advice",
    description: "Master the art of batch cooking, glass-jar storage, vacuum sealing, and weekly meal organization.",
    type: "blog"
  },
  {
    id: "cat-spotlight",
    name: "Ingredient Spotlights",
    slug: "ingredient-spotlights",
    description: "In-depth explorations of plant-based whole foods, their health benefits, and prep techniques.",
    type: "blog"
  }
];

export const INITIAL_RECIPES: Recipe[] = [
  {
    id: "rec-peanut-tofu",
    title: "Peanut Tofu Crispy Quinoa Bowl",
    slug: "peanut-tofu-crispy-quinoa-bowl",
    description: "Crispy direct-seared organic firm tofu glazed in a rich, creamy standard peanut butter reduction, served over nutty tri-color quinoa, roasted broccoli florets, and raw shredded purple cabbage.",
    image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=1200",
    category: "Lunch",
    prepTime: 15,
    cookTime: 20,
    servings: 4,
    difficulty: "Medium",
    calories: 520,
    protein: 26,
    carbs: 48,
    fat: 22,
    ingredients: [
      "1 block (400g) organic extra-firm tofu, drained and pressed",
      "1 cup tri-color quinoa, thoroughly rinsed",
      "2 cups filtered drinking water (for quinoa)",
      "2 cups broccoli florets, freshly cut",
      "1 cup purple cabbage, finely shredded",
      "1/3 cup creamy peanut butter (no added sugar)",
      "2 tbsp low-sodium tamari or soy sauce",
      "1 tbsp pure maple syrup or agave",
      "1 tbsp freshly squeezed lime juice",
      "1 clove garlic, minced",
      "1 tsp grated fresh ginger root",
      "1 tbsp sesame oil for pan searing",
      "1 tbsp toasted sesame seeds and sliced green onions for garnish"
    ],
    instructions: [
      "Prepare Tofu: Slice the pressed extra-firm tofu into 3/4-inch uniform cubes. Pat thoroughly dry with clean kitchen towels.",
      "Cook Quinoa: In a medium saucepan, combine the rinsed quinoa and water. Bring to a rolling boil, reduce heat to low, cover, and simmer for 15 minutes. Remove from heat and let sit covered for 5 minutes, then fluff with a fork.",
      "Roast Broccoli: Preheat the oven or air fryer to 400°F (200°C). Toss broccoli florets with a light spray of olive oil, salt, and pepper. Roast on a parchment-lined baking sheet for 15 minutes until edges are lightly browned.",
      "Whisk Peanut Dressing: In a small glass bowl, vigorous-whisk creamy peanut butter, tamari, maple syrup, fresh lime juice, minced garlic, grated ginger, and 2-3 tablespoons of warm water until a thick, pourable consistency is achieved.",
      "Sear the Tofu: Heat the sesame oil in a heavy-bottomed cast iron skillet over medium-high heat. Add the tofu cubes in a single layer. Let sear undisturbed for 4-5 minutes per side until each side is golden-brown and crispy. Pour in 2 tablespoons of the peanut dressing in the last minute of searing to glaze the cubes.",
      "Assemble Meal Prep Containers: Divide the fluffed quinoa evenly among four 3-cup glass meal prep containers. Arrange the glazed crispy tofu cubes, roasted broccoli, and shredded raw purple cabbage in separate neat piles. Drizzle the remaining peanut dressing evenly over each container. Garnish with toasted sesame seeds and fresh sliced green onions.",
      "Storage Instructions: Seal tightly and maintain in the refrigerator for up to 5 days. Eat cold, or reheat gently in the microwave for 90 seconds (leaving cabbage fresh if preferred)."
    ],
    tags: ["High Protein", "Quinoa", "Tofu", "Peanut-Dressing", "Gluten-Free"],
    rating: 4.8,
    featured: true,
    highProtein: true,
    budget: false,
    faq: [
      {
        question: "Can I substitute the peanut butter with another seed or nut butter?",
        answer: "Yes! Creamy almond butter, cashew butter, or organic sunflower seed butter (for nut-free diets) perform beautifully as 1:1 alternatives in this recipe."
      },
      {
        question: "How do I make sure the tofu stays crispy when meal-prepped?",
        answer: "Pressing the tofu for at least 15 minutes to remove excess moisture is the single most critical step. For maximum crispiness upon reheating, keep the extra dipping sauce separate and reheat the tofu in a toaster oven or air fryer for 4-5 minutes at 350°F."
      }
    ]
  },
  {
    id: "rec-lentil-dal",
    title: "Instant Pot Lentil & Sweet Potato Dal",
    slug: "instant-pot-lentil-sweet-potato-dal",
    description: "A nourishing, budget-friendly red lentil stew infused with turmeric, cumin, and fresh ginger, combined with tender cubed sweet potato and fresh baby spinach.",
    image: "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&q=80&w=1200",
    category: "Dinner",
    prepTime: 10,
    cookTime: 15,
    servings: 6,
    difficulty: "Easy",
    calories: 340,
    protein: 19,
    carbs: 56,
    fat: 4,
    ingredients: [
      "1.5 cups dry red lentils, sorted and thoroughly rinsed",
      "2 large sweet potatoes, peeled and cut into 1/2-inch cubes",
      "1 yellow onion, finely diced",
      "3 cloves garlic, finely minced",
      "1 tbsp fresh ginger root, finely grated",
      "1 can (400ml) crushed fire-roasted tomatoes",
      "4 cups organic low-sodium vegetable broth",
      "1 tsp ground turmeric powder",
      "1 tsp ground cumin or cumin seeds",
      "1 tsp garam masala spices",
      "1/2 tsp sea salt (adjust to taste)",
      "3 cups packed fresh organic baby spinach",
      "A squeeze of fresh lemon juice before serving"
    ],
    instructions: [
      "Sauté Aromatics: Select the 'Sauté' setting on the Instant Pot. Add 1 tbsp of water or olive oil. Add the diced onion, minced garlic, and grated ginger. Sauté for 3-4 minutes until onions are translucent and fragrant.",
      "Add Spices: Stir in turmeric, ground cumin, and garam masala. Toast for 30 seconds to activate the volatile spice oils.",
      "Deglaze & Layer: Pour in 1/2 cup of the vegetable broth and use a wooden spoon to scrape up any browned bits stuck to the bottom of the inner pot. Turn off 'Sauté' mode.",
      "Add Main Ingredients: Add rinsed red lentils, cubed sweet potatoes, crushed fire-roasted tomatoes, and the rest of the vegetable broth. Stir contents thoroughly to combine.",
      "Pressure Cook: Secure the lid of the Instant Pot and turn the steam release valve to 'Sealing'. Select 'Manual' or 'Pressure Cook' on High Pressure for 10 minutes. When done, allow a 10-minute natural pressure release (NPR), then carefully turn the valve to quick release any remaining steam.",
      "Incorporate Greens & Finish: Remove the lid. Stir in the fresh baby spinach and salt. The residual heat will wilt the spinach within 2 minutes. Stir in lemon juice and adjust salt to taste.",
      "Meal Prep Portions: Ladle into meal-prep containers on its own or side-by-side with steamed brown rice or warm whole-wheat flatbread. Keeps excellently for 6 days in the fridge, or can be frozen for up to 3 months."
    ],
    tags: ["High Protein", "Budget-Friendly", "Red Lentils", "Instant-Pot", "One-Pot"],
    rating: 4.9,
    featured: true,
    highProtein: true,
    budget: true,
    faq: [
      {
        question: "Can I cook this on a standard stovetop instead of an Instant Pot?",
        answer: "Absolutely! Bring the mixture to a boil in a large pot, then cover and simmer on medium-low for 25-30 minutes, stirring occasionally, until sweet potatoes are soft and red lentils have broken down into a creamy cream-like consistency."
      },
      {
        question: "Why do red lentils cook so much faster than green or brown lentils?",
        answer: "Red lentils have had their outer skins removed and are split, causing them to absorb liquids and cook into a beautiful soft texture very rapidly, making them superb for quick-prep curries."
      }
    ]
  },
  {
    id: "rec-chickpea-wrap",
    title: "Mediterranean Chickpea & Avocado Salad Wrap",
    slug: "mediterranean-chickpea-avocado-wrap",
    description: "An incredibly fast, zero-cook meal prep favorite features chunky smashed chickpeas, creamy ripe avocados, cucumbers, kalamata olives, and fresh dill wrapped in whole-wheat tortillas.",
    image: "https://images.unsplash.com/photo-1626700051175-6518c4793f4f?auto=format&fit=crop&q=80&w=1200",
    category: "Lunch",
    prepTime: 10,
    cookTime: 0,
    servings: 3,
    difficulty: "Easy",
    calories: 410,
    protein: 14,
    carbs: 49,
    fat: 16,
    ingredients: [
      "1 can (400g) organic chickpeas (garbanzo beans), drained and rinsed",
      "1 large ripe Hass avocado, pitted and peeled",
      "1/2 cup English cucumber, finely diced",
      "1/4 cup kalamata olives, pitted and halved",
      "1/4 cup red onions, finely diced",
      "2 tbsp fresh dill, chopped",
      "1 tbsp Dijon mustard",
      "1 tbsp fresh lemon juice",
      "1/4 tsp sea salt and coarse black pepper",
      "3 large whole-wheat flour tortillas or spinach wraps",
      "1 cup fresh baby arugula or romaine lettuce"
    ],
    instructions: [
      "Mash Chickpeas and Avocado: In a medium glass mixing bowl, combine the drained chickpeas and ripe avocado. Using a potato masher or sturdy fork, crush the ingredients together until mostly mashed but retaining some coarse texture.",
      "Mix Salad Elements: Stir in the diced cucumber, halved kalamata olives, finely diced red onions, and fresh chopped dill.",
      "Season: Add the Dijon mustard, freshly squeezed lemon juice, salt, and black pepper. Stir thoroughly using a spatula until all ingredients are evenly coated.",
      "Assembly Strategy: Lay the whole-wheat tortillas flat on a clean surface. Place a handful of fresh arugula in the center of each wrap. Spoon the smashed chickpea avocado mixture generously over the arugula.",
      "Roll and Cut: Fold the lower flap of the tortilla up, fold both side flaps in, and roll tightly toward the top. Slice diagonally across the center.",
      "Prep For Later: Wrap each finished wrap securely in parchment paper or foil. Secure in a hard-shell meal prep container. Keeping them wrapped prevents structural shifts and keeps the ingredients perfectly intact for up to 2 days."
    ],
    tags: ["Easy", "Budget-Friendly", "No-Cook", "Chickpeas", "Avocado", "Wraps"],
    rating: 4.6,
    featured: false,
    highProtein: false,
    budget: true,
    faq: [
      {
        question: "Will the avocado oxidize and turn brown when prepped?",
        answer: "The fresh lemon juice in this recipe contains natural citric acid which slows down oxidation. When wrapped tightly and stored airtight, the avocado maintains its vivid green color for 24-36 hours. If prepping 3 days ahead, mash only the chickpeas with mustard and lemon, and add sliced fresh avocado right before eating."
      }
    ]
  },
  {
    id: "rec-sesame-tempeh",
    title: "Stir-Fried Sesame Broccoli & Tempeh",
    slug: "stir-fried-sesame-broccoli-tempeh",
    description: "Fiber-rich, nutty artisanal tempeh pan-fried with garlic, soy sauce, and sesame seeds, tossed with a generous portion of crisp-tender snap peas and steamed broccoli over fibrous brown rice.",
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=1200",
    category: "Dinner",
    prepTime: 15,
    cookTime: 12,
    servings: 4,
    difficulty: "Medium",
    calories: 480,
    protein: 28,
    carbs: 52,
    fat: 15,
    ingredients: [
      "2 blocks (200g each) organic soy tempeh, sliced into thin strips",
      "3 cups broccoli florets",
      "1 cup sugar snap peas, trimmed",
      "2 tbsp low-sodium soy sauce or liquid aminos",
      "1 tbsp pure maple syrup",
      "1 tbsp toasted sesame oil",
      "2 cloves garlic, finely grated",
      "1 tsp grated fresh ginger root",
      "1 tbsp cornstarch dissolved in 2 tbsp cold water",
      "4 cups cooked organic long-grain brown rice",
      "2 tbsp black and white sesame seeds"
    ],
    instructions: [
      "Steam or Boil Tempeh first (Highly Recommended): Place the tempeh strips in a steaming basket over boiling water for 10 minutes. This expands the tempeh pores and removes its characteristic subtle bitter soy flavor, making it ready to absorb the marinade fully.",
      "Marinate: Whisk soy sauce, maple syrup, toasted sesame oil, grated garlic, and grated ginger. Toss the steamed tempeh strips in this marinade and let rest for 10 minutes.",
      "Steam Broccoli: Lightly steam the broccoli florets and snap peas for 3 minutes until bright green but still highly crisp. Plunge in cold ice water to stop the cooking process, then drain.",
      "Sauté: Heat a wide wok or non-stick skillet over medium-high heat. Slid the tempeh along with its marinade into the hot wok. Cook for 5-6 minutes until strips are lightly browned on both sides.",
      "Thicken to Glaze: Pour in the cornstarch-water mixture. Stir rapidly for 1 minute until the sauce bubbles and turns into a shiny glaze. Toss in the steamed broccoli and snap peas to coat fully.",
      "Container Setup: Split the cooked brown rice across four glass lunchboxes. Top with the glazed sesame tempeh, broccoli and snap peas. Sprinkle generously with toasted sesame seeds.",
      "Storage & Serving: Keep refrigerated for up to 5 days. Reheat in a dry skillet or microwave for a steaming, protein-dense stir-fry meal."
    ],
    tags: ["High Protein", "Tempeh", "Broccoli", "Stir-Fry", "Soy-Glaze"],
    rating: 4.7,
    featured: true,
    highProtein: true,
    budget: false,
    faq: [
      {
        question: "What is tempeh made of and is it healthy?",
        answer: "Tempeh is a traditional Indonesian food made from whole soybeans that are fermented, bound into a firm cake-like structure. It is less processed than tofu and contains significantly higher protein (about 20g per 100g) and fiber, making it superb for gut health."
      }
    ]
  },
  {
    id: "rec-coconut-chickpea",
    title: "Creamy Coconut Chickpea Curry",
    slug: "creamy-coconut-chickpea-curry",
    description: "An incredibly creamy, pocket-friendly one-pot curry utilizing basic pantry staples like canned chickpeas, premium coconut milk, diced carrots, and chopped curly kale.",
    image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&q=80&w=1200",
    category: "Dinner",
    prepTime: 10,
    cookTime: 20,
    servings: 5,
    difficulty: "Easy",
    calories: 380,
    protein: 15,
    carbs: 45,
    fat: 14,
    ingredients: [
      "2 cans (400g each) chickpeas, drained and rinsed",
      "1 can (400ml) light or premium coconut milk",
      "1 cup vegetable stock",
      "1 yellow onion, chopped",
      "3 medium carrots, sliced into thin rounds",
      "2 cups curly kale, hard stems removed and leaves chopped",
      "1.5 tbsp yellow curry powder",
      "2 cloves garlic, minced",
      "1 tbsp coconut oil or cooking water",
      "Salt and red chili flakes to taste"
    ],
    instructions: [
      "Base Sauté: Heat coconut oil in a deep skillet over medium heat. Sauté the chopped yellow onion and minced garlic for 3 minutes until soft.",
      "Cook Vegetables & Activate Spices: Add the carrot rounds. Stir in yellow curry powder and a pinch of salt, tossing to coat the vegetables in dry spices for 1 minute.",
      "Simmer Liquids & Chickpeas: Pour in the rinsed chickpeas, coconut milk, and vegetable stock. Bring to a low boil, then reduce heat to low, cover, and let simmer for 12-15 minutes until carrots are completely tender.",
      "Add Kale: Uncover, stir in the chopped kale leaves, and simmer for 3 minutes until the greens are wilted.",
      "Divide: Portion into meal prep bowls. Excellent on its own or over brown rice or roasted potatoes. Stays fresh in the fridge for up to 6 days."
    ],
    tags: ["Budget-Friendly", "One-Pot", "Chickpeas", "Coconut", "Kale", "Curry"],
    rating: 4.9,
    featured: true,
    highProtein: false,
    budget: true,
    faq: [
      {
        question: "Can I use light coconut milk instead of full-fat?",
        answer: "Yes, light coconut milk works well and significantly reduces fat/calories, though full-fat coconut milk creates a richer, more luxurious restaurant-grade curry sauce."
      }
    ]
  },
  {
    id: "rec-berry-oats",
    title: "Overnight Berry Quinoa Chia Oats",
    slug: "overnight-berry-quinoa-chia-oats",
    description: "An easy grab-and-go morning glass jar prep layered with rolled oats, hydrated chia seeds, high-protein quinoa flakes, vanilla soy milk, and sweet local wild berries.",
    image: "https://images.unsplash.com/photo-1517881917430-e70dfb3610aa?auto=format&fit=crop&q=80&w=1200",
    category: "Breakfast",
    prepTime: 5,
    cookTime: 0,
    servings: 4,
    difficulty: "Easy",
    calories: 290,
    protein: 12,
    carbs: 42,
    fat: 7,
    ingredients: [
      "2 cups old-fashioned rolled oats (labeled gluten-free if needed)",
      "1/2 cup quinoa flakes (adds protein and texture)",
      "4 tbsp organic black chia seeds",
      "2.5 cups organic vanilla soy milk or pea milk (for high protein)",
      "1 cup frozen mixed berries (strawberries, blueberries, raspberries)",
      "2 tbsp pure maple syrup (optional)",
      "4 tbsp sliced raw almonds for topping"
    ],
    instructions: [
      "Combine Dry Base: In a large pitcher or bowl, mix together the rolled oats, quinoa flakes, and black chia seeds.",
      "Add Liquids: Pour in the vanilla soy milk and maple syrup. Stir vigorously with a spatula for 1 minute to ensure chia seeds don't clump at the bottom.",
      "Rest Briefly: Let sit on the counter for 5 minutes, then stir once more.",
      "Layer in Jars: Take four 12 oz glass Mason jars. Drop a tablespoon of frozen berries at the bottom of each jar. Spoon the wet oat-chia mixture evenly across the jars. Layer the remaining berries in the middle and top.",
      "Chill to Set: Seal the jar lids tightly. Place in the refrigerator overnight (or for at least 4 hours) to allow the oats and chia seeds to absorb the fluid and expand.",
      "Serve: Grab from the fridge in the morning, unscrew, throw sliced raw almonds on top for a delightful crunch, and enjoy with a spoon. Remains fresh for 5 days."
    ],
    tags: ["Easy", "No-Cook", "Oats", "Chia", "Breakfast-Prep", "Berries"],
    rating: 4.8,
    featured: true,
    highProtein: false,
    budget: true,
    faq: [
      {
        question: "Do the berries get mushy when kept for 5 days in a jar?",
        answer: "Frozen berries will thaw inside the oats, bleeding their natural sweet juices which flavor the oats beautifully. They stay nutritious and delicious, not unpleasantly mushy. If using fresh berries, you can optionally store them separate and toss them in daily."
      }
    ]
  }
];

export const INITIAL_MEAL_PLANS: MealPlan[] = [
  {
    id: "plan-high-protein",
    title: "High-Protein Strength Building Prep",
    slug: "high-protein-strength-building-prep",
    description: "A comprehensive weekly meal prep schedule designed specifically for active vegans, bodybuilders, or anyone looking to maximize protein intake. Averaging 100g+ protein daily from clean plant sources—tofu, tempeh, lentils, chia, and soy.",
    image: "https://images.unsplash.com/photo-1543362906-acfc16c67564?auto=format&fit=crop&q=80&w=1200",
    durationWeeks: 1,
    schedule: {
      Monday: {
        breakfast: "Overnight Berry Quinoa Chia Oats",
        lunch: "Peanut Tofu Crispy Quinoa Bowl",
        dinner: "Stir-Fried Sesame Broccoli & Tempeh",
        snack: "Roasted salted chickpeas with mixed nuts"
      },
      Tuesday: {
        breakfast: "High protein tofu scramble with greens",
        lunch: "Peanut Tofu Crispy Quinoa Bowl",
        dinner: "Instant Pot Lentil & Sweet Potato Dal",
        snack: "Scoop of plant protein powder in soy milk"
      },
      Wednesday: {
        breakfast: "Overnight Berry Quinoa Chia Oats",
        lunch: "Leftover Stir-Fried Sesame Tempeh",
        dinner: "Instant Pot Lentil & Sweet Potato Dal",
        snack: "Roasted salted chickpeas with mixed nuts"
      },
      Thursday: {
        breakfast: "High protein tofu scramble with greens",
        lunch: "Peanut Tofu Crispy Quinoa Bowl",
        dinner: "Stir-Fried Sesame Broccoli & Tempeh",
        snack: "Scoop of plant protein powder in soy milk"
      },
      Friday: {
        breakfast: "Overnight Berry Quinoa Chia Oats",
        lunch: "Peanut Tofu Crispy Quinoa Bowl",
        dinner: "Instant Pot Lentil & Sweet Potato Dal",
        snack: "Roasted salted chickpeas with mixed nuts"
      },
      Saturday: {
        breakfast: "Protein pancakes with peanut butter",
        lunch: "High protein tofu scramble with wraps",
        dinner: "Double-protein lentil curry with tempeh crumbles",
        snack: "Pumpkin seeds and almond milk shake"
      },
      Sunday: {
        breakfast: "Protein pancakes with almond butter",
        lunch: "Leftover double-protein lentil curry",
        dinner: "Clean-out-the-fridge roasted tofu medley",
        snack: "Mixed sunflower seeds and energy ball"
      }
    },
    shoppingList: [
      "Organic firm tofu (5 blocks)",
      "Organic soy tempeh (4 blocks)",
      "Dry red lentils (2 bags, 500g each)",
      "Old-fashioned rolled oats (1 bag)",
      "Quinoa flakes or quinoa grain (1 bag)",
      "Organic chia seeds (1 bag)",
      "Organic vanilla soy milk (3 cartons)",
      "Creamy peanut butter (1 jar)",
      "Low-sodium tamari or soy sauce",
      "Fresh organic broccoli (3 large heads)",
      "Purple cabbage (1 head)",
      "English cucumbers (2)",
      "Bagged baby arugula or spinach (3 large packs)",
      "Frozen mixed organic berries (2 large bags)",
      "Raw almonds and roasted chickpeas"
    ],
    featured: true
  },
  {
    id: "plan-budget-friendly",
    title: "100% Whole Foods Budget Meal Plan",
    slug: "100-whole-foods-budget-meal-plan",
    description: "Prepare dynamic, satisfying vegan meals for under $4 a day. This menu prioritizes bulk pulses, grains, root vegetables, and frozen items to prove eating high-quality clean vegan food doesn't have to strain your wallet.",
    image: "https://images.unsplash.com/photo-1506084868230-bb9d95c24759?auto=format&fit=crop&q=80&w=1200",
    durationWeeks: 1,
    schedule: {
      Monday: {
        breakfast: "Overnight Berry Quinoa Chia Oats",
        lunch: "Mediterranean Chickpea & Avocado Salad Wrap",
        dinner: "Creamy Coconut Chickpea Curry",
        snack: "Banana with peanut butter spread"
      },
      Tuesday: {
        breakfast: "Hot oatmeal with diced apple and cinnamon",
        lunch: "Mediterranean Chickpea & Avocado Salad Wrap",
        dinner: "Instant Pot Lentil & Sweet Potato Dal",
        snack: "Carrot sticks with store brand hummus"
      },
      Wednesday: {
        breakfast: "Overnight Berry Quinoa Chia Oats",
        lunch: "Leftover Creamy Coconut Chickpea Curry",
        dinner: "Instant Pot Lentil & Sweet Potato Dal",
        snack: "Banana with peanut butter spread"
      },
      Thursday: {
        breakfast: "Hot oatmeal with frozen berries",
        lunch: "Mediterranean Chickpea & Avocado Salad Wrap",
        dinner: "Creamy Coconut Chickpea Curry",
        snack: "Carrot sticks with hummus"
      },
      Friday: {
        breakfast: "Overnight Berry Quinoa Chia Oats",
        lunch: "Leftover Instant Pot Lentil Dal",
        dinner: "Creamy Coconut Chickpea Curry",
        snack: "Banana with peanut butter spread"
      },
      Saturday: {
        breakfast: "Crispy breakfast potatoes with black beans",
        lunch: "Loaded chickpea salad wraps",
        dinner: "Budget friendly red lentil chili with homemade croutons",
        snack: "Apple slices with cinnamon"
      },
      Sunday: {
        breakfast: "Crispy breakfast potatoes with left beans",
        lunch: "Leftover budget red lentil chili",
        dinner: "Simple vegetable fried rice with peas and carrots",
        snack: "Roasted pumpkin seeds"
      }
    },
    shoppingList: [
      "Bulk red lentils (1kg)",
      "Organic chickpeas (4 cans or dry bulk equivalent)",
      "Store-brand rolled oats (1 large tub)",
      "Long-grain brown rice (1 large bag)",
      "Premium canned coconut milk (2 cans)",
      "Canned fire-roasted crushed tomatoes (2 cans)",
      "Medium carrots (1 bag, 1kg)",
      "Sweet potatoes (4 large)",
      "Yellow onions (1 mesh bag)",
      "Garlic bulbs (2)",
      "Kale or Spinach (2 large bunches)",
      "Ripe Hass avocados (3, buy semi-firm)",
      "Whole-wheat tortillas or flatbreads (1 pack, 8 wraps)",
      "Store-brand creamy peanut butter",
      "Bananas (1 bunch) and cheap apples (5)",
      "English cucumbers (2)"
    ],
    featured: true
  }
];

export const INITIAL_ARTICLES: Article[] = [
  {
    id: "art-b12-guide",
    title: "The Ultimate Guide to Plant-Based Vitamin B12: Do You Really Need Supplements?",
    slug: "vitamin-b12-supplement-guide",
    excerpt: "Vitamin B12 is the single non-negotiable micronutrient in a plant-based diet. Read our comprehensive, science-backed exploration of why we need it, symptoms of deficiency, and optimal dosing.",
    content: "Vitamin B12 is essential for red blood cell formation, neurological function, and DNA synthesis. In nature, B12 is synthesized by soil bacteria rather than plants or animals. Since human sanitation rules shield us from ingesting bacteria-rich soil, vegan diets must obtain B12 through either fortified foods or clean supplementation.\n\n### Why Vitamin B12 matters\nSupplements are the safest and most convenient way to hit your health metrics. Symptoms of a deficiency take years to appear, but can lead to irreversible neurological damage if neglected. We recommend 250mcg of Cyanocobalamin daily or a weekly dose of 2500mcg.",
    image: "https://images.unsplash.com/photo-1511690656952-34342bb7c2f2?auto=format&fit=crop&q=80&w=1200",
    category: "Nutrition",
    author: "Dr. Sarah Jenkins, RD",
    date: "June 2, 2026",
    readTime: "6 min read",
    tags: ["Vitamin-B12", "Supplementation", "Nutrition", "Health-Advice"]
  },
  {
    id: "art-batch-cook",
    title: "How to Batch Cook Tofu & Tempeh: Tips to Lock in Flavor and Firm Texture",
    slug: "how-to-batch-cook-tofu-tempeh",
    excerpt: "The major complaint with meal-prepped soy is that it turns dry, spongy or boring. Learn the advanced kitchen steps including freezing, cornstarch coating, and dry-searing keys.",
    content: "Prepping soy successfully is all about extracting excess moisture and creating paths for sauce absorption. \n\n### Step 1: The Freeze-and-Thaw Method\nFreezing tofu in its original packaging rearranges its water molecules, creating a hollow sponge-like texture that acts like a magnet for marinades.\n\n### Step 2: The Cornstarch Secret\nTossing your tofu cubes in a small bowl with cornstarch and seasonings before pan-frying or baking ensures a highly satisfying crispy coat that holds up in airtight storage containers for days.",
    image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=1200",
    category: "Meal Prep Advice",
    author: "Chef Liam Vance",
    date: "May 28, 2026",
    readTime: "8 min read",
    tags: ["Tofu", "Tempeh", "Pro-Tips", "Flavor", "Crispiness"]
  },
  {
    id: "art-lentils-spotlight",
    title: "Ingredient Spotlight: Why Lentils Are a Vegan Athlete's Best Friend",
    slug: "ingredient-spotlight-lentils-athlete-nutrition",
    excerpt: "Cheap, loaded with protein and dietary fiber, and cooking instantly without pre-soaking, lentils are the crown jewels of plant protein meal prep. Compare red, brown, and green lentils.",
    content: "Lentils are an outstanding nutritional powerhouse. With 18 grams of protein per cooked cup, they are packed with iron, folate, and highly prebiotic soluble fiber which stabilizes blood glucose levels.\n\n### Red vs. Green vs. Beluga Lentils\n1. **Red Lentils**: Split and skór, red lentils dissolve into a beautiful sauce, making them ideal for soups and dals.\n2. **French Green Lentils**: Maintain a firm, nutty bite, making them a perfect base for high-integrity cold salads.\n3. **Black Beluga Lentils**: Highly rich in anthocyanins, mimicking the antioxidant health benefits of blue-berries.",
    image: "https://images.unsplash.com/photo-1515003848606-ca05cf97bbd9?auto=format&fit=crop&q=80&w=1200",
    category: "Ingredient Spotlights",
    author: "Elena Rostova",
    date: "April 15, 2026",
    readTime: "5 min read",
    tags: ["Lentils", "Fiber", "Protein-Sources", "Bulk-Prep"]
  }
];

export const INITIAL_SUBSCRIBERS: Subscriber[] = [
  { id: "sub-1", email: "carol.reader@example.com", enrolledAt: "2026-05-10T12:00:00Z", active: true },
  { id: "sub-2", email: "marcus.plant@example.com", enrolledAt: "2026-05-20T14:30:00Z", active: true },
  { id: "sub-3", email: "jenny.g@example.com", enrolledAt: "2026-06-01T09:15:00Z", active: true }
];

export const INITIAL_SETTINGS: SiteSettings = {
  siteName: "SmartVeganPrep",
  tagline: "Healthy plant-based meals, made simple and affordable.",
  contactEmail: "hello@smartveganprep.com",
  newsletterHeadline: "Weekly Plant-Based Meal Prep Made Easy",
  newsletterDescription: "Join 12,000+ subscriber members receiving science-backed recipes, customized shopping lists, and expert meal prepping strategies directly in their inbox every Sunday morning.",
  seoTitle: "SmartVeganPrep - Practical Plant-Based Prep, Recipes & Plans",
  seoDescription: "Discover realistic high-protein and budget-friendly vegan recipes, complete weekly meal schedules, automated grocery lists, and science-backed nutrition articles to master plant-based nutrition."
};
