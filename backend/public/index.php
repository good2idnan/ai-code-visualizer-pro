<?php

/**
 * AI Code Visualizer - API Entry Point
 * 
 * Usage:
 *   php -S localhost:8080 -t public/
 *   
 * Endpoints:
 *   POST /api/analyze - Analyze code with full AST + ML + Security
 *   POST /api/embed - Generate code embeddings
 *   POST /api/security - Security scan only
 *   POST /api/quality - Quality classification
 *   GET  /api/health - Health check
 */

require_once __DIR__ . '/../vendor/autoload.php';

use AICodeVisualizer\Analyzer\ASTAnalyzer;
use AICodeVisualizer\ML\CodeEmbedder;
use AICodeVisualizer\Security\SecurityScanner;

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Handle CORS preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

try {
    $uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
    
    // Health check
    if ($uri === '/api/health' && $_SERVER['REQUEST_METHOD'] === 'GET') {
        echo json_encode([
            'status' => 'healthy',
            'timestamp' => date('Y-m-d H:i:s'),
            'version' => '2.0.0',
            'features' => ['ast_analysis', 'ml_embeddings', 'security_scan', 'quality_classification']
        ]);
        exit;
    }

    // Only POST endpoints below
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        http_response_code(405);
        echo json_encode(['error' => 'Method not allowed']);
        exit;
    }

    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!$input || !isset($input['code'])) {
        http_response_code(400);
        echo json_encode(['error' => 'Missing required field: code']);
        exit;
    }

    $code = $input['code'];
    $filename = $input['filename'] ?? 'unknown.php';

    // Full analysis
    if ($uri === '/api/analyze') {
        $astAnalyzer = new ASTAnalyzer();
        $embedder = new CodeEmbedder();
        $securityScanner = new SecurityScanner();

        $astResult = $astAnalyzer->analyze($code);
        $embedding = $embedder->generateEmbedding($code);
        $quality = $embedder->classifyQuality($code);
        $security = $securityScanner->scan($code, $filename);

        echo json_encode([
            'success' => true,
            'analysis' => $astResult,
            'embeddings' => [
                'vector' => $embedding['embedding'],
                'dimensions' => $embedding['dimensions'],
                'features' => $embedding['features']
            ],
            'quality' => $quality,
            'security' => $security,
            'timestamp' => date('Y-m-d H:i:s'),
            'processing_time_ms' => (microtime(true) - $_SERVER['REQUEST_TIME_FLOAT']) * 1000
        ]);
        exit;
    }

    // Code embeddings only
    if ($uri === '/api/embed') {
        $embedder = new CodeEmbedder();
        $result = $embedder->generateEmbedding($code);

        echo json_encode([
            'success' => true,
            'embedding' => $result['embedding'],
            'dimensions' => $result['dimensions'],
            'features' => $result['features'],
            'similarity_ready' => true
        ]);
        exit;
    }

    // Security scan only
    if ($uri === '/api/security') {
        $scanner = new SecurityScanner();
        $result = $scanner->scan($code, $filename);

        echo json_encode([
            'success' => true,
            'scan' => $result
        ]);
        exit;
    }

    // Quality classification only
    if ($uri === '/api/quality') {
        $embedder = new CodeEmbedder();
        $result = $embedder->classifyQuality($code);

        echo json_encode([
            'success' => true,
            'quality' => $result
        ]);
        exit;
    }

    // Similarity calculation
    if ($uri === '/api/similarity') {
        if (!isset($input['code1']) || !isset($input['code2'])) {
            http_response_code(400);
            echo json_encode(['error' => 'Missing required fields: code1, code2']);
            exit;
        }

        $embedder = new CodeEmbedder();
        $embedding1 = $embedder->generateEmbedding($input['code1']);
        $embedding2 = $embedder->generateEmbedding($input['code2']);
        $similarity = $embedder->calculateSimilarity($embedding1['embedding'], $embedding2['embedding']);

        echo json_encode([
            'success' => true,
            'similarity' => round($similarity, 4),
            'interpretation' => $similarity > 0.8 ? 'Very Similar' : 
                               ($similarity > 0.6 ? 'Moderately Similar' : 
                               ($similarity > 0.4 ? 'Somewhat Similar' : 'Different'))
        ]);
        exit;
    }

    // Endpoint not found
    http_response_code(404);
    echo json_encode(['error' => 'Endpoint not found', 'available' => [
        '/api/analyze',
        '/api/embed',
        '/api/security',
        '/api/quality',
        '/api/similarity',
        '/api/health'
    ]]);

} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode([
        'error' => 'Internal server error',
        'message' => $e->getMessage(),
        'file' => $e->getFile(),
        'line' => $e->getLine()
    ]);
}
