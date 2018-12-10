var fruits = [ "apple", "banana", "orange", "mangosteen", "strawberry", "plum",
		"pineapple", "pear", "mango", "lemon", "durian", "coconut" ];
var matched = 0;
var currentPair = []
var n = 0;
var playing = false;
var match = [];
var leftCoord = []
var rightCoord = []
var portrait = false;
var isMouseDown = false
var startPoint = [];

function generateWorksheet() {
	n = $("input").val()
	portrait = screen.height > screen.width; 
	if (portrait) {
		$("body").removeClass("stop-scrolling")
		generateWorksheetPortrait();
	} else {
		$("body").addClass("stop-scrolling")
		generateWorksheetLandscape();
	}
	playing = true;
}

function generateWorksheetPortrait() {
	matched = 0;
	currentPair = [];
	if (n >= 2 && n <= 12) {
		initialiseMatch();
		flashMessage("BEGIN!", "#ff9933");
		var pairs = [];
		var numbers = [];
		for (var i = 0; i < n; i++) {
			numbers.push(i);
		}
		while (pairs.length < n) {
			var left = shuffle(numbers.slice())
			var right = shuffle(numbers.slice())			
			for (var i = 0; i < n; i++) {
				if (left[i] === right[i]) {
					pairs = [];
					break;
				} else {
					pairs.push([ left[i], right[i] ]);
				}
			}
		}
		$("tbody").html("").fadeTo(1000, 1);
		for (var i = 0; i < n; i++) {
			if (i == 0) {
				$(
					"<tr id='row-" 
					+ i
					+"'><td><div class='cell-circle'><img draggable='false' class='left img-responsive' id='l-" + pairs[i][0] + "' src='img/" 
					+ fruits[pairs[i][0]] 
					+ ".png'></div></td><td rowspan='"
					+ n 
					+ "'><canvas id='canvas'></canvas></td><td><div class='cell-circle'><img draggable='false' class='right img-responsive' id='r-" + pairs[i][1] + "' src='img/" 
					+ fruits[pairs[i][1]]
					+ ".png'></div></td></tr>"
				).hide().appendTo("tbody").delay(i*200).fadeIn(1000);
				
			} else {
				$(
					"<tr id='row-" 
					+ i
					+"'><td><div class='cell-circle'><img draggable='false' class='left img-responsive' id='l-" + pairs[i][0] + "' src='img/" 
					+ fruits[pairs[i][0]] 
					+ ".png'></div></td><td><div class='cell-circle'><img draggable='false' class='right img-responsive' id='r-" + pairs[i][1] + "' src='img/" 
					+ fruits[pairs[i][1]]
					+ ".png'></div></td></tr>"
				).hide().appendTo("tbody").delay(i*200).fadeIn(1000);			
			}
		}
		bindWorksheetEventHandlers();
	}
}

function generateWorksheetLandscape() {
	matched = 0;
	currentPair = [];
	n = $("input").val()
	if (n >= 2 && n <= 12) {
		initialiseMatch();
		flashMessage("BEGIN!", "#ff9933");
		var pairs = [];
		var numbers = [];
		for (var i = 0; i < n; i++) {
			numbers.push(i);
		}
		while (pairs.length < n) {
			var left = shuffle(numbers.slice())
			var right = shuffle(numbers.slice())
			for (var i = 0; i < n; i++) {
				if (left[i] === right[i]) {
					pairs = [];
					break;
				} else {
					pairs.push([ left[i], right[i] ]);
				}
			}
		}
		$("tbody").html("").fadeTo(1000, 1);
		$("<tr id='row-1'></tr>").appendTo("tbody");
		$("<tr id='row-2'><td colspan='" + n + "'><canvas id='canvas'></canvas></td></tr>").appendTo("tbody");
		$("<tr id='row-3'></tr>").appendTo("tbody");
		for (var i = 0; i < n; i++) {
			$(
				"<td class='col-" + i + "'><div class='cell-circle'><img draggable='false' class='left img-responsive' id='l-" + pairs[i][0] + "' src='img/" 
				+ fruits[pairs[i][0]] 
				+ ".png'></div></td>"
			).hide().appendTo("#row-1").delay(i*200).fadeIn(1000);
			$(
				"<td class='col-" + i + "'><div class='cell-circle'><img draggable='false' class='right img-responsive' id='r-" + pairs[i][1] + "' src='img/" 
				+ fruits[pairs[i][1]]
				+ ".png'></div></td>"
				).hide().appendTo("#row-3").delay(i*200).fadeIn(1000);
		}
	}
	bindWorksheetEventHandlers();
}

function shuffle(array) {
	var currentIndex = array.length, temporaryValue, randomIndex;

	// While there remain elements to shuffle...
	while (0 !== currentIndex) {

		// Pick a remaining element...
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex -= 1;

		// And swap it with the current element.
		temporaryValue = array[currentIndex];
		array[currentIndex] = array[randomIndex];
		array[randomIndex] = temporaryValue;
	}

	return array;
}

function contains(a, e) {
	return a.indexOf(e) > -1;
}

function selectLeft(elem) {
	if (!$(elem).hasClass("matched") && matched < n) {
		var image = $(elem).children("img");
		if (!contains(currentPair, image.attr("id")) && currentPair.length <= 1) {
			$(elem).css("border: 10px solid #e0b86c;")
			$(elem).addClass("selected-circle");
			currentPair.push(image.attr("id"));
			image.addClass("selected-left");
			flashMessage("MATCH WITH...", "#bd8a29");
		}
	}
}

function selectRight(elem) {
	if (!$(elem).hasClass("matched") && matched < n) {
		var image = $(elem).children("img");
		if (!contains(currentPair, image.attr("id")) && currentPair.length <= 1) {
			$(elem).css("border: 10px solid #e0b86c;")
			$(elem).addClass("selected-circle");
			currentPair.push(image.attr("id"));
			image.addClass("selected-right");
			flashMessage("MATCH WITH...", "#bd8a29");
		}
	}
}
function resetAll() {
	for (var i = 0; i < currentPair.length; i++) {
		reset(currentPair[i]);
	}
}
function attemptMatch() {	
	if (currentPair.length != 1) {
		resetAll();
	}
	if (currentPair.length == 2) {
		if (!sameSide() && sameFruit()) {
			arrangePair();
			$("#" + currentPair[0]).removeClass("left").addClass("silhouette");
			$("#" + currentPair[0]).parent("div").addClass("matched")			
			$("#" + currentPair[1]).removeClass("right").addClass("silhouette");
			$("#" + currentPair[1]).parent("div").addClass("matched")
			$("#" + currentPair[0]).unbind();
			$("#" + currentPair[1]).unbind();
			matched++;
			match[parseInt(getCellNumber(currentPair[0]))] = parseInt(getCellNumber(currentPair[1]));
			drawLines(match);
			flashMessage("MATCHED!", 	"#a6cc33");			
		} else if (!sameCell()){
			if (sameSide()) {
				flashMessage("ERROR...","#e60000");
			} else {
				flashMessage("CAN'T MATCH...","#e60000");
			}
		}
		attemptGameCompletion();
	}
	if (currentPair.length != 1) {
		currentPair = [];
	}
}

function sameCell() {
	return currentPair[0] === currentPair[1];
}

function sameFruit() {
	return currentPair[0].substring(2) === currentPair[1].substring(2);
}
function sameSide() {
	return currentPair[0].substring(0,1) === currentPair[1].substring(0,1);
}
function arrangePair() {
	if (currentPair[0].substring(0,1) !== "l") {
		var right = currentPair[0];
		currentPair[0] = currentPair[1];
		currentPair[1] = right;
	}
}

function reset(id) {
	if (id.substring(0,1) === "l") {
		$("#" + id).parent("div").removeClass("selected-circle");
		$("#" + id).removeClass("selected-left")
		$("#" + id).parent("div").removeClass("hover-circle");
		$("#" + id).removeClass("hover-left")
	} else {
		$("#" + id).parent("div").removeClass("selected-circle");
		$("#" + id).removeClass("selected-right")
		$("#" + id).parent("div").removeClass("hover-circle");
		$("#" + id).removeClass("hover-right")
	}

}

function attemptGameCompletion() {
	if (matched == n) {
		$(".in-play").stop();
		$(".in-play").css({ opacity: 1, color: "#ff9933"}).show();
		$(".in-play").text("GAME COMPLETED!");
		$("body").animate({ scrollTop: "0px" });
		$(".main").unbind();
		playing = false;
	}
}

function flashMessage(message, fontColour) {
	$(".in-play").stop();
	$(".in-play").css({ opacity: 1, color: fontColour}).show();
	$(".in-play").text(message);
	$(".in-play").fadeOut(1000);
}

function displayMessage(message, fontColour) {
	$(".in-play").stop();
	$(".in-play").css({ opacity: 1, color: fontColour}).show();
	$(".in-play").text(message);
}

function drawStraightLine(l, r) {
	context.beginPath();
	context.moveTo(leftCoord[l][0], leftCoord[l][1]);
	context.lineTo(rightCoord[r][0], rightCoord[r][1]);
	context.stroke();
}

function drawCurvyLine(l, r) {
	context.beginPath();
	context.moveTo(leftCoord[l][0], leftCoord[l][1]);
	if (portrait) {
		context.bezierCurveTo(leftCoord[l][0] + (rightCoord[r][0] - leftCoord[l][0]) / 3, leftCoord[l][1], leftCoord[l][0] + 2 * (rightCoord[r][0] - leftCoord[l][0]) / 3, rightCoord[r][1], rightCoord[r][0], rightCoord[r][1]);
	} else {
		context.bezierCurveTo(leftCoord[l][0], leftCoord[l][1] + (rightCoord[r][1] - leftCoord[l][1]) / 3, rightCoord[r][0], leftCoord[l][1] + 2 * (rightCoord[r][1] - leftCoord[l][1]) / 3, rightCoord[r][0], rightCoord[r][1]);
	}
	context.stroke();
}

function getCellNumber(id) {
	if (portrait) {
		return $("#" + id).closest("tr").attr("id").substring(4);
	} else {
		return $("#" + id).closest("td").attr("class").substring(4);
	}
}

function adjustCanvas() {
	canvas.width = $("#canvas").width();
	canvas.height = $("#canvas").height();
	context.lineWidth = 10;
	context.strokeStyle="#a6cc33";
	if (portrait) {
		var spacing = canvas.height / n
		var offset = spacing / 2;
	} else {
		var spacing = canvas.width / n
		var offset = spacing / 2;
	}
	for (var i = 0; i < n ; i++) {
		if (portrait) {
			leftCoord[i] = [0, i * spacing + offset];
			rightCoord[i] = [canvas.width, i * spacing + offset];
		} else {
			leftCoord[i] = [i * spacing + offset, 0];
			rightCoord[i] = [i * spacing + offset, canvas.height];
		}
	}
}

function initialiseMatch() {
	match = [];
	leftCoord = [];
	rightCoord = [];
	for (var i = 0; i < n ; i++) {
		match.push(-1);
		leftCoord.push([]);
		rightCoord.push([]);
	}
}

function drawLines(match) {
	adjustCanvas();
	for (var i = 0; i < n; i++) {
		if (match[i] != -1) {
			if (Math.abs(i - match[i]) <= 1) {
				drawStraightLine(i, match[i]);
			} else {
				drawCurvyLine(i, match[i]);
			}
		}
	}
}

var canvas, context, drawing;

function bindWorksheetEventHandlers() {
    $('img').mousedown(function() {
    	console.log(currentPair);
        isMouseDown = true;
        startPoint = getStartPoint($(this).attr('id'));
        selectImageCell($(this));
    })
    $('img').mouseup(function(e) {
    	// take care of matching
    	selectImageCell($(this));
    	console.log(currentPair);
    });
    
    $('.left').mouseenter(function() {
		$(this).addClass("hover-left");
		$(this).closest(".cell-circle").addClass("hover-circle");
    }).mouseout(function() {
    	$(this).removeClass("hover-left");
    	$(this).closest(".cell-circle").removeClass("hover-circle");
    });
    
    $('.right').mouseenter(function() {
		$(this).addClass("hover-right");
		$(this).closest(".cell-circle").addClass("hover-circle");
    }).mouseout(function() {
    	$(this).removeClass("hover-right");
    	$(this).closest(".cell-circle").removeClass("hover-circle");
    });
    

    $('canvas').mouseenter(function(e) {
        if(isMouseDown) {
            startDraw(e);
        }
    });
    
    // For touchscreen
    $('img').on('tap', function() {
        selectImageCell($(this));
    }) 
    
    canvas = document.getElementById("canvas");
    context = canvas.getContext("2d");
    drawing = false;
    canvas.addEventListener("mousemove", continueDraw, false);
}

function selectImageCell(elem) {
	var id = $(elem).attr('id')
	if (id.substring(0,1) === "l") {
		selectLeft($(elem).closest('div'));   
	} else if (id.substring(0,1) === "r") {
		selectRight($(elem).closest('div'));
	}
}

function getStartPoint(id) {
	var pt;
	
	if (id.substring(0,1) === "l") {
		pt = [leftCoord[getCellNumber(id)][0], leftCoord[getCellNumber(id)][1]];   
	} else if (id.substring(0,1) === "r") {
		pt = [rightCoord[getCellNumber(id)][0], rightCoord[getCellNumber(id)][1]];
	}
	return pt;
}

function startDraw(event) {
	console.log("start");
    drawing = true;
    drawLines(match);
    context.strokeStyle="#e0b86c";
    context.beginPath();
    context.moveTo(startPoint[0], startPoint[1]);
    
}

function continueDraw(event) {
    if (drawing) {
        var pos = mouseXY(canvas, event);
        context.lineTo(pos.x, pos.y);    
        context.stroke();
        context.beginPath();
        context.moveTo(pos.x, pos.y);
    }
}

function endDraw(event) {
    if (drawing)    {
    	console.log("end");
        var pos = mouseXY(canvas, event);
        context.lineTo(pos.x, pos.y);    
        context.stroke();
        drawing = false;
        context.clearRect(0, 0, canvas.width, canvas.height);
        drawLines(match);
    }
}
function mouseXY(c, e) {
    var r = c.getBoundingClientRect();
    return {x: e.clientX - r.left, y: e.clientY - r.top};
}

$(document).ready(function() {
    $('body').mouseup(function(e) {
    	if (drawing) {
	        endDraw(e);
	        if (currentPair.length == 1) {
		        resetAll();
		        currentPair = []
	        }
    	}
    	isMouseDown = false;
    	if (playing) {
    		attemptMatch();
    	}
    });    
})