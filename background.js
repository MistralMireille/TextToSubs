var text_content = "";
var sub_list = [];
var sub_list_checked = false;

function parseDom(dom) {
	let grid = dom.querySelectorAll("div[role='grid'] > div[role='row'] > div[role='rowheader'] > span > a[title]");
	if(grid && grid.length > 0) {
		let ids = [];
		let i;
		for(i = 0; i < grid.length; i++) {
			let temp = grid[i].innerText;
			temp = temp.substring(0, temp.length - 4);
			ids.push(temp); 
		}
		console.log(ids);
		return ids;
	}
}

function getSubList(tabId, current_id) {
	let xml = new XMLHttpRequest();
	function reqListener() {
		sub_list = parseDom(this.response);
		sub_list_checked = true;
		if(sub_list.includes(current_id)) chrome.pageAction.setIcon({tabId: tabId, path: 'icons/foundStuff.png'});
		chrome.runtime.sendMessage({com: "justChecked"});
	}
	xml.addEventListener('load', reqListener);
	xml.open('GET', "https://github.com/MistralMireille/mistralmireille.github.io/tree/master/links"); 
	xml.responseType = "document";
	xml.send();
}

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
	if(changeInfo.url && changeInfo.url.match(/\.*youtube.com\/watch/)) {
		chrome.pageAction.show(tabId);
		if(!sub_list_checked) {
			getSubList(tabId, changeInfo.url.split("watch?v=")[1]);
		} else {
			if(sub_list.includes(changeInfo.url.split("watch?v=")[1])) 
				chrome.pageAction.setIcon({tabId: tabId, path: 'icons/foundStuff.png'});
			else
				chrome.pageAction.setIcon({tabId: tabId, path: 'icons/icon16.png'});
		}
	}	else if(changeInfo.url) {
		chrome.pageAction.hide(tabId);
		chrome.pageAction.setIcon({tabId: tabId, path: 'icons/icon16.png'});
	} 
});

chrome.webNavigation.onCommitted.addListener(function(details) {
	if(details.transitionType.toString() === "reload") {
		if(details.url.match(/\.*youtube.com\/watch/)) {
			chrome.pageAction.show(details.tabId);
			if(!sub_list_checked) {
				getSubList(details.tabId, details.url.split("watch?v=")[1]);
			} else {
				if(sub_list.includes(details.url.split("watch?v=")[1])) 
					chrome.pageAction.setIcon({tabId: details.tabId, path: 'icons/foundStuff.png'});
				else
					chrome.pageAction.setIcon({tabId: details.tabId, path: 'icons/icon16.png'});
			}
		}
	}
});