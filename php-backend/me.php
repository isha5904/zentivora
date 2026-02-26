<?php
require __DIR__ . '/config.php';

$userId = requireAuth();
$users  = readJson(USERS_FILE);

foreach ($users as $u) {
    if ($u['id'] === $userId) {
        unset($u['password_hash']); // never send password hash to client
        respond($u);
    }
}

respond(['error' => 'User not found'], 404);
