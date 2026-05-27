import React, { useState, useEffect } from 'react';

export default function VoiceAssistant({ token }) {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const [transcript, setTranscript] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [micError, setMicError] = useState('');

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  // Initialize once
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
    recognition.interimResults = true; // MAGIC FIX: Turns on live typing!
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setMicError('');
      setIsListening(true);
    };

    recognition.onresult = (event) => {
      let interimText = '';
      let finalText = '';

      // Loop through the results to separate live typing from the final sentence
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          finalText += event.results[i][0].transcript;
        } else {
          interimText += event.results[i][0].transcript;
        }
      }

      // Show whatever is currently being said on the screen live
      setTranscript(finalText || interimText);

      // ONLY send to Gemini when the user is completely done talking
      if (finalText) {
        processVoiceWithAI(finalText);
      }
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      if (event.error === 'no-speech') {
        setMicError('No audio detected. Please speak louder.');
      } else if (event.error === 'not-allowed') {
        setMicError('Microphone access blocked! Look for the camera icon in your Chrome URL bar and allow it.');
      }
      setIsListening(false);
    };

    recognition.onend = () => setIsListening(false);
  }, [recognition]); // Ensure recognition is stable

  const initiateGreeting = () => {
    if (!window.speechSynthesis) {
      if (recognition) recognition.start();
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
      // Turn on the mic the exact moment she finishes speaking
      if (recognition) {
        try {
          recognition.start();
        } catch(e) {
          console.error("Mic start error:", e);
        }
      }
    };
    utterance.onerror = (e) => {
      console.error("TTS Engine Error:", e);
      setIsSpeaking(false);
    };

    window.speechSynthesis.speak(utterance);
  };

  const toggleListening = () => {
    if (isListening || isSpeaking) {
      if (recognition) recognition.stop();
      window.speechSynthesis.cancel();
      setIsListening(false);
      setIsSpeaking(false);
    } else {
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
      if (res.ok) {
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
    if (!window.speechSynthesis) {
      alert("Text-to-speech is not supported in this browser.");
      return;
    }

    window.speechSynthesis.cancel();

    setTimeout(() => {
      const utterance = new SpeechSynthesisUtterance(text);
      const voices = window.speechSynthesis.getVoices();

      utterance.voice = getSweetVoice(voices);
      utterance.rate = 0.95;
      utterance.pitch = 1.1;
      
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = (e) => {
        console.error("TTS Engine Error:", e);
        setIsSpeaking(false);
      };

      window.speechSynthesis.speak(utterance);
    }, 50);
  };

  let statusText = "Speak your mind. The AI will listen and advise.";
  if (isSpeaking) statusText = "InnerLift is speaking...";
  else if (isListening) statusText = "Listening to you... (Speak now)";
  else if (isProcessing) statusText = "Thinking deeply...";

  if (!recognition) {
    return <div className="p-8 border text-sm text-red-500">Your browser does not support the Web Speech API. Please use Chrome.</div>;
  }

  return (
    <div className="border p-6 md:p-12 animate-fade-in relative overflow-hidden" style={{ borderColor: 'var(--border-subtle)', backgroundColor: 'var(--bg-secondary)' }}>

      <svg className="absolute inset-0 w-full h-full opacity-[0.03] pointer-events-none" viewBox="0 0 200 200" preserveAspectRatio="none" fill="none" stroke="currentColor" strokeWidth="0.5">
        <path d="M -50 50 Q 100 150 250 50" />
        <path d="M -50 80 Q 100 180 250 80" />
        <path d="M -50 110 Q 100 210 250 110" />
        <circle cx="50" cy="85" r="1.5" fill="currentColor" />
        <circle cx="150" cy="135" r="1.5" fill="currentColor" />
      </svg>

      <div className="text-center mb-12 relative z-10">
        <h2 className="text-2xl font-serif font-medium mb-2">Voice Mentor</h2>
        <p className={`text-sm transition-opacity duration-300 ${isSpeaking || isListening || isProcessing ? 'opacity-100 font-medium' : 'opacity-60'}`}>
          {statusText}
        </p>
      </div>

      <div className="flex justify-center mb-12 relative w-24 h-24 mx-auto">
        {(isListening || isSpeaking) && (
          <div className="absolute inset-0 rounded-full animate-ping opacity-20" style={{ backgroundColor: 'var(--text-primary)' }}></div>
        )}

        <button
          onClick={toggleListening}
          disabled={isProcessing}
          className="absolute inset-0 z-10 rounded-full flex items-center justify-center transition border shadow-sm disabled:opacity-50 cursor-pointer"
          style={{
            backgroundColor: (isListening || isSpeaking) ? 'var(--text-primary)' : 'var(--bg-primary)',
            color: (isListening || isSpeaking) ? 'var(--bg-primary)' : 'var(--text-primary)',
            borderColor: 'var(--text-primary)'
          }}
        >
          {(isListening || isSpeaking) ? (
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

            <div className="flex flex-col md:flex-row gap-3 items-start md:items-center">
              <div className="p-4 border border-l-4 rounded-br-xl rounded-t-xl max-w-[100%] md:max-w-[80%] font-serif leading-relaxed" style={{ borderColor: 'var(--border-subtle)', borderLeftColor: 'var(--text-primary)', backgroundColor: 'var(--bg-primary)' }}>
                {aiResponse}
              </div>

              <button
                onClick={() => speakResponse(aiResponse)}
                className="flex items-center gap-2 px-4 py-2 text-xs font-medium border rounded hover:opacity-70 transition cursor-pointer"
                style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-primary)' }}
              >
                {isSpeaking ? '🔊 Speaking...' : '▶️ Play Audio'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}