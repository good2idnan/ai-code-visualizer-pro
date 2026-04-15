<?php

namespace AICodeVisualizer\Analyzer;

use PhpParser\Node;
use PhpParser\NodeTraversor;
use PhpParser\NodeVisitorAbstract;
use PhpParser\ParserFactory;
use PhpParser\NodeFinder;

/**
 * Comprehensive AST Analyzer for PHP code
 * Extracts metrics, patterns, complexity, and architecture insights
 */
class ASTAnalyzer
{
    private array $metrics = [];
    private array $patterns = [];
    private array $codeSmells = [];
    private array $securityIssues = [];
    private array $architecture = [];

    public function analyze(string $code): array
    {
        $parser = (new ParserFactory())->createForHostVersion();
        
        try {
            $ast = $parser->parse($code);
        } catch (\Throwable $e) {
            return ['error' => 'Parse error: ' . $e->getMessage()];
        }

        if (!$ast) {
            return ['error' => 'No AST generated'];
        }

        $this->metrics = $this->extractMetrics($ast, $code);
        $this->patterns = $this->detectPatterns($ast);
        $this->codeSmells = $this->detectCodeSmells($ast, $code);
        $this->securityIssues = $this->detectSecurityIssues($ast, $code);
        $this->architecture = $this->analyzeArchitecture($ast);

        return [
            'metrics' => $this->metrics,
            'patterns' => $this->patterns,
            'code_smells' => $this->codeSmells,
            'security_issues' => $this->securityIssues,
            'architecture' => $this->architecture,
            'complexity_score' => $this->calculateComplexityScore(),
            'quality_score' => $this->calculateQualityScore(),
            'ai_confidence' => $this->calculateAIConfidence()
        ];
    }

    private function extractMetrics(array $ast, string $code): array
    {
        $nodeFinder = new NodeFinder();
        
        $functions = $nodeFinder->findInstanceOf($ast, Node\Stmt\Function_::class);
        $classes = $nodeFinder->findInstanceOf($ast, Node\Stmt\Class_::class);
        $methods = [];
        $interfaces = $nodeFinder->findInstanceOf($ast, Node\Stmt\Interface_::class);
        $traits = $nodeFinder->findInstanceOf($ast, Node\Stmt\Trait_::class);
        $namespaces = $nodeFinder->findInstanceOf($ast, Node\Stmt\Namespace_::class);

        foreach ($classes as $class) {
            foreach ($class->getMethods() as $method) {
                $methods[] = $method;
            }
        }

        $lines = explode("\n", $code);
        $loc = count(array_filter($lines, fn($line) => trim($line) !== ''));
        $commentLines = count(array_filter($lines, fn($line) => preg_match('/^\s*\/\*|^\s*\/\//', $line)));

        return [
            'functions' => count($functions),
            'classes' => count($classes),
            'methods' => count($methods),
            'interfaces' => count($interfaces),
            'traits' => count($traits),
            'namespaces' => count($namespaces),
            'lines_of_code' => $loc,
            'comment_lines' => $commentLines,
            'comment_ratio' => $loc > 0 ? round($commentLines / $loc * 100, 2) : 0,
            'avg_method_length' => $this->calculateAvgMethodLength($methods),
            'max_nesting_depth' => $this->calculateMaxNesting($ast)
        ];
    }

    private function detectPatterns(array $ast): array
    {
        $patterns = [];
        $code = json_encode($ast);

        // Factory Pattern
        if (strpos($code, 'new self') !== false || strpos($code, 'new static') !== false) {
            $patterns[] = [
                'name' => 'Factory Pattern',
                'type' => 'creational',
                'confidence' => 0.75,
                'description' => 'Object creation abstraction detected'
            ];
        }

        // Strategy Pattern
        if (strpos($code, 'interface') !== false && strpos($code, 'implements') !== false) {
            $patterns[] = [
                'name' => 'Strategy Pattern',
                'type' => 'behavioral',
                'confidence' => 0.70,
                'description' => 'Interchangeable algorithms via interfaces'
            ];
        }

        // Observer Pattern
        if (strpos($code, 'attach') !== false && strpos($code, 'notify') !== false) {
            $patterns[] = [
                'name' => 'Observer Pattern',
                'type' => 'behavioral',
                'confidence' => 0.80,
                'description' => 'Event-driven architecture detected'
            ];
        }

        // Dependency Injection
        if (preg_match('/__construct\s*\([^)]*\\$/', $code)) {
            $patterns[] = [
                'name' => 'Dependency Injection',
                'type' => 'architectural',
                'confidence' => 0.85,
                'description' => 'Constructor injection pattern detected'
            ];
        }

        // Singleton
        if (strpos($code, 'getInstance') !== false && strpos($code, 'private static') !== false) {
            $patterns[] = [
                'name' => 'Singleton Pattern',
                'type' => 'creational',
                'confidence' => 0.90,
                'description' => 'Single instance enforcement detected'
            ];
        }

        // Repository Pattern
        if (strpos($code, 'Repository') !== false && strpos($code, 'interface') !== false) {
            $patterns[] = [
                'name' => 'Repository Pattern',
                'type' => 'data_access',
                'confidence' => 0.80,
                'description' => 'Data access abstraction detected'
            ];
        }

        // Decorator Pattern
        if (strpos($code, '__call') !== false || strpos($code, 'extends') !== false) {
            $patterns[] = [
                'name' => 'Decorator/Proxy Pattern',
                'type' => 'structural',
                'confidence' => 0.65,
                'description' => 'Object wrapping detected'
            ];
        }

        return $patterns;
    }

    private function detectCodeSmells(array $ast, string $code): array
    {
        $smells = [];
        $lines = explode("\n", $code);

        // Long Method
        $nodeFinder = new NodeFinder();
        $methods = $nodeFinder->findInstanceOf($ast, Node\Stmt\ClassMethod::class);
        
        foreach ($methods as $method) {
            $methodLines = $method->getLine() - ($method->getStartLine() ?: 0);
            if ($methodLines > 50) {
                $smells[] = [
                    'type' => 'Long Method',
                    'severity' => 'warning',
                    'location' => $method->name->toString() ?? 'unknown',
                    'line' => $method->getStartLine(),
                    'message' => "Method has {$methodLines} lines (recommended: <50)",
                    'suggestion' => 'Extract smaller methods to improve readability'
                ];
            }
        }

        // Too Many Parameters
        foreach ($methods as $method) {
            $paramCount = count($method->getParams());
            if ($paramCount > 5) {
                $smells[] = [
                    'type' => 'Too Many Parameters',
                    'severity' => 'warning',
                    'location' => $method->name->toString() ?? 'unknown',
                    'line' => $method->getStartLine(),
                    'message' => "Method has {$paramCount} parameters (recommended: <5)",
                    'suggestion' => 'Consider using a parameter object or builder pattern'
                ];
            }
        }

        // Deep Nesting
        $this->checkNesting($ast, $smells, 0, []);

        // Duplicate Code (simple heuristic)
        $lineFrequency = array_count_values(array_map('trim', $lines));
        $duplicates = array_filter($lineFrequency, fn($count) => $count > 5);
        if (!empty($duplicates)) {
            $smells[] = [
                'type' => 'Duplicate Code',
                'severity' => 'info',
                'message' => 'Potential code duplication detected',
                'suggestion' => 'Extract common code into reusable functions'
            ];
        }

        // God Class (too many methods)
        $classes = $nodeFinder->findInstanceOf($ast, Node\Stmt\Class_::class);
        foreach ($classes as $class) {
            $methodCount = count($class->getMethods());
            if ($methodCount > 20) {
                $smells[] = [
                    'type' => 'God Class',
                    'severity' => 'error',
                    'location' => $class->name->toString() ?? 'unknown',
                    'line' => $class->getStartLine(),
                    'message' => "Class has {$methodCount} methods (recommended: <20)",
                    'suggestion' => 'Split into smaller, focused classes following SRP'
                ];
            }
        }

        return $smells;
    }

    private function detectSecurityIssues(array $ast, string $code): array
    {
        $issues = [];

        // SQL Injection
        if (preg_match('/(mysql_query|mysqli_query|->query)\s*\(\s*["\'].*\$\w+/i', $code)) {
            $issues[] = [
                'type' => 'SQL Injection',
                'severity' => 'critical',
                'message' => 'Direct variable interpolation in SQL query',
                'recommendation' => 'Use prepared statements with parameterized queries',
                'cwe' => 'CWE-89'
            ];
        }

        // XSS
        if (preg_match('/echo\s+.*\$_(GET|POST|REQUEST|COOKIE)/i', $code)) {
            $issues[] = [
                'type' => 'Cross-Site Scripting (XSS)',
                'severity' => 'high',
                'message' => 'Unescaped user input in output',
                'recommendation' => 'Use htmlspecialchars() or a templating engine with auto-escaping',
                'cwe' => 'CWE-79'
            ];
        }

        // eval() usage
        if (strpos($code, 'eval(') !== false) {
            $issues[] = [
                'type' => 'Code Injection',
                'severity' => 'critical',
                'message' => 'Usage of eval() detected',
                'recommendation' => 'Avoid eval() - use safer alternatives like expression parsers',
                'cwe' => 'CWE-95'
            ];
        }

        // Hardcoded credentials
        if (preg_match('/(password|secret|key|token)\s*=\s*["\'][^"\']{8,}["\']/i', $code)) {
            $issues[] = [
                'type' => 'Hardcoded Credentials',
                'severity' => 'high',
                'message' => 'Potential hardcoded secrets detected',
                'recommendation' => 'Use environment variables or a secrets manager',
                'cwe' => 'CWE-798'
            ];
        }

        // Weak hashing
        if (preg_match('/(md5|sha1)\s*\(/i', $code)) {
            $issues[] = [
                'type' => 'Weak Hashing Algorithm',
                'severity' => 'medium',
                'message' => 'Usage of MD5/SHA1 detected',
                'recommendation' => 'Use password_hash() with PASSWORD_BCRYPT or PASSWORD_ARGON2ID',
                'cwe' => 'CWE-328'
            ];
        }

        return $issues;
    }

    private function analyzeArchitecture(array $ast): array
    {
        $nodeFinder = new NodeFinder();
        
        $namespaces = $nodeFinder->findInstanceOf($ast, Node\Stmt\Namespace_::class);
        $useStatements = $nodeFinder->findInstanceOf($ast, Node\Stmt\Use_::class);
        
        $dependencies = [];
        foreach ($useStatements as $use) {
            foreach ($use->uses as $useUse) {
                $dependencies[] = $useUse->name->toString();
            }
        }

        return [
            'namespaces' => array_map(fn($ns) => $ns->name->toString(), $namespaces),
            'external_dependencies' => array_unique($dependencies),
            'dependency_count' => count(array_unique($dependencies)),
            'coupling_score' => min(10, count(array_unique($dependencies)) / 5)
        ];
    }

    private function calculateAvgMethodLength(array $methods): float
    {
        if (empty($methods)) return 0;
        
        $totalLines = 0;
        $count = 0;
        
        foreach ($methods as $method) {
            $lines = $method->getEndLine() - $method->getStartLine();
            $totalLines += $lines;
            $count++;
        }
        
        return $count > 0 ? round($totalLines / $count, 2) : 0;
    }

    private function calculateMaxNesting(array $nodes, int $depth = 0): int
    {
        $maxDepth = $depth;
        
        foreach ($nodes as $node) {
            if ($node instanceof Node) {
                $subNodes = [];
                foreach ($node->getSubNodeNames() as $name) {
                    $value = $node->$name;
                    if (is_array($value)) {
                        $subNodes = array_merge($subNodes, $value);
                    } elseif ($value instanceof Node) {
                        $subNodes[] = $value;
                    }
                }
                
                $isControlStructure = $node instanceof Node\Stmt\If_ || 
                                    $node instanceof Node\Stmt\For_ ||
                                    $node instanceof Node\Stmt\Foreach_ ||
                                    $node instanceof Node\Stmt\While_ ||
                                    $node instanceof Node\Stmt\Switch_;
                
                if ($isControlStructure && !empty($subNodes)) {
                    $subDepth = $this->calculateMaxNesting($subNodes, $depth + 1);
                    $maxDepth = max($maxDepth, $subDepth);
                } elseif (!empty($subNodes)) {
                    $subDepth = $this->calculateMaxNesting($subNodes, $depth);
                    $maxDepth = max($maxDepth, $subDepth);
                }
            }
        }
        
        return $maxDepth;
    }

    private function checkNesting(array $nodes, array &$smells, int $depth, array $path): void
    {
        if ($depth > 4) {
            $smells[] = [
                'type' => 'Deep Nesting',
                'severity' => 'warning',
                'message' => "Code is nested {$depth} levels deep (recommended: <4)",
                'suggestion' => 'Use early returns, extract methods, or reduce complexity'
            ];
            return;
        }

        foreach ($nodes as $node) {
            if ($node instanceof Node\Stmt\If_ || 
                $node instanceof Node\Stmt\For_ ||
                $node instanceof Node\Stmt\Foreach_ ||
                $node instanceof Node\Stmt\While_) {
                $this->checkNesting($node->stmts ?? [], $smells, $depth + 1, [...$path, get_class($node)]);
            }
        }
    }

    private function calculateComplexityScore(): float
    {
        $base = $this->metrics['functions'] + $this->metrics['methods'];
        $penalty = count($this->codeSmells) * 2;
        $bonus = count($this->patterns) * 1.5;
        
        return max(0, min(10, ($base + $penalty - $bonus) / 10));
    }

    private function calculateQualityScore(): float
    {
        $base = 10;
        $base -= count($this->codeSmells) * 0.5;
        $base -= count($this->securityIssues) * 1;
        $base += count($this->patterns) * 0.3;
        $base += $this->metrics['comment_ratio'] > 20 ? 1 : 0;
        
        return max(0, min(10, $base));
    }

    private function calculateAIConfidence(): float
    {
        $hasMetrics = !empty($this->metrics);
        $hasPatterns = !empty($this->patterns);
        $hasArchitecture = !empty($this->architecture);
        
        $confidence = 0.5;
        $confidence += $hasMetrics ? 0.15 : 0;
        $confidence += $hasPatterns ? 0.2 : 0;
        $confidence += $hasArchitecture ? 0.15 : 0;
        
        return round(min(0.98, $confidence) * 100, 2);
    }
}
