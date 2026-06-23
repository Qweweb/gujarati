import paramiko
import time

HOST = "82.112.227.60"
USER = "root"
KEY_PATH = r"C:\Users\alpha\.ssh\id_rsa_antigravity"
REMOTE_DIR = "/var/www/gujaratiapp"  # Standard web dir

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())

try:
    print("Connecting...")
    private_key = paramiko.RSAKey.from_private_key_file(KEY_PATH)
    ssh.connect(hostname=HOST, username=USER, pkey=private_key, timeout=15)
    print("Connected!")
    
    # Check if the project exists on VPS
    stdin, stdout, stderr = ssh.exec_command("ls /var/www/gujaratiapp 2>&1 || echo 'NOT_FOUND'")
    output = stdout.read().decode().strip()
    print("Check dir:", output)
    
    # Check nginx sites
    stdin, stdout, stderr = ssh.exec_command("ls /etc/nginx/sites-enabled/ 2>&1")
    print("Nginx sites:", stdout.read().decode().strip())
    
    # Check pm2
    stdin, stdout, stderr = ssh.exec_command("pm2 list 2>&1")
    print("PM2:", stdout.read().decode().strip())
    
    # Check what web dirs exist
    stdin, stdout, stderr = ssh.exec_command("ls /var/www/ 2>&1")
    print("www dirs:", stdout.read().decode().strip())

    # Check node version
    stdin, stdout, stderr = ssh.exec_command("node --version 2>&1; npm --version 2>&1")
    print("Node/NPM:", stdout.read().decode().strip())

except Exception as e:
    print(f"Error: {e}")
finally:
    ssh.close()
