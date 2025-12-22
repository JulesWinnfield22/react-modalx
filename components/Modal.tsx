
import { useEffect, Suspense, useRef } from 'react';
import { useModalStore } from './store/modal';
import ModalParent from './ModalParent';
import Spinner from './Spinner';
import './style.css';

const Modal = () => {
	const { modals, loadedComponents } = useModalStore();
	const rootRef = useRef<HTMLDivElement>(null);

	// Initial load of all available modals (optional pre-loading)
	// In this design, we load on demand in openModal, but we could pre-load here.

	// Scroll Lock
	useEffect(() => {
		if (modals.length > 0) {
			document.body.style.overflow = 'hidden';
		} else {
			document.body.style.overflow = '';
		}
		return () => {
			document.body.style.overflow = '';
		}
	}, [modals.length]);

	// Focus Trap
	useEffect(() => {
		const activeModal = modals.find(m => m.active);
		if (!activeModal) return;

		// Wait for DOM to update
		const timer = setTimeout(() => {
			// Find the element for this modal. 
			// We can't easily query by ID unless we put ID on ModalParent
			// But we know the active one has class __active
			const activeEl = rootRef.current?.querySelector('.__active');
			if (activeEl) {
				const focusableSelector = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
				const focusables = activeEl.querySelectorAll(focusableSelector);
				const first = focusables[0] as HTMLElement;
				const input = Array.from(focusables).find(el => ['INPUT', 'TEXTAREA', 'SELECT'].includes(el.nodeName)) as HTMLElement;

				if (input) input.focus();
				else if (first) first.focus();
				else (activeEl as HTMLElement).focus();
			}
		}, 50); // Small delay for React render + Suspense

		return () => clearTimeout(timer);
	}, [modals]); // Re-run when modals change (active changes)

	// Tab Key Listener for Focus Trap
	useEffect(() => {
		const listener = (e: KeyboardEvent) => {
			if (e.key !== 'Tab') return;
			// Simplified trap logic similar to Vue original
			// This is global, but typically we want to trap within the *active* modal.
			// For now, assume standard behavior is sufficient or implemented by libraries.
			// Converting the exact Vue logic:

			const activeEl = rootRef.current?.querySelector('.__active');
			if (!activeEl) return;

			const focusableSelector = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
			const focusables = activeEl.querySelectorAll(focusableSelector);
			if (focusables.length === 0) return;

			const first = focusables[0] as HTMLElement;
			const last = focusables[focusables.length - 1] as HTMLElement;

			if (e.shiftKey) {
				if (document.activeElement === first) {
					last.focus();
					e.preventDefault();
				}
			} else {
				if (document.activeElement === last) {
					first.focus();
					e.preventDefault();
				}
			}
		};
		document.addEventListener('keydown', listener);
		return () => document.removeEventListener('keydown', listener);
	}, [modals]);


	if (modals.length === 0) return null;

	// Render logic:
	// We reverse the modals array for rendering so that:
	// modals[0] (newest) is compiled *last*?
	// Wait. In stack, modals[0] is Top.
	// In DOM, last child is Top (visually).
	// So we should render modals[length-1] .. modals[0].
	// Actually, simple map of reversed array puts modals[0] at the end.
	// modals = [New, Old].
	// Reversed = [Old, New].
	// Render: Old, then New. New covers Old. Correct.

	// However, if we preserve the Vue logic which used simple iteration + z-index,
	// we can just map. Z-index 501 on active handles it.
	// But rendering order still affects default stacking context.

	// Let's render from bottom (oldest) to top (newest).
	// modals stores [Top, ..., Bottom] (due to unshift).
	// So render [...modals].reverse().

	const renderList = [...modals].reverse();

	return (
		<div id="__root_modal" ref={rootRef} className={`__modal-parent ${modals.length ? '__block' : '__hidden'}`}>
			{renderList.map((modal) => {
				const Component = loadedComponents[modal.modalToOpen];
				// If not loaded yet, we can't render it. Ideally openModal ensures load.
				// But React state updates might be async.
				if (!Component) return null; // Or render Spinner?

				return (
					<ModalParent key={modal.id} modal={modal}>
						<Suspense fallback={<Spinner />}>
							<Component
								data={modal.data}
								// Spread any other props if needed, or pass control methods
								close={() => useModalStore.getState().closeModal()} // Utility
							/>
						</Suspense>
					</ModalParent>
				);
			})}
		</div>
	);
}

export default Modal;
