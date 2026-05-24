import os
import sys
import paramiko

def deploy():
    host = "82.112.227.60"
    user = "root"
    key_path = r"C:\Users\alpha\.ssh\id_rsa_antigravity"
    
    local_server_js = r"d:\Antigravity\Gujarati\deployment\server.js"
    remote_dir = "/root/panchang-service"
    remote_server_js = "/root/panchang-service/server.js"
    
    ssh = paramiko.SSHClient()
    ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    
    try:
        print("Connecting to remote VPS...")
        private_key = paramiko.RSAKey.from_private_key_file(key_path)
        ssh.connect(hostname=host, username=user, pkey=private_key, timeout=10)
        
        # 1. Create directory if not exists
        print(f"Creating directory {remote_dir}...")
        ssh.exec_command(f"mkdir -p {remote_dir}")
        
        # 2. Transfer file
        print("Transferring server.js...")
        sftp = ssh.open_sftp()
        sftp.put(local_server_js, remote_server_js)
        sftp.close()
        
        # 3. Initialize npm and install packages
        print("Installing npm packages (express, mhah-panchang)...")
        # Run inside remote_dir
        cmd_install = f"cd {remote_dir} && [ -f package.json ] || npm init -y && npm install express mhah-panchang"
        stdin, stdout, stderr = ssh.exec_command(cmd_install)
        print(stdout.read().decode('utf-8'))
        print(stderr.read().decode('utf-8'))
        
        # 4. Check if pm2 service exists and start/restart
        print("Starting service under PM2...")
        cmd_pm2 = f"cd {remote_dir} && pm2 restart panchang-service || pm2 start server.js --name \"panchang-service\" && pm2 save"
        stdin, stdout, stderr = ssh.exec_command(cmd_pm2)
        print(stdout.read().decode('utf-8'))
        print(stderr.read().decode('utf-8'))
        
        print("Deployment completed successfully!")
        
    except Exception as e:
        print(f"Deployment Error: {e}", file=sys.stderr)
    finally:
        ssh.close()

if __name__ == "__main__":
    deploy()
