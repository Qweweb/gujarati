# -*- coding: utf-8 -*-
import paramiko
import sys

HOST = "46.28.45.171"
PORT = 65002
USER = "u546045772"
KEY_PATH = r"C:\Users\alpha\.ssh\id_rsa_antigravity"
REMOTE_ROOT = "/home/u546045772/domains/gujaratiapp.in/public_html"

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())

def run(cmd):
    stdin, stdout, stderr = ssh.exec_command(cmd)
    out = stdout.read().decode('utf-8', errors='replace').strip()
    err = stderr.read().decode('utf-8', errors='replace').strip()
    return out, err

try:
    print("Connecting to Hostinger VPS via SSH...")
    private_key = paramiko.RSAKey.from_private_key_file(KEY_PATH)
    ssh.connect(hostname=HOST, port=PORT, username=USER, pkey=private_key, timeout=15)
    print("Connected successfully!\n")
    
    # 1. Run live_news_cron.py once to seed the initial news list
    print("=== Running live_news_cron.py once ===")
    cmd = f"cd {REMOTE_ROOT} && python3 live_news_cron.py"
    out, err = run(cmd)
    if out:
        print("STDOUT:", out)
    if err:
        print("STDERR:", err)
        
    # 2. Check if live_news.json was successfully created
    print("\n=== Verifying live_news.json ===")
    out, err = run(f"ls -lh {REMOTE_ROOT}/live_news.json")
    print(out if out else "File not found!")
    
    # 3. Add to crontab if not already there
    print("\n=== Setting up Cron Job (runs every 30 minutes) ===")
    # List current crontab
    cron_list, _ = run("crontab -l")
    print("Current crontab entries:")
    print(cron_list if cron_list else "(none)")
    
    cron_entry = f"*/30 * * * * cd {REMOTE_ROOT} && python3 live_news_cron.py > /dev/null 2>&1"
    
    if cron_entry in cron_list:
        print("Cron job is already installed.")
    else:
        # Append and update crontab
        new_cron = (cron_list + "\n" + cron_entry).strip() + "\n"
        # Write to temp file and load it to crontab
        # Echo new_cron into crontab
        # Escaping quotes for echo command
        escaped_cron = new_cron.replace('"', '\\"')
        out, err = run(f'echo "{escaped_cron}" | crontab -')
        print("Updated crontab status:", out, err)
        
        # Verify
        updated_list, _ = run("crontab -l")
        print("\nNew crontab entries:")
        print(updated_list)

except Exception as e:
    print("Error:", e)
finally:
    ssh.close()
