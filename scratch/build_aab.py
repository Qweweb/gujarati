import os
import subprocess
import sys

# Define path to Java JDK from Android Studio
java_home = r"C:\Program Files\Android\Android Studio\jbr"
os.environ["JAVA_HOME"] = java_home

# Add bin folder to path
os.environ["PATH"] = os.path.join(java_home, "bin") + os.pathsep + os.environ["PATH"]

# Change directory to android
android_dir = os.path.join(os.getcwd(), "android")

print(f"Using JAVA_HOME: {java_home}")
print(f"Running Gradle build in {android_dir}...")

# Run Gradle
try:
    result = subprocess.run(
        [r".\gradlew.bat", "bundleRelease"],
        cwd=android_dir,
        shell=True,
        check=True
    )
    print("Gradle build completed successfully!")
except subprocess.CalledProcessError as e:
    print(f"Gradle build failed with exit code {e.returncode}")
    sys.exit(e.returncode)
