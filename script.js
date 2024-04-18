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
        colorDark : "#000000",
        colorLight : "#ffffff",
        correctLevel : QRCode.CorrectLevel.H
    });

    let qrLink = document.getElementById('qrLink');
    qrLink.value = url;
    let modal = document.getElementById('qrModal');
    modal.classList.remove('hidden');
    modal.querySelector('.fade-in').classList.add('fade-in');

    document.getElementById('copyButton').onclick = function() {
        navigator.clipboard.writeText(url).then(() => {
            alert('Link copied to clipboard!');
        });
    };

    document.getElementById('shareButton').onclick = function() {
        shareQRAsImage(eventTitle, url);
    };
}

function shareQRAsImage(title, url) {
    // Create a new canvas to compose the final image
    let canvas = document.createElement('canvas');
    let context = canvas.getContext('2d');
    canvas.width = 300;  // Set the width of the final image
    canvas.height = 350; // Set the height to accommodate QR, title, and URL

    // Get the QR Code canvas and draw it onto the new canvas
    let qrCodeCanvas = document.querySelector('#qrCodeContainer canvas');
    context.drawImage(qrCodeCanvas, 85, 50);  // Position the QR code within the new canvas

    // Adding the event title at the top
    context.font = "18px Arial";
    context.textAlign = "center";
    context.fillText(title, canvas.width / 2, 30);

    // Adding the URL at the bottom
    context.font = "14px Arial";
    context.fillText(url, canvas.width / 2, canvas.height - 20);

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
}


// To close the modal when clicking outside
document.getElementById('qrModal').addEventListener('click', function(event) {
    if (event.target === this) {
        this.classList.add('hidden');
    }
});
