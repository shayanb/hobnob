function generateQR() {
    let eventTitle = document.getElementById('eventTitle').value.trim();
    if (eventTitle === "") {
        alert("Please enter an event title.");
        return;
    }
    let formattedTitle = encodeURIComponent(eventTitle);
    let url = `https://bloc.im/chat?tab=topics&id=${formattedTitle}`;
    let qrCodeContainer = document.getElementById('qrCodeContainer');
    qrCodeContainer.innerHTML = ''; // Clear previous QR codes

    new QRCode(qrCodeContainer, {
        text: url,
        width: 128,
        height: 128,
        colorDark: "#000000",
        colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel.H
    });

    let qrLink = document.getElementById('qrLink');
    qrLink.href = url;
    let modal = document.getElementById('qrModal');
    modal.classList.remove('hidden');

    document.getElementById('copyButton').onclick = function() {
        navigator.clipboard.writeText(url).then(() => {
            alert('Link copied to clipboard!');
        });
    };

    document.getElementById('shareButton').onclick = function() {
        if (navigator.share) {
            navigator.share({
                title: document.getElementById('eventTitle').value,
                text: 'Check out this event!',
                url: url,
            }).then(() => console.log('Successful share'))
              .catch((error) => console.log('Error sharing', error));
        } else {
            // Fallback to download the image if Web Share API is not available
            downloadQRAsImage(eventTitle, url);
        }
    };
}

function downloadQRAsImage(title, url) {
    let canvas = document.createElement('canvas');
    let context = canvas.getContext('2d');
    canvas.width = 300;  // Adjust size as needed
    canvas.height = 400; // Increased height to accommodate logo and link

    let logo = new Image(); // Define the logo image

    logo.onload = function() {
        // Draw the logo at the top of the canvas
        context.drawImage(logo, (canvas.width - 100) / 2, 10, 100, 100); // Adjust size as needed

        // Draw the QR code below the logo
        let qrCodeCanvas = document.querySelector('#qrCodeContainer canvas');
        context.drawImage(qrCodeCanvas, (canvas.width - qrCodeCanvas.width) / 2, 120);

        // Add shadow for the QR code (optional for visibility)
        context.shadowColor = "rgba(0,0,0,0.5)";
        context.shadowOffsetX = 0;
        context.shadowOffsetY = 4;
        context.shadowBlur = 8;
        context.drawImage(qrCodeCanvas, (canvas.width - qrCodeCanvas.width) / 2, 120); // Draw again to apply shadow

        // Adding the event title
        context.shadowColor = "rgba(0,0,0,0.3)"; // Text shadow for readability
        context.shadowOffsetX = 0;
        context.shadowOffsetY = 2;
        context.shadowBlur = 4;
        context.font = "18px Arial";
        context.textAlign = "center";
        context.fillStyle = "#000"; // Text color
        context.fillText(title, canvas.width / 2, 330);

        // Adding the URL below the QR code
        context.font = "14px Arial";
        context.fillText(url, canvas.width / 2, 360);

        // Remove shadow for subsequent drawings
        context.shadowColor = "transparent";
        context.shadowBlur = 0;

        // Convert canvas to an image for download
        canvas.toBlob(function(blob) {
            let newUrl = URL.createObjectURL(blob);
            let a = document.createElement('a');
            a.href = newUrl;
            a.download = `${title}_QR.png`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        });
    };
    logo.src = './logo.png';  // Path to your logo image
}




// To close the modal when clicking outside
document.getElementById('qrModal').addEventListener('click', function(event) {
    if (event.target === this) {
        this.classList.add('hidden');
    }
});
