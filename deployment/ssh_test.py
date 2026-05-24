import subprocess
import time

password = "QazwsX@@2025"
command = "lsb_release -a && docker -v && docker-compose -v && netstat -tulpn | grep -E ':(80|443|5678)'"
host = "root@82.112.227.60"

# Using ssh with -tt to force a pseudo-terminal if needed, 
# although for a simple command without interactive needs, -T might be better.
# However, many servers won't accept password input if no TTY is present.
# Since we can't easily do it here, let's try the simplest.

process = subprocess.Popen(
    ["ssh", "-o", "StrictHostKeyChecking=no", host, command],
    stdin=subprocess.PIPE,
    stdout=subprocess.PIPE,
    stderr=subprocess.PIPE,
    text=True
)

stdout, stderr = process.communicate(input=password + "\n")

print("STDOUT:")
print(stdout)
print("STDERR:")
print(stderr)
