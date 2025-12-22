import { create } from 'zustand';
import React from 'react';
import type { FileNames } from '../FileNameEnums';

// Dynamically import all modal and spinner files
// We look for .mdl.tsx/jsx for modals
const modalModules = import.meta.glob([
	'/**/*.(mdl|amdl).(t|j)sx',
	'!**/node_modules/**'
]);

// We look for .s.tsx/jsx for spinners if needed
// const spinnerModules = import.meta.glob([ ... ]);

export interface ModalOptions {
	closeOnOverlayClick?: boolean;
	closeonEsc?: boolean;
	[key: string]: any;
}

export interface ModalItem {
	id: string;
	modalToOpen: FileNames;
	data: any;
	cb?: (response: any) => void;
	options?: ModalOptions;
	active: boolean;
}

interface ModalStoreState {
	modals: ModalItem[];
	loadedComponents: Record<string, React.LazyExoticComponent<any> | React.ComponentType<any>>;

	openModal: (modalToOpen: FileNames, data?: any, options?: ModalOptions) => Promise<any>;
	closeModal: (response?: any, sendResponse?: boolean) => void;
	getModal: (name: string) => ModalItem | undefined;
	loadComponent: (name: string) => void;
}

export const useModalStore = create<ModalStoreState>((set, get) => ({
	modals: [],
	loadedComponents: {},

	openModal: (modalToOpen, data, options) => {
		return new Promise((resolve) => {
			// 1. Ensure component is loaded
			get().loadComponent(modalToOpen);

			// 2. Add to stack
			set((state) => {
				const currentModals = state.modals.map(m => ({ ...m, active: false }));

				const newItem: ModalItem = {
					id: Math.random().toString(36).substring(2, 9),
					modalToOpen,
					data,
					cb: resolve, // Store resolve as the callback
					options,
					active: true
				};

				return { modals: [newItem, ...currentModals] };
			});
		});
	},

	closeModal: (response, sendResponse = true) => {
		set((state) => {
			const top = state.modals[0];
			if (!top) return {};

			// Resolve the Promise (callback)
			if (top.cb) {
				if (sendResponse) {
					top.cb(response);
				} else {
					top.cb(undefined); // Force resolve to avoid hanging Promise
				}
			}

			// Remove top
			const remaining = state.modals.slice(1);
			if (remaining.length > 0) {
				remaining[0] = { ...remaining[0], active: true };
			}
			return { modals: remaining };
		});
	},

	getModal: (name) => {
		return get().modals.find(m => m.modalToOpen === name);
	},

	loadComponent: (name) => {
		if (get().loadedComponents[name]) return;

		// Find module path by name
		// Assumes filename is like "Name.mdl.tsx" or "Name.amdl.tsx"
		const path = Object.keys(modalModules).find((p) => {
			// p might be /path/to/MyModal.mdl.tsx
			const parts = p.split('/');
			const filename = parts[parts.length - 1]; // MyModal.mdl.tsx
			const simpleName = filename.split('.')[0]; // MyModal
			return simpleName === name;
		});

		if (path) {
			const importFn = modalModules[path] as () => Promise<{ default: React.ComponentType<any> }>;
			const LazyComp = React.lazy(importFn);
			set(state => ({
				loadedComponents: { ...state.loadedComponents, [name]: LazyComp }
			}));
		} else {
			console.warn(`[Modal] Component for "${name}" not found.`);
		}
	}
}));
