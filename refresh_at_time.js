let video = document.querySelector('video');
if(video) {
	let location = window.location.href;
	if(location.match(/&t=[0-9]+m?([0-9]+)?s?/)) {
		location = location.replace(/&t=[0-9]+m?([0-9]+)?s?/, "");
		location += "&t=" + Math.floor(video.currentTime);
	} else {
		location += "&t=" + Math.floor(video.currentTime);
	}
	window.location.replace(location);
}