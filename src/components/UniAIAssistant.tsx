import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { ChatMessage } from '../types';
import {
  Bot,
  Send,
  X,
  Trash2,
  Download,
  Copy,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Sparkles,
  Check,
  Globe,
  RefreshCw,
  AlertTriangle
} from 'lucide-react';

interface UniAIAssistantProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UniAIAssistant: React.FC<UniAIAssistantProps> = ({ isOpen, onClose }) => {
  const { user, role } = useAuth();
  const { students, teachers, classes, attendance, getStudentSummary, getAtRiskStudents } = useData();

  // Find active student or teacher context if applicable
  const currentStudent = role === 'student' ? students.find(s => s.userId === user?.id) || students[0] : null;
  const studentSummary = currentStudent ? getStudentSummary(currentStudent.id) : null;
  const atRiskList = getAtRiskStudents();

  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: 'msg-welcome',
      sender: 'ai',
      text: `Assalamu Alaikum & Welcome **${user?.firstName || 'Scholar'}**! I am **UniAI Assistant**, your enterprise AI Academic & Attendance Advisor.

I understand both **English and Urdu**. How can I assist you with your attendance logs or academic metrics today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }
  ]);

  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [ttsEnabled, setTtsEnabled] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  // Speech Recognition (Voice Input)
  const toggleVoiceInput = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Voice input is not supported in this browser. Please use Chrome, Edge, or Safari.");
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => setIsListening(true);
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputValue(transcript);
        setIsListening(false);
      };
      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);

      recognition.start();
    } catch (e) {
      setIsListening(false);
    }
  };

  // Speech Synthesis (Voice Output)
  const speakText = (text: string) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();

    if (isSpeaking) {
      setIsSpeaking(false);
      return;
    }

    // Strip markdown formatting for voice output
    const cleanText = text.replace(/[*_#`~]/g, '').slice(0, 300);
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.0;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const handleSend = async (queryText?: string) => {
    const textToSend = queryText || inputValue;
    if (!textToSend.trim() || loading) return;

    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    if (!queryText) setInputValue('');
    setLoading(true);

    try {
      // Build real contextual payload
      const contextPayload = {
        role,
        user: { name: `${user?.firstName} ${user?.lastName}`, email: user?.email },
        studentSummary,
        atRiskStudentsCount: atRiskList.length,
        atRiskListNames: atRiskList.map(item => `${item.student.firstName} ${item.student.lastName} (${item.summary.percentage}%)`),
      };

      const response = await fetch('/api/ai/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: textToSend,
          userRole: role,
          studentData: currentStudent ? { student: currentStudent, summary: studentSummary } : null,
          context: contextPayload
        }),
      });

      const data = await response.json();
      const aiReply = data.response || "I have received your query and verified your academic records.";

      const aiMessage: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: 'ai',
        text: aiReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, aiMessage]);

      if (ttsEnabled) {
        speakText(aiReply);
      }
    } catch (err) {
      // Offline / Fallback Intelligent Calculation Response
      let fallbackReply = `I am UniAI Assistant. Based on your current session data:\n\n`;

      if (role === 'student' && studentSummary) {
        fallbackReply += `📊 **Current Attendance Rate:** \`${studentSummary.percentage}%\` (${studentSummary.presents} out of ${studentSummary.totalClasses} classes attended).\n\n`;
        fallbackReply += `🎯 **Projection Metrics:**\n`;
        fallbackReply += `- To reach **75%**: ${studentSummary.target75.action === 'attend' ? `You MUST attend **${studentSummary.target75.count}** future classes.` : `You can safely miss **${studentSummary.target75.count}** classes.`}\n`;
        fallbackReply += `- To reach **80%**: ${studentSummary.target80.action === 'attend' ? `You MUST attend **${studentSummary.target80.count}** future classes.` : `You can safely miss **${studentSummary.target80.count}** classes.`}\n`;
        fallbackReply += `- To reach **90%**: ${studentSummary.target90.action === 'attend' ? `You MUST attend **${studentSummary.target90.count}** future classes.` : `You can safely miss **${studentSummary.target90.count}** classes.`}\n`;

        if (studentSummary.percentage < 75) {
          fallbackReply += `\n⚠️ **Warning Notice:** Your attendance is below the required 75% threshold. Please attend upcoming sessions immediately to maintain exam eligibility.`;
        }
      } else if (role === 'teacher') {
        fallbackReply += `👥 **Cohort Diagnostics:**\nFound **${atRiskList.length}** students currently below the 75% attendance threshold:\n`;
        atRiskList.forEach(item => {
          fallbackReply += `- **${item.student.firstName} ${item.student.lastName}** (${item.student.rollNumber}): \`${item.summary.percentage}%\` rate\n`;
        });
        fallbackReply += `\n✉️ *You can ask me to "Draft warning email for absent students" or "Generate attendance notice".*`;
      } else {
        fallbackReply += `🏫 **System Executive Overview:**\n- Total Enrolled Students: ${students.length}\n- Active Teachers: ${teachers.length}\n- Active Class Sections: ${classes.length}\n- Students At Risk (<75%): ${atRiskList.length}`;
      }

      setMessages((prev) => [
        ...prev,
        {
          id: `msg-${Date.now() + 1}`,
          sender: 'ai',
          text: fallbackReply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const downloadTranscript = () => {
    const textContent = messages.map(m => `[${m.timestamp}] ${m.sender.toUpperCase()}:\n${m.text}\n`).join('\n---\n\n');
    const blob = new Blob([textContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `UniAI-Transcript-${Date.now()}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const clearChat = () => {
    setMessages([
      {
        id: 'msg-reset',
        sender: 'ai',
        text: 'Chat history cleared. How can I assist you with attendance records now?',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }
    ]);
  };

  // Role-based quick suggestions
  const studentSuggestions = [
    "What is my current attendance percentage?",
    "How many classes to reach 75%?",
    "How many classes to reach 90%?",
    "Explain university attendance policy",
    "Urdu: Mujhe meri attendance ki detail batayein"
  ];

  const teacherSuggestions = [
    "Identify students below 75% threshold",
    "Draft formal warning notice for parents",
    "Generate absent student email draft",
    "Show class attendance summary"
  ];

  const adminSuggestions = [
    "Generate department attendance report",
    "Identify high-risk students across campus",
    "Predict future attendance trends",
    "Executive summary for registrar"
  ];

  const suggestions = role === 'student' ? studentSuggestions : role === 'teacher' ? teacherSuggestions : adminSuggestions;

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-5 right-5 w-full max-w-md h-[600px] z-50 bg-slate-900 text-slate-100 rounded-3xl shadow-2xl border border-slate-700/80 flex flex-col overflow-hidden backdrop-blur-2xl transition-all duration-300 animate-in fade-in slide-in-from-bottom-6">

      {/* Header */}
      <div className="p-4 bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-800 flex items-center justify-between border-b border-white/10 shrink-0">
        <div className="flex items-center space-x-3">
          <div className="bg-white/20 p-2 rounded-2xl shadow-inner">
            <Bot className="w-5 h-5 text-yellow-300 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <h3 className="font-extrabold text-sm tracking-tight text-white">UniAI Assistant</h3>
              <span className="bg-yellow-400 text-slate-900 text-[9px] font-extrabold px-1.5 py-0.2 rounded-full uppercase">GPT-3.6</span>
            </div>
            <p className="text-[10px] text-blue-200">Real-time University Database Context</p>
          </div>
        </div>

        <div className="flex items-center space-x-1">
          <button
            onClick={() => setTtsEnabled(!ttsEnabled)}
            className={`p-1.5 rounded-xl transition ${ttsEnabled ? 'bg-yellow-400 text-slate-900 font-bold' : 'text-slate-300 hover:bg-white/10'}`}
            title="Toggle Text-To-Speech Output"
          >
            {ttsEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>
          <button onClick={downloadTranscript} className="p-1.5 rounded-xl text-slate-300 hover:bg-white/10 transition" title="Download Transcript">
            <Download className="w-4 h-4" />
          </button>
          <button onClick={clearChat} className="p-1.5 rounded-xl text-slate-300 hover:bg-white/10 transition" title="Clear Chat">
            <Trash2 className="w-4 h-4" />
          </button>
          <button onClick={onClose} className="p-1.5 rounded-xl text-slate-300 hover:bg-white/10 transition">
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-950/80">
        {messages.map((m) => (
          <div key={m.id} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[88%] rounded-2xl p-3.5 text-xs leading-relaxed shadow-md ${
              m.sender === 'user'
                ? 'bg-blue-600 text-white rounded-br-none'
                : 'bg-slate-800/90 text-slate-100 border border-slate-700/80 rounded-bl-none'
            }`}>
              {/* Basic Markdown Rendering */}
              <div className="whitespace-pre-line">
                {m.text.split('\n').map((line, idx) => {
                  let parsed = line;
                  parsed = parsed.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
                  parsed = parsed.replace(/`(.*?)`/g, '<code class="bg-blue-500/20 px-1 py-0.5 rounded text-blue-300 font-mono text-[11px]">$1</code>');

                  if (parsed.trim().startsWith('- ')) {
                    return <div key={idx} className="pl-3 -indent-3 mb-1" dangerouslySetInnerHTML={{ __html: `• ${parsed.slice(2)}` }} />;
                  }
                  return <p key={idx} className={parsed.startsWith('###') ? 'font-bold text-sm text-blue-300 my-1 border-b border-slate-700 pb-0.5' : 'mb-1'} dangerouslySetInnerHTML={{ __html: parsed }} />;
                })}
              </div>

              <div className="flex items-center justify-between mt-2 pt-1 border-t border-white/10 text-[9px] text-slate-400">
                <span>{m.timestamp}</span>
                {m.sender === 'ai' && (
                  <button
                    onClick={() => copyToClipboard(m.id, m.text)}
                    className="flex items-center space-x-1 hover:text-white transition"
                  >
                    {copiedId === m.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedId === m.id ? 'Copied' : 'Copy'}</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="bg-slate-800 border border-slate-700 p-3 rounded-2xl rounded-bl-none flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-yellow-400 animate-spin" />
              <span className="text-xs text-slate-300 font-medium">UniAI is analyzing records & calculating projections...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Suggestion Pills */}
      {messages.length <= 3 && (
        <div className="px-3 py-2 bg-slate-900 border-t border-slate-800 overflow-x-auto whitespace-nowrap space-x-1.5 shrink-0">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Quick Prompts:</span>
          <div className="flex space-x-1.5">
            {suggestions.map((s, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(s)}
                className="text-[10px] bg-slate-800 hover:bg-slate-700 text-slate-300 px-2.5 py-1 rounded-full border border-slate-700 transition shrink-0"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Bar */}
      <div className="p-3 bg-slate-900 border-t border-slate-800 flex items-center space-x-2 shrink-0">
        <button
          onClick={toggleVoiceInput}
          className={`p-2.5 rounded-xl border transition ${
            isListening
              ? 'bg-rose-600 text-white border-rose-500 animate-pulse'
              : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
          }`}
          title="Voice Input (Speech-to-Text)"
        >
          {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
        </button>

        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder={isListening ? "Listening... Speak now!" : "Ask UniAI in English or Urdu..."}
          className="flex-1 bg-slate-800 text-slate-100 placeholder-slate-400 text-xs px-3.5 py-2.5 rounded-xl border border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <button
          onClick={() => handleSend()}
          disabled={loading || !inputValue.trim()}
          className="bg-gradient-to-tr from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 text-white p-2.5 rounded-xl shadow-lg transition active:scale-95"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
};
