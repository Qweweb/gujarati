import re

with open('src/components/RamatoHub.jsx', 'r', encoding='utf-8') as f:
    code = f.read()

to_remove = ['visual_quiz', 'farming', 'rangoli', 'cricket', 'bhajan', 'gram_trivia']

# 1. Remove from ALL_15_GAMES
for game_id in to_remove:
    # Match the entire line in the array
    code = re.sub(r'^\s*\{\s*id:\s*[\'"]' + game_id + r'[\'"].*?\},\n?', '', code, flags=re.MULTILINE)

# 2. Remove from GameWrapper component (e.g. {gameId === 'visual_quiz' && <VisualQuizGame />})
for game_id in to_remove:
    code = re.sub(r'^\s*\{gameId\s*===\s*[\'"]' + game_id + r'[\'"].*?\}\n?', '', code, flags=re.MULTILINE)

# 3. Remove function components
comps = ['VisualQuizGame', 'FarmingGame', 'RangoliGame', 'CricketQuizGame', 'BhajanGame', 'GramTriviaGame']
for comp in comps:
    # Match function Definition() { ... }
    # Using a non-greedy dotall approach that stops at the next function or export
    code = re.sub(r'^function\s+' + comp + r'\b.*?\n\}\n(?=^function|^export|^\/\*|\n\n)', '', code, flags=re.MULTILINE | re.DOTALL)

with open('src/components/RamatoHub.jsx', 'w', encoding='utf-8') as f:
    f.write(code)

print("Cleanup complete.")
