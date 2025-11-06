// ...new file...
(function(){
  function initSnow(){
    const canvas = document.getElementById('snowCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let DPR = Math.max(1, window.devicePixelRatio || 1);
    let W = window.innerWidth;
    let H = window.innerHeight;
    let flakes = [];
    let rafId;
    const COUNT = Math.max(60, Math.floor(W / 10));

    function resize(){
      DPR = Math.max(1, window.devicePixelRatio || 1);
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width = Math.round(W * DPR);
      canvas.height = Math.round(H * DPR);
      canvas.style.width = W + 'px';
      canvas.style.height = H + 'px';
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
      initFlakes();
    }

    function rand(min, max){ return Math.random() * (max - min) + min; }

    function initFlakes(){
      flakes.length = 0;
      const count = Math.min(300, Math.max(60, Math.floor(W / 8)));
      for(let i=0;i<count;i++){
        flakes.push({
          x: rand(0, W),
          y: rand(-H, H),
          r: rand(0.8, 3.2),
          speedY: rand(0.3, 2.0),
          speedX: rand(-0.6, 0.6),
          opacity: rand(0.35, 0.95),
          tilt: rand(0, Math.PI * 2),
          tiltSpeed: rand(0.001, 0.02)
        });
      }
    }

    function update(){
      for(const f of flakes){
        f.tilt += f.tiltSpeed;
        f.x += Math.sin(f.tilt) * 0.6 + f.speedX;
        f.y += f.speedY;
        if (f.y - f.r > H){
          f.y = -10;
          f.x = rand(0, W);
        }
        if (f.x > W + 20) f.x = -20;
        if (f.x < -20) f.x = W + 20;
      }
    }

    function draw(){
      ctx.clearRect(0,0,W,H);
      ctx.fillStyle = 'white';
      for(const f of flakes){
        ctx.beginPath();
        // dibujar círculo suave
        ctx.globalAlpha = Math.max(0, Math.min(1, f.opacity));
        ctx.moveTo(f.x, f.y);
        ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    }

    function loop(){
      update();
      draw();
      rafId = requestAnimationFrame(loop);
    }

    // pausar cuando no visible para ahorrar CPU
    function onVisibility(){
      if (document.hidden){
        cancelAnimationFrame(rafId);
      } else {
        rafId = requestAnimationFrame(loop);
      }
    }

    window.addEventListener('resize', resize, {passive:true});
    document.addEventListener('visibilitychange', onVisibility);

    resize();
    rafId = requestAnimationFrame(loop);
  }

  if (document.readyState === 'complete' || document.readyState === 'interactive'){
    setTimeout(initSnow, 0);
  } else {
    document.addEventListener('DOMContentLoaded', initSnow);
  }
})();