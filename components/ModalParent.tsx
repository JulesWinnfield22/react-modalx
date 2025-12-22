import React, { useEffect } from 'react';
import { useModalStore, type ModalItem } from './store/modal';

interface ModalParentProps {
	modal: ModalItem;
	children: React.ReactNode;
}

const ModalParent: React.FC<ModalParentProps> = ({ modal, children }) => {
	const { closeModal } = useModalStore();
	const { options, active } = modal;

	useEffect(() => {
		const escListener = (e: KeyboardEvent) => {
			// Logic: if this modal is active (topmost) and esc is allowed
			if (e.key === 'Escape' && active && (options?.closeonEsc ?? true)) {
				closeModal();
			}
		};

		// Attach listener
		document.addEventListener('keydown', escListener);
		return () => {
			document.removeEventListener('keydown', escListener);
		};
	}, [active, options, closeModal]);

	const handleOverlayClick = (e: React.MouseEvent) => {
		// Check if the click is on the overlay itself (__modal div)
		if (e.target === e.currentTarget && (options?.closeOnOverlayClick ?? true)) {
			closeModal();
		}
	};

	return (
		<div
			onClick={handleOverlayClick}
			className={`__modal ${!active ? '__inactive' : '__active'}`}
			style={{
				display: !active ? 'none' : 'block' // Or handled by z-index/pointer-events in CSS
			}}
		>
			{children}
		</div>
	);
};

export default ModalParent;
