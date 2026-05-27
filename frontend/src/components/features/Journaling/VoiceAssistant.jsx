import React, { useState, useEffect, useRef } from 'react';

export default function VoiceAssistant({ token }) {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const [transcript, setTranscript] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [micError, setMicError] = useState('');

  // Use a ref to track if the user wants the conversation to continue
  const sessionActive = useRef(false);

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const [recognition] = useState(() => SpeechRecognition ? new SpeechRecognition() : null);

  const getSweetVoice = (voices) => {
    return voices.find(v => v.name === 'Google UK English Female') ||
           voices.find(v => v.name === 'Google US English') ||
           voices.find(v => v.name.includes('Google') && v.name.includes('Female')) ||
           voices.find(v => v.name.includes('Google')) ||
           voices.find(v => v.lang.startsWith('en-'));
  };

  useEffect(() => {
    if (window.speechSynthesis) {
      window.speechSynthesis.getVoices();
    }
  }, []);

  useEffect(() => {
    if (!recognition) return;

    recognition.continuous = false;
    recognition.interimResults = true; 
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setMicError('');
      setIsListening(true);
    };

    recognition.onresult = (event) => {
      let interimText = '';
      let finalText = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          finalText += event.results[i][0].transcript;
        } else {
          interimText += event.results[i][0].transcript;
        }
      }

      setTranscript(finalText || interimText);

      if (finalText) {
        processVoiceWithAI(finalText);
      }
    };

    recognition.onerror = (event) => {
      if (event.error === 'no-speech') {
        // If it hears nothing, just silently restart if session is still active
        if (sessionActive.current) {
          try { recognition.start(); } catch(e) {}
        }
      } else if (event.error === 'not-allowed') {
        setMicError('Microphone access blocked! Please allow it in Chrome.');
        sessionActive.current = false;
      }
      setIsListening(false);
    };

    recognition.onend = () => setIsListening(false);
  }, [recognition]); 

  const initiateGreeting = () => {
    if (!window.speechSynthesis) {
      if (recognition && sessionActive.current) recognition.start();
      return;
    }

    window.speechSynthesis.cancel();
    
    const greetingText = "Hi Mahir, I am here. How are you feeling today?";
    setAiResponse(greetingText); 

    const utterance = new SpeechSynthesisUtterance(greetingText);
    const voices = window.speechSynthesis.getVoices();
    
    utterance.voice = getSweetVoice(voices);
    utterance.rate = 0.95; 
    utterance.pitch = 1.1; 

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => {
      setIsSpeaking(false);
      // LOOP MAGIC: Auto-start the mic when she finishes the greeting
      if (sessionActive.current && recognition) {
        try { recognition.start(); } catch(e) { console.error(e); }
      }
    };

    window.speechSynthesis.speak(utterance);
  };

  const toggleListening = () => {
    // HARD STOP: If the user clicks the button while active, kill the session
    if (sessionActive.current) {
      sessionActive.current = false;
      if (recognition) recognition.stop();
      window.speechSynthesis.cancel();
      setIsListening(false);
      setIsSpeaking(false);
      setIsProcessing(false);
    } else {
      // HARD START: Begin the session
      sessionActive.current = true;
      setTranscript('');
      setAiResponse('');
      setMicError('');
      initiateGreeting();
    }
  };

  const processVoiceWithAI = async (text) => {
    setIsProcessing(true);
    try {
      const res = await fetch('https://innerlift-8wtt.onrender.com/api/voice', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ transcript: text })
      });

      const data = await res.json();
      if (res.ok && sessionActive.current) {
        setAiResponse(data.reply);
        speakResponse(data.reply);
      }
    } catch (error) {
      console.error('Failed to fetch AI response');
    } finally {
      setIsProcessing(false);
    }
  };

  const speakResponse = (text) => {
    if (!window.speechSynthesis) return;

    window.speechSynthesis.cancel();

    setTimeout(() => {
      const utterance = new SpeechSynthesisUtterance(text);
      const voices = window.speechSynthesis.getVoices();

      utterance.voice = getSweetVoice(voices);
      utterance.rate = 0.95;
      utterance.pitch = 1.1;
      
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => {
        setIsSpeaking(false);
        // LOOP MAGIC: Auto-start the mic when she finishes her AI response
        if (sessionActive.current && recognition) {
          try { recognition.start(); } catch(e) { console.error(e); }
        }
      };

      window.speechSynthesis.speak(utterance);
    }, 50);
  };

  // Dynamic Status
  let statusText = "Speak your mind. The AI will listen and advise.";
  if (!sessionActive.current) statusText = "Click the mic to start a session.";
  else if (isSpeaking) statusText = "InnerLift is speaking...";
  else if (isProcessing) statusText = "Thinking deeply...";
  else if (isListening) statusText = "Listening to you... (Speak now)";

  if (!recognition) {
    return <div className="p-8 border text-sm text-red-500">Browser does not support Web Speech API. Use Chrome.</div>;
  }

  return (
    <div className="border p-6 md:p-12 animate-fade-in relative overflow-hidden" style={{ borderColor: 'var(--border-subtle)', backgroundColor: 'var(--bg-secondary)' }}>
      {/* Background SVG Grid */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.03] pointer-events-none" viewBox="0 0 200 200" preserveAspectRatio="none" fill="none" stroke="currentColor" strokeWidth="0.5">
        <path d="M -50 50 Q 100 150 250 50" />
        <path d="M -50 80 Q 100 180 250 80" />
        <path d="M -50 110 Q 100 210 250 110" />
        <circle cx="50" cy="85" r="1.5" fill="currentColor" />
        <circle cx="150" cy="135" r="1.5" fill="currentColor" />
      </svg>

      <div className="text-center mb-12 relative z-10">
        <h2 className="text-2xl font-serif font-medium mb-2">Voice Mentor</h2>
        <p className={`text-sm transition-opacity duration-300 ${sessionActive.current ? 'opacity-100 font-medium' : 'opacity-60'}`}>
          {statusText}
        </p>
      </div>

      <div className="flex justify-center mb-12 relative w-24 h-24 mx-auto">
        {(isListening || isSpeaking || isProcessing) && sessionActive.current && (
          <div className="absolute inset-0 rounded-full animate-ping opacity-20" style={{ backgroundColor: 'var(--text-primary)' }}></div>
        )}

        <button
          onClick={toggleListening}
          className="absolute inset-0 z-10 rounded-full flex items-center justify-center transition border shadow-sm cursor-pointer"
          style={{
            backgroundColor: sessionActive.current ? 'var(--text-primary)' : 'var(--bg-primary)',
            color: sessionActive.current ? 'var(--bg-primary)' : 'var(--text-primary)',
            borderColor: 'var(--text-primary)'
          }}
        >
          {sessionActive.current ? (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="6" y="4" width="4" height="16" /><rect x="14" y="4" width="4" height="16" /></svg>
          ) : (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" /><path d="M19 10v2a7 7 0 0 1-14 0v-2" /><line x1="12" x2="12" y1="19" y2="22" /></svg>
          )}
        </button>
      </div>

      {micError && (
        <div className="text-center text-red-500 text-xs font-medium mb-6 animate-fade-in">
          ⚠️ {micError}
        </div>
      )}

      {sessionActive.current && (
        <div className="space-y-6 min-h-[150px]">
          {transcript && (
            <div className="flex flex-col items-end animate-fade-in">
              <span className="text-xs uppercase tracking-widest opacity-50 mb-1">You</span>
              <div className="p-4 border rounded-bl-xl rounded-t-xl max-w-[90%] md:max-w-[70%]" style={{ borderColor: 'var(--border-subtle)' }}>
                {transcript}
              </div>
            </div>
          )}

          {isProcessing && (
            <div className="flex flex-col items-start animate-fade-in">
              <span className="text-xs uppercase tracking-widest opacity-50 mb-1">InnerLift</span>
              <div className="p-4 flex gap-1 items-center">
                <div className="w-1.5 h-1.5 rounded-full animate-bounce" style={{ backgroundColor: 'var(--text-primary)' }}></div>
                <div className="w-1.5 h-1.5 rounded-full animate-bounce" style={{ backgroundColor: 'var(--text-primary)', animationDelay: '150ms' }}></div>
                <div className="w-1.5 h-1.5 rounded-full animate-bounce" style={{ backgroundColor: 'var(--text-primary)', animationDelay: '300ms' }}></div>
              </div>
            </div>
          )}

          {aiResponse && !isProcessing && (
            <div className="flex flex-col items-start animate-fade-in">
              <span className="text-xs uppercase tracking-widest opacity-50 mb-1">InnerLift</span>
              <div className="p-4 border border-l-4 rounded-br-xl rounded-t-xl max-w-[100%] md:max-w-[80%] font-serif leading-relaxed" style={{ borderColor: 'var(--border-subtle)', borderLeftColor: 'var(--text-primary)', backgroundColor: 'var(--bg-primary)' }}>
                {aiResponse}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}