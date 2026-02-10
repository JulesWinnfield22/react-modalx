const DemoLazy = ({ close }: { close: () => void }) => {
	return (
		<div className="modal-content">
			<div className="modal-header">
				<h3>⚡ Lazy Modal</h3>
				<button className="close-x" onClick={() => close()}>&times;</button>
			</div>
			<div className="modal-body">
				<p>This modal was loaded via <strong>automatic code-splitting</strong>.</p>
				<p>It's part of a separate chunk that was only fetched over the network when you clicked the button. Perfect for keeping your initial bundle size small.</p>
			</div>
			<div className="modal-footer">
				<button onClick={() => close()}>Awesome!</button>
			</div>
		</div>
	);
};

export default DemoLazy;
