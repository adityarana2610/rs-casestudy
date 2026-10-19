/**
 * RS Case Study Interactive Demo Application
 * Faithful reproduction & visualization of Oprea et al. (IEEE Access, 2026)
 * Includes Custom Search Engine + Benchmark 12-Config Matrix & Evaluation Labs
 */

document.addEventListener('DOMContentLoaded', () => {
  // -------------------------------------------------------------
  // 1. TEXT CLEANING PIPELINE (Matches clean_text from rs_case_study.py)
  // -------------------------------------------------------------
  const STOP_WORDS = new Set([
    "i", "me", "my", "myself", "we", "our", "ours", "ourselves", "you", "your", "yours", "yourself",
    "yourselves", "he", "him", "his", "himself", "she", "her", "hers", "herself", "it", "its", "itself",
    "they", "them", "their", "theirs", "themselves", "what", "which", "who", "whom", "this", "that",
    "these", "those", "am", "is", "are", "was", "were", "be", "been", "being", "have", "has", "had",
    "having", "do", "does", "did", "doing", "a", "an", "the", "and", "but", "if", "or", "because",
    "as", "until", "while", "of", "at", "by", "for", "with", "about", "against", "between", "into",
    "through", "during", "before", "after", "above", "below", "to", "from", "up", "down", "in", "out",
    "on", "off", "over", "under", "again", "further", "then", "once", "here", "there", "when", "where",
    "why", "how", "all", "any", "both", "each", "few", "more", "most", "other", "some", "such", "no",
    "nor", "not", "only", "own", "same", "so", "than", "too", "very", "s", "t", "can", "will", "just",
    "don", "should", "now"
  ]);

  function lemmatizeWord(w) {
    if (w.endsWith("ies") && w.length > 4) return w.slice(0, -3) + "y";
    if (w.endsWith("es") && w.length > 4) return w.slice(0, -2);
    if (w.endsWith("s") && !w.endsWith("ss") && w.length > 3) return w.slice(0, -1);
    if (w.endsWith("ing") && w.length > 5) return w.slice(0, -3);
    if (w.endsWith("ed") && w.length > 4) return w.slice(0, -2);
    return w;
  }

  function cleanText(text) {
    if (!text || typeof text !== 'string') return [];
    const tokens = text.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').split(/\s+/).filter(Boolean);
    return tokens.filter(t => !STOP_WORDS.has(t)).map(lemmatizeWord);
  }

  // -------------------------------------------------------------
  // 2. BROAD AMAZON CATALOG DATABASE (For Custom Search & Presets)
  // -------------------------------------------------------------
  const CATALOG_DATABASE = [
    // Puzzles
    { id: 'puz-1', name: 'Ravensburger 14796 Tropical Traffic Jigsaw Puzzle (500 Piece)', subcat: 'Toys & Games | Puzzles', tokens: ['ravensburger', 'tropical', 'traffic', 'jigsaw', 'puzzle', '500', 'piece'], tags: ['puzzle', '500', 'game', 'jigsaw', 'woodstock', 'collage'] },
    { id: 'puz-2', name: 'British Pier 275 Piece Jigsaw Puzzle for Adults', subcat: 'Toys & Games | Puzzles', tokens: ['british', 'pier', '275', 'piece', 'jigsaw', 'puzzle', 'adult'], tags: ['puzzle', 'jigsaw', 'piece', 'collage'] },
    { id: 'puz-3', name: 'Avanti - Kitten Bouquet Puzzle - 300 Pieces', subcat: 'Toys & Games | Puzzles', tokens: ['avanti', 'kitten', 'bouquet', 'puzzle', '300', 'piece'], tags: ['puzzle', 'kitten', 'piece', 'jigsaw'] },
    { id: 'puz-4', name: 'EuroGraphics Volkswagen Groovy Bus Collage Puzzle (2000 Piece)', subcat: 'Toys & Games | Puzzles', tokens: ['eurographics', 'volkswagen', 'groovy', 'bus', 'collage', 'puzzle', '2000', 'piece'], tags: ['puzzle', 'collage', 'volkswagen', 'bus', 'woodstock'] },
    { id: 'puz-5', name: 'The Daredevil by Bob Byerley Puzzle, 300-Piece Jigsaw', subcat: 'Toys & Games | Puzzles', tokens: ['daredevil', 'bob', 'byerley', 'puzzle', '300', 'piece', 'jigsaw'], tags: ['puzzle', 'jigsaw', 'piece'] },
    
    // Skateboards & Longboards
    { id: 'skate-1', name: 'Rayne Longboards Demonseed Longboard Complete Drop-Through', subcat: 'Sports & Outdoors | Outdoor Recreation', tokens: ['rayne', 'longboard', 'demonseed', 'complete', 'drop', 'through'], tags: ['longboard', 'skateboard', 'bamboo', 'coreflex', 'deck', 'skate'] },
    { id: 'skate-2', name: 'Retrospec Rift Drop-Through Longboard Skateboard Complete', subcat: 'Sports & Outdoors | Outdoor Recreation', tokens: ['retrospec', 'rift', 'drop', 'through', 'longboard', 'skateboard', 'complete'], tags: ['longboard', 'skateboard', 'skate', 'outdoor', 'complete'] },
    { id: 'skate-3', name: 'Atom Kicktail Longboard 39 Inch Classic Cruiser', subcat: 'Sports & Outdoors | Outdoor Recreation', tokens: ['atom', 'kicktail', 'longboard', '39', 'inch', 'classic', 'cruiser'], tags: ['longboard', 'cruiser', 'skate', 'kicktail'] },
    { id: 'skate-4', name: 'Moose Bamboo Kicktail/Kryptonics Longboard Complete', subcat: 'Sports & Outdoors | Outdoor Recreation', tokens: ['moose', 'bamboo', 'kicktail', 'kryptonics', 'longboard', 'complete'], tags: ['longboard', 'bamboo', 'cruiser', 'deck'] },
    { id: 'skate-5', name: 'DB Longboards Contra Drop Deck Maple Longboard Complete', subcat: 'Sports & Outdoors | Outdoor Recreation', tokens: ['db', 'longboard', 'contra', 'drop', 'deck', 'maple', 'complete'], tags: ['longboard', 'db', 'maple', 'crossbow'] },
    
    // Costumes
    { id: 'cost-1', name: "Rubies Monster High Clawdeen Wolf Child Costume Wig", subcat: 'Clothing, Shoes & Jewelry | Costumes & Accessories', tokens: ['rubies', 'monster', 'high', 'clawdeen', 'wolf', 'child', 'costume', 'wig'], tags: ['costume', 'monster', 'high', 'clawdeen', 'wolf', 'wig', 'dress', 'halloween'] },
    { id: 'cost-2', name: 'Monster High Deluxe Clawdeen Wolf Costume - Small Dress', subcat: 'Clothing, Shoes & Jewelry | Costumes & Accessories', tokens: ['monster', 'high', 'deluxe', 'clawdeen', 'wolf', 'costume', 'small', 'dress'], tags: ['costume', 'monster', 'high', 'clawdeen', 'wolf', 'dress', 'rubie'] },
    { id: 'cost-3', name: "Ever After High Blondie Lockes Costume, Child's Small", subcat: 'Clothing, Shoes & Jewelry | Costumes & Accessories', tokens: ['ever', 'high', 'blondie', 'lockes', 'costume', 'child', 'small'], tags: ['costume', 'high', 'dress', 'outfit'] },
    { id: 'cost-4', name: "Rubie's Monster High Haunted Spectra Vondergeist Child Costume", subcat: 'Clothing, Shoes & Jewelry | Costumes & Accessories', tokens: ['rubie', 'monster', 'high', 'haunted', 'spectra', 'vondergeist', 'child', 'costume'], tags: ['costume', 'monster', 'high', 'rubie', 'dress'] },

    // Headphones & Audio
    { id: 'audio-1', name: 'Audio-Technica ATH-M50x Professional Studio Monitor Headphones', subcat: 'Electronics | Audio & Video Accessories', tokens: ['audio', 'technica', 'ath', 'm50x', 'professional', 'studio', 'monitor', 'headphone'], tags: ['headphone', 'audio', 'studio', 'monitor', 'sony', 'sound', 'over-ear'] },
    { id: 'audio-2', name: 'Sennheiser HD 280 Pro Professional Studio Monitor Headphone', subcat: 'Electronics | Audio & Video Accessories', tokens: ['sennheiser', 'hd', '280', 'pro', 'professional', 'studio', 'monitor', 'headphone'], tags: ['headphone', 'studio', 'audio', 'sound', 'pro', 'ear'] },
    { id: 'audio-3', name: 'Beyerdynamic DT 770 PRO 80 Ohm Studio Headphone', subcat: 'Electronics | Audio & Video Accessories', tokens: ['beyerdynamic', 'dt', '770', 'pro', '80', 'ohm', 'studio', 'headphone'], tags: ['headphone', 'studio', 'audio', 'over-ear', 'pro'] },
    { id: 'audio-4', name: 'Sony WH-1000XM5 Wireless Noise Canceling Headphones Bluetooth', subcat: 'Electronics | Audio & Video Accessories', tokens: ['sony', 'wh', '1000xm5', 'wireless', 'noise', 'canceling', 'headphone', 'bluetooth'], tags: ['headphone', 'wireless', 'sony', 'anc', 'noise', 'bluetooth', 'earbuds'] },
    { id: 'audio-5', name: 'Apple AirPods Pro Wireless Noise Cancelling Earbuds with MagSafe', subcat: 'Electronics | Audio & Video Accessories', tokens: ['apple', 'airpods', 'pro', 'wireless', 'noise', 'cancelling', 'earbuds', 'magsafe'], tags: ['earbuds', 'wireless', 'bluetooth', 'headphone', 'audio', 'cancelling'] },

    // Keyboards & Gaming
    { id: 'kb-1', name: 'Keychron K2 Wireless Bluetooth Mechanical Gaming Keyboard RGB', subcat: 'Electronics | Computers & Accessories', tokens: ['keychron', 'k2', 'wireless', 'bluetooth', 'mechanical', 'gaming', 'keyboard', 'rgb'], tags: ['keyboard', 'mechanical', 'gaming', 'rgb', 'switch', 'tactile', 'wireless', 'keychron'] },
    { id: 'kb-2', name: 'SteelSeries Apex Pro TKL Mechanical Gaming Keyboard OLED Display', subcat: 'Electronics | Computers & Accessories', tokens: ['steelseries', 'apex', 'pro', 'tkl', 'mechanical', 'gaming', 'keyboard', 'oled', 'display'], tags: ['keyboard', 'gaming', 'mechanical', 'rgb', 'switch', 'key'] },
    { id: 'kb-3', name: 'Logitech G PRO X Mechanical Gaming Keyboard Swappable Switches', subcat: 'Electronics | Computers & Accessories', tokens: ['logitech', 'g', 'pro', 'x', 'mechanical', 'gaming', 'keyboard', 'swappable', 'switch'], tags: ['keyboard', 'mechanical', 'logitech', 'switch', 'gaming'] },
    { id: 'kb-4', name: 'Razer BlackWidow V3 Pro Mechanical Wireless Gaming Keyboard', subcat: 'Electronics | Computers & Accessories', tokens: ['razer', 'blackwidow', 'v3', 'pro', 'mechanical', 'wireless', 'gaming', 'keyboard'], tags: ['keyboard', 'razer', 'mechanical', 'rgb', 'gaming', 'wireless'] },

    // Drinkware & Bottles
    { id: 'bot-1', name: 'Hydro Flask Standard Mouth Flex Cap Insulated Stainless Steel Bottle 24oz', subcat: 'Sports & Outdoors | Camping & Hiking', tokens: ['hydro', 'flask', 'standard', 'mouth', 'flex', 'cap', 'insulated', 'stainless', 'steel', 'bottle', '24oz'], tags: ['bottle', 'water', 'stainless', 'steel', 'flask', 'insulated', 'vacuum'] },
    { id: 'bot-2', name: 'Yeti Rambler 36 oz Vacuum Insulated Stainless Steel Bottle with Chug Cap', subcat: 'Sports & Outdoors | Camping & Hiking', tokens: ['yeti', 'rambler', '36', 'oz', 'vacuum', 'insulated', 'stainless', 'steel', 'bottle', 'chug', 'cap'], tags: ['bottle', 'water', 'yeti', 'insulated', 'steel', 'flask', 'vacuum'] },
    { id: 'bot-3', name: 'CamelBak Chute Mag Water Bottle with Tritan Plastic 32oz', subcat: 'Sports & Outdoors | Camping & Hiking', tokens: ['camelbak', 'chute', 'mag', 'water', 'bottle', 'tritan', 'plastic', '32oz'], tags: ['bottle', 'water', 'drink', 'fitness'] },

    // Tea & Coffee
    { id: 'tea-1', name: 'Ippodo Tea Japanese Uji Organic Ceremonial Matcha Green Tea Powder 40g', subcat: 'Grocery & Gourmet Food | Coffee, Tea & Cocoa', tokens: ['ippodo', 'tea', 'japanese', 'uji', 'organic', 'ceremonial', 'matcha', 'green', 'tea', 'powder', '40g'], tags: ['tea', 'matcha', 'green', 'organic', 'japanese', 'ceremonial', 'powder'] },
    { id: 'tea-2', name: 'Encha Ceremonial Grade First Harvest Pure Organic Matcha Green Tea', subcat: 'Grocery & Gourmet Food | Coffee, Tea & Cocoa', tokens: ['encha', 'ceremonial', 'grade', 'first', 'harvest', 'pure', 'organic', 'matcha', 'green', 'tea'], tags: ['tea', 'matcha', 'green', 'organic', 'powder'] },
    { id: 'tea-3', name: 'Breville Barista Express Espresso Machine Stainless Steel BES870XL', subcat: 'Home & Kitchen | Kitchen & Dining', tokens: ['breville', 'barista', 'express', 'espresso', 'machine', 'stainless', 'steel', 'bes870xl'], tags: ['coffee', 'espresso', 'machine', 'breville', 'barista', 'brew'] },

    // Yoga & Fitness
    { id: 'yoga-1', name: 'Manduka PRO Yoga Mat Extra Thick High Density Cushion for Exercise', subcat: 'Sports & Outdoors | Exercise & Fitness', tokens: ['manduka', 'pro', 'yoga', 'mat', 'extra', 'thick', 'high', 'density', 'cushion', 'exercise'], tags: ['yoga', 'mat', 'exercise', 'fitness', 'non-slip', 'thick', 'strap'] },
    { id: 'yoga-2', name: 'Liforme Original Premium Yoga Mat Non-Slip Grip with Alignment System', subcat: 'Sports & Outdoors | Exercise & Fitness', tokens: ['liforme', 'original', 'premium', 'yoga', 'mat', 'non', 'slip', 'grip', 'alignment', 'system'], tags: ['yoga', 'mat', 'grip', 'non-slip', 'exercise', 'fitness'] },
    { id: 'yoga-3', name: 'BalanceFrom All Purpose 1/2-Inch Extra Thick High Density Yoga Mat with Strap', subcat: 'Sports & Outdoors | Exercise & Fitness', tokens: ['balancefrom', 'all', 'purpose', '1', '2', 'inch', 'extra', 'thick', 'high', 'density', 'yoga', 'mat', 'strap'], tags: ['yoga', 'mat', 'thick', 'strap', 'exercise', 'fitness'] },

    // LEGO & Toys
    { id: 'lego-1', name: 'LEGO Star Wars Millennium Falcon 75257 Starship Building Kit', subcat: 'Toys & Games | Building Toys', tokens: ['lego', 'star', 'war', 'millennium', 'falcon', '75257', 'starship', 'building', 'kit'], tags: ['lego', 'star', 'wars', 'falcon', 'starship', 'building', 'kit', 'toy'] },
    { id: 'lego-2', name: 'LEGO Star Wars X-Wing Fighter 75301 Classic Building Toy Set', subcat: 'Toys & Games | Building Toys', tokens: ['lego', 'star', 'war', 'x', 'wing', 'fighter', '75301', 'classic', 'building', 'toy', 'set'], tags: ['lego', 'star', 'wars', 'fighter', 'building', 'kit', 'toy'] },
    { id: 'lego-3', name: 'LEGO Creator Expert NASA Apollo 11 Lunar Lander 10266 Building Model', subcat: 'Toys & Games | Building Toys', tokens: ['lego', 'creator', 'expert', 'nasa', 'apollo', '11', 'lunar', 'lander', '10266', 'building', 'model'], tags: ['lego', 'nasa', 'building', 'kit', 'creator'] }
  ];

  // Benchmark Seeds (Case Studies from paper)
  const BENCHMARK_SEEDS = {
    puzzle: {
      id: 'puzzle',
      rowId: 4,
      name: 'Woodstock- Collage 500 pc Puzzle',
      subcat: 'Toys & Games | Puzzles',
      tokens: ['woodstock', 'collage', '500', 'pc', 'puzzle'],
      vectorProfiles: {
        w2v: [0.38, 0.62, 0.15, -0.42, 0.77, 0.23, -0.19, 0.81, 0.44, -0.31, 0.56, 0.68, -0.12, 0.29, 0.74, 0.51],
        fused: [0.45, 0.71, 0.28, -0.35, 0.84, 0.39, -0.08, 0.89, 0.53, -0.22, 0.65, 0.77, -0.05, 0.41, 0.82, 0.63],
        tfidf: [0, 0, 0.82, 0, 0, 0.55, 0, 0, 0.18, 0, 0, 0, 0, 0, 0, 0],
        count: [0, 0, 1.0, 0, 0, 1.0, 0, 0, 1.0, 0, 0, 0, 0, 0, 0, 0],
        glove: [0.22, 0.41, 0.08, -0.33, 0.51, 0.14, -0.25, 0.62, 0.33, -0.45, 0.38, 0.49, -0.21, 0.18, 0.52, 0.39]
      },
      top1Scores: {
        'w2v_cosine': 0.925, 'w2v_manhattan': 94.165, 'w2v_euclidean': 6.685,
        'fused_cosine': 0.952, 'fused_manhattan': 82.410, 'fused_euclidean': 5.812,
        'tfidf_cosine': 0.545, 'tfidf_manhattan': 2.153, 'tfidf_euclidean': 0.954,
        'count_cosine': 0.612, 'count_manhattan': 4.000, 'count_euclidean': 2.000,
        'glove_cosine': 0.801, 'glove_manhattan': 72.164, 'glove_euclidean': 9.129
      },
      recommendations: [
        { rank: 1, name: 'Ravensburger 14796 Tropical Traffic Jigsaw Puzzle (500 Piece)', subcat: 'Toys & Games | Puzzles', scoreW2V: 0.925, scoreTFIDF: 0.545, scoreCount: 0.612, scoreGloVe: 0.801, scoreFused: 0.952 },
        { rank: 2, name: 'British Pier 275 Piece Jigsaw Puzzle for Adults', subcat: 'Toys & Games | Puzzles', scoreW2V: 0.920, scoreTFIDF: 0.512, scoreCount: 0.577, scoreGloVe: 0.785, scoreFused: 0.941 },
        { rank: 3, name: 'Avanti - Kitten Bouquet Puzzle - 300 Pieces', subcat: 'Toys & Games | Puzzles', scoreW2V: 0.919, scoreTFIDF: 0.498, scoreCount: 0.577, scoreGloVe: 0.772, scoreFused: 0.938 },
        { rank: 4, name: 'EuroGraphics Volkswagen Groovy Bus Collage Puzzle (2000 Piece)', subcat: 'Toys & Games | Puzzles', scoreW2V: 0.917, scoreTFIDF: 0.485, scoreCount: 0.500, scoreGloVe: 0.764, scoreFused: 0.932 },
        { rank: 5, name: 'The Daredevil by Bob Byerley Puzzle, 300-Piece Jigsaw', subcat: 'Toys & Games | Puzzles', scoreW2V: 0.914, scoreTFIDF: 0.472, scoreCount: 0.500, scoreGloVe: 0.758, scoreFused: 0.927 }
      ]
    },
    longboard: {
      id: 'longboard',
      rowId: 0,
      name: 'DB Longboards CoreFlex Crossbow 41" Bamboo Fiberglass Longboard Complete',
      subcat: 'Sports & Outdoors | Outdoor Recreation',
      tokens: ['db', 'longboard', 'coreflex', 'crossbow', '41', 'bamboo', 'fiberglass', 'complete'],
      vectorProfiles: {
        w2v: [0.55, 0.22, 0.78, -0.15, 0.44, 0.61, -0.32, 0.89, 0.12, -0.58, 0.71, 0.43, -0.27, 0.35, 0.69, 0.48],
        fused: [0.62, 0.31, 0.85, -0.09, 0.52, 0.73, -0.21, 0.94, 0.25, -0.49, 0.81, 0.54, -0.18, 0.47, 0.78, 0.59],
        tfidf: [0, 0.64, 0, 0, 0.72, 0, 0, 0.28, 0, 0, 0, 0, 0, 0, 0, 0],
        count: [0, 1.0, 0, 0, 1.0, 0, 0, 1.0, 0, 0, 0, 0, 0, 0, 0, 0],
        glove: [0.35, 0.12, 0.55, -0.21, 0.38, 0.42, -0.41, 0.71, 0.05, -0.62, 0.54, 0.31, -0.32, 0.22, 0.51, 0.35]
      },
      top1Scores: {
        'w2v_cosine': 0.974, 'w2v_manhattan': 72.814, 'w2v_euclidean': 5.349,
        'fused_cosine': 0.985, 'fused_manhattan': 64.120, 'fused_euclidean': 4.710,
        'tfidf_cosine': 1.000, 'tfidf_manhattan': 0.000, 'tfidf_euclidean': 0.000,
        'count_cosine': 1.000, 'count_manhattan': 0.000, 'count_euclidean': 0.000,
        'glove_cosine': 0.717, 'glove_manhattan': 102.012, 'glove_euclidean': 12.884
      },
      recommendations: [
        { rank: 1, name: 'Rayne Longboards Demonseed Longboard Complete Drop-Through', subcat: 'Sports & Outdoors | Outdoor Recreation', scoreW2V: 0.974, scoreTFIDF: 1.000, scoreCount: 1.000, scoreGloVe: 0.717, scoreFused: 0.985 },
        { rank: 2, name: 'Retrospec Rift Drop-Through Longboard Skateboard Complete', subcat: 'Sports & Outdoors | Outdoor Recreation', scoreW2V: 0.962, scoreTFIDF: 0.745, scoreCount: 0.707, scoreGloVe: 0.698, scoreFused: 0.975 },
        { rank: 3, name: 'Atom Kicktail Longboard 39 Inch Classic Cruiser', subcat: 'Sports & Outdoors | Outdoor Recreation', scoreW2V: 0.948, scoreTFIDF: 0.707, scoreCount: 0.707, scoreGloVe: 0.684, scoreFused: 0.962 },
        { rank: 4, name: 'Moose Bamboo Kicktail/Kryptonics Longboard Complete', subcat: 'Sports & Outdoors | Outdoor Recreation', scoreW2V: 0.945, scoreTFIDF: 0.682, scoreCount: 0.667, scoreGloVe: 0.675, scoreFused: 0.958 },
        { rank: 5, name: 'DB Longboards Contra Drop Deck Maple Longboard Complete', subcat: 'Sports & Outdoors | Outdoor Recreation', scoreW2V: 0.943, scoreTFIDF: 0.682, scoreCount: 0.667, scoreGloVe: 0.670, scoreFused: 0.955 }
      ]
    },
    costume: {
      id: 'costume',
      rowId: 7399,
      name: "Rubie's Child's Monster High Clawdeen Wolf Costume, Small",
      subcat: 'Clothing, Shoes & Jewelry | Costumes & Accessories',
      tokens: ['rubie', 'child', 'monster', 'high', 'clawdeen', 'wolf', 'costume', 'small'],
      vectorProfiles: {
        w2v: [0.71, 0.45, -0.18, 0.82, 0.33, -0.41, 0.65, 0.28, -0.15, 0.74, 0.39, -0.22, 0.58, 0.81, 0.19, -0.34],
        fused: [0.79, 0.54, -0.11, 0.89, 0.42, -0.32, 0.74, 0.37, -0.06, 0.83, 0.49, -0.14, 0.67, 0.89, 0.28, -0.25],
        tfidf: [0.75, 0, 0, 0, 0.62, 0, 0, 0.25, 0, 0, 0, 0, 0, 0, 0, 0],
        count: [1.0, 0, 0, 0, 1.0, 0, 0, 1.0, 0, 0, 0, 0, 0, 0, 0, 0],
        glove: [0.55, 0.31, -0.25, 0.68, 0.21, -0.52, 0.48, 0.17, -0.28, 0.59, 0.27, -0.35, 0.44, 0.66, 0.11, -0.42]
      },
      top1Scores: {
        'w2v_cosine': 0.968, 'w2v_manhattan': 97.106, 'w2v_euclidean': 7.126,
        'fused_cosine': 0.982, 'fused_manhattan': 84.180, 'fused_euclidean': 6.015,
        'tfidf_cosine': 0.854, 'tfidf_manhattan': 0.988, 'tfidf_euclidean': 0.540,
        'count_cosine': 0.772, 'count_manhattan': 3.000, 'count_euclidean': 1.732,
        'glove_cosine': 0.935, 'glove_manhattan': 64.818, 'glove_euclidean': 8.015
      },
      recommendations: [
        { rank: 1, name: "Rubies Monster High Clawdeen Wolf Child Costume Wig", subcat: 'Clothing, Shoes & Jewelry | Costumes & Accessories', scoreW2V: 0.968, scoreTFIDF: 0.854, scoreCount: 0.772, scoreGloVe: 0.935, scoreFused: 0.982 },
        { rank: 2, name: 'Monster High Deluxe Clawdeen Wolf Costume - Small Dress', subcat: 'Clothing, Shoes & Jewelry | Costumes & Accessories', scoreW2V: 0.959, scoreTFIDF: 0.821, scoreCount: 0.750, scoreGloVe: 0.912, scoreFused: 0.974 },
        { rank: 3, name: "Ever After High Blondie Lockes Costume, Child's Small", subcat: 'Clothing, Shoes & Jewelry | Costumes & Accessories', scoreW2V: 0.955, scoreTFIDF: 0.785, scoreCount: 0.707, scoreGloVe: 0.895, scoreFused: 0.968 },
        { rank: 4, name: "Rubie's Monster High Haunted Spectra Vondergeist Child Costume", subcat: 'Clothing, Shoes & Jewelry | Costumes & Accessories', scoreW2V: 0.951, scoreTFIDF: 0.762, scoreCount: 0.667, scoreGloVe: 0.884, scoreFused: 0.961 }
      ]
    },
    headphone: {
      id: 'headphone',
      rowId: 2154,
      name: 'Sony MDR-7506 Professional Large Diaphragm Studio Headphone',
      subcat: 'Electronics | Audio & Video Accessories',
      tokens: ['sony', 'mdr', '7506', 'professional', 'large', 'diaphragm', 'studio', 'headphone'],
      vectorProfiles: {
        w2v: [0.62, -0.31, 0.84, 0.19, -0.47, 0.75, 0.33, -0.18, 0.69, 0.41, -0.28, 0.82, 0.15, -0.52, 0.71, 0.38],
        fused: [0.71, -0.22, 0.91, 0.28, -0.38, 0.84, 0.42, -0.09, 0.78, 0.50, -0.19, 0.89, 0.24, -0.43, 0.79, 0.47],
        tfidf: [0.81, 0, 0, 0.59, 0, 0, 0.12, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        count: [1.0, 0, 0, 1.0, 0, 0, 1.0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        glove: [0.48, -0.39, 0.65, 0.11, -0.55, 0.58, 0.22, -0.29, 0.52, 0.30, -0.38, 0.64, 0.08, -0.61, 0.55, 0.27]
      },
      top1Scores: {
        'w2v_cosine': 0.942, 'w2v_manhattan': 88.340, 'w2v_euclidean': 6.120,
        'fused_cosine': 0.968, 'fused_manhattan': 76.510, 'fused_euclidean': 5.210,
        'tfidf_cosine': 0.680, 'tfidf_manhattan': 1.450, 'tfidf_euclidean': 0.800,
        'count_cosine': 0.707, 'count_manhattan': 3.000, 'count_euclidean': 1.732,
        'glove_cosine': 0.825, 'glove_manhattan': 79.110, 'glove_euclidean': 8.840
      },
      recommendations: [
        { rank: 1, name: 'Audio-Technica ATH-M50x Professional Studio Monitor Headphones', subcat: 'Electronics | Audio & Video Accessories', scoreW2V: 0.942, scoreTFIDF: 0.680, scoreCount: 0.707, scoreGloVe: 0.825, scoreFused: 0.968 },
        { rank: 2, name: 'Sennheiser HD 280 Pro Professional Studio Monitor Headphone', subcat: 'Electronics | Audio & Video Accessories', scoreW2V: 0.935, scoreTFIDF: 0.642, scoreCount: 0.667, scoreGloVe: 0.812, scoreFused: 0.961 },
        { rank: 3, name: 'Beyerdynamic DT 770 PRO 80 Ohm Studio Headphone', subcat: 'Electronics | Audio & Video Accessories', scoreW2V: 0.928, scoreTFIDF: 0.610, scoreCount: 0.577, scoreGloVe: 0.798, scoreFused: 0.954 },
        { rank: 4, name: 'Sony WH-1000XM5 Wireless Noise Canceling Headphones Bluetooth', subcat: 'Electronics | Audio & Video Accessories', scoreW2V: 0.918, scoreTFIDF: 0.585, scoreCount: 0.500, scoreGloVe: 0.785, scoreFused: 0.945 }
      ]
    }
  };

  // -------------------------------------------------------------
  // 3. BENCHMARK TABLES DATA (Table 7, Table 11, Ablation)
  // -------------------------------------------------------------
  const TABLE_7_DATA = [
    { vec: 'Count Vectorizer', metric: 'cosine', t1: '0.612', t2: '1.000', t3: '0.772', delta: '0.530', note: 'Baseline BOW (sparse 1500 dims)' },
    { vec: 'Count Vectorizer', metric: 'manhattan', t1: '4.000', t2: '0.000', t3: '3.000', delta: '8.000', note: 'L1 token count diffs' },
    { vec: 'Count Vectorizer', metric: 'euclidean', t1: '2.000', t2: '0.000', t3: '1.732', delta: '2.830', note: 'L2 norm on raw counts' },
    { vec: 'TF-IDF (Scratch)', metric: 'cosine', t1: '0.545', t2: '1.000', t3: '0.854', delta: '0.780', note: 'Eq. 6-8: L2-normalized rows' },
    { vec: 'TF-IDF (Scratch)', metric: 'manhattan', t1: '2.153', t2: '0.000', t3: '0.988', delta: '4.880', note: 'Sub-unit distances due to L2 norm' },
    { vec: 'TF-IDF (Scratch)', metric: 'euclidean', t1: '0.954', t2: '0.000', t3: '0.540', delta: '1.250', note: 'Monotonically equivalent to cosine' },
    { vec: 'Word2Vec (300d)', metric: 'cosine', t1: '0.925', t2: '0.974', t3: '0.968', delta: '0.164', note: 'Highest ranking quality (Table 11)' },
    { vec: 'Word2Vec (300d)', metric: 'manhattan', t1: '94.165', t2: '72.814', t3: '97.106', delta: '36.796', note: 'Sum-pooled across 300 dimensions' },
    { vec: 'Word2Vec (300d)', metric: 'euclidean', t1: '6.685', t2: '5.349', t3: '7.126', delta: '2.486', note: 'Unnormalized Euclidean ranking' },
    { vec: 'GloVe (100d)', metric: 'cosine', t1: '0.801', t2: '0.717', t3: '0.935', delta: '0.131', note: 'Pre-trained static Wikipedia vectors' },
    { vec: 'GloVe (100d)', metric: 'manhattan', t1: '72.164', t2: '102.012', t3: '64.818', delta: '108.058', note: 'Pre-trained vocabulary domain gap' },
    { vec: 'GloVe (100d)', metric: 'euclidean', t1: '9.129', t2: '12.884', t3: '8.015', delta: '2.985', note: 'Poorest P@10 (0.409)' }
  ];

  const TABLE_11_DATA = [
    { model: 'CountVec + Cosine (BASELINE)', p10: '0.514', p10CI: '[0.485, 0.544]', r10: '0.023', r10CI: '[0.019, 0.028]', ndcg: '0.539', ndcgCI: '[0.510, 0.568]', delta: 'Ref. Baseline', status: 'baseline' },
    { model: 'TF-IDF + Cosine', p10: '0.490', p10CI: '[0.463, 0.519]', r10: '0.023', r10CI: '[0.019, 0.029]', ndcg: '0.514', ndcgCI: '[0.485, 0.544]', delta: '-0.023 [-0.038, -0.009]', status: 'significant' },
    { model: 'TF-IDF + Euclidean', p10: '0.490', p10CI: '[0.463, 0.519]', r10: '0.023', r10CI: '[0.019, 0.029]', ndcg: '0.514', ndcgCI: '[0.485, 0.544]', delta: '-0.023 [-0.038, -0.009]', status: 'significant' },
    { model: 'TF-IDF (3000 vocab, no min_df) + Cosine', p10: '0.491', p10CI: '[0.462, 0.520]', r10: '0.025', r10CI: '[0.020, 0.031]', ndcg: '0.517', ndcgCI: '[0.487, 0.547]', delta: '-0.023 [-0.040, -0.005]', status: 'significant' },
    { model: 'Word2Vec + Cosine', p10: '0.538', p10CI: '[0.506, 0.571]', r10: '0.022', r10CI: '[0.019, 0.026]', ndcg: '0.558', ndcgCI: '[0.526, 0.591]', delta: '+0.024 [+0.008, +0.040]', status: 'significant_best' },
    { model: 'GloVe-100d + Cosine', p10: '0.409', p10CI: '[0.380, 0.439]', r10: '0.019', r10CI: '[0.015, 0.024]', ndcg: '0.443', ndcgCI: '[0.413, 0.472]', delta: '-0.104 [-0.126, -0.083]', status: 'significant_low' }
  ];

  const TABLE_ABLATION_DATA = [
    { model: '1. Word2Vec + Cosine (default)', p10: '0.538', ci: '[0.506, 0.571]', ndcg: '0.558', delta: 'Reference', sig: '—', takeaway: 'Default sum-pooled skip-gram model' },
    { model: '2. Euclidean (sum-pooled, unnormalised)', p10: '0.511', ci: '[0.481, 0.543]', ndcg: '0.531', delta: '-0.027 [-0.040, -0.012]', sig: 'Significant drop', takeaway: 'Unnormalized magnitude corrupts angular match' },
    { model: '3. Manhattan (sum-pooled, unnormalised)', p10: '0.511', ci: '[0.481, 0.543]', ndcg: '0.532', delta: '-0.027 [-0.041, -0.012]', sig: 'Significant drop', takeaway: 'L1 suffers identical unnormalized penalty' },
    { model: '4. Euclidean (mean-pooled)', p10: '0.523', ci: '[0.491, 0.556]', ndcg: '0.543', delta: '-0.015 [-0.026, -0.006]', sig: 'Significant drop', takeaway: 'Mean-pooling loses word-count saliency' },
    { model: '5. No text cleaning (W2V retrained)', p10: '0.528', ci: '[0.497, 0.559]', ndcg: '0.548', delta: '-0.010 [-0.021, +0.002]', sig: 'Not Significant', takeaway: 'Retrained W2V learns stopword embeddings cleanly' },
    { model: '6. Control: fused corpus, title only', p10: '0.560', ci: '[0.529, 0.592]', ndcg: '0.583', delta: '+0.022 [+0.010, +0.036]', sig: 'Significant gain', takeaway: 'Accounts for 46% of total fusion improvement' },
    { model: '7. IMPROVEMENT: Title + About Product', p10: '0.586', ci: '[0.556, 0.616]', ndcg: '0.603', delta: '+0.048 [+0.027, +0.071]', sig: 'Significant gain', takeaway: 'Winner: Richer representation + better vectors' }
  ];

  // -------------------------------------------------------------
  // 4. APP STATE
  // -------------------------------------------------------------
  let state = {
    mode: 'preset', // 'preset' or 'custom'
    activeSeedId: 'puzzle',
    customQuery: '',
    customTokens: [],
    customSubcat: 'General Search Query',
    activeVec: 'w2v',
    activeMetric: 'cosine',
    topK: 5
  };

  // -------------------------------------------------------------
  // 5. NAVIGATION & THEME CONTROLS
  // -------------------------------------------------------------
  const tabs = document.querySelectorAll('.nav-tab');
  const panes = document.querySelectorAll('.tab-pane');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.getAttribute('data-tab');
      tabs.forEach(t => t.classList.remove('active'));
      panes.forEach(p => p.classList.remove('active'));

      tab.classList.add('active');
      const pane = document.getElementById(`pane-${target}`);
      if (pane) pane.classList.add('active');
    });
  });

  const themeToggle = document.getElementById('themeToggle');
  const savedTheme = localStorage.getItem('theme') || 'theme-light';
  document.body.className = savedTheme;

  themeToggle.addEventListener('click', () => {
    if (document.body.classList.contains('theme-dark')) {
      document.body.className = 'theme-light';
      localStorage.setItem('theme', 'theme-light');
    } else {
      document.body.className = 'theme-dark';
      localStorage.setItem('theme', 'theme-dark');
    }
  });

  // -------------------------------------------------------------
  // 6. MODE SWITCHER (BENCHMARK SEEDS VS CUSTOM SEARCH)
  // -------------------------------------------------------------
  const modePresetBtn = document.getElementById('modePresetBtn');
  const modeCustomBtn = document.getElementById('modeCustomBtn');
  const presetModeContainer = document.getElementById('presetModeContainer');
  const customModeContainer = document.getElementById('customModeContainer');
  const customProductInput = document.getElementById('customProductInput');
  const clearCustomQuery = document.getElementById('clearCustomQuery');
  const runCustomSearchBtn = document.getElementById('runCustomSearchBtn');
  const sampleChips = document.querySelectorAll('.sample-chip');

  modePresetBtn.addEventListener('click', () => {
    state.mode = 'preset';
    modePresetBtn.classList.add('active');
    modeCustomBtn.classList.remove('active');
    presetModeContainer.classList.remove('hidden');
    customModeContainer.classList.add('hidden');
    renderActiveSeed();
    renderRecommendations();
  });

  modeCustomBtn.addEventListener('click', () => {
    state.mode = 'custom';
    modeCustomBtn.classList.add('active');
    modePresetBtn.classList.remove('active');
    customModeContainer.classList.remove('hidden');
    presetModeContainer.classList.add('hidden');
    customProductInput.focus();
    if (!state.customQuery) {
      executeCustomSearch("Mechanical gaming keyboard with tactile switches and RGB");
      customProductInput.value = "Mechanical gaming keyboard with tactile switches and RGB";
      clearCustomQuery.classList.remove('hidden');
    } else {
      renderActiveSeed();
      renderRecommendations();
    }
  });

  customProductInput.addEventListener('input', (e) => {
    const val = e.target.value;
    if (val.trim()) {
      clearCustomQuery.classList.remove('hidden');
    } else {
      clearCustomQuery.classList.add('hidden');
    }
  });

  customProductInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      executeCustomSearch(customProductInput.value);
    }
  });

  runCustomSearchBtn.addEventListener('click', () => {
    executeCustomSearch(customProductInput.value);
  });

  clearCustomQuery.addEventListener('click', () => {
    customProductInput.value = '';
    clearCustomQuery.classList.add('hidden');
    customProductInput.focus();
  });

  sampleChips.forEach(chip => {
    chip.addEventListener('click', () => {
      const sample = chip.getAttribute('data-sample');
      customProductInput.value = sample;
      clearCustomQuery.classList.remove('hidden');
      executeCustomSearch(sample);
    });
  });

  function executeCustomSearch(queryText) {
    if (!queryText || !queryText.trim()) return;
    state.customQuery = queryText.trim();
    state.customTokens = cleanText(state.customQuery);

    // Heuristically infer category from tokens
    const tSet = new Set(state.customTokens);
    if (tSet.has('keyboard') || tSet.has('mouse') || tSet.has('headphone') || tSet.has('bluetooth') || tSet.has('earbuds')) {
      state.customSubcat = 'Electronics | Computers & Audio';
    } else if (tSet.has('bottle') || tSet.has('flask') || tSet.has('water') || tSet.has('yeti') || tSet.has('hydro')) {
      state.customSubcat = 'Sports & Outdoors | Camping & Drinkware';
    } else if (tSet.has('tea') || tSet.has('matcha') || tSet.has('coffee') || tSet.has('espresso')) {
      state.customSubcat = 'Grocery & Gourmet Food | Coffee & Tea';
    } else if (tSet.has('yoga') || tSet.has('mat') || tSet.has('fitness') || tSet.has('exercise')) {
      state.customSubcat = 'Sports & Outdoors | Exercise & Fitness';
    } else if (tSet.has('lego') || tSet.has('puzzle') || tSet.has('star') || tSet.has('toy') || tSet.has('jigsaw')) {
      state.customSubcat = 'Toys & Games | Building Toys & Puzzles';
    } else if (tSet.has('longboard') || tSet.has('skateboard') || tSet.has('skate')) {
      state.customSubcat = 'Sports & Outdoors | Outdoor Recreation';
    } else if (tSet.has('costume') || tSet.has('dress') || tSet.has('wolf') || tSet.has('wig')) {
      state.customSubcat = 'Clothing, Shoes & Jewelry | Costumes';
    } else {
      state.customSubcat = 'Amazon Product Catalog | Search Query';
    }

    renderActiveSeed();
    renderRecommendations();
  }

  // -------------------------------------------------------------
  // 7. PRESET BENCHMARK CHIPS
  // -------------------------------------------------------------
  const presetBtns = document.querySelectorAll('.preset-btn');
  presetBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      presetBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.activeSeedId = btn.getAttribute('data-seed');
      renderActiveSeed();
      renderRecommendations();
    });
  });

  // Vectorizer & Metric Controls
  const vecBtns = document.querySelectorAll('#vectorizerSelector .segment-btn');
  const metricBtns = document.querySelectorAll('#metricSelector .segment-btn-h');
  const topKSlider = document.getElementById('topKSlider');
  const topKVal = document.getElementById('topKVal');

  vecBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      vecBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.activeVec = btn.getAttribute('data-vec');
      updateVectorMeta();
      renderRecommendations();
    });
  });

  metricBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      metricBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.activeMetric = btn.getAttribute('data-metric');
      updateMetricMeta();
      renderRecommendations();
    });
  });

  topKSlider.addEventListener('input', (e) => {
    state.topK = parseInt(e.target.value, 10);
    topKVal.textContent = `K = ${state.topK}`;
    renderRecommendations();
  });

  // -------------------------------------------------------------
  // 8. SIMULATED VECTOR & RETRIEVAL ENGINE FOR CUSTOM QUERIES
  // -------------------------------------------------------------
  function computeCustomRecommendations() {
    const qTokens = state.customTokens;
    const qTokenSet = new Set(qTokens);

    // Compute similarity for each catalog item
    const scoredList = CATALOG_DATABASE.map(item => {
      // 1. Lexical / Token match overlap (TF-IDF & Count)
      let sharedCount = 0;
      item.tokens.forEach(t => {
        if (qTokenSet.has(t)) sharedCount++;
      });
      item.tags.forEach(t => {
        if (qTokenSet.has(t)) sharedCount += 0.5;
      });

      const denom = Math.sqrt(Math.max(1, qTokens.length) * Math.max(1, item.tokens.length));
      let tfidfScore = sharedCount / denom;
      tfidfScore = Math.min(0.99, tfidfScore);

      // 2. Semantic Embedding match (Word2Vec / GloVe / Fused)
      // High score if tokens match or categories are strongly aligned
      let w2vBase = 0.42;
      const sharesSubcat = item.subcat.toLowerCase().split('|')[0].trim() === state.customSubcat.toLowerCase().split('|')[0].trim();
      if (sharesSubcat) w2vBase += 0.35;
      if (sharedCount > 0) w2vBase += Math.min(0.22, sharedCount * 0.08);

      // Add small hash variance for realism
      let hash = 0;
      for (let i = 0; i < item.name.length; i++) hash = (hash * 31 + item.name.charCodeAt(i)) % 100;
      const jitter = (hash / 1000);

      const scoreW2V = Math.min(0.985, Math.max(0.25, w2vBase + jitter));
      const scoreFused = Math.min(0.992, scoreW2V + 0.035);
      const scoreGloVe = Math.max(0.18, scoreW2V - 0.12);
      const scoreCount = Math.min(1.0, (sharedCount / Math.max(1, qTokens.length)));

      return {
        name: item.name,
        subcat: item.subcat,
        scoreW2V: scoreW2V,
        scoreFused: scoreFused,
        scoreTFIDF: Math.max(0.12, tfidfScore),
        scoreCount: Math.max(0.10, scoreCount),
        scoreGloVe: scoreGloVe
      };
    });

    // Sort according to current vectorizer and metric
    scoredList.sort((a, b) => {
      let valA = a.scoreW2V;
      let valB = b.scoreW2V;
      if (state.activeVec === 'fused') { valA = a.scoreFused; valB = b.scoreFused; }
      else if (state.activeVec === 'tfidf') { valA = a.scoreTFIDF; valB = b.scoreTFIDF; }
      else if (state.activeVec === 'count') { valA = a.scoreCount; valB = b.scoreCount; }
      else if (state.activeVec === 'glove') { valA = a.scoreGloVe; valB = b.scoreGloVe; }

      // Cosine -> higher is better (descending); Distance -> lower is better
      return valB - valA;
    });

    return scoredList.slice(0, state.topK).map((item, idx) => ({
      rank: idx + 1,
      ...item
    }));
  }

  // -------------------------------------------------------------
  // 9. RENDER FUNCTIONS
  // -------------------------------------------------------------
  function renderActiveSeed() {
    let name = '';
    let subcat = '';
    let rowId = 'Custom Query';
    let tokens = [];

    if (state.mode === 'preset') {
      const seed = BENCHMARK_SEEDS[state.activeSeedId];
      if (!seed) return;
      name = seed.name;
      subcat = seed.subcat;
      rowId = `Row #${seed.rowId}`;
      tokens = seed.tokens;
    } else {
      name = state.customQuery || "Type your query above...";
      subcat = state.customSubcat;
      rowId = "Custom Search Mode";
      tokens = state.customTokens;
    }

    document.getElementById('seedName').textContent = name;
    document.getElementById('seedSubcat').textContent = subcat;
    document.getElementById('seedRowId').textContent = rowId;

    const tokensList = document.getElementById('seedTokens');
    if (tokens.length > 0) {
      tokensList.innerHTML = tokens.map(t => `<span class="token">${t}</span>`).join('');
    } else {
      tokensList.innerHTML = '<span class="token" style="color: var(--text-muted);">no tokens yet</span>';
    }
    renderSparkline();
  }

  function updateVectorMeta() {
    const badge = document.getElementById('vectorDimBadge');
    const density = document.getElementById('vectorDensity');
    if (state.activeVec === 'w2v') {
      badge.textContent = '300 dims · Dense';
      density.textContent = 'Dense (300/300 active)';
    } else if (state.activeVec === 'fused') {
      badge.textContent = '300 dims · Fused Description';
      density.textContent = 'Dense (Title + Description)';
    } else if (state.activeVec === 'tfidf') {
      badge.textContent = '1500 dims · Sparse';
      density.textContent = 'Sparse (Active vocab tokens)';
    } else if (state.activeVec === 'count') {
      badge.textContent = '1500 dims · Sparse';
      density.textContent = 'Sparse (Active vocab counts)';
    } else if (state.activeVec === 'glove') {
      badge.textContent = '100 dims · Dense';
      density.textContent = 'Dense (100/100 active)';
    }
    renderSparkline();
  }

  function updateMetricMeta() {
    const prop = document.getElementById('metricProperty');
    const title = document.getElementById('insightTitle');
    const text = document.getElementById('insightText');

    if (state.activeMetric === 'cosine') {
      prop.textContent = 'Higher = More Similar';
      title.textContent = 'Cosine Similarity Behavior (Paper Eq. 1)';
      text.textContent = 'Measures angular similarity between vectors. Invariant to document length because of explicit L2 normalization: sim(A,B) = (A·B)/(||A|| ||B||). Ranges between -1 and +1.';
    } else if (state.activeMetric === 'euclidean') {
      prop.textContent = 'Lower = Closer Neighbor';
      title.textContent = 'Euclidean Distance (Paper Eq. 3)';
      text.textContent = 'Measures straight-line geometric distance d_E = sqrt(Σ(Ai - Bi)²). On L2-normalized TF-IDF vectors, Euclidean produces 99.6% identical ranking to cosine due to monotonic square relation.';
    } else if (state.activeMetric === 'manhattan') {
      prop.textContent = 'Lower = Closer Neighbor';
      title.textContent = 'Manhattan Distance (Paper Eq. 2)';
      text.textContent = 'Sum of absolute coordinate differences d_M = Σ|Ai - Bi|. For dense unnormalized 300d embeddings, values accumulate across all coordinates (e.g. 72 to 97), unlike sparse vector metrics.';
    }
  }

  function renderSparkline() {
    const container = document.getElementById('vectorSparkline');
    let profile = [];

    if (state.mode === 'preset') {
      const seed = BENCHMARK_SEEDS[state.activeSeedId];
      if (seed && seed.vectorProfiles[state.activeVec]) {
        profile = seed.vectorProfiles[state.activeVec];
      }
    } else {
      // Dynamic profile generated from custom tokens
      const tLen = state.customTokens.length;
      profile = [0.45, -0.32, 0.78, 0.15, -0.58, 0.84, 0.22, -0.19, 0.64, 0.38, -0.41, 0.73, 0.29, -0.51, 0.81, 0.44].map((v, i) => {
        if (state.activeVec === 'tfidf' || state.activeVec === 'count') {
          return i % (Math.max(1, 6 - tLen)) === 0 ? Math.abs(v) : 0;
        }
        return v * (tLen > 0 ? 1 : 0.2);
      });
    }

    if (profile.length === 0) {
      profile = [0.2, 0.4, 0.6, 0.8, 0.5, 0.3, 0.7, 0.9, 0.4, 0.6, 0.2, 0.5, 0.8, 0.3, 0.7, 0.4];
    }

    container.innerHTML = profile.map(val => {
      const heightPct = Math.max(8, Math.min(100, Math.round(Math.abs(val) * 100)));
      const opacity = Math.max(0.25, Math.abs(val));
      return `<div class="spark-bar" style="height: ${heightPct}%; opacity: ${opacity};" title="Val: ${val.toFixed(2)}"></div>`;
    }).join('');
  }

  function renderRecommendations() {
    const listContainer = document.getElementById('recommendationsList');
    let items = [];
    let top1Score = 0.925;
    let seedSubcat = '';

    if (state.mode === 'preset') {
      const seed = BENCHMARK_SEEDS[state.activeSeedId];
      if (!seed) return;
      seedSubcat = seed.subcat;
      const key = `${state.activeVec}_${state.activeMetric}`;
      top1Score = seed.top1Scores[key] !== undefined ? seed.top1Scores[key] : 0.925;
      items = seed.recommendations.slice(0, state.topK);
    } else {
      seedSubcat = state.customSubcat;
      items = computeCustomRecommendations();
      if (items.length > 0) {
        const topItem = items[0];
        let val = topItem.scoreW2V;
        if (state.activeVec === 'fused') val = topItem.scoreFused;
        else if (state.activeVec === 'tfidf') val = topItem.scoreTFIDF;
        else if (state.activeVec === 'count') val = topItem.scoreCount;
        else if (state.activeVec === 'glove') val = topItem.scoreGloVe;
        top1Score = val;
      }
    }

    // Format top 1 score
    if (state.activeMetric === 'cosine') {
      document.getElementById('top1ScoreDisplay').textContent = top1Score.toFixed(3);
    } else if (state.activeMetric === 'euclidean') {
      const eScore = state.activeVec === 'tfidf' ? (top1Score * 0.95).toFixed(3) : (top1Score * (state.activeVec === 'w2v' ? 6.7 : 9.1)).toFixed(2);
      document.getElementById('top1ScoreDisplay').textContent = eScore;
    } else if (state.activeMetric === 'manhattan') {
      const mScore = state.activeVec === 'tfidf' ? (top1Score * 2.15).toFixed(3) : (top1Score * (state.activeVec === 'w2v' ? 95 : 72)).toFixed(1);
      document.getElementById('top1ScoreDisplay').textContent = mScore;
    }

    let relevantHits = 0;

    listContainer.innerHTML = items.map((rec, idx) => {
      const isMatch = rec.subcat.toLowerCase().split('|')[0].trim() === seedSubcat.toLowerCase().split('|')[0].trim();
      if (isMatch) relevantHits++;

      // Compute display score
      let scoreVal = 0.9;
      if (state.activeVec === 'w2v') scoreVal = rec.scoreW2V;
      else if (state.activeVec === 'fused') scoreVal = rec.scoreFused;
      else if (state.activeVec === 'tfidf') scoreVal = rec.scoreTFIDF;
      else if (state.activeVec === 'count') scoreVal = rec.scoreCount;
      else if (state.activeVec === 'glove') scoreVal = rec.scoreGloVe;

      let displayStr = scoreVal.toFixed(3);
      let barWidth = Math.round(scoreVal * 100);

      if (state.activeMetric === 'manhattan') {
        const mScore = state.activeVec === 'tfidf' ? (scoreVal * 2.15).toFixed(3) : (scoreVal * (state.activeVec === 'w2v' ? 95 : 72)).toFixed(1);
        displayStr = mScore;
        barWidth = Math.max(10, 100 - Math.min(100, Math.round(parseFloat(mScore))));
      } else if (state.activeMetric === 'euclidean') {
        const eScore = state.activeVec === 'tfidf' ? (scoreVal * 0.95).toFixed(3) : (scoreVal * (state.activeVec === 'w2v' ? 6.7 : 9.1)).toFixed(2);
        displayStr = eScore;
        barWidth = Math.max(10, 100 - Math.min(100, Math.round(parseFloat(eScore) * 10)));
      }

      const matchLabel = isMatch ? 'Category Match' : 'Cross-Category';
      const matchClass = isMatch ? 'relevant' : 'cross';

      return `
        <div class="rec-item-card" style="animation-delay: ${idx * 40}ms">
          <div class="rank-badge ${idx === 0 ? 'top-1' : ''}">${rec.rank}</div>
          <div class="rec-main-info">
            <h4 class="rec-product-title">${rec.name}</h4>
            <div class="rec-meta-tags">
              <span class="match-status-badge ${matchClass}">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                  ${isMatch ? '<polyline points="20 6 9 17 4 12"></polyline>' : '<line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line>'}
                </svg>
                ${matchLabel}
              </span>
              <span class="rec-subcat">${rec.subcat}</span>
            </div>
          </div>
          <div class="rec-score-column">
            <span class="score-display-val ${idx === 0 ? 'top' : ''} font-mono">${displayStr}</span>
            <div class="score-bar-bg">
              <div class="score-bar-fill" style="width: ${barWidth}%"></div>
            </div>
          </div>
        </div>
      `;
    }).join('');

    // Update current precision
    const prec = relevantHits / Math.max(1, items.length);
    document.getElementById('currentPrecDisplay').textContent = prec.toFixed(2);
  }

  // -------------------------------------------------------------
  // 10. POPULATE BENCHMARK TABLES
  // -------------------------------------------------------------
  function renderTable7() {
    const tbody = document.querySelector('#matrixTable7 tbody');
    tbody.innerHTML = TABLE_7_DATA.map(row => `
      <tr>
        <td style="font-weight: 600;">${row.vec}</td>
        <td><span class="token" style="text-transform: capitalize;">${row.metric}</span></td>
        <td class="font-mono">${row.t1}</td>
        <td class="font-mono">${row.t2}</td>
        <td class="font-mono">${row.t3}</td>
        <td class="font-mono text-muted">${row.delta}</td>
        <td style="color: var(--text-secondary);">${row.note}</td>
      </tr>
    `).join('');
  }

  function renderTable11() {
    const tbody = document.querySelector('#table11Main tbody');
    tbody.innerHTML = TABLE_11_DATA.map(row => {
      const isBase = row.status === 'baseline';
      const isBest = row.status === 'significant_best';
      return `
        <tr style="${isBest ? 'background: var(--accent-soft); font-weight: 500;' : ''}">
          <td style="font-weight: 600; color: ${isBest ? 'var(--accent)' : 'inherit'};">${row.model}</td>
          <td class="font-mono" style="font-weight: 700;">${row.p10}</td>
          <td class="font-mono text-muted">${row.p10CI}</td>
          <td class="font-mono">${row.r10}</td>
          <td class="font-mono text-muted">${row.r10CI}</td>
          <td class="font-mono" style="font-weight: 600;">${row.ndcg}</td>
          <td class="font-mono text-muted">${row.ndcgCI}</td>
          <td class="font-mono" style="color: ${isBest ? 'var(--accent)' : (row.delta.startsWith('-') ? '#e11d48' : 'var(--text-secondary)')}; font-weight: 600;">
            ${row.delta}
          </td>
        </tr>
      `;
    }).join('');

    // Render Bar Chart
    const barContainer = document.getElementById('precisionBars');
    barContainer.innerHTML = TABLE_11_DATA.map(row => {
      const val = parseFloat(row.p10);
      const widthPct = Math.round((val / 0.65) * 100);
      const isBase = row.status === 'baseline';
      const isBest = row.status === 'significant_best';
      const barClass = isBest ? 'improvement' : (isBase ? 'baseline' : '');

      return `
        <div class="bar-row">
          <span class="bar-label" title="${row.model}">${row.model}</span>
          <div class="bar-track">
            <div class="bar-value-fill ${barClass}" style="width: ${widthPct}%;"></div>
          </div>
          <span class="bar-metrics-text font-mono">${row.p10} (95% CI ${row.p10CI})</span>
        </div>
      `;
    }).join('');
  }

  function renderAblation() {
    const tbody = document.querySelector('#tableAblation tbody');
    tbody.innerHTML = TABLE_ABLATION_DATA.map(row => {
      const isWinner = row.model.includes('IMPROVEMENT');
      return `
        <tr style="${isWinner ? 'background: var(--accent-soft); font-weight: 500;' : ''}">
          <td style="font-weight: 600; color: ${isWinner ? 'var(--accent)' : 'inherit'};">${row.model}</td>
          <td class="font-mono" style="font-weight: 700;">${row.p10}</td>
          <td class="font-mono text-muted">${row.ci}</td>
          <td class="font-mono">${row.ndcg}</td>
          <td class="font-mono" style="color: ${isWinner ? 'var(--accent)' : (row.delta.startsWith('-') ? '#e11d48' : 'var(--text-secondary)')}; font-weight: 600;">
            ${row.delta}
          </td>
          <td><span class="match-status-badge ${row.sig.includes('gain') ? 'relevant' : (row.sig.includes('drop') ? 'cross' : '')}">${row.sig}</span></td>
          <td style="color: var(--text-secondary); font-size: 0.75rem;">${row.takeaway}</td>
        </tr>
      `;
    }).join('');
  }

  // -------------------------------------------------------------
  // 11. INITIALIZE APP
  // -------------------------------------------------------------
  renderActiveSeed();
  updateVectorMeta();
  updateMetricMeta();
  renderRecommendations();
  renderTable7();
  renderTable11();
  renderAblation();
});
