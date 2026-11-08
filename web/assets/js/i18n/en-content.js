// English translations of the original Vietnamese content (cards, signs, zodiac animals, seed posts…).
// Loaded lazily only when the visitor switches to English. Keyed by the same ids as the Vietnamese data.

const MAJOR = [
  ['The Fool', 'beginnings, freedom, trusting the journey', 'recklessness, fear of starting', 'There is a step you keep postponing only because you are afraid of looking foolish.', 'If no one were watching, what would you try first?'],
  ['The Magician', 'skill, initiative, turning ideas into reality', 'scattered focus, doubting your abilities', 'You hold more in your hands than you think.', 'Name three things you have but have not used yet.'],
  ['The High Priestess', 'intuition, stillness, what is hidden', 'ignoring your inner voice', 'Sometimes the answer is already waiting in silence.', 'If all the noise stopped, what would you hear yourself wanting?'],
  ['The Empress', 'nurturing, abundance, creativity', 'giving too much, forgetting yourself', 'You care for others so well. What about you?', 'What small thing could nourish you today?'],
  ['The Emperor', 'structure, boundaries, stability', 'rigidity, over-control', 'Steadiness grows from clear boundaries.', 'What do you need to say "no" to in order to protect yourself?'],
  ['The Hierophant', 'tradition, guidance, belief', 'breaking convention, your own path', 'Some lessons from those before us are worth hearing.', 'Which advice you once received do you only now truly understand?'],
  ['The Lovers', 'heart-led choices, connection, values', 'imbalance, choosing out of fear', 'Every choice is a moment of honesty with yourself.', 'Are you choosing from love, or from fear?'],
  ['The Chariot', 'will, determination, moving forward', 'losing direction, pulled many ways', 'You are being pulled in many directions at once.', 'If you kept just one direction this month, what would it be?'],
  ['Strength', 'gentleness, courage, patience', 'self-blame, low confidence', 'True strength is gentleness with what is hard.', 'Which part of you needs comfort rather than criticism?'],
  ['The Hermit', 'reflection, solitude, inner search', 'isolation, avoidance', 'Being alone is not loneliness; it is finding yourself again.', 'When did you last enjoy being on your own?'],
  ['Wheel of Fortune', 'cycles, change, timing', 'resisting change', 'Everything turns, the hard and the good alike.', 'What once felt permanent but has since passed?'],
  ['Justice', 'fairness, truth, responsibility', 'being too hard on yourself', 'Are you harsher with yourself than with others?', 'If your best friend were in your place, what would you tell them?'],
  ['The Hanged Man', 'pause, surrender, a new perspective', 'delay, feeling stuck', 'Stopping is not losing.', 'If you looked at this from the opposite side, what would you see?'],
  ['Transformation', 'endings that make beginnings, renewal', 'clinging to the old', 'Something is ready to be closed. This is not a bad omen — it is a door.', 'What are you ready to let go of?'],
  ['Temperance', 'balance, harmony, enough', 'excess, imbalance', 'Not too much, not too little.', 'What do you have too much of, and what too little?'],
  ['The Devil', 'attachment, habits, temptation', 'breaking free, seeing the chains', 'Some chains we put on ourselves.', 'Which habit is draining your energy?'],
  ['The Tower', 'sudden upheaval, awakening', 'fear of collapse, avoiding the truth', 'Some things fall to open up the sky.', 'What did you learn from a past collapse?'],
  ['The Star', 'hope, healing, peace', 'loss of faith, weariness', 'After the storm there is always a star.', 'What small thing today makes you feel hope?'],
  ['The Moon', 'uncertainty, intuition, hidden fears', 'clarity returning, seeing through illusion', 'Not every darkness is real.', 'Which of your worries are real, and which are imagined?'],
  ['The Sun', 'joy, clarity, vitality', 'joy briefly clouded', 'You are allowed to be happy without a reason.', 'What makes the child in you smile?'],
  ['Judgement', 'awakening, a calling, forgiveness', 'self-judgement, doubt', 'There is a calling you have heard for a long time.', 'Who are you putting off becoming?'],
  ['The World', 'wholeness, completion, integration', 'not yet closed, a missing piece', 'You have come a long way.', 'Name one thing you have achieved that few people know about.'],
];

const SUITS = {
  gay: { name: 'Wands', element: 'Fire', domain: 'passion, action and inspiration' },
  coc: { name: 'Cups', element: 'Water', domain: 'feelings, love and relationships' },
  kiem: { name: 'Swords', element: 'Air', domain: 'thoughts, words and truth' },
  tien: { name: 'Pentacles', element: 'Earth', domain: 'work, money and the body' },
};

const RANKS = [
  ['Ace', 'the seed', 'What seed of {d} is waiting for you to plant it?'],
  ['Two', 'choice and balance', 'Which two things about {d} are you weighing up?'],
  ['Three', 'growth', 'What about {d} is growing inside you?'],
  ['Four', 'stability', 'What about {d} do you need to hold, and what to loosen?'],
  ['Five', 'challenge', 'Which challenge around {d} is teaching you something?'],
  ['Six', 'recovery and harmony', 'What about {d} is slowly healing?'],
  ['Seven', 'reflection and assessment', 'Looking back on {d}, what are you proud of?'],
  ['Eight', 'movement', 'Where are you heading with {d}?'],
  ['Nine', 'almost there', 'What else do you need to finish the last stretch of {d}?'],
  ['Ten', 'completing a cycle', 'Which cycle of {d} is closing?'],
  ['Page', 'the student', 'What would you like to learn about {d}?'],
  ['Knight', 'the doer', 'How are you ready to act for {d}?'],
  ['Queen', 'the nurturer', 'How might you nurture your {d}?'],
  ['King', 'the master', 'What does mastering {d} look like for you?'],
];

const MINOR_KEYS = {
  gay: [
    ['inspiration, fresh start, potential', 'delay, low motivation'],
    ['planning, vision, decisions', 'fear of change, hesitation'],
    ['expansion, looking ahead, awaiting results', 'delays, obstacles'],
    ['celebration, home, harmony', 'instability, a transition period'],
    ['competition, small clashes', 'avoiding conflict, inner tension'],
    ['victory, recognition', 'self-doubt, longing to be seen'],
    ['standing your ground, defending your beliefs', 'exhaustion, wanting to give up'],
    ['speed, news, everything in motion', 'slowing down, misplaced haste'],
    ['resilience, one last push', 'weariness, over-defensiveness'],
    ['burden, carrying too much', 'putting some down, asking for help'],
    ['curiosity, exploration, new ideas', 'lack of direction, restlessness'],
    ['enthusiasm, adventure, daring', 'impulsiveness, haste'],
    ['confidence, warmth, decisiveness', 'low confidence, comparison'],
    ['leadership, vision, inspiring others', 'domineering, expectations too high'],
  ],
  coc: [
    ['new feelings, overflowing emotion', 'holding feelings back'],
    ['connection, attunement, partnership', 'imbalance in a relationship'],
    ['friendship, celebration, community', 'distance from friends, overindulgence'],
    ['apathy, contemplation, boredom', 'noticing a new opportunity'],
    ['loss, regret', 'acceptance, moving on'],
    ['nostalgia, childhood, innocence', 'stuck in the past'],
    ['many options, daydreams', 'seeing clearly, daring to choose'],
    ['leaving to seek deeper meaning', 'fear of leaving, hesitation'],
    ['contentment, a wish come true', 'shallow satisfaction'],
    ['family happiness, fulfilment', 'rifts, mismatched expectations'],
    ['sensitivity, creativity, a loving message', 'emotional immaturity'],
    ['romance, following ideals', 'illusion, moodiness'],
    ['empathy, intuition, listening', 'losing yourself for others'],
    ['emotional balance, generosity', 'repression, hard to open up'],
  ],
  kiem: [
    ['clarity, truth, breakthrough', 'confusion, misunderstanding'],
    ['stalemate, a hard choice', 'information overload'],
    ['heartache, hurt', 'recovery, forgiveness'],
    ['rest, recuperation', 'burnout, needing to stop now'],
    ['conflict, winning and losing', 'reconciliation, setting ego aside'],
    ['transition, leaving rough waters', 'still entangled'],
    ['strategy, keeping secrets', 'confession, listening to conscience'],
    ['self-limitation, feeling trapped', 'release, seeing the way out'],
    ['anxiety, sleeplessness, overthinking', 'moving through fear'],
    ['rock bottom, a painful ending', 'rebirth, the only way is up'],
    ['curiosity, observation, eagerness to learn', 'speaking before thinking'],
    ['decisive, quick-witted', 'rash, hurtful words'],
    ['clear, independent, honest', 'cold, closed off'],
    ['reason, fairness, transparency', 'imposing, rigid'],
  ],
  tien: [
    ['new opportunity, a solid start', 'missed chance, not quite prepared'],
    ['juggling, balancing many things', 'overload, disorder'],
    ['collaboration, craft, teamwork', 'poor coordination'],
    ['preserving, security, saving', 'clinging, fear of loss'],
    ['hardship, lack, feeling left out', 'recovery, finding help'],
    ['giving and receiving, generosity', 'dependence, uneven giving'],
    ['patience, waiting for harvest', 'impatience, doubting your effort'],
    ['practice, diligence, attention to detail', 'perfectionism, monotony'],
    ['self-reliance, abundance, rewarding yourself', 'dependence, overworking'],
    ['family, legacy, lasting things', 'financial instability'],
    ['learning, new goals', 'lack of focus'],
    ['steady, reliable, persistent', 'stagnation, rigid routine'],
    ['caring, practical, cosy', 'over-worrying'],
    ['prosperity, stability, thoughtfulness', 'chasing material things'],
  ],
};

const card = {};
MAJOR.forEach(([name, up, rev, msg, q], i) => (card[`major-${String(i).padStart(2, '0')}`] = { name, up, rev, msg, q }));
for (const [suitId, s] of Object.entries(SUITS)) {
  RANKS.forEach(([rank, stage, qTpl], r) => {
    const [up, rev] = MINOR_KEYS[suitId][r];
    card[`${suitId}-${String(r + 1).padStart(2, '0')}`] = {
      name: `${rank} of ${s.name}`,
      up,
      rev,
      msg: `This card speaks of ${s.domain}, at the stage of "${stage}". Element: ${s.element}.`,
      q: qTpl.replace('{d}', s.domain.split(',')[0]),
    };
  });
}

const sign = {
  'bach-duong': { keywords: 'courageous, direct, passionate', light: 'You dare to begin while others are still thinking. Your energy lifts the whole group.', shadow: 'Impatient, quick to flare and quick to cool, hard to wait.', heal: 'When hurt, Aries often dives into action to forget. Let yourself pause. Standing still is not losing.', element: 'Fire', modality: 'Cardinal', ruler: 'Mars' },
  'kim-nguu': { keywords: 'steady, reliable, loves beauty', light: 'You are a solid anchor. You savour simple things: good food, a warm blanket, music.', shadow: 'Stubborn, resistant to change, holding on to safety.', heal: 'Taurus heals through the body: eat slowly, sleep enough, touch nature. Change can come slowly, as long as it comes.', element: 'Earth', modality: 'Fixed', ruler: 'Venus' },
  'song-tu': { keywords: 'curious, flexible, a great communicator', light: 'A quick mind that wants to know everything and gets along with everyone.', shadow: 'Scattered, easily bored, thinking more than feeling.', heal: 'Gemini needs to write things down. When your head gets noisy, pour it onto paper. You do not need to answer every question today.', element: 'Air', modality: 'Mutable', ruler: 'Mercury' },
  'cu-giai': { keywords: 'protective, emotional, devoted', light: 'You are "home" to many people. Strong intuition, long memory, deep love.', shadow: 'Sensitive, quick to retreat into the shell, holding on to the past.', heal: 'Cancer cares for others first. Today, be a home for yourself: cook something, call home.', element: 'Water', modality: 'Cardinal', ruler: 'Moon' },
  'su-tu': { keywords: 'radiant, generous, creative', light: 'You shine naturally. A big, loyal heart that makes others feel seen.', shadow: 'Needs recognition, proud, reluctant to show vulnerability.', heal: 'Leo\'s worth is not in the applause. You are precious even on days nobody notices.', element: 'Fire', modality: 'Fixed', ruler: 'Sun' },
  'xu-nu': { keywords: 'meticulous, thoughtful, helpful', light: 'You notice details others miss and quietly make everything better.', shadow: 'Perfectionist, self-critical, worrying over small things.', heal: 'Dear Virgo, "good enough" is good. Write down three things you did today before thinking of what is left.', element: 'Earth', modality: 'Mutable', ruler: 'Mercury' },
  'thien-binh': { keywords: 'harmonious, graceful, fair', light: 'You have an eye for beauty, listen to both sides and bring people together.', shadow: 'Indecisive, people-pleasing, afraid of conflict.', heal: 'Libra, put yourself on the scales too. Saying "no" once will not tip the world over.', element: 'Air', modality: 'Cardinal', ruler: 'Venus' },
  'bo-cap': { keywords: 'deep, intense, loyal', light: 'You see beneath the surface. Once you trust, you trust completely and go all the way.', shadow: 'Suspicious, secretive, slow to release old wounds.', heal: 'Scorpio is strongest when daring to soften. Forgiveness is not forgetting; it is no longer having to carry it.', element: 'Water', modality: 'Fixed', ruler: 'Pluto · Mars' },
  'nhan-ma': { keywords: 'free, optimistic, adventurous', light: 'You bring laughter and a wide view. You love learning, travelling and big questions.', shadow: 'Commitment-shy, too blunt, hard to follow through.', heal: 'Not every sadness can be outrun with a trip. Sometimes the longest journey is sitting still with yourself.', element: 'Fire', modality: 'Mutable', ruler: 'Jupiter' },
  'ma-ket': { keywords: 'disciplined, responsible, persistent', light: 'You climb step by step and rarely give up. People trust you with hard things.', shadow: 'Strict, overworking, treating rest as laziness.', heal: 'Capricorn, rest is part of the climb. You do not have to earn the right to rest.', element: 'Earth', modality: 'Cardinal', ruler: 'Saturn' },
  'bao-binh': { keywords: 'independent, original, humanitarian', light: 'You think ahead of your time, care about community and do not mind being different.', shadow: 'Emotionally distant, stubborn, hard to get close to.', heal: 'Aquarius loves the whole world but forgets to love itself. Let one person come a little closer.', element: 'Air', modality: 'Fixed', ruler: 'Uranus · Saturn' },
  'song-ngu': { keywords: 'dreamy, empathic, imaginative', light: 'You feel others\' pain and turn emotion into art.', shadow: 'Escaping into dreams, weak boundaries, carrying others\' sadness.', heal: 'Pisces needs boundaries like fish need clean water. Not every sadness you feel is yours.', element: 'Water', modality: 'Mutable', ruler: 'Neptune · Jupiter' },
};

const chi = {
  'ty-chuot': { animal: 'Rat', traits: 'quick, resourceful, thrifty, perceptive', shadow: 'worries ahead, sometimes over-calculates', heal: 'Rats think ten steps ahead. Today, think just one: the next gentle step.' },
  'suu-trau': { animal: 'Buffalo', traits: 'hard-working, patient, reliable, steady', shadow: 'carries everything alone, rarely admits tiredness', heal: 'Even the buffalo needs the yoke taken off. You are allowed to be tired, and to say so.' },
  'dan-ho': { animal: 'Tiger', traits: 'brave, strong, principled, protects the weak', shadow: 'hot-tempered, dislikes being controlled', heal: 'A tiger is strongest not when it roars, but when it rests to recover. Let yourself be still for a while.' },
  'mao-meo': { animal: 'Cat', traits: 'refined, gentle, tactful, loves peace', shadow: 'avoids conflict, easily hurt', heal: 'Cats know how to find a warm patch of sun. So can you: find a safe corner today.' },
  'thin-rong': { animal: 'Dragon', traits: 'confident, energetic, ambitious', shadow: 'expects too much of itself', heal: 'Dragons need not fly every day. Some days, just curl up under the clouds and breathe.' },
  'ty-ran': { animal: 'Snake', traits: 'deep, wise, intuitive, discreet', shadow: 'keeps feelings hidden, slow to trust', heal: 'Snakes shed their skin to grow. Which old skin are you ready to leave behind?' },
  'ngo-ngua': { animal: 'Horse', traits: 'free-spirited, enthusiastic, independent, lively', shadow: 'impatient, easily bored', heal: 'Horses run best after water and rest. Do not forget to stop at the station.' },
  'mui-de': { animal: 'Goat', traits: 'kind, artistic, compassionate', shadow: 'anxious, relies on approval', heal: 'Your gentleness is a gift, not a weakness. Save some of it for yourself.' },
  'than-khi': { animal: 'Monkey', traits: 'clever, funny, creative, adaptable', shadow: 'hides sadness behind laughter', heal: 'You do not always have to be the one making everyone laugh. You are allowed to be sad in front of someone.' },
  'dau-ga': { animal: 'Rooster', traits: 'diligent, frank, neat, punctual', shadow: 'perfectionist, bluntness can hurt', heal: 'The rooster crows on time every morning. But today, you may sleep a little longer.' },
  'tuat-cho': { animal: 'Dog', traits: 'loyal, upright, devoted, protective', shadow: 'worries about others until forgetting itself', heal: 'You always keep watch for others. Today, let someone keep watch for you.' },
  'hoi-lon': { animal: 'Pig', traits: 'gentle, generous, sincere, enjoys life', shadow: 'trusting, finds it hard to say no', heal: 'Your kindness needs a fence. Declining a favour does not make you any less kind.' },
};

const napAm = {
  'Hải Trung Kim': { meaning: 'Gold in the sea' }, 'Lư Trung Hỏa': { meaning: 'Fire in the furnace' }, 'Đại Lâm Mộc': { meaning: 'Wood of the great forest' },
  'Lộ Bàng Thổ': { meaning: 'Earth by the roadside' }, 'Kiếm Phong Kim': { meaning: 'Gold of the sword\'s edge' }, 'Sơn Đầu Hỏa': { meaning: 'Fire on the mountain' },
  'Giản Hạ Thủy': { meaning: 'Water in the ravine' }, 'Thành Đầu Thổ': { meaning: 'Earth on the city wall' }, 'Bạch Lạp Kim': { meaning: 'Gold of the candlestick' },
  'Dương Liễu Mộc': { meaning: 'Willow wood' }, 'Tuyền Trung Thủy': { meaning: 'Water in the spring' }, 'Ốc Thượng Thổ': { meaning: 'Earth on the rooftop' },
  'Tích Lịch Hỏa': { meaning: 'Thunderbolt fire' }, 'Tùng Bách Mộc': { meaning: 'Pine and cypress wood' }, 'Trường Lưu Thủy': { meaning: 'Long-flowing water' },
  'Sa Trung Kim': { meaning: 'Gold in the sand' }, 'Sơn Hạ Hỏa': { meaning: 'Fire beneath the mountain' }, 'Bình Địa Mộc': { meaning: 'Wood of the plains' },
  'Bích Thượng Thổ': { meaning: 'Earth on the wall' }, 'Kim Bạch Kim': { meaning: 'Gold mixed with silver' }, 'Phú Đăng Hỏa': { meaning: 'Lamp flame' },
  'Thiên Hà Thủy': { meaning: 'Water of the heavens' }, 'Đại Trạch Thổ': { meaning: 'Earth of the great marsh' }, 'Thoa Xuyến Kim': { meaning: 'Gold of jewellery' },
  'Tang Đố Mộc': { meaning: 'Mulberry wood' }, 'Đại Khê Thủy': { meaning: 'Water of the great stream' }, 'Sa Trung Thổ': { meaning: 'Sandy earth' },
  'Thiên Thượng Hỏa': { meaning: 'Fire in the sky' }, 'Thạch Lựu Mộc': { meaning: 'Pomegranate wood' }, 'Đại Hải Thủy': { meaning: 'Water of the great ocean' },
};

const hanh = {
  'Kim': { name: 'Metal', tone: 'White, grey, silver', trait: 'Decisive, principled, clear' },
  'Mộc': { name: 'Wood', tone: 'Green', trait: 'Growing, kind, expanding' },
  'Thủy': { name: 'Water', tone: 'Black, blue', trait: 'Flexible, deep, wise' },
  'Hỏa': { name: 'Fire', tone: 'Red, pink, purple', trait: 'Passionate, creative, radiant' },
  'Thổ': { name: 'Earth', tone: 'Yellow, earthy brown', trait: 'Grounded, tolerant, reliable' },
};

const element = {
  'Lửa': { name: 'Fire', desc: 'Action, passion, enthusiasm' },
  'Đất': { name: 'Earth', desc: 'Practical, enduring, steady' },
  'Khí': { name: 'Air', desc: 'Thought, communication, connection' },
  'Nước': { name: 'Water', desc: 'Emotion, intuition, empathy' },
};

const post = {
  'hd-001': { title: 'Drawing The Star after the worst month of my year', body: 'Last month I lost my job, went through a breakup and got sick. Last night I drew a card just for fun and got The Star.\nI don\'t believe a card can change anything. But looking at the woman pouring water under a starry sky, I felt allowed to rest for a moment, allowed to believe things are healing, however slowly.', author: 'Someone in Hanoi' },
  'hd-002': { title: 'The "Death" card is not a bad omen', body: 'Many people panic when they draw card XIII. It actually speaks of transformation: one thing ends so another can begin. Like autumn letting leaves fall so the tree can bud again.\nIf you draw it, ask yourself: "What in my life has expired that I am still holding on to?"', author: 'Reading cards for 6 years' },
  'hd-003': { title: 'As a Capricorn, I am learning to rest', body: 'All my life I thought rest was a reward you earned after finishing everything. But the to-do list never ends.\nThis year I started scheduling rest like I schedule meetings. Strangely, I work better. To any Capricorn reading: you do not have to earn the right to rest.', author: 'Capricorn, 31' },
  'hd-004': { title: 'Year of the Buffalo and never saying I\'m tired', body: 'My mum says Buffalo people are destined to work hard. I don\'t believe in destiny, but I admit I take on too much.\nRecently I tried something: asking someone to help with at least one thing a week. The first time was awkward. By the third, I felt so much lighter. Turns out "hard work" was partly because I never let anyone help.', author: 'Someone born in a Buffalo year' },
  'hd-005': { title: '', body: 'To you who feel lonely: The Hermit in tarot climbs the mountain alone, lamp in hand. He is not lonely. He is finding his way back to himself.\nIf you are alone today, think of it as a trip up the mountain.', author: 'A stranger' },
  'hd-006': { title: 'Mercury retrograde is not an excuse', body: 'Every Mercury retrograde, social media blames it for everything: arguments, lost things, missed appointments.\nI like a different view: it is a reminder to slow down, reread messages before sending, review plans. Astrology is at its best when it helps us live slowly, not when it scares us.', author: 'An Aquarius who loves star maps' },
  'hd-007': { title: 'What is a nạp âm element? A beginner\'s guide', body: 'Each lunar year has a Heavenly Stem and an Earthly Branch, like Bính Ngọ. The 60 combinations form 30 pairs, each with a "nạp âm" element such as Water of the Heavens or Fire in the Furnace.\nIt is how the ancients used images from nature to describe character. Read like a poem, it is far lovelier than read like a sentence.', author: 'The calendar writer' },
  'hd-008': { title: 'I drew the Three of Swords three times in a row — what does it mean?', body: 'I asked about love and this week I got the Three of Swords (a heart pierced by three swords) three times. Has this happened to anyone?\nI know I am sad. Maybe the card is just saying out loud what I have not dared to admit.', author: 'Someone who is sad' },
  'hd-009': { title: '', body: 'To the person who drew the Three of Swords three times: the card is not saying you will hurt forever. It is saying the pain is real and needs to be cried out.\nWhen you are ready, draw one more card and ask: "What do I need to heal?" Change the question, and the card changes too.', author: 'Someone who once drew the Three of Swords' },
  'hd-010': { title: 'A Cancer far from home', body: 'In my fourth year living in Saigon, I still miss home at every meal. Reading about Cancer, I understood why: for a Water sign ruled by the Moon, "home" is not an address but a feeling of belonging.\nNow I make "home" in my rented room: a pot of sour soup every Sunday, a pot of basil by the window.', author: 'A Cancer in Saigon' },
  'hd-011': { title: 'Is your own zodiac year really unlucky?', body: 'Next year is my zodiac year and the whole family keeps telling me to be careful. I am a bit worried. How was your zodiac year?', author: 'Someone approaching their zodiac year' },
  'hd-012': { title: '', body: 'In my zodiac year I changed jobs, moved house and met my current partner. There were big shifts, but shifts are not always bad.\nI think when the elders say "be careful", they mean live more mindfully, not live in fear.', author: 'Someone who has been through it' },
  'hd-013': { title: 'Four of Cups: when everything feels flat', body: 'The Four of Cups shows a person sitting under a tree, arms crossed, looking at three cups, not noticing a hand offering a fourth.\nIt is the card of days when everything feels bland. It does not blame you. It simply reminds you: when you are ready to look up, something new is waiting.', author: 'Reading cards for 6 years' },
  'hd-014': { title: '', body: 'To my fellow Pisces: not every sadness you feel is yours. You soak up other people\'s emotions like a sponge.\nTonight, take a warm shower and imagine the water washing away the feelings that do not belong to you.', author: 'Another Pisces' },
  'hd-015': { title: 'A "two paths" spread when I was torn about quitting', body: 'I laid three cards: staying gave The Hanged Man, leaving gave the Seven of Pentacles, what my heart knows gave The Sun.\nI read it like this: staying means hanging in limbo, leaving needs patience until harvest, and my heart wants to live joyfully. The cards did not decide for me, but they helped me say what I already knew.', author: 'Office worker, 28' },
  'hd-016': { title: 'Sun, Moon, Ascendant: what\'s the difference?', body: 'Your Sun sign (the one you usually mention) is your core nature. Your Moon sign is your inner emotional world, how you need to be loved. Your Ascendant is the first impression others get of you.\nIf you feel you are "not much like your sign", your Moon or Ascendant may be speaking.', author: 'An Aquarius who loves star maps' },
  'hd-017': { title: 'Vietnam has the Cat, China has the Rabbit', body: 'Something I love: in the Vietnamese zodiac, Mão is the Cat, not the Rabbit.\nCat people are described as refined, peace-loving, knowing how to find a warm patch of sun. Today I did exactly that: found a sunny corner and read a book.', author: 'Born in a Quý Mão year' },
  'hd-018': { title: '', body: 'The Strength card does not show a warrior. It shows a woman gently closing a lion\'s mouth.\nIf you are wrestling with yourself today, try gentleness. True strength is gentleness that does not give up.', author: 'A stranger in Huế' },
  'hd-019': { title: 'Is it really hard for Scorpios to forgive?', body: 'I am a Scorpio and this hits painfully close. I remember for a long time when someone hurts me. Has any Scorpio learned how to let go? Please share.', author: 'A November Scorpio' },
  'hd-020': { title: '', body: 'To the Scorpio who asked: it took me three years to understand that forgiveness does not mean going back, nor forgetting.\nForgiveness is putting the weight down, because you deserve to walk lighter. You can forgive and still close the door.', author: 'A Scorpio who has been there' },
  'hd-021': { title: 'At 30, I drew The Fool', body: 'I planned to go back to university at 30 and everyone said it was too late. That day I drew The Fool: someone stepping carelessly by a cliff edge, a small dog trotting behind.\nI chose to read it as "just go, it\'s fine to be a little foolish". Now I\'m a second-year student, the oldest in class, and the happiest.', author: 'A student nearly 30' },
  'hd-022': { title: 'Harmonious trios and opposing fours: not for dividing people', body: 'Harmonious trios (like Monkey, Rat, Dragon) and opposing fours (like Rat, Horse, Cat, Rooster) are how the ancients grouped the 12 animals into matching and "clashing" sets.\nI see many people use them to forbid love. I prefer this view: "clashing" means two different perspectives that need more listening. No couple is born to fail.', author: 'The calendar writer' },
  'hd-023': { title: 'Four of Swords: the card that lets you rest', body: 'A knight lies still in a chapel, three swords on the wall, one beneath him. This is the card of recovery.\nIf you draw it, the universe (or you yourself) is saying: no need to fight today. Sleep.', author: 'Reading cards for 6 years' },
  'hd-024': { title: 'Virgo and the "done" list', body: 'I always write to-do lists, then blame myself for not finishing them. A Pisces friend suggested writing a list of "what I did today" too.\nReading it back after a week, I nearly cried: I had done so much.', author: 'A perfectionist Virgo' },
};

const topic = { 'tarot': { label: 'Tarot' }, 'chiem-tinh': { label: 'Astrology' }, 'tu-vi': { label: 'Tử Vi' } };
const type = {
  'trai-bai': { label: 'Spread' }, 'giai-nghia': { label: 'Meaning' }, 'chia-se': { label: 'Story' }, 'hoi-dap': { label: 'Question' }, 'loi-nhan': { label: 'Note' },
};
const spread = {
  'mot-la': { name: 'One card for today', positions: ['A message for you'] },
  'ba-la': { name: 'Past · Present · Future', positions: ['What has passed', 'What is', 'What may come'] },
  'chua-lanh': { name: 'Healing spread', positions: ['What is hurting you', 'What you can release', 'What nourishes you'] },
  'lua-chon': { name: 'Two paths', positions: ['If you choose A', 'If you choose B', 'What your heart knows'] },
  'celtic-cross': {
    name: 'Celtic Cross (10 cards)',
    positions: ['Your present', 'What challenges you', 'The deep foundation', 'What is passing', 'What you aim for', 'What is approaching', 'How you see yourself', 'Your surroundings', 'Hopes and fears', 'Where the energy is opening'],
  },
};
const hotline = {
  '115': { name: 'Medical emergency', note: 'When life is in immediate danger' },
  '096 306 1414': { name: 'Ngày Mai hotline', note: 'Emotional support for people in crisis' },
  '111': { name: 'National child protection line', note: 'For anyone under 18' },
  'findahelpline': { name: 'Find A Helpline', note: 'Free helplines in over 130 countries' },
};

export default { card, suit: SUITS, sign, chi, napAm, hanh, element, post, topic, type, spread, hotline };
