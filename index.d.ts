import React from 'react';
import { FileNames, ModalRegistry } from "./FileNameEnums";

interface ModalOptions {
	closeonEsc?: boolean;
	closeOnOverlayClick?: boolean;
}

type ModalCallback<T> = (response: T) => void;

interface ModalItem<T = any, D = any> {
	modalToOpen: string;
	data: D;
	cb?: ModalCallback<T>;
	active: boolean;
	options?: ModalOptions;
}

interface FetchedModals {
	id: string;
	modal: React.ComponentType<any>;
}

declare module '@customizer/modal-x' {
	export function useModal(): {
		getModal: (filename: FileNames | string) => ModalItem | undefined;
		modals: ModalItem[];
		openModal: <K extends FileNames>(
			filename: K,
			data?: any,
			options?: ModalOptions
		) => Promise<ModalRegistry[K]>;
		closeModal: (response?: any, sendResponse?: boolean) => void;
	};

	export function getModal(filename: FileNames | string): ModalItem | undefined;

	export function openModal<K extends FileNames>(
		filename: K,
		data?: any,
		options?: ModalOptions
	): Promise<ModalRegistry[K]>;

	export function openModal<T = any>(
		filename: string,
		data?: any,
		options?: ModalOptions
	): Promise<T>;

	export function closeModal(response?: any, sendResponse?: boolean): void;

	export const ModalParent: React.FC<{ modal: ModalItem, children: React.ReactNode }>;
	export const Modal: React.FC;

	export default Modal;
}