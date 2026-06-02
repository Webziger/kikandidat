<?php
header('Content-Type: text/plain; charset=utf-8');
echo "PHPPROBE_OK\n";
echo "version=" . phpversion() . "\n";
echo "sapi=" . php_sapi_name() . "\n";
echo "mail_fn=" . (function_exists('mail') ? 'yes' : 'no') . "\n";
