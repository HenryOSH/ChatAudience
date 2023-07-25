const videoElement = document.getElementById('webcam');

navigator.mediaDevices.getUserMedia({ video: true })
    .then(stream => {
        videoElement.srcObject = stream;
    })
    .catch(error => {
        console.error("Error accessing webcam: ", error);
    });

    // app.js
    document.addEventListener("DOMContentLoaded", function() {
        const videoElement = document.getElementById('webcam');
        
        // 웹캠과 마이크에 액세스하기
        navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        .then(stream => {
            // 비디오 스트림만 비디오 요소에 연결
            const videoStream = new MediaStream([stream.getVideoTracks()[0]]);
            videoElement.srcObject = videoStream;
    
            // 녹음을 위한 MediaRecorder 초기화
            const mediaRecorder = new MediaRecorder(stream);
            const audioChunks = [];
    
            mediaRecorder.ondataavailable = event => {
                audioChunks.push(event.data);
            };
    
            mediaRecorder.onstop = () => {
                const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
                sendDataToBackend(audioBlob);
            };
    
            // 5초 동안 녹음 후 중지 (이 부분은 원하는 대로 조정 가능)
            mediaRecorder.start();
            setTimeout(() => mediaRecorder.stop(), 5000);
        })
        .catch(err => {
            console.error("Error accessing media devices.", err);
        });
    });

function sendDataToBackend(audioBlob) {
    const formData = new FormData();
    formData.append("audio", audioBlob, "audio.wav");

    fetch('http://localhost:3000/transcribe', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        console.log("Transcription:", data.text);
    })
    .catch(error => {
        console.error("Error sending audio to backend:", error);
    });
}
