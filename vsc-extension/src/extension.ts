import * as vscode from 'vscode';
import axios from 'axios';

interface AnalysisResult {
    metrics: any;
    patterns: any;
    code_smells: any;
    security_issues: any;
    quality: any;
    embeddings: any;
}

export function activate(context: vscode.ExtensionContext) {
    console.log('AI Code Visualizer is now active!');

    // Analyze Code Command
    const analyzeCommand = vscode.commands.registerCommand(
        'ai-code-visualizer.analyze',
        async () => {
            const editor = vscode.window.activeTextEditor;
            if (!editor) {
                vscode.window.showWarningMessage('No active editor found');
                return;
            }

            const code = editor.document.getText();
            const filename = editor.document.fileName;

            try {
                vscode.window.withProgress(
                    {
                        location: vscode.ProgressLocation.Notification,
                        title: 'Analyzing code with AI...',
                        cancellable: false
                    },
                    async (progress) => {
                        progress.report({ increment: 0, message: 'Parsing code...' });

                        const config = vscode.workspace.getConfiguration('aiCodeVisualizer');
                        const backendUrl = config.get('backendUrl', 'http://localhost:8080');

                        progress.report({ increment: 25, message: 'Running AST analysis...' });

                        const response = await axios.post(`${backendUrl}/api/analyze`, {
                            code,
                            filename
                        });

                        progress.report({ increment: 50, message: 'Processing results...' });

                        if (response.data.success) {
                            const result: AnalysisResult = response.data.analysis;
                            await showAnalysisResult(result, editor);
                            
                            progress.report({ increment: 100, message: 'Analysis complete!' });
                        } else {
                            throw new Error('Analysis failed');
                        }
                    }
                );
            } catch (error: any) {
                vscode.window.showErrorMessage(
                    `Analysis failed: ${error.message}\n\nMake sure the backend server is running.`
                );
            }
        }
    );

    // Security Scan Command
    const securityCommand = vscode.commands.registerCommand(
        'ai-code-visualizer.securityScan',
        async () => {
            const editor = vscode.window.activeTextEditor;
            if (!editor) {
                vscode.window.showWarningMessage('No active editor found');
                return;
            }

            const code = editor.document.getText();
            const filename = editor.document.fileName;

            try {
                const config = vscode.workspace.getConfiguration('aiCodeVisualizer');
                const backendUrl = config.get('backendUrl', 'http://localhost:8080');

                const response = await axios.post(`${backendUrl}/api/security`, {
                    code,
                    filename
                });

                if (response.data.success) {
                    showSecurityResults(response.data.scan);
                }
            } catch (error: any) {
                vscode.window.showErrorMessage(`Security scan failed: ${error.message}`);
            }
        }
    );

    // Refactoring Suggestions Command
    const refactorCommand = vscode.commands.registerCommand(
        'ai-code-visualizer.refactor',
        async () => {
            const editor = vscode.window.activeTextEditor;
            if (!editor) {
                vscode.window.showWarningMessage('No active editor found');
                return;
            }

            const code = editor.document.getText();
            
            try {
                const config = vscode.workspace.getConfiguration('aiCodeVisualizer');
                const backendUrl = config.get('backendUrl', 'http://localhost:8080');

                const response = await axios.post(`${backendUrl}/api/quality`, { code });

                if (response.data.success) {
                    showRefactoringSuggestions(response.data.quality);
                }
            } catch (error: any) {
                vscode.window.showErrorMessage(`Refactoring analysis failed: ${error.message}`);
            }
        }
    );

    // Show Dashboard Command
    const dashboardCommand = vscode.commands.registerCommand(
        'ai-code-visualizer.showDashboard',
        () => {
            const panel = vscode.window.createWebviewPanel(
                'aiCodeVisualizerDashboard',
                'AI Code Visualizer Dashboard',
                vscode.ViewColumn.One,
                {
                    enableScripts: true,
                    retainContextWhenHidden: true
                }
            );

            panel.webview.html = getDashboardHtml();
        }
    );

    context.subscriptions.push(
        analyzeCommand,
        securityCommand,
        refactorCommand,
        dashboardCommand
    );

    // Auto-scan on save (if enabled)
    const onDidSave = vscode.workspace.onDidSaveTextDocument(async (document) => {
        const config = vscode.workspace.getConfiguration('aiCodeVisualizer');
        if (config.get('securityScanOnSave', false) && document.languageId === 'php') {
            const code = document.getText();
            const filename = document.fileName;

            try {
                const backendUrl = config.get('backendUrl', 'http://localhost:8080');
                const response = await axios.post(`${backendUrl}/api/security`, {
                    code,
                    filename
                });

                if (response.data.success && response.data.scan.critical > 0) {
                    vscode.window.showWarningMessage(
                        `⚠️ ${response.data.scan.critical} critical security issues found!`
                    );
                }
            } catch (error) {
                // Silently fail for auto-scan
            }
        }
    });

    context.subscriptions.push(onDidSave);
}

async function showAnalysisResult(result: AnalysisResult, editor: vscode.TextEditor) {
    const panel = vscode.window.createWebviewPanel(
        'aiCodeAnalysis',
        'AI Code Analysis',
        vscode.ViewColumn.Two,
        {
            enableScripts: true,
            retainContextWhenHidden: true
        }
    );

    panel.webview.html = getAnalysisHtml(result);
}

function showSecurityResults(scan: any) {
    const panel = vscode.window.createWebviewPanel(
        'aiSecurityScan',
        'Security Scan Results',
        vscode.ViewColumn.Two,
        {
            enableScripts: true
        }
    );

    panel.webview.html = getSecurityHtml(scan);
}

function showRefactoringSuggestions(quality: any) {
    const suggestions = quality.improvements || [];
    
    if (suggestions.length === 0) {
        vscode.window.showInformationMessage('✅ Code quality is excellent! No refactoring needed.');
        return;
    }

    const message = [
        `Code Quality Score: ${quality.score}/10`,
        `Category: ${quality.category}`,
        '',
        'Suggestions:',
        ...suggestions.map((s: string, i: number) => `${i + 1}. ${s}`)
    ].join('\n');

    vscode.window.showInformationMessage(message, { modal: true });
}

function getAnalysisHtml(result: any): string {
    return `<!DOCTYPE html>
<html>
<head>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            padding: 20px;
            background: var(--vscode-editor-background);
            color: var(--vscode-editor-foreground);
        }
        h2 {
            color: var(--vscode-textLink-foreground);
            border-bottom: 2px solid var(--vscode-textLink-foreground);
            padding-bottom: 10px;
        }
        .metric {
            display: inline-block;
            background: var(--vscode-editor-inactiveSelectionBackground);
            padding: 15px;
            margin: 10px;
            border-radius: 8px;
            text-align: center;
            min-width: 120px;
        }
        .metric-value {
            font-size: 2em;
            font-weight: bold;
            color: var(--vscode-textLink-foreground);
        }
        .metric-label {
            font-size: 0.8em;
            color: var(--vscode-descriptionForeground);
        }
        .pattern {
            display: inline-block;
            background: var(--vscode-badge-background);
            color: var(--vscode-badge-foreground);
            padding: 8px 15px;
            margin: 5px;
            border-radius: 20px;
        }
        .quality-score {
            font-size: 3em;
            font-weight: bold;
            text-align: center;
            margin: 20px 0;
        }
        .good { color: #4caf50; }
        .warning { color: #ff9800; }
        .error { color: #f44336; }
    </style>
</head>
<body>
    <h1>🧠 AI Code Analysis</h1>
    
    <h2>📊 Metrics</h2>
    <div class="metric">
        <div class="metric-value">${result.metrics.functions || 0}</div>
        <div class="metric-label">Functions</div>
    </div>
    <div class="metric">
        <div class="metric-value">${result.metrics.classes || 0}</div>
        <div class="metric-label">Classes</div>
    </div>
    <div class="metric">
        <div class="metric-value">${result.metrics.methods || 0}</div>
        <div class="metric-label">Methods</div>
    </div>
    <div class="metric">
        <div class="metric-value">${result.metrics.lines_of_code || 0}</div>
        <div class="metric-label">Lines of Code</div>
    </div>

    <h2>🎯 Detected Patterns</h2>
    ${result.patterns.map((p: any) => `
        <span class="pattern">${p.name} (${(p.confidence * 100).toFixed(0)}%)</span>
    `).join('')}

    <h2>✨ Quality Score</h2>
    <div class="quality-score ${result.quality_score >= 7 ? 'good' : result.quality_score >= 4 ? 'warning' : 'error'}">
        ${result.quality_score.toFixed(1)}/10
    </div>

    <h2>🔒 Security Issues</h2>
    <p>Critical: <strong class="error">${result.security?.critical || 0}</strong></p>
    <p>High: <strong class="warning">${result.security?.high || 0}</strong></p>
    <p>Medium: <strong class="warning">${result.security?.medium || 0}</strong></p>
</body>
</html>`;
}

function getSecurityHtml(scan: any): string {
    const riskColor = scan.risk_level === 'CRITICAL' ? '#f44336' :
                     scan.risk_level === 'HIGH' ? '#ff9800' :
                     scan.risk_level === 'MEDIUM' ? '#ff9800' : '#4caf50';

    return `<!DOCTYPE html>
<html>
<head>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            padding: 20px;
            background: var(--vscode-editor-background);
            color: var(--vscode-editor-foreground);
        }
        h2 { color: var(--vscode-textLink-foreground); }
        .vulnerability {
            background: var(--vscode-editor-inactiveSelectionBackground);
            padding: 15px;
            margin: 10px 0;
            border-left: 4px solid ${riskColor};
            border-radius: 4px;
        }
        .critical { border-left-color: #f44336; }
        .high { border-left-color: #ff9800; }
        .medium { border-left-color: #ff9800; }
        .low { border-left-color: #4caf50; }
        .risk-level {
            font-size: 2.5em;
            font-weight: bold;
            text-align: center;
            color: ${riskColor};
            margin: 20px 0;
        }
    </style>
</head>
<body>
    <h1>🛡️ Security Scan Results</h1>
    
    <div class="risk-level">${scan.risk_level}</div>
    <p style="text-align: center;">Risk Score: ${scan.risk_score}/10</p>

    <h2>Vulnerabilities Found: ${scan.total_issues}</h2>
    
    ${scan.vulnerabilities.map((v: any) => `
        <div class="vulnerability ${v.severity}">
            <h3>${v.type} <span class="${v.severity}">[${v.severity.toUpperCase()}]</span></h3>
            <p><strong>Message:</strong> ${v.message}</p>
            <p><strong>Fix:</strong> ${v.fix}</p>
            <p><strong>CWE:</strong> ${v.cwe}</p>
        </div>
    `).join('')}
</body>
</html>`;
}

function getDashboardHtml(): string {
    return `<!DOCTYPE html>
<html>
<head>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            padding: 20px;
            background: var(--vscode-editor-background);
            color: var(--vscode-editor-foreground);
        }
        h1 { text-align: center; }
        .stats {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 20px;
            margin: 30px 0;
        }
        .stat-card {
            background: var(--vscode-editor-inactiveSelectionBackground);
            padding: 20px;
            border-radius: 10px;
            text-align: center;
        }
        .stat-value {
            font-size: 2.5em;
            font-weight: bold;
            color: var(--vscode-textLink-foreground);
        }
        .stat-label {
            font-size: 0.9em;
            color: var(--vscode-descriptionForeground);
            margin-top: 10px;
        }
    </style>
</head>
<body>
    <h1>🧠 AI Code Visualizer Dashboard</h1>
    
    <div class="stats">
        <div class="stat-card">
            <div class="stat-value">0</div>
            <div class="stat-label">Files Analyzed</div>
        </div>
        <div class="stat-card">
            <div class="stat-value">0</div>
            <div class="stat-label">Patterns Detected</div>
        </div>
        <div class="stat-card">
            <div class="stat-value">0</div>
            <div class="stat-label">Security Issues</div>
        </div>
        <div class="stat-card">
            <div class="stat-value">0</div>
            <div class="stat-label">Avg Quality Score</div>
        </div>
    </div>

    <p style="text-align: center; color: var(--vscode-descriptionForeground);">
        Start analyzing code by opening a file and running the "AI Code Visualizer: Analyze Code" command.
    </p>
</body>
</html>`;
}

export function deactivate() {}
