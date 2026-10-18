# Content-Based Product Recommendation: Vectorization & Similarity Benchmark

Partial reproduction, custom implementation, and ablation study of **"A Comprehensive Analysis of Text Similarity Metrics and Vectorization Techniques for Content-Based Product Recommendation"** (Oprea et al., *IEEE Access*, Vol. 14, 2026).

## 1. Overview & Problem Statement
This repository benchmarks **12 combinations** of text vectorization methods (`Count Vectorizer`, `TF-IDF`, `Word2Vec`, `GloVe`) and similarity/distance metrics (`Cosine Similarity`, `Manhattan Distance`, `Euclidean Distance`) for **Top-10 Content-Based Filtering (CBF)** and **cold-start product recommendation** on short retail product titles.

* **Dataset:** Hugging Face Hub [`bprateek/amazon_product_description`](https://huggingface.co/datasets/bprateek/amazon_product_description) (10,002 raw rows; 10,001 valid product records across 108 fine-grained subcategories after filtering `-` placeholder artifacts).

## 2. Custom From-Scratch Implementations (Part C)
Rather than relying on black-box similarity wrappers, the core mathematical components from Section III of the paper are implemented directly in vectorized `NumPy`:
* `cosine_sim_scratch(A, B)`: Implements Equations (1)–(3) for angular vector similarity.
* `manhattan_dist_scratch(A, B)`: Implements Equation (4) ($L_1$ taxicab norm).
* `euclidean_dist_scratch(A, B)`: Implements Equation (5) ($L_2$ geometric distance).
* `ScratchTFIDF`: Implements Equations (6)–(8) for corpus-level Term Frequency–Inverse Document Frequency weighting with $L_2$ normalization.
* `pool_embeddings`: Implements sum-pooled 300-dimensional Skip-Gram `Word2Vec` and pre-trained `GloVe` document representations.

## 3. Experimental Summary (500-Seed Evaluation)

| Model Configuration | Precision@10 | Recall@10 | NDCG@10 |
| :--- | :---: | :---: | :---: |
| **Word2Vec (300d) + Cosine (Selected)** | **0.524** | **0.404** | **0.722** |
| **Count Vectorizer + Cosine (Baseline)** | 0.489 | 0.378 | 0.708 |
| **GloVe + Cosine** | 0.423 | 0.327 | 0.678 |
| **TF-IDF (Scratch) + Euclidean (Selected)** | 0.246 | 0.190 | 0.579 |

### Ablation Study & Proposed Improvement
| Configuration | Precision@10 | Recall@10 | NDCG@10 |
| :--- | :---: | :---: | :---: |
| 1. Word2Vec + Cosine (Cleaned Title - Default) | 0.524 | 0.404 | 0.722 |
| 2. Ablation: Word2Vec + Euclidean ($L_2$ Distance) | 0.496 | 0.383 | 0.710 |
| 3. Ablation: Word2Vec + Manhattan ($L_1$ Distance) | 0.497 | 0.383 | 0.710 |
| 4. Ablation: Word2Vec + Cosine (No Text Cleaning) | 0.516 | 0.398 | 0.711 |
| **5. Improvement: Word2Vec + Cosine (`Product Name` + `About Product`)** | **0.586** | **0.454** | **0.801** |

## 4. Repository Structure
* `Part_C_Implementation.ipynb`: Main Jupyter/Colab notebook containing data cleaning, custom NumPy algorithms, 3 qualitative case studies, 500-seed evaluation, and ablation study.
* `Group5_Complete_Submission_Report.docx`: Full written report (Parts A, B, C, and Critical Analysis).
* `Group5_Presentation.pptx`: Slide deck for presentation and viva.
* `PartC_Experimental_Results.png`: High-resolution evaluation plots.
* `requirements.txt`: Python package dependencies.

## 5. How to Run
```bash
pip install -r requirements.txt
jupyter notebook Part_C_Implementation.ipynb
```
