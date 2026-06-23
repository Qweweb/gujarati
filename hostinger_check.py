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
    print("Connecting to Hostinger...")
    private_key = paramiko.RSAKey.from_private_key_file(KEY_PATH)
    ssh.connect(hostname=HOST, port=PORT, username=USER, pkey=private_key, timeout=15)
    print("Connected!\n")

    print("=== Home dir ===")
    run("pwd; ls -la ~")

    print("\n=== public_html ===")
    run("ls ~/public_html/ 2>&1 | head -30")

    print("\n=== Node/NPM ===")
    run("node --version 2>&1; npm --version 2>&1; which node 2>&1")

    print("\n=== Git ===")
    run("git --version 2>&1")

    print("\n=== Domains ===")
    run("ls ~/domains/ 2>&1")

except Exception as e:
    print(f"Error: {e}")
finally:
    ssh.close()
