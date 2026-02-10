import React, { useState, useEffect, useRef } from 'react';
import Prism from 'prismjs';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-tsx';
import 'prismjs/components/prism-bash';

interface CodeBlockProps {
	code: string;
	language?: string;
}

const CodeBlock: React.FC<CodeBlockProps> = ({ code, language = 'tsx' }) => {
	const [copied, setCopied] = useState(false);
	const codeRef = useRef<HTMLElement>(null);

	useEffect(() => {
		if (codeRef.current) {
			Prism.highlightElement(codeRef.current);
		}
	}, [code, language]);

	const copyToClipboard = () => {
		navigator.clipboard.writeText(code);
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	};

	return (
		<div className="code-block-container">
			<div className="code-header">
				<span className="code-lang">{language}</span>
				<button className="copy-btn" onClick={copyToClipboard}>
					{copied ? 'Copied!' : 'Copy'}
				</button>
			</div>
			<pre className={`language-${language}`}>
				<code ref={codeRef} className={`language-${language}`}>
					{code}
				</code>
			</pre>
		</div>
	);
};

export default CodeBlock;
