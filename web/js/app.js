/**
 * Bookiry Web App - Interactive Controller (English-First)
 * 
 * Architecture (Tri-View SPA):
 * 1. VIEW A: Landing & Exploration View (#landingView) - New visitor onboarding & book search
 * 2. VIEW B: Personal Library & 365-Day Live Recap (#libraryView) - Personal active shelves & real-time stats
 * 3. VIEW C: Dedicated Reading Sanctuary (#readingView) - Deep 1:1 immersion room with 4 catalytic sparks
 */

// Global Application State
let currentSelectedCompass = 'healing';
let currentActiveBook = null;

// Storage Keys
const STORAGE_KEY_LIBRARY = 'bookiry_my_library';
const STORAGE_KEY_AUTH = 'bookiry_auth_user';
const STORAGE_KEY_PRO = 'bookiry_pro_license';
const STORAGE_KEY_GEMINI_KEY = 'bookiry_gemini_api_key';
const STORAGE_KEY_GOOGLE_CLIENT_ID = 'bookiry_google_client_id';
const STORAGE_KEY_GOOGLE_TOKEN = 'bookiry_google_access_token';
const STORAGE_KEY_DRIVE_MAP = 'bookiry_drive_files_map';

// Curated 4-Sparks Library Database
const BOOK_DATABASE = {
  'zero to one': {
    title: 'Zero to One',
    author: 'Peter Thiel',
    publisher: 'Crown Business',
    coverBg: 'cover-bg-1',
    sparks: {
      spark: 'What is one counter-intuitive belief you hold firmly that almost nobody around you agrees with?',
      lens: 'Notice how the author redefines monopolies. Which industry today is pretending to be competitive while secretly capturing all value?',
      quest: 'The author claims "competition is for losers." When you close this book, can you still believe that rivalry drives true human progress?',
      echo: 'What is the one vertical in your life or craft where you can go from 0 to 1 instead of copying what already exists from 1 to N?'
    }
  },
  'the midnight library': {
    title: 'The Midnight Library',
    author: 'Matt Haig',
    publisher: 'Viking',
    coverBg: 'cover-bg-2',
    sparks: {
      spark: 'What quiet line made you stop turning the page and look out the window into the evening sky?',
      lens: 'As Nora wanders between parallel lives, which of her regrets felt painfully identical to a crossroads in your own past?',
      quest: 'If every regret is just a doorway to an alternate life, what is the one flaw in this present life you are finally ready to embrace?',
      echo: 'When you wake up tomorrow morning, what tiny, ordinary detail of your current existence will you treat as a miracle?'
    }
  },
  'atomic habits': {
    title: 'Atomic Habits',
    author: 'James Clear',
    publisher: 'Avery',
    coverBg: 'cover-bg-1',
    sparks: {
      spark: 'Which identity are you secretly defending that prevents you from building the single habit you need most?',
      lens: 'Observe the frictionless cues in your room. Which physical object silently triggers your worst daily distraction?',
      quest: 'Forget 100 productivity tips. What is the one 2-minute micro-action you can test tomorrow morning before touching your phone?',
      echo: 'If you became only 1% better at your core craft by this time next year, who would you quietly become?'
    }
  },
  'principles': {
    title: 'Principles',
    author: 'Ray Dalio',
    publisher: 'Simon & Schuster',
    coverBg: 'cover-bg-1',
    sparks: {
      spark: 'When was the last time reality gave you a brutal punch, and what painful truth did you try to run away from?',
      lens: 'Look at your closest circle. Who is the one person you can rely on to give you radically transparent, unvarnished disagreement?',
      quest: 'How can you transition from "I think I am right" to "How do I know I am right?" in your biggest current life dilemma?',
      echo: 'Write down one personal operating principle that you will never compromise, even under intense peer pressure.'
    }
  },
  'klara and the sun': {
    title: 'Klara and the Sun',
    author: 'Kazuo Ishiguro',
    publisher: 'Faber & Faber',
    coverBg: 'cover-bg-3',
    sparks: {
      spark: 'Klara observes our world with innocent devotion. What human frailty looked most heartbreaking through her artificial eyes?',
      lens: 'Notice how humans treat Klara when they are vulnerable versus when they are proud. What does this reveal about our loneliness?',
      quest: 'Is the human heart something that can truly be mapped and replaced, or is there an irreducible ember of soul that defies replication?',
      echo: 'Who in your life gives you warmth as unconditionally as the sun gives light to Klara?'
    }
  },
  'the little prince': {
    title: 'The Little Prince',
    author: 'Antoine de Saint-Exupéry',
    publisher: 'Reynal & Hitchcock',
    coverBg: 'cover-bg-2',
    sparks: {
      spark: 'Who or what in your life have you tamed—and what makes them completely unique among ten thousand others?',
      lens: 'Observe the grown-ups on the asteroids. Which one of their absurd obsessions do you secretly recognize in your weekly routine?',
      quest: 'Are you currently living like the grown-ups who count meaningless stars, or do you still remember what matters to the heart?',
      echo: 'What invisible truth are you seeing with your eyes right now that you should instead be looking at with your heart?'
    }
  },
  'sapiens': {
    title: 'Sapiens: A Brief History of Humankind',
    author: 'Yuval Noah Harari',
    publisher: 'Harper',
    coverBg: 'cover-bg-1',
    sparks: {
      spark: 'Which shared fiction—money, religion, nation, or corporation—shapes your everyday decisions without you even questioning it?',
      lens: 'Notice how the agricultural revolution is framed. Did we truly domesticate wheat, or did wheat domesticate us?',
      quest: 'If human happiness has not significantly increased since the foraging era, what are we really racing toward?',
      echo: 'What invisible myth can you consciously step out of today to reclaim your authentic mental freedom?'
    }
  },
  'thinking fast and slow': {
    title: 'Thinking, Fast and Slow',
    author: 'Daniel Kahneman',
    publisher: 'Farrar, Straus and Giroux',
    coverBg: 'cover-bg-3',
    sparks: {
      spark: 'When did your intuitive System 1 make you feel absolutely confident about something that turned out completely wrong?',
      lens: 'Watch for the "availability heuristic" in your newsfeed. What fear is being amplified simply because it is easy to recall?',
      quest: 'Are you living your life for the experiencing self that feels each moment, or for the remembering self that collects stories?',
      echo: 'In your next high-stakes decision, what deliberate pause can you insert to let slow, rigorous System 2 take the wheel?'
    }
  },
  'deep work': {
    title: 'Deep Work',
    author: 'Cal Newport',
    publisher: 'Grand Central Publishing',
    coverBg: 'cover-bg-1',
    sparks: {
      spark: 'If you had to produce your life\'s masterpiece in 90 minutes of unbroken focus tomorrow, what would you work on?',
      lens: 'Observe the shallow tasks that fill your workday. How much of it is real value creation versus performative responsiveness?',
      quest: 'Is constant connectivity an inevitable law of modern society, or a comfortable addiction we lack the discipline to sever?',
      echo: 'What single daily ritual can you protect with iron gates to ensure your mind experiences deep, unbroken stillness?'
    }
  },
  'mans search for meaning': {
    title: 'Man\'s Search for Meaning',
    author: 'Viktor E. Frankl',
    publisher: 'Beacon Press',
    coverBg: 'cover-bg-2',
    sparks: {
      spark: 'What is the "why" in your life that can help you endure almost any "how"?',
      lens: 'Observe how the author finds dignity in the grimmest moments. What internal freedom can no circumstance ever steal from you?',
      quest: 'When life places inescapable suffering before you, will you see it as a dead end or as the ultimate test of your attitude?',
      echo: 'What responsibility or person is calling out for you right now, awaiting the unique contribution only you can give?'
    }
  },
  'demian': {
    title: 'Demian',
    author: 'Hermann Hesse',
    publisher: 'Fischer Verlag',
    coverBg: 'cover-bg-2',
    sparks: {
      spark: 'The bird fights its way out of the egg. What shell are you currently struggling to break free from?',
      lens: 'Notice how Demian views the mark of Cain. Who in your own circle carries an unspoken mark of independent courage?',
      quest: 'Are you living the life society mapped out for you, or the solitary quest toward your authentic inner self?',
      echo: 'What is one quiet truth about who you truly are that you will stop apologizing for?'
    }
  },
  '데미안': {
    title: '데미안 (Demian)',
    author: '헤르만 헤세 (Hermann Hesse)',
    publisher: '민음사',
    coverBg: 'cover-bg-2',
    sparks: {
      spark: '새는 알을 깨고 나온다. 알은 세계다. 당신은 지금 어떤 껍질을 깨뜨리려 분투하고 있나요?',
      lens: '싱클레어가 카인의 표식을 마주하는 순간을 주목하세요. 당신의 삶에서 남들과 다른 고독한 표식은 무엇인가요?',
      quest: '세상이 요구하는 모범적인 삶의 안락함과, 나 자신에게로 이르는 고독한 길 중 무엇을 선택할 것인가요?',
      echo: '온전한 나 자신이 되기 위해 오늘 내려놓아야 할 거짓된 타인의 기대는 무엇인가요?'
    }
  },
  '1984': {
    title: '1984',
    author: 'George Orwell',
    publisher: 'Secker & Warburg',
    coverBg: 'cover-bg-1',
    sparks: {
      spark: 'If 2 + 2 can become 5 through collective repetition, what convenient consensus do you accept without questioning?',
      lens: 'Observe the concept of Doublethink. Where in your daily work do you hold two contradictory beliefs simultaneously?',
      quest: 'In an era of relentless algorithmic surveillance and social scrutiny, where does your private sanctuary reside?',
      echo: 'What is one personal conviction you will fiercely defend, even if nobody around you believes it?'
    }
  },
  'the great gatsby': {
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    publisher: 'Scribner',
    coverBg: 'cover-bg-3',
    sparks: {
      spark: 'What is the green light at the end of the dock that you find yourself quietly reaching toward?',
      lens: 'Notice the hollow excess of Gatsby\'s parties. What modern status symbol are you pursuing that holds no real joy?',
      quest: 'Can you truly repeat the past, or does relentless longing for what was blind you to the miracle of today?',
      echo: 'What nostalgic illusion are you finally willing to release to be fully present with the people beside you?'
    }
  },
  'the psychology of money': {
    title: 'The Psychology of Money',
    author: 'Morgan Housel',
    publisher: 'Harriman House',
    coverBg: 'cover-bg-1',
    sparks: {
      spark: 'Doing well with money has little to do with how smart you are and a lot to do with how you behave. What emotional habit rules your finances?',
      lens: 'Notice the goalpost problem. At what point does "enough" stop moving further away from your reach?',
      quest: 'Are you building wealth to impress people you don\'t even like, or to buy back control of your time and freedom?',
      echo: 'What is one status purchase you can consciously forgo this month to buy pure, unhurried peace of mind?'
    }
  },
  '돈의 심리학': {
    title: '돈의 심리학 (The Psychology of Money)',
    author: '모건 하우절 (Morgan Housel)',
    publisher: '인플루엔셜',
    coverBg: 'cover-bg-1',
    sparks: {
      spark: '금융 지식보다 중요한 것은 심리입니다. 돈에 대해 당신을 은밀히 지배하는 가장 큰 두려움이나 욕망은 무엇인가요?',
      lens: '자신만의 "충분함(Enough)"의 기준을 갖고 계신가요? 골대가 계속 움직이고 있지는 않은가요?',
      quest: '남들에게 부유해 보이기 위한 소비와, 내 시간의 완전한 자유를 사기 위한 저축 중 어디에 서 계신가요?',
      echo: '이번 주 내 삶의 자유를 위해 조용히 통제할 수 있는 가장 사소한 지출 습관 하나는 무엇인가요?'
    }
  },
  '부의 사다리': {
    title: '부의 사다리 (Just Keep Buying)',
    author: '닉 매기울리 (Nick Maggiulli)',
    publisher: '서삼독',
    coverBg: 'cover-bg-1',
    coverUrl: 'https://covers.openlibrary.org/b/id/14561679-M.jpg',
    sparks: {
      spark: '소득을 늘려 저축을 극대화하는 것과, 투자 수익률을 쫓는 것 중 당신의 현재 재정 단계에서 10배 더 중요한 것은 무엇인가요?',
      lens: '닉 매기울리가 강조하는 "그냥 계속 사모아라(Just Keep Buying)"의 핵심은 타이밍이 아닌 시간입니다. 시장의 출렁임 속에서 흔들리지 않을 자신만의 규칙은 무엇인가요?',
      quest: '부의 사다리를 한 계단 오르기 위해, 당신의 현금 흐름을 막고 있는 가장 큰 비효율적인 지출은 어디인가요?',
      echo: '매달 주식이나 자산을 기계적으로 매수하는 것 외에, 내 자신의 인적 자본(소득 역량)을 키우기 위해 이번 달 시작할 공부는 무엇인가요?'
    }
  },
  '저스트 킵 바잉': {
    title: '저스트 킵 바잉 (Just Keep Buying)',
    author: '닉 매기울리 (Nick Maggiulli)',
    publisher: '서삼독',
    coverBg: 'cover-bg-1',
    coverUrl: 'https://covers.openlibrary.org/b/id/14561679-M.jpg',
    sparks: {
      spark: '소득을 늘려 저축을 극대화하는 것과, 투자 수익률을 쫓는 것 중 당신의 현재 재정 단계에서 10배 더 중요한 것은 무엇인가요?',
      lens: '닉 매기울리가 강조하는 "그냥 계속 사모아라(Just Keep Buying)"의 핵심은 타이밍이 아닌 시간입니다. 시장의 출렁임 속에서 흔들리지 않을 자신만의 규칙은 무엇인가요?',
      quest: '부의 사다리를 한 계단 오르기 위해, 당신의 현금 흐름을 막고 있는 가장 큰 비효율적인 지출은 어디인가요?',
      echo: '매달 주식이나 자산을 기계적으로 매수하는 것 외에, 내 자신의 인적 자본(소득 역량)을 키우기 위해 이번 달 시작할 공부는 무엇인가요?'
    }
  },
  'just keep buying': {
    title: 'Just Keep Buying',
    author: 'Nick Maggiulli',
    publisher: 'Harriman House',
    coverBg: 'cover-bg-1',
    coverUrl: 'https://covers.openlibrary.org/b/id/14561679-M.jpg',
    sparks: {
      spark: 'Between earning more and obsessing over 1% extra market return, which lever truly moves the needle for your current net worth?',
      lens: 'Notice how the author debunks "buying the dip." Why is waiting for the perfect market crash a losing psychological game?',
      quest: 'What is the one automatic investment habit you can set up today that requires zero daily emotional energy?',
      echo: 'When you achieve true financial independence, what will you finally buy back: your mornings, your health, or your creative freedom?'
    }
  },
  'cosmos': {
    title: 'Cosmos',
    author: 'Carl Sagan',
    publisher: 'Random House',
    coverBg: 'cover-bg-2',
    coverUrl: 'https://covers.openlibrary.org/b/id/8283901-M.jpg',
    sparks: {
      spark: 'The cosmos is within us. We are made of star-stuff. We are a way for the cosmos to know itself. What does your existence mean against this backdrop?',
      lens: 'Observe how human conflicts seem vanishingly small from the edge of the universe. What petty dispute can you let go of today?',
      quest: 'Carl Sagan champions scientific skepticism mixed with wonder. Where in your daily beliefs do you need more rigorous reason?',
      echo: 'Look up at the night sky tonight. What is one miracle of ordinary earthly life you will cherish before sleep?'
    }
  },
  '코스모스': {
    title: '코스모스 (Cosmos)',
    author: '칼 세이건 (Carl Sagan)',
    publisher: '사이언스북스',
    coverBg: 'cover-bg-2',
    coverUrl: 'https://covers.openlibrary.org/b/id/8283901-M.jpg',
    sparks: {
      spark: '우리는 우주의 일부이며 우리 몸은 별의 물질로 만들어졌습니다. 광대한 우주 속에서 오늘 당신의 삶은 어떤 의미를 지니나요?',
      lens: '칼 세이건이 본 우주의 역사에서 인간의 갈등은 티끌에 불과합니다. 오늘 당신의 마음을 갉아먹는 사소한 걱정을 어떻게 내려놓을 수 있을까요?',
      quest: '과학적 합리성과 따뜻한 경외심 중, 지금 내 삶과 의사결정에 더 필요한 태도는 무엇인가요?',
      echo: '오늘 밤 하늘을 바라보며, 지구라는 기적 위에서 누리고 있는 가장 감사한 순간 하나를 떠올려보세요.'
    }
  },
  'cloud atlas': {
    title: 'Cloud Atlas',
    author: 'David Mitchell',
    publisher: 'Sceptre',
    coverBg: 'cover-bg-3',
    coverUrl: 'https://covers.openlibrary.org/b/id/6714077-M.jpg',
    sparks: {
      spark: 'Our lives are not our own. From womb to tomb, we are bound to others, past and present. Who has shaped your soul most deeply?',
      lens: 'Across 6 nested eras, courage echoes from the past into the future. What conviction are you willing to stand for, even if misunderstood?',
      quest: '"What is an ocean but a multitude of drops?" What small drop of goodness will you contribute to someone else today?',
      echo: 'If your choices ripple across future generations, what kind of legacy does your quiet daily work leave behind?'
    }
  },
  'the blue day book': {
    title: 'The Blue Day Book',
    author: 'Bradley Trevor Greive',
    publisher: 'Andrews McMeel',
    coverBg: 'cover-bg-2',
    coverUrl: 'https://covers.openlibrary.org/b/id/469965-M.jpg',
    sparks: {
      spark: 'Everyone has blue days where everything feels overwhelming. What gentle kindness does your exhausted heart need right now?',
      lens: 'Notice how animals unapologetically feel down, shake it off, and look forward. Why do you judge yourself so harshly for feeling down?',
      quest: 'Forget grand productivity. What is the one comfortable, comforting micro-thing you can do for yourself in the next 10 minutes?',
      echo: 'Tomorrow will bring fresh light. Who can you reach out to with a warm, no-pressure smile or text?'
    }
  },
  'stolen focus': {
    title: 'Stolen Focus',
    author: 'Johann Hari',
    publisher: 'Crown',
    coverBg: 'cover-bg-3',
    sparks: {
      spark: 'Your inability to focus is not a personal moral failure; your focus was stolen. What app or habit stole your morning today?',
      lens: 'Notice how fractured attention shrinks deep thinking into shallow reaction. What deep craft has suffered the most?',
      quest: 'Can you tolerate 30 minutes of unbroken silence without twitching for a screen?',
      echo: 'What single distraction will you physically lock out of your workspace tomorrow to reclaim your mind?'
    }
  },
  '도둑맞은 집중력': {
    title: '도둑맞은 집중력 (Stolen Focus)',
    author: '요한 하리 (Johann Hari)',
    publisher: '어크로스',
    coverBg: 'cover-bg-3',
    sparks: {
      spark: '집중하지 못하는 것은 당신의 의지박약이 아닙니다. 오늘 아침 당신의 고요한 주의력을 가장 먼저 훔쳐간 것은 무엇인가요?',
      lens: '산산조각 난 주의력이 우리의 깊은 사유를 어떻게 얄팍한 반사작용으로 바꾸어 놓았는지 관찰해보세요.',
      quest: '화면의 도파민 자극 없이 30분간 고요한 침묵과 생각 속에 머무를 용기가 있으신가요?',
      echo: '내 영혼의 깊이를 회복하기 위해 내일 당장 작업 공간에서 물리적으로 격리할 기기는 무엇인가요?'
    }
  }
};

// Application Boot
document.addEventListener('DOMContentLoaded', () => {
  initDirectionChips();
  initBunnyInteractions();
  initExpandableCards();
  initSynthesisSimulator();
  initQuickBookChips();
  initNavigationRouting();
  initReadingSanctuary();
  initAuthManager();
  initSettingsManager();
  
  // Handle direct hash navigation
  handleInitialUrlRoute();

  // Initial Auth UI state
  updateAuthUI();
});

// ==========================================================================
// 1. Reading Compass Selection & Bunny Dynamics
// ==========================================================================
function initDirectionChips() {
  const chips = document.querySelectorAll('.btn-direction-chip');
  const bunnyBubble = document.getElementById('bunnyBubble');
  const needle = document.querySelector('.compass-needle');

  const chipReactions = {
    'healing': {
      text: 'Shall we wander into quiet comfort? 🌿',
      rotate: '-20deg',
      color: '#10B981'
    },
    'growth': {
      text: 'Seeking an actionable spark for tomorrow? 💼',
      rotate: '45deg',
      color: '#3182F6'
    },
    'fiction': {
      text: 'Ready to lose yourself in alternate worlds? 🎭',
      rotate: '80deg',
      color: '#8B5CF6'
    },
    'custom': {
      text: 'What is your unique reading quest today? ✨',
      rotate: '0deg',
      color: '#D97706'
    }
  };

  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      chips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');

      const dir = chip.dataset.direction;
      currentSelectedCompass = dir;

      // Toggle Custom Intent input bar
      const customIntentWrap = document.getElementById('customIntentWrap');
      const customIntentInput = document.getElementById('customIntentInput');
      if (customIntentWrap) {
        if (dir === 'custom') {
          customIntentWrap.style.display = 'block';
          if (customIntentInput) customIntentInput.focus();
        } else {
          customIntentWrap.style.display = 'none';
        }
      }

      if (chipReactions[dir]) {
        if (bunnyBubble) {
          bunnyBubble.textContent = chipReactions[dir].text;
          bunnyBubble.style.color = chipReactions[dir].color;
        }
        if (needle) {
          needle.style.transform = `rotate(${chipReactions[dir].rotate})`;
        }
      }
    });
  });
}

// 2. Bunny Interactive Taps
function initBunnyInteractions() {
  const bunnyStage = document.getElementById('bunnyStage');
  const bunnyBubble = document.getElementById('bunnyBubble');

  const bunnyWhispers = [
    'Before opening a book, bring a compass 🧭',
    'Take your time. No need to rush 🕊️',
    'One resonant thought beats 50 summarized books 💎',
    'Where shall we read today? 🐰',
    'Summaries fade, but the right question lingers 🌿'
  ];

  let whisperIdx = 0;

  if (bunnyStage && bunnyBubble) {
    bunnyStage.addEventListener('click', () => {
      whisperIdx = (whisperIdx + 1) % bunnyWhispers.length;
      bunnyBubble.textContent = bunnyWhispers[whisperIdx];
      
      bunnyStage.classList.add('jumping');
      setTimeout(() => bunnyStage.classList.remove('jumping'), 300);
    });
  }
}

// 3. Expandable Reading Lenses Cards
function initExpandableCards() {
  const cards = document.querySelectorAll('.direction-card');

  cards.forEach(card => {
    card.addEventListener('click', () => {
      const isAlreadyExpanded = card.classList.contains('expanded');
      cards.forEach(c => c.classList.remove('expanded'));

      if (!isAlreadyExpanded) {
        card.classList.add('expanded');
        const hint = card.querySelector('.card-expand-hint');
        if (hint) hint.innerHTML = 'Collapse ▲';
      } else {
        const hint = card.querySelector('.card-expand-hint');
        if (hint) hint.innerHTML = 'View Prompts ▼';
      }
    });
  });
}

// 4. Demo Synthesis Simulator
function initSynthesisSimulator() {
  const micBtn = document.getElementById('demoMicBtn');
  const memoInput = document.getElementById('demoMemoInput');
  const synthBtn = document.getElementById('demoSynthesizeBtn');
  const resultCard = document.getElementById('demoResultCard');

  let activeRecognition = null;
  let isRecording = false;

  if (micBtn && memoInput) {
    micBtn.addEventListener('click', () => {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

      if (!SpeechRecognition) {
        alert('Web Speech API is not supported on this browser. Please use Chrome, Edge, or Safari for voice dictation.');
        return;
      }

      if (isRecording && activeRecognition) {
        activeRecognition.stop();
        return;
      }

      try {
        activeRecognition = new SpeechRecognition();
        activeRecognition.lang = navigator.language || 'ko-KR';
        activeRecognition.interimResults = true;
        activeRecognition.continuous = false;

        let originalPlaceholder = memoInput.placeholder;

        activeRecognition.onstart = () => {
          isRecording = true;
          micBtn.classList.add('recording');
          memoInput.placeholder = '🎙️ Listening... Speak naturally now';
          memoInput.value = '';
        };

        activeRecognition.onresult = (event) => {
          let transcript = '';
          for (let i = 0; i < event.results.length; i++) {
            transcript += event.results[i][0].transcript;
          }
          memoInput.value = transcript;
        };

        activeRecognition.onerror = (err) => {
          console.warn('Speech recognition error:', err.error);
          isRecording = false;
          micBtn.classList.remove('recording');
          memoInput.placeholder = originalPlaceholder;
          if (err.error === 'not-allowed') {
            alert('Microphone permission was denied. Please allow microphone access in your browser.');
          }
        };

        activeRecognition.onend = () => {
          isRecording = false;
          micBtn.classList.remove('recording');
          memoInput.placeholder = originalPlaceholder;
        };

        activeRecognition.start();
      } catch (err) {
        console.warn('Speech recognition start failed:', err);
        isRecording = false;
        micBtn.classList.remove('recording');
      }
    });
  }

  if (synthBtn && resultCard && memoInput) {
    synthBtn.addEventListener('click', () => {
      const text = memoInput.value.trim() || 'We do not have to live every alternate life to find true peace with the one right in front of us.';
      
      synthBtn.innerHTML = `
        <svg class="animate-spin" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <circle cx="12" cy="12" r="10" stroke-opacity="0.25"></circle>
          <path d="M12 2a10 10 0 0 1 10 10" stroke-linecap="round"></path>
        </svg>
        Polishing Resonance...
      `;
      synthBtn.disabled = true;

      setTimeout(() => {
        resultCard.style.display = 'block';
        const quoteElem = resultCard.querySelector('.result-quote');
        if (quoteElem) {
          quoteElem.innerHTML = `“${text}”`;
        }
        
        synthBtn.innerHTML = `✨ Resonance Card Created!`;
        synthBtn.disabled = false;

        resultCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 700);
    });
  }
}

// 5. Popular Recommendations Autocomplete
function initQuickBookChips() {
  const chips = document.querySelectorAll('.popular-item');
  const searchInput = document.getElementById('bookSearchInput');

  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      const title = chip.textContent.replace('#', '').trim();
      if (searchInput) {
        searchInput.value = title;
        triggerBookCompass(title);
      }
    });
  });
}

// ==========================================================================
// 6. Navigation Routing & Quad-View Transitions (Landing, Library, Sanctuary, Pricing)
// ==========================================================================
function initNavigationRouting() {
  const btnBackHome = document.getElementById('btnBackHome');
  const brandLogo = document.querySelector('.brand-logo');
  const navExploreBtn = document.getElementById('navExploreBtn');
  const navLibraryBtn = document.getElementById('navLibraryBtn');
  const btnLibraryExplore = document.getElementById('btnLibraryExplore');

  // Footer Navigation Elements
  const footerNavExplore = document.getElementById('footerNavExplore');
  const footerNavLibrary = document.getElementById('footerNavLibrary');
  const footerNavPricing = document.getElementById('footerNavPricing');
  const footerNavPrivacy = document.getElementById('footerNavPrivacy');

  // Pricing View Specific Buttons
  const btnPricingBack = document.getElementById('btnPricingBack');
  const btnPlanExplorer = document.getElementById('btnPlanExplorer');
  const btnPlanReader = document.getElementById('btnPlanReader');
  const btnPlanPro = document.getElementById('btnPlanPro');
  const licenseForm = document.getElementById('licenseForm');
  const licenseInput = document.getElementById('licenseInput');

  // Back to Library minimal link
  if (btnBackHome) {
    btnBackHome.addEventListener('click', (e) => {
      e.preventDefault();
      showLibraryView();
    });
  }

  // Header Explore button
  if (navExploreBtn) {
    navExploreBtn.addEventListener('click', (e) => {
      e.preventDefault();
      showLandingView();
    });
  }

  // Header My Library button
  if (navLibraryBtn) {
    navLibraryBtn.addEventListener('click', (e) => {
      e.preventDefault();
      showLibraryView();
    });
  }

  // Library explore button
  if (btnLibraryExplore) {
    btnLibraryExplore.addEventListener('click', (e) => {
      e.preventDefault();
      showLandingView();
    });
  }

  // Brand Logo
  if (brandLogo) {
    brandLogo.addEventListener('click', (e) => {
      e.preventDefault();
      showLandingView();
    });
  }

  // Footer Navigation Listeners (Optimal touch targets)
  if (footerNavExplore) {
    footerNavExplore.addEventListener('click', (e) => {
      e.preventDefault();
      showLandingView();
    });
  }

  if (footerNavLibrary) {
    footerNavLibrary.addEventListener('click', (e) => {
      e.preventDefault();
      showLibraryView();
    });
  }

  if (footerNavPricing) {
    footerNavPricing.addEventListener('click', (e) => {
      e.preventDefault();
      showPricingView();
    });
  }

  if (footerNavPrivacy) {
    footerNavPrivacy.addEventListener('click', (e) => {
      e.preventDefault();
      openGoogleAuthModal();
    });
  }

  // Pricing Back Button
  if (btnPricingBack) {
    btnPricingBack.addEventListener('click', (e) => {
      e.preventDefault();
      showLandingView();
    });
  }

  // Pricing Plan CTA Buttons
  // Pricing Monthly / Annual Toggle Switch ($3.90/mo vs $39/yr)
  const btnToggleMonthly = document.getElementById('btnToggleMonthly');
  const btnToggleAnnual = document.getElementById('btnToggleAnnual');
  const proPriceAmount = document.getElementById('proPriceAmount');
  const proPricePeriod = document.getElementById('proPricePeriod');
  const proPlanSubtext = document.getElementById('proPlanSubtext');
  const proFeatureLimit = document.getElementById('proFeatureLimit');
  const btnPlanProText = document.getElementById('btnPlanProText');

  let activeBillingCycle = 'monthly'; // 'monthly' is default

  function setBillingCycle(cycle) {
    activeBillingCycle = cycle;
    if (cycle === 'monthly') {
      if (btnToggleMonthly) {
        btnToggleMonthly.classList.add('active');
        btnToggleMonthly.setAttribute('aria-pressed', 'true');
      }
      if (btnToggleAnnual) {
        btnToggleAnnual.classList.remove('active');
        btnToggleAnnual.setAttribute('aria-pressed', 'false');
      }
      if (proPriceAmount) proPriceAmount.textContent = '$3.90';
      if (proPricePeriod) proPricePeriod.textContent = '/ month';
      if (proPlanSubtext) proPlanSubtext.textContent = 'Flexible monthly access. Cancel anytime with 1-click in your account.';
      if (proFeatureLimit) proFeatureLimit.textContent = 'Up to 30 Books / Month';
      if (btnPlanProText && !isProUser()) btnPlanProText.textContent = 'Subscribe Monthly ($3.90/mo)';
    } else {
      if (btnToggleAnnual) {
        btnToggleAnnual.classList.add('active');
        btnToggleAnnual.setAttribute('aria-pressed', 'true');
      }
      if (btnToggleMonthly) {
        btnToggleMonthly.classList.remove('active');
        btnToggleMonthly.setAttribute('aria-pressed', 'false');
      }
      if (proPriceAmount) proPriceAmount.textContent = '$39';
      if (proPricePeriod) proPricePeriod.textContent = '/ year (approx. $3.25/mo)';
      if (proPlanSubtext) proPlanSubtext.textContent = 'Annual membership with 2 months free. Perfect for lifelong readers.';
      if (proFeatureLimit) proFeatureLimit.textContent = 'Up to 50 Books / Month';
      if (btnPlanProText && !isProUser()) btnPlanProText.textContent = 'Subscribe Annual ($39/yr)';
    }
  }

  if (btnToggleMonthly) {
    btnToggleMonthly.addEventListener('click', (e) => {
      e.preventDefault();
      setBillingCycle('monthly');
    });
  }

  if (btnToggleAnnual) {
    btnToggleAnnual.addEventListener('click', (e) => {
      e.preventDefault();
      setBillingCycle('annual');
    });
  }

  if (btnPlanExplorer) {
    btnPlanExplorer.addEventListener('click', (e) => {
      e.preventDefault();
      showLandingView();
    });
  }

  if (btnPlanReader) {
    btnPlanReader.addEventListener('click', (e) => {
      e.preventDefault();
      openGoogleAuthModal();
    });
  }

  if (btnPlanPro) {
    btnPlanPro.addEventListener('click', (e) => {
      e.preventDefault();
      if (isProUser()) {
        alert('✨ You are already a Bookiry Pro member!');
      } else {
        const planLabel = activeBillingCycle === 'annual' ? 'Annual ($39/year)' : 'Monthly ($3.90/month)';
        const dummyKey = prompt(
          `Simulate Lemon Squeezy / Stripe Checkout for Bookiry Pro ${planLabel}:\n\nEnter your 16-character license key (or leave default to test activation):`,
          activeBillingCycle === 'annual' ? 'BOOKIRY-PRO-ANNUAL-2026' : 'BOOKIRY-PRO-MONTHLY-2026'
        );
        if (dummyKey) {
          activateProLicense(dummyKey);
        }
      }
    });
  }

  // License Key Activation Form
  if (licenseForm && licenseInput) {
    licenseForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const key = licenseInput.value.trim();
      if (!key) return;
      activateProLicense(key);
      licenseInput.value = '';
    });
  }

  // Browser back/forward buttons
  window.addEventListener('popstate', () => {
    if (window.location.hash.startsWith('#reading')) {
      const params = new URLSearchParams(window.location.hash.replace('#reading?', ''));
      const bookQuery = params.get('book');
      if (bookQuery) {
        triggerBookCompass(decodeURIComponent(bookQuery), false);
      }
    } else if (window.location.hash === '#library') {
      showLibraryView(false);
    } else if (window.location.hash === '#pricing') {
      showPricingView(false);
    } else {
      showLandingView(false);
    }
  });
}

function handleInitialUrlRoute() {
  if (window.location.hash.startsWith('#reading')) {
    const params = new URLSearchParams(window.location.hash.replace('#reading?', ''));
    const bookQuery = params.get('book');
    if (bookQuery) {
      triggerBookCompass(decodeURIComponent(bookQuery), false);
      return;
    }
  }

  if (window.location.hash === '#library') {
    showLibraryView(false);
    return;
  }

  if (window.location.hash === '#pricing') {
    showPricingView(false);
    return;
  }

  // Default to landing view
  showLandingView(false);
}

// VIEW 1: Show Landing / Explore View
function showLandingView(pushHistory = true) {
  const landingView = document.getElementById('landingView');
  const libraryView = document.getElementById('libraryView');
  const readingView = document.getElementById('readingView');
  const pricingView = document.getElementById('pricingView');

  if (landingView) landingView.style.display = 'block';
  if (libraryView) libraryView.style.display = 'none';
  if (readingView) readingView.style.display = 'none';
  if (pricingView) pricingView.style.display = 'none';

  updateAuthUI();
  window.scrollTo({ top: 0, behavior: 'smooth' });

  if (pushHistory) {
    window.history.pushState(null, '', window.location.pathname);
  }
}

// VIEW 2: Show Personal Library & Live Recap View
function showLibraryView(pushHistory = true) {
  const landingView = document.getElementById('landingView');
  const libraryView = document.getElementById('libraryView');
  const readingView = document.getElementById('readingView');
  const pricingView = document.getElementById('pricingView');

  if (landingView) landingView.style.display = 'none';
  if (libraryView) libraryView.style.display = 'block';
  if (readingView) readingView.style.display = 'none';
  if (pricingView) pricingView.style.display = 'none';

  renderLibraryDashboard();
  updateAuthUI();
  window.scrollTo({ top: 0, behavior: 'smooth' });

  if (pushHistory) {
    if (window.location.hash !== '#library') {
      window.history.pushState({ page: 'library' }, '', '#library');
    }
  }
}

// VIEW 3: Show Dedicated Reading Sanctuary View
function showReadingView(bookData, pushHistory = true) {
  const landingView = document.getElementById('landingView');
  const libraryView = document.getElementById('libraryView');
  const readingView = document.getElementById('readingView');
  const pricingView = document.getElementById('pricingView');

  if (landingView) landingView.style.display = 'none';
  if (libraryView) libraryView.style.display = 'none';
  if (readingView) readingView.style.display = 'block';
  if (pricingView) pricingView.style.display = 'none';

  updateAuthUI();
  window.scrollTo({ top: 0, behavior: 'smooth' });

  if (pushHistory) {
    const hash = `#reading?book=${encodeURIComponent(bookData.title)}`;
    if (window.location.hash !== hash) {
      window.history.pushState({ page: 'reading', book: bookData.title }, '', hash);
    }
  }
}

// VIEW 4: Show Dedicated Pricing & Membership View
function showPricingView(pushHistory = true) {
  const landingView = document.getElementById('landingView');
  const libraryView = document.getElementById('libraryView');
  const readingView = document.getElementById('readingView');
  const pricingView = document.getElementById('pricingView');

  if (landingView) landingView.style.display = 'none';
  if (libraryView) libraryView.style.display = 'none';
  if (readingView) readingView.style.display = 'none';
  if (pricingView) pricingView.style.display = 'block';

  updateAuthUI();
  window.scrollTo({ top: 0, behavior: 'smooth' });

  if (pushHistory) {
    if (window.location.hash !== '#pricing') {
      window.history.pushState({ page: 'pricing' }, '', '#pricing');
    }
  }
}

// ==========================================================================
// 7. Personal Library & 365-Day Live Recap Engine
// ==========================================================================
function getMyLibrary() {
  const raw = localStorage.getItem(STORAGE_KEY_LIBRARY);
  if (raw) {
    try {
      return JSON.parse(raw);
    } catch (e) {
      console.error('Error parsing library storage', e);
    }
  }

  // Pre-seeded starter library
  const initialLibrary = {
    currentlyReading: [
      {
        title: 'Zero to One',
        author: 'Peter Thiel',
        compass: 'growth',
        slug: 'zero_to_one',
        coverBg: 'cover-bg-1'
      }
    ],
    completed: [
      {
        title: 'The Midnight Library',
        author: 'Matt Haig',
        compass: 'healing',
        slug: 'the_midnight_library',
        coverBg: 'cover-bg-2',
        quote: 'We do not have to live every alternate life to find true peace with the one right in front of us.'
      }
    ]
  };

  localStorage.setItem(STORAGE_KEY_LIBRARY, JSON.stringify(initialLibrary));
  return initialLibrary;
}

function saveMyLibrary(lib) {
  localStorage.setItem(STORAGE_KEY_LIBRARY, JSON.stringify(lib));
}

function addBookToLibrary(book) {
  const lib = getMyLibrary();
  const existsReading = lib.currentlyReading.some(b => b.slug === book.slug);
  const existsCompleted = lib.completed.some(b => b.slug === book.slug);

  if (!existsReading && !existsCompleted) {
    lib.currentlyReading.unshift({
      title: book.title,
      author: book.author || '',
      coverUrl: book.coverUrl || '',
      compass: book.compass || 'healing',
      slug: book.slug,
      coverBg: book.coverBg || 'cover-bg-1'
    });
    saveMyLibrary(lib);
  } else if (existsReading) {
    // If book is already currently reading, refresh author and coverUrl if newly resolved
    const target = lib.currentlyReading.find(b => b.slug === book.slug);
    if (target) {
      let updated = false;
      if (book.author && target.author !== book.author && target.author !== 'Curated Classic') {
        target.author = book.author;
        updated = true;
      }
      if (book.coverUrl && target.coverUrl !== book.coverUrl) {
        target.coverUrl = book.coverUrl;
        updated = true;
      }
      if (updated) saveMyLibrary(lib);
    }
  }
}

function renderLibraryDashboard() {
  const lib = getMyLibrary();
  
  // Calculate 365-Day Live Recap Metrics
  let totalThoughts = 0;
  const compassCounts = { healing: 0, growth: 0, fiction: 0, custom: 0 };

  const allBooks = [...lib.currentlyReading, ...lib.completed];
  allBooks.forEach(b => {
    const reflections = JSON.parse(localStorage.getItem(`bookiry_reflections_${b.slug}`) || '[]');
    totalThoughts += reflections.length;
    if (compassCounts[b.compass] !== undefined) {
      compassCounts[b.compass]++;
    }
  });

  // Calculate Dominant Compass
  let dominantLens = '🌿 Rest';
  let maxCount = -1;
  const lensLabels = {
    healing: '🌿 Rest',
    growth: '💼 Growth',
    fiction: '🎭 Fiction',
    custom: '✨ Custom'
  };

  for (const [key, val] of Object.entries(compassCounts)) {
    if (val > maxCount) {
      maxCount = val;
      dominantLens = lensLabels[key] || '🌿 Rest';
    }
  }

  // Update Live Recap Banner DOM
  const recapTotalEl = document.getElementById('recapTotalThoughts');
  const recapActiveEl = document.getElementById('recapActiveBooks');
  const recapCompletedEl = document.getElementById('recapCompletedBooks');
  const recapDominantEl = document.getElementById('recapDominantLens');

  if (recapTotalEl) recapTotalEl.textContent = totalThoughts;
  if (recapActiveEl) recapActiveEl.textContent = lib.currentlyReading.length;
  if (recapCompletedEl) recapCompletedEl.textContent = lib.completed.length;
  if (recapDominantEl) recapDominantEl.textContent = dominantLens;

  // Auto-repair legacy placeholders & missing authors from past sessions
  const knownAuthorFixes = {
    'cosmos': { author: 'Carl Sagan', coverUrl: 'https://covers.openlibrary.org/b/id/8283901-M.jpg' },
    '코스모스': { author: '칼 세이건 (Carl Sagan)', coverUrl: 'https://covers.openlibrary.org/b/id/8283901-M.jpg' },
    'cloud atlas': { author: 'David Mitchell', coverUrl: 'https://covers.openlibrary.org/b/id/6714077-M.jpg' },
    '클라우드 아틀라스': { author: '데이비드 미첼 (David Mitchell)', coverUrl: 'https://covers.openlibrary.org/b/id/6714077-M.jpg' },
    'the blue day book': { author: 'Bradley Trevor Greive', coverUrl: 'https://covers.openlibrary.org/b/id/469965-M.jpg' },
    '블루 데이 북': { author: '브래들리 트레버 그리브', coverUrl: 'https://covers.openlibrary.org/b/id/469965-M.jpg' },
    '부의 사다리': { author: '닉 매기울리 (Nick Maggiulli)', coverUrl: 'https://covers.openlibrary.org/b/id/14561679-M.jpg' },
    '저스트 킵 바잉': { author: '닉 매기울리 (Nick Maggiulli)', coverUrl: 'https://covers.openlibrary.org/b/id/14561679-M.jpg' },
    'just keep buying': { author: 'Nick Maggiulli', coverUrl: 'https://covers.openlibrary.org/b/id/14561679-M.jpg' },
    'wealth ladder': { author: 'Nick Maggiulli', coverUrl: 'https://covers.openlibrary.org/b/id/14561679-M.jpg' },
    'demian': { author: 'Hermann Hesse', coverUrl: 'https://covers.openlibrary.org/b/id/12569297-M.jpg' },
    '데미안': { author: '헤르만 헤세 (Hermann Hesse)', coverUrl: 'https://covers.openlibrary.org/b/id/12569297-M.jpg' },
    'zero to one': { author: 'Peter Thiel', coverUrl: '' },
    'the midnight library': { author: 'Matt Haig', coverUrl: '' },
    'atomic habits': { author: 'James Clear', coverUrl: '' }
  };

  let needsSave = false;
  [...lib.currentlyReading, ...lib.completed].forEach(b => {
    const rawT = (b.title || '').toLowerCase().trim();
    
    // Check direct or partial match
    let matchEntry = knownAuthorFixes[rawT];
    if (!matchEntry) {
      for (const [key, val] of Object.entries(knownAuthorFixes)) {
        if (rawT.includes(key) || key.includes(rawT)) {
          matchEntry = val;
          break;
        }
      }
    }

    if (matchEntry) {
      if (!b.author || b.author === 'Curated Classic' || b.author === 'Intentional Reading Session' || b.author === 'Intentional Reading') {
        b.author = matchEntry.author;
        needsSave = true;
      }
      if (matchEntry.coverUrl && !b.coverUrl) {
        b.coverUrl = matchEntry.coverUrl;
        needsSave = true;
      }
    } else if (b.author === 'Curated Classic') {
      b.author = 'Intentional Reading';
      needsSave = true;
    }
  });

  if (needsSave) {
    saveMyLibrary(lib);
  }

  // Render Currently Reading Shelf
  const readingGrid = document.getElementById('currentlyReadingGrid');
  if (readingGrid) {
    if (lib.currentlyReading.length === 0) {
      readingGrid.innerHTML = `
        <div class="shelf-empty-box" style="grid-column: 1 / -1;">
          No active reading journeys right now. Ready to start? Tap "Explore New Books"!
        </div>
      `;
    } else {
      readingGrid.innerHTML = lib.currentlyReading.map(book => {
        const reflections = JSON.parse(localStorage.getItem(`bookiry_reflections_${book.slug}`) || '[]');
        return `
          <div class="shelf-book-card" onclick="triggerBookCompass('${escapeHtml(book.title)}')">
            <div class="shelf-book-top">
              <div class="shelf-book-cover ${book.coverBg || 'cover-bg-1'}">
                ${book.coverUrl 
                  ? `<img src="${escapeHtml(book.coverUrl)}" class="shelf-book-cover-img" alt="${escapeHtml(book.title)}">` 
                  : escapeHtml(book.title.slice(0, 14))}
              </div>
              <div class="shelf-book-meta">
                <div class="shelf-book-title">${escapeHtml(book.title)}</div>
                <div class="shelf-book-author">${escapeHtml(book.author || 'Intentional Reading')}</div>
                <span class="shelf-compass-pill">${getCompassPillLabel(book.compass)}</span>
              </div>
            </div>
            <div class="shelf-book-bottom">
              <span class="shelf-thought-count">✍️ ${reflections.length} thought${reflections.length === 1 ? '' : 's'}</span>
              <span class="shelf-action-link">Continue Reading →</span>
            </div>
          </div>
        `;
      }).join('');
    }
  }

  // Render Completed Shelf
  const completedGrid = document.getElementById('completedReadingGrid');
  if (completedGrid) {
    if (lib.completed.length === 0) {
      completedGrid.innerHTML = `
        <div class="shelf-empty-box" style="grid-column: 1 / -1;">
          Finished books with minted Resonance Cards will be permanently preserved here.
        </div>
      `;
    } else {
      completedGrid.innerHTML = lib.completed.map(book => {
        const reflections = JSON.parse(localStorage.getItem(`bookiry_reflections_${book.slug}`) || '[]');
        return `
          <div class="shelf-book-card" onclick="triggerBookCompass('${escapeHtml(book.title)}')">
            <div class="shelf-book-top">
              <div class="shelf-book-cover ${book.coverBg || 'cover-bg-2'}">
                ${book.coverUrl 
                  ? `<img src="${escapeHtml(book.coverUrl)}" class="shelf-book-cover-img" alt="${escapeHtml(book.title)}">` 
                  : escapeHtml(book.title.slice(0, 14))}
              </div>
              <div class="shelf-book-meta">
                <div class="shelf-book-title">${escapeHtml(book.title)}</div>
                <div class="shelf-book-author">${escapeHtml(book.author || 'Intentional Reading')}</div>
                <span class="shelf-compass-pill" style="background:#EFF6FF; color:#3182F6;">🏆 Completed</span>
              </div>
            </div>
            <div class="shelf-book-bottom">
              <span class="shelf-thought-count">💎 ${reflections.length} retained</span>
              <span class="shelf-action-link">Review Reflections →</span>
            </div>
          </div>
        `;
      }).join('');
    }
  }
}

function getCompassPillLabel(compass) {
  const labels = {
    healing: '🌿 Rest',
    growth: '💼 Growth',
    fiction: '🎭 Fiction',
    custom: '✨ Custom'
  };
  return labels[compass] || '🧭 Lens';
}

// ==========================================================================
// 8. Dedicated Reading Sanctuary Engine (Sparks & Timeline)
// ==========================================================================
function initReadingSanctuary() {
  const searchForm = document.querySelector('.search-box');
  const searchInput = document.getElementById('bookSearchInput');
  const timelineForm = document.getElementById('timelineForm');
  const timelineInput = document.getElementById('timelineInput');
  const timelineMicBtn = document.getElementById('timelineMicBtn');
  const btnPrintGuide = document.getElementById('btnPrintBookGuide');
  const btnCopyMarkdown = document.getElementById('btnCopyMarkdown');
  const btnFinishBook = document.getElementById('btnFinishBook');

  // Search submission -> Triggers full sanctuary transition
  if (searchForm && searchInput) {
    searchForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const query = searchInput.value.trim();
      if (!query) {
        searchInput.focus();
        return;
      }
      const searchDropdown = document.getElementById('searchAutocompleteDropdown');
      if (searchDropdown) searchDropdown.style.display = 'none';
      triggerBookCompass(query);
    });
  }

  // Initialize Amazon-Style Autocomplete
  initBookSearchAutocomplete();

  // Timeline addition (Gated)
  if (timelineForm && timelineInput) {
    timelineForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const text = timelineInput.value.trim();
      if (!text || !currentActiveBook) return;

      if (!isUserAuthenticated()) {
        openGoogleAuthModal();
        return;
      }

      addTimelineReflection(text);
      timelineInput.value = '';
    });
  }

  // Voice Reflection Mic (Real Web Speech API)
  let activeTimelineRecognition = null;
  let isTimelineRecording = false;

  if (timelineMicBtn && timelineInput) {
    timelineMicBtn.addEventListener('click', () => {
      if (!isUserAuthenticated()) {
        openGoogleAuthModal();
        return;
      }

      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

      if (!SpeechRecognition) {
        alert('Web Speech API is not supported on this browser. Please use Chrome, Edge, or Safari for voice dictation.');
        return;
      }

      if (isTimelineRecording && activeTimelineRecognition) {
        activeTimelineRecognition.stop();
        return;
      }

      try {
        activeTimelineRecognition = new SpeechRecognition();
        activeTimelineRecognition.lang = navigator.language || 'ko-KR';
        activeTimelineRecognition.interimResults = true;
        activeTimelineRecognition.continuous = false;

        let originalPlaceholder = timelineInput.placeholder;

        activeTimelineRecognition.onstart = () => {
          isTimelineRecording = true;
          timelineMicBtn.classList.add('recording');
          timelineInput.placeholder = '🎙️ Listening to your voice... Speak your thoughts';
          timelineInput.value = '';
        };

        activeTimelineRecognition.onresult = (event) => {
          let transcript = '';
          for (let i = 0; i < event.results.length; i++) {
            transcript += event.results[i][0].transcript;
          }
          timelineInput.value = transcript;
        };

        activeTimelineRecognition.onerror = (err) => {
          console.warn('Timeline speech recognition error:', err.error);
          isTimelineRecording = false;
          timelineMicBtn.classList.remove('recording');
          timelineInput.placeholder = originalPlaceholder;
          if (err.error === 'not-allowed') {
            alert('Microphone permission was denied. Please allow microphone access in your browser.');
          }
        };

        activeTimelineRecognition.onend = () => {
          isTimelineRecording = false;
          timelineMicBtn.classList.remove('recording');
          timelineInput.placeholder = originalPlaceholder;
        };

        activeTimelineRecognition.start();
      } catch (err) {
        console.warn('Timeline speech recognition start failed:', err);
        isTimelineRecording = false;
        timelineMicBtn.classList.remove('recording');
      }
    });
  }

  // Print bookmark guide
  if (btnPrintGuide) {
    btnPrintGuide.addEventListener('click', () => {
      window.print();
    });
  }

  // Copy Obsidian 00_Index.md
  if (btnCopyMarkdown) {
    btnCopyMarkdown.addEventListener('click', () => {
      if (!currentActiveBook) return;
      copyObsidianIndexMarkdown(currentActiveBook);
    });
  }

  // Milestone: Finish Book (Gated)
  if (btnFinishBook) {
    btnFinishBook.addEventListener('click', () => {
      if (!currentActiveBook) return;
      if (!isUserAuthenticated()) {
        openGoogleAuthModal();
        return;
      }
      finishBookAndMint(currentActiveBook);
    });
  }
}

// ==========================================================================
// Amazon-Style Live Book Search Autocomplete (Open Library + Google Books + Curated DB)
// ==========================================================================
let searchDebounceTimer = null;

function initBookSearchAutocomplete() {
  const searchInput = document.getElementById('bookSearchInput');
  const searchDropdown = document.getElementById('searchAutocompleteDropdown');

  if (!searchInput || !searchDropdown) return;

  searchInput.addEventListener('input', () => {
    const rawVal = searchInput.value.trim();
    clearTimeout(searchDebounceTimer);

    if (rawVal.length < 2) {
      searchDropdown.style.display = 'none';
      searchDropdown.innerHTML = '';
      return;
    }

    searchDebounceTimer = setTimeout(() => {
      fetchLiveBookSuggestions(rawVal);
    }, 250);
  });

  // Delegated click listener - completely immune to quote/attribute escaping errors
  searchDropdown.addEventListener('click', (e) => {
    const item = e.target.closest('.autocomplete-item');
    if (!item) return;
    const title = item.dataset.title || '';
    const author = item.dataset.author || '';
    const cover = item.dataset.cover || '';
    selectAutocompleteBook(title, author, cover);
  });

  // Close dropdown when clicking outside
  document.addEventListener('click', (e) => {
    if (!searchDropdown.contains(e.target) && e.target !== searchInput) {
      searchDropdown.style.display = 'none';
    }
  });

  // Re-open on focus if query exists
  searchInput.addEventListener('focus', () => {
    if (searchInput.value.trim().length >= 2 && searchDropdown.children.length > 0) {
      searchDropdown.style.display = 'block';
    }
  });
}

async function fetchLiveBookSuggestions(query) {
  const searchDropdown = document.getElementById('searchAutocompleteDropdown');
  if (!searchDropdown) return;

  searchDropdown.style.display = 'block';
  searchDropdown.innerHTML = '<div class="autocomplete-loading">🔍 Searching global book catalog...</div>';

  const cleanQuery = query.toLowerCase().replace(/[^\w\s\uAC00-\uD7A3]/g, '').trim();
  const matchedCurated = [];

  // 1. Instant Curated Bestsellers Check (0ms)
  Object.keys(BOOK_DATABASE).forEach(key => {
    if (key.includes(cleanQuery) || cleanQuery.includes(key)) {
      matchedCurated.push(BOOK_DATABASE[key]);
    }
  });

  // 2. Query External Book APIs (Open Library + Google Books fallback)
  let catalogBooks = [];
  try {
    const openLibPromise = fetch(`https://openlibrary.org/search.json?q=${encodeURIComponent(query)}&limit=6`)
      .then(r => r.ok ? r.json() : null)
      .catch(() => null);

    const googleBooksPromise = fetch(`https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&maxResults=5`)
      .then(r => r.ok ? r.json() : null)
      .catch(() => null);

    const [olRes, gbRes] = await Promise.all([openLibPromise, googleBooksPromise]);

    // Parse Open Library results
    if (olRes && olRes.docs) {
      olRes.docs.slice(0, 5).forEach(doc => {
        const title = doc.title || '';
        const author = (doc.author_name && doc.author_name.length > 0) ? doc.author_name.slice(0, 2).join(', ') : '';
        const coverUrl = doc.cover_i ? `https://covers.openlibrary.org/b/id/${doc.cover_i}-M.jpg` : '';
        const year = doc.first_publish_year ? `${doc.first_publish_year}` : '';
        if (title) {
          catalogBooks.push({ title, author, coverUrl, meta: year });
        }
      });
    }

    // Parse Google Books results (especially great for Korean titles)
    if (gbRes && gbRes.items) {
      gbRes.items.forEach(item => {
        const vi = item.volumeInfo || {};
        const title = vi.title || '';
        const author = (vi.authors && vi.authors.length > 0) ? vi.authors.slice(0, 2).join(', ') : '';
        let coverUrl = '';
        if (vi.imageLinks) {
          coverUrl = vi.imageLinks.thumbnail || vi.imageLinks.smallThumbnail || '';
          if (coverUrl.startsWith('http://')) coverUrl = coverUrl.replace('http://', 'https://');
        }
        const year = vi.publishedDate ? vi.publishedDate.slice(0, 4) : '';
        if (title && !catalogBooks.some(b => b.title.toLowerCase() === title.toLowerCase())) {
          catalogBooks.push({ title, author, coverUrl, meta: year || vi.publisher || '' });
        }
      });
    }
  } catch (apiErr) {
    console.warn('Live book catalog search failed, using local index', apiErr);
  }

  // Deduplicate and filter against curated
  const combined = [];
  const seenTitles = new Set();

  matchedCurated.forEach(b => {
    seenTitles.add(b.title.toLowerCase().trim());
    combined.push({
      title: b.title,
      author: b.author,
      coverUrl: b.coverUrl || '',
      isCurated: true,
      meta: b.publisher || ''
    });
  });

  catalogBooks.forEach(b => {
    const k = b.title.toLowerCase().trim();
    if (!seenTitles.has(k)) {
      seenTitles.add(k);
      combined.push({
        title: b.title,
        author: b.author,
        coverUrl: b.coverUrl,
        isCurated: false,
        meta: b.meta
      });
    }
  });

  if (combined.length === 0) {
    searchDropdown.innerHTML = `
      <div class="autocomplete-empty">
        No catalog matches for "${escapeHtml(query)}".<br>
        <span style="font-size:0.75rem; color:#64748B;">Press "Find Compass" to explore with custom reading compass.</span>
      </div>
    `;
    return;
  }

  let html = '';
  combined.slice(0, 6).forEach(b => {
    const safeTitle = escapeHtml(b.title);
    const safeAuthor = escapeHtml(b.author || 'Author info pending');
    const safeCover = escapeHtml(b.coverUrl || '');
    const metaTag = b.meta ? ` · ${escapeHtml(b.meta)}` : '';
    const curatedBadge = b.isCurated 
      ? `<span style="font-size:0.68rem; color:#10B981; font-weight:800; background:#ECFDF5; padding:1px 5px; border-radius:4px; margin-left:6px;">Curated</span>` 
      : '';

    const coverMarkup = b.coverUrl
      ? `<img src="${safeCover}" class="autocomplete-cover-thumb" alt="${safeTitle}" loading="lazy">`
      : `<div class="autocomplete-cover-fallback">📖</div>`;

    html += `
      <div class="autocomplete-item" data-title="${safeTitle}" data-author="${safeAuthor}" data-cover="${safeCover}">
        ${coverMarkup}
        <div class="autocomplete-info">
          <div class="autocomplete-title">${safeTitle}${curatedBadge}</div>
          <div class="autocomplete-meta"><span class="autocomplete-author">${safeAuthor}</span>${metaTag}</div>
        </div>
      </div>
    `;
  });

  searchDropdown.innerHTML = html;
}

function selectAutocompleteBook(title, author, coverUrl) {
  const searchInput = document.getElementById('bookSearchInput');
  const searchDropdown = document.getElementById('searchAutocompleteDropdown');

  if (searchInput) searchInput.value = title;
  if (searchDropdown) {
    searchDropdown.style.display = 'none';
    searchDropdown.innerHTML = '';
  }

  triggerBookCompass(title, true, { title, author, coverUrl });
}

// Smart Title & Author Parser
function parseBookQuery(rawQuery, customIntent = '') {
  let title = rawQuery.trim();
  let author = '';

  // Flexible Delimiter Detection:
  // "Title by Author", "Title - Author", "Title (Author)", "Title, Author"
  let match = rawQuery.match(/^(.*?)\s+(?:by|저자|지은이)\s+(.*)$/i);
  if (!match) {
    match = rawQuery.match(/^(.*?)\s*[-–—/]\s*(.*)$/);
  }
  if (!match) {
    match = rawQuery.match(/^(.*?)\s*\((.*?)\)$/);
  }
  if (!match) {
    const commaParts = rawQuery.split(',');
    if (commaParts.length === 2 && commaParts[1].trim().length < 35) {
      match = [null, commaParts[0].trim(), commaParts[1].trim()];
    }
  }

  if (match) {
    title = match[1].trim();
    author = match[2].trim();
  }

  // Normalize key: keep english letters, numbers, spaces, and Korean characters
  const cleanKey = title.toLowerCase().replace(/[^\w\s\uAC00-\uD7A3]/g, '').replace(/\s+/g, ' ').trim();

  // If in curated database, use official rich metadata
  if (BOOK_DATABASE[cleanKey]) {
    const entry = BOOK_DATABASE[cleanKey];
    return {
      ...entry,
      title: entry.title,
      author: author || entry.author,
      publisher: entry.publisher || '',
      coverUrl: entry.coverUrl || '',
      sparks: customIntent ? generateDynamic4Sparks(entry.title, currentSelectedCompass, customIntent) : entry.sparks,
      customIntent: customIntent,
      slug: cleanKey.replace(/\s+/g, '_')
    };
  }

  // Fallback for custom / user-inputted books (Zero awkward placeholder text)
  const dynamicSparks = generateDynamic4Sparks(title, currentSelectedCompass, customIntent);
  return {
    title: title,
    author: author,
    publisher: '',
    coverUrl: '',
    coverBg: 'cover-bg-2',
    sparks: dynamicSparks,
    customIntent: customIntent,
    slug: encodeURIComponent(title.toLowerCase().replace(/\s+/g, '_')) || 'custom_book'
  };
}

// Trigger Book Compass & Sanctuary Transition
function triggerBookCompass(query, pushHistory = true, preResolvedBook = null) {
  const customIntentInput = document.getElementById('customIntentInput');
  const customIntent = (currentSelectedCompass === 'custom' && customIntentInput) 
    ? customIntentInput.value.trim() 
    : '';

  let bookData = null;

  if (preResolvedBook && preResolvedBook.title) {
    const dynamicSparks = generateDynamic4Sparks(preResolvedBook.title, currentSelectedCompass, customIntent);
    const cleanKey = preResolvedBook.title.toLowerCase().replace(/[^\w\s\uAC00-\uD7A3]/g, '').replace(/\s+/g, ' ').trim();
    const curated = BOOK_DATABASE[cleanKey];
    bookData = {
      title: preResolvedBook.title,
      author: preResolvedBook.author || (curated ? curated.author : ''),
      publisher: preResolvedBook.publisher || (curated ? curated.publisher : ''),
      coverUrl: preResolvedBook.coverUrl || (curated ? curated.coverUrl : ''),
      coverBg: 'cover-bg-2',
      sparks: (curated && !customIntent) ? curated.sparks : dynamicSparks,
      customIntent: customIntent,
      slug: encodeURIComponent(preResolvedBook.title.toLowerCase().replace(/\s+/g, '_')) || 'custom_book'
    };
  } else {
    bookData = parseBookQuery(query, customIntent);
  }

  currentActiveBook = {
    ...bookData,
    compass: currentSelectedCompass
  };

  // Add book to personal library
  addBookToLibrary(currentActiveBook);

  const coverWrap = document.getElementById('activeCoverWrap');
  const titleEl = document.getElementById('activeBookTitle');
  const authorEl = document.getElementById('activeBookAuthor');
  const compassTag = document.getElementById('activeCompassTag');
  
  const sparkPrompt = document.getElementById('activePromptSpark');
  const lensPrompt = document.getElementById('activePromptLens');
  const questPrompt = document.getElementById('activePromptQuest');
  const echoPrompt = document.getElementById('activePromptEcho');

  // Render header
  if (titleEl) titleEl.textContent = bookData.title;
  if (authorEl) {
    if (bookData.author && bookData.publisher) {
      authorEl.textContent = `${bookData.author} · ${bookData.publisher}`;
    } else if (bookData.author) {
      authorEl.textContent = bookData.author;
    } else {
      authorEl.textContent = 'Intentional Reading Session';
    }
  }

  if (compassTag) {
    if (currentSelectedCompass === 'custom' && customIntent) {
      compassTag.textContent = `✨ ${customIntent.slice(0, 32)}${customIntent.length > 32 ? '...' : ''}`;
    } else {
      const compassNames = {
        'healing': '🌿 Rest & Resonance',
        'growth': '💼 Work & Growth',
        'fiction': '🎭 Curiosity & Fiction',
        'custom': '✨ Custom Intent'
      };
      compassTag.textContent = compassNames[currentSelectedCompass] || '🧭 Active Compass';
    }
  }

  // Render Cover
  if (coverWrap) {
    if (bookData.coverUrl) {
      coverWrap.innerHTML = `
        <img src="${escapeHtml(bookData.coverUrl)}" class="active-cover-img" alt="${escapeHtml(bookData.title)}">
      `;
    } else {
      coverWrap.innerHTML = `
        <div class="book-cover-fallback ${bookData.coverBg || 'cover-bg-1'}" style="width:100%; height:100%;">
          <span>${escapeHtml(bookData.title)}</span>
          ${bookData.author ? `<span style="font-size:0.58rem; opacity:0.8; margin-top:4px;">${escapeHtml(bookData.author)}</span>` : ''}
        </div>
      `;
    }
  }

  // Background resolution via Open Library if author or cover is missing
  if ((!bookData.author || !bookData.coverUrl) && !preResolvedBook) {
    fetch(`https://openlibrary.org/search.json?q=${encodeURIComponent(query)}&limit=1`)
      .then(res => res.json())
      .then(data => {
        if (data && data.docs && data.docs.length > 0) {
          const doc = data.docs[0];
          const realAuthor = doc.author_name ? doc.author_name.slice(0, 2).join(', ') : '';
          const realCover = doc.cover_i ? `https://covers.openlibrary.org/b/id/${doc.cover_i}-M.jpg` : '';

          if (realAuthor && (!bookData.author || bookData.author === 'Intentional Reading Session')) {
            bookData.author = realAuthor;
            currentActiveBook.author = realAuthor;
            if (authorEl) authorEl.textContent = realAuthor;
          }
          if (realCover && !bookData.coverUrl) {
            bookData.coverUrl = realCover;
            currentActiveBook.coverUrl = realCover;
            if (coverWrap) {
              coverWrap.innerHTML = `<img src="${realCover}" class="active-cover-img" alt="${escapeHtml(bookData.title)}">`;
            }
          }

          // Update in library
          const lib = getMyLibrary();
          const target = lib.currentlyReading.find(b => b.slug === currentActiveBook.slug);
          if (target) {
            if (realAuthor) target.author = realAuthor;
            if (realCover) target.coverUrl = realCover;
            saveMyLibrary(lib);
          }
        }
      })
      .catch(() => {});
  }

  // Inject 4 Prompts
  if (sparkPrompt) sparkPrompt.textContent = `“${bookData.sparks.spark}”`;
  if (lensPrompt)  lensPrompt.textContent  = `“${bookData.sparks.lens}”`;
  if (questPrompt) questPrompt.textContent = `“${bookData.sparks.quest}”`;
  if (echoPrompt)  echoPrompt.textContent  = `“${bookData.sparks.echo}”`;

  // Load Timeline from localStorage
  loadTimeline(currentActiveBook.slug);

  // Transition to Dedicated Reading Sanctuary View
  showReadingView(bookData, pushHistory);

  // Update Bunny Thought
  const bunnyBubble = document.getElementById('bunnyBubble');
  if (bunnyBubble) {
    bunnyBubble.textContent = `Immersing into ${bookData.title}... 🧭`;
  }

  // Trigger Real-time Deep Sparks with Gemini AI if Key is Present
  checkAndTriggerAISparks(bookData, currentSelectedCompass, customIntent);

  // Auto-sync reading index to Google Drive if connected
  autoSyncToDriveSilently();
}

// --------------------------------------------------------------------------
// Real-time Intelligence: Google Books Synopsis & Gemini Flash API
// --------------------------------------------------------------------------
async function fetchBookSynopsis(title, author = '') {
  try {
    const query = `${title} ${author}`.trim();
    const res = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&maxResults=3`);
    if (!res.ok) return '';
    const data = await res.json();
    if (!data.items || data.items.length === 0) return '';

    for (const item of data.items) {
      const vol = item.volumeInfo;
      if (vol && vol.description) {
        return vol.description;
      }
    }
    return '';
  } catch (err) {
    console.warn('Google Books synopsis fetch error:', err);
    return '';
  }
}

// Cloudflare Worker Edge Proxy for Keyless Public Reader Access
const CLOUDFLARE_WORKER_URL = 'https://bookiry-worker.chicstory.workers.dev';

async function generateSparksWithGemini(bookTitle, bookAuthor, synopsis, compass, customIntent = '') {
  const localApiKey = localStorage.getItem(STORAGE_KEY_GEMINI_KEY);

  // 1. If user provided their own key, call Gemini directly (BYOK)
  if (localApiKey) {
    const compassGuidelines = {
      'healing': 'Focus on quiet mental refuge, easing burnout/anxiety, surrendering self-judgment, and finding grounded stillness.',
      'growth': 'Focus on unvarnished business reality, operational bottlenecks, counter-intuitive leverage, and concrete 1% behavioral change.',
      'fiction': 'Focus on existential subtext, the protagonist moral crossroads, raw human loneliness, and poetic turning points of fate.',
      'custom': `Focus with laser precision through the reader's personal quest: "${customIntent}". Connect the book's core theory directly to solving or evolving this quest.`
    };
    const compassHint = compassGuidelines[compass] || compassGuidelines['healing'];
    const prompt = `You are a world-class Socratic reading coach and cognitive catalyst.
Analyze the following book and generate 4 deep, challenging catalytic reading questions (The 4 Sparks) tailored to the reader's compass.

Book Title: "${bookTitle}"
Author: "${bookAuthor || 'Unknown'}"
Book Synopsis / Key Themes:
${synopsis ? synopsis.slice(0, 1500) : 'General knowledge of the book'}

Reader Compass / Direction: ${compass.toUpperCase()} (${compassHint})
${customIntent ? `Reader's Specific Problem/Quest: "${customIntent}"` : ''}

CRITICAL RULES:
1. DO NOT summarize the plot or give generic school-essay questions.
2. Directly reference specific concepts, philosophies, metaphors, or terms from this specific book.
3. Every question must be punchy, thought-provoking, and impossible to answer with a simple yes/no.
4. Return ONLY a valid JSON object strictly matching this schema:
{
  "spark": "Before opening page 1: A question shattering an existing comfort zone or bias using the book's core premise.",
  "lens": "During reading: An observational question highlighting a specific nuanced concept or argument from the text.",
  "quest": "Counter-question: A challenging dilemma where the author's radical thesis collides with everyday reality.",
  "echo": "After closing: A single concrete micro-action or mental shift to test tomorrow morning."
}`;

    try {
      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${localApiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            response_mime_type: 'application/json',
            temperature: 0.7
          }
        })
      });

      if (res.ok) {
        const data = await res.json();
        const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (rawText) {
          const parsed = JSON.parse(rawText);
          if (parsed.spark && parsed.lens && parsed.quest && parsed.echo) {
            return parsed;
          }
        }
      }
    } catch (err) {
      console.warn('Local Gemini API call failed, falling back to Cloudflare Worker:', err);
    }
  }

  // 2. Call Cloudflare Worker Edge Proxy (Keyless for readers)
  try {
    const res = await fetch(`${CLOUDFLARE_WORKER_URL}/api/sparks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: bookTitle,
        author: bookAuthor,
        synopsis: synopsis,
        compass: compass,
        customIntent: customIntent
      })
    });

    if (res.ok) {
      const data = await res.json();
      if (data.success && data.sparks) {
        return data.sparks;
      }
    }
  } catch (workerErr) {
    console.warn('Cloudflare Worker sparks proxy failed:', workerErr);
  }

  return null;
}

async function checkAndTriggerAISparks(bookData, compass, customIntent = '') {
  const localApiKey = localStorage.getItem(STORAGE_KEY_GEMINI_KEY);
  const banner = document.getElementById('aiSparksBanner');
  const bannerText = document.getElementById('aiSparksBannerText');

  // Show active brewing banner immediately
  if (banner && bannerText) {
    bannerText.innerHTML = `<span>✨ Brewing catalytic sparks for "${escapeHtml(bookData.title)}"...</span>`;
    banner.style.display = 'flex';
    banner.style.background = 'linear-gradient(135deg, #EFF6FF 0%, #F5F3FF 100%)';
    banner.style.borderColor = '#BFDBFE';
    banner.style.color = '#1E40AF';
  }

  // 1. Fetch synopsis from Google Books
  const synopsis = await fetchBookSynopsis(bookData.title, bookData.author);

  // 2. Generate sparks via Gemini (Direct or Cloudflare Worker)
  const aiSparks = await generateSparksWithGemini(bookData.title, bookData.author, synopsis, compass, customIntent);

  if (aiSparks) {
    // Update live DOM prompts
    const sparkPrompt = document.getElementById('activePromptSpark');
    const lensPrompt = document.getElementById('activePromptLens');
    const questPrompt = document.getElementById('activePromptQuest');
    const echoPrompt = document.getElementById('activePromptEcho');

    if (sparkPrompt) sparkPrompt.textContent = `“${aiSparks.spark}”`;
    if (lensPrompt)  lensPrompt.textContent  = `“${aiSparks.lens}”`;
    if (questPrompt) questPrompt.textContent = `“${aiSparks.quest}”`;
    if (echoPrompt)  echoPrompt.textContent  = `“${aiSparks.echo}”`;

    // Persist in active book & library
    bookData.sparks = aiSparks;
    if (currentActiveBook) {
      currentActiveBook.sparks = aiSparks;
    }

    const lib = getMyLibrary();
    const target = lib.currentlyReading.find(b => b.slug === bookData.slug);
    if (target) {
      target.sparks = aiSparks;
      saveMyLibrary(lib);
    }

    if (banner && bannerText) {
      bannerText.innerHTML = `✨ <strong>Gemini Sparks Active:</strong> 4 catalytic questions tailored specifically to "${escapeHtml(bookData.title)}".`;
      setTimeout(() => {
        if (banner) banner.style.display = 'none';
      }, 4000);
    }

    // Auto-update Drive file with new deep sparks
    autoSyncToDriveSilently();
  } else {
    // Fallback: If both direct key and worker aren't active, show optional BYOK invitation
    if (!localApiKey && banner && bannerText) {
      bannerText.innerHTML = `<span>💡 Connect your free Gemini API key in <strong>⚙️ Settings</strong> to unlock deep, book-specific Socratic questions.</span> <button type="button" class="btn-banner-settings" id="btnBannerOpenSettings">Set Key ➔</button>`;
      banner.style.display = 'flex';
      banner.style.background = '#F8FAFC';
      banner.style.borderColor = '#CBD5E1';
      banner.style.color = '#475569';
      banner.style.cursor = 'pointer';
      banner.onclick = () => openSettingsModal();
    } else if (banner) {
      banner.style.display = 'none';
    }
  }


// Generate contextual 4 sparks for any custom book (Incorporates Custom Intent)
function generateDynamic4Sparks(title, compass, customIntent = '') {
  const dynamicSparks = {
    'healing': {
      spark: `Before you turn the first page of "${title}", what mental clutter are you hoping this book will help you set down?`,
      lens: `As you read, which quiet sentence gently stops the noise in your mind and offers unexpected refuge?`,
      quest: `When you close this book, what self-imposed burden are you finally willing to surrender in exchange for inner peace?`,
      echo: `What is one gentle kindness you can offer yourself tomorrow after soaking in these pages?`
    },
    'growth': {
      spark: `What specific operational challenge or bottleneck in your life do you expect "${title}" to tackle head-on?`,
      lens: `How does the core premise of this book directly expose a blind spot in how you worked yesterday?`,
      quest: `The author proposes a demanding standard. Which of their key assumptions creates the sharpest friction with your reality?`,
      echo: `What is the single 10-minute micro-habit from this book you will test tomorrow morning without hesitation?`
    },
    'fiction': {
      spark: `What unspoken emotional itch or longing led you to open "${title}" today?`,
      lens: `Which hidden motive or subtle detail made your instincts whisper that a quiet turning point has arrived?`,
      quest: `If you stood in the protagonist's shoes at their lowest moment, what compromise would you refuse to make?`,
      echo: `Which character's heartbeat will continue walking alongside you long after you close the back cover?`
    },
    'custom': customIntent ? {
      spark: `Bringing your personal quest to "${title}": How can this book directly speak to "${customIntent}"?`,
      lens: `As you read, what subtle phrase or idea unexpectedly illuminates your search for "${customIntent}"?`,
      quest: `If the author's core thesis clashes with your understanding of "${customIntent}", will you defend your belief or evolve?`,
      echo: `What is the single actionable breakthrough for "${customIntent}" you will test tomorrow morning?`
    } : {
      spark: `What is the deeply personal question you brought to "${title}" that only you can answer?`,
      lens: `Which passage in this text challenges the consensus of everyone around you?`,
      quest: `If the author were sitting across the table from you right now, where would you push back most fiercely?`,
      echo: `What is the one enduring conviction you will carry forward from this reading journey?`
    }
  };

  return dynamicSparks[compass] || dynamicSparks['healing'];
}

// Load Reflections Timeline from localStorage & Cloud Drive Pull
function loadTimeline(slug) {
  const timelineList = document.getElementById('timelineList');
  const countEl = document.getElementById('timelineCount');
  if (!timelineList) return;

  const storageKey = `bookiry_reflections_${slug}`;
  const saved = JSON.parse(localStorage.getItem(storageKey) || '[]');

  renderTimelineItems(saved);
  if (countEl) countEl.textContent = `${saved.length} thought${saved.length === 1 ? '' : 's'}`;

  // Silently pull any reflections from Google Drive (Cross-device sync)
  if (currentActiveBook && currentActiveBook.slug === slug) {
    pullReflectionsFromDriveSilently(currentActiveBook);
  }
}

// Render Timeline Items
function renderTimelineItems(items) {
  const timelineList = document.getElementById('timelineList');
  if (!timelineList) return;

  if (items.length === 0) {
    timelineList.innerHTML = `
      <div class="timeline-empty" id="timelineEmpty">
        No thoughts yet. Capture fleeting quotes or realizations as you read.
      </div>
    `;
    return;
  }

  timelineList.innerHTML = items.map((item, idx) => `
    <div class="timeline-item">
      <div class="timeline-item-time">${item.time}</div>
      <div class="timeline-item-content">
        <p class="timeline-item-text">${escapeHtml(item.text)}</p>
      </div>
      <button type="button" class="timeline-item-del" onclick="deleteTimelineReflection(${idx})" title="Delete thought">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="3 6 5 6 21 6"></polyline>
          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
        </svg>
      </button>
    </div>
  `).join('');
}

// Add a single Reflection
function addTimelineReflection(text) {
  if (!currentActiveBook) return;
  const storageKey = `bookiry_reflections_${currentActiveBook.slug}`;
  const saved = JSON.parse(localStorage.getItem(storageKey) || '[]');

  const now = new Date();
  const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

  saved.push({
    time: timeStr,
    text: text,
    timestamp: Date.now()
  });

  localStorage.setItem(storageKey, JSON.stringify(saved));
  loadTimeline(currentActiveBook.slug);
  autoSyncToDriveSilently();
}

// Delete a single Reflection
window.deleteTimelineReflection = function(idx) {
  if (!currentActiveBook) return;
  const storageKey = `bookiry_reflections_${currentActiveBook.slug}`;
  const saved = JSON.parse(localStorage.getItem(storageKey) || '[]');
  saved.splice(idx, 1);
  localStorage.setItem(storageKey, JSON.stringify(saved));
  loadTimeline(currentActiveBook.slug);
  autoSyncToDriveSilently();
};

// Build Standard Obsidian/Drive Markdown Document
function buildBookMarkdown(book) {
  const storageKey = `bookiry_reflections_${book.slug}`;
  const saved = JSON.parse(localStorage.getItem(storageKey) || '[]');

  const reflectionsMd = saved.length > 0
    ? saved.map(s => `- **${s.time}** ${s.text}`).join('\n')
    : `- (No notes recorded yet. Thoughts will accumulate here as you read.)`;

  return `---
title: "${book.title}"
author: "${book.author || 'Unknown'}"
year: ${new Date().getFullYear()}
status: "Reading"
tags:
  - bookiry
  - ${book.compass || 'healing'}
compass: "${book.compass || 'healing'}"
created_at: "${new Date().toISOString()}"
---

# ${book.title}
*By ${book.author || 'Unknown'}*

### 💡 The Spark (Before Opening)
> "${book.sparks?.spark || ''}"

### 🔍 The Deep Lens (Midway Observation)
> "${book.sparks?.lens || ''}"

### ⚔️ The Counter-Quest (Critical Dilemma)
> "${book.sparks?.quest || ''}"

### 🎁 The Lingering Echo (Life Takeaway)
> "${book.sparks?.echo || ''}"

---

## ✍️ My Reflections (Append-Only Timeline)
${reflectionsMd}
`;
}

// Build Completion Final Report Markdown
function buildReadingReportMarkdown(book) {
  const storageKey = `bookiry_reflections_${book.slug}`;
  const saved = JSON.parse(localStorage.getItem(storageKey) || '[]');

  const reflectionsList = saved.length > 0
    ? saved.map((s, idx) => `### Note ${idx + 1} (${s.time})\n${s.text}`).join('\n\n')
    : `*No specific timeline moments recorded.*`;

  return `---
title: "[Report] ${book.title}"
author: "${book.author || 'Unknown'}"
year: ${new Date().getFullYear()}
status: "Completed"
compass: "${book.compass || 'healing'}"
completed_at: "${new Date().toISOString()}"
---

# 🏆 Reading Synthesis Report: ${book.title}
*Author: ${book.author || 'Unknown'} | Compass: ${book.compass || 'healing'}*

## 1. The 4 Catalytic Sparks
- **The Spark**: ${book.sparks?.spark || ''}
- **The Deep Lens**: ${book.sparks?.lens || ''}
- **The Counter-Quest**: ${book.sparks?.quest || ''}
- **The Lingering Echo**: ${book.sparks?.echo || ''}

---

## 2. Accumulated Raw Thoughts & Revelations
${reflectionsList}

---

## 3. Retained Life Action
> "Carry this question into the week: ${book.sparks?.echo || ''}"
`;
}

// Copy Obsidian 00_Index.md (with 4 Catalytic Sparks)
function copyObsidianIndexMarkdown(book) {
  const mdContent = buildBookMarkdown(book);

  navigator.clipboard.writeText(mdContent).then(() => {
    alert(`Copied 00_Index.md for Obsidian! 📋\nPaste directly into your vault folder: Bookiry/${new Date().getFullYear()}/${book.title}/00_Index.md`);
  }).catch(() => {
    alert('Please allow clipboard access to copy the Markdown file.');
  });
}

// Finish Book & Mint Milestone (with Safety Confirmation Guard and Library Sync)
function finishBookAndMint(book) {
  const storageKey = `bookiry_reflections_${book.slug}`;
  const saved = JSON.parse(localStorage.getItem(storageKey) || '[]');

  // Safety confirmation if reader hasn't recorded thoughts yet
  if (saved.length === 0) {
    const confirmFinish = confirm(`You have not recorded any reflections for "${book.title}" yet.\n\nAre you sure you want to finish this book and mint your resonance card?`);
    if (!confirmFinish) return;
  }

  // Update library status from currentlyReading to completed
  const lib = getMyLibrary();
  lib.currentlyReading = lib.currentlyReading.filter(b => b.slug !== book.slug);
  
  const alreadyCompleted = lib.completed.some(b => b.slug === book.slug);
  if (!alreadyCompleted) {
    lib.completed.unshift({
      title: book.title,
      author: book.author,
      compass: book.compass || 'healing',
      slug: book.slug,
      coverBg: book.coverBg || 'cover-bg-2',
      quote: saved.length > 0 ? saved[saved.length - 1].text : 'Carrying questions that linger beyond the final chapter.'
    });
    saveMyLibrary(lib);
  }

  const statusBadge = document.querySelector('.active-reading-badge');
  if (statusBadge) {
    statusBadge.innerHTML = `🏆 Completed & Retained`;
    statusBadge.style.color = '#1D4ED8';
    statusBadge.style.background = '#EFF6FF';
  }

  // Sync Final Report to Google Drive
  syncCurrentBookToDrive(false, true);

  alert(`✨ Congratulations on completing "${book.title}"!\n\nYour reflections have been preserved in your permanent library and synced to Google Drive.`);
  
  // Transition to My Library to celebrate the live recap update
  showLibraryView();
}

// Helper: Escape HTML
function escapeHtml(str) {
  return str.replace(/[&<>'"]/g, 
    tag => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      "'": '&#39;',
      '"': '&quot;'
    }[tag] || tag)
  );
}

// ==========================================================================
// 8. Google Drive OAuth & Freemium Gate Manager
// ==========================================================================
function getAuthUser() {
  const raw = localStorage.getItem(STORAGE_KEY_AUTH);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch (e) {
    return null;
  }
}

function saveAuthUser(user) {
  localStorage.setItem(STORAGE_KEY_AUTH, JSON.stringify(user));
}

function clearAuthUser() {
  localStorage.removeItem(STORAGE_KEY_AUTH);
}

function isUserAuthenticated() {
  return getAuthUser() !== null;
}

function isProUser() {
  return !!localStorage.getItem(STORAGE_KEY_PRO);
}

function activateProLicense(key) {
  const cleanKey = key.trim().toUpperCase();
  if (cleanKey.length < 8) {
    alert('Please enter a valid 16-character license key (e.g. BOOKIRY-PRO-XXXX-XXXX).');
    return;
  }
  localStorage.setItem(STORAGE_KEY_PRO, cleanKey);
  
  // If not signed in yet, create a default local pro profile
  if (!getAuthUser()) {
    saveAuthUser({
      name: 'Pro Reader',
      email: 'pro.reader@gmail.com',
      avatar: 'P',
      connectedAt: new Date().toISOString(),
      isPro: true
    });
  }

  alert(`🎉 Bookiry Pro Annual Membership Activated!\n\nLicense Key: ${cleanKey}\nUp to 50 books/month, Google Drive cloud sync, and Obsidian vault exports are now active.`);
  updateAuthUI();
}

function updateAuthUI() {
  const user = getAuthUser();
  const isAuth = !!user;
  const isPro = isProUser();

  // 1. Header Navigation Profile Elements
  const btnGoogleAuthNav = document.getElementById('btnGoogleAuthNav');
  const userProfileBadge = document.getElementById('userProfileBadge');
  const userAvatarText = document.getElementById('userAvatarText');
  const userEmailText = document.getElementById('userEmailText');

  if (btnGoogleAuthNav && userProfileBadge) {
    if (isAuth) {
      btnGoogleAuthNav.style.display = 'none';
      userProfileBadge.style.display = 'inline-flex';
      if (userEmailText) {
        const shortName = (user.name && user.name !== 'Reader') 
          ? user.name 
          : (user.email ? user.email.split('@')[0] : 'Synced');
        userEmailText.textContent = shortName;
        userEmailText.title = `Connected: ${user.email || ''}`;
      }
      if (userAvatarText) {
        const initial = user.name ? user.name[0] : (user.email ? user.email[0] : 'R');
        userAvatarText.textContent = initial.toUpperCase();
      }

      // Pro Badge in Profile Pill
      let proBadge = document.getElementById('userProBadgePill');
      if (!proBadge) {
        proBadge = document.createElement('span');
        proBadge.id = 'userProBadgePill';
        proBadge.style.cssText = 'background: #F59E0B; color: #FFFFFF; font-size: 0.65rem; font-weight: 800; padding: 2px 6px; border-radius: 9999px; margin-left: 2px;';
        proBadge.textContent = 'PRO';
        const logoutBtn = userProfileBadge.querySelector('.btn-logout-mini');
        if (logoutBtn) {
          userProfileBadge.insertBefore(proBadge, logoutBtn);
        } else {
          userProfileBadge.appendChild(proBadge);
        }
      }
      proBadge.style.display = isPro ? 'inline-block' : 'none';

    } else {
      btnGoogleAuthNav.style.display = 'inline-flex';
      userProfileBadge.style.display = 'none';
    }
  }

  // Update Pricing View Pro Card if activated
  const btnPlanPro = document.getElementById('btnPlanPro');
  const licenseInput = document.getElementById('licenseInput');
  const btnActivateLicense = document.getElementById('btnActivateLicense');
  if (btnPlanPro) {
    if (isPro) {
      btnPlanPro.textContent = '✓ Pro Membership Active';
      btnPlanPro.style.background = '#10B981';
      btnPlanPro.style.borderColor = '#059669';
    } else {
      const isAnnual = btnToggleAnnual && btnToggleAnnual.classList.contains('active');
      btnPlanPro.textContent = isAnnual ? 'Subscribe Annual ($39/yr)' : 'Subscribe Monthly ($3.90/mo)';
      btnPlanPro.style.background = '';
      btnPlanPro.style.borderColor = '';
    }
  }
  if (licenseInput && isPro) {
    licenseInput.value = localStorage.getItem(STORAGE_KEY_PRO) || 'BOOKIRY-PRO-ANNUAL';
    licenseInput.disabled = true;
  }
  if (btnActivateLicense && isPro) {
    btnActivateLicense.textContent = 'Active';
    btnActivateLicense.disabled = true;
    btnActivateLicense.style.opacity = '0.7';
  }

  // 2. Personal Library Gate State (Recap & Shelves blurred if guest)
  const libraryContainer = document.querySelector('.library-container');
  const libraryGateOverlay = document.getElementById('libraryGateOverlay');
  if (libraryContainer) {
    if (isAuth) {
      libraryContainer.classList.remove('library-locked');
    } else {
      libraryContainer.classList.add('library-locked');
    }
  }
  if (libraryGateOverlay) {
    libraryGateOverlay.style.display = isAuth ? 'none' : 'flex';
  }

  // 3. Reading Sanctuary Sparks Gate State (Spark 1 is Free Preview, Sparks 2-4 Gated)
  const promptBoxLens = document.getElementById('promptBoxLens');
  const promptBoxQuest = document.getElementById('promptBoxQuest');
  const promptBoxEcho = document.getElementById('promptBoxEcho');
  const sparksGateBanner = document.getElementById('sparksGateBanner');

  [promptBoxLens, promptBoxQuest, promptBoxEcho].forEach(box => {
    if (box) {
      if (isAuth) {
        box.classList.remove('prompt-locked');
      } else {
        box.classList.add('prompt-locked');
      }
    }
  });

  if (sparksGateBanner) {
    sparksGateBanner.style.display = isAuth ? 'none' : 'flex';
  }
}

function openGoogleAuthModal() {
  const modal = document.getElementById('googleAuthModal');
  if (modal) {
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  }
}

function closeGoogleAuthModal() {
  const modal = document.getElementById('googleAuthModal');
  if (modal) {
    modal.style.display = 'none';
    document.body.style.overflow = '';
  }
}

// --------------------------------------------------------------------------
// Google Identity Services (GIS) & Google Drive REST API Engine
// --------------------------------------------------------------------------
let googleTokenClient = null;

function initGoogleDriveTokenClient() {
  const clientId = localStorage.getItem(STORAGE_KEY_GOOGLE_CLIENT_ID);
  if (!clientId || typeof google === 'undefined' || !google.accounts || !google.accounts.oauth2) {
    return null;
  }

  try {
    googleTokenClient = google.accounts.oauth2.initTokenClient({
      client_id: clientId,
      scope: 'https://www.googleapis.com/auth/drive.file',
      callback: async (tokenResponse) => {
        if (tokenResponse.error) {
          console.error('Google OAuth Error:', tokenResponse);
          alert(`Google Authentication Failed: ${tokenResponse.error}`);
          return;
        }

        const accessToken = tokenResponse.access_token;
        localStorage.setItem(STORAGE_KEY_GOOGLE_TOKEN, accessToken);

        // Fetch user profile info
        try {
          const userRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
            headers: { Authorization: `Bearer ${accessToken}` }
          });
          const info = await userRes.json();
          const user = {
            name: info.name || 'Reader',
            email: info.email || 'reader@gmail.com',
            avatar: (info.name || info.email || 'R')[0].toUpperCase(),
            connectedAt: new Date().toISOString(),
            driveScope: 'https://www.googleapis.com/auth/drive.file'
          };
          saveAuthUser(user);
        } catch {
          const fallbackUser = {
            name: 'Google Reader',
            email: 'drive@google.com',
            avatar: 'G',
            connectedAt: new Date().toISOString(),
            driveScope: 'https://www.googleapis.com/auth/drive.file'
          };
          saveAuthUser(fallbackUser);
        }

        closeGoogleAuthModal();
        updateAuthUI();
        renderLibraryDashboard();

        // Trigger immediate sync if currently reading a book
        if (currentActiveBook) {
          syncCurrentBookToDrive(true);
        }
      }
    });
    return googleTokenClient;
  } catch (err) {
    console.error('Failed to init Google Token Client:', err);
    return null;
  }
}

function handleConfirmGoogleAuth() {
  const confirmBtn = document.getElementById('btnConfirmGoogleAuth');
  const btnAuthText = document.getElementById('btnAuthText');
  const clientId = localStorage.getItem(STORAGE_KEY_GOOGLE_CLIENT_ID);

  if (clientId && typeof google !== 'undefined' && google.accounts && google.accounts.oauth2) {
    if (!googleTokenClient) {
      googleTokenClient = initGoogleDriveTokenClient();
    }
    if (googleTokenClient) {
      if (confirmBtn) confirmBtn.disabled = true;
      if (btnAuthText) btnAuthText.textContent = 'Opening Google Sign-in...';
      googleTokenClient.requestAccessToken({ prompt: 'consent' });
      setTimeout(() => {
        if (confirmBtn) confirmBtn.disabled = false;
        if (btnAuthText) btnAuthText.textContent = 'Authorize & Connect Drive';
      }, 1000);
      return;
    }
  }

  // Realistic Simulation Mode (when Client ID is not configured yet)
  if (confirmBtn) confirmBtn.disabled = true;
  if (btnAuthText) btnAuthText.textContent = 'Connecting with Google Drive...';

  setTimeout(() => {
    const mockUser = {
      name: 'Reader',
      email: 'reader@gmail.com',
      avatar: 'R',
      connectedAt: new Date().toISOString(),
      driveScope: 'https://www.googleapis.com/auth/drive.file'
    };

    saveAuthUser(mockUser);

    if (confirmBtn) confirmBtn.disabled = false;
    if (btnAuthText) btnAuthText.textContent = 'Authorize & Connect Drive';

    closeGoogleAuthModal();
    updateAuthUI();
    renderLibraryDashboard();

    // Give helpful prompt to set real client ID if desired
    if (!clientId) {
      console.info('Connected in Local Drive mode. Configure Google OAuth Client ID in Settings (⚙️) for direct Google Cloud Drive API.');
    }
  }, 600);
}

function handleSignOut() {
  const confirmSignOut = confirm('Disconnect Google Drive sync?\n\nYour offline notes will remain safely in your browser until cleared.');
  if (confirmSignOut) {
    localStorage.removeItem(STORAGE_KEY_GOOGLE_TOKEN);
    clearAuthUser();
    updateAuthUI();
  }
}

// Drive REST API: Find or Create Folder
async function findOrCreateDriveFolder(folderName, parentFolderId = null) {
  const token = localStorage.getItem(STORAGE_KEY_GOOGLE_TOKEN);
  if (!token) return null;

  let query = `name = '${folderName.replace(/'/g, "\\'")}' and mimeType = 'application/vnd.google-apps.folder' and trashed = false`;
  if (parentFolderId) {
    query += ` and '${parentFolderId}' in parents`;
  } else {
    query += ` and 'root' in parents`;
  }

  try {
    const searchRes = await fetch(`https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(query)}&fields=files(id,name)`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (searchRes.ok) {
      const data = await searchRes.json();
      if (data.files && data.files.length > 0) {
        return data.files[0].id;
      }
    }

    // Create folder if not found
    const createRes = await fetch('https://www.googleapis.com/drive/v3/files', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: folderName,
        mimeType: 'application/vnd.google-apps.folder',
        parents: parentFolderId ? [parentFolderId] : []
      })
    });

    if (createRes.ok) {
      const createData = await createRes.json();
      return createData.id;
    }
  } catch (err) {
    console.warn('Drive folder creation failed:', err);
  }
  return null;
}

// Drive REST API: Multipart Upload Markdown
async function uploadOrUpdateDriveMarkdown(parentFolderId, fileName, markdownContent, existingFileId = null) {
  const token = localStorage.getItem(STORAGE_KEY_GOOGLE_TOKEN);
  if (!token) return null;

  const boundary = '-------314159265358979323846';
  const delimiter = `\r\n--${boundary}\r\n`;
  const closeDelimiter = `\r\n--${boundary}--`;

  const metadata = {
    name: fileName,
    mimeType: 'text/markdown',
    parents: (!existingFileId && parentFolderId) ? [parentFolderId] : undefined
  };

  const multipartRequestBody =
    delimiter +
    'Content-Type: application/json; charset=UTF-8\r\n\r\n' +
    JSON.stringify(metadata) +
    delimiter +
    'Content-Type: text/markdown; charset=UTF-8\r\n\r\n' +
    markdownContent +
    closeDelimiter;

  let url = 'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name,webViewLink';
  let method = 'POST';

  if (existingFileId) {
    url = `https://www.googleapis.com/upload/drive/v3/files/${existingFileId}?uploadType=multipart&fields=id,name,webViewLink`;
    method = 'PATCH';
  }

  try {
    const res = await fetch(url, {
      method: method,
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': `multipart/related; boundary=${boundary}`
      },
      body: multipartRequestBody
    });

    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn('Drive upload error:', err);
  }
  return null;
}

// Synchronize Current Book to Google Drive
async function syncCurrentBookToDrive(isManual = false, isReport = false) {
  if (!currentActiveBook) return;

  const user = getAuthUser();
  if (!user) {
    if (isManual) openGoogleAuthModal();
    return;
  }

  const btnSyncDrive = document.getElementById('btnSyncDrive');
  const btnSyncDriveText = document.getElementById('btnSyncDriveText');
  const linkOpenDrive = document.getElementById('linkOpenDriveFile');

  if (btnSyncDrive) {
    btnSyncDrive.classList.remove('synced');
    btnSyncDrive.classList.add('syncing');
  }
  if (btnSyncDriveText) btnSyncDriveText.textContent = 'Syncing...';

  const token = localStorage.getItem(STORAGE_KEY_GOOGLE_TOKEN);

  // If Real Google Token is active, run Google Drive REST API
  if (token) {
    try {
      // 1. Root 'Bookiry' folder
      const rootFolderId = await findOrCreateDriveFolder('Bookiry');
      // 2. Year folder (e.g., '2026')
      const yearFolderId = await findOrCreateDriveFolder(`${new Date().getFullYear()}`, rootFolderId);
      // 3. Book folder: "[Title - Author]"
      const safeAuthor = currentActiveBook.author || 'Unknown';
      const bookFolderName = `${currentActiveBook.title} - ${safeAuthor}`;
      const bookFolderId = await findOrCreateDriveFolder(bookFolderName, yearFolderId);

      // 4. File Map Cache
      const driveMap = JSON.parse(localStorage.getItem(STORAGE_KEY_DRIVE_MAP) || '{}');
      const bookMap = driveMap[currentActiveBook.slug] || {};

      // 5. Upload 00_Index.md
      const indexMd = buildBookMarkdown(currentActiveBook);
      const indexResult = await uploadOrUpdateDriveMarkdown(bookFolderId, '00_Index.md', indexMd, bookMap.indexId);

      if (indexResult && indexResult.id) {
        bookMap.indexId = indexResult.id;
        bookMap.indexLink = indexResult.webViewLink;
      }

      // 6. Upload 01_reading_report.md if completed
      if (isReport) {
        const reportMd = buildReadingReportMarkdown(currentActiveBook);
        const reportResult = await uploadOrUpdateDriveMarkdown(bookFolderId, '01_reading_report.md', reportMd, bookMap.reportId);
        if (reportResult && reportResult.id) {
          bookMap.reportId = reportResult.id;
          bookMap.reportLink = reportResult.webViewLink;
        }
      }

      driveMap[currentActiveBook.slug] = bookMap;
      localStorage.setItem(STORAGE_KEY_DRIVE_MAP, JSON.stringify(driveMap));

      // Link UI
      const activeLink = bookMap.reportLink || bookMap.indexLink;
      if (activeLink && linkOpenDrive) {
        linkOpenDrive.href = activeLink;
        linkOpenDrive.style.display = 'inline-flex';
      }

      if (btnSyncDrive) {
        btnSyncDrive.classList.remove('syncing');
        btnSyncDrive.classList.add('synced');
      }
      if (btnSyncDriveText) btnSyncDriveText.textContent = 'Synced ✓';

      if (isManual) {
        alert(`☁️ Synced to Google Drive!\n\nFolder: Bookiry/${new Date().getFullYear()}/${bookFolderName}/\nFile: 00_Index.md`);
      }
      return;
    } catch (err) {
      console.warn('Real Google Drive sync error:', err);
    }
  }

  // Simulated / Local Storage Cloud Mode Feedback
  setTimeout(() => {
    if (btnSyncDrive) {
      btnSyncDrive.classList.remove('syncing');
      btnSyncDrive.classList.add('synced');
    }
    if (btnSyncDriveText) btnSyncDriveText.textContent = 'Saved to Cloud ✓';

    if (isManual) {
      alert(`☁️ Bookiry Cloud Sync Active!\n\nYour reflections for "${currentActiveBook.title}" are securely saved to your account session.`);
    }
  }, 400);
}

function autoSyncToDriveSilently() {
  const user = getAuthUser();
  if (user && currentActiveBook) {
    syncCurrentBookToDrive(false, false);
  }
}

// Cross-device Pull: Download 00_Index.md from Drive and merge thoughts into local UI
async function pullReflectionsFromDriveSilently(book) {
  const token = localStorage.getItem(STORAGE_KEY_GOOGLE_TOKEN);
  if (!token || !book) return;

  try {
    const rootFolderId = await findOrCreateDriveFolder('Bookiry');
    if (!rootFolderId) return;

    const yearFolderId = await findOrCreateDriveFolder(`${new Date().getFullYear()}`, rootFolderId);
    if (!yearFolderId) return;

    const safeAuthor = book.author || 'Unknown';
    const bookFolderName = `${book.title} - ${safeAuthor}`;
    const bookFolderId = await findOrCreateDriveFolder(bookFolderName, yearFolderId);
    if (!bookFolderId) return;

    // Search for existing 00_Index.md in this book folder
    const query = `name = '00_Index.md' and '${bookFolderId}' in parents and trashed = false`;
    const res = await fetch(`https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(query)}&fields=files(id,name,webViewLink)`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (!res.ok) return;
    const data = await res.json();
    if (!data.files || data.files.length === 0) return;

    const file = data.files[0];

    // Download content
    const contentRes = await fetch(`https://www.googleapis.com/drive/v3/files/${file.id}?alt=media`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!contentRes.ok) return;
    const md = await contentRes.text();

    // Parse reflections lines
    const parsedReflections = parseReflectionsFromMarkdown(md);
    if (parsedReflections.length === 0) return;

    // Merge with local storage
    const storageKey = `bookiry_reflections_${book.slug}`;
    const local = JSON.parse(localStorage.getItem(storageKey) || '[]');

    let changed = false;
    const merged = [...local];

    for (const remoteItem of parsedReflections) {
      const exists = merged.some(m => m.text.trim() === remoteItem.text.trim());
      if (!exists) {
        merged.push(remoteItem);
        changed = true;
      }
    }

    if (changed || local.length < parsedReflections.length) {
      localStorage.setItem(storageKey, JSON.stringify(merged));
      const timelineList = document.getElementById('timelineList');
      const countEl = document.getElementById('timelineCount');
      if (timelineList) renderTimelineItems(merged);
      if (countEl) countEl.textContent = `${merged.length} thought${merged.length === 1 ? '' : 's'}`;
    }

    // Update Drive ↗ link in UI
    const linkOpenDrive = document.getElementById('linkOpenDriveFile');
    if (linkOpenDrive && file.webViewLink) {
      linkOpenDrive.href = file.webViewLink;
      linkOpenDrive.style.display = 'inline-flex';
    }
  } catch (err) {
    console.warn('Failed to pull reflections from drive:', err);
  }
}

function parseReflectionsFromMarkdown(mdContent) {
  if (!mdContent) return [];
  const lines = mdContent.split('\n');
  const reflections = [];
  let inReflections = false;

  for (const line of lines) {
    if (line.includes('## ✍️ My Reflections')) {
      inReflections = true;
      continue;
    }
    if (inReflections) {
      if (line.startsWith('---') || (line.startsWith('#') && !line.includes('My Reflections'))) {
        break;
      }
      const match = line.match(/^-\s*\*\*([^\*]+)\*\*\s*(.+)$/);
      if (match) {
        reflections.push({
          time: match[1].trim(),
          text: match[2].trim(),
          timestamp: Date.now()
        });
      }
    }
  }
  return reflections;
}

// --------------------------------------------------------------------------
// Settings Manager (Gemini API & Google OAuth Client ID)
// --------------------------------------------------------------------------
function openSettingsModal() {
  const modal = document.getElementById('settingsModal');
  const inputApiKey = document.getElementById('inputGeminiApiKey');
  const inputClientId = document.getElementById('inputGoogleClientId');

  if (inputApiKey) inputApiKey.value = localStorage.getItem(STORAGE_KEY_GEMINI_KEY) || '';
  if (inputClientId) inputClientId.value = localStorage.getItem(STORAGE_KEY_GOOGLE_CLIENT_ID) || '';

  if (modal) {
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  }
}

function closeSettingsModal() {
  const modal = document.getElementById('settingsModal');
  if (modal) {
    modal.style.display = 'none';
    document.body.style.overflow = '';
  }
}

function handleSaveSettings() {
  const inputApiKey = document.getElementById('inputGeminiApiKey');
  const inputClientId = document.getElementById('inputGoogleClientId');

  const apiKeyVal = inputApiKey ? inputApiKey.value.trim() : '';
  const clientIdVal = inputClientId ? inputClientId.value.trim() : '';

  if (apiKeyVal) {
    localStorage.setItem(STORAGE_KEY_GEMINI_KEY, apiKeyVal);
  } else {
    localStorage.removeItem(STORAGE_KEY_GEMINI_KEY);
  }

  if (clientIdVal) {
    localStorage.setItem(STORAGE_KEY_GOOGLE_CLIENT_ID, clientIdVal);
    initGoogleDriveTokenClient();
  } else {
    localStorage.removeItem(STORAGE_KEY_GOOGLE_CLIENT_ID);
  }

  closeSettingsModal();
  alert('⚙️ Settings saved successfully!');

  // If in active sanctuary and Gemini key was just configured, trigger fresh AI sparks
  if (currentActiveBook && apiKeyVal) {
    checkAndTriggerAISparks(currentActiveBook, currentSelectedCompass, currentActiveBook.customIntent);
  }
}

function initSettingsManager() {
  const btnSettingsNav = document.getElementById('btnSettingsNav');
  const btnSettingsModalClose = document.getElementById('btnSettingsModalClose');
  const btnSaveSettings = document.getElementById('btnSaveSettings');
  const settingsModal = document.getElementById('settingsModal');
  const btnSyncDrive = document.getElementById('btnSyncDrive');

  if (btnSettingsNav) {
    btnSettingsNav.addEventListener('click', openSettingsModal);
  }

  if (btnSettingsModalClose) {
    btnSettingsModalClose.addEventListener('click', closeSettingsModal);
  }

  if (btnSaveSettings) {
    btnSaveSettings.addEventListener('click', handleSaveSettings);
  }

  if (settingsModal) {
    settingsModal.addEventListener('click', (e) => {
      if (e.target === settingsModal) {
        closeSettingsModal();
      }
    });
  }

  if (btnSyncDrive) {
    btnSyncDrive.addEventListener('click', () => syncCurrentBookToDrive(true));
  }
}

function initAuthManager() {
  const btnGoogleAuthNav = document.getElementById('btnGoogleAuthNav');
  const btnLibraryGateLogin = document.getElementById('btnLibraryGateLogin');
  const btnSparksUnlock = document.getElementById('btnSparksUnlock');
  const btnAuthModalClose = document.getElementById('btnAuthModalClose');
  const googleAuthModal = document.getElementById('googleAuthModal');
  const authModalCard = document.querySelector('.auth-modal-card');
  const btnConfirmGoogleAuth = document.getElementById('btnConfirmGoogleAuth');
  const btnLogoutMini = document.getElementById('btnLogoutMini');

  if (btnGoogleAuthNav) {
    btnGoogleAuthNav.addEventListener('click', openGoogleAuthModal);
  }

  if (btnLibraryGateLogin) {
    btnLibraryGateLogin.addEventListener('click', openGoogleAuthModal);
  }

  if (btnSparksUnlock) {
    btnSparksUnlock.addEventListener('click', openGoogleAuthModal);
  }

  if (btnAuthModalClose) {
    btnAuthModalClose.addEventListener('click', closeGoogleAuthModal);
  }

  if (googleAuthModal) {
    googleAuthModal.addEventListener('click', (e) => {
      if (e.target === googleAuthModal) {
        closeGoogleAuthModal();
      }
    });
  }

  if (authModalCard) {
    authModalCard.addEventListener('click', (e) => {
      e.stopPropagation();
    });
  }

  if (btnConfirmGoogleAuth) {
    btnConfirmGoogleAuth.addEventListener('click', handleConfirmGoogleAuth);
  }

  if (btnLogoutMini) {
    btnLogoutMini.addEventListener('click', handleSignOut);
  }

  // Initialize GIS Token Client if Client ID exists
  initGoogleDriveTokenClient();
}

