document.addEventListener('DOMContentLoaded', () => {
    // Constants and Configuration
    const CONFIG = {
        API_ENDPOINT: '/api/missing-persons',
        FALLBACK_IMAGE: 'https://via.placeholder.com/150?text=Image+Not+Available',
        DEBOUNCE_DELAY: 300,
        DATE_FORMAT: { year: 'numeric', month: 'long', day: 'numeric' },
        MAX_RESULTS_PER_PAGE: 10,
        VALIDATION_RULES: {
            reporterName: { required: true, maxLength: 100 },
            sightingDetails: { required: true, maxLength: 1000 },
            reporterEmail: { required: false, maxLength: 100, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ }
        }
    };

    // Sample data (to be replaced with API in production)
    const initialData = [
        {
            id: 1,
            name: "Sarah Johnson",
            age: 24,
            gender: "female",
            lastSeen: "Chicago, IL",
            dateMissing: "2023-05-15",
            description: "Last seen leaving her Lincoln Park apartment at 8:30 PM, wearing a blue Columbia jacket, black jeans, and white sneakers. Has a heart-shaped tattoo on left wrist. No signs of distress reported. Missed work the next day; no leads.",
            image: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80",
            contact: "Chicago PD: (312) 555-1234 | Family: (312) 555-5678",
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
            dateMissing: "2023-06-22",
            description: "Last seen at Washington High School at 3:15 PM, wearing a gray hoodie with school logo, black jeans, and black Vans. Phone last pinged near Golden Gate Park; now off. No history of running away. Case deemed suspicious.",
            image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80",
            contact: "SFPD: (415) 555-2345 | Tip Line: (415) 555-7890",
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
            dateMissing: "2023-04-10",
            description: "Clocked out from Ocean Drive café at 5 PM; never reached home. Car found near Lummus Park with purse and phone. Wore white blouse, denim shorts; has rose tattoo on wrist. Unusual bank activity next day.",
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
            dateMissing: "2023-03-05",
            description: "Vanished hiking in Rocky Mountain National Park from Bear Lake trailhead at 9 AM. Wore red Osprey backpack, hiking boots, green rain jacket. Equipment found; weather may be factor. Has scar above right eyebrow.",
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
            dateMissing: "2023-07-18",
            description: "Vanished from park during family barbecue, wearing pink sundress, carrying stuffed bunny 'Snowball.' Has braided brown hair, gap in front teeth. Suspicious vehicle reported. FBI offers $25,000 reward.",
            image: "https://images.unsplash.com/photo-1551650975-87deedd944c3?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80",
            contact: "Phoenix PD: (602) 555-5678 | FBI: 1-800-CALL-FBI",
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
            dateMissing: "2023-02-28",
            description: "Has Alzheimer's; wandered from Brighton home. Seen on Commonwealth Avenue store camera. Wore brown leather jacket, blue jeans, black loafers. May be confused, unable to recall identity. No sightings despite searches.",
            image: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80",
            contact: "Boston PD: (617) 555-6789 | Silver Alert: (888) 555-7890",
            featured: false,
            status: "Active",
            caseNumber: "MP-2023-0678"
        }
    ];

    // DOM Elements
    const DOM = {
        hamburger: document.querySelector('.hamburger'),
        navLinks: document.querySelector('.nav-links'),
        searchInput: document.getElementById('search-input'),
        searchButton: document.getElementById('search-button'),
        genderFilter: document.getElementById('gender-filter'),
        ageFilter: document.getElementById('age-filter'),
        locationFilter: document.getElementById('location-filter'),
        sortBy: document.getElementById('sort-by'),
        resultsContainer: document.getElementById('results-container'),
        featuredContainer: document.getElementById('featured-container'),
        reportForm: document.getElementById('sighting-form'),
        fileUpload: document.getElementById('sighting-photo'),
        fileName: document.getElementById('file-name'),
        modal: document.getElementById('person-modal'),
        modalBody: document.getElementById('modal-body'),
        closeModal: document.querySelector('.close-modal'),
        pagination: document.getElementById('pagination-container')
    };

    // Application State
    class AppState {
        constructor() {
            this.persons = [];
            this.filteredPersons = [];
            this.featuredPersons = [];
            this.currentPerson = null;
            this.searchTerm = '';
            this.filters = { gender: '', ageRange: '', location: '' };
            this.sortBy = 'recent';
            this.currentPage = 1;
            this.isLoading = false;
            this.error = null;
        }
    }

    const state = new AppState();

    // Utility Functions
    const utils = {
        debounce(fn, delay) {
            let timeout;
            return (...args) => {
                clearTimeout(timeout);
                timeout = setTimeout(() => fn(...args), delay);
            };
        },
        sanitizeInput(input) {
            const div = document.createElement('div');
            div.textContent = input;
            return div.innerHTML;
        },
        formatDate(dateStr) {
            return new Date(dateStr).toLocaleDateString('en-US', CONFIG.DATE_FORMAT);
        },
        validateField(value, rules) {
            if (rules.required && !value.trim()) return 'This field is required';
            if (rules.maxLength && value.length > rules.maxLength) return `Maximum ${rules.maxLength} characters`;
            if (rules.pattern && value && !rules.pattern.test(value)) return 'Invalid format';
            return null;
        },
        getPaginatedItems(items, page) {
            const start = (page - 1) * CONFIG.MAX_RESULTS_PER_PAGE;
            return items.slice(start, start + CONFIG.MAX_RESULTS_PER_PAGE);
        }
    };

    // Data Service
    const dataService = {
        async fetchPersons() {
            state.isLoading = true;
            try {
                // Simulate API call with local data
                // In production, replace with: await fetch(CONFIG.API_ENDPOINT);
                await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
                state.persons = initialData;
                state.filteredPersons = [...initialData];
                state.featuredPersons = initialData.filter(p => p.featured);
                state.error = null;
            } catch (error) {
                state.error = 'Failed to load data. Please try again.';
                console.error('Fetch error:', error);
            } finally {
                state.isLoading = false;
            }
        },
        async submitReport(formData) {
            try {
                // Simulate API call
                // In production: await fetch('/api/report-sighting', { method: 'POST', body: formData });
                await new Promise(resolve => setTimeout(resolve, 500));
                console.log('Report submitted:', Object.fromEntries(formData));
                return { success: true };
            } catch (error) {
                console.error('Submission error:', error);
                return { success: false, error: 'Failed to submit report' };
            }
        }
    };

    // Initialize App
    async function init() {
        await dataService.fetchPersons();
        renderFeaturedCases();
        renderResults();
        setupEventListeners();
        setupAccessibility();
    }

    // Set up Accessibility
    function setupAccessibility() {
        DOM.closeModal.setAttribute('aria-label', 'Close modal');
        DOM.modal.setAttribute('role', 'dialog');
        DOM.modal.setAttribute('aria-modal', 'true');
        DOM.searchButton.setAttribute('aria-label', 'Search missing persons');
        DOM.hamburger.setAttribute('aria-label', 'Toggle navigation menu');
        DOM.hamburger.setAttribute('aria-expanded', 'false');
    }

    // Set up Event Listeners
    function setupEventListeners() {
        DOM.hamburger.addEventListener('click', toggleMobileMenu);
        
        // Search
        DOM.searchButton.addEventListener('click', performSearch);
        DOM.searchInput.addEventListener('input', utils.debounce(performSearch, CONFIG.DEBOUNCE_DELAY));
        DOM.searchInput.addEventListener('keypress', e => e.key === 'Enter' && performSearch());

        // Filters
        DOM.genderFilter.addEventListener('change', e => {
            state.filters.gender = e.target.value;
            state.currentPage = 1;
            filterPersons();
        });
        DOM.ageFilter.addEventListener('change', e => {
            state.filters.ageRange = e.target.value;
            state.currentPage = 1;
            filterPersons();
        });
        DOM.locationFilter.addEventListener('input', utils.debounce(e => {
            state.filters.location = e.target.value;
            state.currentPage = 1;
            filterPersons();
        }, CONFIG.DEBOUNCE_DELAY));

        // Sort
        DOM.sortBy.addEventListener('change', e => {
            state.sortBy = e.target.value;
            sortPersons();
            renderResults();
        });

        // File Upload
        DOM.fileUpload.addEventListener('change', function() {
            DOM.fileName.textContent = this.files.length > 0 ? this.files[0].name : 'No file selected';
        });

        // Form Submission
        DOM.reportForm.addEventListener('submit', async e => {
            e.preventDefault();
            if (await validateReportForm()) await submitReport();
        });

        // Modal
        DOM.closeModal.addEventListener('click', closePersonModal);
        window.addEventListener('click', e => e.target === DOM.modal && closePersonModal());
        window.addEventListener('keydown', e => {
            if (e.key === 'Escape' && DOM.modal.style.display === 'block') closePersonModal();
        });

        // Pagination
        DOM.pagination?.addEventListener('click', e => {
            if (e.target.classList.contains('page-btn')) {
                state.currentPage = parseInt(e.target.dataset.page);
                renderResults();
            }
        });
    }

    // Toggle Mobile Menu
    function toggleMobileMenu() {
        DOM.hamburger.classList.toggle('active');
        DOM.navLinks.classList.toggle('active');
        DOM.hamburger.setAttribute('aria-expanded', DOM.hamburger.classList.contains('active'));
    }

    // Perform Search
    function performSearch() {
        state.searchTerm = utils.sanitizeInput(DOM.searchInput.value.trim().toLowerCase());
        state.currentPage = 1;
        filterPersons();
    }

    // Filter Persons
    function filterPersons() {
        const { searchTerm, filters, persons } = state;
        
        state.filteredPersons = persons.filter(person => {
            const matchesSearch = !searchTerm ||
                person.name.toLowerCase().includes(searchTerm) ||
                person.description.toLowerCase().includes(searchTerm);
            
            const matchesGender = !filters.gender || person.gender === filters.gender;
            
            let matchesAge = true;
            if (filters.ageRange) {
                const [min, max] = filters.ageRange.split('-').map(Number);
                matchesAge = filters.ageRange === '65+' ? person.age >= 65 : person.age >= min && person.age <= max;
            }
            
            const matchesLocation = !filters.location ||
                person.lastSeen.toLowerCase().includes(filters.location.toLowerCase());
            
            return matchesSearch && matchesGender && matchesAge && matchesLocation;
        });

        sortPersons();
        renderResults();
    }

    // Sort Persons
    function sortPersons() {
        const { sortBy, filteredPersons } = state;
        
        const sortFunctions = {
            recent: (a, b) => new Date(b.dateMissing) - new Date(a.dateMissing),
            oldest: (a, b) => new Date(a.dateMissing) - new Date(b.dateMissing),
            age: (a, b) => a.age - b.age,
            location: (a, b) => a.lastSeen.localeCompare(b.lastSeen)
        };

        filteredPersons.sort(sortFunctions[sortBy] || (() => 0));
    }

    // Render Featured Cases
    function renderFeaturedCases() {
        DOM.featuredContainer.innerHTML = state.isLoading 
            ? '<div class="loading">Loading featured cases...</div>'
            : '';
        
        if (state.error) {
            DOM.featuredContainer.innerHTML = `<div class="error">${state.error}</div>`;
            return;
        }

        state.featuredPersons.forEach(person => {
            const card = document.createElement('div');
            card.className = 'featured-card';
            card.tabIndex = 0;
            card.innerHTML = `
                <div class="featured-img">
                    <img src="${person.image}" alt="${utils.sanitizeInput(person.name)}" loading="lazy">
                </div>
                <div class="featured-content">
                    <h3>${utils.sanitizeInput(person.name)}</h3>
                    <p>Last seen in ${utils.sanitizeInput(person.lastSeen)} on ${utils.formatDate(person.dateMissing)}</p>
                    <span class="featured-status">${person.status}</span>
                </div>
            `;
            card.addEventListener('click', () => openPersonModal(person));
            card.addEventListener('keypress', e => e.key === 'Enter' && openPersonModal(person));
            card.querySelector('img').onerror = () => {
                card.querySelector('img').src = CONFIG.FALLBACK_IMAGE;
                card.querySelector('img').alt = 'Image not available';
            };
            DOM.featuredContainer.appendChild(card);
        });
    }

    // Render Search Results
    function renderResults() {
        DOM.resultsContainer.innerHTML = state.isLoading 
            ? '<div class="loading">Loading results...</div>'
            : '';
        
        if (state.error) {
            DOM.resultsContainer.innerHTML = `<div class="error">${state.error}</div>`;
            return;
        }

        const paginatedPersons = utils.getPaginatedItems(state.filteredPersons, state.currentPage);
        
        if (!paginatedPersons.length) {
            DOM.resultsContainer.innerHTML = `
                <div class="no-results">
                    <i class="fas fa-user-slash" aria-hidden="true"></i>
                    <p>No matching results found. Try different search criteria.</p>
                </div>
            `;
            return;
        }
        
        paginatedPersons.forEach(person => {
            const card = document.createElement('div');
            card.className = 'person-card';
            card.tabIndex = 0;
            card.innerHTML = `
                <div class="person-img">
                    <img src="${person.image}" alt="${utils.sanitizeInput(person.name)}" loading="lazy">
                    <span class="person-status">${person.status}</span>
                </div>
                <div class="person-info">
                    <h3>${utils.sanitizeInput(person.name)}</h3>
                    <div class="person-location">
                        <i class="fas fa-map-marker-alt" aria-hidden="true"></i>
                        <span>${utils.sanitizeInput(person.lastSeen)}</span>
                    </div>
                    <p class="person-date">Missing since ${utils.formatDate(person.dateMissing)}</p>
                    <div class="person-meta">
                        <span>${person.age} years</span>
                        <span>${utils.sanitizeInput(person.gender)}</span>
                    </div>
                </div>
            `;
            card.addEventListener('click', () => openPersonModal(person));
            card.addEventListener('keypress', e => e.key === 'Enter' && openPersonModal(person));
            card.querySelector('img').onerror = () => {
                card.querySelector('img').src = CONFIG.FALLBACK_IMAGE;
                card.querySelector('img').alt = 'Image not available';
            };
            DOM.resultsContainer.appendChild(card);
        });

        renderPagination();
    }

    // Render Pagination
    function renderPagination() {
        if (!DOM.pagination) return;
        
        const totalPages = Math.ceil(state.filteredPersons.length / CONFIG.MAX_RESULTS_PER_PAGE);
        DOM.pagination.innerHTML = '';
        
        if (totalPages <= 1) return;
        
        for (let i = 1; i <= totalPages; i++) {
            const button = document.createElement('button');
            button.className = `page-btn ${i === state.currentPage ? 'active' : ''}`;
            button.dataset.page = i;
            button.textContent = i;
            button.setAttribute('aria-label', `Page ${i}`);
            DOM.pagination.appendChild(button);
        }
    }

    // Open Person Modal
    function openPersonModal(person) {
        state.currentPerson = person;
        DOM.modalBody.innerHTML = `
            <div class="modal-person">
                <div class="modal-img">
                    <img src="${person.image}" alt="${utils.sanitizeInput(person.name)}" loading="lazy">
                </div>
                <div class="modal-info">
                    <h2>${utils.sanitizeInput(person.name)}</h2>
                    <p>Last seen in ${utils.sanitizeInput(person.lastSeen)} on ${utils.formatDate(person.dateMissing)}</p>
                    <div class="modal-meta">
                        <span>${person.age} years old</span>
                        <span>${utils.sanitizeInput(person.gender)}</span>
                        <span>Case #${utils.sanitizeInput(person.caseNumber)}</span>
                    </div>
                    <div class="modal-description">
                        <p>${utils.sanitizeInput(person.description)}</p>
                    </div>
                    <div class="modal-contact">
                        <h3>Contact Information</h3>
                        <p>If you have any information about ${utils.sanitizeInput(person.name)}, please contact:</p>
                        <p>${utils.sanitizeInput(person.contact)}</p>
                        <a href="#report" aria-label="Report a sighting of ${utils.sanitizeInput(person.name)}"><i class="fas fa-flag" aria-hidden="true"></i> Report Sighting</a>
                    </div>
                </div>
            </div>
        `;
        DOM.modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
        DOM.modalBody.focus();
        DOM.modalBody.querySelector('img').onerror = () => {
            DOM.modalBody.querySelector('img').src = CONFIG.FALLBACK_IMAGE;
            DOM.modalBody.querySelector('img').alt = 'Image not available';
        };
    }

    // Close Person Modal
    function closePersonModal() {
        DOM.modal.style.display = 'none';
        document.body.style.overflow = 'auto';
        DOM.searchInput.focus();
    }

    // Validate Report Form
    async function validateReportForm() {
        const fields = {
            reporterName: DOM.reportForm.querySelector('#reporter-name').value.trim(),
            reporterEmail: DOM.reportForm.querySelector('#reporter-email').value.trim(),
            sightingDetails: DOM.reportForm.querySelector('#sighting-details').value.trim()
        };

        let isValid = true;
        const errors = {};

        Object.entries(CONFIG.VALIDATION_RULES).forEach(([field, rules]) => {
            const error = utils.validateField(fields[field], rules);
            if (error) {
                errors[field] = error;
                isValid = false;
            }
        });

        if (!isValid) {
            alert(Object.values(errors).join('\n'));
        }

        return isValid;
    }

    // Submit Report Form
    async function submitReport() {
        const formData = new FormData(DOM.reportForm);
        formData.append('timestamp', new Date().toISOString());
        
        const result = await dataService.submitReport(formData);
        
        if (result.success) {
            alert('Thank you for your report. We will review it and contact you if needed.');
            DOM.reportForm.reset();
            DOM.fileName.textContent = 'No file selected';
        } else {
            alert(result.error || 'Error submitting report. Please try again.');
        }
    }

    // Initialize App
    init();
});
