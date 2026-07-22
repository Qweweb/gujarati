# -*- coding: utf-8 -*-
import paramiko

HOST = "46.28.45.171"
PORT = 65002
USER = "u546045772"
KEY_PATH = r"C:\Users\alpha\.ssh\id_rsa_antigravity"
REMOTE_ROOT = "/home/u546045772/domains/gujaratiapp.in/public_html"

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())

try:
    print("Connecting to Hostinger VPS via SSH...")
    private_key = paramiko.RSAKey.from_private_key_file(KEY_PATH)
    ssh.connect(hostname=HOST, port=PORT, username=USER, pkey=private_key, timeout=15)
    print("Connected successfully!")
    
    # Delete live_news.json to force a fresh scraping run
    stdin, stdout, stderr = ssh.exec_command(f"rm -f {REMOTE_ROOT}/live_news.json")
    print("rm status code:", stdout.channel.recv_exit_status())
    print("SUCCESS: Deleted live_news.json on the server!")
except Exception as e:
    print("Error:", e)
finally:
    ssh.close()
