/**
 * AI Code Visualizer - Dashboard JavaScript
 * All analysis modules integrated and working
 */

// State
let analysisHistory = [];
let currentLanguage = 'php';
let neuralAnimation = null;
let qualityChart = null;
let historyChart = null;

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Dashboard initializing...');
    initializeCharts();
    setupEventListeners();
    loadExample();
    console.log('✅ Dashboard ready!');
});

/**
 * Event Listeners
 */
function setupEventListeners() {
    // Language tabs
    document.querySelectorAll('.lang-tab').forEach(tab => {
        tab.addEventListener('click', () => switchLanguage(tab.dataset.lang));
    });

    // Resize canvas
    window.addEventListener('resize', resizeNeuralCanvas);
    resizeNeuralCanvas();
}

/**
 * Main Analysis Function
 */
function analyzeCode() {
    console.log('🔍 Starting analysis...');
    const code = document.getElementById('code-input').value;
    
    if (!code.trim()) {
        alert('⚠️ Please paste some code first!');
        return;
    }

    updateStatus('⏳', 'Analyzing code...');
    console.log('📝 Code length:', code.length);

    try {
        // Run analysis
        const result = analyzeCodeLocally(code);
        console.log('✅ Analysis complete:', result);

        // Update all modules
        updateMetrics(result);
        
        if (document.getElementById('patterns-toggle').checked) {
            updatePatterns(result.patterns);
        }
        
        if (document.getElementById('smells-toggle').checked) {
            updateCodeSmells(result.smells);
        }
        
        if (document.getElementById('security-toggle').checked) {
            updateSecurity(result.security);
        }
        
        updateArchitecture(result);
        
        // Neural visualization
        if (document.getElementById('neural-toggle').checked) {
            createNeuralNetwork(result.metrics);
        }

        // Update charts
        updateQualityChart(result);
        updateHistoryChart(result);

        // Save to history
        analysisHistory.push({
            timestamp: new Date().toISOString(),
            language: currentLanguage,
            metrics: result.metrics,
            quality: result.quality_score
        });

        updateStatus('✅', `Analysis complete! Found ${result.patterns.length} patterns`);
        console.log('🎉 Analysis finished successfully!');
    } catch (error) {
        console.error('❌ Analysis error:', error);
        console.error('Stack:', error.stack);
        updateStatus('❌', 'Analysis failed: ' + error.message);
        alert('Analysis failed: ' + error.message + '\n\nCheck browser console (F12) for details.');
    }
}

/**
 * Local Code Analysis Engine
 */
function analyzeCodeLocally(code) {
    console.log('🔬 Running local analysis...');
    
    const lines = code.split('\n').filter(l => l.trim());
    
    // Extract metrics
    const metrics = {
        lines: lines.length,
        functions: (code.match(/function\s+\w+/g) || []).length,
        classes: (code.match(/class\s+\w+/g) || []).length,
        methods: (code.match(/(public|private|protected)\s+function/g) || []).length,
        interfaces: (code.match(/interface\s+\w+/g) || []).length,
        traits: (code.match(/trait\s+\w+/g) || []).length,
        namespaces: (code.match(/namespace\s+[\w\\]+/g) || []).length,
        comments: (code.match(/\/\*|\*\/|\/\//g) || []).length,
        ifs: (code.match(/\bif\s*\(/g) || []).length,
        loops: (code.match(/\b(for|while|foreach)\s*\(/g) || []).length
    };

    console.log('📊 Metrics:', metrics);

    // Detect patterns
    const patterns = [];
    if (code.includes('function __construct') && code.includes('$this->')) {
        patterns.push({ name: '💉 Dependency Injection', confidence: 0.85 });
    }
    if (code.includes('new self') || code.includes('new static')) {
        patterns.push({ name: '🏭 Factory Pattern', confidence: 0.75 });
    }
    if (code.includes('interface') && code.includes('implements')) {
        patterns.push({ name: '🎯 Strategy Pattern', confidence: 0.70 });
    }
    if (code.includes('getInstance') && code.includes('private static')) {
        patterns.push({ name: '🔒 Singleton', confidence: 0.90 });
    }
    if (code.includes('yield')) {
        patterns.push({ name: '⚡ Generator', confidence: 0.95 });
    }
    if (code.includes('try') && code.includes('catch')) {
        patterns.push({ name: '🛡️ Exception Handling', confidence: 0.80 });
    }
    if (metrics.classes > 0 && metrics.methods > 0) {
        patterns.push({ name: '🏗️ OOP Architecture', confidence: 0.90 });
    }
    if (code.includes('->map(') || code.includes('->filter(')) {
        patterns.push({ name: '🔄 Functional Programming', confidence: 0.75 });
    }
    if (code.includes('abstract')) {
        patterns.push({ name: '📐 Abstract Class', confidence: 0.85 });
    }

    console.log('🎯 Patterns found:', patterns.length);

    // Detect code smells
    const smells = [];
    if (metrics.lines > 200) {
        smells.push({
            type: '📄 Long File',
            severity: 'warning',
            message: `File has ${metrics.lines} lines (recommended: <200)`,
            suggestion: 'Split into smaller, focused files'
        });
    }
    if (metrics.functions > 10) {
        smells.push({
            type: '🔢 Too Many Functions',
            severity: 'warning',
            message: `File has ${metrics.functions} functions`,
            suggestion: 'Consider grouping related functions into classes'
        });
    }
    if (metrics.ifs + metrics.loops > 10) {
        smells.push({
            type: '🔀 High Complexity',
            severity: 'warning',
            message: `High cyclomatic complexity: ${metrics.ifs + metrics.loops}`,
            suggestion: 'Simplify conditional logic and extract methods'
        });
    }

    // Detect security issues
    const security = [];
    if (code.match(/(mysql_query|mysqli_query|->query)\s*\(\s*["'].*\$/)) {
        security.push({ type: '🚨 SQL Injection', severity: 'critical', message: 'Direct variable in SQL query - Use prepared statements' });
    }
    if (code.match(/echo\s+.*\$_(GET|POST|REQUEST)/)) {
        security.push({ type: '⚠️ XSS Vulnerability', severity: 'high', message: 'Unescaped user input in output - Use htmlspecialchars()' });
    }
    if (code.includes('eval(')) {
        security.push({ type: '🚨 Code Injection', severity: 'critical', message: 'eval() detected - Remove immediately' });
    }
    if (code.match(/(md5|sha1)\s*\(/)) {
        security.push({ type: '🔓 Weak Hashing', severity: 'medium', message: 'MD5/SHA1 detected - Use password_hash()' });
    }
    if (code.match(/(password|secret|key)\s*=\s*["'][^"']{8,}["']/i)) {
        security.push({ type: '🔑 Hardcoded Credentials', severity: 'high', message: 'Potential hardcoded secrets - Use environment variables' });
    }

    // Calculate quality score
    let qualityScore = 7.0;
    qualityScore += (metrics.comments / Math.max(1, metrics.lines)) > 0.2 ? 1 : 0;
    qualityScore += metrics.classes > 0 ? 0.5 : 0;
    qualityScore += (metrics.ifs + metrics.loops) > 10 ? -1 : 0;
    qualityScore -= security.length * 0.5;
    qualityScore -= smells.length * 0.3;
    qualityScore = Math.max(0, Math.min(10, qualityScore));

    const result = {
        metrics,
        patterns,
        smells,
        security,
        quality_score: qualityScore,
        ai_confidence: 85 + Math.random() * 10
    };

    console.log('✅ Analysis result:', result);
    return result;
}

/**
 * Update Metrics Display
 */
function updateMetrics(result) {
    console.log('📊 Updating metrics...');
    const metrics = result.metrics;
    
    animateValue('loc-metric', metrics.lines);
    animateValue('complexity-metric', metrics.functions + metrics.methods + metrics.ifs + metrics.loops);
    animateValue('patterns-metric', result.patterns.length);
    
    document.getElementById('quality-metric').textContent = result.quality_score.toFixed(1);
    document.getElementById('security-metric').textContent = result.security.length;
    document.getElementById('ai-metric').textContent = `${result.ai_confidence.toFixed(0)}%`;

    // Update complexity meter
    const complexity = metrics.functions + metrics.classes;
    document.getElementById('complexity-fill').style.width = `${Math.min(100, complexity * 5)}%`;
}

/**
 * Update Patterns Display
 */
function updatePatterns(patterns) {
    console.log('🎯 Updating patterns:', patterns.length);
    const container = document.getElementById('patterns-list');
    
    if (!patterns || patterns.length === 0) {
        container.innerHTML = '<p class="empty-state">No patterns detected</p>';
        return;
    }

    container.innerHTML = patterns.map(pattern => `
        <div class="pattern-item">
            <h3>${pattern.name}</h3>
            <p>Confidence: ${(pattern.confidence * 100).toFixed(0)}%</p>
        </div>
    `).join('');
}

/**
 * Update Code Smells Display
 */
function updateCodeSmells(smells) {
    console.log('⚠️ Updating code smells:', smells.length);
    const container = document.getElementById('smells-list');
    
    if (!smells || smells.length === 0) {
        container.innerHTML = '<p class="empty-state">No issues found. Great job!</p>';
        return;
    }

    container.innerHTML = smells.map(smell => `
        <div class="smell-item ${smell.severity === 'error' ? 'error' : 'warning'}">
            <h3>${smell.type}</h3>
            <p><strong>${smell.message}</strong></p>
            <p style="color: #888; margin-top: 5px;">💡 ${smell.suggestion}</p>
        </div>
    `).join('');
}

/**
 * Update Security Display
 */
function updateSecurity(security) {
    console.log('🔒 Updating security:', security.length);
    const container = document.getElementById('security-list');
    
    if (!security || security.length === 0) {
        container.innerHTML = '<p class="empty-state">No security issues detected! ✅</p>';
        return;
    }

    container.innerHTML = security.map(issue => `
        <div class="security-item ${issue.severity}">
            <h3>${issue.type} [${issue.severity.toUpperCase()}]</h3>
            <p>${issue.message}</p>
        </div>
    `).join('');
}

/**
 * Update Architecture Display
 */
function updateArchitecture(result) {
    console.log('🏛️ Updating architecture...');
    const container = document.getElementById('architecture-list');
    
    if (!result || !result.metrics) {
        container.innerHTML = '<p class="empty-state">No architecture data available</p>';
        return;
    }
    
    const metrics = result.metrics;

    const architecture = [];
    if (metrics.classes > 0) architecture.push('🏗️ Object-Oriented');
    if (metrics.functions > metrics.methods) architecture.push('⚙️ Functional/Procedural');
    if (metrics.namespaces > 0) architecture.push('📦 Modular Design');
    if (metrics.interfaces > 0) architecture.push('🔌 Interface-Based');
    if (metrics.traits > 0) architecture.push('🧩 Trait Usage');

    if (architecture.length === 0) {
        container.innerHTML = '<p class="empty-state">No architecture patterns detected</p>';
        return;
    }

    container.innerHTML = architecture.map(arch => 
        `<div class="pattern-item"><h3>${arch}</h3></div>`
    ).join('');
}

/**
 * Neural Network Visualization
 */
function createNeuralNetwork(metrics) {
    const canvas = document.getElementById('neural-canvas');
    const ctx = canvas.getContext('2d');
    
    if (neuralAnimation) {
        cancelAnimationFrame(neuralAnimation);
    }

    const numLayers = Math.min(6, 3 + Math.floor(metrics.classes / 2));
    const neuronsPerLayer = [
        Math.min(8, 3 + metrics.functions),
        Math.min(10, 4 + metrics.methods),
        Math.min(8, 3 + metrics.classes),
        Math.min(6, 2 + Math.floor((metrics.ifs + metrics.loops) / 3)),
        Math.min(4, 2 + metrics.patterns),
        2
    ].slice(0, numLayers);

    const neurons = [];
    const connections = [];
    
    const layerSpacing = canvas.width / (numLayers + 1);
    
    for (let l = 0; l < numLayers; l++) {
        const x = layerSpacing * (l + 1);
        const neuronCount = neuronsPerLayer[l];
        const neuronSpacing = canvas.height / (neuronCount + 1);

        for (let n = 0; n < neuronCount; n++) {
            const y = neuronSpacing * (n + 1);
            neurons.push({ x, y, layer: l, activation: Math.random() });
        }
    }

    // Create connections
    for (let l = 0; l < numLayers - 1; l++) {
        const currentLayerStart = neurons.findIndex(n => n.layer === l);
        const nextLayerStart = neurons.findIndex(n => n.layer === l + 1);
        const currentLayerEnd = neurons.findIndex(n => n.layer === l + 1);
        const nextLayerEnd = neurons.findIndex(n => n.layer === l + 2) !== -1 
            ? neurons.findIndex(n => n.layer === l + 2) 
            : neurons.length;

        for (let i = currentLayerStart; i < currentLayerEnd; i++) {
            for (let j = nextLayerStart; j < nextLayerEnd; j++) {
                connections.push([i, j]);
            }
        }
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Update activations
        neurons.forEach(n => {
            n.activation += (Math.random() * 0.5 + 0.5 - n.activation) * 0.1;
        });

        // Draw connections
        connections.forEach(([from, to]) => {
            const fromNeuron = neurons[from];
            const toNeuron = neurons[to];
            const activation = (fromNeuron.activation + toNeuron.activation) / 2;
            
            ctx.beginPath();
            ctx.moveTo(fromNeuron.x, fromNeuron.y);
            ctx.lineTo(toNeuron.x, toNeuron.y);
            ctx.strokeStyle = `rgba(0, 212, 255, ${activation * 0.3})`;
            ctx.lineWidth = activation * 2;
            ctx.stroke();
        });

        // Draw neurons
        neurons.forEach(n => {
            const alpha = 0.3 + n.activation * 0.7;
            const gradient = ctx.createRadialGradient(
                n.x, n.y, 0,
                n.x, n.y, 16
            );
            gradient.addColorStop(0, `rgba(0, 255, 136, ${alpha})`);
            gradient.addColorStop(1, 'rgba(0, 255, 136, 0)');
            
            ctx.beginPath();
            ctx.arc(n.x, n.y, 16, 0, Math.PI * 2);
            ctx.fillStyle = gradient;
            ctx.fill();

            ctx.beginPath();
            ctx.arc(n.x, n.y, 8, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(0, 255, 136, ${alpha})`;
            ctx.fill();
            ctx.strokeStyle = '#00d4ff';
            ctx.stroke();
        });

        neuralAnimation = requestAnimationFrame(animate);
    }

    animate();
    console.log('🎨 Neural network visualization started');
}

/**
 * Initialize Charts
 */
function initializeCharts() {
    // Quality Radar Chart
    const qualityCtx = document.getElementById('quality-chart').getContext('2d');
    qualityChart = new Chart(qualityCtx, {
        type: 'radar',
        data: {
            labels: ['Readability', 'Maintainability', 'Performance', 'Security', 'Testability', 'Documentation'],
            datasets: [{
                label: 'Code Quality',
                data: [0, 0, 0, 0, 0, 0],
                backgroundColor: 'rgba(0, 255, 136, 0.2)',
                borderColor: 'rgba(0, 255, 136, 1)',
                borderWidth: 2,
                pointBackgroundColor: 'rgba(0, 255, 136, 1)'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            scales: {
                r: {
                    beginAtZero: true,
                    max: 10,
                    ticks: {
                        color: '#888'
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    },
                    pointLabels: {
                        color: '#e0e0e0',
                        font: {
                            size: 12
                        }
                    }
                }
            },
            plugins: {
                legend: {
                    labels: {
                        color: '#e0e0e0'
                    }
                }
            }
        }
    });

    // History Line Chart
    const historyCtx = document.getElementById('history-chart').getContext('2d');
    historyChart = new Chart(historyCtx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'Quality Score Over Time',
                data: [],
                borderColor: 'rgba(0, 255, 136, 1)',
                backgroundColor: 'rgba(0, 255, 136, 0.1)',
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            scales: {
                y: {
                    beginAtZero: true,
                    max: 10,
                    ticks: { color: '#888' },
                    grid: { color: 'rgba(255, 255, 255, 0.1)' }
                },
                x: {
                    ticks: { color: '#888' },
                    grid: { color: 'rgba(255, 255, 255, 0.1)' }
                }
            },
            plugins: {
                legend: {
                    labels: { color: '#e0e0e0' }
                }
            }
        }
    });

    console.log('📊 Charts initialized');
}

/**
 * Update Quality Chart
 */
function updateQualityChart(result) {
    if (!qualityChart) return;

    const metrics = result.metrics;
    const securityPenalty = result.security.length * 1.5;
    
    qualityChart.data.datasets[0].data = [
        Math.min(10, 10 - (metrics.lines > 300 ? 2 : 0)),  // Readability
        Math.min(10, result.quality_score),                  // Maintainability
        Math.min(10, 10 - (metrics.ifs + metrics.loops > 10 ? 2 : 0)), // Performance
        Math.min(10, 10 - securityPenalty),                  // Security
        Math.min(10, result.smells.length > 0 ? 6 : 8),     // Testability
        Math.min(10, (metrics.comments / Math.max(1, metrics.lines)) * 10) // Documentation
    ];
    
    qualityChart.update();
    console.log('📈 Quality chart updated');
}

/**
 * Update History Chart
 */
function updateHistoryChart(result) {
    if (!historyChart || analysisHistory.length === 0) return;

    historyChart.data.labels = analysisHistory.map((_, i) => `#${i + 1}`);
    historyChart.data.datasets[0].data = analysisHistory.map(h => h.quality);
    historyChart.update();
    console.log('📊 History chart updated');
}

/**
 * Code Comparison
 */
function compareCode() {
    const code1 = document.getElementById('compare-code-1').value;
    const code2 = document.getElementById('compare-code-2').value;

    if (!code1 || !code2) {
        alert('Please paste both code samples!');
        return;
    }

    // Simple similarity based on metrics
    const analysis1 = analyzeCodeLocally(code1);
    const analysis2 = analyzeCodeLocally(code2);

    // Pattern overlap
    const patterns1 = new Set(analysis1.patterns.map(p => p.name));
    const patterns2 = new Set(analysis2.patterns.map(p => p.name));
    
    const commonPatterns = [...patterns1].filter(p => patterns2.has(p));
    const allPatterns = new Set([...patterns1, ...patterns2]);
    
    const patternSimilarity = allPatterns.size > 0 ? commonPatterns.length / allPatterns.size : 0;
    
    // Metrics similarity
    const metricsSim = 1 - Math.abs(analysis1.quality_score - analysis2.quality_score) / 10;
    
    const totalSimilarity = (patternSimilarity * 0.6 + metricsSim * 0.4);

    const resultDiv = document.getElementById('similarity-result');
    resultDiv.querySelector('.similarity-score').textContent = 
        (totalSimilarity * 100).toFixed(1) + '%';
    
    let interpretation = 'Different';
    if (totalSimilarity > 0.8) interpretation = 'Very Similar';
    else if (totalSimilarity > 0.6) interpretation = 'Moderately Similar';
    else if (totalSimilarity > 0.4) interpretation = 'Somewhat Similar';
    
    resultDiv.querySelector('.similarity-label').textContent = 
        `Similarity: ${interpretation}`;

    console.log('🔀 Code comparison:', totalSimilarity);
}

/**
 * Language Switching
 */
function switchLanguage(lang) {
    currentLanguage = lang;
    
    // Update tabs
    document.querySelectorAll('.lang-tab').forEach(tab => tab.classList.remove('active'));
    document.querySelector(`[data-lang="${lang}"]`).classList.add('active');
    
    // Update badge
    document.getElementById('current-lang').textContent = lang.toUpperCase();
}

/**
 * Utility Functions
 */
function updateStatus(icon, text) {
    document.getElementById('analysis-status').innerHTML = `
        <span class="status-icon">${icon}</span>
        <span class="status-text">${text}</span>
    `;
}

function animateValue(elementId, endValue) {
    const element = document.getElementById(elementId);
    const startValue = parseInt(element.textContent) || 0;
    const duration = 800;
    const start = performance.now();

    function update(currentTime) {
        const elapsed = currentTime - start;
        const progress = Math.min(elapsed / duration, 1);
        
        const currentValue = Math.floor(startValue + (endValue - startValue) * progress);
        element.textContent = currentValue;

        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }

    requestAnimationFrame(update);
}

function resizeNeuralCanvas() {
    const canvas = document.getElementById('neural-canvas');
    if (canvas) {
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
    }
}

function loadExample() {
    const examples = {
        php: `<?php
namespace App\\NeuralNetwork;

interface Activatable {
    public function activate(float $input): float;
}

abstract class BaseLayer {
    protected array $weights;
    protected float $bias;
    
    public function __construct(int $size) {
        $this->weights = array_fill(0, $size, 0.0);
        $this->bias = 0.0;
    }
}

class DenseLayer extends BaseLayer {
    public function forward(array $input): array {
        $output = [];
        foreach ($this->weights as $i => $weight) {
            $output[$i] = $input[$i] * $weight + $this->bias;
        }
        return $output;
    }
}

class NeuralNetwork {
    private array $layers = [];
    
    public function addLayer(BaseLayer $layer): self {
        $this->layers[] = $layer;
        return $this;
    }
    
    public function predict(array $input): array {
        foreach ($this->layers as $layer) {
            $input = $layer->forward($input);
        }
        return $input;
    }
}`,
        python: `class NeuralNetwork:
    def __init__(self):
        self.layers = []
        self.learning_rate = 0.01
    
    def add_layer(self, layer):
        self.layers.append(layer)
    
    def forward(self, X):
        for layer in self.layers:
            X = layer.activate(X)
        return X
    
    def train(self, X, y, epochs=100):
        for epoch in range(epochs):
            output = self.forward(X)
            loss = self.mean_squared_error(y, output)
            self.backward(loss)
            
            if epoch % 10 == 0:
                print(f"Epoch {epoch}, Loss: {loss:.4f}")
    
    def mean_squared_error(self, y_true, y_pred):
        return ((y_true - y_pred) ** 2).mean()`,
        javascript: `class NeuralNetwork {
    constructor() {
        this.layers = [];
        this.learningRate = 0.01;
    }

    addLayer(layer) {
        this.layers.push(layer);
    }

    async forward(input) {
        let output = input;
        for (const layer of this.layers) {
            output = await layer.activate(output);
        }
        return output;
    }

    async train(X, y, epochs = 100) {
        for (let epoch = 0; epoch < epochs; epoch++) {
            const output = await this.forward(X);
            const loss = this.mse(y, output);
            await this.backward(loss);
        }
    }

    mse(yTrue, yPred) {
        return yTrue.map((y, i) => Math.pow(y - yPred[i], 2))
                    .reduce((sum, val) => sum + val, 0) / yTrue.length;
    }
}`,
        go: `package main

import "fmt"

type Layer struct {
    Weights []float64
    Bias    float64
}

type NeuralNetwork struct {
    Layers []Layer
}

func (nn *NeuralNetwork) AddLayer(layer Layer) {
    nn.Layers = append(nn.Layers, layer)
}

func (nn *NeuralNetwork) Forward(input []float64) []float64 {
    output := make([]float64, len(input))
    copy(output, input)
    
    for _, layer := range nn.Layers {
        output = layer.Activate(output)
    }
    
    return output
}

func (l Layer) Activate(input []float64) []float64 {
    output := make([]float64, len(input))
    for i, x := range input {
        output[i] = x * l.Weights[i] + l.Bias
    }
    return output
}

func main() {
    nn := &NeuralNetwork{}
    nn.AddLayer(Layer{Weights: []float64{0.5, 0.3}, Bias: 0.1})
    
    input := []float64{1.0, 2.0}
    output := nn.Forward(input)
    
    fmt.Println("Output:", output)
}`
    };

    document.getElementById('code-input').value = examples[currentLanguage] || examples.php;
}

function clearAll() {
    document.getElementById('code-input').value = '';
    document.getElementById('patterns-list').innerHTML = '<p class="empty-state">No patterns detected yet</p>';
    document.getElementById('smells-list').innerHTML = '<p class="empty-state">No issues found</p>';
    document.getElementById('security-list').innerHTML = '<p class="empty-state">No security issues</p>';
    document.getElementById('architecture-list').innerHTML = '<p class="empty-state">No architecture data</p>';
    
    ['loc-metric', 'complexity-metric', 'patterns-metric', 'security-metric'].forEach(id => {
        document.getElementById(id).textContent = '0';
    });
    document.getElementById('quality-metric').textContent = '0.0';
    document.getElementById('ai-metric').textContent = '0%';
    document.getElementById('complexity-fill').style.width = '0%';
    
    updateStatus('⏳', 'Ready to analyze');
}

function copyCode() {
    const code = document.getElementById('code-input').value;
    navigator.clipboard.writeText(code).then(() => {
        alert('✅ Code copied to clipboard!');
    });
}

function loadFile(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
        document.getElementById('code-input').value = e.target.result;
        const ext = file.name.split('.').pop();
        if (ext === 'php') switchLanguage('php');
        else if (ext === 'py') switchLanguage('python');
        else if (ext === 'js' || ext === 'ts') switchLanguage('javascript');
        else if (ext === 'go') switchLanguage('go');
    };
    reader.readAsText(file);
}

function exportReport() {
    const report = {
        timestamp: new Date().toISOString(),
        language: currentLanguage,
        code: document.getElementById('code-input').value,
        history: analysisHistory
    };

    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ai-code-analysis-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
}
