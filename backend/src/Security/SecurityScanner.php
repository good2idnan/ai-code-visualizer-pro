<?php

namespace AICodeVisualizer\Security;

/**
 * Advanced Security Vulnerability Scanner
 * Uses pattern matching + ML heuristics to detect security issues
 */
class SecurityScanner
{
    private array $vulnerabilities = [];
    private array $riskMatrix = [];

    /**
     * Comprehensive security scan
     */
    public function scan(string $code, string $filename = 'unknown.php'): array
    {
        $this->vulnerabilities = [];
        $this->riskMatrix = [];

        $this->scanSQLInjection($code);
        $this->scanXSS($code);
        $this->scanCodeInjection($code);
        $this->scanFileInclusion($code);
        $this->scanAuthentication($code);
        $this->scanCryptoIssues($code);
        $this->scanSessionIssues($code);
        $this->scanCSRF($code);
        $this->scanHardcodedSecrets($code);
        $this->scanErrorHandling($code);

        $riskScore = $this->calculateRiskScore();
        $riskLevel = $this->getRiskLevel($riskScore);

        return [
            'filename' => $filename,
            'vulnerabilities' => $this->vulnerabilities,
            'risk_score' => $riskScore,
            'risk_level' => $riskLevel,
            'total_issues' => count($this->vulnerabilities),
            'critical' => count(array_filter($this->vulnerabilities, fn($v) => $v['severity'] === 'critical')),
            'high' => count(array_filter($this->vulnerabilities, fn($v) => $v['severity'] === 'high')),
            'medium' => count(array_filter($this->vulnerabilities, fn($v) => $v['severity'] === 'medium')),
            'low' => count(array_filter($this->vulnerabilities, fn($v) => $v['severity'] === 'low')),
            'scan_timestamp' => date('Y-m-d H:i:s'),
            'scanner_version' => '2.0.0'
        ];
    }

    /**
     * SQL Injection Detection
     */
    private function scanSQLInjection(string $code): void
    {
        // Direct variable interpolation
        if (preg_match_all('/(mysql_query|mysqli_query|->query|->exec)\s*\(\s*["\'].*\$\w+/i', $code, $matches, PREG_OFFSET_SET)) {
            foreach ($matches[0] as $index => $match) {
                $this->addVulnerability([
                    'type' => 'SQL Injection',
                    'severity' => 'critical',
                    'message' => 'Direct variable interpolation in SQL query',
                    'code' => trim($match),
                    'line' => $this->getLineNumber($code, $matches[0][1]),
                    'cwe' => 'CWE-89',
                    'owasp' => 'A03:2021 – Injection',
                    'fix' => 'Use prepared statements: $stmt = $pdo->prepare("SELECT * FROM users WHERE id = :id"); $stmt->execute(["id" => $id]);',
                    'references' => [
                        'https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html'
                    ]
                ]);
            }
        }

        // String concatenation in queries
        if (preg_match_all('/(SELECT|INSERT|UPDATE|DELETE).*\.\s*\$_(GET|POST|REQUEST|COOKIE|SERVER)/i', $code, $matches, PREG_OFFSET_SET)) {
            $this->addVulnerability([
                'type' => 'SQL Injection',
                'severity' => 'critical',
                'message' => 'User input directly concatenated into SQL query',
                'cwe' => 'CWE-89',
                'owasp' => 'A03:2021 – Injection',
                'fix' => 'Never use $_GET/$_POST directly in SQL queries. Use parameterized queries.'
            ]);
        }
    }

    /**
     * Cross-Site Scripting (XSS) Detection
     */
    private function scanXSS(string $code): void
    {
        // Unescaped output
        if (preg_match_all('/(echo|print|printf|print_r)\s*\(.*\$_(GET|POST|REQUEST|COOKIE)/i', $code, $matches)) {
            $this->addVulnerability([
                'type' => 'Cross-Site Scripting (XSS)',
                'severity' => 'high',
                'message' => 'Unescaped user input in output',
                'cwe' => 'CWE-79',
                'owasp' => 'A03:2021 – Injection',
                'fix' => 'Use htmlspecialchars($input, ENT_QUOTES, \'UTF-8\') or a templating engine with auto-escaping',
                'references' => [
                    'https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html'
                ]
            ]);
        }

        // HTML attribute injection
        if (preg_match_all('/<[^>]*=\s*["\']?\s*\$\w+/i', $code, $matches)) {
            $this->addVulnerability([
                'type' => 'XSS - Attribute Injection',
                'severity' => 'high',
                'message' => 'Variable directly used in HTML attribute without escaping',
                'cwe' => 'CWE-79',
                'fix' => 'Use htmlspecialchars() for all dynamic attribute values'
            ]);
        }
    }

    /**
     * Code Injection Detection
     */
    private function scanCodeInjection(string $code): void
    {
        // eval()
        if (preg_match_all('/\beval\s*\(/i', $code, $matches, PREG_OFFSET_SET)) {
            $this->addVulnerability([
                'type' => 'Code Injection',
                'severity' => 'critical',
                'message' => 'Usage of eval() allows arbitrary code execution',
                'cwe' => 'CWE-95',
                'owasp' => 'A03:2021 – Injection',
                'fix' => 'Remove eval() - use expression parsers, template engines, or safer alternatives',
                'references' => [
                    'https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html'
                ]
            ]);
        }

        // exec/system/passthru
        if (preg_match_all('/\b(exec|system|passthru|shell_exec|popen|proc_open)\s*\(/i', $code, $matches)) {
            $this->addVulnerability([
                'type' => 'Command Injection',
                'severity' => 'critical',
                'message' => 'System command execution detected',
                'cwe' => 'CWE-78',
                'owasp' => 'A03:2021 – Injection',
                'fix' => 'Use escapeshellarg() and escapeshellcmd() if system commands are necessary. Consider safer PHP alternatives.'
            ]);
        }

        // preg_replace with /e modifier (deprecated)
        if (preg_match_all('/preg_replace\s*\([^)]*["\']\/.*\/e/i', $code)) {
            $this->addVulnerability([
                'type' => 'Code Injection via preg_replace',
                'severity' => 'high',
                'message' => 'preg_replace with /e modifier allows code execution',
                'cwe' => 'CWE-95',
                'fix' => 'Use preg_replace_callback() instead of /e modifier'
            ]);
        }
    }

    /**
     * File Inclusion Vulnerabilities
     */
    private function scanFileInclusion(string $code): void
    {
        if (preg_match_all('/(include|require|include_once|require_once)\s*\(.*\$_(GET|POST|REQUEST)/i', $code)) {
            $this->addVulnerability([
                'type' => 'Remote/Local File Inclusion (RFI/LFI)',
                'severity' => 'critical',
                'message' => 'User input used in file inclusion',
                'cwe' => 'CWE-98',
                'owasp' => 'A01:2021 – Broken Access Control',
                'fix' => 'Use whitelist for file includes. Never allow user-controlled file paths.',
                'references' => [
                    'https://cheatsheetseries.owasp.org/cheatsheets/File_Inclusion_Cheat_Sheet.html'
                ]
            ]);
        }
    }

    /**
     * Authentication Issues
     */
    private function scanAuthentication(string $code): void
    {
        // Weak password comparison
        if (preg_match_all('/\$\w+password\s*==\s*["\']/', $code, PREG_OFFSET_SET)) {
            $this->addVulnerability([
                'type' => 'Weak Authentication',
                'severity' => 'high',
                'message' => 'Hardcoded password comparison detected',
                'cwe' => 'CWE-287',
                'owasp' => 'A07:2021 – Identification and Authentication Failures',
                'fix' => 'Use password_verify() with passwords hashed via password_hash()'
            ]);
        }

        // Missing auth checks
        if (strpos($code, '$_SESSION') !== false && strpos($code, 'session_start') === false) {
            $this->addVulnerability([
                'type' => 'Session Handling',
                'severity' => 'medium',
                'message' => 'Session usage without session_start()',
                'cwe' => 'CWE-613',
                'fix' => 'Call session_start() before accessing $_SESSION variables'
            ]);
        }
    }

    /**
     * Cryptographic Issues
     */
    private function scanCryptoIssues(string $code): void
    {
        // Weak hashing
        if (preg_match_all('/\b(md5|sha1)\s*\(/i', $code, PREG_OFFSET_SET)) {
            $this->addVulnerability([
                'type' => 'Weak Hashing Algorithm',
                'severity' => 'medium',
                'message' => 'MD5/SHA1 detected - these are cryptographically broken',
                'cwe' => 'CWE-328',
                'owasp' => 'A02:2021 – Cryptographic Failures',
                'fix' => 'Use password_hash($password, PASSWORD_ARGON2ID) for passwords, or hash("sha256", $data) for general hashing',
                'references' => [
                    'https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html'
                ]
            ]);
        }

        // Weak random
        if (preg_match_all('/\brand\s*\(/i', $code) && strpos($code, 'random_int') === false) {
            $this->addVulnerability([
                'type' => 'Weak Randomness',
                'severity' => 'medium',
                'message' => 'Using rand() instead of cryptographically secure random',
                'cwe' => 'CWE-330',
                'fix' => 'Use random_int($min, $max) or random_bytes($length) for security-sensitive operations'
            ]);
        }
    }

    /**
     * Session Security
     */
    private function scanSessionIssues(string $code): void
    {
        // Session fixation
        if (strpos($code, 'session_regenerate_id') === false && strpos($code, '$_SESSION') !== false) {
            $this->addVulnerability([
                'type' => 'Session Fixation',
                'severity' => 'medium',
                'message' => 'Session ID not regenerated after login',
                'cwe' => 'CWE-384',
                'fix' => 'Call session_regenerate_id(true) after successful authentication'
            ]);
        }
    }

    /**
     * CSRF Detection
     */
    private function scanCSRF(string $code): void
    {
        // Forms without CSRF tokens
        if (preg_match_all('/<form[^>]*method\s*=\s*["\']post["\']/i', $code, PREG_OFFSET_SET)) {
            if (strpos($code, 'csrf_token') === false && strpos($code, '_token') === false) {
                $this->addVulnerability([
                    'type' => 'Missing CSRF Protection',
                    'severity' => 'high',
                    'message' => 'POST form without CSRF token detected',
                    'cwe' => 'CWE-352',
                    'owasp' => 'A01:2021 – Broken Access Control',
                    'fix' => 'Add CSRF tokens: <input type="hidden" name="csrf_token" value="<?= $_SESSION[\'csrf_token\'] ?>">',
                    'references' => [
                        'https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html'
                    ]
                ]);
            }
        }
    }

    /**
     * Hardcoded Secrets Detection
     */
    private function scanHardcodedSecrets(string $code): void
    {
        // API keys, passwords, tokens
        if (preg_match_all('/(password|secret|api_key|apikey|token|access_key)\s*=\s*["\']([A-Za-z0-9]{8,})["\']/i', 
            $code, $matches, PREG_OFFSET_SET)) {
            
            // Filter out common false positives
            $filtered = array_filter($matches[2], fn($val) => 
                !in_array(strtolower($val), ['your_password_here', 'changeme', 'password123'])
            );

            if (!empty($filtered)) {
                $this->addVulnerability([
                    'type' => 'Hardcoded Credentials',
                    'severity' => 'high',
                    'message' => 'Potential hardcoded secrets detected',
                    'cwe' => 'CWE-798',
                    'owasp' => 'A02:2021 – Cryptographic Failures',
                    'fix' => 'Use environment variables (getenv()) or a secrets manager (AWS Secrets Manager, HashiCorp Vault)',
                    'references' => [
                        'https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html'
                    ]
                ]);
            }
        }
    }

    /**
     * Error Handling Issues
     */
    private function scanErrorHandling(string $code): void
    {
        // Display errors
        if (preg_match('/ini_set\s*\(\s*["\']display_errors["\']\s*,\s*["\']?1/i', $code)) {
            $this->addVulnerability([
                'type' => 'Error Information Disclosure',
                'severity' => 'medium',
                'message' => 'Error display enabled - may expose sensitive information',
                'cwe' => 'CWE-209',
                'fix' => 'Set display_errors=Off in production. Use error_log() instead of echoing errors.'
            ]);
        }

        // Empty catch blocks
        if (preg_match_all('/catch\s*\([^)]*\)\s*\{\s*\}/i', $code)) {
            $this->addVulnerability([
                'type' => 'Silent Error Handling',
                'severity' => 'low',
                'message' => 'Empty catch block - errors are being silently ignored',
                'cwe' => 'CWE-390',
                'fix' => 'Log errors or handle them appropriately. Never silently swallow exceptions.'
            ]);
        }
    }

    private function addVulnerability(array $vuln): void
    {
        $this->vulnerabilities[] = array_merge($vuln, [
            'id' => uniqid('VULN-'),
            'timestamp' => date('Y-m-d H:i:s')
        ]);
    }

    private function getLineNumber(string $code, int $position): int
    {
        return substr_count(substr($code, 0, $position), "\n") + 1;
    }

    private function calculateRiskScore(): float
    {
        $score = 0;
        $weights = [
            'critical' => 10,
            'high' => 7,
            'medium' => 4,
            'low' => 1
        ];

        foreach ($this->vulnerabilities as $vuln) {
            $weight = $weights[$vuln['severity']] ?? 1;
            $score += $weight;
        }

        return round(min(10, $score / 10), 2);
    }

    private function getRiskLevel(float $score): string
    {
        if ($score >= 8) return 'CRITICAL';
        if ($score >= 6) return 'HIGH';
        if ($score >= 4) return 'MEDIUM';
        if ($score >= 2) return 'LOW';
        return 'MINIMAL';
    }
}
