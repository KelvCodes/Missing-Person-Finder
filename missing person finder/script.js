document.addEventListener('DOMContentLoaded', function() {
    // Mobile Navigation
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    
    hamburger.addEventListener('click', function() {
        this.classList.toggle('active');
        navLinks.classList.toggle('active');
    });
    
    // Close mobile menu when clicking on a link
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });
    
    // Sample data for missing persons (in a real app, this would come from an API)
    const missingPersons = [
        {
            id: 1,
            name: "Sarah Johnson",
            age: 24,
            gender: "female",
            lastSeen: "Chicago, IL",
            dateMissing: "2023-05-15",
            description: "Sarah was last seen leaving her apartment building. She was wearing a blue jacket and black jeans.",
            image: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80",
            contact: "Chicago PD: (312) 555-1234",
            featured: true,
            status: "Active"
        },
        {
            id: 2,
            name: "Michael Chen",
            age: 17,
            gender: "male",
            lastSeen: "San Francisco, CA",
            dateMissing: "2023-06-22",
            description: "Michael didn't return home from school. He's a high school junior with brown hair and glasses.",
            image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80",
            contact: "SFPD Missing Persons: (415) 555-2345",
            featured: true,
            status: "Active"
        },
        {
            id: 3,
            name: "Emily Rodriguez",
            age: 32,
            gender: "female",
            lastSeen: "Miami, FL",
            dateMissing: "2023-04-10",
            description: "Emily was last seen at her workplace. She has a tattoo of a rose on her left wrist.",
            image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80",
            contact: "Miami-Dade PD: (305) 555-3456",
            featured: false,
            status: "Active"
        },
        {
            id: 4,
            name: "David Wilson",
            age: 45,
            gender: "male",
            lastSeen: "Denver, CO",
            dateMissing: "2023-03-05",
            description: "David went for a hike and didn't return. He was wearing a red backpack and hiking boots.",
            image: "https://images.unsplash.com/photo-1552058544-f2b08422138a?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80",
            contact: "Denver PD: (303) 555-4567",
            featured: false,
            status: "Active"
        },
        {
            id: 5,
            name: "Olivia Martinez",
            age: 8,
            gender: "female",
            lastSeen: "Phoenix, AZ",
            dateMissing: "2023-07-18",
            description: "Olivia was last seen at a local park. She was wearing a pink dress and carrying a stuffed bunny.",
            image: "https://images.unsplash.com/photo-1551650975-87deedd944c3?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80",
            contact: "Phoenix PD: (602) 555-5678",
            featured: true,
            status: "Active"
        },
        {
            id: 6,
            name: "James Thompson",
            age: 68,
            gender: "male",
            lastSeen: "Boston, MA",
            dateMissing: "2023-02-28",
            description: "James has Alzheimer's and wandered away from home. He may be confused and disoriented.",
            image: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80",
            contact: "Boston PD: (617) 555-6789",
            featured: false,
            status: "Active"
        }
    ];
    
    // Display featured cases
    const featuredContainer = document.getElementById('featured-container');
    const featuredCases = missingPersons.filter(person => person.featured);
    
    featuredCases.forEach(person => {
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
        featuredCard.addEventListener('click', () => openModal(person));
        featuredContainer.appendChild(featuredCard);
    });
    
    // Search functionality
    const searchButton = document.getElementById('search-button');
    const searchInput = document.getElementById('search-input');
    const genderFilter = document.getElementById('gender-filter');
    const ageFilter = document.getElementById('age-filter');
    const locationFilter = document.getElementById('location-filter');
    const resultsContainer = document.getElementById('results-container');
    const noResults = document.getElementById('no-results');
    
    searchButton.addEventListener('click', performSearch);
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') performSearch();
    });
    
    function performSearch() {
        const searchTerm = searchInput.value.toLowerCase();
        const gender = genderFilter.value;
        const ageRange = ageFilter.value;
        const location = locationFilter.value.toLowerCase();
        
        const filteredPersons = missingPersons.filter(person => {
            // Check search term against name and description
            const matchesSearch = searchTerm === '' || 
                person.name.toLowerCase().includes(searchTerm) || 
                person.description.toLowerCase().includes(searchTerm);
            
            // Check gender filter
            const matchesGender = gender === '' || person.gender === gender;
            
            // Check age filter
            let matchesAge = true;
            if (ageRange !== '') {
                const [min, max] = ageRange.split('-').map(Number);
                if (ageRange === '65+') {
                    matchesAge = person.age >= 65;
                } else {
                    matchesAge = person.age >= min && person.age <= max;
                }
            }
            
            // Check location filter
            const matchesLocation = location === '' || 
                person.lastSeen.toLowerCase().includes(location);
            
            return matchesSearch && matchesGender && matchesAge && matchesLocation;
        });
        
        displayResults(filteredPersons);
    }
    
    function displayResults(persons) {
        resultsContainer.innerHTML = '';
        
        if (persons.length === 0) {
            noResults.style.display = 'block';
            return;
        }
        
        noResults.style.display = 'none';
        
        persons.forEach(person => {
            const personCard = document.createElement('div');
            personCard.className = 'person-card';
            personCard.innerHTML = `
                <div class="person-img">
                    <img src="${person.image}" alt="${person.name}">
                </div>
                <div class="person-info">
                    <h3>${person.name}</h3>
                    <p>Last seen in ${person.lastSeen}</p>
                    <p>Missing since ${person.dateMissing}</p>
                    <div class="person-meta">
                        <span>${person.age} years</span>
                        <span>${person.gender}</span>
                    </div>
                </div>
            `;
            personCard.addEventListener('click', () => openModal(person));
            resultsContainer.appendChild(personCard);
        });
    }
    
    // Modal functionality
    const modal = document.getElementById('person-modal');
    const modalBody = document.getElementById('modal-body');
    const closeModal = document.querySelector('.close-modal');
    
    function openModal(person) {
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
                        <span>${person.status}</span>
                    </div>
                    <div class="modal-description">
                        <p>${person.description}</p>
                    </div>
                    <div class="modal-contact">
                        <h3>Contact Information</h3>
                        <p>If you have any information about ${person.name}, please contact:</p>
                        <p>${person.contact}</p>
                        <a href="#report">Report Sighting</a>
                    </div>
                </div>
            </div>
        `;
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }
    
    closeModal.addEventListener('click', () => {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    });
    
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });
    
    // Report form submission
    const reportForm = document.getElementById('sighting-form');
    
    reportForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const reporterName = document.getElementById('reporter-name').value;
        const reporterEmail = document.getElementById('reporter-email').value;
        const personName = document.getElementById('person-name').value;
        const sightingDetails = document.getElementById('sighting-details').value;
        const sightingPhoto = document.getElementById('sighting-photo').files[0];
        
        // In a real app, you would send this data to a server
        console.log('Report submitted:', {
            reporterName,
            reporterEmail,
            personName,
            sightingDetails,
            sightingPhoto: sightingPhoto ? sightingPhoto.name : 'No photo'
        });
        
        // Show success message
        alert('Thank you for your report. We will review the information and contact you if needed.');
        
        // Reset form
        this.reset();
    });
    
    // Initialize with all results
    displayResults(missingPersons);
});