
    }

    // Render search results
    function renderResults() {
        resultsContainer.innerHTML = '';
        
        if (currentState.filteredPersons.length === 0) {
            resultsContainer.innerHTML = `
                <div class="no-results">
                    <i class="fas fa-user-slash"></i>
                    <p>No matching results found. Try different search criteria.</p>
                </div>
            `;
            return;
        }
        
        currentState.filteredPersons.forEach(person => {
            const personCard = document.createElement('div');
            personCard.className = 'person-card';
            personCard.innerHTML = `
                <div class="person-img">
                    <img src="${person.image}" alt="${person.name}">
                    <span class="person-status">${person.status}</span>
                </div>
                <div class="person-info">
                    <h3>${person.name}</h3>
                    <div class="person-location">
                        <i class="fas fa-map-marker-alt"></i>
                        <span>${person.lastSeen}</span>
                    </div>
                    <p class="person-date">Missing since ${person.dateMissing}</p>
                    <div class="person-meta">
                        <span>${person.age} years</span>
                        <span>${person.gender}</span>
                    </div>
                </div>
            `;
            personCard.addEventListener('click', () => openPersonModal(person));
            resultsContainer.appendChild(personCard);
        });
    }

    // Open person modal
    function openPersonModal(person) {
        currentState.currentPerson = person;
        modalBody.innerHTML = `
            <div class="modal-person">
                <div class="modal-img">
                    <img src="${person.image}" alt="${person.name}">
                </div>
                <div class="modal-info">
                    <h2>${person.name}</h2>
                    <p>Last seen in ${person.lastSeen} on ${person.dateMissing}</p>
                    <div class="modal-meta">
                        <span>${person.age} years old</span>
                        <span>${person.gender}</span>
                        <span>Case #${person.caseNumber}</span>
                    </div>
                    <div class="modal-description">
                        <p>${person.description}</p>
                    </div>
                    <div class="modal-contact">
                        <h3>Contact Information</h3>
                        <p>If you have any information about ${person.name}, please contact:</p>
                        <p>${person.contact}</p>
                        <a href="#report"><i class="fas fa-flag"></i> Report Sighting</a>
                    </div>
                </div>
            </div>
        `;
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }

    // Close person modal
    function closePersonModal() {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }

    // Submit report form
    function submitReport() {
        const reporterName = document.getElementById('reporter-name').value;
        const reporterEmail = document.getElementById('reporter-email').value;
        const personName = document.getElementById('person-name').value;
        const sightingDetails = document.getElementById('sighting-details').value;
        const sightingPhoto = document.getElementById('sighting-photo').files[0];
        
        const reportData = {
            reporterName,
            reporterEmail,
            personName,
            sightingDetails,
            sightingPhoto: sightingPhoto ? sightingPhoto.name : null,
            timestamp: new Date().toISOString()
        };
        
        // In a real app, this would send to a server
        console.log('Report submitted:', reportData);
        
        // Show success message
        alert('Thank you for your report. We will review the information and contact you if needed.');
        
        // Reset form
        reportForm.reset();
        fileName.textContent = 'No file selected';
    }

    // Initialize the app
    init();
});


