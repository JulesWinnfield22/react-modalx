import { openModal } from 'modalx';

const DemoStacked = ({ close }: { close: () => void }) => {
	return (
		<div className="modal-content">
			<div className="modal-header">
				<h3>📚 Smart Stacking</h3>
				<button className="close-x" onClick={() => close()}>&times;</button>
			</div>
			<div className="modal-body">
				<p>ModalX builds a performant virtual stack, managing layers effortlessly for complex user flows.</p>

				<div style={{ display: 'grid', gap: '1rem', marginTop: '1.5rem' }}>
					<div style={{ padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '1rem', border: '1px solid rgba(255,255,255,0.05)' }}>
						<h4 style={{ margin: '0 0 0.5rem', color: '#fff', fontSize: '1rem' }}>🛡️ Focus Recovery</h4>
						<p style={{ margin: 0, fontSize: '0.9rem', color: '#64748b' }}>Closing a top modal returns focus to the previous one perfectly.</p>
					</div>
					<div style={{ padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '1rem', border: '1px solid rgba(255,255,255,0.05)' }}>
						<h4 style={{ margin: '0 0 0.5rem', color: '#fff', fontSize: '1rem' }}>🖱️ Overlay Control</h4>
						<p style={{ margin: 0, fontSize: '0.9rem', color: '#64748b' }}>Each layer manages its own backdrop and click-to-close behavior.</p>
					</div>
				</div>
			</div>
			<div className="modal-footer">
				<button className="btn-secondary" onClick={() => openModal('DemoBasic')}>Add Layer</button>
				<button onClick={() => close()}>Pop All</button>
			</div>
		</div>
	);
};

export default DemoStacked;
