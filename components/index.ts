import type { FileNames, ModalRegistry } from './FileNameEnums';
import Modal from './Modal';
import ModalParent from './ModalParent';
import { useModalStore, type ModalOptions } from './store/modal';

/**
 * Opens a modal component and returns a promise that resolves when the modal is closed.
 *
 * @param {string} modalToOpen - The identifier(name of the modal file) of the modal component to open.
 * @param {Object} [data] - Optional data to pass to the modal component.
 * @param {Object} options - Optional options
 * @returns {Promise<any>} A promise that resolves with the response from the modal.
 */
const openModal = <K extends FileNames>(modalToOpen: K, data?: any, options?: ModalOptions): Promise<ModalRegistry[K]> => {
	return useModalStore.getState().openModal(modalToOpen, data, options);
};

/**
 * Closes an open modal component.
 *
 * @param {*} [response] - Optional response data to send back from the modal.
 * @param {boolean} [sendResponse=true] - Optional flag to determine whether to send the response data. Defaults to true.
 */
const closeModal = (response?: any, sendResponse: boolean = true) => {
	useModalStore.getState().closeModal(response, sendResponse);
};

/**
 * Retrieves a modal component instance by its name.
 */
const getModal = (name: FileNames) => {
	return useModalStore.getState().getModal(name);
};

const useModal = useModalStore;

export {
	openModal,
	closeModal,
	getModal,
	useModal,
	ModalParent,
	Modal
};

export default Modal;
