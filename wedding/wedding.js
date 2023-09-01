// HTML elements
const modalImage = document.getElementById('modalImage');
const modalVideo = document.getElementById('modalVideo');
const modal = document.querySelector('.modal');
const galleryDiv = document.querySelector('.gallery');
const fileInput = document.querySelector('#file-input');

//Fields
const debugFlag = true;
var medias = [];
let modalIndex = 0;
var fragment;
var folder = "";
const noaddphotofolders = ["Fotograf Elin & Henrik", "Fujifilm"];

function dbg(msg) {
    if (debugFlag) {
        console.log(msg);
    }
}

async function displayImages() {
    medias = [];
    dbg("looking for folder [" + folder + "]");
    try {
        const response = await fetch('get_images.php');
        const data = await response.json();

        dbg('Received data:', data);

        fragment = document.createDocumentFragment();

        if (Array.isArray(data)) {
            if (folder == "") {
                const newURL = window.location.origin + window.location.pathname;
                window.history.pushState({ folder: "" }, '', newURL);
                dbg("Checking base folder");
                renderFolders(data);
                renderMedia(data, "");
            }
            else {
                data.forEach(media => {
                    if (media.type === 'folder' && media.name == folder) {
                        dbg(media.contents);
                        renderMedia(media.contents, media.name);
                    }
                });
            }
        } else {
            dbg('Data is not an array:', data);
        }

        // Clear the gallery and append the fragment
        galleryDiv.innerHTML = '';
        galleryDiv.appendChild(fragment);
        attachMediaEvents(medias);
    } catch (error) {
        dbg('Error:', error);
    }
}

function renderFolders(data) {
    data.forEach(media => {
        if (media.type === 'folder') {
            dbg("adding folder " + media.name);
            // Create a folder element with an icon for each folder
            // Base div
            const folderElement = document.createElement('div');
            folderElement.className = "gallerycontent";
            folderElement.setAttribute("onclick", "changeFolder(\"" + media.name + "\");");
            fragment.appendChild(folderElement);

            //Image
            const folderIcon = document.createElement('img');
            folderIcon.src = 'res/folder_icon.png';
            if (media.name == "Fujifilm") {
                folderIcon.src = 'res/fujifilm.png';
            }
            folderIcon.alt = 'Folder Icon';
            folderIcon.className = ("logoImage");
            folderElement.appendChild(folderIcon);

            //Folder Name
            const folderName = document.createElement('div');
            folderName.className = 'galleryButtonTag';
            folderName.textContent = media.name;
            folderElement.appendChild(folderName);

        }

    });

    // Create add new Folder element
    // Base div
    const addFolderElement = document.createElement('div');
    addFolderElement.className = "gallerycontent";
    fragment.appendChild(addFolderElement);

    // Image
    const addFolderIcon = document.createElement('img');
    addFolderIcon.src = 'res/add_folder_icon.png';
    addFolderIcon.alt = 'add folder Icon';
    addFolderIcon.className = ("logoImage");
    addFolderIcon.setAttribute("onclick", "createFolder();");
    addFolderElement.appendChild(addFolderIcon);

    // Textfield
    const addFolderName = document.createElement('input');
    addFolderName.id = "new_folder_name";
    addFolderName.className = 'galleryButtonTag';
    addFolderName.type = 'text';
    addFolderName.placeholder = "New folder name";
    addFolderElement.appendChild(addFolderName);
}

function renderMedia(data, foldername) {
    data.forEach(media => {
        if (media.type === 'file') {
            // Create a media element based on the file extension
            const mediaElement = createMediaElement(media.name);
            mediaElement.className = "modalable gallerycontent";
            if (mediaElement) {
                fragment.appendChild(mediaElement);
                medias.push(mediaElement);
            }
        }
    });

    //uploadpicturebutton
    if (!noaddphotofolders.includes(foldername)) {
        // Add pictures button
        const addImageElement = document.createElement('img');
        addImageElement.src = 'res/add_image_icon.png';
        addImageElement.className = ("gallerycontent");
        addImageElement.alt = 'Add image icon';
        addImageElement.setAttribute("onclick", "document.getElementById('file-input').click();");
        fragment.appendChild(addImageElement);
    }

    // Download pictures button
    const downloadImageElement = document.createElement('img');
    downloadImageElement.src = 'res/download_icon.png';
    downloadImageElement.className = ("gallerycontent");
    downloadImageElement.alt = 'Download image icon';
    downloadImageElement.setAttribute("onclick", "download()");
    fragment.appendChild(downloadImageElement);
}

// Function to create a media element based on the file extension
function createMediaElement(mediaName) {
    dbg("Creating media element for " + mediaName);
    var mediaPath;
    if (folder == "") {
        mediaPath = 'img/' + mediaName;
    }
    else {
        mediaPath = 'img/' + folder + "/" + mediaName;
    }
    const mediaExtension = mediaName.split('.').pop().toLowerCase();

    if (mediaExtension === 'jpg' || mediaExtension === 'jpeg' || mediaExtension === 'png' || mediaExtension === 'gif') {
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

    return null;
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
    else {
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
    modalVideo.pause();
    modalIndex += n;
    if (modalIndex >= medias.length) {
        modalIndex = 0;
    } else if (modalIndex < 0) {
        modalIndex = medias.length - 1;
    }
    dbg("Looking at modal index " + modalIndex);

    if (medias[modalIndex].tagName == 'VIDEO') {
        modalImage.style.display = 'none';
        modalVideo.style.display = 'block';
        modalVideo.src = medias[modalIndex].src;
        modalVideo.volume = 1;
        modalVideo.play();

    }
    else {
        modalImage.src = medias[modalIndex].src;
        modalImage.style.display = 'block';
        modalVideo.style.display = 'none';
    }
}

function download() {
    const totalMedia = medias.length;
    let totalSize = 0;

    medias.forEach(media => {
        totalSize += media.naturalWidth * media.naturalHeight;
    });

    const totalSizeInMB = (totalSize / (1024 * 1024)).toFixed(2);

    const confirmMessage = `You are about to download ${totalMedia} images, which may take some time and use approximately ${totalSizeInMB} MB of storage. Are you sure you want to continue?`;

    if (window.confirm(confirmMessage)) {
        medias.forEach(media => {
            const mediaURL = media.src;
            const mediaName = mediaURL.substring(mediaURL.lastIndexOf('/') + 1);
            const link = document.createElement('a');
            link.href = mediaURL;
            link.download = mediaName;
            link.click();
        });
    }
}


// Automatically submit the form when files are selected
fileInput.addEventListener('change', () => {
    const formData = new FormData();
    const files = fileInput.files;
    for (let i = 0; i < files.length; i++) {
        formData.append('file[]', files[i]);
    }
    formData.append('folderName', folder);

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
        dbg("attaching events to " + media.name);

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

            if (media.tagName == 'VIDEO') {
                media.play();
                dbg("Mousing over video");
            }
        });

        media.addEventListener('mouseout', () => {
            media.style.transform = 'scale(1, 1)';
            if (media.tagName == 'VIDEO') {
                media.pause();
                dbg("Mousing away video");
            }
        });
    });
}

function createFolder() {
    const textinput = document.getElementById("new_folder_name");
    const folderName = textinput.value;
    dbg(folderName);

    if (folderName) {
        fetch('create_folder.php', {
            method: 'POST',
            body: JSON.stringify({ folderName }),
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(response => response.text())
            .then(message => {
                alert(message); // Display the response message
                displayImages();
            })
            .catch(error => {
                console.error('Error:', error);
            });
    } else {
        alert('Please enter a folder name.');
    }
}

// Function to change folder and update URL
function changeFolder(newFolder) {
    folder = newFolder;
    displayImages();

    // Use pushState to update the URL and store the folder in the history state
    const newURL = window.location.origin + window.location.pathname + '?folder=' + newFolder;
    window.history.pushState({ folder: newFolder }, '', newURL);
}

// Event handler for the back button
window.onpopstate = function (event) {
    if (event.state && event.state.folder) {
        folder = event.state.folder;
        displayImages();
    } else {
        // Handle the case where there's no folder in the state (e.g., going back to the base folder)
        folder = '';
        displayImages();
    }
}