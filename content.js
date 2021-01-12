let attempts = 0;
let broken_lines = 0;
let video_player;
let fade;
let time_bar;
let bar_down = false;
let element_drivers = [];

function Element_Driver(ele, start, end) {
	this.ele = ele;
	this.start = start;
	this.end = end;
	this.active = function(time) {
		return (time >= this.start && time < this.end);		
	}
	this.shown = false;
}

function addElement(e) {
	e.style.position = "absolute";
	e.style.zIndex = "60";
	video_player.append(e);
	
	let count = 0;
	let start_center = e.style.left;
	let changing_center;
	centerElementHorizontally(e, video_player);
	if(e.firstElementChild && e.firstElementChild.hasAttribute("centered")) centerElementHorizontally(e.firstElementChild, video_player);
	my_inter = setInterval(function() { 
		centerElementHorizontally(e, video_player);
		if(e.firstElementChild && e.firstElementChild.hasAttribute("centered")) centerElementHorizontally(e.firstElementChild, video_player);
		count += 1;
		changing_center = e.style.left;
		if(start_center != changing_center || count > 10)	clearInterval(my_inter); 
	}, 100);
	document.addEventListener('fullscreenchange', function() { centerElementHorizontally(e, video_player); }, false);
}

function centerElementHorizontally(e, p) {
	e.style.left = ((p.offsetWidth/2 - e.offsetWidth/2) / p.offsetWidth) * 100 + "%";
}
	
function centerElementVertically(e, p) {
	e.style.top = ((p.offsetHeight/2 - e.offsetHeight/2) / p.offsetHeight) * 100 + "%";
}

function time_to_int(s) {
	let time_array = s.split(":");
	return parseInt(time_array[0]) * 3600 + parseInt(time_array[1]) * 60 + parseFloat(time_array[2]);	
}

function verify_file(s) {
	let test_array = s.split("\n");
	if(test_array.length != 2) return false;
	let time1 = test_array[0].split(" ")[0];
	let time2 = test_array[0].split(" ")[1];
	let content = test_array[1];
 if(isNaN(parseInt(time_to_int(time1)))) return false;
	if(isNaN(parseInt(time_to_int(time2)))) return false;
	return true;
}

function populate_drivers(file_as_string) {
	let string_array;
	file_as_string = file_as_string.replace(/\r/gm, "");
	string_array = file_as_string.split(/\n\n/);
	let i;
	
	for(i = 0; i < string_array.length; i++) {
		let verified = verify_file(string_array[i]);
		if(verified) {
			let ele;
			let start;
			let end;
			start = time_to_int(string_array[i].split("\n")[0].split(" ")[0]);
			end = time_to_int(string_array[i].split("\n")[0].split(" ")[1]);
			
			ele = document.createElement("P");
			ele.style.bottom = "1%";
			ele.style.color="white";
			ele.style.backgroundColor="rgba(0,0,0,0.5)";
			ele.style.fontSize="2.5em"; // was 60px
			ele.style.maxWidth="95%";
			ele.style.whiteSpace="pre-wrap";
			ele.textContent=string_array[i].split("\n")[1].replace("<br>", "\n").replace("\\n", "\n");
			
			element_drivers.push(new Element_Driver(ele, start, end));
		} else {
			if(broken_lines < 5) {
				alert(string_array[i] + "\nThis is not the correct format! Check for empty lines or incorrect format on the two lines. It should look like:\n00:00:00 00:00:00\nContent here.");
				broken_lines += 1;
			} else {
				alert("Too many broken lines so the alerts will stop. Reminder that the file should be in the format:\n00:00:00 00:00:00\nContent Here\n\n00:00:00 00:00:00\nContent Here");
			}
		}
	}
	console.log(element_drivers);
}

function main_loop() {
	let counter = video_player.firstElementChild.firstElementChild.currentTime;
	let i;
	for(i = 0; i < element_drivers.length; i++) {
		if(element_drivers[i].active(counter) && !element_drivers[i].shown) {
			addElement(element_drivers[i].ele);
			element_drivers[i].shown = true;
			if(bar_down && element_drivers[i].ele.tagName !== "DIV") { 
				element_drivers[i].ele.style.bottom="1%";
			}
			else if(!bar_down && element_drivers[i].ele.tagName !== "DIV") {
				element_drivers[i].ele.style.bottom = time_bar.offsetHeight + 10 + "px";
			} else if(bar_down && element_drivers[i].ele.tagName === "DIV") {
				let c = element_drivers[i].ele.firstElementChild;
				if(c && c.hasAttribute("movewithbar")) element_drivers[i].ele.style.bottom = "0%";
			} else if(!bar_down && element_drivers[i].ele.tagName === "DIV") {
				let c = element_drivers[i].ele.firstElementChild;
				if(c && c.hasAttribute("movewithbar")) element_drivers[i].ele.style.bottom = time_bar.offsetHeight + 10 + "px";
			}
		} else if(!element_drivers[i].active(counter) && element_drivers[i].shown) {
			element_drivers[i].shown = false;
			element_drivers[i].ele.remove();
		} else if(element_drivers[i].active(counter) && element_drivers[i].shown) {
			if(bar_down && element_drivers[i].ele.tagName !== "DIV") 
				element_drivers[i].ele.style.bottom="1%";
			else if(!bar_down && element_drivers[i].ele.tagName !== "DIV") {
				element_drivers[i].ele.style.bottom = time_bar.offsetHeight + 10 + "px";
			} else if(bar_down && element_drivers[i].ele.tagName === "DIV") {
				let c = element_drivers[i].ele.firstElementChild;
				if(c && c.hasAttribute("movewithbar")) element_drivers[i].ele.style.bottom = "0%";
			} else if(!bar_down && element_drivers[i].ele.tagName === "DIV") {
				let c = element_drivers[i].ele.firstElementChild;
				if(c && c.hasAttribute("movewithbar")) element_drivers[i].ele.style.bottom = time_bar.offsetHeight + 10 + "px";
			}
		}
	}
}

function main_loop_mobile() {
	let counter = video_player.firstElementChild.firstElementChild.currentTime;
	let i;
	for(i = 0; i < element_drivers.length; i++) {
		if(element_drivers[i].active(counter) && !element_drivers[i].shown) {
			addElement(element_drivers[i].ele);
			element_drivers[i].shown = true;
		} else if(!element_drivers[i].active(counter) && element_drivers[i].shown) {
			element_drivers[i].shown = false;
			element_drivers[i].ele.remove();
		}
	}
}

function addSubs_fromText() {
	video_player = document.querySelector("div#player > div#player-container-outer > div#player-container-inner > div#player-container > ytd-player#ytd-player > div#container > div[class*='html5-video-player'][id='movie_player'] ");
 if(video_player) fade = video_player.querySelector(".ytp-gradient-bottom");
	if(video_player) time_bar = video_player.querySelector(".ytp-chrome-bottom");
	
	if(video_player && fade && time_bar) {
		video_player.parentElement.addEventListener('mousemove', function() {
			if(bar_down) bar_down = false;
  }, false);
  
		fade.addEventListener('transitionend', function() {
    bar_down = true;
  }, false);
		
		populate_drivers(textContent);
		let main_loop_interval = setInterval(main_loop, 100);
	} else {
		console.log("Failed to find elements. Trying again.");
		attempts += 1;
		if(attempts < 10)	
			setTimeout(addSubs, 500);
		else
			console.log("Script stopped.");
	}
}

function addSubs_fromText_mobile() {
	video_player = document.querySelector("div#player-container-id > div#player > div#movie_player");
	
	if(video_player) {
		populate_drivers(textContent);
		let main_loop_interval = setInterval(main_loop_mobile, 100);
	} else {
		console.log("Failed to find elements. Trying again.");
		attempts += 1;
		if(attempts < 10)	
			setTimeout(addSubs, 500);
		else
			console.log("Script stopped.");
	}
}

function checkVersion() {
	if(window.location.href.match(/.*m\.youtube\.com\/watch.*/) && textContent.length > 0) {
		addSubs_fromText_mobile();
	}	else if(window.location.href.match(/.*www\.youtube\.com\/watch.*/) && textContent.length > 0) {
		addSubs_fromText();
	}
}

let already_changed = document.getElementById("already-changed-addSubs");
if(!already_changed) {
	let p_temp = document.createElement("P");
	p_temp.id="already-changed-addSubs";
	p_temp.style.display="none";
	document.querySelector('body').append(p_temp);
	
	checkVersion();
}