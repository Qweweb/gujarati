import re

with open('d:/Antigravity/Gujarati/src/components/DigitalCard.jsx', 'r', encoding='utf-8') as f:
    code = f.read()

find_str = """          profileImage: null
          profileImage: null
        });
      }
    }
    }
  }, [location, isViewer, slug]);"""

replace_str = """          profileImage: null
        });
      }
    }
  }, [isViewer, slug, location.hash]);"""

code = code.replace(find_str, replace_str)

with open('d:/Antigravity/Gujarati/src/components/DigitalCard.jsx', 'w', encoding='utf-8') as f:
    f.write(code)
print("Done")
