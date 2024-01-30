//var options = ["$100", "$10", "$25", "$250", "$30", "$1000", "$1", "$200", "$45", "$500", "$5", "$20", "Lose", "$1000000", "Lose", "$350", "$5", "$99"];
var options = [
    { value: "Si", color: "#00FF00", weight: 90 },
    { value: "NO", color: "#FF0000", weight: 50 },
    { value: "Repetir", color: "#FFFF00", weight: 10 }
];

var clearBtn = {};
var Pregunta = "¿Debo ducharme hoy?";
var startAngle = 0;
var totalWeight = 0;
//var arc = Math.PI / (options.length / 2);
var spinTimeout = null;

var spinArcStart = 10;
var spinTime = 0;
var spinTimeTotal = 0;

var ctx;


const form = document.querySelector("form");
form.addEventListener("submit", handleSubmit);

// Get the elements by their ID
var popupLink = document.getElementById("Config");
var popupWindow = document.getElementById("popup-window");
var closeButton = document.getElementById("close-button");
var addRow = document.getElementById("addRow");


for (var i = 0; i < options.length; i++) {
    //clearBtn[i] = document.querySelector('input[type="button"]');
    //console.log(i);
    clearBtn[i] = document.getElementById('input[remove' + i + ']');
    if (clearBtn[i] != null) {
        clearBtn[i].addEventListener("click", function () {
			
        });
    }
}
// Show the pop-up window when the link is clicked
popupLink.addEventListener("click", function (event) {
    event.preventDefault();
    popupWindow.style.display = "block";
    reloadConfig();
});
// Hide the pop-up window when the close button is clicked
closeButton.addEventListener("click", function () {
    popupWindow.style.display = "none";
    reloadConfig();
    drawRouletteWheel();
});


addRow.addEventListener("click", function () {
    addRowF();
});


document.getElementById("ruleta").addEventListener("click", spin);

popupWindow.style.display = "none";
reloadConfig();
drawRouletteWheel();


function addRowF() {
    options.push({ value: "Yes", color: "#00FF00", weight: 100 });
    reloadConfig();
};

function computeTotalWeight() {
    var weight = 0;
    for (var i = 0; i < options.length; i++) {
        weight += options[i].weight;
    }
    return weight;
}
/*
function byte2Hex(n) {
  var nybHexString = "0123456789ABCDEF";
  return (
    String(nybHexString.substr((n >> 4) & 0x0f, 1)) +
    nybHexString.substr(n & 0x0f, 1)
  );
}
*/
function RGB2Color(r, g, b) {
    return "#" + byte2Hex(r) + byte2Hex(g) + byte2Hex(b);
}

function getColor(item, maxitem) {
    var phase = 0;
    var center = 128;
    var width = 127;
    var frequency = (Math.PI * 2) / maxitem;

    red = Math.sin(frequency * item + 2 + phase) * width + center;
    green = Math.sin(frequency * item + 0 + phase) * width + center;
    blue = Math.sin(frequency * item + 4 + phase) * width + center;

    return RGB2Color(red, green, blue);
}

function drawRouletteWheel() {
    var canvas = document.getElementById("canvas");
    if (canvas.getContext) {
        ctx = canvas.getContext("2d");

        ctx.canvas.width = window.innerWidth;
        ctx.canvas.height = window.innerHeight;

        var sizeWidth = Math.min(window.innerWidth, window.innerHeight);
        var outsideRadius = sizeWidth / 2 - 5;
        var insideRadius = outsideRadius / 4;
        var textRadius = (outsideRadius - insideRadius) * 0.6 + insideRadius;


        ctx.strokeStyle = "white";
        ctx.lineWidth = 0;

        ctx.font = "bold " + sizeWidth / 20 + "px Helvetica, Arial";

        totalWeight = computeTotalWeight();

        for (var i = 0; i < options.length; i++) {
            var arc = (options[i].weight / totalWeight) * 2 * Math.PI;

            var angle = startAngle;
            for (var j = 0; j < i; j++) {
                angle += (options[j].weight / totalWeight) * 2 * Math.PI;
            }

            ctx.fillStyle = options[i].color;

            ctx.beginPath();
            ctx.arc(
                window.innerWidth / 2,
                window.innerHeight / 2,
                outsideRadius,
                angle,
                angle + arc,
                false
            );
            ctx.arc(
                window.innerWidth / 2,
                window.innerHeight / 2,
                insideRadius,
                angle + arc,
                angle,
                true
            );
            ctx.stroke();
            ctx.fill();

            ctx.save();

            ctx.fillStyle = "black";
            ctx.translate(
                window.innerWidth / 2 + Math.cos(angle + arc / 2) * textRadius,
                window.innerHeight / 2 + Math.sin(angle + arc / 2) * textRadius
            );
            ctx.rotate(-Math.PI / 2 + angle + arc / 2 + Math.PI / 2);
            var text = options[i].value;
            ctx.fillText(text, -ctx.measureText(text).width / 2, 0);
            ctx.restore();
        }


        var arrowScale =  outsideRadius/80;
        //Arrow
        ctx.fillStyle = "black";
        ctx.beginPath();
        ctx.moveTo(
            window.innerWidth / 2 - 4*arrowScale,
            window.innerHeight / 2 - (outsideRadius + 5*arrowScale)
        );
        ctx.lineTo(
            window.innerWidth / 2 + 4*arrowScale,
            window.innerHeight / 2 - (outsideRadius + 5*arrowScale)
        );
        ctx.lineTo(
            window.innerWidth / 2 + 4*arrowScale,
            window.innerHeight / 2 - (outsideRadius - 5*arrowScale)
        );
        ctx.lineTo(
            window.innerWidth / 2 + 9*arrowScale,
            window.innerHeight / 2 - (outsideRadius - 5*arrowScale)
        );
        ctx.lineTo(
            window.innerWidth / 2 + 0*arrowScale,
            window.innerHeight / 2 - (outsideRadius - 16*arrowScale)
        );
        ctx.lineTo(
            window.innerWidth / 2 - 9*arrowScale,
            window.innerHeight / 2 - (outsideRadius - 5*arrowScale)
        );
        ctx.lineTo(
            window.innerWidth / 2 - 4*arrowScale,
            window.innerHeight / 2 - (outsideRadius - 5*arrowScale)
        );
        ctx.lineTo(
            window.innerWidth / 2 - 4*arrowScale,
            window.innerHeight / 2 - (outsideRadius + 5*arrowScale)
        );
        ctx.fill();
    }
}

function spin() {
    document.body.style.backgroundColor = "#F0F0F0";
    //startAngle = 0;
    spinAngleStart = Math.random() * 360 * 2;
    spinTime = (Math.random() * 360 + 500);
    //spinTimeTotal = Math.random() * 3 + 10 * 1000;
    rotateWheel();
}

function rotateWheel() {
    var alfa = 0.98;

    if (spinTime > 100) {
        var difAng = spinTime - spinTime * alfa * alfa * alfa;
        spinTime = spinTime * alfa * alfa * alfa;
    } else {
        var difAng = spinTime - spinTime * alfa;
        spinTime = spinTime * alfa;
    }


    if (spinTime <= 0.01) {
        stopRotateWheel();
        return;
    }

    startAngle += difAng;
    drawRouletteWheel();
    spinTimeout = setTimeout("rotateWheel()", 30);
}

function stopRotateWheel() {
    var canvas = document.getElementById("canvas");
    if (canvas.getContext) {
        ctx = canvas.getContext("2d");
        //ctx.clearRect(0,0,500,500);
        //var ctx = (a canvas context);
        ctx.canvas.width = window.innerWidth;
        ctx.canvas.height = window.innerHeight;

        var sizeWidth = Math.min(window.innerWidth, window.innerHeight);
    } else {
        sizeWidth = 500;
    }
    clearTimeout(spinTimeout);
    //var degrees = startAngle * 180 / Math.PI + 90;
    var degrees = 360 - (((startAngle * 180.0) / Math.PI + 90) % 360.0);
   

    totalWeight = computeTotalWeight();

    var index = 1;
    for (var i = 0; i < options.length; i++) {
        var arc = (options[i].weight / totalWeight) * 360.0;
        //var angle = startAngle + i * arc ;
        //var angle = startAngle;

        var angle = 0;
        for (var j = 0; j < i; j++) {
            angle += (options[j].weight / totalWeight) * 360.0;
        }
        if (degrees % 360 >= angle && degrees % 360 < arc + angle) {
            index = i;
        }
    }
    ctx.save();

    document.body.style.backgroundColor = options[index].color; //getColor(index, options.length)
    ctx.font = "bold " + sizeWidth / 5 + "px Helvetica, Arial";
    var text = options[index].value;
    ctx.fillText(
        text,
        window.innerWidth / 2 - ctx.measureText(text).width / 2,
        window.innerHeight / 2.8 
    );
    ctx.restore();
}

function easeOut(t, b, c, d) {
    var ts = (t /= d) * t;
    var tc = ts * t;
    return b + c * (tc + -3 * ts + 3 * t);
}



function getOptions() {
    return options;
}

function handleSubmit(event) {
    event.preventDefault();

    const data = new FormData(event.target);
    // Do a bit of work to convert the entries to a plain JS object
    const value = Object.fromEntries(data.entries());

    //console.log({value});
    var count = 0;
    for (var prop in value) {
        if (value.hasOwnProperty(prop)) {
            ++count;
        }
    }
    //console.log(count);

    for (var i = 0; i < count; i++) {

        var key = "pregunta";
        if (value.hasOwnProperty(key)) {
            Pregunta = value[key];
        }
        key = "opt" + i + "value";
        if (value.hasOwnProperty(key)) {
            options[i].value = value[key];
        }

        key = "opt" + i + "color";
        if (value.hasOwnProperty(key)) {
            options[i].color = value[key];
        }

        key = "opt" + i + "weight";
        if (value.hasOwnProperty(key)) {
            options[i].weight = parseInt(value[key]);
        }
    }

    //console.log(options);

    drawRouletteWheel();
    reloadConfig();
    //popupWindow.style.display = "none";
}


function reloadConfig() {
    let placeholder = document.querySelector("#data-output");
    let out = "";
    //for(let opt of options){
    for (var i = 0; i < options.length; i++) {
        out +=
            `
           <tr>
             <td><input type="text" value=`+ options[i].value + ` name=opt` + i + `value id="opt` + i + `value" onkeydown="if (event.keyCode == 13) { /*alert('enter')*/; return false;}" /></td>
             <td><input type="color" value=`+ options[i].color + ` name=opt` + i + `color id="opt` + i + `color" /></td>
             <td><input type="range" min="1" max="100" value="`+ options[i].weight + `" class="custom-slider" id="opt` + i + `weight" name=opt` + i + `weight></td>
             <td><button id="removeBtn`+ i + `" onclick="deleteRow(` + i + `)" class="removeBtn" value="` + i + `">x</button></td>          
              
              
           </tr>
        `;
    }

    placeholder.innerHTML = out;

    let placeholder2 = document.querySelector("#h1pregunta");
    out = "";
    out += Pregunta;
    placeholder2.innerHTML = out;
}

function deleteRow(r) {
    if (options.length == 1) {
        return;
    }
    options.splice(r, 1);
    reloadConfig();
}