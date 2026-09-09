"""
VoiceShield — Chunk Latency Benchmarking
Profiles audio ingestion, feature extraction, and inference runtimes
across tunable audio hop budgets (250ms, 333ms, 500ms).
SIH26104 | voiceshield-team/voiceshield-sih-2026
"""

import time
import numpy as np
from app.ml.feature_extractor import extract_features
from app.ml.spoof_model import SpoofModel
from app.services.decision_engine import classify_risk


def benchmark_chunk_size(chunk_ms: int, num_runs: int = 50, sample_rate: int = 16000):
    num_samples = int((sample_rate * chunk_ms) / 1000)
    raw_pcm = (np.random.uniform(-0.8, 0.8, num_samples) * 32767).astype(np.int16).tobytes()

    model = SpoofModel(model=None, device="cpu")
    latencies = []

    for _ in range(num_runs):
        t0 = time.perf_counter()

        # Step 1: Feature Extraction
        features = extract_features(raw_pcm, sample_rate)

        # Step 2: Inference
        prob = model.predict(features)

        # Step 3: Decision Engine
        _, _ = classify_risk(prob)

        lat_ms = (time.perf_counter() - t0) * 1000.0
        latencies.append(lat_ms)

    lat_arr = np.array(latencies)
    print(f"=== Latency Benchmark: {chunk_ms}ms chunk ({num_samples} samples) ===")
    print(f"  Mean:   {lat_arr.mean():.2f} ms")
    print(f"  P50:    {np.percentile(lat_arr, 50):.2f} ms")
    print(f"  P95:    {np.percentile(lat_arr, 95):.2f} ms")
    print(f"  P99:    {np.percentile(lat_arr, 99):.2f} ms")
    print(f"  Budget: {lat_arr.mean() < 250.0 and 'PASSED (<250ms)' or 'EXCEEDED'}\n")


if __name__ == "__main__":
    print("VoiceShield Telephony Hop Latency Profiling\n" + "=" * 45)
    for ms in [250, 333, 500]:
        benchmark_chunk_size(ms, num_runs=30)
