# 🧠 AI Code Visualizer Pro

## Advanced Code Analysis Platform with Neural Networks & Machine Learning

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)
[![PHP 8.1+](https://img.shields.io/badge/PHP-8.1%2B-777BB4.svg)](https://php.net/)
[![JavaScript ES6+](https://img.shields.io/badge/JavaScript-ES6%2B-F7DF1E.svg)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Chart.js](https://img.shields.io/badge/Chart.js-v4-FF6384.svg)](https://www.chartjs.org/)

**An intelligent, production-grade code analysis platform that combines traditional software engineering expertise with cutting-edge AI/ML capabilities.** Built by a senior engineer with 10+ years in PHP and 3+ years in AI/ML.

---

## 🎯 Overview

AI Code Visualizer Pro is a comprehensive code analysis platform that goes beyond traditional linting tools. It combines:

- **AST-based static analysis** for deep code understanding
- **Neural network visualizations** to make abstract AI concepts tangible
- **Multi-language support** (PHP, Python, JavaScript, Go)
- **Security vulnerability scanning** with OWASP Top 10 mapping
- **ML-powered pattern recognition** and quality prediction
- **Real-time interactive dashboards** with rich visualizations

---

## ✨ Features

### 🔍 Comprehensive Code Analysis

- **Multi-Language AST Parsing** - Deep syntactic analysis using PHP-Parser and custom analyzers
- **Design Pattern Detection** - Automatically identifies Factory, Strategy, Observer, Singleton, DI, Repository, and more
- **Cyclomatic Complexity** - Calculates code complexity metrics
- **Architecture Analysis** - Detects OOP, Functional, Modular, and Interface-based patterns
- **Quality Scoring** - 0-10 score based on maintainability, security, and best practices

### 🧠 Machine Learning Integration

- **Code Embeddings** - 64-dimensional vector representations (simulated CodeBERT behavior)
- **Quality Prediction** - Neural network predicts code quality score
- **Code Smell Detection** - ML classifier identifies Long Methods, God Classes, Deep Nesting, etc.
- **Similarity Calculation** - Cosine similarity for code comparison using embeddings
- **TensorFlow.js Models** - Real neural networks running in the browser

### 🛡️ Security Vulnerability Scanner

- **SQL Injection** detection (CWE-89, OWASP A03)
- **Cross-Site Scripting (XSS)** (CWE-79, OWASP A03)
- **Code Injection** - eval(), exec(), system() (CWE-95, CWE-78)
- **File Inclusion** - RFI/LFI vulnerabilities (CWE-98, OWASP A01)
- **Hardcoded Credentials** detection (CWE-798, OWASP A02)
- **Weak Hashing** - MD5/SHA1 detection (CWE-328, OWASP A02)
- **CSRF Protection** missing (CWE-352, OWASP A01)
- **Session Security** issues (CWE-384, CWE-613)

### 🎨 Interactive Visualizations

- **Neural Network Animation** - Live visualization showing how AI "sees" your code
- **Quality Radar Chart** - 6-dimensional quality metrics (Readability, Maintainability, Performance, Security, Testability, Documentation)
- **History Trends** - Track code quality over time with line charts
- **Metrics Dashboard** - Real-time animated metric cards
- **Pattern Recognition Display** - Detected architectures with confidence scores

### 🌐 Multi-Language Support

| Language | Features Detected |
|----------|------------------|
| **PHP 8+** | OOP, Traits, Namespaces, DI, Factory, Strategy, Singleton, Generator, Exception Handling |
| **Python 3** | Decorators, Context Managers, Type Hints, Generators, Functional Programming, OOP |
| **JavaScript/TypeScript** | ES6 Classes, Async/Await, Promises, React Hooks, TypeScript Types, FP Patterns |
| **Go** | Goroutines, Channels, Interfaces, Structs, Defer Pattern, Concurrency Patterns |

### 💼 Developer Tools

- **VS Code Extension** - Full IDE integration with commands and webviews
- **RESTful API** - Backend service with 6 endpoints for integration
- **Real-Time Analysis** - Optional live feedback as you type
- **File Upload** - Load code directly from `.php`, `.py`, `.js`, `.go` files
- **Export Reports** - Save analysis results as JSON
- **Code Comparison** - Similarity analysis between two code samples

---

## 📸 Screenshots

### Dashboard Interface
![Dashboard](screenshots/dashboard.png)

*Clean, modern interface with neural network visualization and real-time metrics*

### Analysis Results
![Analysis](screenshots/analysis.png)

*Comprehensive pattern detection, security scanning, and quality metrics*

### Quality Radar
![Radar](screenshots/radar.png)

*6-dimensional quality assessment with visual radar chart*

---

## 🚀 Quick Start

### Option 1: Frontend Only (Easiest - 30 seconds)

1. **Clone the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/ai-code-visualizer-pro.git
   cd ai-code-visualizer-pro
   ```

2. **Open dashboard in browser**
   ```bash
   # macOS/Linux
   open dashboard.html
   
   # Windows
   start dashboard.html
   ```

3. **Start analyzing** - Paste code and click "Analyze Code"

### Option 2: Full Stack with Backend (Recommended)

1. **Install backend dependencies**
   ```bash
   cd backend
   composer install
   ```

2. **Start the PHP server**
   ```bash
   php -S localhost:8080 -t public/
   ```

3. **Open dashboard** - It will automatically connect to the backend API

### Option 3: VS Code Extension

1. **Install dependencies**
   ```bash
   cd vsc-extension
   npm install
   npm run compile
   ```

2. **Launch in VS Code**
   - Open `vsc-extension` folder in VS Code
   - Press `F5` to launch Extension Host
   - Use commands from Command Palette (`Ctrl+Shift+P`)

---

## 🏗️ Architecture

### System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     Frontend Dashboard                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐  │
│  │ Code Input   │  │  Neural Net  │  │  Metrics/Charts  │  │
│  │   Panel      │  │ Visualizer   │  │   Dashboard      │  │
│  └──────────────┘  └──────────────┘  └──────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                  Analysis Engine (JavaScript)                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐  │
│  │ Multi-Lang   │  │ Pattern      │  │ Security         │  │
│  │ Analyzer     │  │ Detector     │  │ Scanner          │  │
│  └──────────────┘  └──────────────┘  └──────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                 ML Layer (TensorFlow.js)                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐  │
│  │ Embedding    │  │ Quality      │  │ Code Smell       │  │
│  │ Model        │  │ Predictor    │  │ Classifier       │  │
│  └──────────────┘  └──────────────┘  └──────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                  Backend API (PHP)                            │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐  │
│  │ PHP-Parser   │  │ AST          │  │ Advanced         │  │
│  │ (nikic)      │  │ Analyzer     │  │ Security Scanner │  │
│  └──────────────┘  └──────────────┘  └──────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### Project Structure

```
ai-code-visualizer-pro/
├── 📂 backend/                      # PHP Backend Service
│   ├── composer.json                # Dependencies
│   ├── public/
│   │   └── index.php                # REST API Entry Point
│   └── src/
│       ├── Analyzer/
│       │   └── ASTAnalyzer.php      # AST Analysis Engine
│       ├── ML/
│       │   └── CodeEmbedder.php     # ML Embeddings
│       └── Security/
│           └── SecurityScanner.php   # Security Scanner
│
├── 📂 vsc-extension/                # VS Code Extension
│   ├── package.json                 # Extension Manifest
│   └── src/
│       └── extension.ts             # TypeScript Extension Code
│
├── 🌐 dashboard.html                # Main Dashboard UI
├── 📊 dashboard.js                  # Dashboard Logic
├── 🎨 style.css                     # Styling
├── 🧬 multi-language-analyzer.js    # Multi-Language Support
├── 🧠 tensorflow-analyzer.js        # TensorFlow.js Integration
├── 📖 README.md                     # This File
└── 🚀 QUICKSTART.md                 # Quick Start Guide
```

---

## 🔌 API Documentation

### REST API Endpoints

All endpoints accept `POST` requests with JSON body:

```json
{
  "code": "<?php // your code here ?>",
  "filename": "example.php"
}
```

#### `POST /api/analyze` - Full Analysis
**Response:** Complete analysis with AST, patterns, security, quality, embeddings

#### `POST /api/security` - Security Scan Only
**Response:** Vulnerability report with severity and CWE mappings

#### `POST /api/quality` - Quality Classification
**Response:** Quality score, category, improvement suggestions

#### `POST /api/embed` - Code Embeddings
**Response:** 64-dimensional embedding vector

#### `POST /api/similarity` - Code Comparison
**Request:**
```json
{
  "code1": "<?php class A {} ?>",
  "code2": "<?php class B {} ?>"
}
```
**Response:** Similarity score (0-100%) with interpretation

#### `GET /api/health` - Health Check
**Response:** Service status and version info

---

## 📊 Example Output

### Analysis Response

```json
{
  "success": true,
  "analysis": {
    "metrics": {
      "functions": 5,
      "classes": 3,
      "methods": 8,
      "interfaces": 1,
      "lines_of_code": 150,
      "comment_ratio": 25.5
    },
    "patterns": [
      {
        "name": "Dependency Injection",
        "type": "architectural",
        "confidence": 0.85,
        "description": "Constructor injection pattern detected"
      },
      {
        "name": "Factory Pattern",
        "type": "creational",
        "confidence": 0.75,
        "description": "Object creation abstraction detected"
      }
    ],
    "code_smells": [
      {
        "type": "Long Method",
        "severity": "warning",
        "location": "processData",
        "message": "Method has 65 lines (recommended: <50)",
        "suggestion": "Extract smaller methods to improve readability"
      }
    ],
    "security_issues": [],
    "quality_score": 8.5,
    "ai_confidence": 92.3
  },
  "processing_time_ms": 145.2
}
```

---

## 🛠️ Technology Stack

### Frontend
- **Vanilla JavaScript (ES6+)** - No framework dependencies
- **Chart.js** - Data visualization (radar, line, bar charts)
- **Canvas API** - Neural network animations
- **Modern CSS3** - Gradients, flexbox, grid, animations

### Backend
- **PHP 8.1+** - Modern PHP with type safety
- **nikic/php-parser** - Industry-standard AST parser
- **PSR-4 Autoloading** - Clean architecture
- **RESTful API Design** - Stateless, JSON-based

### Machine Learning
- **TensorFlow.js** - Browser-based neural networks
- **Custom Embedding Models** - Simulated CodeBERT behavior
- **Cosine Similarity** - Code comparison algorithms

### Development Tools
- **TypeScript** - Type-safe VS Code extension
- **VS Code API** - IDE integration
- **Composer** - PHP dependency management
- **NPM** - Node.js package management

---

## 🎓 Use Cases

### For Individual Developers
- **Code Review Assistant** - Get instant feedback on code quality
- **Learning Tool** - Understand design patterns in your code
- **Security Auditing** - Find vulnerabilities before deployment
- **Skill Development** - Track improvement over time

### For Teams
- **Code Quality Gates** - Enforce standards across the team
- **Onboarding Tool** - Help juniors understand architecture
- **Technical Debt Tracking** - Monitor code smell trends
- **Security Compliance** - OWASP Top 10 enforcement

### For Organizations
- **Automated Code Review** - PR integration with quality checks
- **Architecture Governance** - Ensure pattern adherence
- **Security Scanning** - Pre-deployment vulnerability detection
- **Developer Analytics** - Team-wide quality metrics

---

## 🔮 Roadmap

### Phase 1: Enhancement (Current)
- [x] Multi-language support (PHP, Python, JS, Go)
- [x] TensorFlow.js integration
- [x] Security vulnerability scanner
- [x] VS Code extension
- [x] Interactive dashboard

### Phase 2: Production Readiness
- [ ] Real CodeBERT integration (Python microservice)
- [ ] Database for history tracking
- [ ] GitHub/GitLab integration
- [ ] Team dashboard with auth
- [ ] CI/CD pipeline integration

### Phase 3: Advanced AI
- [ ] Code generation (GPT-style)
- [ ] Automated refactoring
- [ ] Bug prediction models
- [ ] Performance optimization suggestions
- [ ] Test generation

### Phase 4: Platform
- [ ] SaaS deployment
- [ ] Plugin ecosystem
- [ ] Custom model training
- [ ] Enterprise features (SSO, audit logs)
- [ ] API rate limiting & billing

---

## 🤝 Contributing

Contributions are welcome! This is an open project for the developer community.

### How to Contribute

1. **Fork the repository**
2. **Create your feature branch** (`git checkout -b feature/AmazingFeature`)
3. **Commit your changes** (`git commit -m 'Add some AmazingFeature'`)
4. **Push to the branch** (`git push origin feature/AmazingFeature`)
5. **Open a Pull Request**

### Development Guidelines

- Follow PSR-12 for PHP code
- Use ESLint for JavaScript/TypeScript
- Add tests for new features
- Update documentation
- Write meaningful commit messages

---

## 📝 License

This project is licensed under the MIT License - see below for details.

```
MIT License

Copyright (c) 2026 AI Code Visualizer Contributors

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## 👤 About the Author

**Senior Software Engineer**
- **10+ years** in PHP development and software architecture
- **3+ years** in AI/ML, neural networks, and deep learning
- Passionate about building intelligent developer tools
- Bridging traditional software expertise with cutting-edge AI

### Connect
- **GitHub**: [@YOUR_USERNAME](https://github.com/YOUR_USERNAME)
- **LinkedIn**: [Your Profile](https://linkedin.com/in/YOUR_PROFILE)
- **Email**: your.email@example.com
- **Portfolio**: https://your-portfolio.com

---

## 🙏 Acknowledgments

- **nikic/php-parser** - Excellent PHP AST parsing library
- **Chart.js** - Beautiful data visualization
- **TensorFlow.js** - Making ML accessible in the browser
- **OWASP** - Security guidelines and best practices
- **Hugging Face** - Inspiration for CodeBERT embeddings

---

## 📧 Support

- **Issues**: [GitHub Issues](https://github.com/YOUR_USERNAME/ai-code-visualizer-pro/issues)
- **Discussions**: [GitHub Discussions](https://github.com/YOUR_USERNAME/ai-code-visualizer-pro/discussions)
- **Email**: your.email@example.com

---

## ⭐ Show Your Support

If this project helped you learn about code analysis, design patterns, or AI-powered developer tools, please consider:

1. **Starring the repository** ⭐
2. **Sharing with your network**
3. **Contributing code or documentation**
4. **Reporting bugs or suggesting features**

---

<div align="center">

**Built with ❤️ by a developer who believes AI should make our lives easier, not more complex**

[⬆ Back to Top](#-ai-code-visualizer-pro)

</div>
