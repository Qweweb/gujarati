import sys

try:
    with open('src/App.jsx', 'r', encoding='utf-8') as f:
        content = f.read()

    # Replace import
    content = content.replace(
        "import StatusGenerator from './components/StatusGenerator';",
        "import StatusGenerator from './components/StatusGenerator';\nimport PostMaker from './components/PostMaker';"
    )
    
    # Add Route
    route_find = '<Route path="/status" element={<StatusGenerator />} />'
    route_replace = '<Route path="/status" element={<StatusGenerator />} />\n                <Route path="/post-maker" element={<FeatureGuard featureKey="post_maker"><PostMaker /></FeatureGuard>} />'
    
    if route_find in content:
        content = content.replace(route_find, route_replace)
        with open('src/App.jsx', 'w', encoding='utf-8') as f:
            f.write(content)
        print("Successfully updated App.jsx")
    else:
        print("Could not find the route in App.jsx.")
        
except Exception as e:
    print("Error:", e)
