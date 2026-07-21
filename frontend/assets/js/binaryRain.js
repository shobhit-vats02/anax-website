function initBinaryRain() {
    const c = document.getElementById('binaryRain'),
          ctx = c.getContext('2d');

    function rs() {
        c.width = window.innerWidth;
        c.height = window.innerHeight;
    }
    
    rs();
    window.addEventListener('resize', rs);

    const fs = 13;
    let cols = Math.floor(c.width / fs),
        drops = Array(cols).fill(1);

    window.addEventListener('resize', () => {
        cols = Math.floor(c.width / fs);
        drops = Array(cols).fill(1);
    });

    setInterval(() => {
        ctx.fillStyle = 'rgba(0,0,0,0.05)';
        ctx.fillRect(0, 0, c.width, c.height);
        ctx.fillStyle = '#FF6B00';
        ctx.font = fs + 'px JetBrains Mono,monospace';
        
        for (let i = 0; i < drops.length; i++) {
            ctx.fillText(Math.random() > .5 ? '1' : '0', i * fs, drops[i] * fs);
            if (drops[i] * fs > c.height && Math.random() > .975) drops[i] = 0;
            drops[i]++;
        }
    }, 50);
}
