import paramiko
import os

# Try common SSH key paths
key_paths = [
    r"C:\Users\alpha\.ssh\id_rsa",
    r"C:\Users\alpha\.ssh\id_rsa_antigravity",
    r"C:\Users\alpha\.ssh\id_ed25519",
    r"C:\Users\alpha\.ssh\hostinger",
]

print("Available SSH keys:")
for p in key_paths:
    print(f"  {p}: {'EXISTS' if os.path.exists(p) else 'NOT FOUND'}")

print("\nAll SSH files in .ssh:")
ssh_dir = r"C:\Users\alpha\.ssh"
if os.path.exists(ssh_dir):
    for f in os.listdir(ssh_dir):
        print(f"  {f}")
