import re

with open('d:/Antigravity/Gujarati/src/components/DigitalCard.jsx', 'r', encoding='utf-8') as f:
    code = f.read()

find_str = """  const location = useLocation();
  const navigate = useNavigate();
  const { slug } = useParams();
  const isViewer = location.pathname === '/c' || location.pathname.startsWith('/c/');"""

replace_str = """  const location = useLocation();
  const navigate = useNavigate();
  const { slug } = useParams();
  const isViewer = Boolean(slug) || location.pathname === '/c' || location.pathname.startsWith('/c/');"""

code = code.replace(find_str, replace_str)

# Just in case the previous script also missed replacing 'useParams' completely, let's verify.
if "const { slug } = useParams();" not in code:
    # If slug is missing, it means the previous replace failed.
    code = code.replace(
        "const navigate = useNavigate();\n  const isViewer = location.pathname === '/c' || location.pathname.startsWith('/c/');",
        "const navigate = useNavigate();\n  const { slug } = useParams();\n  const isViewer = Boolean(slug) || location.pathname === '/c' || location.pathname.startsWith('/c/');"
    )

with open('d:/Antigravity/Gujarati/src/components/DigitalCard.jsx', 'w', encoding='utf-8') as f:
    f.write(code)
print("Done")
