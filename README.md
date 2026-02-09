# ModalX

A lightweight, dynamic React modal library powered by Zustand. ModalX allows you to manage multiple stacked modals with ease, supporting dynamic loading, focus trapping, and scroll locking.

## Features

- 🚀 **Dynamic Loading**: Modals are loaded on-demand using `import.meta.glob`.
- ⚡ **Lazy Loading**: Use `.amdl.tsx` for code-split, lazy-loaded modals.
- 📦 **Eager Loading**: Use `.mdl.tsx` for critical modals bundled with the app.
- 📚 **Stacked Modals**: Open multiple modals on top of each other.
- 🗄️ **Global State**: Managed by Zustand, no need for complex context providers.
- ♿ **Accessibility**: Built-in focus trapping and escape key support.
- 🎨 **Customizable**: Easy to style with CSS variables.

## Installation

```bash
npm install modalx zustand
```

*Note: `zustand` is a required peer dependency.*

## Setup

### 1. Configure Vite

To enable automatic type generation and modal discovery, add the `modalTypesPlugin` to your `vite.config.ts`. This plugin automatically scans for `.mdl.tsx` and `.amdl.tsx` files and generates type definitions for `openModal`.

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { modalTypesPlugin } from 'modalx/components/modalxPlugin';

export default defineConfig({
  plugins: [
    react(),
    modalTypesPlugin()
  ],
})
```

## Type Safety

The Vite plugin automatically generates `FileNameEnums.ts`. This provides:
- **Autocomplete**: Modal names are suggested when calling `openModal`.
- **Return Type Safety**: If you export a `type ReturnType` from your modal file, `openModal` will correctly infer the promise resolution type.

Example modal with type safety:

```tsx
// Profile.mdl.tsx
export type ReturnType = { userId: string; status: 'updated' | 'cancelled' };

const ProfileModal = ({ close }) => {
  return (
    <button onClick={() => close({ userId: '123', status: 'updated' })}>
      Save Profile
    </button>
  );
};

export default ProfileModal;
```

On the usage side, the `result` will be automatically typed:

```tsx
// The 'result' variable here is typed as { userId: string; status: 'updated' | 'cancelled' }
const result = await openModal('Profile'); 
```

### 2. Add the Modal Root

Place the `Modal` component at the root of your application (e.g., in `App.tsx` or `main.tsx`):

```tsx
import { Modal } from 'modalx/components';

function App() {
  return (
    <>
      <YourContent />
      <Modal />
    </>
  );
}
```

### 3. Creating a Modal Component

Create a modal file with the `.mdl.tsx` extension. For example, `Login.mdl.tsx`:

```tsx
// Login.mdl.tsx
const LoginModal = ({ data, close }) => {
  return (
    <div className="modal-content">
      <h1>Login</h1>
      <p>Message: {data?.message}</p>
      <button onClick={() => close('Logged in!')}>Close</button>
    </div>
  );
};

export default LoginModal;
```

### 4. Lazy Loading Modals

To lazy load a modal, simply use the `.amdl.tsx` extension instead of `.mdl.tsx`.
- **`.mdl.tsx`**: Eagerly loaded. Bundled with the main application. Use for critical modals (e.g., Login, Alert).
- **`.amdl.tsx`**: Lazily loaded. Fetched only when `openModal` is called. Use for heavy or detailed modals (e.g., Settings, ProfileEditor).

The usage remains exactly the same:

```tsx
// This works for both .mdl.tsx and .amdl.tsx files!
await openModal('ProfileEditor', { userId: 123 });
```

## Usage

### Opening a Modal

Use `openModal` from any part of your code:

```tsx
import { openModal } from 'modalx/components';

const handleLogin = async () => {
  const result = await openModal('Login', { message: 'Welcome back!' });
  console.log('Modal returned:', result);
};
```

### Closing a Modal

Inside your modal component, use the `close` prop, or import `closeModal`:

```tsx
import { closeModal } from 'modalx/components';

// This will close the topmost modal
closeModal('Optional response data');
```

## API

### `openModal(name, data, options)`
- `name`: The filename of your modal (without extensions like `.mdl.tsx`).
- `data`: Any data you want to pass to the modal. Available as `props.data`.
- `options`:
    - `closeOnOverlayClick`: boolean (default: true)
    - `closeonEsc`: boolean (default: true)

### `closeModal(response, sendResponse)`
- `response`: Optional data to return to the `openModal` promise.
- `sendResponse`: boolean (default: true). If false, returns `undefined`.

## Development

If you'd like to contribute or run the demo:

```bash
npm install
npm run dev
```

## License

MIT
