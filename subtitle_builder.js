let copied_color = "#ffffff";

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
	if(content.length === 0) return false;
	return true;
}

function addSubtitleBox() {
	let container = document.getElementById('subtitle-builder-container');
	if(container.childElementCount < 10) {
		let test = document.createElement("DIV");
		let color1 = document.createElement("DIV");
		let color2 = document.createElement("DIV");
		let time1 = document.createElement("INPUT");
		let time2 = document.createElement("INPUT");
		let time_controls = document.createElement("BUTTON");
		let play_pause = document.createElement("BUTTON");
		let remove_sub = document.createElement("BUTTON");
		let breaking_div = document.createElement("DIV");
		let content = document.createElement("INPUT");
		color1.style.border="1px solid black";
		color1.style.width="2em";
		color1.value=bg.default_text_color;
		color1.style.backgroundColor=bg.default_text_color;
		let popupCustom = new Picker({
			parent: color1,
			popup: 'bottom',
			color: color1.value,
			alpha: false,
			editorFormat: 'hex',
			onDone: function(color) {
				color1.style.backgroundColor = color.hex;
				color1.value = color.hex.substring(0, color.hex.length - 2);
			},
			onOpen: function(color) {
				document.body.style.height = document.body.offsetHeight + color1.firstElementChild.offsetHeight + "px";
				popupCustom.setColor(color1.value, true);
			},
			onClose: function() {
				document.body.style.height = "";
			}
		});
		color1.addEventListener('mousedown', function(event) {
			if(event.button === 1 && event.shiftKey) {
				event.preventDefault();
				copied_color = this.value;
			} else if(event.button === 1) {
				event.preventDefault();
				this.value = copied_color;
				this.style.backgroundColor = copied_color;
			}
		});
		color2.style.border="1px solid black";
		color2.style.width="2em";
		color2.value=bg.default_background_color;
		color2.style.backgroundColor=bg.default_background_color;
		let popupCustom2 = new Picker({
			parent: color2,
			popup: 'bottom',
			color: color2.value,
			alpha: false,
			editorFormat: 'hex',
			onDone: function(color) {
				color2.style.backgroundColor = color.hex;
				color2.value = color.hex.substring(0, color.hex.length - 2);
			},
			onOpen: function(color) {
				document.body.style.height = document.body.offsetHeight + color2.firstElementChild.offsetHeight + "px";
				popupCustom2.setColor(color2.value, true);
			},
			onClose: function() {
				document.body.style.height = "";
			}
		});
		color2.addEventListener('mousedown', function(event) {
			if(event.button === 1 && event.shiftKey) {
				event.preventDefault();
				copied_color = this.value;
			} else if(event.button === 1) {
				event.preventDefault();
				this.value = copied_color;
				this.style.backgroundColor = copied_color;
			}
		});
		time1.type="text";
		time2.type="text";
		time1.size="8";
		time2.size="8";
		time1.addEventListener('mousedown', function(event) {
			if(event.button === 1) {
				event.preventDefault();
				let time_element = this;
				chrome.tabs.executeScript({ code: 
				'document.querySelector("video").currentTime.toString();'
				}, function(result) {
					let t1 = Math.floor(result[0] / 3600);
					t1 < 10 ? t1 = "0" + t1 : t1 = "" + t1;
					let t2 = Math.floor(result[0] / 60);
					t2 < 10 ? t2 = "0" + t2 : t2 = "" + t2;
					let t3 = Math.floor(result[0] % 60 * 10) / 10;
					t3 < 10 ? t3 = "0" + t3 : t3 = "" + t3;
					let t = t1 + ':' + t2 + ':' + t3
					time_element.value = t;
				});
			}
		}, false);
		time2.addEventListener('mousedown', function(event) {
			if(event.button === 1) {
				event.preventDefault();
				let time_element = this;
				chrome.tabs.executeScript({ code: 
				'document.querySelector("video").currentTime.toString();'
				}, function(result) {
					let t1 = Math.floor(result[0] / 3600);
					t1 < 10 ? t1 = "0" + t1 : t1 = "" + t1;
					let t2 = Math.floor(result[0] / 60);
					t2 < 10 ? t2 = "0" + t2 : t2 = "" + t2;
					let t3 = Math.floor(result[0] % 60 * 10) / 10;
					t3 < 10 ? t3 = "0" + t3 : t3 = "" + t3;
					let t = t1 + ':' + t2 + ':' + t3
					time_element.value = t;
				});
			}
		}, false);
		time_controls.innerText="Jump 2s Before";
		time_controls.addEventListener('click', function() {
			if(!isNaN(time_to_int(time1.value))) {
				chrome.tabs.executeScript({ code: 'document.querySelector("video").currentTime = (parseFloat(' + time_to_int(time1.value).toString() + ') - 2).toString();' });
			} else {
				alert("Invalid time.");
			}
		}, false);
		play_pause.innerText="Play/Pause";
		play_pause.addEventListener('click', function() {
			chrome.tabs.executeScript({ code: 
				'if(document.querySelector("video").paused) {' + 
				'	document.querySelector("video").play();' +
				'} else {' +
				' document.querySelector("video").pause();' +
				'}'
			});
		});
		remove_sub.innerText="X";
		remove_sub.addEventListener('click', function() {
			remove_sub.parentElement.remove();
		}, false);
		breaking_div.style.height="0";
		breaking_div.style.flexBasis="100%";
		content.type="text";
		content.style.width="100%";
		
		test.style.display="flex";
		test.style.flexWrap="wrap";
		test.style.border="1px solid black";
		test.append(color1);
		test.append(color2);
		test.append(time1);
		test.append(time2);
		test.append(time_controls);
		test.append(play_pause);
		test.append(remove_sub);
		test.append(breaking_div);
		test.append(content);
		
		container.append(test);
	}
}

function restoreSBData() {
	restoreSubtitleBox();
	restoreAddedColors();
	setStorageColors();
	setColorFill();
}

function setColorFill() {
	document.getElementById('text-color-reference').value = bg.default_text_color;
	document.getElementById('background-color-reference').value = bg.default_background_color;
}

function restoreSubtitleBox() {
	if(bg.subtitle_box_count > 0) {
		let container = document.getElementById('subtitle-builder-container');
		
		let i;
		for(i = 0; i < bg.subtitle_box_count; i++) {
			let content_array = bg.subtitle_box_content[i];
			
			let test = document.createElement("DIV");
			let color1 = document.createElement("DIV");
			let color2 = document.createElement("DIV");
			let time1 = document.createElement("INPUT");
			let time2 = document.createElement("INPUT");
			let time_controls = document.createElement("BUTTON");
			let play_pause = document.createElement("BUTTON");
			let remove_sub = document.createElement("BUTTON");
			let breaking_div = document.createElement("DIV");
			let content = document.createElement("INPUT");
			
			color1.style.border="1px solid black";
			color1.style.width="2em";
			color1.value=content_array[0];
			color1.style.backgroundColor=content_array[0];
			let popupCustom = new Picker({
				parent: color1,
				popup: 'bottom',
				color: color1.value,
				alpha: false,
				editorFormat: 'hex',
				onDone: function(color) {
					color1.style.backgroundColor = color.hex;
					color1.value = color.hex.substring(0, color.hex.length - 2);
				},
				onOpen: function(color) {
					document.body.style.height = document.body.offsetHeight + color1.firstElementChild.offsetHeight + "px";
					popupCustom.setColor(color1.value, true);
				},
				onClose: function() {
					document.body.style.height = "";
				}
			});
			color1.addEventListener('mousedown', function(event) {
				if(event.button === 1 && event.shiftKey) {
					event.preventDefault();
					copied_color = this.value;
				} else if(event.button === 1) {
					event.preventDefault();
					this.value = copied_color;
					this.style.backgroundColor = copied_color;
				}
			});
			color2.style.border="1px solid black";
			color2.style.width="2em";
			color2.value=content_array[1];
			color2.style.backgroundColor=content_array[1];
			let popupCustom2 = new Picker({
				parent: color2,
				popup: 'bottom',
				color: color2.value,
				alpha: false,
				editorFormat: 'hex',
				onDone: function(color) {
					color2.style.backgroundColor = color.hex;
					color2.value = color.hex.substring(0, color.hex.length - 2);
				},
				onOpen: function(color) {
					document.body.style.height = document.body.offsetHeight + color2.firstElementChild.offsetHeight + "px";
					popupCustom2.setColor(color2.value, true);
				},
				onClose: function() {
					document.body.style.height = "";
				}
			});
			color2.addEventListener('mousedown', function(event) {
				if(event.button === 1 && event.shiftKey) {
					event.preventDefault();
					copied_color = this.value;
				} else if(event.button === 1) {
					event.preventDefault();
					this.value = copied_color;
					this.style.backgroundColor = copied_color;
				}
			});
			
			time1.type="text";
			time2.type="text";
			time1.size="8";
			time2.size="8";
			time1.value = content_array[2];
			time2.value = content_array[3];
			time1.addEventListener('mousedown', function(event) {
				if(event.button === 1) {
					event.preventDefault();
					let time_element = this;
					chrome.tabs.executeScript({ code: 
					'document.querySelector("video").currentTime.toString();'
					}, function(result) {
						let t1 = Math.floor(result[0] / 3600);
						t1 < 10 ? t1 = "0" + t1 : t1 = "" + t1;
						let t2 = Math.floor(result[0] / 60);
						t2 < 10 ? t2 = "0" + t2 : t2 = "" + t2;
						let t3 = Math.floor(result[0] % 60 * 10) / 10;
						t3 < 10 ? t3 = "0" + t3 : t3 = "" + t3;
						let t = t1 + ':' + t2 + ':' + t3
						time_element.value = t;
					});
				}
			}, false);
			time2.addEventListener('mousedown', function(event) {
				if(event.button === 1) {
					event.preventDefault();
					let time_element = this;
					chrome.tabs.executeScript({ code: 
					'document.querySelector("video").currentTime.toString();'
					}, function(result) {
						let t1 = Math.floor(result[0] / 3600);
						t1 < 10 ? t1 = "0" + t1 : t1 = "" + t1;
						let t2 = Math.floor(result[0] / 60);
						t2 < 10 ? t2 = "0" + t2 : t2 = "" + t2;
						let t3 = Math.floor(result[0] % 60 * 10) / 10;
						t3 < 10 ? t3 = "0" + t3 : t3 = "" + t3;
						let t = t1 + ':' + t2 + ':' + t3
						time_element.value = t;
					});
				}
			}, false);
			time_controls.innerText="Jump 2s Before";
			time_controls.addEventListener('click', function() {
				if(!isNaN(time_to_int(time1.value))) {
					chrome.tabs.executeScript({ code: 'document.querySelector("video").currentTime = (parseFloat(' + time_to_int(time1.value).toString() + ') - 2).toString();' });
				} else {
					alert("Invalid time.");
				}
			}, false);
			play_pause.innerText="Play/Pause";
			play_pause.addEventListener('click', function() {
				chrome.tabs.executeScript({ code: 
					'if(document.querySelector("video").paused) {' + 
					'	document.querySelector("video").play();' +
					'} else {' +
					' document.querySelector("video").pause();' +
					'}'
				});
			});
			remove_sub.innerText="X";
			remove_sub.addEventListener('click', function() {
				remove_sub.parentElement.remove();
			}, false);
			breaking_div.style.height="0";
			breaking_div.style.flexBasis="100%";
			content.type="text";
			content.style.width="100%";
			content.value = content_array[4];
			
			test.style.display="flex";
			test.style.flexWrap="wrap";
			test.style.border="1px solid black";
			test.append(color1);
			test.append(color2);
			test.append(time1);
			test.append(time2);
			test.append(time_controls);
			test.append(play_pause);
			test.append(remove_sub);
			test.append(breaking_div);
			test.append(content);
			
			container.append(test);
		}
	}
}

function restoreAddedColors() {
	let list = document.getElementById('color-list');
	
	if(bg.color_array.length > 0) {
		let i;
		for(i = 0; i < bg.color_array.length; i++) {
			let individual_color = bg.color_array[i];
			list.append(addColor(individual_color.split(" ")[0], individual_color.split(" ")[1]));
		}
	}
}

function setStorageColors() {
	let stored_colors = document.getElementById('saved-colors');
	
	if(stored_colors.childElementCount > 1) {
		while(stored_colors.children[1] !== undefined) {
			stored_colors.children[1].remove();
		}
	}
	
	chrome.storage.local.get(['color_storage_keys'], function(result) {
		let temp_array = result.color_storage_keys;
		if(temp_array !== undefined && temp_array.length > 0) {
			let i;
			for(i = 0; i < temp_array.length; i++) {
				let option = document.createElement("OPTION");
				option.innerText = temp_array[i];
				stored_colors.append(option);
			}
		}
	});
}

function addColor(c1, c2) {
	let box = document.createElement("DIV");
	let color1 = document.createElement("SPAN");
	let space_span = document.createElement("SPAN");
	let color2 = document.createElement("SPAN");
	let space_span2 = document.createElement("SPAN");
	let set_button = document.createElement("BUTTON");
	let remove_button = document.createElement("BUTTON");
	
	box.style.display="flex";
	box.style.flexWrap="wrap";
	box.style.justifyContent="center";
	box.style.borderTop="1px solid black";
	
	color1.innerHTML = "Text Color: <div></div>";
	color1.firstElementChild.style.width="2em";
	color1.firstElementChild.style.height="1.58em";
	color1.firstElementChild.style.marginLeft="auto";
	color1.firstElementChild.style.marginRight="auto";
	color1.firstElementChild.style.border="1px solid black";
	color1.firstElementChild.value=c1;
	color1.firstElementChild.style.backgroundColor=c1;
	let popupCustom = new Picker({
		parent: color1.firstElementChild,
		popup: 'bottom',
		color: color1.firstElementChild.value,
		alpha: false,
		editorFormat: 'hex',
		onDone: function(color) {
			color1.firstElementChild.style.backgroundColor = color.hex;
			color1.firstElementChild.value = color.hex.substring(0, color.hex.length - 2);
		},
		onOpen: function(color) {
			document.body.style.height = document.body.offsetHeight + color1.firstElementChild.firstElementChild.offsetHeight + "px";
			popupCustom.setColor(color1.firstElementChild.value, true);
		},
		onClose: function() {
			document.body.style.height = "";
		}
	});
	color1.firstElementChild.addEventListener('mousedown', function(event) {
		if(event.button === 1 && event.shiftKey) {
			event.preventDefault();
			copied_color = this.value;
		} else if(event.button === 1) {
			event.preventDefault();
			this.value = copied_color;
			this.style.backgroundColor = copied_color;
		}
	});
	
	space_span.style.whiteSpace="pre";
	space_span.innerText="   ";
	
	color2.innerHTML = "Text Color: <div></div>";
	color2.firstElementChild.style.width="2em";
	color2.firstElementChild.style.height="1.58em";
	color2.firstElementChild.style.marginLeft="auto";
	color2.firstElementChild.style.marginRight="auto";
	color2.firstElementChild.style.border="1px solid black";
	color2.firstElementChild.value=c2;
	color2.firstElementChild.style.backgroundColor=c2;
	let popupCustom2 = new Picker({
		parent: color2.firstElementChild,
		popup: 'bottom',
		color: color2.firstElementChild.value,
		alpha: false,
		editorFormat: 'hex',
		onDone: function(color) {
			color2.firstElementChild.style.backgroundColor = color.hex;
			color2.firstElementChild.value = color.hex.substring(0, color.hex.length - 2);
		},
		onOpen: function(color) {
			document.body.style.height = document.body.offsetHeight + color2.firstElementChild.firstElementChild.offsetHeight + "px";
			popupCustom2.setColor(color2.firstElementChild.value, true);
		},
		onClose: function() {
			document.body.style.height = "";
		}
	});
	color2.firstElementChild.addEventListener('mousedown', function(event) {
		if(event.button === 1 && event.shiftKey) {
			event.preventDefault();
			copied_color = this.value;
		} else if(event.button === 1) {
			event.preventDefault();
			this.value = copied_color;
			this.style.backgroundColor = copied_color;
		}
	});
	
	space_span2.style.whiteSpace="pre";
	space_span2.innerText="   ";
	
	set_button.innerText="Set";
	set_button.addEventListener('click', function() {
		// change the default colors in both this javascript file and the actual html.
		let p = this.parentElement;
		bg.default_text_color = p.children[0].firstElementChild.value;
		bg.default_background_color = p.children[2].firstElementChild.value;
		document.getElementById('text-color-reference').value = p.children[0].firstElementChild.value;
		document.getElementById('background-color-reference').value = p.children[2].firstElementChild.value;
	}, false);
	
	remove_button.innerText="Remove";
	remove_button.addEventListener('click', function() {
		this.parentElement.remove();
	}, false);
	
	box.append(color1);
	box.append(space_span);
	box.append(color2);
	box.append(space_span2);
	box.append(set_button);
	box.append(remove_button);
	
	return box;
}

function saveSBData() {
	storeSubtitleBox();
	storeAddedColors();
}

function storeSubtitleBox() {
	let container = document.getElementById('subtitle-builder-container');
	let full_content = [];
	let i;
	for(i = 0; i < container.childElementCount; i++) {
		let sub = container.children[i];
		let content = [];
		content.push(sub.children[0].value);
		content.push(sub.children[1].value);
		content.push(sub.children[2].value);
		content.push(sub.children[3].value);
		content.push(sub.children[8].value);
		full_content.push(content);
	}
	bg.setSubtitleBoxContent(JSON.stringify(full_content));
	bg.subtitle_box_count = container.childElementCount;
}

function storeAddedColors() {
	let list = document.getElementById('color-list');
	
	let color_array = [];
	let i;
	for(i = 2; i < list.childElementCount; i++) {
		color_array.push(list.children[i].children[0].firstElementChild.value + " " + list.children[i].children[2].firstElementChild.value);
	}
	bg.setColorArray(JSON.stringify(color_array));
}

function shipSubtitleBox() {
	let s = "";
	let container = document.getElementById('subtitle-builder-container');
	
	let i;
	for(i = 0; i < container.childElementCount; i++) {
		let sub = container.children[i];
		let tmp = "";
		tmp += sub.children[2].value + " " + sub.children[3].value + "\n" + ((sub.children[0].value === "#ffffff" && sub.children[1].value === "#000000") ? "" : "<" + sub.children[0].value + ">") + ((sub.children[0].value === "#ffffff" && sub.children[1].value === "#000000") ? "" : "<" + sub.children[1].value + ">") + sub.children[8].value;
		if(verify_file(tmp)) {
			s += tmp;
			s += "\n\n";
		} else {
			alert("Sub #" + i + ". Invalid subtitle: " + tmp);
		}
	}
	s = s.replace(/\n+$/, "");
	return s;
}

function addTestSubtitles() {
	let container = document.getElementById('subtitle-builder-container');
	if(container.childElementCount > 0)
		chrome.tabs.executeScript({ file: 'find_and_report_sb.js' });
}

function firstTimeSubtitleBuild() {
	let s = shipSubtitleBox();
	if(s.length !== 0) {
		let setting1, setting2, setting3;
		chrome.storage.local.get(['settings'], function(result) {
			if(result.settings === undefined) {
				chrome.storage.local.set({settings: ["Default", "Enabled", "4"]});
				setting1 = "Default";
				setting2 = "Enabled";
				setting3 = "4";
			} else {
				setting1 = result.settings[0];
				setting2 = result.settings[1];
				setting3 = result.settings[2];
			}				
			
			chrome.tabs.executeScript({
				code: 
					'let textContent = ' + JSON.stringify(s) + ';' + // changed JSON.stringify(shipSubtitleBox()) to JSON.stringify(s)
					'let sub_style = "' + setting1 + '";' + 
					'let colors_enabled = ' + (setting2 === "Enabled" ? "true" : "false") + ';' + 
					'let font_default_size = ' + setting3 + ';'
			}, function() {
				chrome.tabs.executeScript({file: 'content.js'});
			});
		});
		
	}
}

function subtitleBuild() {
	chrome.tabs.query({active: true, currentWindow: true}, function(tabArray) {
		chrome.tabs.sendMessage(tabArray[0].id, {com: "updateSubtitleTesters", update: shipSubtitleBox()});
	});
}

chrome.runtime.onMessage.addListener(function(request) {
	if(request.com === "getElementSubs") {
		if(request.source === "true") {
			subtitleBuild();
		} else if(request.source === "false") {
			firstTimeSubtitleBuild();
		}	
	}
});

document.getElementById('add-test-subs-button').addEventListener('click', addTestSubtitles, false);
document.getElementById('add-subtitle-button').addEventListener('click', addSubtitleBox, false);

document.getElementById('add-textbox').addEventListener('click', function() {
	let s = "";
	let container = document.getElementById('subtitle-builder-container');
	
	let i;
	for(i = 0; i < container.childElementCount; i++) {
		let sub = container.children[i];
		let tmp = "";
		tmp += sub.children[2].value + " " + sub.children[3].value + "\n" + ((sub.children[0].value === "#ffffff" && sub.children[1].value === "#000000") ? "" : "<" + sub.children[0].value + ">") + ((sub.children[0].value === "#ffffff" && sub.children[1].value === "#000000") ? "" : "<" + sub.children[1].value + ">") + sub.children[8].value;
		if(verify_file(tmp)) {
			s += tmp;
			s += "\n\n";
		}
	}
	s = s.replace(/\n+$/, "");
	
	if(document.getElementById('text-area').value.length === 0) {
		document.getElementById('text-area').value += s;
	} else {
		document.getElementById('text-area').value += "\n\n" + s;
	}
}, false);

document.getElementById('remove-list').addEventListener('click', function() {
	let container = document.getElementById('subtitle-builder-container');
	container.innerHTML='';
}, false);

document.getElementById('color-frame-button').addEventListener('click', function() {
	let list = document.getElementById('color-frame');
	if(list.style.display==="none") {
		list.style.display="flex";
	} else {
		list.style.display="none";
	}
}, false);

document.getElementById('default-set-button').addEventListener('click', function() {
	let p = this.parentElement;
	bg.default_text_color = p.children[2].firstElementChild.value;
	bg.default_background_color = p.children[4].firstElementChild.value;
	document.getElementById('text-color-reference').value = p.children[2].firstElementChild.value;
	document.getElementById('background-color-reference').value = p.children[4].firstElementChild.value;
}, false);

document.getElementById('saved-colors').addEventListener('change', function() {
	let list = document.getElementById('color-list');
	if(this.value !== "") {
		console.log(this.value);
		chrome.storage.local.get([this.value], function(result) {
			let color_array = Object.values(result)[0];
			
			let i;
			while(list.children[2] !== undefined) {
				list.children[2].remove();
			}
			for(i = 0; i < color_array.length; i++) {
				let individual_color = color_array[i];
				list.append(addColor(individual_color.split(" ")[0], individual_color.split(" ")[1]));
			}
		});
	}
}, false);

try {
	browser.runtime.getBrowserInfo(); // Throws an error on Chrome but not FireFox.
	document.getElementById('saved-colors').addEventListener('focus', function() {
		if(this.selectedIndex !== 0) {
			this.selectedIndex = 0;
			this.blur();
		}
	}, false);
} catch(e) {
	document.getElementById('saved-colors').addEventListener('focus', function() {
		this.selectedIndex = 0;
	}, false);
}

document.getElementById('add-color-button').addEventListener('click', function() {
	let list = document.getElementById('color-list');
	if(list.childElementCount < 12)
		list.append(addColor("#ffffff", "#000000"));
}, false);

document.getElementById('save-colors-button').addEventListener('click', function() {
	let name = prompt("Enter the name of the current color set.");
	if(name !== null && name !== "") {
		chrome.storage.local.get(['color_storage_keys'], function(result) {
			if(result.color_storage_keys === undefined) {
				let temp_array = [];
				chrome.storage.local.set({color_storage_keys: temp_array});
			}
			
			chrome.storage.local.get(['color_storage_keys'], function(result) {
				let temp_array = result.color_storage_keys;
				if(temp_array === undefined) temp_array = [];
				if(temp_array.includes(name)) {
					alert("That name is already used by another color.");
				} else if(temp_array.length >= 10) {
					alert("Too many color sets. Delete some sets to add some more.");
				} else {
					let list = document.getElementById('color-list');
					let color_array = [];
					let i;
					for(i = 2; i < list.childElementCount; i++) {
						color_array.push(list.children[i].children[0].firstElementChild.value + " " + list.children[i].children[2].firstElementChild.value);
					}
					
					temp_array.push(name);
					chrome.storage.local.set({ 'color_storage_keys': temp_array });
					chrome.storage.local.set({[name]: color_array});
					setStorageColors();
				}
			});
		});
	}
}, false);

document.getElementById('delete-colors-button').addEventListener('click', function() {
	// chrome.storage.local.clear();
	let selector = document.getElementById('saved-colors');
	if(selector.value === "") {
		alert("Select a color set to delete.");
	} else {
		let temp_array = [];
		chrome.storage.local.get(['color_storage_keys'], function(result) {
			if(result.color_storage_keys !== undefined) {
				temp_array = result.color_storage_keys;
				if(temp_array.indexOf(selector.value) > -1) {
					temp_array.splice(temp_array.indexOf(selector.value), 1);
					chrome.storage.local.set({'color_storage_keys': temp_array});
					chrome.storage.local.remove([selector.value]);
					setStorageColors();
				}
			}
		});
	}
}, false);

window.addEventListener('load', restoreSBData, false);
window.addEventListener('unload', saveSBData, false);