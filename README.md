# RS Case Study: Content-Based Product Recommendation (Group 5)

Partial reproduction of Oprea et al., *A Comprehensive Analysis of Text Similarity Metrics and Vectorization
Techniques for Content-Based Product Recommendation* (IEEE Access, 2026).
Dataset: Hugging Face `bprateek/amazon_product_description` (10,001 valid products, 108 subcategories).

## Files
- `RS_Casestudy_fixed.ipynb`: notebook version (Run All)
- `rs_case_study_fixed.py`: identical code as a script
- `requirements.txt`: dependencies
- `results/` (created on run): `table7.csv`, `table11_main.csv`, `table_ablation.csv`, `PartC_Experimental_Results.png`

## Run
```
pip install -r requirements.txt
python rs_case_study.py
```
First run needs internet (Hugging Face dataset, NLTK data, GloVe via gensim). CPU only, no GPU. Runtime is roughly
30 s for vectorization plus the one-off GloVe download.

## Implemented from scratch (NumPy)
Cosine, Manhattan and Euclidean (paper Eq. 1-5); TF-IDF (Eq. 6-8); embedding pooling; Top-K retrieval; Precision,
Recall and NDCG@K. Library-provided: CountVectorizer (baseline), Word2Vec training (gensim), pre-trained GloVe.

## Experiments
- **Table 7:** 12 vectorizer x metric configurations, top-1 score on three case-study products. Raw scores are not
  comparable across vectorizers.
- **Table 11:** 500 random seed products. A retrieved item is relevant if it shares the seed's top-2-level category.
  Baseline: Count Vectorizer + Cosine.
- **Ablation:** distance metric, pooling (sum vs mean), text cleaning (Word2Vec retrained on uncleaned text), and the
  Title + About Product fusion. All Word2Vec models use identical hyper-parameters. A control row (embeddings trained
  on the fused corpus, title only pooled) separates better embeddings from a richer document.
- Bootstrap 95% confidence intervals and paired significance tests against the baseline.

## Metric definitions
- Precision@10 = relevant items in the top 10 / 10.
- Recall@10 = relevant items retrieved / all other items in the seed's subcategory. It is small by construction
  because each subcategory has hundreds of items, so use it for relative comparison.
- NDCG@10 uses the global ideal DCG: min(10, number of relevant items) relevant results at the top.

## Reproducibility
Fixed seed (`SEED=42`), Word2Vec `workers=1` for deterministic training. Set `PYTHONHASHSEED=0` for bit-exact reruns.
All-zero (empty) vectors are excluded as neighbours, and seeds with empty Count/TF-IDF vectors are excluded for
every model (`EXCLUDE_EMPTY_SEEDS`). The number dropped is printed. Optionally fill `PAPER_TABLE7` in the script with
the paper's Table 7 values to print deltas.

## Limitations
Relevance is a coarse category-match proxy. Word2Vec is trained on the same catalogue it retrieves from
(unsupervised, no labels). HNSW and Sentence-BERT indexing is a proposed extension and is not evaluated here.

