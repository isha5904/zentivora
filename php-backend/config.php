<?php
// Allow requests from the Next.js dev server
header('Access-Control-Allow-Origin: http://localhost:3000');
header('Access-Control-Allow-Methods: GET, POST, PATCH, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json');

// Handle browser preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// File paths for flat-file storage
define('DATA_DIR',           __DIR__ . '/data/');
define('USERS_FILE',         DATA_DIR . 'users.json');
define('APPOINTMENTS_FILE',  DATA_DIR . 'appointments.json');
define('SESSIONS_FILE',      DATA_DIR . 'sessions.json');

// Auto-create data directory and initialize files on first run
if (!is_dir(DATA_DIR)) mkdir(DATA_DIR, 0755, true);
foreach ([USERS_FILE, APPOINTMENTS_FILE] as $f) {
    if (!file_exists($f)) file_put_contents($f, '[]');
}
if (!file_exists(SESSIONS_FILE)) file_put_contents(SESSIONS_FILE, '{}');

// ── Helpers ──────────────────────────────────────────────────────────────────

function readJson(string $file): array {
    if (!file_exists($file)) return [];
    return json_decode(file_get_contents($file), true) ?? [];
}

function writeJson(string $file, array $data): void {
    file_put_contents($file, json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
}

function getAuthToken(): ?string {
    $headers = getallheaders();
    $auth    = $headers['Authorization'] ?? $headers['authorization'] ?? '';
    return (strpos($auth, 'Bearer ') === 0) ? substr($auth, 7) : null;
}

function getUserIdFromToken(): ?string {
    $token = getAuthToken();
    if (!$token) return null;
    $sessions = readJson(SESSIONS_FILE);
    if (!isset($sessions[$token])) return null;
    // Token expired after 24 hours
    if ($sessions[$token]['expires'] < time()) {
        unset($sessions[$token]);
        writeJson(SESSIONS_FILE, $sessions);
        return null;
    }
    return $sessions[$token]['user_id'];
}

function requireAuth(): string {
    $userId = getUserIdFromToken();
    if (!$userId) respond(['error' => 'Unauthorized — please log in again'], 401);
    return $userId;
}

function respond(array $data, int $code = 200): never {
    http_response_code($code);
    echo json_encode($data);
    exit();
}
