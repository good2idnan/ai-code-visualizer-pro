<?php

namespace AICodeVisualizer\ML;

/**
 * ML-Powered Code Embedding and Pattern Recognition
 * Simulates CodeBERT-like embeddings using feature extraction
 * In production, this would connect to a real ML model
 */
class CodeEmbedder
{
    private array $codeFeatures = [];
    private array $embeddingVector = [];

    /**
     * Generate embedding vector for code (simulated CodeBERT-like behavior)
     * In production: Use Python microservice with actual CodeBERT/GraphCodeBERT
     */
    public function generateEmbedding(string $code): array
    {
        $this->codeFeatures = $this->extractFeatures($code);
        $this->embeddingVector = $this->vectorize($this->codeFeatures);

        return [
            'embedding' => $this->embeddingVector,
            'dimensions' => count($this->embeddingVector),
            'features' => $this->codeFeatures,
            'similarity_ready' => true
        ];
    }

    /**
     * Calculate similarity between two code embeddings
     */
    public function calculateSimilarity(array $embedding1, array $embedding2): float
    {
        if (empty($embedding1) || empty($embedding2)) {
            return 0.0;
        }

        // Cosine similarity
        $dotProduct = 0;
        $norm1 = 0;
        $norm2 = 0;

        $length = min(count($embedding1), count($embedding2));
        
        for ($i = 0; $i < $length; $i++) {
            $dotProduct += $embedding1[$i] * $embedding2[$i];
            $norm1 += $embedding1[$i] ** 2;
            $norm2 += $embedding2[$i] ** 2;
        }

        if ($norm1 == 0 || $norm2 == 0) {
            return 0.0;
        }

        return $dotProduct / (sqrt($norm1) * sqrt($norm2));
    }

    /**
     * Classify code quality using trained model (simulated)
     * In production: Use TensorFlow/PyTorch model
     */
    public function classifyQuality(string $code): array
    {
        $features = $this->extractFeatures($code);

        // Simulated ML classification
        $qualityScore = $this->predictQualityScore($features);
        $category = $this->classifyCategory($features);
        $improvements = $this->suggestImprovements($features);

        return [
            'quality_score' => $qualityScore,
            'category' => $category,
            'confidence' => min(0.95, $qualityScore / 10 + 0.3),
            'improvements' => $improvements,
            'model_version' => 'v1.0-simulated'
        ];
    }

    /**
     * Detect code patterns using ML (simulated)
     */
    public function detectPatternsWithML(string $code): array
    {
        $features = $this->extractFeatures($code);
        $patterns = [];

        // OOP Pattern Detection
        if ($features['has_class'] && $features['has_interface']) {
            $patterns[] = [
                'pattern' => 'Object-Oriented Architecture',
                'confidence' => 0.92,
                'embedding_match' => true
            ];
        }

        // Functional Programming
        if ($features['has_closures'] || $features['has_arrow_functions']) {
            $patterns[] = [
                'pattern' => 'Functional Programming',
                'confidence' => 0.87,
                'embedding_match' => true
            ];
        }

        // Async/Reactive
        if ($features['has_promises'] || $features['has_generators']) {
            $patterns[] = [
                'pattern' => 'Asynchronous Processing',
                'confidence' => 0.85,
                'embedding_match' => true
            ];
        }

        // Event-Driven
        if ($features['has_events'] || $features['has_listeners']) {
            $patterns[] = [
                'pattern' => 'Event-Driven Architecture',
                'confidence' => 0.88,
                'embedding_match' => true
            ];
        }

        return $patterns;
    }

    /**
     * Extract numerical features from code for ML
     */
    private function extractFeatures(string $code): array
    {
        $lines = explode("\n", $code);
        $tokens = token_get_all($code);

        return [
            'total_lines' => count($lines),
            'non_empty_lines' => count(array_filter($lines, fn($l) => trim($l) !== '')),
            'comment_lines' => count(array_filter($lines, fn($l) => preg_match('/^\s*\/\*|^\s*\/\//', $l))),
            'total_tokens' => count($tokens),
            'has_class' => stripos($code, 'class ') !== false ? 1 : 0,
            'has_interface' => stripos($code, 'interface ') !== false ? 1 : 0,
            'has_trait' => stripos($code, 'trait ') !== false ? 1 : 0,
            'has_namespace' => stripos($code, 'namespace ') !== false ? 1 : 0,
            'has_closures' => preg_match('/function\s*\(/', $code) ? 1 : 0,
            'has_arrow_functions' => strpos($code, '=>') !== false ? 1 : 0,
            'has_promises' => stripos($code, 'promise') !== false ? 1 : 0,
            'has_generators' => stripos($code, 'yield') !== false ? 1 : 0,
            'has_events' => stripos($code, 'event') !== false ? 1 : 0,
            'has_listeners' => stripos($code, 'listener') !== false ? 1 : 0,
            'has_try_catch' => strpos($code, 'try {') !== false ? 1 : 0,
            'function_count' => preg_match_all('/function\s+\w+/', $code),
            'class_count' => preg_match_all('/class\s+\w+/', $code),
            'method_count' => preg_match_all('/(public|private|protected)\s+function/', $code),
            'avg_line_length' => array_reduce($lines, fn($sum, $line) => $sum + strlen($line), 0) / max(1, count($lines))
        ];
    }

    /**
     * Convert features to embedding vector
     */
    private function vectorize(array $features): array
    {
        $vector = [];
        
        // Normalize and encode features
        foreach ($features as $key => $value) {
            $normalized = is_numeric($value) ? $value / 100 : (float)$value;
            $vector[] = $normalized;
        }

        // Pad to fixed dimension (simulating neural network output)
        $targetDim = 128;
        while (count($vector) < $targetDim) {
            $vector[] = 0.0;
        }

        return array_slice($vector, 0, $targetDim);
    }

    /**
     * Predict quality score (simulated ML model)
     */
    private function predictQualityScore(array $features): float
    {
        $score = 7.0; // Base score
        
        // Comment ratio bonus
        $commentRatio = $features['comment_lines'] / max(1, $features['non_empty_lines']);
        $score += $commentRatio > 0.2 ? 1 : 0;
        
        // OOP bonus
        $score += ($features['has_class'] + $features['has_interface']) * 0.5;
        
        // Error handling bonus
        $score += $features['has_try_catch'] * 0.5;
        
        // Penalize long lines
        if ($features['avg_line_length'] > 100) {
            $score -= 1;
        }

        return round(max(0, min(10, $score)), 2);
    }

    /**
     * Classify code category
     */
    private function classifyCategory(array $features): string
    {
        if ($features['has_class'] && $features['method_count'] > $features['function_count']) {
            return 'OOP Application';
        }
        
        if ($features['function_count'] > $features['class_count'] * 2) {
            return 'Functional/Procedural';
        }
        
        if ($features['has_closures'] || $features['has_arrow_functions']) {
            return 'Modern PHP';
        }

        return 'Mixed Paradigm';
    }

    /**
     * Generate improvement suggestions
     */
    private function suggestImprovements(array $features): array
    {
        $suggestions = [];

        if ($features['comment_lines'] / max(1, $features['non_empty_lines']) < 0.2) {
            $suggestions[] = 'Add more documentation (current: ' . 
                round($features['comment_lines'] / max(1, $features['non_empty_lines']) * 100, 1) . '%)';
        }

        if (!$features['has_try_catch']) {
            $suggestions[] = 'Add error handling with try-catch blocks';
        }

        if ($features['avg_line_length'] > 80) {
            $suggestions[] = 'Reduce line length for better readability (current avg: ' . 
                round($features['avg_line_length']) . ' chars)';
        }

        if (!$features['has_namespace']) {
            $suggestions[] = 'Use namespaces for better organization';
        }

        return $suggestions;
    }
}
