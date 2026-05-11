import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Activity, RotateCcw, Sparkles, Volume2, Waves } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const TWO_PI = 2 * Math.PI;
const N = 256;

function degToRad(deg) {
  return (deg * Math.PI) / 180;
}

function round(value, digits = 3) {
  const s = Math.pow(10, digits);
  return Math.round(value * s) / s;
}

function waveValue(x, amplitude, frequency, phaseDeg) {
  return amplitude * Math.sin(TWO_PI * frequency * x + degToRad(phaseDeg));
}

function makeWaveData(params) {
  const data = [];

  for (let i = 0; i < N; i++) {
    const x = i / (N - 1);
    const wave1 = waveValue(x, params.a1, params.f1, params.p1);
    const wave2 = waveValue(x, params.a2, params.f2, params.p2);
    const total = wave1 + wave2;

    data.push({
      x: round(x, 4),
      wave1: round(wave1, 4),
      wave2: round(wave2, 4),
      total: round(total, 4),
    });
  }

  return data;
}

function makeSpectrum(data, maxBin = 24) {
  const spectrum = [];

  for (let k = 0; k <= maxBin; k++) {
    let re = 0;
    let im = 0;

    for (let n = 0; n < data.length; n++) {
      const angle = (-TWO_PI * k * n) / data.length;
      const y = data[n].total;
      re += y * Math.cos(angle);
      im += y * Math.sin(angle);
    }

    const magnitude = (2 / data.length) * Math.sqrt(re * re + im * im);
    spectrum.push({ frequency: k, magnitude: round(magnitude, 3) });
  }

  return spectrum;
}

function SliderRow({ label, hint, value, min, max, step, unit, onChange }) {
  return (
    <div className="slider-card">
      <div className="slider-top">
        <div>
          <div className="slider-label">{label}</div>
          <div className="slider-hint">{hint}</div>
        </div>
        <div className="value-pill">
          {value} {unit}
        </div>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
      />
    </div>
  );
}

function ConceptCard({ icon, title, children }) {
  return (
    <div className="concept-card">
      <h3>
        {icon}
        {title}
      </h3>
      <p>{children}</p>
    </div>
  );
}

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;

  return (
    <div
      style={{
        background: "rgba(255,255,255,0.96)",
        border: "1px solid #cbd5e1",
        borderRadius: 14,
        padding: 12,
        boxShadow: "0 16px 30px rgba(15,23,42,0.14)",
        fontSize: 12,
      }}
    >
      <div style={{ fontWeight: 800, marginBottom: 6 }}>x = {label}</div>
      {payload.map((item) => (
        <div key={item.dataKey} style={{ display: "flex", gap: 18, justifyContent: "space-between" }}>
          <span>{item.name}</span>
          <span style={{ fontFamily: "monospace" }}>{item.value}</span>
        </div>
      ))}
    </div>
  );
}

export default function App() {
  const [params, setParams] = useState({
    a1: 1.0,
    f1: 3,
    p1: 0,
    a2: 0.7,
    f2: 7,
    p2: 60,
  });

  const [showWave1, setShowWave1] = useState(true);
  const [showWave2, setShowWave2] = useState(true);
  const [showTotal, setShowTotal] = useState(true);

  const data = useMemo(() => makeWaveData(params), [params]);
  const spectrum = useMemo(() => makeSpectrum(data, 24), [data]);

  const maxTotal = useMemo(() => {
    return round(Math.max(...data.map((item) => Math.abs(item.total))), 2);
  }, [data]);

  const sameFrequency = params.f1 === params.f2;

  function update(key, value) {
    setParams((old) => ({ ...old, [key]: value }));
  }

  function reset() {
    setParams({ a1: 1.0, f1: 3, p1: 0, a2: 0.7, f2: 7, p2: 60 });
    setShowWave1(true);
    setShowWave2(true);
    setShowTotal(true);
  }

  function demoConstructive() {
    setParams({ a1: 1.0, f1: 4, p1: 0, a2: 1.0, f2: 4, p2: 0 });
  }

  function demoDestructive() {
    setParams({ a1: 1.0, f1: 4, p1: 0, a2: 1.0, f2: 4, p2: 180 });
  }

  function demoBeats() {
    setParams({ a1: 1.0, f1: 7, p1: 0, a2: 1.0, f2: 8, p2: 0 });
  }

  return (
    <div className="app-shell">
      <div className="container">
        <motion.header
          className="hero"
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
        >
          <div>
            <div className="badge">
              <Waves size={20} />
              1D Wave Superposition
            </div>
            <h1 className="hero-title">Two waves add together to make a new wave</h1>
            <p className="hero-subtitle">
              Move the sliders and watch how two invisible ingredients create the final shape.
              The spectrum reveals which frequencies are hiding inside the total wave.
            </p>
          </div>

          <div className="button-grid">
            <button className="btn" onClick={demoConstructive}>Big wave demo</button>
            <button className="btn secondary" onClick={demoDestructive}>Cancel demo</button>
            <button className="btn secondary" onClick={demoBeats}>Beat pattern</button>
            <button className="btn outline" onClick={reset}>
              <RotateCcw size={16} /> Reset
            </button>
          </div>
        </motion.header>

        <main className="main-grid">
          <motion.section
            className="controls"
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.35, delay: 0.05 }}
          >
            <div className="wave-box wave1">
              <div className="wave-header">
                <h2>Wave 1</h2>
                <span className="mini-badge blue">blue ingredient</span>
              </div>
              <SliderRow label="Amplitude" value={params.a1} min={0} max={2} step={0.1} unit="" hint="How tall the wave is" onChange={(v) => update("a1", v)} />
              <SliderRow label="Frequency" value={params.f1} min={1} max={20} step={1} unit="cycles" hint="How many wiggles fit across the line" onChange={(v) => update("f1", v)} />
              <SliderRow label="Phase offset" value={params.p1} min={-180} max={180} step={5} unit="°" hint="Slide the wave left or right" onChange={(v) => update("p1", v)} />
            </div>

            <div className="wave-box wave2">
              <div className="wave-header">
                <h2>Wave 2</h2>
                <span className="mini-badge pink">pink ingredient</span>
              </div>
              <SliderRow label="Amplitude" value={params.a2} min={0} max={2} step={0.1} unit="" hint="How tall the second wave is" onChange={(v) => update("a2", v)} />
              <SliderRow label="Frequency" value={params.f2} min={1} max={20} step={1} unit="cycles" hint="Try equal or close to Wave 1" onChange={(v) => update("f2", v)} />
              <SliderRow label="Phase offset" value={params.p2} min={-180} max={180} step={5} unit="°" hint="Try 0°, 90°, and 180°" onChange={(v) => update("p2", v)} />
            </div>
          </motion.section>

          <motion.section
            className="container"
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.35, delay: 0.1 }}
          >
            <div className="panel">
              <div className="panel-head">
                <div>
                  <h2 className="panel-title">Wave shapes in space</h2>
                  <p className="panel-subtitle">Total wave = Wave 1 + Wave 2 at every point along the line.</p>
                </div>

                <div className="toggle-row">
                  <button className={`btn small ${showWave1 ? "" : "inactive"}`} onClick={() => setShowWave1((v) => !v)}>Wave 1</button>
                  <button className={`btn small ${showWave2 ? "" : "inactive"}`} onClick={() => setShowWave2((v) => !v)}>Wave 2</button>
                  <button className={`btn small ${showTotal ? "" : "inactive"}`} onClick={() => setShowTotal((v) => !v)}>Total</button>
                </div>
              </div>

              <div className="chart-wrap">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data} margin={{ top: 10, right: 25, left: 0, bottom: 15 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="x" type="number" domain={[0, 1]} tickFormatter={(v) => round(v, 2)} label={{ value: "position along the line", position: "insideBottom", offset: -8 }} />
                    <YAxis domain={[-4, 4]} label={{ value: "wave height", angle: -90, position: "insideLeft" }} />
                    <Tooltip content={<CustomTooltip />} />
                    <ReferenceLine y={0} strokeDasharray="4 4" />
                    {showWave1 && <Line type="monotone" dataKey="wave1" name="Wave 1" stroke="#2563eb" strokeWidth={2.2} dot={false} isAnimationActive={false} />}
                    {showWave2 && <Line type="monotone" dataKey="wave2" name="Wave 2" stroke="#db2777" strokeWidth={2.2} dot={false} isAnimationActive={false} />}
                    {showTotal && <Line type="monotone" dataKey="total" name="Total wave" stroke="#111827" strokeWidth={4} dot={false} isAnimationActive={false} />}
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="two-col">
              <div className="panel">
                <div className="panel-head">
                  <div>
                    <h2 className="panel-title">Frequency spectrum</h2>
                    <p className="panel-subtitle">The bars show the frequency ingredients inside the total wave.</p>
                  </div>
                  <span className="value-pill">FFT idea</span>
                </div>

                <div className="chart-wrap small">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={spectrum} margin={{ top: 10, right: 25, left: 0, bottom: 15 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="frequency" label={{ value: "frequency bin", position: "insideBottom", offset: -8 }} />
                      <YAxis domain={[0, 2.2]} label={{ value: "strength", angle: -90, position: "insideLeft" }} />
                      <Tooltip />
                      <Bar dataKey="magnitude" name="strength" fill="#111827" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="explain-grid">
                <ConceptCard title="What should students notice?" icon={<Sparkles size={18} />}>
                  A wave can look complicated, but it may simply be two simpler waves added together.
                  The black curve is not magic — it is just blue plus pink.
                </ConceptCard>

                <ConceptCard title="Amplitude" icon={<Volume2 size={18} />}>
                  Bigger amplitude means a taller wave. If two waves line up, the total wave can become bigger.
                  This is constructive interference.
                </ConceptCard>

                <ConceptCard title="Phase" icon={<Activity size={18} />}>
                  Phase is like starting late or early. With the same frequency, 0° phase makes waves add strongly.
                  180° phase can make them cancel.
                </ConceptCard>

                <div className="observation">
                  <h3>Current classroom observation</h3>
                  <p>
                    {sameFrequency
                      ? "Both waves have the same frequency. Now phase becomes very important: they can reinforce, weaken, or cancel each other."
                      : "The two waves have different frequencies. The total wave has a mixed shape, and the spectrum reveals two main frequency peaks."}
                  </p>
                  <div className="stats">
                    <div className="stat">
                      <div className="stat-label">Wave 1 freq</div>
                      <div className="stat-value">{params.f1}</div>
                    </div>
                    <div className="stat">
                      <div className="stat-label">Wave 2 freq</div>
                      <div className="stat-value">{params.f2}</div>
                    </div>
                    <div className="stat">
                      <div className="stat-label">Max total</div>
                      <div className="stat-value">{maxTotal}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.section>
        </main>

        <section className="panel">
          <h2 className="panel-title">Suggested teacher script</h2>
          <div className="teacher-grid" style={{ marginTop: 14 }}>
            <div className="teacher-step">
              <strong>1. Start simple</strong>
              Set Wave 2 amplitude to 0. Ask: “What do you see?” Then slowly increase Wave 2 amplitude.
              Students see the second wave join the first.
            </div>
            <div className="teacher-step">
              <strong>2. Show cancellation</strong>
              Use the Cancel demo. Ask: “Where did the wave go?” Explain that two equal opposite waves can add to almost zero.
            </div>
            <div className="teacher-step">
              <strong>3. Reveal the hidden ingredients</strong>
              Use different frequencies. The black wave looks complex, but the spectrum shows the original frequencies as peaks.
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
