import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Waves, Volume2, RotateCcw, Sparkles, Activity } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  ReferenceLine,
} from "recharts";

const TWO_PI = 2 * Math.PI;
const N = 256;
const X_MAX = 1;

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
    const x = (i / (N - 1)) * X_MAX;
    const w1 = waveValue(x, params.a1, params.f1, params.p1);
    const w2 = waveValue(x, params.a2, params.f2, params.p2);
    const total = w1 + w2;

    data.push({
      i,
      x: round(x, 4),
      wave1: round(w1, 4),
      wave2: round(w2, 4),
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

    const mag = (2 / data.length) * Math.sqrt(re * re + im * im);

    spectrum.push({
      frequency: k,
      magnitude: round(mag, 3),
    });
  }

  return spectrum;
}

function Card({ children, className = "" }) {
  return <div className={`card ${className}`}>{children}</div>;
}

function Badge({ children, className = "" }) {
  return <span className={`badge ${className}`}>{children}</span>;
}

function Button({ children, onClick, variant = "primary", className = "" }) {
  return (
    <button onClick={onClick} className={`button ${variant} ${className}`}>
      {children}
    </button>
  );
}

function SliderRow({ label, value, min, max, step, unit, onChange, hint }) {
  return (
    <div className="slider-row">
      <div className="slider-header">
        <div>
          <div className="slider-label">{label}</div>
          {hint && <div className="slider-hint">{hint}</div>}
        </div>
        <Badge>{value} {unit}</Badge>
      </div>
      <input
        className="slider"
        type="range"
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </div>
  );
}

function ExplanationCard({ title, children, icon }) {
  return (
    <Card className="explanation-card">
      <div className="explanation-title">
        {icon}
        <h3>{title}</h3>
      </div>
      <div className="explanation-text">{children}</div>
    </Card>
  );
}

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload || payload.length === 0) return null;

  return (
    <div className="tooltip-box">
      <div className="tooltip-title">x = {label}</div>
      {payload.map((p) => (
        <div key={p.dataKey} className="tooltip-row">
          <span>{p.name}</span>
          <span>{p.value}</span>
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
    return round(Math.max(...data.map((d) => Math.abs(d.total))), 2);
  }, [data]);

  const sameFrequency = params.f1 === params.f2;

  function update(key, value) {
    setParams((p) => ({ ...p, [key]: value }));
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
      <div className="app-container">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="hero-card"
        >
          <div className="hero-layout">
            <div>
              <div className="hero-badges">
                <div className="icon-box">
                  <Waves size={26} />
                </div>
                <Badge>1D Wave Superposition</Badge>
              </div>
              <h1>Two waves add together to make a new wave</h1>
              <p>
                Move the sliders and watch how two invisible ingredients create the final shape.
                The spectrum at the end reveals which frequencies are hiding inside the total wave.
              </p>
            </div>

            <div className="demo-buttons">
              <Button onClick={demoConstructive}>Big wave demo</Button>
              <Button onClick={demoDestructive} variant="secondary">Cancel demo</Button>
              <Button onClick={demoBeats} variant="secondary">Beat pattern</Button>
              <Button onClick={reset} variant="outline">
                <RotateCcw size={16} /> Reset
              </Button>
            </div>
          </div>
        </motion.div>

        <div className="main-grid">
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.35, delay: 0.05 }}
            className="controls-column"
          >
            <Card className="wave-card wave-one">
              <div className="card-title-row">
                <h2>Wave 1</h2>
                <Badge className="blue-badge">blue ingredient</Badge>
              </div>
              <SliderRow label="Amplitude" value={params.a1} min={0} max={2} step={0.1} unit="" hint="How tall the wave is" onChange={(v) => update("a1", v)} />
              <SliderRow label="Frequency" value={params.f1} min={1} max={20} step={1} unit="cycles" hint="How many wiggles fit across the line" onChange={(v) => update("f1", v)} />
              <SliderRow label="Phase offset" value={params.p1} min={-180} max={180} step={5} unit="°" hint="Slide the wave left or right" onChange={(v) => update("p1", v)} />
            </Card>

            <Card className="wave-card wave-two">
              <div className="card-title-row">
                <h2>Wave 2</h2>
                <Badge className="pink-badge">pink ingredient</Badge>
              </div>
              <SliderRow label="Amplitude" value={params.a2} min={0} max={2} step={0.1} unit="" hint="How tall the second wave is" onChange={(v) => update("a2", v)} />
              <SliderRow label="Frequency" value={params.f2} min={1} max={20} step={1} unit="cycles" hint="Try making it equal or close to Wave 1" onChange={(v) => update("f2", v)} />
              <SliderRow label="Phase offset" value={params.p2} min={-180} max={180} step={5} unit="°" hint="Try 0°, 90°, and 180°" onChange={(v) => update("p2", v)} />
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.35, delay: 0.1 }}
            className="visual-column"
          >
            <Card className="chart-card">
              <div className="chart-header">
                <div>
                  <h2>Wave shapes in space</h2>
                  <p>Total wave = Wave 1 + Wave 2 at every point along the line.</p>
                </div>
                <div className="toggle-buttons">
                  <Button variant={showWave1 ? "primary" : "outline"} onClick={() => setShowWave1((v) => !v)}>Wave 1</Button>
                  <Button variant={showWave2 ? "primary" : "outline"} onClick={() => setShowWave2((v) => !v)}>Wave 2</Button>
                  <Button variant={showTotal ? "primary" : "outline"} onClick={() => setShowTotal((v) => !v)}>Total</Button>
                </div>
              </div>

              <div className="wave-chart-box">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="x" type="number" domain={[0, 1]} tickFormatter={(v) => round(v, 2)} />
                    <YAxis domain={[-4, 4]} />
                    <Tooltip content={<CustomTooltip />} />
                    <ReferenceLine y={0} strokeDasharray="4 4" />
                    {showWave1 && <Line type="monotone" dataKey="wave1" name="Wave 1" stroke="#2563eb" strokeWidth={2} dot={false} isAnimationActive={false} />}
                    {showWave2 && <Line type="monotone" dataKey="wave2" name="Wave 2" stroke="#db2777" strokeWidth={2} dot={false} isAnimationActive={false} />}
                    {showTotal && <Line type="monotone" dataKey="total" name="Total wave" stroke="#111827" strokeWidth={4} dot={false} isAnimationActive={false} />}
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Card>

            <div className="bottom-grid">
              <Card className="chart-card">
                <div className="chart-header small">
                  <div>
                    <h2>Frequency spectrum</h2>
                    <p>The bars show the frequency ingredients inside the total wave.</p>
                  </div>
                  <Badge>FFT idea</Badge>
                </div>

                <div className="spectrum-chart-box">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={spectrum} margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="frequency" />
                      <YAxis domain={[0, 2.2]} />
                      <Tooltip />
                      <Bar dataKey="magnitude" name="strength" fill="#111827" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Card>

              <div className="explanation-column">
                <ExplanationCard title="What should students notice?" icon={<Sparkles size={20} />}>
                  A wave can look complicated, but it may simply be two simpler waves added together.
                  The black curve is not magic — it is just blue plus pink.
                </ExplanationCard>

                <ExplanationCard title="Amplitude" icon={<Volume2 size={20} />}>
                  Bigger amplitude means a taller wave. If two waves line up, the total wave can become bigger.
                  This is constructive interference.
                </ExplanationCard>

                <ExplanationCard title="Phase" icon={<Activity size={20} />}>
                  Phase is like starting late or early. With the same frequency, 0° phase makes waves add strongly.
                  180° phase can make them cancel.
                </ExplanationCard>

                <Card className="observation-card">
                  <div className="observation-title">Current classroom observation</div>
                  <div className="observation-text">
                    {sameFrequency ? (
                      <span>Both waves have the same frequency. Now phase becomes very important: they can reinforce, weaken, or cancel each other.</span>
                    ) : (
                      <span>The two waves have different frequencies. The total wave has a mixed shape, and the spectrum reveals two main frequency peaks.</span>
                    )}
                  </div>
                  <div className="stat-grid">
                    <div><span>Wave 1 freq</span><strong>{params.f1}</strong></div>
                    <div><span>Wave 2 freq</span><strong>{params.f2}</strong></div>
                    <div><span>Max total</span><strong>{maxTotal}</strong></div>
                  </div>
                </Card>
              </div>
            </div>
          </motion.div>
        </div>

        <Card className="teacher-card">
          <h2>Suggested teacher script</h2>
          <div className="teacher-grid">
            <div>
              <strong>1. Start simple</strong>
              <p>Set Wave 2 amplitude to 0. Ask: “What do you see?” Then slowly increase Wave 2 amplitude. Students see the second wave join the first.</p>
            </div>
            <div>
              <strong>2. Show cancellation</strong>
              <p>Use the Cancel demo. Ask: “Where did the wave go?” Explain that two equal opposite waves can add to almost zero.</p>
            </div>
            <div>
              <strong>3. Reveal the hidden ingredients</strong>
              <p>Use different frequencies. The black wave looks complex, but the spectrum shows the original frequencies as peaks.</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
