const websocket = new WebSocket("wss://echo-ws-service.herokuapp.com/");

document.addEventListener("DOMContentLoaded", initChat);

function initChat() {
	const connectionStatus = document.querySelector(".status__text");
	const chatWindow = document.querySelector(".chat-window");
	const inputText = document.querySelector(".input__message");

	websocket.onerror = () => {
		connectionStatus.textContent = "connection error";
		connectionStatus.style = "color: red";
	};

	websocket.onopen = () => {
		connectionStatus.textContent = "connected";
		connectionStatus.style = "color: green";
	};

	websocket.onmessage = (event) => {
		receiveMessage(event);
	};

	document.querySelector(".input__btn-send").addEventListener("click", sendMessage);

	document.querySelector(".input__btn-geo").addEventListener("click", sendGeo);

	function sendMessage() {
		if (!inputText.value) return;

		websocket.send(inputText.value);
		chatWindow.innerHTML += `<div class='message message-sent border0-5'>${inputText.value}</div>`;
		chatWindow.scrollTop = chatWindow.scrollHeight;
		inputText.value = "";
	}

	function receiveMessage(event) {
		const regExp = /^\d+.\d+ \+ +\d+.\d+$/;

		if (event.data.match(regExp)) return;

		chatWindow.innerHTML += `<div class='message message-received border0-5'>${event.data}</div>`;
		chatWindow.scrollTop = chatWindow.scrollHeight;
	}

	function sendGeo() {
		if ("geolocation" in navigator) {
			navigator.geolocation.getCurrentPosition((position) => {
				const { coords } = position;
                console.log(coords);
				let coordinates = `${coords.latitude} + ${coords.longitude}`;
				websocket.send(coordinates);
				chatWindow.innerHTML += `<div class='message message-sent border0-5'><a href="https://www.openstreetmap.org/#map=12/${coords.latitude}/${coords.longitude}">My location</a></div>`;
				chatWindow.scrollTop = chatWindow.scrollHeight;
			});
		} else {
			chatWindow.innerHTML += `<div class='geo-error'>Geolocation is unavailable</div>`;
		}
	}
}
