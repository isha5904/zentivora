<?php
require __DIR__ . '/config.php';

$userId = requireAuth();
$method = $_SERVER['REQUEST_METHOD'];

// ── GET: fetch all appointments for the logged-in user ──────────────────────
if ($method === 'GET') {
    $all  = readJson(APPOINTMENTS_FILE);
    $mine = array_values(array_filter($all, fn($a) => $a['user_id'] === $userId));
    usort($mine, fn($a, $b) => strcmp($b['appointment_date'], $a['appointment_date']));
    respond($mine);
}

// ── POST: create a new appointment ──────────────────────────────────────────
if ($method === 'POST') {
    $body  = json_decode(file_get_contents('php://input'), true) ?? [];
    $appts = readJson(APPOINTMENTS_FILE);

    $appt = [
        'id'               => bin2hex(random_bytes(8)),
        'user_id'          => $userId,
        'service_id'       => $body['service_id']       ?? '',
        'groomer_id'       => $body['groomer_id']       ?? null,
        'appointment_date' => $body['appointment_date'] ?? '',
        'appointment_time' => $body['appointment_time'] ?? '',
        'pet_name'         => $body['pet_name']         ?? '',
        'pet_breed'        => $body['pet_breed']        ?? null,
        'pet_age'          => isset($body['pet_age']) ? (int)$body['pet_age'] : null,
        'notes'            => $body['notes']            ?? null,
        'total_price'      => (float)($body['total_price'] ?? 0),
        'status'           => 'pending',
        'created_at'       => date('c'),
    ];
    $appts[] = $appt;
    writeJson(APPOINTMENTS_FILE, $appts);
    respond($appt, 201);
}

// ── PATCH: update appointment status (cancel) ────────────────────────────────
if ($method === 'PATCH') {
    $body   = json_decode(file_get_contents('php://input'), true) ?? [];
    $id     = $body['id']     ?? '';
    $status = $body['status'] ?? '';

    $appts = readJson(APPOINTMENTS_FILE);
    $found = false;
    foreach ($appts as &$a) {
        if ($a['id'] === $id && $a['user_id'] === $userId) {
            $a['status'] = $status;
            $found = true;
            break;
        }
    }
    if (!$found) respond(['error' => 'Appointment not found'], 404);
    writeJson(APPOINTMENTS_FILE, $appts);
    respond(['success' => true]);
}

respond(['error' => 'Method not allowed'], 405);
