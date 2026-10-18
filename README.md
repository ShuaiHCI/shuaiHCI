Hi, this is shuai's personal webpage repo.
If you like this webpage template, feel free to star and fork it.

### Maintaining research areas

The homepage presents human–AI collaboration and hybrid intelligence through research contributions, rather than application domains. Each publication in `index.html` has a comma-separated `data-category` and matching links in `.pub-topics`.

| Category key | Scope |
| --- | --- |
| `User Modeling` | Understanding or modeling human goals, beliefs, intentions, capabilities, preferences, and behavior. Includes empirical user understanding, not only computational modeling. |
| `Trust Calibration` | Human confidence, appropriate reliance, calibration, and trust in human–AI teams. |
| `Explainable AI` | Explanations, transparency, interpretability, and understanding model or agent behavior. |
| `Human-AI Collaboration` | Collaborative roles, interaction mechanisms, deliberation, and complementary contributions. |
| `AI4Science / Social Science` | AI-assisted scientific work and agent-mediated social inquiry. An empirical user study alone is not enough for this label. |

Use multiple areas when supported by the paper. Keep `All` on every paper and add `Selected` for representative work. Match topic links' `data-research-filter` values to the category keys above. The research overview, filters, and search keywords in `personal_webpage_files/site.js` use the same vocabulary.
