var text_content = "";
var sub_list = [];
var sub_list_checked = false;

function getSubList(tabId, current_id) {
	let xml = new XMLHttpRequest();
	function reqListener() {
		let response = JSON.parse(this.response);
		let i;
		for(i = 0; i < response.length; i++) {
			sub_list.push(response[0].name.split("\n")[0]);
		}
		sub_list_checked = true;
		if(sub_list.includes(current_id)) chrome.pageAction.setIcon({tabId: tabId, path: 'icons/foundStuff.png'});
		chrome.runtime.sendMessage({com: "justChecked"});
	}
	xml.addEventListener('load', reqListener);
	xml.open('GET', "https://api.github.com/repos/MistralMireille/mistralmireille.github.io/contents/links"); 
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