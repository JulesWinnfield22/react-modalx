import React from 'react';
import CodeBlock from './CodeBlock';

interface DemoSectionProps {
	title: string;
	description: string;
	icon: string;
	children: React.ReactNode;
	code: string;
}

const DemoSection: React.FC<DemoSectionProps> = ({ title, description, icon, children, code }) => {
	return (
		<section className="demo-section">
			<div className="demo-info">
				<div className="demo-title-row">
					<span className="demo-icon">{icon}</span>
					<h2>{title}</h2>
				</div>
				<p>{description}</p>
				<div className="demo-interactive">
					{children}
				</div>
			</div>
			<div className="demo-code">
				<CodeBlock code={code} />
			</div>
		</section>
	);
};

export default DemoSection;
