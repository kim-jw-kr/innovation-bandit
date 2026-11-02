# Explore / Identify: Innovation Strategy Lab (v7)

An offline-capable, single-file browser game for teaching **exploration vs. exploitation** and **best-arm identification**. Students receive five free noisy starting observations (one per technology), spend a fixed budget of experiments, and then recommend the technology with the highest *true expected* payoff. Every student decision, including Trial 1, contributes to the exploration measures.

**What changed in v7**

- **Every student run is randomized independently.** The session key fixes the *set* of five hidden true means (same difficulty for the whole class), but each run draws its own free starting observations and its own payoff noise from a fresh cryptographically random **Run ID**. Replays also get new draws. In v6, all students on one class link saw identical numbers.
- **Instructor choice of randomization scope.** `Independent per student` (default) also shuffles which letter carries which mean per run, so students cannot copy a neighbor's "C is best". `Shared class assignment` keeps the same letters for everyone, so the instructor answer key applies to the whole class.
- **Softmax temperature estimate τ̂.** Besides the two descriptive indices (binary τb and gap-weighted τw), the results page now fits the softmax choice rule used in bandit models of organizational learning by maximum likelihood and reports τ̂ with a 95% profile-likelihood interval and a McFadden pseudo-R².
- CSV adds `run_id`, `randomization_mode`, the full vector of pre-decision sample means per trial, and the softmax fit.
- **Closer true payoffs.** The three weaker means now lie within 12 points below the runner-up, so all five technologies sit in an 18-point band instead of spreading down to 70.
- **Starting trap.** The five free starting observations are redrawn (deterministically from the Run ID) until the true best technology does *not* show the highest starting value. Every student begins with a tempting wrong leader, so pure greedy play fails by construction. Do not disclose this rule to students.
- **Default budget of 20 trials.** 30 and 40 remain selectable in the instructor dialog. At 20 trials a good explorer still finds the best technology about 72% of the time against 46% for greedy, and a run takes about four minutes, leaving time for a second play.
- **Single, bounded noise level.** Payoff noise is uniform on ±12 points (v6: Gaussian σ = 12 with selectable levels); the noise options are gone from the home page, the instructor dialog and class links.
- **Card redesign.** Each technology card shows its running average (free draw plus all tests) and its latest payoff. A test now takes two clicks: select a card, then confirm on it (Cancel or Esc backs out), so accidental tests are avoided.
- **Class dashboard with live round control.** `dashboard.html` collects the whole class's results and plots identification success against τ (see *Class dashboard* below). The instructor runs the class in **rounds**: each round has its own noise level ±γ (any value 0–40), test budget and letter assignment, is opened and closed from the dashboard, and draws a fresh set of hidden means. Results are tabbed by round, with an all-rounds view and a round-by-round comparison table. Results arrive live through Firebase when `config.js` is filled in; otherwise students copy a one-line result code from their results page and the instructor pastes the codes in.
- **Adjustable noise.** γ is no longer fixed at 12: it is set per round on the dashboard, or with `?gamma=` on a class link, or in Instructor setup. The reference curve on the dashboard is simulated in the browser for the exact γ and budget of the round.

The previous version is kept as `index_v6_backup.html`.

## Run and share

1. Open `index.html` in a browser (a local file works for play; a hosted copy is needed only for generating class links).
2. To publish it for students, upload `index.html`, `dashboard.html` and `config.js` to a static web host such as GitHub Pages.
3. On the hosted page, select **Instructor setup**, choose a session key, noise level, trial budget and randomization scope, and copy the student class link.
4. All students on the same link face the **same set of hidden true means**, but each sees **their own free observations and payoff draws**. Each results page and CSV shows a Run ID that reproduces that student's draws exactly.

URL parameters: `seed` (session key), `rounds` (tests per game, 5–60; default 20), `gamma` (noise half-width 0–40; default 12), `round` (round number; each round draws a fresh set of hidden means from the same session key), `mode` = `student|shared`, `class=1` (locks settings and hides instructor tools). When Firebase is configured, a class link only needs `class=1` and `seed`: round, γ, budget and mode then follow the dashboard's round control live.

Students need no account. Class settings are not secure; answers are inspectable in the page source. Results are collected with the class dashboard described next.

## Class dashboard

`dashboard.html` is the instructor's master page: it collects every student's final result and shows

- a chart with **τ on the x-axis and identification success on the y-axis**: bars give the share of students in each τ bin who recommended the true best technology (with the `found/total` count above each bar), dots show individual students (top row = found, bottom row = missed), and a dashed curve shows the simulated success rate of a softmax agent with that τ (from `tau_sweep_results.csv`, for the class's trial budget);
- a stacked count histogram of students per τ bin, found versus missed;
- two tables, **students who found the best technology** and **students who missed**, with each student's τ̂, τb, τw, number of non-greedy tests, pick versus true best, identification loss and the full test sequence (click a column to sort, a row to highlight that student in the charts);
- summary tiles: number of students, share who found the best with a 95% interval, median τ̂ of finders versus missers, and the probability that a random finder has a higher τ than a random misser (50% means τ is unrelated to success).

**Rounds.** The *Round control* bar at the top of the dashboard sets the session key, round number, noise ±γ (slider or number, 0–40), tests per game (5–60) and letter assignment, and has **Open round**, **Close round** and **Next round**. Student pages on the class link follow it live: while a round is closed they show "Round N is closed, wait for your instructor" and cannot start; when it opens they can start, and after finishing they see "Start round N+1" once the next round opens. Each round draws a fresh set of hidden means (session key + round), and every result carries its round number and γ. Tabs above the charts switch between **All rounds** and each round; the all-rounds view adds a *Rounds compared* table (γ, budget, students, share who found the best with a 95% interval, median τ̂, share of pure-greedy players, and the simulated greedy / best-τ benchmarks for that γ and budget). Round settings live in the Firestore document `bandit_settings/session`; without Firebase, set `round` and `gamma` in the student link instead (the link builder has fields for them).

**Reference curve.** The dashed curve is computed in the browser: softmax agents with fixed τ play the exact game (same hidden-mean rule, starting trap, uniform noise ±γ and budget as the rows in view; 1,500 games per τ point, cached per γ and budget). It reproduces `simulate_tau.py` within sampling error (for example 46% greedy / 72% best τ at ±12 and 20 tests).

The τ measure is switchable (softmax τ̂ on a log scale, binary τb, weighted τw), the number of bins is adjustable, replays can be excluded (first attempt per student and round) and the data can be filtered by session key. **Download CSV** exports one row per student for the round in view; **Student link / QR** builds the class link.

**Two ways to collect results**

1. *Manual (no setup).* Each student's results page shows a **Copy result code** button, a single line that starts with `IDLAB1|`. Students paste it into whatever channel you use (KakaoTalk, Zoom chat, a Google Form, e-mail). In the dashboard choose **Import results** and paste all the codes at once; extra text around the codes is ignored and duplicates are skipped. The dashboard also accepts dropped files: students' decision CSVs or a CSV exported from the dashboard itself. Imported results stay in the instructor's browser (localStorage) until cleared.
2. *Live (free, about ten minutes once).* Fill in `config.js` with a Firebase web-app config and publish `firestore.rules`; every finished game is then written to Firestore and the dashboard updates live. Steps:
   1. <https://console.firebase.google.com> → **Add project** (or reuse an existing one, such as the bean-counting project; Analytics can be off).
   2. **Build → Firestore Database → Create database** (region `asia-northeast3`, production mode).
   3. **Rules** tab → paste the contents of `firestore.rules` → **Publish**. The rules allow anyone to add one well-formed result per Run ID, nobody to edit, deletes (for the dashboard's cleanup), and reads and writes of the round-control document `bandit_settings/session`.
   4. Gear → **Project settings → Your apps → Web app** → copy the `firebaseConfig` object into `config.js`.
   5. Upload `index.html`, `dashboard.html` and `config.js` to the host. Share only the student link; keep the dashboard link to yourself.

   Firestore's free tier (50,000 reads and 20,000 writes a day) is far above what a class needs: one write per finished game and a few hundred reads per dashboard session. Deleting results from the database asks for the `adminPin` in `config.js` once per visit.

The student record holds only the summary of a game (session key, round, Run ID, name, settings including γ, final pick, true best, the three τ measures with the τ̂ interval, non-greedy count, technologies retested, payoff, test sequence, starting observations and true means), not the per-trial log; students keep the full CSV.

## Randomization

Three layers, all deterministic functions of text keys hashed with FNV-1a and scrambled with a mulberry-style mixer:

| Layer | Keyed on | Varies across |
|---|---|---|
| Set of five true means | session key | classes |
| Assignment of means to letters A–E | session key (`shared`) or session key + Run ID (`student`, default) | classes / every run |
| Free starting observations and every paid payoff | session key + Run ID | every run |

The free starting observations carry one extra rule: attempt 0, 1, 2, … of the five draws is taken from the Run ID stream, and the first attempt in which some other technology's draw strictly exceeds the true best technology's draw is kept. The accepted draws are genuine samples from the payoff distributions, but conditioned on the best technology not leading at the start (roughly a third of unconditioned attempts are rejected). The instructor dialog states this; the student-facing pages do not.

The Run ID is eight characters drawn from `crypto.getRandomValues` at every game start, so two students (or two replays by one student) never share a noise stream.

The value set is drawn as follows: the best true mean is a random integer in **92–100**, the runner-up is **2–6 points** below it, and the other three are sampled without replacement from **(runner-up − 12)** through (runner-up − 1). All five are distinct, so there is exactly one best technology, and all five sit inside an **18-point band** (never below 74). v6 drew the weaker three from 70 upward, which made them too easy to eliminate at low noise; the compressed band keeps every technology tempting. Uniform noise on **[−γ, γ]** (γ = 12 by default, set per round; see *Noise level*) is added to every observation, so observed payoffs can fall somewhat outside the band of true means.

Checked on 5,000 session keys: each letter is best 20% of the time, the top value is uniform on 92–100, and the top-two gap is uniform on 2–6. Checked on 2,000 sequential draws: mean ≈ 0, SD ≈ 1, lag-1 autocorrelation ≈ 0, no cross-arm correlation.

## Noise level

Every observation is the true mean plus a shock drawn **uniformly on [−γ, γ] with γ = 12**, rounded to an integer (equivalent standard deviation γ/√3 ≈ 6.9). Noise is therefore bounded: no observation is ever more than 12 points from its true mean, but within that range every value is equally likely. v6 used Gaussian noise with σ = 12, which produced occasional 30-point outliers; the uniform form was adopted in v7 so students can reason about a hard bound.

`simulate_tau.py` runs softmax agents with a sweep of temperatures τ on the exact game mechanics (20,000 games per point; results in `tau_sweep_results.csv`, `tau_sweep_summary.csv` and `tau_sweep.png`). With 30 trials:

| Noise half-width | Greedy P(correct) | Best softmax P(correct) (τ) | Random P(correct) | Payoff/trial: greedy → best-τ |
|---|---|---|---|---|
| ±12 | 0.48 | 0.80 (τ ≈ 6) | 0.72 | 93.1 → 92.0 |
| ±24 | 0.34 | 0.55 (τ ≈ 12) | 0.50 | 91.5 → 90.5 |
| ±32 | 0.29 | 0.46 (τ ≈ 16) | 0.42 | 90.9 → 90.0 |

Three findings drive the design:

- **Identification has an interior optimum** at τ of roughly 4–8 payoff points at γ = 12, with a plateau. Greedy play loses about 30 percentage points against it, and uniform random choice beats greedy at every noise level, because the starting trap always hands the greedy player a wrong leader.
- **Payoff has no interior optimum**: any τ below about 1.5 is payoff-maximal, and exploration costs about one point per trial at the identification-optimal τ. This is the exploration/exploitation trade-off in one picture.
- **Wider noise swamps strategy.** At ±24 one observation can sit anywhere in a 48-point window, wider than the whole 18-point band of true means, and even the best agent is right only 55% of the time.

**γ = 12 is the default and the recommended first round.** Since the class dashboard gained round control, γ can be set per round (0–40), so a second round at ±24 lets the class see luck swamp strategy; the dashboard simulates the matching reference curve for whatever γ and budget a round uses.

`test_strategies.py` asks whether the best technology is findable at all (40,000 games per cell, 30 trials): greedy 0.48, round-robin 0.74, softmax τ = 8 0.79, UCB 0.82, top-two Thompson sampling 0.83, and an oracle that already knows the top two 0.90. Landing in the true top two is near-certain for any exploring strategy (0.95–0.97). At the default 20 trials the same strategies give greedy 0.46, round-robin 0.66, softmax 0.71, UCB 0.75, top-two Thompson sampling 0.74 and the oracle 0.85, with any explorer landing in the top two about 93% of the time. Accuracy is governed by the 2–6 point top-two gap: top-two Thompson sampling is right 65% of the time at a 2-point gap and 97% at 6 points.

## Game mechanics

| Item | Rule |
|---|---|
| Goal | Identify the one technology with the highest *true expected* payoff |
| Technologies | A, B, C, D, E |
| Underlying expected payoffs | Five distinct values inside an 18-point band: top 92–100, runner-up 2–6 below, three more within 12 points below the runner-up |
| Noisy payoff | `round(mu_i + epsilon)`, `epsilon ~ Uniform(-gamma, gamma)`, gamma = 12 |
| Free starting evidence | One noisy observation for each technology, before Trial 1, conditioned so the true best does not hold the highest starting value |
| Noise | uniform on ±γ; γ set per round (default 12, range 0–40) |
| Experiment budget | 20 additional trials by default (also 30 or 40) |
| Final step | Recommend one technology before the true means are revealed |

For each technology `i`, the running sample mean after `n_i` additional tests is

```
observed_mean_i = (free_start_i + sum(additional_payoffs_i)) / (1 + n_i)
```

## Exploration measures

Let `m_i,t-1` be the observed sample mean of technology `i` *before* student choice `t`, `m_best,t-1 = max_i m_i,t-1`, and `g_t = max(0, m_best,t-1 - m_chosen,t-1)`. `T` is the number of student-selected trials. The five free observations are not choices and never enter the numerator or denominator.

**1. Binary exploration index** (descriptive)

```
tau_b = sum_t 1[g_t > 0] / T
```

**2. Payoff-gap-weighted exploration index** (descriptive)

```
w_t   = min(1, g_t / (2 * gamma))
tau_w = sum_t w_t / T
```

**3. Softmax temperature** (model-based, maximum likelihood)

The choice model is the softmax rule standard in bandit models of organizational learning:

```
P(choose i at t) = exp(m_i,t-1 / tau) / sum_j exp(m_j,t-1 / tau)
```

`tau` is in payoff points. `tau -> 0` is the greedy rule; large `tau` approaches uniform random choice. The page maximizes the log-likelihood of the student's full choice sequence on a log-spaced grid of 600 points from 0.05 to 500 and reports:

- `tau_hat`, the maximizer;
- a 95% profile-likelihood interval (all grid values whose log-likelihood is within 1.92 of the maximum);
- McFadden pseudo-R² = `1 - LL(tau_hat) / LL_uniform`, where `LL_uniform = -T * ln 5`.

Boundary cases are labeled rather than reported as numbers: an all-greedy sequence gives `tau_hat < 0.05` (only an upper bound is identified); a sequence that never follows the leader gives `tau_hat > 500` (only a lower bound).

Interpretation notes for class: `tau_b` and `tau_w` are descriptive frequencies; `tau_hat` assumes a stationary softmax rule, which real students rarely follow exactly (many explore early and exploit late). None of the three measures decision quality, and repeatedly choosing an obviously poor option raises all of them. Compare students only under the same noise setting and session key.

## Results and CSV

The results page displays identification outcome and loss, the three exploration measures with their formulas, a per-trial decision log with exploration weights, the true means versus the student's sample means, and the Run ID.

The CSV has **five `record_type=initial` rows** (`trial=0`, the free observations) followed by `T` rows with `record_type=choice`. Columns:

`record_type, student, session_key, run_id, randomization_mode, noise_gamma, trial_budget, trial, technology, observation_number_for_option, observed_payoff, observed_mean_before, best_observed_mean_before, observed_means_before_all, observed_gap_before, exploratory_choice, exploration_weight, running_paid_payoff, final_recommendation, true_best, correct_identification, tau_exploration_index, tau_weighted_exploration_index, softmax_tau_mle, softmax_tau_ci_low, softmax_tau_ci_high, softmax_pseudo_r2, softmax_log_likelihood, identification_loss, technology_true_mean`

`observed_means_before_all` holds all five pre-decision sample means (`A=..;B=..;...`), so the softmax likelihood and both indices can be recomputed from the choice rows alone.

## Suggested class discussion

Ask: *If the option with the highest first observation is not truly best, how much evidence should students gather from the apparently inferior alternatives?* Then plot correct identification against `tau_b`, `tau_w` and `tau_hat` across submissions. Since every student faced the same value set but different noise, differences in outcomes mix strategy and luck, which is itself a useful point about learning from small samples.

## Technical validation (v7)

Tested in Chromium:

- Three consecutive runs on one class link produced three Run IDs and three different sets of free observations, with the same true value set.
- `mode=shared`: two runs had identical true means per letter and different payoff draws.
- Instructor dialog: class link carries `mode`; answer key shows letters in shared mode and ranked values in per-student mode.
- Mixed 20-trial policy: page values `tau_b = 0.25`, `tau_w = 0.05`, `tau_hat = 5.61` matched an independent recomputation from the recorded pre-decision means (golden-section MLE 5.58, within grid resolution).
- All-greedy policy: `tau_b = tau_w = 0`, `tau_hat` reported as `< 0.05`.
- CSV rows reconstruct every pre-decision mean, gap, weight and payoff.

Standalone source: `index.html`. No external libraries or network services are required to play.
