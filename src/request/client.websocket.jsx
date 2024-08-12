const client = new WebSocket("ws://127.0.0.1:7001")
client.onopen = () => {
    console.log("client connected");
    client.send("Hello");
}

client.onmessage = (message) =>{
    console.log(message.data)
}

export async function send(message) {
    client.send(message);
}
