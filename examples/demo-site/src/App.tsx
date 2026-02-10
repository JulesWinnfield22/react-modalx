import { useState } from 'react';
import { openModal, Modal } from 'modalx';
import DemoSection from './components/DemoSection';
import CodeBlock from './components/CodeBlock';
import './App.css';

function App() {
  const [lastResult, setLastResult] = useState<string | null>(null);

  const handleOpenForm = async () => {
    // This call is fully type-safe! 
    const result = await openModal('DemoForm', { initialTitle: 'Default Settings' });

    if (result?.submitted) {
      setLastResult(`Form returned: "${result.title}"`);
    } else {
      setLastResult('Form was cancelled.');
    }
  };

  return (
    <div className="app-container">
      <header>
        <div className="badge">VERSION 1.0.0</div>
        <h1>React ModalX</h1>
        <p>A high-performance, developer-first modal engine for React. Build complex flows with type-safe props and automatic code splitting.</p>

        <div className="hero-actions">
          <button onClick={() => window.open('https://github.com/JulesWinnfield22/react-modalx', '_blank')}>
            Documentation
          </button>
          <button className="btn-secondary" onClick={() => document.getElementById('demo')?.scrollIntoView({ behavior: 'smooth' })}>
            View Live Demos
          </button>
        </div>
      </header>

      <main id="demo">
        <section className="install-section">
          <h2>📦 Quick Install</h2>
          <p>Get up and running in seconds. ModalX is designed to be as non-intrusive as possible.</p>
          <CodeBlock
            language="bash"
            code={`npm install modalx zustand`}
          />
          <div style={{ marginTop: '2.5rem' }}>
            <p>Integrate the Vite plugin to enable <strong>Dynamic Type Discovery</strong>.</p>
            <CodeBlock
              code={`import { modalTypesPlugin } from 'modalx/components/modalxPlugin';

export default defineConfig({
  plugins: [modalTypesPlugin()],
});`}
            />
          </div>
        </section>

        <DemoSection
          icon="🚀"
          title="Instant Rendering"
          description="Eagerly loaded modals (using .mdl.tsx) are bundled with your main application. They are perfect for critical UI paths like authentication where speed is paramount."
          code={`// Bundled with the main app
import { openModal } from 'modalx';

const launchLogin = () => {
  openModal('LoginModal');
};`}
        >
          <button onClick={() => openModal('DemoBasic')}>Launch Eager Modal</button>
        </DemoSection>

        <DemoSection
          icon="⚡"
          title="Automatic Splitting"
          description="Large modals (using .amdl.tsx) are automatically extracted into their own network chunks. ModalX handles the dynamic import lifecycle transparently."
          code={`// Fetched only when called
// Helps preserve a fast TTI!
await openModal('ComplexEditor');`}
        >
          <button onClick={() => openModal('DemoLazy')}>Launch Lazy Modal</button>
        </DemoSection>

        <DemoSection
          icon="📚"
          title="Z-Index Management"
          description="Complex applications require overlapping states. ModalX provides a smart stack that manages focus, overlays, and escape key behaviors automatically."
          code={`// Open modals on top of each other
const startFlow = async () => {
  await openModal('Step1');
  openModal('Step2'); // Stacked!
};`}
        >
          <button onClick={() => openModal('DemoStacked')}>Launch Stacked Flow</button>
        </DemoSection>

        <DemoSection
          icon="🛡️"
          title="End-to-End Type Safety"
          description="Never pass the wrong props again. ModalX generates a registry from your components, giving you full autocomplete for data inputs and result values."
          code={`// Full TS support out of the box
const res = await openModal('DataForm', {
  initialValue: 'Hello'
});

console.log(res.submitted); // Typed!`}
        >
          <button onClick={handleOpenForm}>Launch Typed Form</button>
          {lastResult && <div className="result-display">{lastResult}</div>}
        </DemoSection>
      </main>

      <footer>
        <p>© 2026 ModalX. Built for the modern web.</p>
      </footer>

      <Modal />
    </div>
  );
}

export default App;
