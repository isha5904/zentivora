<?php
require __DIR__ . '/config.php';

// Delete the session token so it can't be reused
$token = getAuthToken();
if ($token) {
    $sessions = readJson(SESSIONS_FILE);
    unset($sessions[$token]);
    writeJson(SESSIONS_FILE, $sessions);
}

respond(['success' => true]);
