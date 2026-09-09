import { LiveConsole } from "@/components/demo/LiveConsole";

export default function DemoPage() {
  return (
    <div className="console">
      <p className="eyebrow">Operator console</p>
      <h1 style={{ margin: "0.4rem 0 0", fontSize: "1.85rem" }}>Live detection path</h1>
      <p className="lede" style={{ fontSize: "0.9rem" }}>
        Allow the microphone, speak naturally (Green), then inject a cloned stream. Use Simulate drop to show
        exponential backoff, the 4-second ring buffer, and resume from last_chunk_index.
      </p>
      <div style={{ marginTop: "2rem" }}>
        <LiveConsole />
      </div>
    </div>
  );
}
