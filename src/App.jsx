import { useState, useEffect } from 'react';
import { getDiff, offsetDate, getCountdown, fmt, toInput, today, n } from './dateCalc';

const TABS = ['Between', 'Offset', 'Countdown'];

function BigNum({ value, label }) {
  return (
    <div className="big-num">
      <span className="big-n">{n(value)}</span>
      <span className="big-l">{label}</span>
    </div>
  );
}

function StatPill({ value, label }) {
  return (
    <div className="stat-pill">
      <span className="stat-n">{n(value)}</span>
      <span className="stat-l">{label}</span>
    </div>
  );
}

function BetweenTab() {
  const [from, setFrom] = useState(() => {
    const d = new Date(); d.setFullYear(d.getFullYear() - 1);
    return toInput(d);
  });
  const [to, setTo] = useState(today);

  const diff = from && to ? getDiff(from, to) : null;

  const swap = () => { setFrom(to); setTo(from); };

  return (
    <div className="tab-body">
      <div className="input-row">
        <div className="input-group">
          <label>From</label>
          <input type="date" value={from} onChange={e => setFrom(e.target.value)} />
        </div>
        <button className="swap-btn" onClick={swap} title="Swap dates">⇄</button>
        <div className="input-group">
          <label>To</label>
          <input type="date" value={to} onChange={e => setTo(e.target.value)} />
        </div>
      </div>

      {diff && (
        <div className="result-block">
          {diff.totalDays === 0 ? (
            <div className="same-day">Same day.</div>
          ) : (
            <>
              <div className="direction-label">
                {diff.isPast ? 'That was' : 'That is'}
              </div>
              <div className="big-nums">
                {diff.years > 0 && (
                  <BigNum value={diff.years} label={diff.years === 1 ? 'year' : 'years'} />
                )}
                {diff.months > 0 && (
                  <BigNum value={diff.months} label={diff.months === 1 ? 'month' : 'months'} />
                )}
                <BigNum value={diff.days} label={diff.days === 1 ? 'day' : 'days'} />
              </div>
              <div className="stat-row">
                <StatPill value={diff.totalDays}    label="total days"  />
                <StatPill value={diff.totalWeeks}   label="weeks"       />
                <StatPill value={diff.totalHours}   label="hours"       />
                <StatPill value={diff.totalMinutes} label="minutes"     />
                <StatPill value={diff.totalSeconds} label="seconds"     />
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

const UNITS = ['days', 'weeks', 'months', 'years', 'hours', 'minutes'];

function OffsetTab() {
  const [date,   setDate]   = useState(today);
  const [amount, setAmount] = useState(30);
  const [unit,   setUnit]   = useState('days');
  const [dir,    setDir]    = useState('+');

  const result = date && amount ? offsetDate(date, amount, unit, dir) : null;

  return (
    <div className="tab-body">
      <div className="input-group" style={{ marginBottom: 16 }}>
        <label>Starting date</label>
        <input type="date" value={date} onChange={e => setDate(e.target.value)} />
      </div>

      <div className="offset-controls">
        <div className="dir-toggle">
          <button className={`dir-btn ${dir === '+' ? 'active' : ''}`} onClick={() => setDir('+')}>+</button>
          <button className={`dir-btn ${dir === '-' ? 'active' : ''}`} onClick={() => setDir('-')}>-</button>
        </div>
        <input
          type="number"
          className="amount-input"
          value={amount}
          min={1}
          onChange={e => setAmount(Math.max(1, parseInt(e.target.value) || 1))}
        />
        <select className="unit-select" value={unit} onChange={e => setUnit(e.target.value)}>
          {UNITS.map(u => <option key={u} value={u}>{u}</option>)}
        </select>
      </div>

      {result && (
        <div className="result-block">
          <div className="direction-label">
            {dir === '+' ? 'Add' : 'Subtract'} {amount} {unit} from {new Date(date + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </div>
          <div className="offset-result">
            {fmt(result)}
          </div>
          <div className="offset-date-num">
            {result.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </div>
        </div>
      )}
    </div>
  );
}

function CountdownTab() {
  const defaultTarget = () => {
    const d = new Date(); d.setDate(d.getDate() + 30);
    return d.toISOString().slice(0, 16);
  };

  const [target, setTarget]   = useState(defaultTarget);
  const [countdown, setCountdown] = useState(null);

  useEffect(() => {
    const tick = () => setCountdown(getCountdown(target));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [target]);

  const targetDate = target ? new Date(target) : null;

  return (
    <div className="tab-body">
      <div className="input-group" style={{ marginBottom: 24 }}>
        <label>Target date and time</label>
        <input type="datetime-local" value={target} onChange={e => setTarget(e.target.value)} />
      </div>

      {targetDate && (
        <div className="result-block">
          {!countdown ? (
            <div className="same-day">That date has passed.</div>
          ) : (
            <>
              <div className="direction-label">
                Until {targetDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
              </div>
              <div className="countdown-grid">
                <div className="cd-cell">
                  <span className="cd-n">{String(countdown.days).padStart(2, '0')}</span>
                  <span className="cd-l">days</span>
                </div>
                <span className="cd-sep">:</span>
                <div className="cd-cell">
                  <span className="cd-n">{String(countdown.hours).padStart(2, '0')}</span>
                  <span className="cd-l">hours</span>
                </div>
                <span className="cd-sep">:</span>
                <div className="cd-cell">
                  <span className="cd-n">{String(countdown.minutes).padStart(2, '0')}</span>
                  <span className="cd-l">min</span>
                </div>
                <span className="cd-sep">:</span>
                <div className="cd-cell">
                  <span className="cd-n">{String(countdown.seconds).padStart(2, '0')}</span>
                  <span className="cd-l">sec</span>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default function App() {
  const [tab, setTab] = useState('Between');

  return (
    <div className="app">
      <header>
        <div className="logo">
          <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
            <rect width="32" height="32" rx="7" fill="#111"/>
            <line x1="6" y1="16" x2="26" y2="16" stroke="white" strokeWidth="2" strokeLinecap="round"/>
            <circle cx="6" cy="16" r="2.5" fill="white"/>
            <circle cx="26" cy="16" r="2.5" fill="white"/>
            <line x1="16" y1="9" x2="16" y2="23" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="2 2"/>
          </svg>
          <span className="logo-text">Span</span>
        </div>
        <p className="tagline">Date and time, calculated exactly.</p>
      </header>

      <div className="tabs">
        {TABS.map(t => (
          <button key={t} className={`tab-btn ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)}>
            {t}
          </button>
        ))}
      </div>

      {tab === 'Between'   && <BetweenTab />}
      {tab === 'Offset'    && <OffsetTab />}
      {tab === 'Countdown' && <CountdownTab />}
    </div>
  );
}
