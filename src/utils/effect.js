const Stats = function () {
    let e = Date.now()
        , t = e
        , i = 0
        , n = 1 / 0
        , r = 0
        , s = 0
        , o = 1 / 0
        , a = 0
        , l = 0
        , h = 0
        , c = document.createElement("div");
    c.id = "stats",
        c.addEventListener("mousedown", function (e) {
            e.preventDefault(),
                v(++h % 2)
        }, !1),
        c.style.cssText = "width:80px;opacity:0.9;cursor:pointer";
    let u = document.createElement("div");
    u.id = "fps",
        u.style.cssText = "padding:0 0 3px 3px;text-align:left;background-color:#002",
        c.appendChild(u);
    let d = document.createElement("div");
    d.id = "fpsText",
        d.style.cssText = "color:#0ff;font-family:Helvetica,Arial,sans-serif;font-size:9px;font-weight:bold;line-height:15px",
        d.innerHTML = "FPS",
        u.appendChild(d);
    let p = document.createElement("div");
    for (p.id = "fpsGraph",
             p.style.cssText = "position:relative;width:74px;height:30px;background-color:#0ff",
             u.appendChild(p); 74 > p.children.length;) {
        let f = document.createElement("span");
        f.style.cssText = "width:1px;height:30px;float:left;background-color:#113",
            p.appendChild(f)
    }
    let m = document.createElement("div");
    m.id = "ms",
        m.style.cssText = "padding:0 0 3px 3px;text-align:left;background-color:#020;display:none",
        c.appendChild(m);
    let g = document.createElement("div");
    g.id = "msText",
        g.style.cssText = "color:#0f0;font-family:Helvetica,Arial,sans-serif;font-size:9px;font-weight:bold;line-height:15px",
        g.innerHTML = "MS",
        m.appendChild(g);
    let y = document.createElement("div");
    for (y.id = "msGraph",
             y.style.cssText = "position:relative;width:74px;height:30px;background-color:#0f0",
             m.appendChild(y); 74 > y.children.length;) {
        let f = document.createElement("span");
        f.style.cssText = "width:1px;height:30px;float:left;background-color:#131",
            y.appendChild(f)
    }
    let v = function (e) {
        switch (h = e) {
            case 0:
                u.style.display = "block",
                    m.style.display = "none";
                break;
            case 1:
                u.style.display = "none",
                    m.style.display = "block"
        }
    }
        , b = function (e, t) {
        let i = e.appendChild(e.firstChild);
        i.style.height = t + "px"
    };
    return {
        REVISION: 11,
        domElement: c,
        setMode: v,
        begin: function () {
            e = Date.now()
        },
        end: function () {
            let h = Date.now();
            return i = h - e,
                n = Math.min(n, i),
                r = Math.max(r, i),
                g.textContent = i + " MS (" + n + "-" + r + ")",
                b(y, Math.min(30, 30 - 30 * (i / 200))),
                l++,
            h > t + 1e3 && (s = Math.round(1e3 * l / (h - t)),
                o = Math.min(o, s),
                a = Math.max(a, s),
                d.textContent = s + " FPS (" + o + "-" + a + ")",
                b(p, Math.min(30, 30 - 30 * (s / 100))),
                t = h,
                l = 0),
                h
        },
        update: function () {
            e = this.end()
        }
    }
};

let ctx, hue, target = {}, tendrils = [], settings = {}, uu = 0, topiary, topiary2, cnt = 0;
settings.debug = true;
settings.friction = 0.5;
settings.trails = 20;
settings.size = 50;
settings.dampening = 0.25;
settings.tension = 0.98;

Math.TWO_PI = Math.PI * 2;


export const effectOne = () => {
    ctx = document.getElementById('canvas').getContext('2d');
    ctx.stats = new Stats();
    ctx.running = true;
    ctx.frame = 1;

    hue = new Oscillator({
        phase: Math.random() * Math.TWO_PI,
        amplitude: 85,
        frequency: 0.0015,
        offset: 285
    });


    document.addEventListener('mousemove', init);
    document.addEventListener('touchstart', init);
    document.body.addEventListener('orientationchange', resize);
    window.addEventListener('resize', resize);
    resize();
}

function Oscillator(options) {
    this.init(options || {});
}

Oscillator.prototype = (function () {

    let value = 0;

    return {

        init: function (options) {
            this.phase = options.phase || 0;
            this.offset = options.offset || 0;
            this.frequency = options.frequency || 0.001;
            this.amplitude = options.amplitude || 1;
        },

        update: function () {
            this.phase += this.frequency;
            value = this.offset + Math.sin(this.phase) * this.amplitude;
            return value;
        },

        value: function () {
            return value;
        }
    };

})();


function Tendril(options) {
    this.init(options || {});
}

Tendril.prototype = (function () {

    function Node() {
        this.x = 0;
        this.y = 0;
        this.vy = 0;
        this.vx = 0;
    }

    return {

        init: function (options) {

            this.spring = options.spring + (Math.random() * 0.1) - 0.05;
            this.friction = settings.friction + (Math.random() * 0.01) - 0.005;
            this.nodes = [];

            for (let i = 0, node; i < settings.size; i++) {

                node = new Node();
                node.x = target.x;
                node.y = target.y;

                this.nodes.push(node);
            }
        },

        update: function () {

            let spring = this.spring,
                node = this.nodes[0];

            node.vx += (target.x - node.x) * spring;
            node.vy += (target.y - node.y) * spring;

            for (let prev, i = 0, n = this.nodes.length; i < n; i++) {

                node = this.nodes[i];

                if (i > 0) {

                    prev = this.nodes[i - 1];

                    node.vx += (prev.x - node.x) * spring;
                    node.vy += (prev.y - node.y) * spring;
                    node.vx += prev.vx * settings.dampening;
                    node.vy += prev.vy * settings.dampening;
                }

                node.vx *= this.friction;
                node.vy *= this.friction;
                node.x += node.vx;
                node.y += node.vy;

                spring *= settings.tension;
            }
        },

        draw: function () {

            let x = this.nodes[0].x,
                y = this.nodes[0].y,
                a, b;

            ctx.beginPath();
            ctx.moveTo(x, y);
            let i = 1, n = this.nodes.length - 2
            for (; i < n; i++) {

                a = this.nodes[i];
                b = this.nodes[i + 1];
                x = (a.x + b.x) * 0.5;
                y = (a.y + b.y) * 0.5;

                ctx.quadraticCurveTo(a.x, a.y, x, y);
            }

            a = this.nodes[i];
            b = this.nodes[i + 1];

            ctx.quadraticCurveTo(a.x, a.y, b.x, b.y);
            ctx.stroke();
            ctx.closePath();
        }
    };

})();

// ----------------------------------------------------------------------------------------

function init(event) {

    document.removeEventListener('mousemove', init);
    document.removeEventListener('touchstart', init);

    document.addEventListener('mousemove', mousemove);
    document.addEventListener('touchmove', mousemove);
    document.addEventListener('touchstart', touchstart);

    mousemove(event);
    reset();
    loop();
}

function reset() {

    tendrils = [];

    for (let i = 0; i < settings.trails; i++) {

        tendrils.push(new Tendril({
            spring: 0.45 + 0.025 * (i / settings.trails)
        }));
    }
}

function loop() {

    if (!ctx.running) return;

    ctx.globalCompositeOperation = 'source-over';
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.globalCompositeOperation = 'lighter';
    ctx.strokeStyle = 'hsla(' + Math.round(hue.update()) + ',90%,50%,0.25)';
    ctx.lineWidth = 1;

    for (let i = 0, tendril; i < settings.trails; i++) {
        tendril = tendrils[i];
        tendril.update();
        tendril.draw();
    }

    ctx.frame++;
    ctx.stats.update();
    window.requestAnimFrame(loop);
}

function resize() {
    ctx.canvas.width = window.innerWidth;
    ctx.canvas.height = window.innerHeight;
    ctx.fillStyle = 'rgba(0,0,0,0)';
    topiary = new branch(80, 0, 0);
    topiary2 = new branch(80, 0, 0);
    // ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    anim();
}

function mousemove(event) {
    if (event.touches) {
        target.x = event.touches[0].pageX;
        target.y = event.touches[0].pageY;
    } else {
        target.x = event.clientX
        target.y = event.clientY;
    }
    event.preventDefault();
}

function touchstart(event) {
    if (event.touches.length == 1) {
        target.x = event.touches[0].pageX;
        target.y = event.touches[0].pageY;
    }
}

window.requestAnimFrame = (function () {
    return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || function (fn) {
        window.setTimeout(fn, 1000 / 60)
    };
})();


function anim() {
    cnt++;
    uu -= .5;
    if (cnt % 2) {
        ctx.save();
        ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
        ctx.translate(window.innerWidth * 0.75, window.innerHeight * 0.98);
        ctx.rotate(-Math.PI * 0.5);
        topiary.disp(ctx);
        ctx.restore();
        ctx.save();
        ctx.translate(window.innerWidth * 0.25, window.innerHeight * 0.98);
        ctx.rotate(-Math.PI * 0.5);
        topiary2.disp(ctx);
        ctx.restore();
    }
    window.requestAnimationFrame(anim);
}

function branch(len, ang, gen) {
    this.len = len;
    this.ang = ang;
    this.gen = gen;
    this.limb = [];
    this.sway = 0;
    this.mult = rnd(0.01, 0.1);
    this.spawn = 0;
    this.vel = 0;

    if (gen < 10) {
        this.limb.push(new branch(len * rnd(0.8, 0.99),
            rnd(0, Math.PI / 6), this.gen + 1));
        this.limb.push(new branch(len * rnd(0.8, 0.99),
            rnd(0, -Math.PI / 6), this.gen + 1));
    }

    this.disp = function (ctx) {
        this.sway++;
        ctx.save();
        this.vel *= 0.9;
        let dif = 1 - this.spawn;
        this.vel += (dif * 0.1);
        this.spawn += this.vel;

        ctx.strokeStyle = "hsla(" + (uu % 360) + ",100%,50%,1)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.rotate(this.ang + (Math.sin(this.sway * this.mult) * Math.PI / 128));
        ctx.moveTo(0, 0);
        ctx.lineTo(this.len * this.spawn, 0);
        ctx.stroke();

        ctx.translate(this.len * this.spawn, 0);

        if (this.spawn > 0.6) {
            for (let i = 0; i < this.limb.length; i++) {
                let limb = this.limb[i];
                limb.disp(ctx);
            }
        }
        ctx.restore();
    };
}

function rnd(min, max) {
    return Math.random() * (max - min) + min;
}




