import re

with open('d:/Antigravity/Gujarati/src/components/DigitalCard.jsx', 'r', encoding='utf-8') as f:
    code = f.read()

find_str = """  const location = useLocation();
  const navigate = useNavigate();

  // Route modes check
  const isViewer = location.pathname === '/c' || location.pathname.startsWith('/c/');"""

replace_str = """  const location = useLocation();
  const navigate = useNavigate();
  const { slug } = useParams();

  // Route modes check
  const isViewer = Boolean(slug) || location.pathname === '/c' || location.pathname.startsWith('/c/');"""

code = code.replace(find_str, replace_str)

with open('d:/Antigravity/Gujarati/src/components/DigitalCard.jsx', 'w', encoding='utf-8') as f:
    f.write(code)
print("Done")
