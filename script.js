var enable_interaction = false;
var time = 0;
var rate = 0.01;

const color_palettes =   [ ['#f205c3','#dd89b6', '#6b34e2', '#0dadf2', '#51e8f2'],
                         ['#00FFC5', '#009FFD', '#006494', '#A63446', '#FBFEF9' ], 
                         ['#004FFF', '#53FF45', '#FF0054', '#31AFD4'], 
                         ['#00FBFF', '#1884FF', '#E87BFE' ], 
                         ['#f45905','#c70d3a', '#512c62', '#45969b'], 
                         ['#3fc5f0','#42dee1', '#6decb9', '#eef5b2'], 
                         ['#6b5b95', '#feb236', '#d64162']];
                       

var color_palette_index = 0

var color_palette = color_palettes[color_palette_index];

scales = 100;

var N_gon = 8;

var FOLD = 12;

var random_colors = random_array(scales,color_palette.length);

var touch_radius = 0;

var get_mouse_pos = false;
var get_touch_pos = false;

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

draw();

function draw() {

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    ctx.fillStyle = 'rgba(0,0,0,1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    x_origin = canvas.width/2;
    y_origin = canvas.height/2;

    max = Math.max(x_origin, y_origin);

    range = [0, 2*Math.PI];
    growth = 0.1*max; 
    stretch = 0.8*max;
    arc = .3;
    fold = 2*Math.PI/FOLD;
    max_hold_time = 100;
    r_vary = 4*max;
    wiggle = 0.02*2*Math.PI + Math.PI*touch_radius


    if ((Math.floor(time*100))%2 === 0) {
        amount = Math.floor(scales) + 1;
        random_update(random_colors, 10, 3);
    }


    for (let j = 0; j < FOLD; j++) {
    polyarm(N_gon, x_origin, y_origin,
            range, scales,
            growth, stretch,
            arc, j*fold, r_vary, wiggle,
            time);
    }

    time += rate;
  
  
 
  if (enable_interaction) {
    canvas.addEventListener('mousedown', e => {
        N_gon = 3 + Math.floor(Math.random()*4);
        color_palette_index = Math.floor(Math.random()*color_palettes.length);
        color_palette = color_palettes[color_palette_index];
        get_mouse_pos = true;
        getMousePosition(canvas, e)
    });
        
    canvas.addEventListener('mouseup', e => {
        get_mouse_pos = false;
    });

    canvas.addEventListener('mousemove', function(e) {
        if(get_mouse_pos) {
        getMousePosition(canvas, e)
        }
    })

    canvas.addEventListener('touchstart', function(e) {
        event.preventDefault();      
        N_gon = 3 + Math.floor(Math.random()*4)
        color_palette_index = Math.floor(Math.random()*color_palettes.length);
        color_palette = color_palettes[color_palette_index];
        getTouchPosition(canvas,e);
        event.preventDefault();      
    }, false);


    canvas.addEventListener('touchend', function(e) {     
        get_touch_pos = false;
    }, false);

    canvas.addEventListener('touchmove', function(e) {
        getTouchPosition(canvas,e);
        event.preventDefault();
    }, false);
  }
      
 
  
  window.requestAnimationFrame(draw);
}


function polyarm(N, x_origin, y_origin, range, scales, growth, stretch, arc, rotate, r_vary, wiggle, time) {
  
  let start_angle = range[0] + rotate;
  let end_angle = range[1] + rotate;
  let angle_range = Math.abs(start_angle - end_angle);
  let a_step = angle_range/scales;
  
  
  for (let i = 1; i <= scales; i++) {
      r = stretch*i*arc*a_step + (i/scales)*r_vary*(0.5 + 0.5*Math.sin(1*time + i*wiggle));
      a = start_angle + i*a_step
      x_pos = x_origin + r*Math.cos(a);
      y_pos = y_origin + r*Math.sin(a);
      size = (i/scales)*growth;
      shift = 0;
      color = color_palette[random_colors[i-1]];
      polygon(N, color, x_pos, y_pos, size, shift) 
  }
}

function polygon(N, color, x_pos, y_pos, size, shift) {
  
  ctx.beginPath();
  ctx.moveTo(x_pos + size*Math.cos(shift*2*Math.PI),
             y_pos + size*Math.sin(shift*2*Math.PI));
  for (let i = 1; i < N; i++) {
    ctx.lineTo(x_pos + size*Math.cos((i/N + shift)*2*Math.PI),
               y_pos + size*Math.sin((i/N + shift)*2*Math.PI));
  }
  ctx.closePath();
  ctx.stroke();
  ctx.fillStyle = color; 
  ctx.fill();  
}


function random_array(length, max_val) { 
  array = Array.apply(null, Array(length)).map(function (x, i) { return parseInt(Math.floor(Math.random()*max_val)); })
  return array;
}

function random_update(array, amount, values) {
  let length = array.length;
  let selection = random_array(amount, length);
  for (let i = 0; i < amount; i++) {
    index = selection[i];
    array[index] = parseInt(Math.floor(Math.random()*values));
  }
}



function getMousePosition(canvas, event) {
    const rect = canvas.getBoundingClientRect();
    const x_origin = (rect.right - rect.left)/2;
    const y_origin = (rect.bottom - rect.top)/2;
    const x = event.clientX/x_origin - 1;
    const y = -event.clientY/y_origin + 1;
    const r = Math.sqrt(x*x + y*y)/Math.sqrt(2);
   
    touch_radius = r; 
}

function getTouchPosition(canvas, event) {
    var touch = event.touches[0];
    const rect = canvas.getBoundingClientRect()
    const x_origin = (rect.right - rect.left)/2;
    const y_origin = (rect.bottom - rect.top)/2;
    const x = touch.clientX/x_origin - 1;
    const y = -touch.clientY/y_origin + 1;
    const r = Math.sqrt(x*x + y*y)/Math.sqrt(2);
   
    touch_radius = r;   
}