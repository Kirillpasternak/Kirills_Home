// ── Pixel basketball animation ──
// Scale: each "pixel" = 4 real px on canvas
const canvas = document.getElementById('basketCanvas');
const ctx    = canvas.getContext('2d');

const S = 4; // pixel size
const W = canvas.width  / S; // 55
const H = canvas.height / S; // 70

// ── colour palette ──
const C = {
  bg:       null,          // transparent
  skin:     '#f5c5a3',
  hair:     '#1a1a1a',
  shirt:    '#7c5cfc',     // purple jersey
  shorts:   '#3a2a8a',
  shoes:    '#ffffff',
  shoeLine: '#cccccc',
  ball:     '#e07820',
  ballLine: '#5a2d00',
  ring:     '#e04040',
  ringPost: '#888888',
  net:      '#dddddd',
  floor:    '#2a2a35',
  floorLine:'#3a3a4a',
  shadow:   'rgba(0,0,0,0.35)',
  accent:   '#ff6b6b',
  white:    '#ffffff',
  dark:     '#0d0d0f',
};

function px(x, y, color, w=1, h=1) {
  if (!color) return;
  ctx.fillStyle = color;
  ctx.fillRect(x*S, y*S, w*S, h*S);
}

function clearAll() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

// ──────────────────────────────────────────────
//  SCENE ELEMENTS
// ──────────────────────────────────────────────

function drawFloor() {
  // floor strip
  px(0, 62, C.floor, W, 8);
  // court line
  px(0, 63, C.floorLine, W, 1);
}

function drawHoop() {
  // post
  px(38, 30, C.ringPost, 2, 32);
  // backboard
  px(35, 18, '#444466', 5, 8);
  px(35, 18, '#555577', 5, 1); // top highlight
  // ring
  px(28, 27, C.ring, 10, 2);
  // net (static)
  const netX = [29,30,31,32,33,34,35,36,37];
  netX.forEach((x, i) => {
    const depth = i < 4 ? i : 8 - i;
    for (let row = 0; row < 5; row++) {
      if ((i + row) % 2 === 0)
        px(x, 29 + row, C.net, 1, 1);
    }
  });
}

function drawShadow(px_x, groundY, r) {
  ctx.save();
  ctx.fillStyle = C.shadow;
  ctx.beginPath();
  ctx.ellipse(px_x * S + S/2, groundY * S, r * S, S * 0.6, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

// ──────────────────────────────────────────────
//  KIRILL PIXEL CHARACTER
//  poses: 'run', 'jump', 'release', 'land'
// ──────────────────────────────────────────────

function drawKirill(bx, by, pose) {
  const x = Math.round(bx);
  const y = Math.round(by);

  if (pose === 'run') {
    // RUNNING / approach pose
    // head
    px(x+2, y,   C.hair,  4, 1);
    px(x+1, y+1, C.hair,  1, 3);
    px(x+5, y+1, C.hair,  1, 3);
    px(x+2, y+1, C.skin,  3, 3);
    // eyes
    px(x+2, y+2, C.dark,  1, 1);
    px(x+4, y+2, C.dark,  1, 1);
    // body
    px(x+1, y+4, C.shirt, 4, 5);
    // number 7 on jersey (tiny)
    px(x+3, y+5, C.white, 1, 3);
    // arms (running)
    px(x,   y+4, C.shirt, 1, 3); // left arm back
    px(x+5, y+4, C.shirt, 1, 2); // right arm fwd
    px(x-1, y+6, C.skin,  1, 1); // left hand
    px(x+6, y+4, C.skin,  1, 1); // right hand (holding ball)
    // ball in right hand
    drawBall(x+6, y+3);
    // legs (running stride)
    px(x+1, y+9,  C.shorts, 2, 3);
    px(x+3, y+9,  C.shorts, 2, 3);
    px(x,   y+12, C.shoes,  2, 2); // left foot back
    px(x+4, y+12, C.shoes,  2, 2); // right foot fwd
    px(x,   y+13, C.shoeLine, 2, 1);
    px(x+4, y+13, C.shoeLine, 2, 1);

  } else if (pose === 'jump') {
    // JUMPING - body rising, ball above head
    // head
    px(x+2, y,   C.hair,  4, 1);
    px(x+1, y+1, C.hair,  1, 3);
    px(x+5, y+1, C.hair,  1, 3);
    px(x+2, y+1, C.skin,  3, 3);
    px(x+2, y+2, C.dark,  1, 1);
    px(x+4, y+2, C.dark,  1, 1);
    // right arm raised high
    px(x+5, y-2, C.shirt, 1, 4);
    px(x+6, y-4, C.skin,  1, 2); // hand
    // ball above
    drawBall(x+5, y-7);
    // left arm out for balance
    px(x,   y+3, C.shirt, 1, 3);
    px(x-1, y+5, C.skin,  1, 1);
    // body
    px(x+1, y+4, C.shirt, 4, 4);
    px(x+3, y+5, C.white, 1, 2);
    // legs tucked
    px(x+1, y+8,  C.shorts, 2, 2);
    px(x+3, y+8,  C.shorts, 2, 2);
    px(x,   y+10, C.shoes,  2, 2);
    px(x+4, y+10, C.shoes,  2, 2);
    px(x,   y+11, C.shoeLine, 2, 1);
    px(x+4, y+11, C.shoeLine, 2, 1);

  } else if (pose === 'release') {
    // RELEASE — arm fully extended upward
    // head
    px(x+2, y,   C.hair,  4, 1);
    px(x+1, y+1, C.hair,  1, 3);
    px(x+5, y+1, C.hair,  1, 3);
    px(x+2, y+1, C.skin,  3, 3);
    px(x+3, y+2, C.dark,  1, 1);
    px(x+4, y+2, C.dark,  1, 1);
    // arm straight up
    px(x+5, y-4, C.shirt, 1, 5);
    px(x+6, y-5, C.skin,  2, 2);
    // left arm slightly up
    px(x,   y+2, C.shirt, 1, 4);
    px(x-1, y+3, C.skin,  1, 2);
    // body
    px(x+1, y+4, C.shirt, 4, 5);
    px(x+3, y+5, C.white, 1, 2);
    // legs
    px(x+1, y+9,  C.shorts, 2, 3);
    px(x+3, y+9,  C.shorts, 2, 3);
    px(x,   y+12, C.shoes,  3, 2);
    px(x+3, y+12, C.shoes,  3, 2);
    px(x,   y+13, C.shoeLine, 3, 1);
    px(x+3, y+13, C.shoeLine, 3, 1);

  } else if (pose === 'land') {
    // LANDING — knees bent, arms down
    // head
    px(x+2, y,   C.hair,  4, 1);
    px(x+1, y+1, C.hair,  1, 3);
    px(x+5, y+1, C.hair,  1, 3);
    px(x+2, y+1, C.skin,  3, 3);
    px(x+2, y+2, C.dark,  1, 1);
    px(x+4, y+2, C.dark,  1, 1);
    // smile
    px(x+3, y+3, C.dark,  1, 1);
    // arms celebrating
    px(x-1, y+3, C.shirt, 2, 3);
    px(x-2, y+2, C.skin,  1, 2);
    px(x+5, y+3, C.shirt, 2, 3);
    px(x+7, y+2, C.skin,  1, 2);
    // body
    px(x+1, y+4, C.shirt, 4, 4);
    px(x+3, y+5, C.white, 1, 2);
    // bent knees
    px(x+1, y+8,  C.shorts, 2, 4);
    px(x+3, y+8,  C.shorts, 2, 4);
    px(x,   y+12, C.shoes,  3, 2);
    px(x+3, y+12, C.shoes,  3, 2);
    px(x,   y+13, C.shoeLine, 3, 1);
    px(x+3, y+13, C.shoeLine, 3, 1);
  }
}

function drawBall(bx, by) {
  const x = Math.round(bx);
  const y = Math.round(by);
  // 4×4 ball
  px(x,   y,   C.ball, 4, 4);
  // seam lines
  px(x+1, y,   C.ballLine, 2, 1);
  px(x,   y+1, C.ballLine, 1, 2);
  px(x+3, y+1, C.ballLine, 1, 2);
  px(x+1, y+3, C.ballLine, 2, 1);
  // highlight
  px(x+1, y+1, '#f0a040', 1, 1);
}

// ──────────────────────────────────────────────
//  BALL FLIGHT ARC  (parabola toward hoop)
// ──────────────────────────────────────────────

// Hoop opening is near pixel (28, 27) → real (30, 27) centre
// Character releases from ~(16, 14) at peak
function ballPos(t) {
  // t 0→1: ball flies from release point to basket
  const x0 = 16, y0 = 14;
  const x1 = 31, y1 = 26;
  const cx  = 22, cy  = 4;  // control point for arc
  const mt  = 1 - t;
  return {
    x: mt*mt*x0 + 2*mt*t*cx + t*t*x1,
    y: mt*mt*y0 + 2*mt*t*cy + t*t*y1,
  };
}

// ──────────────────────────────────────────────
//  ANIMATION STATE MACHINE
// ──────────────────────────────────────────────

const PHASES = [
  { name:'run',     frames: 18 },
  { name:'jump',    frames: 14 },
  { name:'release', frames: 6  },
  { name:'flight',  frames: 22 },
  { name:'land',    frames: 20 },
  { name:'pause',   frames: 30 },
];

let totalFrames = PHASES.reduce((s,p)=>s+p.frames,0);
let frame = 0;

// sparkle particles on score
let sparks = [];

function getPhase(f) {
  let acc = 0;
  for (const p of PHASES) {
    if (f < acc + p.frames) return { phase: p.name, t: (f - acc) / p.frames };
    acc += p.frames;
  }
  return { phase: 'pause', t: 1 };
}

function spawnSparks(bx, by) {
  for (let i = 0; i < 10; i++) {
    const angle = Math.random() * Math.PI * 2;
    sparks.push({
      x: bx, y: by,
      vx: Math.cos(angle) * (0.3 + Math.random() * 0.5),
      vy: Math.sin(angle) * (0.3 + Math.random() * 0.5) - 0.5,
      life: 14 + Math.random() * 8,
      color: ['#ff6b6b','#7c5cfc','#ffcc00','#ffffff'][Math.floor(Math.random()*4)],
    });
  }
}

function tickSparks() {
  sparks = sparks.filter(s => s.life > 0);
  sparks.forEach(s => {
    s.x += s.vx; s.y += s.vy; s.vy += 0.08;
    s.life--;
    ctx.fillStyle = s.color;
    ctx.globalAlpha = s.life / 22;
    ctx.fillRect(s.x * S, s.y * S, S, S);
    ctx.globalAlpha = 1;
  });
}

// ──────────────────────────────────────────────
//  MAIN LOOP
// ──────────────────────────────────────────────

// Character X positions during run (slides in from left)
function charX(phase, t) {
  if (phase === 'run')     return 2 + t * 6;
  if (phase === 'jump')    return 8 + t * 2;
  if (phase === 'release') return 10;
  if (phase === 'flight')  return 10;
  if (phase === 'land')    return 10;
  return 10;
}

// Character Y offset during jump arc
function charY(phase, t) {
  const base = 47; // feet on floor at pixel row 62-15=47
  if (phase === 'jump')    return base - Math.sin(t * Math.PI) * 16;
  if (phase === 'release') return base - 14 + t * 2;
  if (phase === 'land')    return base - 2 + t * 2;
  return base;
}

let scored = false;
let lastPhase = '';

function render() {
  clearAll();

  const { phase, t } = getPhase(frame);

  drawFloor();
  drawHoop();

  // character
  const cx = charX(phase, t);
  const cy = charY(phase, t);
  drawShadow(cx + 3, 62, phase === 'jump' ? 2 + (1-t)*1.5 : 3);
  drawKirill(cx, cy, phase === 'land' ? 'land' : phase === 'flight' ? 'release' : phase === 'release' ? 'release' : phase === 'jump' ? 'jump' : 'run');

  // flying ball
  if (phase === 'flight') {
    const bp = ballPos(t);
    drawBall(bp.x, bp.y);
    if (t > 0.95 && !scored) {
      scored = true;
      spawnSparks(31, 27);
    }
  }

  // sparks
  tickSparks();

  // reset scored flag when loop restarts
  if (phase === 'run' && lastPhase === 'pause') scored = false;
  lastPhase = phase;

  frame = (frame + 1) % totalFrames;
}

// run at ~12 fps for chunky pixel feel
setInterval(render, 1000 / 12);
