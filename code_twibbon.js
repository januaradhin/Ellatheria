
        let ctx;
        let uploadedImage;
        let offsetX = 0;
        let offsetY = 0;
        let scale = 1;
        let isDragging = false;
        let lastX;
        let lastY;
        const backgroundImageSrc = 'img/twibbon_size.png';
        
        function generateTwibbon() {
            const fileInput = document.getElementById('uploadInput');
            const twibbonContainer = document.getElementById('twibbonContainer');
            const downloadLink = document.getElementById('downloadLink');
            const canvas = document.getElementById('canvas');
            ctx = canvas.getContext('2d');

            if (fileInput.files && fileInput.files[0]) {
                const reader = new FileReader();
                reader.onload = function (e) {
                    const twibbonImage = new Image();
                    twibbonImage.onload = function () {
                        uploadedImage = twibbonImage;
                        canvas.width = twibbonImage.width;
                        canvas.height = twibbonImage.height;
                        drawTwibbon();
                        downloadLink.style.display = 'block'; 
                    };
                    twibbonImage.src = e.target.result;
                };
                reader.readAsDataURL(fileInput.files[0]);
            } else {
                alert("Unggah Gambar Terlebih dahulu");
            }
        }

        function drawTwibbon() {
            const canvas = document.getElementById('canvas');
            const bgImage = new Image();
            bgImage.onload = function () {
                canvas.width = bgImage.width;
                canvas.height = bgImage.height;
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(uploadedImage, offsetX, offsetY, uploadedImage.width * scale, uploadedImage.height * scale);
                ctx.drawImage(bgImage, 0, 0, canvas.width, canvas.height); 

            };
            bgImage.src = backgroundImageSrc;
        }

        function handleMove(event) {
            if (isDragging) {
                const canvas = document.getElementById('canvas');
                const mouseX = event.pageX - canvas.offsetLeft;
                const mouseY = event.pageY - canvas.offsetTop;
                offsetX += mouseX - lastX;
                offsetY += mouseY - lastY;

                drawTwibbon();

                lastX = mouseX;
                lastY = mouseY;
            }
        }

        function handleTouchStart(event) {
            const canvas = document.getElementById('canvas');
            const touch = event.touches[0];
            lastX = touch.pageX - canvas.offsetLeft;
            lastY = touch.pageY - canvas.offsetTop;
            isDragging = true;
        }

        function handleTouchMove(event) {
            event.preventDefault();
            handleMove(event.touches[0]);
        }

        function handleTouchEnd() {
            isDragging = false;
        }

        function zoomIn() {
            scale += 0.1;
            drawTwibbon();
        }

        function zoomOut() {
            scale -= 0.1;
            if (scale < 0.1) {
                scale = 0.1;
            }
            drawTwibbon();
        }

        function handleDownload() {
            const canvas = document.getElementById('canvas');
            const downloadLink = document.getElementById('downloadLink');
            const bgImage = new Image();
            bgImage.onload = function () {
                canvas.width = bgImage.width;
                canvas.height = bgImage.height;
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(uploadedImage, offsetX, offsetY, uploadedImage.width * scale, uploadedImage.height * scale);
                ctx.drawImage(bgImage, 0, 0, canvas.width, canvas.height);
                downloadLink.href = canvas.toDataURL();
                downloadLink.download = 'twibbon_ellatherland#arc17.png';
            };
            bgImage.src = backgroundImageSrc;
        }


        document.getElementById('canvas').addEventListener('mousedown', function (e) {
            lastX = e.pageX - this.offsetLeft;
            lastY = e.pageY - this.offsetTop;
            isDragging = true;
        });

        document.getElementById('canvas').addEventListener('mouseup', function () {
            isDragging = false;
        });

        document.getElementById('canvas').addEventListener('mousemove', handleMove);

        document.getElementById('canvas').addEventListener('touchstart', handleTouchStart);

        document.getElementById('canvas').addEventListener('touchend', handleTouchEnd);

        document.getElementById('canvas').addEventListener('touchmove', handleTouchMove);