Results();
        setupEventListeners();
    }

    // Set up event listeners
    function setupEventListeners() {
        // Mobile navigation
        hamburger.addEventListener('click', toggleMobileMenu);
        
        // Search functionality
        searchButton.addEventListener('click', performSearch);
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') performSearch();
        });

        // Filter functionality
        genderFilter.addEventListener('change', function(e) {
            currentState.filters.gender = e.target.value;
            filterPersons();
        });

        ageFilter.addEventListener('change', function(e) {
            currentState.filters.ageRange = e.target.value;
            filterPersons();
        });

        locationFilter.addEventListener('input', function(e) {
            currentState.filters.location = e.target.value;
            filterPersons();
        });

        // Sort functionality
        sortBy.addEventListener('change', function(e) {
            currentState.sortBy = e.target.value;
            sortPersons();
            renderResults();
        });

        // File upload display
        fileUpload.addEventListener('change', function() {
            if (this.files.length > 0) {
                fileName.textContent = this.files[0].name;
            } else {
                fileName.textContent = 'No file selected';
            }
        });

        // Form submission
        reportForm.addEventListener('submit', function(e) {
            e.preventDefault();
            submitReport();
        });

        // Modal close
        closeModal.addEventListener('click', closePersonModal);
        window.addEventListener('click', function(e) {
            if (e.target === modal) {
                closePersonModal();
            }
        });
    }

    // Toggle mobile menu
    function toggleMobileMenu() {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
    }

    // Perform search
    function performSearch() {
        currentState.searchTerm = searchInput.value.trim().toLowerCase();
        filterPersons();
    }

    // Filter persons based on current state
    function filterPersons() {
        const { searchTerm, filters, persons } = currentState;
        
        currentState.filteredPersons = persons.filter(person => {
            // Check search term against name and description
            const matchesSearch = searchTerm === '' || 
                person.name.toLowerCase().includes(searchTerm) || 
                person.description.toLowerCase().includes(searchTerm);
            
            // Check gender filter
            const matchesGender = filters.gender === '' || person.gender === filters.gender;
            
            // Check age filter
            let matchesAge = true;
            if (filters.ageRange !== '') {
                const [min, max] = filters.ageRange.split('-').map(Number);
                if (filters.ageRange === '65+') {
                    matchesAge = person.age >= 65;
                } else {
                    matchesAge = person.age >= min && person.age <= max;
                }
            }
            
            // Check location filter
            const matchesLocation = filters.location === '' || 
                person.lastSeen.toLowerCase().includes(filters.location.toLowerCase());
            
            return matchesSearch && matchesGender && matchesAge && matchesLocation;
        });

        sortPersons();
        renderResults();
    }

    // Sort persons based on current sort option
    function sortPersons() {
        const { sortBy, filteredPersons } = currentState;
        
        switch(sortBy) {
            case 'recent':
                filteredPersons.sort((a, b) => new Date(b.dateMissing) - new Date(a.dateMissing));
                break;
            case 'oldest':
                filteredPersons.sort((a, b) => new Date(a.dateMissing) - new Date(b.dateMissing));
                break;
            case 'age':
                filteredPersons.sort((a, b) => a.age - b.age);
                break;
            case 'location':
                filteredPersons.sort((a, b) => a.lastSeen.localeCompare(b.lastSeen));
                break;
            default:
                break;
        }
    }

    // Render featured cases
    function renderFeaturedCases() {
        featuredContainer.innerHTML = '';
        
        currentState.featuredPersons.forEach(person => {
            const featuredCard = document.createElement('div');
            featuredCard.className = 'featured-card';
            featuredCard.innerHTML = `
                <div class="featured-img">
                    <img src="${person.image}" alt="${person.name}">
                </div>
                <div class="featured-content">
                    <h3>${person.name}</h3>
                    <p>Last seen in ${person.lastSeen} on ${person.dateMissing}</p>
                    <span class="featured-status">${person.status}</span>
                </div>
            `;
            featuredCard.addEventListener('click', () => openPersonModal(person));
            featuredContainer.appendChild(featuredCard);
        });
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


