import { create } from 'zustand';
import React from 'react';
import type { FileNames } from '../FileNameEnums';

// Dynamically import all modal and spinner files
// We look for .mdl.tsx/jsx for modals
const eagerModules = import.meta.glob([
	'/**/*.(mdl).(t|j)sx',
	'!**/node_modules/**'
], { eager: true });


const lazyModules = import.meta.glob([
	'/**/*.(amdl).(t|j)sx',
	'!**/node_modules/**'
]);

const modalModules = { ...eagerModules, ...lazyModules };

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
	modules: Record<string, any>; // Add modules to store

	openModal: (modalToOpen: FileNames, data?: any, options?: ModalOptions) => Promise<any>;
	closeModal: (response?: any, sendResponse?: boolean) => void;
	getModal: (name: string) => ModalItem | undefined;
	loadComponent: (name: string) => void;
	setModules: (modules: Record<string, any>) => void; // Action to update modules
}

const storeName = '__MODAL_STORE__';
const _global = globalThis as any;

// If store exists, reuse it. Otherwise create definition.
const createStore = () => create<ModalStoreState>((set, get) => ({
	modals: [],
	loadedComponents: {},
	modules: modalModules, // Initialize with current modules

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

		const modules = get().modules; // Use store's modules

		// Find module path by name
		// Assumes filename is like "Name.mdl.tsx" or "Name.amdl.tsx"
		const path = Object.keys(modules).find((p) => {
			// p might be /path/to/MyModal.mdl.tsx
			const parts = p.split('/');
			const filename = parts[parts.length - 1]; // MyModal.mdl.tsx
			const simpleName = filename.replace(/\.(mdl|amdl)\.(t|j)sx$/, '');
			return simpleName === name;
		});

		if (path) {
			const mod = modules[path];
			// Check if it is a module with default export (Eager) or a promise function (Lazy)
			if (typeof mod === 'function') {
				const importFn = mod as () => Promise<{ default: React.ComponentType<any> }>;
				const LazyComp = React.lazy(importFn);
				set(state => ({
					loadedComponents: { ...state.loadedComponents, [name]: LazyComp }
				}));
			} else {
				// Eager loaded module
				const Comp = (mod as { default: React.ComponentType<any> }).default;
				set(state => ({
					loadedComponents: { ...state.loadedComponents, [name]: Comp }
				}));
			}
		} else {
			console.warn(`[Modal] Component for "${name}" not found.`);
		}
	},

	setModules: (modules) => set({ modules })
}));

// Singleton logic
export let useModalStore: ReturnType<typeof createStore>;

if (_global[storeName]) {
	// Store exists, reuse the hook
	useModalStore = _global[storeName];
	// Update the modules reference in the existing store!!
	useModalStore.getState().setModules(modalModules);
} else {
	// New store
	useModalStore = createStore();
	_global[storeName] = useModalStore;
}
