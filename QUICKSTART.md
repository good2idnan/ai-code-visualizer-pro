# 🚀 Quick Start Guide

## Get Running in 5 Minutes

### Option 1: Frontend Only (Easiest)

1. **Open `dashboard.html`** in your browser (double-click it)
2. **Start analyzing** code immediately!
   - Pre-loaded with example code
   - Click "Analyze Code" to see results
   - Try different languages with the tabs

### Option 2: Full Stack (Recommended)

#### Step 1: Install Backend Dependencies

```bash
cd backend
composer install
```

*Don't have Composer?* Get it: https://getcomposer.org/download/

#### Step 2: Start the Backend Server

```bash
php -S localhost:8080 -t public/
```

You should see: `Development Server (http://localhost:8080) started`

#### Step 3: Open the Dashboard

Open `dashboard.html` in your browser - it will automatically connect to the backend!

---

## What You'll See

### ✅ Immediate Results

1. **Neural Network Visualization** - Animated neurons reacting to code
2. **Quality Metrics** - Score out of 10 with radar chart
3. **Pattern Detection** - Design patterns with confidence scores
4. **Code Smells** - Issues with fix recommendations
5. **Security Scan** - Vulnerabilities with OWASP mapping
6. **ML Embeddings** - 64-dimensional code representations

---

## Try These Examples

### 1. PHP Neural Network (Default)
Already loaded - just click "Analyze Code"

### 2. Python Machine Learning
Switch to Python tab → Load Example → Analyze

### 3. JavaScript React
Switch to JavaScript tab → Paste React component → Analyze

### 4. Go Concurrency
Switch to Go tab → Load Example → Analyze

---

## VS Code Extension (Bonus)

### Install & Run

```bash
cd vsc-extension
npm install
npm run compile
```

### Launch in VS Code

1. Open the `vsc-extension` folder in VS Code
2. Press `F5` (or Debug → Start Debugging)
3. New VS Code window opens with extension loaded
4. Open any PHP/Python/JS/Go file
5. Click the 🧠 icon in the editor title bar

---

## API Endpoints

If backend is running on `http://localhost:8080`:

### Analyze Code
```bash
curl -X POST http://localhost:8080/api/analyze \
  -H "Content-Type: application/json" \
  -d '{"code": "<?php echo \"Hello\"; ?>"}'
```

### Security Scan
```bash
curl -X POST http://localhost:8080/api/security \
  -H "Content-Type: application/json" \
  -d '{"code": "<?php echo $_GET[\"input\"]; ?>"}'
```

### Code Similarity
```bash
curl -X POST http://localhost:8080/api/similarity \
  -H "Content-Type: application/json" \
  -d '{
    "code1": "<?php class A {} ?>",
    "code2": "<?php class B {} ?>"
  }'
```

---

## Troubleshooting

### "TensorFlow.js not loaded"
- This is OK! The dashboard has fallback analyzers
- For full TF.js features, ensure internet connection (loads from CDN)

### Backend Connection Error
- Make sure PHP server is running: `php -S localhost:8080 -t public/`
- Check if port 8080 is available
- Update backend URL in dashboard if needed

### Composer Install Fails
- Need PHP 8.1 or higher
- Check: `php -v`
- Upgrade PHP if needed

### VS Code Extension Not Working
- Run `npm run compile` first
- Check Output panel for errors
- Ensure backend is running for full features

---

## Next Steps

1. ✅ **Analyze your own codebases** - Paste real code from your projects
2. ✅ **Compare implementations** - Use the similarity tool
3. ✅ **Track quality trends** - Run analysis over time
4. ✅ **Export reports** - Save analysis results as JSON
5. ✅ **Extend the platform** - Add your own patterns/rules

---

## Pro Tips

### Real-Time Analysis
- Toggle "Real-time Analysis" in dashboard
- Get instant feedback as you type
- May impact performance on large files

### Security Scanning
- Enable "Security Scan on Save" in VS Code
- Critical issues show warning notification
- Perfect for PHP legacy code audits

### ML Features
- TensorFlow.js models simulate real AI behavior
- For production: Train on your actual codebases
- Use embeddings for code search/clustering

### Multi-Language
- Works with PHP, Python, JavaScript, Go
- Language-specific pattern detection
- Switch tabs to analyze different code

---

## What's Production-Ready?

✅ **Use Today:**
- Multi-language code analysis
- Pattern detection
- Security scanning
- Quality metrics
- Code visualization

🔧 **Needs Your Data:**
- ML model training (needs labeled dataset)
- Custom pattern rules (team-specific)
- Historical tracking (needs database)

🚀 **Scale Up:**
- Real CodeBERT integration
- GitHub/GitLab integration
- Team dashboards
- CI/CD pipeline

---

**You now have a full AI-powered code analysis platform!** 🎉

Start analyzing, find insights, and build something amazing.
