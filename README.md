# MausamGuard

Working browser-local SIH26073 software prototype. React + TypeScript + Vite, Recharts and Base UI. Models are implemented in TypeScript and run in the browser; no Python service, account setup or model API key is required.

## Run locally

Install Node.js 22.13 or newer. Run `npm ci`, then `npm run dev`. Open the address printed in the terminal. Use `npm run build` for static output in `dist/client`. The hosted version requires a connection to load initially; this is not an installable offline PWA.

Run the engine tests with Node.js 22.18+ using `node --test tests/engine.test.mjs`. Run the TypeScript check with `npx tsc --noEmit`.

## Demo walkthrough

1. Open Monitor. The default dataset contains 960 synthetic 15-minute observations from one station, with gradual temperature drift injected into the final test period.
2. Select a scenario and target sensor. Select one of the three detectors. Change magnitude for spikes, drift or the constructed weather-like scenario.
3. Replay the test period or inspect it with the slider. Select a flagged observation, examine its evidence and record an operator review.
4. Open Compare methods for calculated event recall, detection delay, false-alert rate and alert count.
5. Upload your station CSV in Data workspace, or download a sample/current dataset. Export report downloads measurements, all three findings, metrics and reviews as JSON.

## Data contract

One station per CSV; 120–5,000 rows, <=5 MB. Columns: `timestamp,temperature,pressure,humidity,label`. Label is optional. Timestamps must include timezone, be unique and increase strictly. Units are degrees Celsius, station pressure in hPa and relative humidity percent. Missing measurements: blank, null or -9999. At least 60 complete training rows and 20 complete validation rows are required. More than two full daily cycles in training is recommended; short or nonrepresentative training data makes daily extrapolation unreliable.

Accepted labels: normal, weather, spike, drift, stuck, dropout, unknown. Unlabelled data receives unknown. Labels never feed models. Do not label observations normal without review. All uploaded labels remain user assertions, not independently verified ground truth.

## Model and evaluation

- Chronological 60/20/20 train/calibration/test split. Fault injection changes complete test rows labelled normal only; existing faults, unknown labels and missing values are preserved. Trailing features use present/past observations. The replay starts after calibration.
- Conventional checks: broad prototype ranges, rate-of-change, six consecutive identical values, nulls and timestamp gaps.
- Isolation Forest: 48 trees, <=128 random samples per tree, deterministic seed. Uses current measurements, differences and trailing variability. Null imputation uses training medians; shared missing-data/gap checks are counted separately in explanations. Threshold is the calibration 99th percentile with a 0.5 floor.
- MausamGuard: ridge harmonic regression for a daily reference, standardized residuals and a trailing 12-observation residual mean, combined with conventional checks. Threshold from calibration with a minimum residual cutoff. This is a learned daily-pattern model, not a neural network or a season-aware model.
- Consecutive same-type fault labels define true fault events; consecutive flags define alert events. Detection must occur within a true event. Mean delay includes detected events only. Report missed events beside delay.
- False episodes are contiguous flagged segments on normal/weather-labelled rows, including segments within longer alarms that overlap faults or unknowns. Exposure uses actual adjacent reviewed-normal intervals, excluding intervals longer than 1.5 times median training cadence. No exposure means N/A.
- Reports currently do not compare at matched false-alert rates. Default demonstration results cannot establish superiority or generalisation.

## Limits

No IMD integration, real sensor feeds, labelled Indian station benchmark, field validation, seasonal adaptation, physical root-cause proof, remaining-life prediction, calibrated fault probabilities, durable storage, multi-user authentication or device energy measurements. Readings, reviews and uploads exist only in the current browser session; export before refreshing. A weather-like scenario is synthetic and does not establish discrimination of real extremes. Review actions do not automatically retrain models or alter benchmark labels. Proposed WebMCP helpers feature-detect browser support; external-context verification is not claimed.

## Sources

- https://sih.gov.in/sih2026PS#ViewProblemStatement26073
- https://madis.ncep.noaa.gov/madis_sfc_qc_notes.shtml
- https://www.bgc-jena.mpg.de/wetter/weather_data.html

The built-in sample is entirely generated, not a download from those sources.

