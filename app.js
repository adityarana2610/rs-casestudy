/**
 * RS Case Study Interactive Demo Application
 * Faithful reproduction & visualization of Oprea et al. (IEEE Access, 2026)
 */

document.addEventListener('DOMContentLoaded', () => {
  // -------------------------------------------------------------
  // 1. DATASETS & BENCHMARK RESULTS (Extracted from Case Study Run)
  // -------------------------------------------------------------
  
  const SEEDS = {
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
        { rank: 2, name: 'British Pier 275 Piece Jigsaw Puzzle', subcat: 'Toys & Games | Puzzles', scoreW2V: 0.920, scoreTFIDF: 0.512, scoreCount: 0.577, scoreGloVe: 0.785, scoreFused: 0.941 },
        { rank: 3, name: 'Avanti - Kitten Bouquet Puzzle - 300 Pieces', subcat: 'Toys & Games | Puzzles', scoreW2V: 0.919, scoreTFIDF: 0.498, scoreCount: 0.577, scoreGloVe: 0.772, scoreFused: 0.938 },
        { rank: 4, name: 'EuroGraphics Volkswagen Groovy Bus Collage Puzzle (2000 Piece)', subcat: 'Toys & Games | Puzzles', scoreW2V: 0.917, scoreTFIDF: 0.485, scoreCount: 0.500, scoreGloVe: 0.764, scoreFused: 0.932 },
        { rank: 5, name: 'The Daredevil by Bob Byerley Puzzle, 300-Piece', subcat: 'Toys & Games | Puzzles', scoreW2V: 0.914, scoreTFIDF: 0.472, scoreCount: 0.500, scoreGloVe: 0.758, scoreFused: 0.927 },
        { rank: 6, name: 'MasterPieces 500 Piece Panoramic Jigsaw Puzzle - Wildlife Collage', subcat: 'Toys & Games | Puzzles', scoreW2V: 0.908, scoreTFIDF: 0.461, scoreCount: 0.471, scoreGloVe: 0.749, scoreFused: 0.920 },
        { rank: 7, name: 'SunsOut Seaside Sunset 1000 Pc Jigsaw Puzzle', subcat: 'Toys & Games | Puzzles', scoreW2V: 0.902, scoreTFIDF: 0.450, scoreCount: 0.447, scoreGloVe: 0.738, scoreFused: 0.914 },
        { rank: 8, name: 'Buffalo Games - Darrell Bush - Canoe Lake - 1000 Piece Jigsaw Puzzle', subcat: 'Toys & Games | Puzzles', scoreW2V: 0.898, scoreTFIDF: 0.442, scoreCount: 0.447, scoreGloVe: 0.731, scoreFused: 0.909 },
        { rank: 9, name: 'White Mountain Puzzles Old Candy Store - 1000 Piece Jigsaw Puzzle', subcat: 'Toys & Games | Puzzles', scoreW2V: 0.895, scoreTFIDF: 0.438, scoreCount: 0.408, scoreGloVe: 0.725, scoreFused: 0.903 },
        { rank: 10, name: 'Dowdle Folk Art Las Vegas 500 Piece Puzzle', subcat: 'Toys & Games | Puzzles', scoreW2V: 0.891, scoreTFIDF: 0.430, scoreCount: 0.408, scoreGloVe: 0.718, scoreFused: 0.897 }
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
        { rank: 1, name: 'Rayne Longboards Demonseed Longboard Complete', subcat: 'Sports & Outdoors | Outdoor Recreation', scoreW2V: 0.974, scoreTFIDF: 1.000, scoreCount: 1.000, scoreGloVe: 0.717, scoreFused: 0.985 },
        { rank: 2, name: 'Retrospec Rift Drop-Through Longboard Skateboard Complete', subcat: 'Sports & Outdoors | Outdoor Recreation', scoreW2V: 0.962, scoreTFIDF: 0.745, scoreCount: 0.707, scoreGloVe: 0.698, scoreFused: 0.975 },
        { rank: 3, name: 'Atom Kicktail Longboard', subcat: 'Sports & Outdoors | Outdoor Recreation', scoreW2V: 0.948, scoreTFIDF: 0.707, scoreCount: 0.707, scoreGloVe: 0.684, scoreFused: 0.962 },
        { rank: 4, name: 'Moose Bamboo Kicktail/Kryptonics Longboard Complete', subcat: 'Sports & Outdoors | Outdoor Recreation', scoreW2V: 0.945, scoreTFIDF: 0.682, scoreCount: 0.667, scoreGloVe: 0.675, scoreFused: 0.958 },
        { rank: 5, name: 'DB Longboards Contra Drop Deck Maple Longboard Complete', subcat: 'Sports & Outdoors | Outdoor Recreation', scoreW2V: 0.943, scoreTFIDF: 0.682, scoreCount: 0.667, scoreGloVe: 0.670, scoreFused: 0.955 },
        { rank: 6, name: 'Sector 9 Aperture Sidewinder Drop Through Downhill Longboard', subcat: 'Sports & Outdoors | Outdoor Recreation', scoreW2V: 0.939, scoreTFIDF: 0.620, scoreCount: 0.577, scoreGloVe: 0.655, scoreFused: 0.948 },
        { rank: 7, name: 'Quest Super Cruiser Artisan Bamboo Longboard Skateboard', subcat: 'Sports & Outdoors | Outdoor Recreation', scoreW2V: 0.934, scoreTFIDF: 0.580, scoreCount: 0.577, scoreGloVe: 0.642, scoreFused: 0.941 },
        { rank: 8, name: 'Santa Cruz Lion God Rasta Drop Thru Cruzer Longboard', subcat: 'Sports & Outdoors | Outdoor Recreation', scoreW2V: 0.928, scoreTFIDF: 0.550, scoreCount: 0.500, scoreGloVe: 0.630, scoreFused: 0.934 },
        { rank: 9, name: 'Loaded Boards Tan Tien Bamboo Longboard Skateboard Complete', subcat: 'Sports & Outdoors | Outdoor Recreation', scoreW2V: 0.925, scoreTFIDF: 0.542, scoreCount: 0.500, scoreGloVe: 0.621, scoreFused: 0.929 },
        { rank: 10, name: 'Yocaher Special Graphic Complete Pintail Longboard', subcat: 'Sports & Outdoors | Outdoor Recreation', scoreW2V: 0.918, scoreTFIDF: 0.510, scoreCount: 0.500, scoreGloVe: 0.612, scoreFused: 0.922 }
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
        { rank: 2, name: 'Monster High Deluxe Clawdeen Wolf Costume - Small', subcat: 'Clothing, Shoes & Jewelry | Costumes & Accessories', scoreW2V: 0.959, scoreTFIDF: 0.821, scoreCount: 0.750, scoreGloVe: 0.912, scoreFused: 0.974 },
        { rank: 3, name: "Ever After High Blondie Lockes Costume, Child's Small", subcat: 'Clothing, Shoes & Jewelry | Costumes & Accessories', scoreW2V: 0.955, scoreTFIDF: 0.785, scoreCount: 0.707, scoreGloVe: 0.895, scoreFused: 0.968 },
        { rank: 4, name: "Rubie's Monster High Haunted Spectra Vondergeist Child Costume Dress", subcat: 'Clothing, Shoes & Jewelry | Costumes & Accessories', scoreW2V: 0.951, scoreTFIDF: 0.762, scoreCount: 0.667, scoreGloVe: 0.884, scoreFused: 0.961 },
        { rank: 5, name: 'Monster High Sweet 1600 Deluxe Draculaura Costume, Small', subcat: 'Clothing, Shoes & Jewelry | Costumes & Accessories', scoreW2V: 0.950, scoreTFIDF: 0.750, scoreCount: 0.667, scoreGloVe: 0.879, scoreFused: 0.959 },
        { rank: 6, name: "Rubie's Costume Monster High Frankie Stein Wig", subcat: 'Clothing, Shoes & Jewelry | Costumes & Accessories', scoreW2V: 0.941, scoreTFIDF: 0.710, scoreCount: 0.632, scoreGloVe: 0.862, scoreFused: 0.950 },
        { rank: 7, name: 'Disguise Costumes Ever After High Madeline Hatter Wig', subcat: 'Clothing, Shoes & Jewelry | Costumes & Accessories', scoreW2V: 0.936, scoreTFIDF: 0.680, scoreCount: 0.577, scoreGloVe: 0.849, scoreFused: 0.942 },
        { rank: 8, name: "Rubie's Costume Girls Monster High Cleo De Nile Wig", subcat: 'Clothing, Shoes & Jewelry | Costumes & Accessories', scoreW2V: 0.929, scoreTFIDF: 0.660, scoreCount: 0.577, scoreGloVe: 0.835, scoreFused: 0.936 },
        { rank: 9, name: 'Monster High Operetta Deluxe Costume, Medium', subcat: 'Clothing, Shoes & Jewelry | Costumes & Accessories', scoreW2V: 0.924, scoreTFIDF: 0.645, scoreCount: 0.550, scoreGloVe: 0.822, scoreFused: 0.930 },
        { rank: 10, name: "Rubie's Child's Monster High Toralei Stripe Costume, Small", subcat: 'Clothing, Shoes & Jewelry | Costumes & Accessories', scoreW2V: 0.919, scoreTFIDF: 0.630, scoreCount: 0.550, scoreGloVe: 0.814, scoreFused: 0.924 }
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
        { rank: 3, name: 'Beyerdynamic DT 770 PRO 80 Ohm Studio Headphones', subcat: 'Electronics | Audio & Video Accessories', scoreW2V: 0.928, scoreTFIDF: 0.610, scoreCount: 0.577, scoreGloVe: 0.798, scoreFused: 0.954 },
        { rank: 4, name: 'Shure SRH440 Professional Studio Headphones', subcat: 'Electronics | Audio & Video Accessories', scoreW2V: 0.921, scoreTFIDF: 0.590, scoreCount: 0.577, scoreGloVe: 0.785, scoreFused: 0.947 },
        { rank: 5, name: 'AKG K240 Studio Semi-Open Over-Ear Professional Headphones', subcat: 'Electronics | Audio & Video Accessories', scoreW2V: 0.915, scoreTFIDF: 0.565, scoreCount: 0.500, scoreGloVe: 0.772, scoreFused: 0.940 },
        { rank: 6, name: 'Sony MDR-ZX110 Over-Ear Dynamic Stereo Headphones', subcat: 'Electronics | Audio & Video Accessories', scoreW2V: 0.908, scoreTFIDF: 0.540, scoreCount: 0.500, scoreGloVe: 0.760, scoreFused: 0.932 },
        { rank: 7, name: 'Koss Porta Pro On-Ear Headphone with Case', subcat: 'Electronics | Audio & Video Accessories', scoreW2V: 0.899, scoreTFIDF: 0.510, scoreCount: 0.447, scoreGloVe: 0.745, scoreFused: 0.925 },
        { rank: 8, name: 'Philips Audio SHP9500 HiFi Precision Stereo Over-Ear Headphones', subcat: 'Electronics | Audio & Video Accessories', scoreW2V: 0.892, scoreTFIDF: 0.490, scoreCount: 0.408, scoreGloVe: 0.732, scoreFused: 0.918 },
        { rank: 9, name: 'Panasonic ErgoFit In-Ear Earbud Headphones RP-HJE120K', subcat: 'Electronics | Audio & Video Accessories', scoreW2V: 0.885, scoreTFIDF: 0.470, scoreCount: 0.408, scoreGloVe: 0.720, scoreFused: 0.911 },
        { rank: 10, name: 'Bose SoundLink Around-Ear Wireless Headphones II', subcat: 'Electronics | Audio & Video Accessories', scoreW2V: 0.878, scoreTFIDF: 0.450, scoreCount: 0.354, scoreGloVe: 0.708, scoreFused: 0.904 }
      ]
    }
  };

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
  // 2. STATE STORE
  // -------------------------------------------------------------
  let state = {
    activeSeedId: 'puzzle',
    activeVec: 'w2v',
    activeMetric: 'cosine',
    topK: 5
  };

  // -------------------------------------------------------------
  // 3. UI CONTROLLER: TABS & THEME
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
  // 4. INTERACTIVE CONTROLS
  // -------------------------------------------------------------
  const presetBtns = document.querySelectorAll('.preset-btn');
  const vecBtns = document.querySelectorAll('#vectorizerSelector .segment-btn');
  const metricBtns = document.querySelectorAll('#metricSelector .segment-btn-h');
  const topKSlider = document.getElementById('topKSlider');
  const topKVal = document.getElementById('topKVal');

  presetBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      presetBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.activeSeedId = btn.getAttribute('data-seed');
      renderActiveSeed();
      renderRecommendations();
    });
  });

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
  // 5. RENDER FUNCTIONS
  // -------------------------------------------------------------
  function renderActiveSeed() {
    const seed = SEEDS[state.activeSeedId];
    if (!seed) return;

    document.getElementById('seedName').textContent = seed.name;
    document.getElementById('seedSubcat').textContent = seed.subcat;
    document.getElementById('seedRowId').textContent = `Row #${seed.rowId}`;

    const tokensList = document.getElementById('seedTokens');
    tokensList.innerHTML = seed.tokens.map(t => `<span class="token">${t}</span>`).join('');
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
      density.textContent = 'Sparse (5/1500 active)';
    } else if (state.activeVec === 'count') {
      badge.textContent = '1500 dims · Sparse';
      density.textContent = 'Sparse (5/1500 active)';
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
    const seed = SEEDS[state.activeSeedId];
    if (!seed) return;
    const profile = seed.vectorProfiles[state.activeVec] || seed.vectorProfiles.w2v;
    const container = document.getElementById('vectorSparkline');
    
    container.innerHTML = profile.map(val => {
      const heightPct = Math.max(8, Math.min(100, Math.round(Math.abs(val) * 100)));
      const opacity = Math.max(0.25, Math.abs(val));
      return `<div class="spark-bar" style="height: ${heightPct}%; opacity: ${opacity};" title="Val: ${val.toFixed(2)}"></div>`;
    }).join('');
  }

  function renderRecommendations() {
    const seed = SEEDS[state.activeSeedId];
    if (!seed) return;

    const listContainer = document.getElementById('recommendationsList');
    const key = `${state.activeVec}_${state.activeMetric}`;
    const top1Score = seed.top1Scores[key] !== undefined ? seed.top1Scores[key] : 0.925;
    
    document.getElementById('top1ScoreDisplay').textContent = 
      state.activeMetric === 'cosine' ? top1Score.toFixed(3) : top1Score.toFixed(state.activeVec === 'tfidf' ? 3 : 1);

    const items = seed.recommendations.slice(0, state.topK);
    let relevantHits = 0;

    listContainer.innerHTML = items.map((rec, idx) => {
      const isMatch = rec.subcat === seed.subcat;
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
    const prec = relevantHits / state.topK;
    document.getElementById('currentPrecDisplay').textContent = prec.toFixed(2);
  }

  // -------------------------------------------------------------
  // 6. POPULATE BENCHMARK TABLES
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
  // 7. CATALOG SEARCH SIMULATOR
  // -------------------------------------------------------------
  const searchInput = document.getElementById('catalogSearch');
  const suggestionsBox = document.getElementById('searchSuggestions');

  const CATALOG_ITEMS = [
    { id: 'puzzle', name: 'Woodstock- Collage 500 pc Puzzle', sub: 'Toys & Games | Puzzles' },
    { id: 'longboard', name: 'DB Longboards CoreFlex Crossbow 41" Bamboo Fiberglass', sub: 'Sports & Outdoors | Outdoor Recreation' },
    { id: 'costume', name: "Rubie's Child's Monster High Clawdeen Wolf Costume, Small", sub: 'Clothing, Shoes & Jewelry | Costumes & Accessories' },
    { id: 'headphone', name: 'Sony MDR-7506 Professional Studio Headphone', sub: 'Electronics | Audio & Video Accessories' },
    { id: 'puzzle', name: 'Ravensburger 14796 Tropical Traffic Jigsaw Puzzle (500 Piece)', sub: 'Toys & Games | Puzzles' },
    { id: 'longboard', name: 'Retrospec Rift Drop-Through Longboard Skateboard Complete', sub: 'Sports & Outdoors | Outdoor Recreation' },
    { id: 'costume', name: 'Ever After High Blondie Lockes Costume, Child\'s Small', sub: 'Clothing, Shoes & Jewelry | Costumes & Accessories' }
  ];

  searchInput.addEventListener('input', (e) => {
    const q = e.target.value.toLowerCase().trim();
    if (!q) {
      suggestionsBox.classList.remove('show');
      return;
    }

    const matches = CATALOG_ITEMS.filter(item => 
      item.name.toLowerCase().includes(q) || item.sub.toLowerCase().includes(q)
    );

    if (matches.length > 0) {
      suggestionsBox.innerHTML = matches.map(m => `
        <div class="suggestion-item" data-id="${m.id}">
          <span class="sugg-name">${m.name}</span>
          <span class="sugg-sub">${m.sub}</span>
        </div>
      `).join('');
      suggestionsBox.classList.add('show');

      suggestionsBox.querySelectorAll('.suggestion-item').forEach(item => {
        item.addEventListener('click', () => {
          const sid = item.getAttribute('data-id');
          state.activeSeedId = sid;
          presetBtns.forEach(b => {
            if (b.getAttribute('data-seed') === sid) b.classList.add('active');
            else b.classList.remove('active');
          });
          renderActiveSeed();
          renderRecommendations();
          suggestionsBox.classList.remove('show');
          searchInput.value = '';
        });
      });
    } else {
      suggestionsBox.innerHTML = '<div style="padding: 0.75rem; font-size: 0.75rem; color: var(--text-muted);">No products found matching query.</div>';
      suggestionsBox.classList.add('show');
    }
  });

  document.addEventListener('click', (e) => {
    if (!searchInput.contains(e.target) && !suggestionsBox.contains(e.target)) {
      suggestionsBox.classList.remove('show');
    }
  });

  // -------------------------------------------------------------
  // 8. INITIALIZE
  // -------------------------------------------------------------
  renderActiveSeed();
  updateVectorMeta();
  updateMetricMeta();
  renderRecommendations();
  renderTable7();
  renderTable11();
  renderAblation();
});
