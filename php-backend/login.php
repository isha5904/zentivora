<?php
require __DIR__ . '/config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') respond(['error' => 'Method not allowed'], 405);

$body     = json_decode(file_get_contents('php://input'), true) ?? [];
$email    = trim($body['email']    ?? '');
$password =      $body['password'] ?? '';

if (!$email || !$password) respond(['error' => 'Email and password are required'], 400);

// Find user by email
$users     = readJson(USERS_FILE);
$foundUser = null;
foreach ($users as $u) {
    if (strtolower($u['email']) === strtolower($email)) {
        $foundUser = $u;
        break;
    }
}

// Verify password (never compare plain text — always use password_verify)
if (!$foundUser || !password_verify($password, $foundUser['password_hash'])) {
    respond(['error' => 'Invalid email or password'], 401);
}

// Create 24-hour session token
$token    = bin2hex(random_bytes(32));
$sessions = readJson(SESSIONS_FILE);
$sessions[$token] = ['user_id' => $foundUser['id'], 'expires' => time() + 86400];
writeJson(SESSIONS_FILE, $sessions);

respond([
    'token' => $token,
    'user'  => [
        'id'        => $foundUser['id'],
        'email'     => $foundUser['email'],
        'full_name' => $foundUser['full_name'],
        'phone'     => $foundUser['phone'] ?? '',
    ],
]);
