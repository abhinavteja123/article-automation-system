<?php
// Simple health check that bypasses Laravel entirely
header('Content-Type: application/json');
echo json_encode(['status' => 'ok']);
exit;