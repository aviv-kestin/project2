document.addEventListener('DOMContentLoaded', function () {
    const imageContainer = document.querySelector('.image-container');
    const infoPanel = document.querySelector('.info-panel');
    const selectedImg = document.querySelector('.selected-img');
    const title = document.querySelector('.title');
    const subtitle = document.querySelector('.subtitle');
    const bodyText = document.querySelector('.body-text');
    const closeBtn = document.querySelector('.close-btn');
    const homeBtn = document.querySelector('.home');
    const indexBtn = document.querySelector('.index');
    const indexList = document.querySelector('.index-panel');
    const fixedHeaderHeight = document.querySelector('.fixed-header').offsetHeight;
    let indexButtonPressed = false; // Track if the index button is pressed

    const isPhoneViewport = () => {
        return window.innerWidth <= 430 && window.innerHeight <= 932;
    };

    let jsonData = null;

    indexList.style.display = 'none';

    imageContainer.style.top = '0';

    function displayImages() {
        if (jsonData) {
            imageContainer.innerHTML = '';
            const columns = Array.from({ length: 4 }, () => document.createElement('div'));
            columns.forEach(col => {
                col.classList.add('column');
                imageContainer.appendChild(col);
            });

            jsonData.forEach((item, index) => {
                const columnNumber = index % 4;
                const columnDiv = columns[columnNumber];
                const galleryImgWrapper = document.createElement('div');
                galleryImgWrapper.classList.add('gallery-img-wrapper');
                galleryImgWrapper.setAttribute('data-title', item.title);
                galleryImgWrapper.setAttribute('data-subtitle', item.subtitle);
                galleryImgWrapper.setAttribute('data-body', item.bodyText);
                columnDiv.appendChild(galleryImgWrapper);

                const img = document.createElement('img');
                img.src = item.imageUrl;
                img.alt = item.title;
                img.classList.add('gallery-img');
                galleryImgWrapper.appendChild(img);

                img.addEventListener('click', () => {
                    const prevSelected = document.querySelector('.selected-img');
                    if (prevSelected) {
                        prevSelected.classList.remove('selected-img');
                        prevSelected.classList.remove('green-border'); // Remove green border from previously selected image
                    }

                    img.classList.add('selected-img');
                    img.classList.add('green-border'); // Add green border to clicked image

                    selectedImg.src = img.src;
                    title.textContent = img.parentElement.getAttribute('data-title');
                    subtitle.textContent = img.parentElement.getAttribute('data-subtitle');
                    bodyText.textContent = img.parentElement.getAttribute('data-body');

                    if (isPhoneViewport()) {
                        infoPanel.style.top = `${fixedHeaderHeight}px`;
                        infoPanel.style.left = '0';
                        infoPanel.style.width = '100vw';
                        infoPanel.style.height = 'auto';
                        infoPanel.style.maxHeight = '40vh';
                        infoPanel.style.backgroundColor = 'rgb(156, 181, 190)';
                        infoPanel.style.transition = 'top 1.97s ease';
                        imageContainer.style.transition = 'margin 2s ease';
                        imageContainer.classList.add('image-container-shifted');
                    } else {
                        infoPanel.style.left = '0';
                        infoPanel.style.top = '10vh';
                        imageContainer.style.transition = 'transform 1.97s ease, width 1.97s ease';
                        imageContainer.style.transform = 'translateX(50vw)';
                        imageContainer.style.width = '50vw'; // Adjusted width for image container
                    }

                    document.querySelectorAll('.gallery-img').forEach(colImg => {
                        colImg.parentElement.style.width = isPhoneViewport() ? '25vw' : '12.5vw';
                    });
                });
            });
        }
    }

    function displayIndexList() {
        if (jsonData) {
            indexList.innerHTML = '';
            jsonData.forEach((item, index) => {
                const row = document.createElement('div');
                row.classList.add('index-row');
                indexList.appendChild(row);

                const titleElem = document.createElement('h2');
                titleElem.textContent = item.title;
                row.appendChild(titleElem);

                const subtitleElem = document.createElement('h3');
                subtitleElem.textContent = item.subtitle;
                row.appendChild(subtitleElem);

                const bodyTextElem = document.createElement('p');
                bodyTextElem.textContent = item.bodyText;
                row.appendChild(bodyTextElem);

                if (index < jsonData.length - 1) {
                    const divider = document.createElement('hr');
                    divider.classList.add('index-divider'); // Add class to divider for styling
                    row.appendChild(divider);
                }

                // Add event listeners for title hover to display associated image
                titleElem.addEventListener('mouseover', (event) => {
                    const title = titleElem.textContent;
                    const associatedItem = jsonData.find(item => item.title === title);
                    if (associatedItem) {
                        const img = document.createElement('img');
                        img.src = associatedItem.imageUrl;
                        img.classList.add('index-hover-image');
                        img.style.maxHeight = '30vh'; // Limit the height of the image
                        img.style.position = 'fixed';
                        img.style.left = `${event.clientX}px`;
                        img.style.top = `${event.clientY + 20}px`; // Adjust the position to prevent overlapping with the mouse pointer
                        document.body.appendChild(img); // Append the image to the document body instead of imageContainer
                    }
                });

                titleElem.addEventListener('mouseout', () => {
                    const hoverImg = document.querySelector('.index-hover-image');
                    if (hoverImg) {
                        hoverImg.remove();
                    }
                });

                // Add event listener for title click to open info panel with corresponding data
                titleElem.addEventListener('click', () => {
                    closeIndexList();
                    openInfoPanel(item.imageUrl, item.title, item.subtitle, item.bodyText);
                });
            });
        }
    }

    function openInfoPanel(img, titleText, subtitleText, bodyTextContent) {
        selectedImg.src = img;
        title.textContent = titleText;
        subtitle.textContent = subtitleText;
        bodyText.textContent = bodyTextContent;

        if (isPhoneViewport()) {
            infoPanel.style.top = `${fixedHeaderHeight}px`;
            infoPanel.style.left = '0';
            infoPanel.style.width = '100vw';
            infoPanel.style.height = 'auto';
            infoPanel.style.maxHeight = '40vh';
            infoPanel.style.backgroundColor = 'rgb(156, 181, 190)';
            infoPanel.style.transition = 'top 1.97s ease';
            imageContainer.style.transition = 'margin 2s ease';
            imageContainer.classList.add('image-container-shifted');
        } else {
            infoPanel.style.left = '0';
            infoPanel.style.top = '10vh';
            imageContainer.style.transition = 'transform 1.97s ease, width 1.97s ease';
            imageContainer.style.transform = 'translateX(50vw)';
            imageContainer.style.width = '50vw'; // Adjusted width for image container
        }

        document.querySelectorAll('.gallery-img').forEach(colImg => {
            colImg.parentElement.style.width = isPhoneViewport() ? '25vw' : '12.5vw';
        });
    }

    function closeInfoPanel() {
        const prevSelected = document.querySelector('.selected-img');
        if (prevSelected) {
            prevSelected.classList.remove('selected-img');
            prevSelected.classList.remove('green-border'); // Remove green border from previously selected image
        }
        selectedImg.src = '';
        title.textContent = '';
        subtitle.textContent = '';
        bodyText.textContent = '';

        if (isPhoneViewport()) {
            infoPanel.style.top = '-100vh';
            infoPanel.style.transition = 'top 4s ease';
            imageContainer.style.top = '0';
            imageContainer.classList.remove('image-container-shifted');
        } else {
            infoPanel.style.left = '-50vw';
            infoPanel.style.top = '10vh';
            document.querySelectorAll('.gallery-img').forEach(colImg => {
                colImg.parentElement.style.width = '25vw';
            });
            setTimeout(() => {
                imageContainer.style.transition = 'transform 1.97s ease, width 1.97 s ease';
                imageContainer.style.transform = 'translateX(0)';
                imageContainer.style.width = '100vw';
            }, 0);
        }
    }

    function closeIndexList() {
        indexList.style.display = 'none';
        imageContainer.style.display = 'grid';
        indexButtonPressed = false;
    }

    fetch('data.json')
        .then(response => response.json())
        .then(data => {
            jsonData = data;
            displayImages();
            displayIndexList();
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });

    indexBtn.addEventListener('click', () => {
        if (indexList.style.display === 'none') {
            indexList.style.display = 'block';
            indexList.style.top = `calc(10vh + ${fixedHeaderHeight}px)`;
            imageContainer.style.display = 'none';
            indexButtonPressed = true;
        } else {
            closeIndexList();
        }
        closeInfoPanel(); // Close the info panel when index button is clicked
    });

    homeBtn.addEventListener('click', () => {
        location.reload(); // Reload the page when home button is clicked
    });

    closeBtn.addEventListener('click', () => {
        closeInfoPanel(); // Close the info panel when close button is clicked
    });
});

