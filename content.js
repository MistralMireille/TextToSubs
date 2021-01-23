let attempts = 0;
let broken_lines = 0;
let video_player;
let fade;
let time_bar;
let bar_down = false;
let element_drivers = [];
let active_elements = [];

function Element_Driver(ele, start, end) {
	this.ele = ele;
	this.start = start;
	this.end = end;
	this.active = function(time) {
		return (time >= this.start && time < this.end);		
	}
	this.shown = false;
	this.moved_height = 0;
}

function addElement(e) {
	e.style.position = "absolute";
	e.style.zIndex = "60";
	video_player.append(e);
}

function centerElementHorizontally(e, p) {
	let e_width = e.getBoundingClientRect().width;
	let p_width = p.getBoundingClientRect().width;
	e.style.left = (((p_width/2 - e_width/2) / p_width) * 100) + "%";
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
		let s = string_array[i];
		if(s.split("\n").length === 3 && s.split("\n")[0].match(/^[1-9][0-9]*$/)) { // could be srt file
			let part_one = s.split("\n")[1].replace(/,/g, ".");
			part_one = part_one.replace(" --> ", " ");
			s = part_one + "\n" + s.split("\n")[2];
			alert(s);
		}
		let verified = verify_file(s);
		if(verified) {
			let ele;
			let start;
			let end;
			start = time_to_int(s.split("\n")[0].split(" ")[0]);
			end = time_to_int(s.split("\n")[0].split(" ")[1]);
			
			ele = document.createElement("P");
			ele.style.bottom = "1%";
			ele.style.color="white";
			if(CSS.supports("-moz-user-select", "text")) {
				ele.style.paintOrder="stroke";
				ele.style.webkitTextStrokeColor="black";
				ele.style.webkitTextStrokeWidth=(0.01 * video_player.offsetHeight) + "px";
			} else {
				ele.style.backgroundColor="rgba(0,0,0,0.5)";
			}
			ele.style.fontSize=(0.04 * video_player.offsetHeight) + "px"; // was 60px
			ele.style.maxWidth="95%";
			ele.style.whiteSpace="pre-wrap";
			ele.style.textAlign="center";
			ele.style.transition="all 0.1s";
			let text_to_display = s.split("\n")[1].replace(/<br>/g, "\n").replace(/\\n/g, "\n");
			let colors = text_to_display.match(/<#[0-9a-fA-F]{6}>/g);
			if(colors && colors.length > 0) {
				let found_color;
				found_color = colors[0].replace("<", "");
				found_color = found_color.replace(">", "").toLowerCase();
				if(colors[1]) {
					let background_color = colors[1].replace("<", "");
					background_color = background_color.replace(">", "").toLowerCase();
					if(CSS.supports("-moz-user-select", "text"))
						ele.style.webkitTextStrokeColor=background_color;
					else
						ele.style.backgroundColor="rgba("+parseInt("0x"+background_color.substring(1,3))+","+parseInt("0x"+background_color.substring(3,5))+","+parseInt("0x"+background_color.substring(5,7))+", 0.5)";
				}
				ele.style.color=found_color;
				text_to_display = text_to_display.replace(/<#[0-9a-fA-F]{6}>/g, "");
			}
			ele.innerText= text_to_display;
			
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

function fix_active_elements() {
	let i;
	for(i = 0; i < active_elements.length; i++) {
		let j;
		let sum = 0;
		for(j = i + 1; j < active_elements.length; j++) {
			sum += element_drivers[active_elements[j]].ele.offsetHeight;
		}
		element_drivers[active_elements[i]].moved_height = sum;
	}
}

function main_loop() {
	let counter = video_player.firstElementChild.firstElementChild.currentTime;
	let i;
	for(i = 0; i < element_drivers.length; i++) {
		if(element_drivers[i].active(counter) && !element_drivers[i].shown) {
			element_drivers[i].ele.style.fontSize = (0.04 * video_player.offsetHeight) + "px";
			if(CSS.supports("-moz-user-select", "text")) element_drivers[i].ele.style.webkitTextStrokeWidth=(0.01 * video_player.offsetHeight) + "px";
			addElement(element_drivers[i].ele);
			element_drivers[i].shown = true;
			centerElementHorizontally(element_drivers[i].ele, video_player);
			
			if(active_elements.length > 0) {
				let j;
				for(j = 0; j < active_elements.length; j++) {
					element_drivers[active_elements[j]].moved_height += element_drivers[i].ele.offsetHeight;
				}
			}
			active_elements.push(i);
			if(bar_down) { 
				element_drivers[i].ele.style.bottom=(0.01 * video_player.offsetHeight) + "px";
			} else {
				element_drivers[i].ele.style.bottom = time_bar.offsetHeight + (0.01 * video_player.offsetHeight) + "px";
			}
		} else if(!element_drivers[i].active(counter) && element_drivers[i].shown) {
			element_drivers[i].shown = false;
			element_drivers[i].ele.remove();
			element_drivers[i].ele.style.bottom = (-1 * screen.height) + "px";
			
			if(active_elements.length > 0 && active_elements.includes(i)) {
				element_drivers[i].moved_height = 0;
				active_elements.splice(active_elements.indexOf(i), 1);
				fix_active_elements();
			}
		} else if(element_drivers[i].active(counter) && element_drivers[i].shown) {
			centerElementHorizontally(element_drivers[i].ele, video_player);
			element_drivers[i].ele.style.fontSize = (0.04 * video_player.offsetHeight) + "px";
			if(CSS.supports("-moz-user-select", "text")) element_drivers[i].ele.style.webkitTextStrokeWidth=(0.01 * video_player.offsetHeight) + "px";
			if(bar_down) {
				element_drivers[i].ele.style.bottom= (0.01 * video_player.offsetHeight) + element_drivers[i].moved_height + "px";
			} else {
				element_drivers[i].ele.style.bottom = time_bar.offsetHeight + (0.01 * video_player.offsetHeight) + element_drivers[i].moved_height + "px";
			}
		}
	}
}

function main_loop_mobile() {
	let counter = video_player.firstElementChild.firstElementChild.currentTime;
	let i;
	for(i = 0; i < element_drivers.length; i++) {
		if(element_drivers[i].active(counter) && !element_drivers[i].shown) {
			element_drivers[i].ele.style.fontSize = (0.04 * video_player.offsetHeight) + "px";
			if(CSS.supports("-moz-user-select", "text")) element_drivers[i].ele.style.webkitTextStrokeWidth=(0.01 * video_player.offsetHeight) + "px";
			addElement(element_drivers[i].ele);
			element_drivers[i].shown = true;
			centerElementHorizontally(element_drivers[i].ele, video_player);
			
			if(active_elements.length > 0) {
				let j;
				for(j = 0; j < active_elements.length; j++) {
					element_drivers[active_elements[j]].moved_height += element_drivers[i].ele.offsetHeight;
				}
			}
			active_elements.push(i);
			element_drivers[i].ele.style.bottom= (0.01 * video_player.offsetHeight) + "px";
		} else if(!element_drivers[i].active(counter) && element_drivers[i].shown) {
			element_drivers[i].shown = false;
			element_drivers[i].ele.remove();
			if(screen.height > screen.width)
				element_drivers[i].ele.style.bottom = (-1 * screen.height) + "px";
			else
				element_drivers[i].ele.style.bottom = (-1 * screen.width) + "px";
			
			if(active_elements.length > 0 && active_elements.includes(i)) {
				element_drivers[i].moved_height = 0;
				active_elements.splice(active_elements.indexOf(i), 1);
				fix_active_elements();
			}
		} else if(element_drivers[i].active(counter) && element_drivers[i].shown) {
			centerElementHorizontally(element_drivers[i].ele, video_player);
			element_drivers[i].ele.style.fontSize = (0.04 * video_player.offsetHeight) + "px";
			if(CSS.supports("-moz-user-select", "text")) element_drivers[i].ele.style.webkitTextStrokeWidth=(0.01 * video_player.offsetHeight) + "px";
			element_drivers[i].ele.style.bottom= (0.01 * video_player.offsetHeight) + element_drivers[i].moved_height + "px";
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
		
		let video_element = video_player.firstElementChild.firstElementChild;
		if(video_element && video_element.tagName === "VIDEO") {
			video_element.addEventListener("seeking", function() {
				bar_down = false;
			}, false);
			video_element.addEventListener("pause", function() {
				bar_down = false;
			}, false);
		}
		
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

document.addEventListener("fullscreenchange", function() { fix_active_elements(); });