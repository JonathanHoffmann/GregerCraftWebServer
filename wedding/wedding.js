let modalIndex = 0;
const modalImage = document.getElementById('modalImage');
const modalVideo = document.getElementById('modalVideo');
const modal = document.querySelector('.modal');
const modalContent = document.querySelector('.modal-content');
const galleryDiv = document.querySelector('.gallery');
const uploadForm = document.querySelector('#upload-form');
const fileInput = document.querySelector('#file-input');
const downloadAllButton = document.getElementById('downloadAllButton');
const debugFlag = true;

function dbg(msg) {
    if (debugFlag) {
        console.log(msg);
    }
}

async function displayImages() {
    fileInput.innerHTML = "ha";
    try {
        const response = await fetch('get_images.php');
        const data = await response.json();

        dbg('Received data:', data);

        const fragment = document.createDocumentFragment();

        if (Array.isArray(data)) {
            data.forEach(mediaName => {
                const mediaElement = createMediaElement(mediaName);
                if (mediaElement) {
                    fragment.appendChild(mediaElement);
                }
            });
        } else {
            dbg('Data is not an array:', data);
        }

        // Clear the gallery and append the fragment
        galleryDiv.innerHTML = '';
        galleryDiv.appendChild(fragment);
        const medias = galleryDiv.querySelectorAll('img, video'); // Query images and videos inside the galleryDiv
        //const videos = galleryDiv.querySelectorAll('video');
        attachMediaEvents(medias);
        //attachImageMouseoverEvent(images);
        //attachVideoMouseOverEvent(videos);
    } catch (error) {
        dbg('Error:', error);
    }

}

// Function to create a media element based on the file extension
function createMediaElement(mediaName) {
    const mediaPath = 'img/' + mediaName;
    const mediaExtension = mediaName.split('.').pop().toLowerCase();

    if (mediaExtension === 'jpg' || mediaExtension === 'jpeg' || mediaExtension === 'png') {
        // Create an image element for images
        const imageElement = document.createElement('img');
        imageElement.src = mediaPath;
        imageElement.alt = 'Wedding Media';
        return imageElement;
    } else if (mediaExtension === 'mp4' || mediaExtension === 'webm' || mediaExtension === 'ogg' || mediaExtension === 'mov') {
        // Create a video element for videos
        const videoElement = document.createElement('video');
        videoElement.src = mediaPath;
        videoElement.controls = true;
        videoElement.volume = 0;
        return videoElement;
    }

    return null; // Return null for unsupported media types
}


// Open the full-screen image modal
function openModal(media) {
    modal.style.display = 'block';
    if (media.tagName == 'VIDEO') {
        modalImage.style.display = 'none';
        modalVideo.style.display = 'block';
        modalVideo.src = media.src;
        modalVideo.volume = 1;
        modalVideo.play();

    }
    else
    {
        modalImage.src = media.src;
        modalImage.style.display = 'block';
        modalVideo.style.display = 'none';
    }
}

// Close the full-screen image modal
function closeModal() {
    modal.style.display = 'none';
    modalVideo.pause();
}


// Change the image in the full-screen modal
function changeModalImage(n) {
    const medias = galleryDiv.querySelectorAll('img, video'); // Query images and videos inside the galleryDiv
    modalVideo.pause();
    modalIndex += n;
    dbg("Looking at modal index " + modalIndex);
    if (modalIndex >= medias.length) {
        modalIndex = 0;
    } else if (modalIndex < 0) {
        modalIndex = medias.length - 1;
    }

    if (medias[modalIndex].tagName == 'VIDEO') {
        modalImage.style.display = 'none';
        modalVideo.style.display = 'block';
        modalVideo.src = medias[modalIndex].src;
        modalVideo.volume = 1;
        modalVideo.play();

    }
    else
    {
        modalImage.src = medias[modalIndex].src;
        modalImage.style.display = 'block';
        modalVideo.style.display = 'none';
    }
}


// Attach click event to close button and arrow buttons
const closeBtn = document.querySelector('.close');
closeBtn.addEventListener('click', closeModal);

downloadAllButton.addEventListener('click', () => {
    const images = document.querySelectorAll('.gallery img');
    const totalImages = images.length;
    let totalSize = 0;

    images.forEach(image => {
        totalSize += image.naturalWidth * image.naturalHeight; // Calculate approximate image size
    });

    const totalSizeInMB = (totalSize / (1024 * 1024)).toFixed(2);

    const confirmMessage = `You are about to download ${totalImages} images, which may take some time and use approximately ${totalSizeInMB} MB of storage. Are you sure you want to continue?`;

    if (window.confirm(confirmMessage)) {
        images.forEach(image => {
            const imageURL = image.src;
            const imageName = imageURL.substring(imageURL.lastIndexOf('/') + 1);
            const link = document.createElement('a');
            link.href = imageURL;
            link.download = imageName;
            link.click();
        });
    }
});


// Automatically submit the form when files are selected
fileInput.addEventListener('change', () => {
    const formData = new FormData();
    const files = fileInput.files;
    for (let i = 0; i < files.length; i++) {
        formData.append('file[]', files[i]);
    }

    uploadImages(formData);
});

async function uploadImages(formData) {
    try {
        const response = await fetch('weddingupload.php', {
            method: 'POST',
            body: formData
        });
        const data = await response.text();

        alert(data);
        displayImages();  // Refresh the images after uploading
    } catch (error) {
        dbg('Error:', error);
    }
}

modal.addEventListener('click', (event) => {
    if (event.target === modal) {
        closeModal();
    }
});

document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') {
        changeModalImage(-1);
    } else if (event.key === 'ArrowRight') {
        changeModalImage(1);
    } else if (event.key === 'Escape') {
        closeModal();
    }
});

function attachMediaEvents(medias) {
    medias.forEach((media, index) => {
        var isVid = false;
        if (media.tagName == 'VIDEO') {
            isVid = true;
            dbg("found video");
        }

        //click open modal
        media.addEventListener('click', () => {
            openModal(media);
            modalIndex = index;
            dbg("Index for clicked media: " + index);
        });


        //mouseover play video and enlarge
        media.addEventListener('mouseover', () => {
            let natwidth = media.naturalWidth;
            let natheight = media.naturalHeight;
            let height = media.offsetHeight;
            var scaledheight = height * 1.1;
            let width = media.offsetWidth;
            var scaleY = scaledheight / natheight;
            var shouldX = natwidth * scaleY;
            var scaleX = shouldX / width;
            dbg('hovering height ' + height + "\nscaledheight " + scaledheight + '\nnatheight ' + natheight + "\nnatwidth " + natwidth + "\nwidth " + width + "\nscale " + scaleX + "\nscaley " + scaleY);  // Print the received data for debugging
            media.style.transform = 'scale(' + scaleX + ', 1.1)';

            if (isVid) {
                media.play();
                dbg("Mousing over video");
            }
        });

        media.addEventListener('mouseout', () => {
            media.style.transform = 'scale(1, 1)';
            if (isVid) {
                media.pause();
                dbg("Mousing away video");
            }
        });
    });
}