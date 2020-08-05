const video = document.getElementById('video');

function startVideo() {

    navigator.getUserMedia = (navigator.getUserMedia ||
        navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia ||
        navigator.msGetUserMedia);

     navigator.getUserMedia(
         { video: {} },
         stream => video.srcObject =  stream,
         err => console.log(err)
     )   
}

// startVideo();

Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
    faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
    faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
    faceapi.nets.faceExpressionNet.loadFromUri('/models'),
    faceapi.nets.ageGenderNet.loadFromUri('/models'),
]).then(startVideo);

video.addEventListener('play', () => {
    const canvas = faceapi.createCanvasFromMedia(video);
    document.body.append(canvas);
    const displaySize = {width: video.width, height: video.height};
    faceapi.matchDimensions(canvas, displaySize);
    setInterval( async () => {

        // Se establece desde donde se obtendran las deteciones
        const detections = await faceapi.detectAllFaces(video, 
            new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions();

        // Realizamos las Detecciones del rostro Via la camara Web
        const resizedDetections = faceapi.resizeResults(detections, displaySize);

       /*  // Limpiamos las detecciones para que no se manche nuestra PANTALLA
        canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
 */
        // Aqui llamamos las Detecciones
        faceapi.draw.drawDetections(canvas, resizedDetections);

       /*  // Se llaman los LandMarks
        faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);

        // Se Detectan las Expresiones
        faceapi.draw.drawFaceExpression(canvas, resizedDetections);
            */
    }, 100); 
})