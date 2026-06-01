import re

with open('d:/Antigravity/Gujarati/src/components/DigitalCard.jsx', 'r', encoding='utf-8') as f:
    code = f.read()

find_str = """        });
      }
    }
  }, [isViewer, slug, location.hash]);"""

replace_str = """        });
      }
    }
    }
  }, [isViewer, slug, location.hash]);"""

code = code.replace(find_str, replace_str)

with open('d:/Antigravity/Gujarati/src/components/DigitalCard.jsx', 'w', encoding='utf-8') as f:
    f.write(code)
print("Done")
