import re

with open('d:/Antigravity/Gujarati/src/components/DigitalCard.jsx', 'r', encoding='utf-8') as f:
    code = f.read()

find_str = """          profileImage: null
        });
      }
    }
  }, [location, isViewer]);"""

# The file actually has:
#           profileImage: null
#         });
#       }
#     }
#   }, [location, isViewer]);

# Wait, what? line 1261 says `}, [location, isViewer]);`
# But my python script replaced it with `[isViewer, slug, location.hash]);`!
# Let me look closely at the file content output from view_file at line 1261:
# 1261:   }, [location, isViewer]);

# Oh! So my `find_viewer_effect_end` in python didn't match and was ignored!
# Because the actual code was `}, [location, isViewer]);` not `}, [isViewer]);` !

replace_str = """          profileImage: null
        });
      }
    }
    }
  }, [location, isViewer, slug]);"""

code = code.replace("        });\n      }\n    }\n  }, [location, isViewer]);", replace_str)
code = code.replace("        });\r\n      }\r\n    }\r\n  }, [location, isViewer]);", replace_str)

with open('d:/Antigravity/Gujarati/src/components/DigitalCard.jsx', 'w', encoding='utf-8') as f:
    f.write(code)
print("Done")
