import json
import random

questions = []
q_count = 31

# Categories
age_groups = [['kids', 'youth', 'adult', 'elder'], ['youth', 'adult', 'elder'], ['adult', 'elder']]

# 1. Math Questions (300 questions)
for _ in range(300):
    a = random.randint(10, 99)
    b = random.randint(10, 99)
    op = random.choice(['+', '-', '*'])
    if op == '+':
        ans = a + b
        q_text = f'{a} અને {b} નો સરવાળો શું થાય?'
    elif op == '-':
        if a < b: a, b = b, a
        ans = a - b
        q_text = f'{a} માંથી {b} બાદ કરતા શું મળે?'
    else:
        a = random.randint(5, 20)
        b = random.randint(5, 20)
        ans = a * b
        q_text = f'{a} અને {b} નો ગુણાકાર કેટલો થાય?'
        
    options = [str(ans), str(ans + random.randint(1, 10)), str(ans - random.randint(1, 10)), str(ans + random.randint(11, 20))]
    random.shuffle(options)
    
    questions.append({
        'id': f'q{q_count}',
        'category': 'ગણિત',
        'difficulty': 'easy' if op in ['+', '-'] else 'medium',
        'ageGroup': age_groups[0] if op == '+' else age_groups[1],
        'question': q_text,
        'options': options,
        'correct': str(ans),
        'explanation': f'સાચો જવાબ {ans} છે.'
    })
    q_count += 1

# 2. State Capitals (28 * 4 = 112 questions)
states = [
    ('ગુજરાત', 'ગાંધીનગર'), ('મહારાષ્ટ્ર', 'મુંબઈ'), ('રાજસ્થાન', 'જયપુર'), ('મધ્ય પ્રદેશ', 'ભોપાલ'), 
    ('ગોવા', 'પણજી'), ('પંજાબ', 'ચંદીગઢ'), ('હરિયાણા', 'ચંદીગઢ'), ('ઉત્તર પ્રદેશ', 'લખનૌ'),
    ('બિહાર', 'પટના'), ('પશ્ચિમ બંગાળ', 'કોલકાતા'), ('આસામ', 'દિસપુર'), ('ઓડિશા', 'ભુવનેશ્વર'),
    ('કર્ણાટક', 'બેંગલુરુ'), ('કેરળ', 'તિરુવનંતપુરમ'), ('તમિલનાડુ', 'ચેન્નઈ'), ('આંધ્ર પ્રદેશ', 'અમરાવતી'),
    ('તેલંગાણા', 'હૈદરાબાદ'), ('છત્તીસગઢ', 'રાયપુર'), ('ઝારખંડ', 'રાંચી'), ('ઉત્તરાખંડ', 'દહેરાદૂન'),
    ('હિમાચલ પ્રદેશ', 'શિમલા'), ('ત્રિપુરા', 'અગરતલા'), ('મેઘાલય', 'શિલોંગ'), ('મણિપુર', 'ઇમ્ફાલ'),
    ('મિઝોરમ', 'આઇઝોલ'), ('નાગાલેન્ડ', 'કોહિમા'), ('સિક્કિમ', 'ગંગટોક'), ('અરુણાચલ પ્રદેશ', 'ઇટાનગર')
]
for state, cap in states:
    opts = [cap]
    while len(opts) < 4:
        opt = random.choice(states)[1]
        if opt not in opts: opts.append(opt)
    random.shuffle(opts)
    
    questions.append({
        'id': f'q{q_count}', 'category': 'ભૂગોળ', 'difficulty': 'easy', 'ageGroup': age_groups[0],
        'question': f'{state} રાજ્યની રાજધાની કઈ છે?', 'options': opts, 'correct': cap,
        'explanation': f'{state} ની રાજધાની {cap} છે.'
    })
    q_count += 1

# 3. Gujarat Districts (33 * 4 = 132 questions)
districts = [
    ('અમદાવાદ', 'અમદાવાદ'), ('અમરેલી', 'અમરેલી'), ('આણંદ', 'આણંદ'), ('અરવલ્લી', 'મોડાસા'),
    ('બનાસકાંઠા', 'પાલનપુર'), ('ભરુચ', 'ભરુચ'), ('ભાવનગર', 'ભાવનગર'), ('બોટાદ', 'બોટાદ'),
    ('છોટાઉદેપુર', 'છોટાઉદેપુર'), ('દાહોદ', 'દાહોદ'), ('ડાંગ', 'આહવા'), ('દેવભૂમિ દ્વારકા', 'ખંભાળિયા'),
    ('ગાંધીનગર', 'ગાંધીનગર'), ('ગીર સોમનાથ', 'વેરાવળ'), ('જામનગર', 'જામનગર'), ('જૂનાગઢ', 'જૂનાગઢ'),
    ('કચ્છ', 'ભુજ'), ('ખેડા', 'નડિયાદ'), ('મહીસાગર', 'લુણાવાડા'), ('મહેસાણા', 'મહેસાણા'),
    ('મોરબી', 'મોરબી'), ('નર્મદા', 'રાજપીપળા'), ('નવસારી', 'નવસારી'), ('પંચમહાલ', 'ગોધરા'),
    ('પાટણ', 'પાટણ'), ('પોરબંદર', 'પોરબંદર'), ('રાજકોટ', 'રાજકોટ'), ('સાબરકાંઠા', 'હિંમતનગર'),
    ('સુરત', 'સુરત'), ('સુરેન્દ્રનગર', 'સુરેન્દ્રનગર'), ('તાપી', 'વ્યારા'), ('વડોદરા', 'વડોદરા'),
    ('વલસાડ', 'વલસાડ')
]
for dist, hq in districts:
    opts = [hq]
    while len(opts) < 4:
        opt = random.choice(districts)[1]
        if opt not in opts: opts.append(opt)
    random.shuffle(opts)
    questions.append({
        'id': f'q{q_count}', 'category': 'ગુજરાત જ્ઞાન', 'difficulty': 'medium', 'ageGroup': age_groups[1],
        'question': f'{dist} જિલ્લાનું મુખ્ય મથક કયું છે?', 'options': opts, 'correct': hq,
        'explanation': f'{dist} જિલ્લાનું મુખ્ય મથક {hq} ખાતે આવેલું છે.'
    })
    q_count += 1

# 4. Number Sequences (200 questions)
for _ in range(200):
    start = random.randint(2, 20)
    step = random.randint(2, 10)
    seq = [start + i*step for i in range(4)]
    ans = seq[-1] + step
    
    opts = [str(ans), str(ans + step), str(ans - step), str(ans + 2*step)]
    opts = list(set(opts))
    while len(opts) < 4:
        opts.append(str(ans + random.randint(1, 5)*step))
    random.shuffle(opts)
    
    questions.append({
        'id': f'q{q_count}', 'category': 'તર્કશાસ્ત્ર', 'difficulty': 'hard', 'ageGroup': age_groups[2],
        'question': f'આ શ્રેણી પૂર્ણ કરો: {seq[0]}, {seq[1]}, {seq[2]}, {seq[3]}, ?', 
        'options': opts, 'correct': str(ans),
        'explanation': f'દરેક સંખ્યામાં {step} ઉમેરવામાં આવેલ છે, તેથી {seq[-1]} + {step} = {ans}.'
    })
    q_count += 1

# 5. Fill remaining with random logic/time to reach exactly 970 questions
while len(questions) < 970:
    days = ['સોમવાર', 'મંગળવાર', 'બુધવાર', 'ગુરુવાર', 'શુક્રવાર', 'શનિવાર', 'રવિવાર']
    d_idx = random.randint(0, 6)
    add = random.randint(1, 20)
    ans_idx = (d_idx + add) % 7
    
    opts = [days[ans_idx]]
    while len(opts) < 4:
        opt = random.choice(days)
        if opt not in opts: opts.append(opt)
    random.shuffle(opts)
    
    questions.append({
        'id': f'q{q_count}', 'category': 'તર્કશાસ્ત્ર', 'difficulty': 'medium', 'ageGroup': age_groups[1],
        'question': f'જો આજે {days[d_idx]} હોય, તો {add} દિવસ પછી કયો વાર હશે?',
        'options': opts, 'correct': days[ans_idx],
        'explanation': f'આજે {days[d_idx]} છે, {add} દિવસ પછી {days[ans_idx]} આવશે.'
    })
    q_count += 1

with open("src/data/quizQuestions.js", "w", encoding="utf-8") as f:
    f.write("export const GENERATED_QUESTIONS = " + json.dumps(questions, ensure_ascii=False, indent=2) + ";\n")
print(f"Generated {len(questions)} questions.")
