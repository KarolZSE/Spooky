    const DamageNotif = document.getElementById("DamageNotif");

    function FitFontSize() {
        let fontSize = 50;
        DamageNotif.style.fontSize = fontSize + "px";

        while (DamageNotif.scrollWidth > DamageNotif.parentElement.clientWidth && fontSize > 0) {
            fontSize -= 1;
            DamageNotif.style.fontSize = fontSize + "px";
        }
    }


    const GhostBar = document.getElementById("GhostBar");
    const GhostBarCont = GhostBar.getContext("2d", { willReadFrequently: true });
    let test = 0;
    let test2 = 0;
    let offset = 0;
    let temp = 1;
    let greensize = 0;
    let draw = true;

    // https://www.w3schools.com/graphics/canvas_gradients.asp
    function DrawTheGradient() {
        if (!draw) return;
        var gradient = GhostBarCont.createLinearGradient(80 + offset, 0, 150 - greensize + offset, 0);
        gradient.addColorStop(0, "red");
        gradient.addColorStop(0.5, "green");
        gradient.addColorStop(1, "red");

        GhostBarCont.fillStyle = gradient;
        GhostBarCont.fillRect(0, 0, GhostBar.width, GhostBar.height);
    }

    DrawTheGradient();
    setInterval(() => {
        offset += temp;
        if (offset >= 80 + greensize / 2) {
            temp = -1;
            // delete the other if and change temp = -10; in to, 
            // offset = -90, if you want to make it go around.
        } else if (offset <= -90) {
            temp = 1;
        }
        DrawTheGradient();
    }, 10);

    let UserClicks = false;
    let FirstTime = true;

    GhostBar.addEventListener("mousedown", () => {
        UserClicks = true;
    });
    
    GhostBar.addEventListener("mouseup", () => {
        UserClicks = false;
    });

    const AttackDamage = document.getElementById("AttackDamage");

    const Enemy_max_healt = document.getElementById("Enemy_max_healt");
    const Enemy_healt = document.getElementById("Enemy_healt");

    const Player_healt = document.getElementById('Player_healt');

    let mousex = 0;
    let mousey = 0;

    const OLDparrent = GhostBar.parentElement;

    GhostBar.addEventListener("mousemove", (e) => {
        
        const rect = GhostBar.getBoundingClientRect();

        mousex = e.clientX;
        mousey = e.clientY;

        const width = Math.min(5, GhostBar.width - Math.max(0, (e.clientX - rect.left) - 2));
        const height = Math.min(5, GhostBar.height - Math.max(0, (e.clientY - rect.top) - 2));

        const pixel = GhostBarCont.getImageData(Math.max(0, (e.clientX - rect.left) - 2), Math.max(0, (e.clientY - rect.top) - 2), width, height).data;

        for (let i = 0; i < pixel.length; i += 4) {
            const r = pixel[i];
            const g = pixel[i + 1];
            const b = pixel[i + 2];

            if (b === 255) {
                Player_healt.textContent = (Number(Player_healt.textContent) - (Math.random() * 2 + 1)).toFixed(2);
            }

            if (r < 255) {
                // console.log(r,g,b);
                test = Math.max(g, test);
                // test2 = Math.max(r, test2);
                // console.log(test, test2);
                if (!UserClicks || !FirstTime) return;
                FirstTime = UserClicks = false;
                if (greensize <= 50) greensize += 10;

                AttackDamage.textContent = (g * 2 / test).toFixed(2);
                Enemy_healt.textContent = (Number(Enemy_healt.textContent) - (g * 2 / test)).toFixed(2);
                FitFontSize();
                setTimeout(() => {
                    FirstTime = true;
                }, 100);
            }

            if (r === 255) {
                if (!UserClicks || !FirstTime) return;
                FirstTime = UserClicks = false;
                console.log("You missed now it enemy's turn");
                greensize = 0;
                draw = false;

                document.body.appendChild(GhostBar);
                const rect = GhostBar.getBoundingClientRect();
                GhostBar.style.position = 'absolute';
                GhostBar.style.top = rect.top + 'px';
                GhostBar.style.left = rect.left + 'px';
                
                GhostBar.offsetHeight;

                GhostBar.width = window.innerWidth;
                GhostBar.height = window.innerHeight;
                GhostBar.style.width = window.innerWidth + 'px';
                GhostBar.style.height = window.innerHeight + 'px';

                GhostBar.style.top = '0px';
                GhostBar.style.left = '0px';


                DrawAndMoveCircle(GhostBar.width * Math.random(), GhostBar.height * Math.random());

                setTimeout(() => {
                    GhostBar.style.transition = 'none';
                    OLDparrent.appendChild(GhostBar);

                    GhostBar.style.position = 'relative';

                    GhostBar.style.width = '';
                    GhostBar.style.height = '';
                    
                    GhostBar.style.top = '';
                    GhostBar.style.left = '';

                    GhostBar.width = '200';
                    GhostBar.height = '50';
                    
                    GhostBar.offsetHeight;

                    GhostBar.style.transition = '';
                    FirstTime = true;
                    draw = true;
                }, 10000);
            }
            
            if (!UserClicks) return;
            console.log(r)
        }

        if (Number(Enemy_healt.textContent) <= 0) {
            console.log('You Win!');
        }
    });

    function DrawAndMoveCircle(xc, yc) {
        if (draw) return;
        GhostBarCont.fillStyle = '#000000';
        GhostBarCont.fillRect(0, 0, GhostBar.width, GhostBar.height);

        GhostBarCont.imageSmoothingEnabled = false;
        const GhostCanvas = new Image();
        GhostCanvas.src = 'Halloween Characters/Ghost/Png_animation/Ghost1.png';
        GhostCanvas.onload = () => {            
            GhostBarCont.save();

            GhostBarCont.translate(xc, yc);

            if (mousex - xc < 3) {
                GhostBarCont.scale(1, 1);
            } else if (mousex - xc > 3) GhostBarCont.scale(-1, 1);

            GhostBarCont.drawImage(GhostCanvas, -100, -100, 200, 200);

            GhostBarCont.restore();
        };


        setTimeout(() => {
            if (mousex - xc < 0) {
                xc -= 3; 
            } else xc += 3;
            if (mousey - yc < 0) {
                yc -= 3; 
            } else yc += 3;
            DrawAndMoveCircle(xc, yc);  
        }, 10);
    }

    const outside = document.getElementById('outside');
    const Player = document.getElementById('PlayerOutside');

    const jumpscare = document.getElementById("jumpscare");
    const trigger = document.getElementById('trigger');
    const BGM = new Audio('backgroundmusic.mp3');

    const darkness = document.getElementById('darkness')

    let slide = 0;
    let lastChange = 0;
    let change = 1;
    let infight = false;

    outside.addEventListener('mousemove', function(e) {
        if (infight) return;
        let x = e.clientX - outside.offsetLeft - Player.offsetWidth / 2;
        let y = e.clientY - outside.offsetTop - Player.offsetHeight / 2;

        x = Math.max(0, Math.min(x, outside.offsetWidth - Player.offsetWidth));
        y = Math.max(0, Math.min(y, outside.offsetHeight - Player.offsetHeight));

        OldX = Player.offsetLeft;
        OldY = Player.offsetTop;

        Player.style.left = x + 'px';
        Player.style.top = y + 'px';

        document.querySelectorAll('.Wall').forEach(e => {
            if (isColliding(e, Player)) {
                Player.style.left = OldX + 'px';
                Player.style.top = OldY + 'px';    
            } else {
                const now = Date.now();
                if (now - lastChange > 100) {
                    Player.style.backgroundPosition = `-${100 * slide++}px -400px`;
                    if (slide >= 6) slide = 0;
                    lastChange = now;
                }
            }
        });

        darkness.style.background = `radial-gradient(
            circle 100px at ${Player.offsetLeft + Player.offsetWidth / 2}px ${Player.offsetTop + Player.offsetHeight / 2}px,
            rgba(0, 0, 0, 0) 0%,
            rgba(0, 0, 0, 0.99) 80%
        )`;

        if (isColliding(trigger, Player)) {
            // darkness.style.display = 'none';
            jumpscare.style.display = 'inline';    
            trigger.remove();
            const ColorChange = setInterval(() => {
                if (change === 1) {
                    jumpscare.style.filter = 'sepia(0) saturate(1000000%) hue-rotate(-70deg)';
                } else {
                    jumpscare.style.filter = '';
                }
                change *= -1;
            }, 100);
            setTimeout(() => {
                clearInterval(ColorChange);
                document.getElementById('Container').style.display = 'flex';
                jumpscare.style.display = '';
                //outside.style.display = 'none';
                infight = true;
                FitFontSize();
            }, 1400);
        }
    });

    function isColliding(e1, e2) {
        const rect1 = e1.getBoundingClientRect();
        const rect2 = e2.getBoundingClientRect();

        return !(
            rect1.top > rect2.bottom ||
            rect1.bottom < rect2.top ||
            rect1.left > rect2.right ||
            rect1.right < rect2.left
        );
    }

    const Menubutton = document.getElementById('Menubutton');
    Menubutton.onclick = function() {
        BGM.play();
    }