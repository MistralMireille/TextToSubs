function find_and_report() {
	if(document.getElementById("already-changed-addSubs")) 
		return "true";
	else 
		return "false";	
}

chrome.runtime.sendMessage({
	com: "getElementSubs",
	source: find_and_report()
});