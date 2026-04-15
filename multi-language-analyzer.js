/**
 * Multi-Language Code Analyzer
 * Supports PHP, Python, JavaScript, and Go
 * Uses language-specific parsing and pattern detection
 */

class MultiLanguageAnalyzer {
    constructor() {
        this.analyzers = {
            php: new PHPAnalyzer(),
            python: new PythonAnalyzer(),
            javascript: new JavaScriptAnalyzer(),
            go: new GoAnalyzer()
        };
    }

    detectLanguage(code, filename) {
        // Detect from filename
        if (filename) {
            const ext = filename.split('.').pop().toLowerCase();
            const map = {
                'php': 'php',
                'py': 'python',
                'js': 'javascript',
                'jsx': 'javascript',
                'ts': 'javascript',
                'tsx': 'javascript',
                'go': 'go'
            };
            if (map[ext]) return map[ext];
        }

        // Detect from code content
        if (code.includes('<?php')) return 'php';
        if (code.includes('def ') && (code.includes('import ') || code.includes('from '))) return 'python';
        if (code.includes('function ') || code.includes('const ') || code.includes('let ')) return 'javascript';
        if (code.includes('package main') || code.includes('func ')) return 'go';

        return 'php'; // Default
    }

    async analyze(code, filename) {
        const language = this.detectLanguage(code, filename);
        const analyzer = this.analyzers[language];
        
        if (!analyzer) {
            throw new Error(`Unsupported language: ${language}`);
        }

        const result = await analyzer.analyze(code);
        return {
            language,
            ...result,
            analyzed_at: new Date().toISOString()
        };
    }
}

/**
 * PHP-Specific Analyzer
 */
class PHPAnalyzer {
    async analyze(code) {
        const metrics = this.extractMetrics(code);
        const patterns = this.detectPatterns(code);
        const smells = this.detectSmells(code);
        const security = this.detectSecurity(code);

        return { metrics, patterns, smells, security };
    }

    extractMetrics(code) {
        return {
            functions: (code.match(/function\s+\w+/g) || []).length,
            classes: (code.match(/class\s+\w+/g) || []).length,
            methods: (code.match(/(public|private|protected)\s+function/g) || []).length,
            interfaces: (code.match(/interface\s+\w+/g) || []).length,
            traits: (code.match(/trait\s+\w+/g) || []).length,
            namespaces: (code.match(/namespace\s+[\w\\]+/g) || []).length,
            lines: code.split('\n').filter(l => l.trim()).length,
            comments: (code.match(/\/\*|\*\/|\/\//g) || []).length
        };
    }

    detectPatterns(code) {
        const patterns = [];
        
        if (code.includes('function __construct') && code.includes('$this->')) {
            patterns.push({ name: 'Dependency Injection', confidence: 0.85 });
        }
        if (code.includes('new self') || code.includes('new static')) {
            patterns.push({ name: 'Factory Pattern', confidence: 0.75 });
        }
        if (code.includes('interface') && code.includes('implements')) {
            patterns.push({ name: 'Strategy Pattern', confidence: 0.70 });
        }
        if (code.includes('getInstance') && code.includes('private static')) {
            patterns.push({ name: 'Singleton', confidence: 0.90 });
        }
        if (code.includes('yield')) {
            patterns.push({ name: 'Generator', confidence: 0.95 });
        }
        if (code.includes('try') && code.includes('catch')) {
            patterns.push({ name: 'Exception Handling', confidence: 0.80 });
        }

        return patterns;
    }

    detectSmells(code) {
        const smells = [];
        const lines = code.split('\n');

        // Long methods
        let methodStart = null;
        lines.forEach((line, idx) => {
            if (line.match(/function\s+\w+/)) {
                methodStart = idx;
            } else if (methodStart && (idx - methodStart) > 50 && line.match(/^\s*\}/)) {
                smells.push({
                    type: 'Long Method',
                    severity: 'warning',
                    line: methodStart + 1,
                    message: `Method is ${idx - methodStart} lines long`
                });
                methodStart = null;
            }
        });

        // Too many parameters
        const functions = code.match(/function\s+\w+\s*\([^)]*\)/g) || [];
        functions.forEach(func => {
            const params = func.match(/\(/g)?.length || 0;
            if (params > 5) {
                smells.push({
                    type: 'Too Many Parameters',
                    severity: 'warning',
                    message: `Function has ${params} parameters`
                });
            }
        });

        return smells;
    }

    detectSecurity(code) {
        const issues = [];

        if (code.match(/(mysql_query|mysqli_query|->query)\s*\(\s*["'].*\$/)) {
            issues.push({ type: 'SQL Injection', severity: 'critical' });
        }
        if (code.match(/echo\s+.*\$_(GET|POST|REQUEST)/)) {
            issues.push({ type: 'XSS', severity: 'high' });
        }
        if (code.includes('eval(')) {
            issues.push({ type: 'Code Injection', severity: 'critical' });
        }
        if (code.match(/(md5|sha1)\s*\(/)) {
            issues.push({ type: 'Weak Hashing', severity: 'medium' });
        }

        return issues;
    }
}

/**
 * Python-Specific Analyzer
 */
class PythonAnalyzer {
    async analyze(code) {
        const metrics = this.extractMetrics(code);
        const patterns = this.detectPatterns(code);
        const smells = this.detectSmells(code);

        return { metrics, patterns, smells, security: [] };
    }

    extractMetrics(code) {
        return {
            functions: (code.match(/^\s*def\s+\w+/gm) || []).length,
            classes: (code.match(/^\s*class\s+\w+/gm) || []).length,
            methods: (code.match(/^\s*def\s+\w+\(self/gm) || []).length,
            imports: (code.match(/^(import|from)\s+/gm) || []).length,
            decorators: (code.match(/^\s*@/gm) || []).length,
            lines: code.split('\n').filter(l => l.trim() && !l.trim().startsWith('#')).length,
            comments: (code.match(/^#/gm) || []).length,
            type_hints: (code.match(/:\s*(str|int|float|bool|List|Dict|Optional)/g) || []).length
        };
    }

    detectPatterns(code) {
        const patterns = [];

        if (code.includes('class ') && code.includes('def __init__')) {
            patterns.push({ name: 'OOP Class', confidence: 0.95 });
        }
        if (code.includes('@property')) {
            patterns.push({ name: 'Property Decorator', confidence: 0.90 });
        }
        if (code.includes('@staticmethod') || code.includes('@classmethod')) {
            patterns.push({ name: 'Static/Class Methods', confidence: 0.85 });
        }
        if (code.includes('with ') && code.includes('as ')) {
            patterns.push({ name: 'Context Manager', confidence: 0.80 });
        }
        if (code.includes('yield')) {
            patterns.push({ name: 'Generator', confidence: 0.95 });
        }
        if (code.includes('try:') && code.includes('except')) {
            patterns.push({ name: 'Exception Handling', confidence: 0.80 });
        }
        if (code.includes('lambda ')) {
            patterns.push({ name: 'Functional Programming', confidence: 0.75 });
        }

        return patterns;
    }

    detectSmells(code) {
        const smells = [];

        // Long functions
        const funcMatches = [...code.matchAll(/^\s*def\s+(\w+)/gm)];
        funcMatches.forEach((match, idx) => {
            const nextFunc = funcMatches[idx + 1];
            const lines = nextFunc 
                ? (nextFunc.index - match.index) / 1 
                : code.length - match.index;
            
            if (lines > 50) {
                smells.push({
                    type: 'Long Function',
                    severity: 'warning',
                    message: `${match[1]} is ${Math.round(lines)} lines`
                });
            }
        });

        // Global variables
        if (code.match(/^\s*global\s+\w+/gm)) {
            smells.push({ type: 'Global Variables', severity: 'warning' });
        }

        // Bare except
        if (code.match(/except\s*:/)) {
            smells.push({ type: ' Bare Except', severity: 'warning' });
        }

        return smells;
    }
}

/**
 * JavaScript/TypeScript Analyzer
 */
class JavaScriptAnalyzer {
    async analyze(code) {
        const metrics = this.extractMetrics(code);
        const patterns = this.detectPatterns(code);
        const smells = this.detectSmells(code);

        return { metrics, patterns, smells, security: [] };
    }

    extractMetrics(code) {
        return {
            functions: (code.match(/function\s+\w+/g) || []).length,
            arrowFunctions: (code.match(/=>/g) || []).length,
            classes: (code.match(/class\s+\w+/g) || []).length,
            methods: (code.match(/(async\s+)?\w+\s*\([^)]*\)\s*\{/g) || []).length,
            promises: (code.match(/Promise|async|await/g) || []).length,
            imports: (code.match(/import\s+.*from/g) || []).length,
            exports: (code.match(/export\s+(default\s+)?/g) || []).length,
            lines: code.split('\n').filter(l => l.trim() && !l.trim().startsWith('//')).length,
            comments: (code.match(/\/\*|\/\//g) || []).length,
            typescriptTypes: (code.match(/:\s*(string|number|boolean|interface|type|enum)/g) || []).length
        };
    }

    detectPatterns(code) {
        const patterns = [];

        if (code.includes('class ') && code.includes('constructor')) {
            patterns.push({ name: 'ES6 Class', confidence: 0.95 });
        }
        if (code.includes('Promise') || code.includes('async')) {
            patterns.push({ name: 'Async/Await', confidence: 0.90 });
        }
        if (code.includes('.then(')) {
            patterns.push({ name: 'Promise Chain', confidence: 0.85 });
        }
        if (code.includes('=>') && code.includes('map(')) {
            patterns.push({ name: 'Functional Programming', confidence: 0.80 });
        }
        if (code.includes('try') && code.includes('catch')) {
            patterns.push({ name: 'Error Handling', confidence: 0.80 });
        }
        if (code.includes('interface ') || code.includes('type ')) {
            patterns.push({ name: 'TypeScript Types', confidence: 0.90 });
        }
        if (code.includes('useState') || code.includes('useEffect')) {
            patterns.push({ name: 'React Hooks', confidence: 0.95 });
        }

        return patterns;
    }

    detectSmells(code) {
        const smells = [];

        // Callback hell
        const callbackDepth = this.calculateCallbackDepth(code);
        if (callbackDepth > 3) {
            smells.push({
                type: 'Callback Hell',
                severity: 'warning',
                message: `Deep callback nesting (${callbackDepth} levels)`
            });
        }

        // Var usage
        if (code.match(/\bvar\s+\w+/g)) {
            smells.push({ type: 'Using var instead of let/const', severity: 'info' });
        }

        // Any type in TypeScript
        if (code.match(/:\s*any/g)) {
            smells.push({ type: 'Using any type', severity: 'info' });
        }

        return smells;
    }

    calculateCallbackDepth(code) {
        let maxDepth = 0;
        let depth = 0;
        const lines = code.split('\n');
        
        lines.forEach(line => {
            if (line.includes('function(') || line.includes('=>')) {
                depth++;
                maxDepth = Math.max(maxDepth, depth);
            }
            if (line.includes('})') || line.includes('});')) {
                depth--;
            }
        });

        return maxDepth;
    }
}

/**
 * Go-Specific Analyzer
 */
class GoAnalyzer {
    async analyze(code) {
        const metrics = this.extractMetrics(code);
        const patterns = this.detectPatterns(code);
        const smells = this.detectSmells(code);

        return { metrics, patterns, smells, security: [] };
    }

    extractMetrics(code) {
        return {
            functions: (code.match(/^func\s+\w+/gm) || []).length,
            methods: (code.match(/^func\s+\([^)]+\)\s+\w+/gm) || []).length,
            interfaces: (code.match(/type\s+\w+\s+interface/g) || []).length,
            structs: (code.match(/type\s+\w+\s+struct/g) || []).length,
            goroutines: (code.match(/\bgo\s+\w+/g) || []).length,
            channels: (code.match(/make\(chan|<-/g) || []).length,
            imports: (code.match(/import\s*\(/g) || []).length,
            lines: code.split('\n').filter(l => l.trim() && !l.trim().startsWith('//')).length,
            comments: (code.match(/\/\*|\/\//g) || []).length,
            errorHandling: (code.match(/if\s+err\s*!=\s*nil/g) || []).length
        };
    }

    detectPatterns(code) {
        const patterns = [];

        if (code.includes('type ') && code.includes('struct')) {
            patterns.push({ name: 'Struct-based OOP', confidence: 0.95 });
        }
        if (code.includes('interface')) {
            patterns.push({ name: 'Interface Design', confidence: 0.90 });
        }
        if (code.includes('go ')) {
            patterns.push({ name: 'Concurrency', confidence: 0.95 });
        }
        if (code.includes('chan') || code.includes('select {')) {
            patterns.push({ name: 'Channel Communication', confidence: 0.90 });
        }
        if (code.includes('defer ')) {
            patterns.push({ name: 'Defer Pattern', confidence: 0.95 });
        }
        if (code.match(/if\s+err\s*!=\s*nil/)) {
            patterns.push({ name: 'Error Handling', confidence: 0.80 });
        }

        return patterns;
    }

    detectSmells(code) {
        const smells = [];

        // Ignored errors
        if (code.match(/:=.*\b_\b/)) {
            smells.push({ type: 'Ignored Error Return', severity: 'warning' });
        }

        // Long functions
        const funcMatches = [...code.matchAll(/^func\s+(\w+)/gm)];
        funcMatches.forEach((match, idx) => {
            const nextFunc = funcMatches[idx + 1];
            const lines = nextFunc 
                ? (nextFunc.index - match.index) / 1 
                : code.length - match.index;
            
            if (lines > 40) {
                smells.push({
                    type: 'Long Function',
                    severity: 'warning',
                    message: `${match[1]} is ${Math.round(lines)} lines`
                });
            }
        });

        // Panic usage
        if (code.includes('panic(')) {
            smells.push({ type: 'Using panic', severity: 'warning' });
        }

        return smells;
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { MultiLanguageAnalyzer };
}
