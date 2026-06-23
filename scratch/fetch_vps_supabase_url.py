import paramiko
import re

HOST = "46.28.45.171"
PORT = 65002
USER = "u546045772"
KEY_PATH = r"C:\Users\alpha\.ssh\id_rsa_antigravity"
REMOTE_ROOT = "/home/u546045772/domains/gujaratiapp.in/public_html"

def main():
    ssh = paramiko.SSHClient()
    ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    
    try:
        print("Connecting to Hostinger VPS...")
        private_key = paramiko.RSAKey.from_private_key_file(KEY_PATH)
        ssh.connect(hostname=HOST, port=PORT, username=USER, pkey=private_key, timeout=15)
        print("Connected!")
        
        # List assets folder
        stdin, stdout, stderr = ssh.exec_command(f"ls {REMOTE_ROOT}/assets/")
        files = stdout.read().decode('utf-8').strip().split('\n')
        
        js_files = [f for f in files if f.endswith('.js')]
        print(f"Found JS files in assets: {js_files}")
        
        for js_file in js_files:
            print(f"Checking {js_file} for supabase URL...")
            cmd = f"grep -o -E 'https://[a-zA-Z0-9.-]+\\.supabase\\.co' {REMOTE_ROOT}/assets/{js_file}"
            stdin, stdout, stderr = ssh.exec_command(cmd)
            out = stdout.read().decode('utf-8').strip()
            if out:
                print(f"Matches in {js_file}:\n{out}")
                
            # Also search for VITE_API_BASE_URL value or n8n
            cmd_n8n = f"grep -o -E 'https://[a-zA-Z0-9.-]+\\.n8n\\.[a-zA-Z0-9.-]+|https://[a-zA-Z0-9.-]+\\.gujaratiapp\\.in' {REMOTE_ROOT}/assets/{js_file}"
            stdin, stdout, stderr = ssh.exec_command(cmd_n8n)
            out_n8n = stdout.read().decode('utf-8').strip()
            if out_n8n:
                print(f"n8n/API Matches in {js_file}:\n{out_n8n}")
                
    except Exception as e:
        print(f"Error: {e}")
    finally:
        ssh.close()

if __name__ == '__main__':
    main()
