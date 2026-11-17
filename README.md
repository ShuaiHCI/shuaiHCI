Hi, this is shuai's personal webpage repo.
If you like this webpage template, feel free to star and fork it.

### Site pages

`index.html` is Home. Group, Publications, News, and Activities have separate static pages that share `personal_webpage_files/academic-pages.css`. Home lists current projects. The Group page introduces the Human-Aware AI (HAAI) Research Group within the ISCAS HCI Lab and lists its members, openings and funding.

### Maintaining research areas

The homepage presents human–AI collaboration and hybrid intelligence through research contributions, rather than application domains. Each `.paper` in `publications.html` has a pipe-separated `data-areas` attribute.

| Category key | Scope |
| --- | --- |
| `User Modeling` | Understanding or modeling human goals, beliefs, intentions, capabilities, preferences, and behavior. Includes empirical user understanding, not only computational modeling. |
| `Trust Calibration` | Human confidence, appropriate reliance, calibration, and trust in human–AI teams. |
| `Explainable AI` | Explanations, transparency, interpretability, and understanding model or agent behavior. |
| `Human-AI Collaboration` | Collaborative roles, interaction mechanisms, deliberation, and complementary contributions. |
| `AI4Science / Social Science` | AI-assisted scientific work and agent-mediated social inquiry. An empirical user study alone is not enough for this label. |

Use multiple areas when supported by the paper. The full archive includes every paper. Add the `data-selected` attribute to representative papers, keep the visible research areas in the summary in sync, and include the teaser image’s intrinsic width and height. The publication search lives in `personal_webpage_files/publications.js`.
