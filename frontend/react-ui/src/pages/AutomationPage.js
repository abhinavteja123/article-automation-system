import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Bot, Terminal, Play, Loader2, Sparkles, AlertTriangle } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { useToast } from '../components/ui/Toast';

function AutomationPage() {
  const [running, setRunning] = useState(false);
  const [logs, setLogs] = useState([]);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  const bottomRef = useRef(null);
  const toast = useToast();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  const addLog = (message) => {
    setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${message}`]);
  };

  const runAutomation = async () => {
    setRunning(true);
    setLogs([]);
    setSuccess(false);

    try {
      addLog('🚀 Starting AI enhancement...');
      addLog('📡 Connecting to automation server...');

      const response = await fetch('http://localhost:3001/run-automation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) throw new Error('Failed to connect to automation server');

      addLog('✅ Connected to automation server');
      addLog('⚙️ Processing articles...');
      addLog('');

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n\n').filter(line => line.trim());

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.substring(6));
              if (data.type === 'log') {
                addLog(data.message);
              } else if (data.type === 'error') {
                addLog(`❌ ERROR: ${data.message}`);
              } else if (data.type === 'complete') {
                addLog('');
                if (data.success) {
                  addLog('🎉 ' + data.message);
                  setSuccess(true);
                  toast.success("Article enhancement completed!");
                  setTimeout(() => navigate('/articles'), 3000);
                } else {
                  addLog('⚠️ ' + data.message);
                }
              }
            } catch (e) {
              console.error('Parse error', e);
            }
          }
        }
      }
    } catch (error) {
      addLog('');
      addLog('❌ Failed to connect to automation server');
      addLog('💡 Ensure the automation server is running on port 3001');
    } finally {
      setRunning(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      <Button variant="ghost" onClick={() => navigate('/articles')} className="pl-0 hover:pl-2 -ml-2">
        <ArrowLeft className="h-4 w-4 mr-2" /> Back to Articles
      </Button>

      <div className="flex items-center gap-4">
        <div className="p-3 bg-indigo-500/10 rounded-xl text-indigo-600">
          <Bot className="h-8 w-8" />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">AI Enhancement</h1>
          <p className="text-muted-foreground">Optimize articles using Gemini AI.</p>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <Card className="md:col-span-2 border-indigo-200/50 shadow-lg">
          <CardContent className="p-6 space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Terminal className="h-5 w-5 text-muted-foreground" />
                <h3 className="font-semibold">Automation Log</h3>
              </div>
              {running && <Badge variant="outline" className="animate-pulse text-indigo-600 border-indigo-200 bg-indigo-50">Processing</Badge>}
            </div>

            <div className="bg-slate-950 rounded-lg p-4 h-[400px] overflow-y-auto font-mono text-xs md:text-sm text-slate-300 shadow-inner ring-1 ring-white/10">
              {logs.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-slate-600 gap-2">
                  <Sparkles className="h-8 w-8 opacity-50 text-indigo-400" />
                  <p>AI processing logs will stream here...</p>
                </div>
              ) : (
                <div className="space-y-1.5">
                  {logs.map((log, i) => (
                    <div key={i} className="break-all border-l-2 border-transparent pl-2 hover:border-indigo-500/50">
                      {log}
                    </div>
                  ))}
                  <div ref={bottomRef} />
                </div>
              )}
            </div>

            <Button
              size="lg"
              className="w-full text-base font-semibold shadow-md bg-indigo-600 hover:bg-indigo-700"
              onClick={runAutomation}
              disabled={running}
            >
              {running ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Enhancing...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-5 w-5" /> Start Enhancement
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="border-indigo-100">
            <CardContent className="p-6">
              <h3 className="font-semibold mb-4 text-indigo-900">AI Pipeline</h3>
              <div className="space-y-4">
                <Step number="1" title="Analyze" desc="Reads original content" />
                <Step number="2" title="Research" desc="Finds competitor data" />
                <Step number="3" title="Enhance" desc="Gemini rewrites content" />
                <Step number="4" title="Verify" desc="Checks references" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-amber-50/50 border-amber-100">
            <CardContent className="p-4 flex gap-3 text-amber-900 text-sm">
              <AlertTriangle className="h-5 w-5 shrink-0" />
              <p>Ensure the automation server is running on port 3001.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

const Step = ({ number, title, desc }) => (
  <div className="flex gap-3">
    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-sm font-bold text-indigo-600">
      {number}
    </div>
    <div>
      <p className="font-medium text-sm leading-none mb-1 text-indigo-900">{title}</p>
      <p className="text-xs text-muted-foreground">{desc}</p>
    </div>
  </div>
)

export default AutomationPage;
