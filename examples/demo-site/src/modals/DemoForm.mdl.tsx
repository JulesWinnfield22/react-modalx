import { useState } from 'react';

export type Props = {
	initialTitle: string;
};

export type ReturnType = {
	submitted: boolean;
	title: string;
};

const DemoForm = ({ data, close }: { data: Props; close: (res: ReturnType) => void }) => {
	const [title, setTitle] = useState(data.initialTitle);

	return (
		<div className="modal-content">
			<div className="modal-header">
				<h3>🛡️ Type-Safe Form</h3>
				<button className="close-x" onClick={() => close({ submitted: false, title: '' })}>&times;</button>
			</div>
			<div className="modal-body">
				<p>This modal demonstrates <strong>Full Type Inference</strong>. The data you pass and receive is strictly checked by TypeScript.</p>

				<div className="form-group" style={{ background: 'rgba(255,255,255,0.03)', padding: '1.5rem', borderRadius: '1.25rem', border: '1px solid rgba(255,255,255,0.05)', marginTop: '1.5rem' }}>
					<label style={{ color: 'var(--primary-color)', fontSize: '0.8rem', fontWeight: '700', letterSpacing: '0.05em', marginBottom: '0.75rem', display: 'block' }}>PROJECT IDENTITY</label>
					<input
						type="text"
						value={title}
						onChange={(e) => setTitle(e.target.value)}
						placeholder="E.g. My Awesome Project"
						autoFocus
						style={{ width: '100%', boxSizing: 'border-box' }}
					/>
					<p style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '1rem', marginBottom: 0 }}>
						ℹ️ Type safety ensures you can't pass a number to this title field or forget to handle the result.
					</p>
				</div>
			</div>
			<div className="modal-footer">
				<button className="btn-secondary" onClick={() => close({ submitted: false, title: '' })}>Discard</button>
				<button onClick={() => close({ submitted: true, title })}>Sync Changes</button>
			</div>
		</div>
	);
};

export default DemoForm;
