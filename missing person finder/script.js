
document.addEventListener('DOMContentLoaded', function() {
    // Sample data for missing persons
    const missingPersons = [
        {
            id: 1,
            name: "Sarah Johnson",
            age: 24,
            gender: "female",
            lastSeen: "Chicago, IL",
            dateMissing: "May 15, 2023",
            description: "Sarah was last seen leaving her apartment building in the Lincoln Park area around 8:30 PM. She was wearing a blue Columbia jacket, black jeans, and white sneakers. Sarah has a small heart-shaped tattoo on her left wrist. Her family reports that she was in good spirits and there were no signs of distress before her disappearance. She was expected at work the next morning but never arrived. Local authorities have been investigating but have found no substantial leads.",
            image: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80",
            contact: "Chicago PD: (312) 555-1234 | Family Hotline: (312) 555-5678",
            featured: true,
            status: "Active",
            caseNumber: "MP-2023-0456"
        },
        {
            id: 2,
            name: "Michael Chen",
            age: 17,
            gender: "male",
            lastSeen: "San Francisco, CA",
            dateMissing: "June 22, 2023",
            description: "Michael didn't return home from school on the afternoon of June 22nd. He was last seen by classmates at Washington High School around 3:15 PM. Michael is a junior with brown hair, brown eyes, and wears glasses. He was last seen wearing a gray hoodie with the school logo, black jeans, and black Vans sneakers. His phone last pinged near Golden Gate Park but has since been turned off. Michael has no history of running away and his disappearance is considered highly suspicious by authorities.",
            image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80",
            contact: "SFPD Missing Persons: (415) 555-2345 | Tip Line: (415) 555-7890",
            featured: true,
            status: "Active",
            caseNumber: "MP-2023-0789"
        },
        {
            id: 3,
            name: "Emily Rodriguez",
            age: 32,
            gender: "female",
            lastSeen: "Miami, FL",
            dateMissing: "April 10, 2023",
            description: "Emily was last seen at her workplace, a café on Ocean Drive, where she worked as a manager. She clocked out at 5 PM but never arrived home. Her car was found parked near Lummus Park with her purse and phone still inside. Emily has dark brown hair, brown eyes, and a distinctive rose tattoo on her left wrist. She was wearing a white blouse and denim shorts when last seen. There was unusual activity on her bank account the day after her disappearance, but no further leads have been developed.",
            image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80",
            contact: "Miami-Dade PD: (305) 555-3456 | Crime Stoppers: (305) 555-TIPS",
            featured: false,
            status: "Active",
            caseNumber: "MP-2023-0123"
        },
        {
            id: 4,
            name: "David Wilson",
            age: 45,
            gender: "male",
            lastSeen: "Denver, CO",
            dateMissing: "March 5, 2023",
            description: "David went for a hike in Rocky Mountain National Park and didn't return as scheduled. He was last seen at the Bear Lake trailhead around 9 AM. David is an experienced hiker but was unprepared for sudden weather changes. Search and rescue teams found some of his equipment along the trail but no sign of David. He was wearing a red Osprey backpack, hiking boots, and a green rain jacket. David has a distinctive scar above his right eyebrow from a childhood accident.",
            image: "https://images.unsplash.com/photo-1552058544-f2b08422138a?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80",
            contact: "National Park Service: (970) 555-1234 | Family: (303) 555-7890",
            featured: false,
            status: "Active",
            caseNumber: "MP-2023-0345"
        },
        {
            id: 5,
            name: "Olivia Martinez",
            age: 8,
            gender: "female",
            lastSeen: "Phoenix, AZ",
            dateMissing: "July 18, 2023",
            description: "Olivia was last seen at a local park where she was playing with friends during a family barbecue. She was wearing a pink sundress with white flowers and carrying a stuffed white bunny named 'Snowball.' Olivia has long brown hair usually worn in braids and a gap between her front teeth. Witnesses reported seeing a suspicious vehicle in the area around the time of her disappearance. The FBI has joined the investigation and is offering a $25,000 reward for information leading to Olivia's safe return.",
            image: "https://images.unsplash.com/photo-1551650975-87deedd944c3?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80",
            contact: "Phoenix PD: (602) 555-5678 | FBI Tip Line: 1-800-CALL-FBI",
            featured: true,
            status: "Active",
            caseNumber: "MP-2023-0567"
        },
        {
            id: 6,
            name: "James Thompson",
            age: 68,
            gender: "male",
            lastSeen: "Boston, MA",
            dateMissing: "February 28, 2023",
            description: "James has Alzheimer's and wandered away from his home in the Brighton neighborhood. He was last seen on security cameras near a convenience store on Commonwealth Avenue. James is 6' tall with gray hair and blue eyes. He was wearing a brown leather jacket, blue jeans, and black loafers. He may appear confused and might not remember his name or address. Despite extensive searches by police and volunteers, there have been no confirmed sightings since his disappearance.",
            image: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80",
            contact: "Boston PD: (617) 555-6789 | Silver Alert: (888) 555-7890",
            featured: false,
            status: "Active",
            caseNumber: "MP-2023-0678"
        }
    ];

    // DOM Elements
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-button');
    const genderFilter = document.getElementById('gender-filter');
    const ageFilter = document.getElementById('age-filter');
    const locationFilter = document.getElementById('location-filter');
    const sortBy = document.getElementById('sort-by');
    const resultsContainer = document.getElementById('results-container');
    const featuredContainer = document.getElementById('featured-container');
    const reportForm = document.getElementById('sighting-form');
    const fileUpload = document.getElementById('sighting-photo');
    const fileName = document.getElementById('file-name');
    const modal = document.getElementById('person-modal');
    const modalBody = document.getElementById('modal-body');
    const closeModal = document.querySelector('.close-modal');

    // Current state
    let currentState = {
        persons: [...missingPersons],
        filteredPersons: [...missingPersons],
        featuredPersons: missingPersons.filter(person => person.featured),
        currentPerson: null,
        searchTerm: '',
        filters: {
            gender: '',
            ageRange: '',
            location: ''
        },
        sortBy: 'recent'
    };

    // Initialize the app
    function init() {
        renderFeaturedCases();
        renderResults();
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

