/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  LayoutDashboard, 
  MessageSquare, 
  Settings, 
  GraduationCap, 
  ChevronRight, 
  ChevronLeft,
  Search,
  CheckCircle2,
  FileText,
  Upload,
  BrainCircuit,
  X,
  Plus,
  ArrowRight,
  User,
  Activity,
  Award,
  Zap,
  Download,
  AlertCircle,
  FileQuestion,
  ClipboardCheck,
  TrendingUp,
  History,
  Send,
  Clock,
  Trophy,
  ArrowLeft,
  MessageCircle,
  HelpCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { generateAIResponse } from './services/geminiService';
import { UserProfile, Grade, AptitudeLevel, Subject, Chapter, ChatMessage, GeneratedPaper, NoteUpload, Conversation } from './types';
import { SUBJECTS, APTITUDE_QUESTIONS } from './constants';

// --- Components ---

const AIAssistantSplit = ({ isOpen, onClose, profile, conversations, onUpdateConversations }: { 
  isOpen: boolean, 
  onClose: () => void, 
  profile: UserProfile,
  conversations: Conversation[],
  onUpdateConversations: (convs: Conversation[]) => void
}) => {
  const [activeConvId, setActiveConvId] = useState<string | null>(conversations[0]?.id || null);
  const [input, setInput] = useState('');
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const activeConv = conversations.find(c => c.id === activeConvId) || conversations[0];

  const handleSend = async () => {
    if (!input.trim() || !activeConv) return;
    
    const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', content: input, timestamp: Date.now() };
    const updatedConv = { ...activeConv, messages: [...activeConv.messages, userMsg] };
    const newConvs = conversations.map(c => c.id === activeConv.id ? updatedConv : c);
    onUpdateConversations(newConvs);
    setInput('');

    // Real AI response
    const systemInstruction = `You are Saarthi AI, a helpful and friendly tutor for students in rural India. 
    The student is in Grade ${profile.grade} with a ${profile.aptitude} aptitude level. 
    Always use simple language, relatable examples from rural life (farming, village markets, local festivals), and be encouraging. 
    If the student asks about a specific subject, provide clear explanations and connect them to real-world scenarios they might see in their village.`;

    const response = await generateAIResponse(input, systemInstruction);
    
    const aiMsg: ChatMessage = { 
      id: (Date.now() + 1).toString(), 
      role: 'assistant', 
      content: response, 
      timestamp: Date.now() 
    };
    
    const finalConv = { ...updatedConv, messages: [...updatedConv.messages, aiMsg] };
    onUpdateConversations(conversations.map(c => c.id === activeConv.id ? finalConv : c));
  };

  const createNewChat = () => {
    const newId = Date.now().toString();
    const newConv: Conversation = {
      id: newId,
      title: `Chat ${conversations.length + 1}`,
      messages: [{ id: '1', role: 'assistant', content: `Hello ${profile.name}! How can I help you today?`, timestamp: Date.now() }],
      timestamp: Date.now()
    };
    onUpdateConversations([newConv, ...conversations]);
    setActiveConvId(newId);
  };

  return (
    <motion.div 
      initial={false}
      animate={{ 
        width: isOpen ? (isMobile ? '100%' : 450) : 0,
        opacity: isOpen ? 1 : 0,
        x: isOpen ? 0 : 20
      }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className={`border-black bg-white flex flex-col overflow-hidden shrink-0 z-40 ${isOpen ? 'border-l-2 relative' : 'border-l-0 absolute right-0 pointer-events-none'}`}
      style={{ height: '100%' }}
    >
      <div className="p-4 border-b-2 border-black flex justify-between items-center bg-blue-50">
        <div className="flex items-center gap-2">
          <BrainCircuit className="text-blue-600" />
          <h3 className="font-bold handwritten text-xl">AI Tutor</h3>
        </div>
        <div className="flex gap-2">
          <button onClick={createNewChat} className="p-1 hover:bg-blue-100 rounded-full transition-colors" title="New Chat">
            <Plus size={20} />
          </button>
          <button onClick={onClose} className="p-1 hover:bg-blue-100 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Chat History Sidebar */}
        <div className="w-20 border-r-2 border-black bg-gray-50 flex flex-col items-center py-4 gap-4 overflow-y-auto">
          {conversations.map(conv => (
            <button 
              key={conv.id}
              onClick={() => setActiveConvId(conv.id)}
              className={`w-12 h-12 rounded-lg border-2 flex items-center justify-center transition-all ${
                activeConvId === conv.id ? 'bg-black text-white border-black' : 'bg-white border-gray-200 hover:border-black'
              }`}
              title={conv.title}
            >
              <MessageSquare size={20} />
            </button>
          ))}
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col bg-white">
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {activeConv?.messages.map(msg => (
              <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-3 border-2 border-black ${
                  msg.role === 'user' ? 'bg-blue-100' : 'bg-white'
                } shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]`}>
                  <p className="text-sm">{msg.content}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 border-t-2 border-black">
            <div className="flex gap-2">
              <input 
                type="text" 
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyPress={e => e.key === 'Enter' && handleSend()}
                placeholder="Ask anything..."
                className="flex-1 p-2 border-2 border-black focus:outline-none text-sm"
              />
              <button 
                onClick={handleSend}
                className="p-2 bg-black text-white hover:bg-gray-800 transition-colors"
              >
                <ArrowRight size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const Onboarding = ({ onComplete }: { onComplete: (profile: UserProfile) => void }) => {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [grade, setGrade] = useState<Grade>('10');
  const [aptitudeScore, setAptitudeScore] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);

  const nextStep = () => setStep(s => s + 1);

  const handleAptitudeAnswer = (answer: string) => {
    if (answer === APTITUDE_QUESTIONS[currentQuestion].correct) {
      setAptitudeScore(s => s + 1);
    }
    
    if (currentQuestion < APTITUDE_QUESTIONS.length - 1) {
      setCurrentQuestion(q => q + 1);
    } else {
      const level: AptitudeLevel = aptitudeScore >= 2 ? 'advanced' : aptitudeScore === 1 ? 'intermediate' : 'beginner';
      onComplete({ name, grade: Number(grade) as Grade, aptitude: level, onboarded: true, joinedAt: Date.now() });
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50">
      <div className="fixed top-6 right-6">
        <button 
          onClick={() => alert("Saarthi AI is here to help! Just fill in your name and grade to get started. We'll then do a quick test to see how I can best teach you.")}
          className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-black font-bold hover:bg-gray-100 transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
        >
          <HelpCircle size={20} />
          <span>Need Help?</span>
        </button>
      </div>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card-notebook w-full max-w-md p-8"
      >
        {step === 1 && (
          <div className="space-y-6">
            <div className="text-center">
              <h1 className="text-3xl font-bold handwritten mb-2">Namaste!</h1>
              <p className="text-gray-600">Let's start your learning journey.</p>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">What's your name?</label>
                <input 
                  type="text" 
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full p-2 border-2 border-black focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="Enter your name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Which grade are you in?</label>
                <select 
                  value={grade}
                  onChange={e => setGrade(e.target.value as Grade)}
                  className="w-full p-2 border-2 border-black focus:outline-none"
                >
                  {['6', '7', '8', '9', '10', '11', '12'].map(g => (
                    <option key={g} value={g}>Grade {g}</option>
                  ))}
                </select>
              </div>
              <button 
                disabled={!name}
                onClick={nextStep}
                className="w-full btn-notebook flex items-center justify-center gap-2 disabled:opacity-50"
              >
                Next <ArrowRight size={18} />
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold handwritten mb-2">Quick Aptitude Test</h2>
              <p className="text-gray-600">This helps AI understand how to teach you best.</p>
            </div>
            <div className="p-4 bg-blue-50 border-2 border-blue-200 rounded-lg">
              <p className="font-medium mb-4">{APTITUDE_QUESTIONS[currentQuestion].question}</p>
              <div className="grid grid-cols-1 gap-2">
                {APTITUDE_QUESTIONS[currentQuestion].options.map(opt => (
                  <button 
                    key={opt}
                    onClick={() => handleAptitudeAnswer(opt)}
                    className="p-2 text-left border-2 border-black bg-white hover:bg-blue-100 transition-colors"
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
            <div className="text-center text-sm text-gray-500">
              Question {currentQuestion + 1} of {APTITUDE_QUESTIONS.length}
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

const Sidebar = ({ activeTab, setActiveTab }: { activeTab: string, setActiveTab: (t: string) => void }) => {
  const tabs = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'subjects', icon: BookOpen, label: 'Subjects' },
    { id: 'my-notes', icon: FileText, label: 'My Notes' },
    { id: 'question-paper', icon: GraduationCap, label: 'Question Papers' },
    { id: 'check-answers', icon: CheckCircle2, label: 'Check Answers' },
    { id: 'progress', icon: Activity, label: 'My Progress' },
    { id: 'settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <div className="w-64 border-r-2 border-black bg-white h-screen flex flex-col p-4 sticky top-0 shrink-0">
      <div className="flex items-center gap-2 mb-8 px-2">
        <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center text-white font-bold text-xl">S</div>
        <h1 className="text-xl font-bold handwritten">Saarthi AI</h1>
      </div>
      <nav className="flex-1 space-y-2 overflow-y-auto">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 border-2 transition-all ${
              activeTab === tab.id 
                ? 'bg-black text-white border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)]' 
                : 'border-transparent hover:border-black'
            }`}
          >
            <tab.icon size={20} />
            <span className="font-medium">{tab.label}</span>
          </button>
        ))}
      </nav>
      <div className="p-4 bg-gray-50 border-2 border-black rounded-lg mt-4">
        <div className="flex items-center gap-2 mb-2">
          <BrainCircuit size={18} className="text-blue-600" />
          <span className="text-xs font-bold uppercase tracking-wider">AI Tutor Active</span>
        </div>
        <p className="text-[10px] text-gray-500">Adapting to your learning style...</p>
      </div>
    </div>
  );
};

const Dashboard = ({ profile }: { profile: UserProfile }) => {
  return (
    <div className="p-8 space-y-8">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-bold handwritten mb-2">Hello, {profile.name}!</h1>
          <p className="text-gray-600">Grade {profile.grade} • {profile.aptitude.charAt(0).toUpperCase() + profile.aptitude.slice(1)} Level</p>
        </div>
        <div className="flex gap-4">
          <div className="card-notebook p-3 flex items-center gap-3">
            <div className="bg-orange-100 p-2 rounded-full"><Award className="text-orange-600" /></div>
            <div>
              <p className="text-xs text-gray-500">Points</p>
              <p className="font-bold">1,250</p>
            </div>
          </div>
          <div className="card-notebook p-3 flex items-center gap-3">
            <div className="bg-green-100 p-2 rounded-full"><Activity className="text-green-600" /></div>
            <div>
              <p className="text-xs text-gray-500">Streak</p>
              <p className="font-bold">5 Days</p>
            </div>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="col-span-2 card-notebook">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Zap size={20} className="text-yellow-500" /> Recent Progress
          </h3>
          <div className="space-y-4">
            {['Science: Cell Structure', 'Math: Linear Equations', 'History: French Revolution'].map((item, i) => (
              <div key={i} className="flex items-center justify-between p-3 border-2 border-gray-100 hover:border-black transition-all cursor-pointer group">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                  <span className="font-medium">{item}</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-32 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-green-500" style={{ width: `${80 - i * 20}%` }}></div>
                  </div>
                  <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="card-notebook bg-blue-50">
          <h3 className="text-xl font-bold mb-4">Subject Proficiency</h3>
          <div className="space-y-6">
            {[
              { name: 'Science', score: 85, color: 'bg-blue-500' },
              { name: 'Math', score: 72, color: 'bg-red-500' },
              { name: 'History', score: 90, color: 'bg-green-500' },
            ].map(sub => (
              <div key={sub.name} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-bold">{sub.name}</span>
                  <span>{sub.score}%</span>
                </div>
                <div className="h-4 border-2 border-black bg-white p-[2px]">
                  <div className={`${sub.color} h-full`} style={{ width: `${sub.score}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {SUBJECTS.map(subject => (
          <div key={subject.id} className="card-notebook hover:-translate-y-1 transition-transform cursor-pointer group">
            <div className="text-4xl mb-4">{subject.icon}</div>
            <h4 className="text-lg font-bold mb-1">{subject.name}</h4>
            <p className="text-sm text-gray-500 mb-4">{subject.chapters.length} Chapters</p>
            <div className="flex items-center text-blue-600 font-bold text-sm group-hover:gap-2 transition-all">
              Start Learning <ArrowRight size={16} />
            </div>
          </div>
        ))}
        <div className="card-notebook border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-400 hover:text-black hover:border-black transition-all cursor-pointer">
          <Plus size={32} />
          <span className="font-bold mt-2">Add Subject</span>
        </div>
      </div>
    </div>
  );
};

const TextbookReader = ({ subject, chapter, profile, onBack }: { subject: Subject, chapter: Chapter, profile: UserProfile, onBack: () => void }) => {
  const [selectedText, setSelectedText] = useState('');
  const [showAIAction, setShowAIAction] = useState(false);
  const [aiResponse, setAiResponse] = useState<{ type: string, content: string } | null>(null);

  const handleMouseUp = () => {
    const text = window.getSelection()?.toString();
    if (text && text.trim().length > 0) {
      setSelectedText(text);
      setShowAIAction(true);
    } else {
      setShowAIAction(false);
    }
  };

  const askAI = (action: string) => {
    let content = '';
    if (profile.aptitude === 'beginner') {
      content = `Since you're just starting, let me explain this simply: Imagine ${selectedText.substring(0, 20)}... is like a small seed. Just as a seed has everything needed to grow into a big tree, this concept is the starting point for everything else in ${subject.name}. In our village, we see this when we plant crops...`;
    } else if (profile.aptitude === 'intermediate') {
      content = `Good progress! This concept of "${selectedText.substring(0, 20)}..." connects to what we learned about ${subject.name} last week. It's like how we manage water in our fields – it's a system where every part has a specific role to play...`;
    } else {
      content = `Excellent! You've mastered the basics. Now, let's look at the advanced implications of "${selectedText.substring(0, 20)}...". This structural complexity is what allows for higher-order biological functions. Think of it like the complex irrigation systems used in modern farming...`;
    }

    setAiResponse({
      type: action,
      content: `I'm analyzing "${selectedText.substring(0, 30)}...". Here is a ${action} for you: \n\n${content}`
    });
    setShowAIAction(false);
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <div className="flex-1 overflow-y-auto p-8 notebook-page">
        <div className="notebook-margin"></div>
        <div className="max-w-3xl mx-auto pl-16">
          <button onClick={onBack} className="mb-8 flex items-center gap-2 text-gray-500 hover:text-black transition-colors">
            <ChevronLeft size={20} /> Back to Dashboard
          </button>
          
          <header className="mb-12">
            <div className="text-sm font-bold text-blue-600 uppercase tracking-widest mb-2">{subject.name}</div>
            <h1 className="text-5xl font-bold handwritten mb-4">{chapter.title}</h1>
            <div className="h-1 w-24 bg-black"></div>
          </header>

          <div 
            onMouseUp={handleMouseUp}
            className="prose prose-lg max-w-none leading-relaxed text-gray-800"
          >
            {chapter.content.split('\n\n').map((p, i) => (
              <p key={i} className="mb-6">{p}</p>
            ))}
          </div>

          <AnimatePresence>
            {showAIAction && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="fixed bottom-10 left-1/2 -translate-x-1/2 flex gap-2 p-2 bg-black text-white rounded-full shadow-2xl z-50"
              >
                <button onClick={() => askAI('Summary')} className="px-4 py-2 hover:bg-gray-800 rounded-full text-sm font-bold flex items-center gap-2">
                  <FileText size={16} /> Summarize
                </button>
                <button onClick={() => askAI('Explanation')} className="px-4 py-2 hover:bg-gray-800 rounded-full text-sm font-bold flex items-center gap-2">
                  <BrainCircuit size={16} /> Explain
                </button>
                <button onClick={() => askAI('Example')} className="px-4 py-2 hover:bg-gray-800 rounded-full text-sm font-bold flex items-center gap-2">
                  <Zap size={16} /> Real-world Example
                </button>
                <div className="w-[1px] bg-gray-700 mx-1"></div>
                <button onClick={() => setShowAIAction(false)} className="p-2 hover:bg-gray-800 rounded-full">
                  <X size={16} />
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {aiResponse && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-12 card-notebook bg-blue-50 relative"
            >
              <button onClick={() => setAiResponse(null)} className="absolute top-4 right-4 text-gray-400 hover:text-black">
                <X size={20} />
              </button>
              <div className="flex items-center gap-2 mb-4 text-blue-600">
                <BrainCircuit size={24} />
                <h3 className="text-xl font-bold">AI {aiResponse.type}</h3>
              </div>
              <p className="text-lg leading-relaxed whitespace-pre-wrap">{aiResponse.content}</p>
            </motion.div>
          )}
        </div>
      </div>

      <div className="w-80 border-l-2 border-black bg-white p-6 overflow-y-auto">
        <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
          <Award size={20} /> Chapter Goals
        </h3>
        <div className="space-y-4">
          {[
            'Understand cell definition',
            'Identify cell components',
            'Differentiate unicellular/multicellular',
            'Learn about human cell count'
          ].map((goal, i) => (
            <div key={i} className="flex gap-3 items-start">
              <div className="mt-1 w-5 h-5 border-2 border-black flex items-center justify-center">
                {i === 0 && <CheckCircle2 size={14} className="text-green-600" />}
              </div>
              <span className={`text-sm ${i === 0 ? 'line-through text-gray-400' : ''}`}>{goal}</span>
            </div>
          ))}
        </div>

        <div className="mt-12 p-4 bg-yellow-50 border-2 border-yellow-200 rounded-lg">
          <h4 className="font-bold mb-2 flex items-center gap-2">
            <MessageSquare size={16} /> Quick Quiz
          </h4>
          <p className="text-sm mb-4">What is the study of cells called?</p>
          <div className="space-y-2">
            {['Biology', 'Cytology', 'Zoology'].map(opt => (
              <button key={opt} className="w-full text-left p-2 text-xs border-2 border-black bg-white hover:bg-yellow-100 transition-colors">
                {opt}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const MyNotes = ({ notes, onUpload }: { notes: NoteUpload[], onUpload: (note: NoteUpload) => void }) => {
  const [selectedNote, setSelectedNote] = useState<NoteUpload | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const newNote: NoteUpload = {
      id: Date.now().toString(),
      title: file.name.replace('.pdf', '').replace('.docx', ''),
      subject: 'General',
      content: "AI Analysis in progress...",
      summary: "Analyzing your notes to create a structured summary with diagrams...",
      timestamp: Date.now(),
      status: 'analyzing'
    };
    onUpload(newNote);

    // Mock AI Analysis
    setTimeout(() => {
      const analyzedNote: NoteUpload = {
        ...newNote,
        status: 'ready',
        summary: "Based on your notes, here's a structured summary. I've identified 3 key concepts and generated a conceptual diagram for the water cycle process mentioned.",
        content: "Detailed notes with diagrams would appear here..."
      };
      onUpload(analyzedNote);
    }, 3000);
  };

  return (
    <div className="space-y-6 p-8">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold handwritten">My Notes</h2>
        <label className="cursor-pointer bg-black text-white px-4 py-2 hover:bg-gray-800 transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center gap-2">
          <Upload size={20} />
          <span>Upload New Notes</span>
          <input type="file" className="hidden" onChange={handleFileUpload} accept=".pdf,.docx,.txt" />
        </label>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {notes.map(note => (
          <motion.div 
            key={note.id}
            whileHover={{ scale: 1.02 }}
            onClick={() => setSelectedNote(note)}
            className="p-4 border-2 border-black bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] cursor-pointer"
          >
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-bold text-lg truncate">{note.title}</h3>
              {note.status === 'analyzing' ? (
                <div className="animate-spin text-blue-600"><BrainCircuit size={20} /></div>
              ) : (
                <FileText className="text-gray-400" />
              )}
            </div>
            <p className="text-sm text-gray-600 line-clamp-2 mb-4">{note.summary}</p>
            <div className="text-xs text-gray-400">{new Date(note.timestamp).toLocaleDateString()}</div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {selectedNote && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={() => setSelectedNote(null)}
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-white border-4 border-black p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-3xl font-bold handwritten">{selectedNote.title}</h2>
                <button onClick={() => setSelectedNote(null)} className="p-1 hover:bg-gray-100 rounded-full">
                  <X size={24} />
                </button>
              </div>
              
              <div className="space-y-6">
                <div className="p-4 bg-blue-50 border-2 border-blue-200">
                  <h4 className="font-bold mb-2 flex items-center gap-2">
                    <BrainCircuit size={18} className="text-blue-600" />
                    AI Summary & Analysis
                  </h4>
                  <p className="text-sm text-blue-800">{selectedNote.summary}</p>
                </div>

                <div className="prose max-w-none">
                  <h4 className="font-bold mb-2">Detailed Notes</h4>
                  <p className="text-gray-700">{selectedNote.content}</p>
                  
                  {selectedNote.status === 'completed' && (
                    <div className="mt-8 p-4 border-2 border-dashed border-gray-300 bg-gray-50 flex flex-col items-center justify-center min-h-[200px]">
                      <div className="text-gray-400 mb-2 italic">[Diagram: Conceptual Map of {selectedNote.title}]</div>
                      <p className="text-xs text-gray-400">Diagram generated by AI based on your notes</p>
                    </div>
                  )}
                </div>

                <div className="flex gap-4 pt-4">
                  <button className="flex-1 py-2 bg-black text-white font-bold hover:bg-gray-800 transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center gap-2">
                    <Download size={18} />
                    Download PDF
                  </button>
                  <button className="flex-1 py-2 border-2 border-black font-bold hover:bg-gray-50 transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center gap-2">
                    <MessageSquare size={18} />
                    Ask AI about these notes
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const MyProgress = ({ papers }: { papers: GeneratedPaper[] }) => {
  const checkedPapers = papers.filter(p => p.status === 'checked');
  const averageScore = checkedPapers.length > 0 
    ? Math.round(checkedPapers.reduce((acc, p) => acc + (p.score || 0), 0) / checkedPapers.length)
    : 0;

  return (
    <div className="space-y-8 p-8">
      <h2 className="text-3xl font-bold handwritten">My Progress</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 border-2 border-black bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <div className="text-sm text-gray-500 uppercase font-bold mb-1">Average Score</div>
          <div className="text-4xl font-bold text-blue-600">{averageScore}%</div>
        </div>
        <div className="p-6 border-2 border-black bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <div className="text-sm text-gray-500 uppercase font-bold mb-1">Papers Completed</div>
          <div className="text-4xl font-bold text-green-600">{checkedPapers.length}</div>
        </div>
        <div className="p-6 border-2 border-black bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <div className="text-sm text-gray-500 uppercase font-bold mb-1">Subjects Studied</div>
          <div className="text-4xl font-bold text-purple-600">{new Set(papers.map(p => p.subject)).size}</div>
        </div>
      </div>

      <div className="p-6 border-2 border-black bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <h3 className="text-xl font-bold mb-4">Past Paper Performance</h3>
        <div className="space-y-4">
          {checkedPapers.length === 0 ? (
            <p className="text-gray-400 italic">No papers checked yet. Complete a paper to see your progress!</p>
          ) : (
            checkedPapers.map(paper => (
              <div key={paper.id} className="flex items-center justify-between p-4 border-b-2 border-gray-100 last:border-0">
                <div>
                  <div className="font-bold">{paper.subject} - {paper.chapter}</div>
                  <div className="text-xs text-gray-400">{new Date(paper.timestamp).toLocaleDateString()}</div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-xl font-bold">{paper.score}%</div>
                  <div className={`w-3 h-3 rounded-full ${
                    (paper.score || 0) >= 80 ? 'bg-green-500' : (paper.score || 0) >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                  }`} />
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

const QuestionPaperGenerator = ({ onGenerate }: { onGenerate: (paper: GeneratedPaper) => void }) => {
  const [subject, setSubject] = useState<Subject | ''>('');
  const [chapter, setChapter] = useState('');
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = () => {
    if (!subject || !chapter) return;
    setIsGenerating(true);
    
    setTimeout(() => {
      const newPaper: GeneratedPaper = {
        id: Date.now().toString(),
        subject,
        chapter,
        difficulty,
        questions: [
          `Explain the concept of ${chapter} in detail.`,
          `What are the key components of ${chapter}?`,
          `Provide a real-world example of ${chapter}.`,
        ],
        timestamp: Date.now(),
        status: 'generated'
      };
      onGenerate(newPaper);
      setIsGenerating(false);
      setSubject('');
      setChapter('');
    }, 2000);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 p-8">
      <div className="text-center">
        <h2 className="text-4xl font-bold handwritten mb-2">Question Paper Generator</h2>
        <p className="text-gray-600">Generate custom practice papers based on your syllabus.</p>
      </div>

      <div className="p-8 border-4 border-black bg-white shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] space-y-6">
        <div className="space-y-2">
          <label className="block font-bold uppercase text-xs tracking-wider">Select Subject</label>
          <select 
            value={subject} 
            onChange={e => setSubject(e.target.value as Subject)}
            className="w-full p-3 border-2 border-black focus:outline-none"
          >
            <option value="">Choose a subject...</option>
            {SUBJECTS.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
          </select>
        </div>

        <div className="space-y-2">
          <label className="block font-bold uppercase text-xs tracking-wider">Chapter / Topic</label>
          <input 
            type="text" 
            value={chapter}
            onChange={e => setChapter(e.target.value)}
            placeholder="e.g., Photosynthesis, Trigonometry"
            className="w-full p-3 border-2 border-black focus:outline-none"
          />
        </div>

        <div className="space-y-2">
          <label className="block font-bold uppercase text-xs tracking-wider">Difficulty Level</label>
          <div className="flex gap-4">
            {(['easy', 'medium', 'hard'] as const).map(d => (
              <button
                key={d}
                onClick={() => setDifficulty(d)}
                className={`flex-1 py-2 border-2 border-black font-bold capitalize transition-all ${
                  difficulty === d ? 'bg-black text-white' : 'bg-white hover:bg-gray-50'
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>

        <button 
          onClick={handleGenerate}
          disabled={!subject || !chapter || isGenerating}
          className="w-full py-4 bg-black text-white font-bold text-xl hover:bg-gray-800 transition-all shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
        >
          {isGenerating ? (
            <>
              <div className="animate-spin"><BrainCircuit size={24} /></div>
              <span>Generating Paper...</span>
            </>
          ) : (
            <>
              <FileText size={24} />
              <span>Generate Question Paper</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

const AnswerChecker = ({ papers, onCheck }: { papers: GeneratedPaper[], onCheck: (id: string, score: number, feedback: string) => void }) => {
  const [selectedPaperId, setSelectedPaperId] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const [files, setFiles] = useState<FileList | null>(null);

  const handleCheck = () => {
    if (!selectedPaperId || !files) return;
    setIsChecking(true);

    setTimeout(() => {
      const score = Math.floor(Math.random() * 41) + 60; // Random score 60-100
      onCheck(selectedPaperId, score, "Great work! Your understanding of the core concepts is strong. Pay more attention to the diagrams in question 2.");
      setIsChecking(false);
      setSelectedPaperId('');
      setFiles(null);
    }, 3000);
  };

  const pendingPapers = papers.filter(p => p.status === 'generated');

  return (
    <div className="max-w-2xl mx-auto space-y-8 p-8">
      <div className="text-center">
        <h2 className="text-4xl font-bold handwritten mb-2">AI Answer Checker</h2>
        <p className="text-gray-600">Upload your handwritten answer sheets for AI evaluation.</p>
      </div>

      <div className="p-8 border-4 border-black bg-white shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] space-y-6">
        <div className="space-y-2">
          <label className="block font-bold uppercase text-xs tracking-wider">Select Question Paper</label>
          <select 
            value={selectedPaperId} 
            onChange={e => setSelectedPaperId(e.target.value)}
            className="w-full p-3 border-2 border-black focus:outline-none"
          >
            <option value="">Choose a paper to check...</option>
            {pendingPapers.map(p => (
              <option key={p.id} value={p.id}>{p.subject} - {p.chapter} ({new Date(p.timestamp).toLocaleDateString()})</option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="block font-bold uppercase text-xs tracking-wider">Upload Answer Sheets (Images/PDF)</label>
          <div className="border-2 border-dashed border-black p-8 text-center bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer relative">
            <input 
              type="file" 
              multiple 
              onChange={e => setFiles(e.target.files)}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
            <Upload className="mx-auto mb-2 text-gray-400" size={32} />
            <p className="text-sm font-bold">
              {files ? `${files.length} files selected` : "Click or drag files here to upload"}
            </p>
          </div>
        </div>

        <button 
          onClick={handleCheck}
          disabled={!selectedPaperId || !files || isChecking}
          className="w-full py-4 bg-black text-white font-bold text-xl hover:bg-gray-800 transition-all shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
        >
          {isChecking ? (
            <>
              <div className="animate-spin"><BrainCircuit size={24} /></div>
              <span>AI is Checking...</span>
            </>
          ) : (
            <>
              <CheckCircle2 size={24} />
              <span>Start AI Check</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

// --- Main App ---

export default function App() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedChapter, setSelectedChapter] = useState<{ subject: Subject, chapter: Chapter } | null>(null);
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  
  // New State for Features
  const [papers, setPapers] = useState<GeneratedPaper[]>([]);
  const [notes, setNotes] = useState<NoteUpload[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: '1',
      title: 'General Help',
      messages: [{ id: '1', role: 'assistant', content: "Hello! I'm your AI Tutor. How can I help you today?", timestamp: Date.now() }],
      timestamp: Date.now()
    }
  ]);

  // Load from local storage
  useEffect(() => {
    const savedProfile = localStorage.getItem('saarthi_profile');
    if (savedProfile) setProfile(JSON.parse(savedProfile));

    const savedPapers = localStorage.getItem('saarthi_papers');
    if (savedPapers) setPapers(JSON.parse(savedPapers));

    const savedNotes = localStorage.getItem('saarthi_notes');
    if (savedNotes) setNotes(JSON.parse(savedNotes));

    const savedConvs = localStorage.getItem('saarthi_convs');
    if (savedConvs) setConversations(JSON.parse(savedConvs));
  }, []);

  // Save to local storage
  useEffect(() => {
    if (papers.length > 0) localStorage.setItem('saarthi_papers', JSON.stringify(papers));
  }, [papers]);

  useEffect(() => {
    if (notes.length > 0) localStorage.setItem('saarthi_notes', JSON.stringify(notes));
  }, [notes]);

  useEffect(() => {
    if (conversations.length > 0) localStorage.setItem('saarthi_convs', JSON.stringify(conversations));
  }, [conversations]);

  const handleOnboarding = (p: UserProfile) => {
    setProfile(p);
    localStorage.setItem('saarthi_profile', JSON.stringify(p));
  };

  const handleGeneratePaper = (paper: GeneratedPaper) => {
    setPapers([paper, ...papers]);
    setActiveTab('question-paper');
  };

  const handleCheckAnswers = (id: string, score: number, feedback: string) => {
    setPapers(papers.map(p => p.id === id ? { ...p, status: 'checked', score, feedback } : p));
    setActiveTab('progress');
  };

  const handleUploadNote = (note: NoteUpload) => {
    const existing = notes.find(n => n.id === note.id);
    if (existing) {
      setNotes(notes.map(n => n.id === note.id ? note : n));
    } else {
      setNotes([note, ...notes]);
    }
  };

  if (!profile) {
    return <Onboarding onComplete={handleOnboarding} />;
  }

  return (
    <>
      <div className="flex h-screen bg-gray-50 overflow-hidden relative">
        {!selectedChapter && <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />}
        
        <div className="flex-1 flex overflow-hidden relative">
          <main className="flex-1 overflow-y-auto">
            {selectedChapter ? (
              <TextbookReader 
                subject={selectedChapter.subject} 
                chapter={selectedChapter.chapter} 
                profile={profile}
                onBack={() => setSelectedChapter(null)} 
              />
            ) : (
              <>
                {activeTab === 'dashboard' && <Dashboard profile={profile} />}
                {activeTab === 'subjects' && (
                  <div className="p-8">
                    <h1 className="text-4xl font-bold handwritten mb-8">Your Subjects</h1>
                    <div className="grid grid-cols-1 gap-8">
                      {SUBJECTS.map(subject => (
                        <div key={subject.id} className="card-notebook">
                          <div className="flex items-center gap-4 mb-6">
                            <span className="text-4xl">{subject.icon}</span>
                            <h2 className="text-2xl font-bold">{subject.name}</h2>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {subject.chapters.map(chapter => (
                              <div 
                                key={chapter.id}
                                onClick={() => setSelectedChapter({ subject, chapter })}
                                className="p-4 border-2 border-gray-100 hover:border-black transition-all cursor-pointer group"
                              >
                                <h4 className="font-bold mb-1 group-hover:text-blue-600 transition-colors">{chapter.title}</h4>
                                <p className="text-xs text-gray-500">Click to start reading</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {activeTab === 'my-notes' && <MyNotes notes={notes} onUpload={handleUploadNote} />}
                {activeTab === 'question-paper' && <QuestionPaperGenerator onGenerate={handleGeneratePaper} />}
                {activeTab === 'check-answers' && <AnswerChecker papers={papers} onCheck={handleCheckAnswers} />}
                {activeTab === 'progress' && <MyProgress papers={papers} />}
                {activeTab === 'settings' && (
                  <div className="p-8 max-w-2xl mx-auto">
                    <h1 className="text-4xl font-bold handwritten mb-8">Settings</h1>
                    <div className="card-notebook space-y-8">
                      <section className="space-y-4">
                        <h3 className="text-xl font-bold flex items-center gap-2"><User size={20} /> Profile</h3>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-bold uppercase text-gray-400 mb-1">Name</label>
                            <p className="font-bold">{profile.name}</p>
                          </div>
                          <div>
                            <label className="block text-xs font-bold uppercase text-gray-400 mb-1">Grade</label>
                            <p className="font-bold">{profile.grade}</p>
                          </div>
                        </div>
                      </section>
                      <div className="h-[2px] bg-gray-100"></div>
                      <section className="space-y-4">
                        <h3 className="text-xl font-bold flex items-center gap-2"><BrainCircuit size={20} /> AI Preferences</h3>
                        <div className="space-y-4">
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="font-bold">Adaptive Tutoring</p>
                              <p className="text-xs text-gray-500">Currently set to {profile.aptitude} mode</p>
                            </div>
                            <div className="w-12 h-6 bg-green-500 rounded-full p-1 flex justify-end">
                              <div className="w-4 h-4 bg-white rounded-full"></div>
                            </div>
                          </div>
                        </div>
                      </section>
                      <button 
                        onClick={() => {
                          localStorage.removeItem('saarthi_profile');
                          window.location.reload();
                        }}
                        className="w-full py-2 text-red-600 font-bold border-2 border-red-600 hover:bg-red-50 transition-colors"
                      >
                        Reset Account
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </main>

          <AIAssistantSplit 
            isOpen={isAssistantOpen} 
            onClose={() => setIsAssistantOpen(false)} 
            profile={profile}
            conversations={conversations}
            onUpdateConversations={setConversations}
          />
        </div>
      </div>

      <AnimatePresence>
        {!isAssistantOpen && (
          <motion.button 
            initial={{ scale: 0, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0, opacity: 0, y: 20 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              console.log('Opening AI Assistant');
              setIsAssistantOpen(true);
            }}
            className="fixed bottom-6 right-6 px-6 h-16 bg-black text-white rounded-full flex items-center gap-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,0.3)] transition-all z-[100] cursor-pointer pointer-events-auto"
          >
            <MessageCircle size={28} />
            <span className="font-bold handwritten text-lg">Chat with AI</span>
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
}
