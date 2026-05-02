# REDROOM Custom Frontend

### Here is the following code to connect to the server with a custom frontend feel free to make your own off the one provided

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>REDROOM</title>
  <link href="https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Orbitron:wght@400;700;900&family=Rajdhani:wght@300;400;600&display=swap" rel="stylesheet">
  <style>
    :root {
      --neon-red:   #ff2244;
      --neon-cyan:  #00f5ff;
      --neon-green: #00ff88;
      --bg-deep:    #050508;
      --bg-card:    #0a0a10;
      --bg-panel:   #0f0f18;
      --border-dim: rgba(255,34,68,0.2);
      --border-glow:rgba(255,34,68,0.7);
      --text-primary:#e8e8f0;
      --text-dim:   #5a5a7a;
    }

    * { margin: 0; padding: 0; box-sizing: border-box; }

    body {
      font-family: 'Rajdhani', sans-serif;
      background: var(--bg-deep);
      color: var(--text-primary);
      height: 100vh;
      overflow: hidden;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    /* Grid overlay */
    body::before {
      content: '';
      position: fixed; inset: 0;
      background-image:
        linear-gradient(rgba(255,34,68,0.04) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255,34,68,0.04) 1px, transparent 1px);
      background-size: 40px 40px;
      pointer-events: none; z-index: 0;
    }
    /* Scanline overlay */
    body::after {
      content: '';
      position: fixed; inset: 0;
      background: repeating-linear-gradient(
        to bottom,
        transparent 0px, transparent 3px,
        rgba(0,0,0,0.08) 3px, rgba(0,0,0,0.08) 4px
      );
      pointer-events: none; z-index: 100;
    }

    /* ── CARD ─────────────────────────────────────────────────────────────── */
    .card {
      width: 100%;
      max-width: 480px;
      background: var(--bg-card);
      border: 1px solid var(--border-dim);
      border-radius: 2px;
      height: 82vh;
      display: flex;
      flex-direction: column;
      position: relative;
      z-index: 1;
      box-shadow:
        0 0 0 1px rgba(255,34,68,0.05),
        0 0 40px rgba(255,34,68,0.08),
        0 0 80px rgba(0,0,0,0.8),
        inset 0 1px 0 rgba(255,255,255,0.03);
      animation: cardReveal 0.6s cubic-bezier(0.16, 1, 0.3, 1) both;
    }
    @keyframes cardReveal {
      from { opacity: 0; transform: translateY(20px) scale(0.97); }
      to   { opacity: 1; transform: translateY(0) scale(1); }
    }
    /* Corner brackets */
    .card::before, .card::after {
      content: ''; position: absolute;
      width: 12px; height: 12px;
      border-color: var(--neon-red); border-style: solid; z-index: 2;
    }
    .card::before { top: -1px; left: -1px; border-width: 2px 0 0 2px; }
    .card::after  { bottom: -1px; right: -1px; border-width: 0 2px 2px 0; }

    /* ── HEADER ───────────────────────────────────────────────────────────── */
    .header {
      padding: 18px 24px 14px;
      border-bottom: 1px solid var(--border-dim);
      flex-shrink: 0;
      display: flex; align-items: center; justify-content: space-between;
    }
    .header-logo {
      font-family: 'Share Tech Mono', monospace;
      font-size: 10px; letter-spacing: 0.35em; color: var(--text-dim); margin-bottom: 4px;
    }
    .header h2 {
      font-family: 'Orbitron', monospace;
      font-size: 20px; font-weight: 900; letter-spacing: 0.05em;
    }
    .header h2 span { color: var(--neon-red); text-shadow: 0 0 20px var(--neon-red), 0 0 40px rgba(255,34,68,0.4); }
    .header-badge {
      display: flex; align-items: center; gap: 6px;
      font-family: 'Share Tech Mono', monospace;
      font-size: 10px; color: var(--neon-cyan); letter-spacing: 0.1em;
    }
    .pulse-dot {
      width: 6px; height: 6px; border-radius: 50%;
      background: var(--neon-cyan); box-shadow: 0 0 8px var(--neon-cyan);
      animation: pulseDot 2s ease-in-out infinite;
    }
    @keyframes pulseDot {
      0%,100% { opacity:1; transform:scale(1); }
      50%      { opacity:0.4; transform:scale(0.7); }
    }

    /* ── SECTION LABEL ────────────────────────────────────────────────────── */
    .section-label {
      padding: 14px 24px 8px;
      font-family: 'Share Tech Mono', monospace;
      font-size: 10px; letter-spacing: 0.25em; color: var(--text-dim);
      border-bottom: 1px solid rgba(255,34,68,0.07); flex-shrink: 0;
    }

    /* ── ROOM LIST ────────────────────────────────────────────────────────── */
    #room-list-ul {
      list-style: none; flex-grow: 1; overflow-y: auto; padding: 12px;
    }
    #room-list-ul::-webkit-scrollbar { width: 3px; }
    #room-list-ul::-webkit-scrollbar-thumb { background: var(--border-dim); }

    .room-item {
      padding: 14px 18px; background: var(--bg-panel); margin-bottom: 8px;
      border-radius: 2px; cursor: pointer; transition: all 0.2s ease;
      border: 1px solid transparent;
      display: flex; align-items: center; gap: 12px;
      position: relative; overflow: hidden;
      animation: itemSlide 0.4s cubic-bezier(0.16,1,0.3,1) both;
    }
    .room-item:nth-child(1) { animation-delay: 0.05s; }
    .room-item:nth-child(2) { animation-delay: 0.10s; }
    .room-item:nth-child(3) { animation-delay: 0.15s; }
    .room-item:nth-child(4) { animation-delay: 0.20s; }
    @keyframes itemSlide {
      from { opacity:0; transform:translateX(-10px); }
      to   { opacity:1; transform:translateX(0); }
    }
    .room-item::before {
      content: ''; position: absolute;
      left: 0; top: 0; bottom: 0; width: 2px;
      background: var(--neon-red); transform: scaleY(0); transition: transform 0.2s ease;
    }
    .room-item:hover { background: rgba(255,34,68,0.05); border-color: var(--border-dim); transform: translateX(2px); }
    .room-item:hover::before { transform: scaleY(1); }
    .room-icon { font-family: 'Share Tech Mono', monospace; font-size: 11px; color: var(--neon-red); opacity: 0.6; }
    .room-name { font-family: 'Rajdhani', sans-serif; font-size: 16px; font-weight: 600; letter-spacing: 0.05em; flex-grow: 1; }
    .room-arrow { font-size: 12px; color: var(--text-dim); transition: color 0.2s, transform 0.2s; }
    .room-item:hover .room-arrow { color: var(--neon-red); transform: translateX(3px); }

    .empty-state {
      text-align: center; padding: 40px 20px;
      color: var(--text-dim); font-family: 'Share Tech Mono', monospace;
      font-size: 12px; line-height: 2; letter-spacing: 0.1em;
    }

    /* ── FAB ──────────────────────────────────────────────────────────────── */
    .fab {
      position: absolute; bottom: 24px; right: 24px;
      width: 46px; height: 46px;
      background: var(--neon-red); color: white;
      border: none; border-radius: 2px;
      font-size: 20px; cursor: pointer;
      box-shadow: 0 0 20px rgba(255,34,68,0.5), 0 0 40px rgba(255,34,68,0.2);
      transition: all 0.2s ease;
      font-family: 'Orbitron', monospace; font-weight: 700;
    }
    .fab:hover { box-shadow: 0 0 30px rgba(255,34,68,0.8), 0 0 60px rgba(255,34,68,0.3); transform: scale(1.05); }

    /* ── AUTH FORM ────────────────────────────────────────────────────────── */
    .auth-body {
      flex-grow: 1; padding: 24px;
      display: flex; flex-direction: column; gap: 14px;
    }
    .field-group { display: flex; flex-direction: column; gap: 5px; }
    .field-label {
      font-family: 'Share Tech Mono', monospace;
      font-size: 9px; letter-spacing: 0.3em; color: var(--text-dim);
    }
    input {
      background: var(--bg-panel); border: 1px solid var(--border-dim);
      color: var(--text-primary); border-radius: 2px;
      padding: 12px 14px; font-family: 'Rajdhani', sans-serif;
      font-size: 15px; font-weight: 400; outline: none;
      transition: border-color 0.2s, box-shadow 0.2s; width: 100%;
    }
    input:focus { border-color: rgba(255,34,68,0.6); box-shadow: 0 0 0 3px rgba(255,34,68,0.08), inset 0 0 12px rgba(255,34,68,0.04); }
    input::placeholder { color: var(--text-dim); }
    input:disabled { opacity: 0.4; cursor: not-allowed; }

    .btn-primary {
      background: var(--neon-red); color: white; border: none;
      border-radius: 2px; padding: 13px; cursor: pointer;
      font-family: 'Orbitron', monospace; font-size: 11px;
      font-weight: 700; letter-spacing: 0.15em;
      box-shadow: 0 0 20px rgba(255,34,68,0.3); transition: all 0.2s;
    }
    .btn-primary:hover { box-shadow: 0 0 30px rgba(255,34,68,0.6); transform: translateY(-1px); }

    .btn-ghost {
      background: transparent; color: var(--text-dim);
      border: 1px solid var(--border-dim); border-radius: 2px;
      padding: 12px; cursor: pointer;
      font-family: 'Share Tech Mono', monospace; font-size: 11px;
      letter-spacing: 0.1em; transition: all 0.2s;
    }
    .btn-ghost:hover { color: var(--text-primary); border-color: rgba(255,34,68,0.4); }

    /* ── CHAT HEADER ──────────────────────────────────────────────────────── */
    .chat-header {
      padding: 16px 20px 14px;
      border-bottom: 1px solid var(--border-dim);
      flex-shrink: 0;
      display: flex; align-items: center; justify-content: space-between;
    }
    .chat-room-label {
      font-family: 'Share Tech Mono', monospace;
      font-size: 9px; letter-spacing: 0.3em; color: var(--text-dim); margin-bottom: 3px;
    }
    #room-display {
      font-family: 'Orbitron', monospace; font-size: 15px; font-weight: 700;
      color: var(--neon-red); text-shadow: 0 0 15px rgba(255,34,68,0.5);
      letter-spacing: 0.08em;
    }
    .header-btns { display: flex; gap: 6px; }
    .btn-icon {
      padding: 5px 10px;
      background: transparent; border: 1px solid var(--border-dim);
      border-radius: 2px; color: var(--text-dim); cursor: pointer;
      font-family: 'Share Tech Mono', monospace; font-size: 9px;
      letter-spacing: 0.1em; transition: all 0.2s;
    }
    .btn-icon:hover  { color: var(--text-primary); border-color: rgba(255,34,68,0.4); }
    .btn-icon.snd-on { color: var(--neon-cyan); border-color: rgba(0,245,255,0.3); }
    .btn-icon.leave:hover { color: var(--neon-red); border-color: var(--border-glow); }

    /* ── VOICE BAR ────────────────────────────────────────────────────────── */
    .voice-join-btn {
      margin: 8px 12px 0;
      padding: 8px 14px;
      background: transparent;
      color: var(--neon-green);
      border: 1px solid rgba(0,255,136,0.35);
      border-radius: 2px; cursor: pointer;
      font-family: 'Share Tech Mono', monospace;
      font-size: 10px; letter-spacing: 0.12em; font-weight: 600;
      transition: background 0.15s, box-shadow 0.15s;
      flex-shrink: 0;
    }
    .voice-join-btn:hover { background: rgba(0,255,136,0.08); box-shadow: 0 0 12px rgba(0,255,136,0.2); }

    .voice-bar {
      margin: 8px 12px 0;
      background: rgba(0,255,136,0.04);
      border: 1px solid rgba(0,255,136,0.2);
      border-radius: 2px; padding: 8px 12px;
      display: flex; justify-content: space-between; align-items: center;
      gap: 8px; flex-shrink: 0; flex-wrap: wrap;
    }
    .voice-bar-left { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; min-width: 0; }
    .voice-label {
      font-family: 'Share Tech Mono', monospace;
      font-size: 9px; letter-spacing: 0.15em; color: var(--neon-green);
      text-transform: uppercase; flex-shrink: 0;
    }
    .voice-live-dot {
      width: 5px; height: 5px; border-radius: 50%;
      background: var(--neon-green); box-shadow: 0 0 6px var(--neon-green);
      animation: pulseDot 1.2s ease-in-out infinite; flex-shrink: 0;
    }
    .voice-chips { display: flex; gap: 6px; flex-wrap: wrap; }
    .voice-chip {
      display: flex; align-items: center; gap: 5px;
      background: rgba(0,255,136,0.06); border: 1px solid rgba(0,255,136,0.2);
      padding: 3px 8px 3px 4px; border-radius: 12px; font-size: 11px;
      font-family: 'Rajdhani', sans-serif;
    }
    .voice-avatar {
      width: 20px; height: 20px; border-radius: 50%;
      background: rgba(0,255,136,0.15); color: var(--neon-green);
      display: inline-flex; align-items: center; justify-content: center;
      font-family: 'Share Tech Mono', monospace; font-size: 9px; font-weight: 700;
      transition: all 0.1s; flex-shrink: 0;
    }
    .voice-avatar.speaking {
      background: var(--neon-green); color: #000;
      box-shadow: 0 0 0 3px rgba(0,255,136,0.3);
    }
    .voice-avatar.muted { background: rgba(255,34,68,0.1); color: var(--neon-red); }
    .vc-connecting { animation: vcPulse 1s infinite; }
    @keyframes vcPulse { 0%,100%{opacity:1;} 50%{opacity:0.4;} }

    .voice-controls { display: flex; gap: 6px; flex-shrink: 0; }
    .voice-controls button {
      padding: 4px 9px; font-size: 10px; font-weight: 600;
      border-radius: 2px; cursor: pointer;
      font-family: 'Share Tech Mono', monospace; letter-spacing: 0.08em;
      transition: all 0.15s;
    }
    #mute-btn {
      background: transparent; color: var(--neon-green);
      border: 1px solid rgba(0,255,136,0.3);
    }
    #mute-btn:hover { background: rgba(0,255,136,0.08); }
    #mute-btn.muted { color: var(--neon-red); border-color: rgba(255,34,68,0.4); background: rgba(255,34,68,0.06); }
    .vc-leave-btn {
      background: rgba(255,34,68,0.08); color: var(--neon-red);
      border: 1px solid rgba(255,34,68,0.3);
    }
    .vc-leave-btn:hover { background: rgba(255,34,68,0.18); }

    /* ── MESSAGES ─────────────────────────────────────────────────────────── */
    #messages {
      flex-grow: 1; list-style: none; overflow-y: auto;
      padding: 10px 16px; margin: 0;
    }
    #messages::-webkit-scrollbar { width: 3px; }
    #messages::-webkit-scrollbar-thumb { background: var(--border-dim); }
    #messages li {
      padding: 7px 0; border-bottom: 1px solid rgba(255,34,68,0.05);
      word-wrap: break-word; font-size: 14px; line-height: 1.5;
      display: flex; gap: 8px; align-items: baseline;
    }
    .msg-user {
      font-family: 'Share Tech Mono', monospace; font-size: 11px;
      color: var(--neon-red); flex-shrink: 0; letter-spacing: 0.05em;
    }
    .msg-sep { color: var(--text-dim); flex-shrink: 0; font-size: 11px; }
    .msg-text { color: var(--text-primary); font-family: 'Rajdhani', sans-serif; }

    /* ── CHAT INPUT ───────────────────────────────────────────────────────── */
    .chat-input-area {
      padding: 12px 16px;
      border-top: 1px solid var(--border-dim);
      display: flex; align-items: center; gap: 10px;
      flex-shrink: 0;
    }
    .prompt {
      font-family: 'Share Tech Mono', monospace;
      font-size: 13px; color: var(--neon-red); opacity: 0.7; flex-shrink: 0;
    }
    #chat-input {
      flex-grow: 1; background: transparent;
      border: none; border-bottom: 1px solid var(--border-dim);
      border-radius: 0; padding: 6px 0; font-size: 14px; width: auto;
    }
    #chat-input:focus { border-color: rgba(255,34,68,0.5); box-shadow: none; background: transparent; }
    .send-btn {
      background: transparent; border: 1px solid var(--border-dim);
      color: var(--neon-red); border-radius: 2px;
      min-width: 56px; height: 34px; cursor: pointer;
      font-family: 'Share Tech Mono', monospace; font-size: 10px;
      letter-spacing: 0.1em; transition: all 0.2s;
      display: flex; align-items: center; justify-content: center;
      flex-shrink: 0; padding: 0 10px;
    }
    .send-btn:hover:not(:disabled) { background: rgba(255,34,68,0.1); border-color: var(--border-glow); box-shadow: 0 0 15px rgba(255,34,68,0.2); }
    .send-btn:disabled { color: var(--text-dim); border-color: rgba(255,34,68,0.08); cursor: not-allowed; }

    .hidden { display: none !important; }
  </style>
</head>
<body>

  <!-- ── ROOM LIST ────────────────────────────────────────────────────────── -->
  <div id="view-list" class="card">
    <div class="header">
      <div>
        <div class="header-logo">// ENCRYPTED CHANNEL</div>
        <h2><span>RED</span>ROOM</h2>
      </div>
      <div class="header-badge">
        <div class="pulse-dot"></div>
        LIVE
      </div>
    </div>
    <div class="section-label">// Active Channels</div>
    <ul id="room-list-ul"></ul>
    <button class="fab" onclick="showCreate()">+</button>
  </div>

  <!-- ── AUTH ─────────────────────────────────────────────────────────────── -->
  <div id="view-auth" class="card hidden">
    <div class="header">
      <div>
        <div class="header-logo">// ACCESS CONTROL</div>
        <h2 id="auth-title"><span>JOIN</span> CHANNEL</h2>
      </div>
    </div>
    <div class="auth-body">
      <div class="field-group">
        <div class="field-label">// Handle</div>
        <input type="text" id="username" placeholder="your_alias">
      </div>
      <div class="field-group">
        <div class="field-label">// Channel ID</div>
        <input type="text" id="roomName" placeholder="channel_name">
      </div>
      <div class="field-group">
        <div class="field-label">// Passphrase</div>
        <input type="password" id="password" placeholder="••••••••">
      </div>
      <div style="flex-grow:1"></div>
      <button class="btn-primary" onclick="submitJoin()">ENTER CHANNEL</button>
      <button class="btn-ghost" onclick="showList()">← ABORT</button>
    </div>
  </div>

  <!-- ── CHAT ─────────────────────────────────────────────────────────────── -->
  <div id="view-chat" class="card hidden">
    <div class="chat-header">
      <div>
        <div class="chat-room-label">// CHANNEL</div>
        <div id="room-display"></div>
      </div>
      <div class="header-btns">
        <button class="btn-icon snd-on" onclick="toggleSound()" id="sound-btn">◉ SND ON</button>
        <button class="btn-icon leave" onclick="leaveRoom()">✕ LEAVE</button>
      </div>
    </div>

    <!-- Voice join button -->
    <button id="voice-join-btn" class="voice-join-btn" onclick="joinVoice()">▶ JOIN VOICE CHANNEL</button>

    <!-- Voice bar (shown when in VC) -->
    <div id="voice-panel" class="hidden">
      <div class="voice-bar">
        <div class="voice-bar-left">
          <div class="voice-live-dot"></div>
          <span class="voice-label">VOICE LIVE</span>
          <div id="voice-chips" class="voice-chips"></div>
        </div>
        <div class="voice-controls">
          <button id="mute-btn" onclick="toggleMute()">MIC ON</button>
          <button class="vc-leave-btn" onclick="leaveVoiceChat()">END VC</button>
        </div>
      </div>
    </div>

    <ul id="messages"></ul>

    <form id="chat-form" class="chat-input-area">
      <span class="prompt">&gt;_</span>
      <input id="chat-input" autocomplete="off" placeholder="transmit message...">
      <button class="send-btn" id="send-btn" type="submit">SEND</button>
    </form>
  </div>

  <script src="https://cdn.socket.io/4.7.5/socket.io.min.js"></script>
  <script>
    // ── Connect to the remote backend ─────────────────────────────────────────
    const socket = io("http://redroom.dpdns.org");

    // ── App State ─────────────────────────────────────────────────────────────
    let isCreatingMode    = false;
    let myCurrentUsername = '';
    let soundEnabled      = true;

    // ── Voice State ───────────────────────────────────────────────────────────
    let localStream       = null;
    let peerConnections   = {};   // socketId -> RTCPeerConnection
    let voiceParticipants = {};   // socketId -> { username }
    let isMuted           = false;
    let isInVoice         = false;
    let speakingIntervals = {};   // socketId -> animationFrame handle

    const ICE_CONFIG = {
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' },
        { urls: 'stun:stun.cloudflare.com:3478' }
      ]
    };

    // ── Notification Sound ────────────────────────────────────────────────────
    function playNotificationSound() {
      if (!soundEnabled) return;
      try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(600, ctx.currentTime);
        osc.connect(gain); gain.connect(ctx.destination);
        osc.start();
        gain.gain.exponentialRampToValueAtTime(0.00001, ctx.currentTime + 0.15);
        osc.stop(ctx.currentTime + 0.15);
      } catch(e) {}
    }

    function toggleSound() {
      soundEnabled = !soundEnabled;
      const btn = document.getElementById('sound-btn');
      if (soundEnabled) { btn.textContent = '◉ SND ON'; btn.classList.add('snd-on'); }
      else              { btn.textContent = '○ SND OFF'; btn.classList.remove('snd-on'); }
    }

    // ── Room List ─────────────────────────────────────────────────────────────
    socket.on('room-list', (rooms) => {
      const ul = document.getElementById('room-list-ul');
      ul.innerHTML = '';
      if (!rooms.length) {
        ul.innerHTML = '<div class="empty-state">No channels detected.<br>Create one to begin.</div>';
        return;
      }
      rooms.forEach(name => {
        const li = document.createElement('li');
        li.className = 'room-item';
        li.innerHTML = `<span class="room-icon">#</span><span class="room-name">${escHtml(name)}</span><span class="room-arrow">›</span>`;
        li.onclick = () => showJoin(name);
        ul.appendChild(li);
      });
    });

    // ── Navigation ────────────────────────────────────────────────────────────
    function showCreate() {
      isCreatingMode = true;
      document.getElementById('auth-title').innerHTML = '<span>NEW</span> CHANNEL';
      document.getElementById('roomName').disabled = false;
      document.getElementById('roomName').value = '';
      document.getElementById('password').value = '';
      switchView('view-auth');
    }

    function showJoin(name) {
      isCreatingMode = false;
      document.getElementById('auth-title').innerHTML = `<span>JOIN</span> ${escHtml(name).toUpperCase()}`;
      document.getElementById('roomName').value = name;
      document.getElementById('roomName').disabled = true;
      document.getElementById('password').value = '';
      switchView('view-auth');
    }

    function showList() { switchView('view-list'); }

    function submitJoin() {
      const roomName = document.getElementById('roomName').value.trim();
      const password = document.getElementById('password').value;
      const username = document.getElementById('username').value.trim();
      if (!roomName || !password || !username) return alert('Fill all fields');
      myCurrentUsername = username;
      socket.emit('join-room', { roomName, password, username, isCreating: isCreatingMode });
    }

    function leaveRoom() {
      if (isInVoice) cleanupVoice();
      socket.emit('leave-room');
      switchView('view-list');
    }

    // ── View Switch ───────────────────────────────────────────────────────────
    function switchView(id) {
      ['view-list','view-auth','view-chat'].forEach(v =>
        document.getElementById(v).classList.add('hidden')
      );
      document.getElementById(id).classList.remove('hidden');
    }

    // ── Load History ──────────────────────────────────────────────────────────
    socket.on('load history', (history) => {
      document.getElementById('room-display').innerText =
        document.getElementById('roomName').value.toUpperCase();
      switchView('view-chat');
      const box = document.getElementById('messages');
      box.innerHTML = '';
      history.forEach(msg => appendMessage(msg));
      // reset voice UI for new room
      document.getElementById('voice-join-btn').classList.remove('hidden');
      document.getElementById('voice-panel').classList.add('hidden');
    });

    socket.on('error-msg', (err) => { alert(err); });

    // ── Chat ──────────────────────────────────────────────────────────────────
    document.getElementById('chat-form').onsubmit = (e) => {
      e.preventDefault();
      const input = document.getElementById('chat-input');
      const btn   = document.getElementById('send-btn');
      if (!input.value.trim()) return;
      socket.emit('chat message', { text: input.value });
      input.value = '';
      btn.disabled = true;
      let t = 2;
      btn.textContent = t + 's';
      const timer = setInterval(() => {
        t--;
        if (t <= 0) { clearInterval(timer); btn.disabled = false; btn.textContent = 'SEND'; }
        else btn.textContent = t + 's';
      }, 1000);
    };

    socket.on('chat message', (data) => {
      if (data.username !== myCurrentUsername) playNotificationSound();
      appendMessage(data);
    });

    function appendMessage(data) {
      const li = document.createElement('li');
      li.innerHTML = `<span class="msg-user">${escHtml(data.username)}</span><span class="msg-sep">›</span><span class="msg-text">${escHtml(data.text)}</span>`;
      const box = document.getElementById('messages');
      box.appendChild(li);
      box.scrollTop = box.scrollHeight;
    }

    function escHtml(str) {
      return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
    }

    // ════════════════════════════════════════════════════════════════════════
    //  VOICE CHAT — WebRTC P2P
    // ════════════════════════════════════════════════════════════════════════

    async function joinVoice() {
      if (isInVoice) return;
      try {
        localStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
      } catch (err) {
        return alert(`Mic access denied: ${err.message}\n\nPage must be served over HTTPS or localhost.`);
      }
      isInVoice = true;
      socket.emit('voice-join');
      updateVoiceUI();
      startLocalSpeakingDetection();
    }

    function leaveVoiceChat() {
      socket.emit('voice-leave');
      cleanupVoice();
    }

    function cleanupVoice() {
      if (localStream) { localStream.getTracks().forEach(t => t.stop()); localStream = null; }
      Object.entries(peerConnections).forEach(([id, pc]) => { pc.close(); removeRemoteAudio(id); });
      peerConnections   = {};
      voiceParticipants = {};
      Object.values(speakingIntervals).forEach(cancelAnimationFrame);
      speakingIntervals = {};
      isInVoice = false;
      isMuted   = false;
      updateVoiceUI();
    }

    // Server: who's already in voice (we initiate offers to each)
    socket.on('voice-users', async (peers) => {
      for (const { socketId, username } of peers) {
        voiceParticipants[socketId] = { username };
        await createPeer(socketId, username, true);
      }
      renderVoiceChips();
    });

    socket.on('voice-user-joined', ({ socketId, username }) => {
      voiceParticipants[socketId] = { username };
      renderVoiceChips();
    });

    socket.on('voice-user-left', ({ socketId }) => {
      if (peerConnections[socketId]) { peerConnections[socketId].close(); delete peerConnections[socketId]; }
      removeRemoteAudio(socketId);
      if (speakingIntervals[socketId]) { cancelAnimationFrame(speakingIntervals[socketId]); delete speakingIntervals[socketId]; }
      delete voiceParticipants[socketId];
      renderVoiceChips();
    });

    socket.on('voice-list', () => {});  // passive — no action needed

    socket.on('webrtc-signal', async ({ from, username, signal }) => {
      try {
        if (signal.type === 'offer') {
          if (!voiceParticipants[from]) voiceParticipants[from] = { username };
          const pc = await createPeer(from, username, false);
          await pc.setRemoteDescription(new RTCSessionDescription(signal.sdp));
          const answer = await pc.createAnswer();
          await pc.setLocalDescription(answer);
          socket.emit('webrtc-signal', { to: from, signal: { type: 'answer', sdp: pc.localDescription } });
          renderVoiceChips();

        } else if (signal.type === 'answer') {
          const pc = peerConnections[from];
          if (pc && pc.signalingState !== 'stable') {
            await pc.setRemoteDescription(new RTCSessionDescription(signal.sdp));
          }

        } else if (signal.type === 'ice-candidate') {
          const pc = peerConnections[from];
          if (pc) { try { await pc.addIceCandidate(new RTCIceCandidate(signal.candidate)); } catch (_) {} }
        }
      } catch (err) { console.warn('webrtc-signal error:', err); }
    });

    async function createPeer(socketId, username, isInitiator) {
      if (peerConnections[socketId]) peerConnections[socketId].close();
      const pc = new RTCPeerConnection(ICE_CONFIG);
      peerConnections[socketId] = pc;

      if (localStream) localStream.getTracks().forEach(t => pc.addTrack(t, localStream));

      pc.onicecandidate = ({ candidate }) => {
        if (candidate)
          socket.emit('webrtc-signal', { to: socketId, signal: { type: 'ice-candidate', candidate } });
      };

      pc.onconnectionstatechange = () => {
        const chip = document.getElementById(`chip-${socketId}`);
        if (chip) chip.classList.toggle('vc-connecting', pc.connectionState === 'connecting');
      };

      pc.ontrack = ({ streams }) => {
        if (streams?.[0]) addRemoteAudio(socketId, username, streams[0]);
      };

      if (isInitiator) {
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);
        socket.emit('webrtc-signal', { to: socketId, signal: { type: 'offer', sdp: pc.localDescription } });
      }
      return pc;
    }

    function addRemoteAudio(socketId, username, stream) {
      let audio = document.getElementById(`vc-audio-${socketId}`);
      if (!audio) {
        audio = document.createElement('audio');
        audio.id = `vc-audio-${socketId}`;
        audio.autoplay = true; audio.style.display = 'none';
        document.body.appendChild(audio);
      }
      audio.srcObject = stream;
      startRemoteSpeakingDetection(socketId, stream);
    }

    function removeRemoteAudio(socketId) {
      const el = document.getElementById(`vc-audio-${socketId}`);
      if (el) { el.srcObject = null; el.remove(); }
    }

    // ── Speaking Detection ────────────────────────────────────────────────────
    function startLocalSpeakingDetection() {
      if (!localStream) return;
      try {
        const ac = new AudioContext();
        const src = ac.createMediaStreamSource(localStream);
        const analyser = ac.createAnalyser(); analyser.fftSize = 256;
        src.connect(analyser);
        const data = new Uint8Array(analyser.frequencyBinCount);
        function tick() {
          if (!isInVoice) return;
          analyser.getByteFrequencyData(data);
          const avg = data.reduce((a, b) => a + b, 0) / data.length;
          const avatar = document.getElementById('vc-self-avatar');
          if (avatar) avatar.classList.toggle('speaking', avg > 8 && !isMuted);
          speakingIntervals['self'] = requestAnimationFrame(tick);
        }
        speakingIntervals['self'] = requestAnimationFrame(tick);
      } catch (_) {}
    }

    function startRemoteSpeakingDetection(socketId, stream) {
      if (speakingIntervals[socketId]) cancelAnimationFrame(speakingIntervals[socketId]);
      try {
        const ac = new AudioContext();
        const src = ac.createMediaStreamSource(stream);
        const analyser = ac.createAnalyser(); analyser.fftSize = 256;
        src.connect(analyser);
        const data = new Uint8Array(analyser.frequencyBinCount);
        function tick() {
          if (!voiceParticipants[socketId]) return;
          analyser.getByteFrequencyData(data);
          const avg = data.reduce((a, b) => a + b, 0) / data.length;
          const avatar = document.getElementById(`vc-avatar-${socketId}`);
          if (avatar) avatar.classList.toggle('speaking', avg > 8);
          speakingIntervals[socketId] = requestAnimationFrame(tick);
        }
        speakingIntervals[socketId] = requestAnimationFrame(tick);
      } catch (_) {}
    }

    // ── Mute Toggle ───────────────────────────────────────────────────────────
    function toggleMute() {
      if (!localStream) return;
      isMuted = !isMuted;
      localStream.getAudioTracks().forEach(t => t.enabled = !isMuted);
      const btn = document.getElementById('mute-btn');
      btn.textContent = isMuted ? 'MIC OFF' : 'MIC ON';
      btn.classList.toggle('muted', isMuted);
      const selfAvatar = document.getElementById('vc-self-avatar');
      if (selfAvatar) selfAvatar.classList.toggle('muted', isMuted);
    }

    // ── Render Voice Chips ────────────────────────────────────────────────────
    function renderVoiceChips() {
      const container = document.getElementById('voice-chips');
      container.innerHTML = '';

      const selfChip = document.createElement('div');
      selfChip.className = 'voice-chip'; selfChip.id = 'vc-self-chip';
      const selfAvatar = document.createElement('span');
      selfAvatar.className = 'voice-avatar' + (isMuted ? ' muted' : '');
      selfAvatar.id = 'vc-self-avatar';
      selfAvatar.textContent = (myCurrentUsername[0] || '?').toUpperCase();
      const selfName = document.createElement('span');
      selfName.textContent = myCurrentUsername + ' (you)';
      selfChip.appendChild(selfAvatar); selfChip.appendChild(selfName);
      container.appendChild(selfChip);

      Object.entries(voiceParticipants).forEach(([id, { username }]) => {
        const chip = document.createElement('div');
        chip.className = 'voice-chip'; chip.id = `chip-${id}`;
        const avatar = document.createElement('span');
        avatar.className = 'voice-avatar'; avatar.id = `vc-avatar-${id}`;
        avatar.textContent = (username[0] || '?').toUpperCase();
        const name = document.createElement('span');
        name.textContent = username;
        chip.appendChild(avatar); chip.appendChild(name);
        container.appendChild(chip);
      });
    }

    // ── Voice UI Toggle ───────────────────────────────────────────────────────
    function updateVoiceUI() {
      document.getElementById('voice-panel').classList.toggle('hidden', !isInVoice);
      document.getElementById('voice-join-btn').classList.toggle('hidden', isInVoice);
      if (!isInVoice) document.getElementById('voice-chips').innerHTML = '';
    }
  </script>
</body>
</html>
