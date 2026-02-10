const DemoBasic = ({ close }: { close: () => void }) => {
	return (
		<div className="modal-content">
			<div className="modal-header">
				<h3>🚀 Eager Modal</h3>
				<button className="close-x" onClick={() => close()}>&times;</button>
			</div>
			<div className="modal-body">
				<p>This modal was bundled with the main application and opens <strong>instantly</strong>.</p>
				<p>Best for login forms, critical alerts, or frequently used tools where zero-latency is priority.</p>
			</div>
			<div className="modal-footer">
				<button onClick={() => close()}>Understood</button>
			</div>
		</div>
	);
};

export default DemoBasic;
