function buildSandboxedWidget(scriptSrc) {
    return `
        <html>
            <head>
                <script crossorigin src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
                <script crossorigin src="https://unpkg.com/react@18/umd/react.development.js"></script>
                <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
                <script crossorigin src="https://cdn.jsdelivr.net/npm/near-api-js@1.1.0/dist/near-api-js.min.js"></script>
                <script crossorigin src="${scriptSrc}"></script>
            </head>
            <body>
                <div id="app"></div>
                <script type="text/jsx">
                    (function () {
                        ReactDOM.createRoot(document.getElementById('app'))
                            .render(<NearSocialRootWidget />);
                    }())
                </script>
            </body>
        </html>
    `;
}

export function SandboxedIframe({ scriptSrc }) {
    return (
        <iframe
            className='sandboxed-iframe'
            csp={[
                "default-src 'self'",
                "connect-src https://rpc.near.org https://rpc.testnet.near.org",
                "script-src 'unsafe-inline' 'unsafe-eval'",
                "script-src-elem https://unpkg.com https://cdn.jsdelivr.net https://js-external-bundles-ns.s3.us-west-2.amazonaws.com 'unsafe-inline'",
                '',
            ].join('; ')}
            height={300}
            sandbox='allow-scripts'
            srcDoc={buildSandboxedWidget(scriptSrc)}
            title='code-container'
            width={600}
        />
    );
}