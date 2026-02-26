<?php
require __DIR__ . '/config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') respond(['error' => 'Method not allowed'], 405);

$body     = json_decode(file_get_contents('php://input'), true) ?? [];
$email    = trim($body['email']     ?? '');
$password =      $body['password']  ?? '';
$fullName = trim($body['full_name'] ?? '');
$phone    = trim($body['phone']     ?? '');

// Validation
if (!$email || !$password || !$fullName) {
    respond(['error' => 'Email, password, and full name are required'], 400);
}
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    respond(['error' => 'Invalid email address'], 400);
}
if (strlen($password) < 6) {
    respond(['error' => 'Password must be at least 6 characters'], 400);
}

// Check for duplicate email
$users = readJson(USERS_FILE);
foreach ($users as $u) {
    if (strtolower($u['email']) === strtolower($email)) {
        respond(['error' => 'This email is already registered. Please log in instead.'], 409);
    }
}

// Create user — password stored as bcrypt hash (never plain text)
$userId  = bin2hex(random_bytes(8));
$newUser = [
    'id'            => $userId,
    'email'         => $email,
    'password_hash' => password_hash($password, PASSWORD_BCRYPT),
    'full_name'     => $fullName,
    'phone'         => $phone,
    'created_at'    => date('c'),
];
$users[] = $newUser;
writeJson(USERS_FILE, $users);

// Create 24-hour session token
$token    = bin2hex(random_bytes(32));
$sessions = readJson(SESSIONS_FILE);
$sessions[$token] = ['user_id' => $userId, 'expires' => time() + 86400];
writeJson(SESSIONS_FILE, $sessions);

respond([
    'token' => $token,
    'user'  => ['id' => $userId, 'email' => $email, 'full_name' => $fullName, 'phone' => $phone],
]);
