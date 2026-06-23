import paramiko
import os
import sys

HOST = "46.28.45.171"
PORT = 65002
USER = "u546045772"
KEY_PATH = r"C:\Users\alpha\.ssh\id_rsa_antigravity"
LOCAL_DIST = r"d:\Antigravity\Gujarati\dist"
REMOTE_ROOT = "/home/u546045772/domains/gujaratiapp.in/public_html"

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())

def run(cmd):
    stdin, stdout, stderr = ssh.exec_command(cmd)
    out = stdout.read().decode('utf-8', errors='replace').strip()
    err = stderr.read().decode('utf-8', errors='replace').strip()
    result = (out + "\n" + err).strip()
    if result:
        print(result)
    return out

def upload_dir(sftp, local_dir, remote_dir):
    """Recursively upload a local directory to remote."""
    # Make sure remote dir exists
    try:
        sftp.stat(remote_dir)
    except FileNotFoundError:
        sftp.mkdir(remote_dir)
        print(f"  Created dir: {remote_dir}")
    
    for item in os.listdir(local_dir):
        local_path = os.path.join(local_dir, item)
        remote_path = remote_dir + "/" + item
        
        if os.path.isdir(local_path):
            upload_dir(sftp, local_path, remote_path)
        else:
            sftp.put(local_path, remote_path)
            print(f"  Uploaded: {item}")

try:
    print("Connecting to Hostinger...")
    private_key = paramiko.RSAKey.from_private_key_file(KEY_PATH)
    ssh.connect(hostname=HOST, port=PORT, username=USER, pkey=private_key, timeout=15)
    print("Connected!\n")
    
    # 1. Backup old public_html files (optional - just list what's there)
    print("=== Current public_html contents ===")
    run(f"ls {REMOTE_ROOT}/")
    
    # 2. Remove old files (keep folders intact, delete files)
    print("\n=== Clearing old files ===")
    run(f"find {REMOTE_ROOT} -maxdepth 1 -type f -delete")
    run(f"rm -rf {REMOTE_ROOT}/assets {REMOTE_ROOT}/gods {REMOTE_ROOT}/icons 2>&1")
    print("Old files cleared.")
    
    # 3. Upload new dist
    print(f"\n=== Uploading dist to {REMOTE_ROOT} ===")
    sftp = ssh.open_sftp()
    upload_dir(sftp, LOCAL_DIST, REMOTE_ROOT)
    sftp.close()
    
    # 4. Verify
    print("\n=== New public_html contents ===")
    run(f"ls -la {REMOTE_ROOT}/")
    run(f"ls {REMOTE_ROOT}/assets/ | head -10")
    
    print("\n[SUCCESS] Deployment complete! Visit: https://gujaratiapp.in")

except Exception as e:
    print(f"\n[ERROR] Error: {e}")
    import traceback
    traceback.print_exc()
finally:
    ssh.close()
