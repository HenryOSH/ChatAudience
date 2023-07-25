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
        
        // ��ķ�� ����ũ�� �׼����ϱ�
        navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        .then(stream => {
            // ���� ��Ʈ���� ���� ��ҿ� ����
            const videoStream = new MediaStream([stream.getVideoTracks()[0]]);
            videoElement.srcObject = videoStream;
    
            // ������ ���� MediaRecorder �ʱ�ȭ
            const mediaRecorder = new MediaRecorder(stream);
            const audioChunks = [];
    
            mediaRecorder.ondataavailable = event => {
                audioChunks.push(event.data);
            };
    
            mediaRecorder.onstop = () => {
                const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
                sendDataToBackend(audioBlob);
            };
    
            // 5�� ���� ���� �� ���� (�� �κ��� ���ϴ� ��� ���� ����)
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
