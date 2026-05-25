/* Tweaks panel — uses starter component */
const { TweaksPanel, TweakSection, TweakRadio, TweakColor, TweakSelect, useTweaks } = window;

const ACCENT_MAP = {
  '#22D3EE': 'cyan',
  '#6366F1': 'indigo',
  '#34D399': 'green',
  '#FB923C': 'orange'
};
const ACCENT_HEX = { cyan:'#22D3EE', indigo:'#6366F1', green:'#34D399', orange:'#FB923C' };

function TweaksApp() {
  const [t, setTweak] = useTweaks(window.TWEAK_DEFAULTS);

  React.useEffect(() => {
    if (window.RG && window.RG.applyTweaks) window.RG.applyTweaks(t);
  }, [t]);

  return (
    <TweaksPanel title="Tweaks">
      <TweakSection label="Theme" />
      <TweakRadio
        label="Mode"
        value={t.theme}
        options={['dark', 'light']}
        onChange={(v) => setTweak('theme', v)}
      />

      <TweakSection label="Accent" />
      <TweakColor
        label="Brand color"
        value={ACCENT_HEX[t.accent] || '#22D3EE'}
        options={['#22D3EE', '#6366F1', '#34D399', '#FB923C']}
        onChange={(v) => setTweak('accent', ACCENT_MAP[v.toUpperCase()] || ACCENT_MAP[v] || 'cyan')}
      />

      <TweakSection label="Layout" />
      <TweakRadio
        label="Density"
        value={t.density}
        options={['comfortable', 'compact']}
        onChange={(v) => setTweak('density', v)}
      />

      <TweakSection label="Hero copy" />
      <TweakSelect
        label="Headline"
        value={t.headline_variant}
        options={[
          { value: 'A', label: 'A — Stellen besetzen' },
          { value: 'B', label: 'B — KI macht es für Sie' },
          { value: 'C', label: 'C — 1.000.000 Fachkräfte' }
        ]}
        onChange={(v) => {
          setTweak('headline_variant', v);
          const h = document.querySelector('.hero h1');
          if (!h) return;
          const variants = {
            A: 'Stellen besetzen,<br>die andere <em>nicht finden</em>.',
            B: 'Recruiting,<br>das die <em>KI</em> für Sie macht.',
            C: 'Wir kennen<br><em>1.000.000</em> Fachkräfte.'
          };
          h.innerHTML = variants[v];
        }}
      />
    </TweaksPanel>
  );
}

const tweaksContainer = document.createElement('div');
document.body.appendChild(tweaksContainer);
ReactDOM.createRoot(tweaksContainer).render(<TweaksApp />);
