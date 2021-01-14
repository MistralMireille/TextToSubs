let bg = chrome.extension.getBackgroundPage();
let video_id;
let results_open = false;

function insertScript() {
	document.getElementById('add-button').removeEventListener('click', insertScript);
	document.getElementById('add-button').addEventListener('click', errorText, false);
	chrome.tabs.executeScript({
		code: 'let textContent = ' + JSON.stringify(document.getElementById('text-area').value)
	}, function() {
		chrome.tabs.executeScript({file: 'content.js'});
	});
}

function checkMatch() {
	chrome.tabs.query({'active': true, 'windowId': chrome.windows.WINDOW_ID_CURRENT}, function(tabs) {
		let temp = tabs[0].url.toString().split("?v=");
		video_id = temp[temp.length - 1];
		if(bg.sub_list.includes(video_id)) {
			let b = document.getElementById('test');
			b.addEventListener('click', checkGitFile, false);
			b.style.backgroundColor="green";
			b.innerText="Found stuff.";			
		}
	});	
}

function checkForText() {
	if(document.getElementById('text-area').value.length > 0) 
		insertScript();
	else
		alert("No text in the text box.");
}

function checkPrevious() {
	chrome.tabs.executeScript({file: 'find_and_report.js'});
	if(bg.text_content && bg.text_content.length > 0) document.getElementById('text-area').value = bg.text_content;
	if(bg.sub_list_checked && bg.sub_list.length > 0) checkMatch();
}

function errorText() {
	let error_text = document.getElementById('error-text');
	error_text.style.display="block";
}

function perserveText() {
	let text_area_text = document.getElementById('text-area').value;
	bg.text_content = text_area_text;
}

function compressText() {
	let text_area = document.getElementById('text-area');
	if(text_area && text_area.value.length > 0) {
		let text_to_compress = text_area.value;
		text_area.value = LZString.compressToUTF16(text_to_compress);
	} else {
		alert("No text in the text box.");
	}
}

function decompressText() {
	let text_area = document.getElementById('text-area');
	if(text_area && text_area.value.length > 0) {
		let text_to_decompress = text_area.value;
		text_area.value = LZString.decompressFromUTF16(text_to_decompress);
	} else {
		alert("No text in the text box.");
	}
}

function checkGitFile() {
	if(!results_open) {
		results_open = true;
		let git_url_to_ask = "https://gitcdn.link/repo/MistralMireille/mistralmireille.github.io/master/links/" + video_id + ".txt";
		let results_div = document.getElementById('found-subs');
		let xml = new XMLHttpRequest();
		function reqListener() {
			let text = this.responseText;
			
			//pastebin warning message
			let pastebin_notice = document.createElement("P");
			pastebin_notice.style.backgroundColor="black";
			pastebin_notice.style.color="white";
			pastebin_notice.style.margin="0";
			pastebin_notice.innerText="Make sure to copy and paste the raw paste data from pastebins. Otherwise, the empty lines will have spaces.";
			
			//div for styling the pastebin warning message
			let pastebin_notice_div = document.createElement("DIV");
			pastebin_notice_div.style.border="2px solid black";
			pastebin_notice_div.style.width="100%";
			pastebin_notice_div.append(pastebin_notice);
			
			text = text.replace(/\r/gm, "");
			let items = text.split("\n\n");
			let i;
			for(i = 0; i < items.length; i++) {
				let temp_div = document.createElement("DIV");
				let author = document.createElement("P");
				let git_link = document.createElement("A");
				
				temp_div.style.border = "2px solid black";
				temp_div.style.width="100%";
				
				author.innerText=items[i].split("\n")[0];
				author.style.margin="0";
				author.style.backgroundColor="gray";
				
				git_link.innerText=items[i].split("\n")[1];
				git_link.setAttribute("href", items[i].split("\n")[1]);
				git_link.setAttribute("target", "_blank");
				git_link.setAttribute("rel", "noopener noreferrer");
				
				temp_div.append(author);
				temp_div.append(git_link);
				results_div.append(temp_div);
			}
			results_div.append(pastebin_notice_div); //added the pastebin warning to the end
		}
		xml.addEventListener('load', reqListener);
		xml.open('GET', git_url_to_ask);
		xml.send();
	} 
}

chrome.runtime.onMessage.addListener(function(request) {
	if(request.com === "getElement") {
		if(request.source === "true") {
			document.getElementById('add-button').addEventListener('click', errorText, false);
		} else if(request.source === "false") {
			document.getElementById('add-button').addEventListener('click', checkForText, false);
		}	
	}
});

document.getElementById('decompress-text').addEventListener('click', decompressText, false);
document.getElementById('compress-text').addEventListener('click', compressText, false);
window.addEventListener('load', checkPrevious, false);
window.addEventListener('unload', perserveText, false);