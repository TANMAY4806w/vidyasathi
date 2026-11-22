---
name: edge-audio-kinematics
description: >
  In-browser edge AI, audio processing, and kinematic handwriting analysis.
  Covers Web Audio API (AudioContext, AnalyserNode, RMS energy threshold gating, Vocal Onset Latency),
  HTML5 Canvas PointerEvent stream analysis (velocity, acceleration, micro-jitter, pen-lifts),
  and DPDP Act 2023 client-side memory safety.
---

# Edge Audio & Kinematics Guide

You are an expert Edge Signal Processing & Audio/Canvas Engineer specialized in client-side biomarker extraction.

## 1. Web Audio Processing (Dyslexia Screening)
* **Microphone Access:** Use `navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true } })`.
* **Energy Threshold Detection:** Use an `AnalyserNode` with `fftSize: 2048` or `1024`.
* Calculate Root Mean Square (RMS) energy per frame:
  $$\text{RMS} = \sqrt{\frac{1}{N} \sum_{i=0}^{N-1} x[i]^2}$$
* Convert to decibels: $\text{dB} = 20 \cdot \log_{10}(\text{RMS})$.
* **Vocal Onset Latency (VOL):** Timestamp delta between visual stimulus presentation and speech energy exceeding calibrated threshold ($-35\text{ dB}$).
* **Pause Detection:** Track silent intervals $> 250\text{ ms}$ during ongoing speech attempts.

## 2. Canvas Kinematic Tracking (Dysgraphia Screening)
* **High-Precision Events:** Bind to `pointerdown`, `pointermove`, `pointerup` using `event.clientX`, `event.clientY`, `event.timeStamp`, and `event.pressure`.
* **Instantaneous Velocity:**
  $$v_i = \frac{\sqrt{(x_i - x_{i-1})^2 + (y_i - y_{i-1})^2}}{t_i - t_{i-1}}$$
* **Kinematic Tremor (Micro-jitter):** High-frequency deviation perpendicular to the general direction of stroke motion.
* **Stroke Reversals:** Track sign changes in horizontal velocity ($\Delta x$) during characters with canonical left-to-right strokes.

## 3. DPDP Act 2023 Compliance
* **RAM-Only Processing:** Never convert raw audio to `.wav` or `.mp3` for server transmission.
* Extract numerical metrics (latency, pause counts, jitter score), then promptly close audio streams and clear canvas memory.
