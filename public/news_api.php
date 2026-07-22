<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

$json_file = 'live_news.json';
$cron_script = 'live_news_cron.py';

// Check if file exists
if (file_exists($json_file)) {
    $last_modified = filemtime($json_file);
    $time_diff = time() - $last_modified;
    
    // If last modified is older than 15 minutes (900 seconds), trigger async update in background
    if ($time_diff > 900) {
        if (file_exists($cron_script)) {
            // Run python script in background asynchronously (works on Linux/Hostinger)
            exec("python3 " . escapeshellarg($cron_script) . " > /dev/null 2>&1 &");
        }
    }
    
    // Return existing data immediately (no wait)
    echo file_get_contents($json_file);
} else {
    // If file doesn't exist, trigger sync blockingly for the first time, then return
    if (file_exists($cron_script)) {
        exec("python3 " . escapeshellarg($cron_script));
        if (file_exists($json_file)) {
            echo file_get_contents($json_file);
            exit;
        }
    }
    // Return empty fallback if both fail
    echo json_encode([]);
}
?>
