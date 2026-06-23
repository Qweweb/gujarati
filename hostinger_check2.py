import paramiko

HOST = "46.28.45.171"
PORT = 65002
USER = "u546045772"
KEY_PATH = r"C:\Users\alpha\.ssh\id_rsa_antigravity"

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())

def run(cmd):
    stdin, stdout, stderr = ssh.exec_command(cmd)
    out = stdout.read().decode('utf-8', errors='replace').strip()
    err = stderr.read().decode('utf-8', errors='replace').strip()
    if out: print(out)
    if err: print("[ERR]", err)

try:
    private_key = paramiko.RSAKey.from_private_key_file(KEY_PATH)
    ssh.connect(hostname=HOST, port=PORT, username=USER, pkey=private_key, timeout=15)
    print("Connected!\n")

    print("=== gujaratiapp.in structure ===")
    run("ls -la ~/domains/gujaratiapp.in/")

    print("\n=== public folder ===")
    run("ls ~/domains/gujaratiapp.in/public_html/ 2>&1 | head -30")

    print("\n=== git status in public_html ===")
    run("cd ~/domains/gujaratiapp.in/public_html && git remote -v 2>&1")

    print("\n=== PHP/node selector ===")
    run("ls ~/.cl.selector/")

    print("\n=== available node versions ===")
    run("ls /opt/alt/alt-nodejs* 2>&1 | head -20")

    print("\n=== nvm ===")
    run("ls ~/.nvm 2>&1")

except Exception as e:
    print(f"Error: {e}")
finally:
    ssh.close()
