document.addEventListener('DOMContentLoaded', function() {
    // ========== DOM Elements ==========
    // Mobile Menu
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    
    // Modals
    const artworkModal = document.getElementById('artwork-modal');
    const exhibitionModal = document.getElementById('exhibition-modal');
    const closeModal = document.querySelector('.close-modal');
    
    // Artwork Elements
    const artworkCards = document.querySelectorAll('.artwork-card');
    const artworksGrid = document.querySelector('.artworks-grid');
    
    // Exhibition Elements
    const exhibitionCards = document.querySelectorAll('.exhibition-card');
    const exhibitionsGrid = document.querySelector('.exhibitions-grid');
    
    // Filter Elements
    const categoryFilter = document.getElementById('category-filter');
    const sortFilter = document.getElementById('sort-filter');
    
    // Load More Button
    const loadMoreBtn = document.getElementById('load-more-btn');
    
    // Shopping Cart
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    const cartCount = document.querySelector('.cart-count');
    let cartItems = 0;


    // ========== Artwork Modal Functionality ==========
    artworkCards.forEach(card => {
        const viewButton = card.querySelector('.view-artwork');
        viewButton.addEventListener('click', function() {
            const title = card.querySelector('.artwork-title').textContent;
            const artist = card.querySelector('.artwork-artist').textContent;
            const price = card.querySelector('.artwork-price').textContent;
            const image = card.querySelector('.artwork-img img').src;
            const category = card.getAttribute('data-category') || 'Unknown';
            const description = card.getAttribute('data-description') || 'No description available';

            // Set modal content
            document.getElementById('artwork-title').textContent = title;
            document.getElementById('artist-name').textContent = artist;
            document.getElementById('artwork-category').textContent = category;
            document.getElementById('artwork-description').textContent = description;
            document.getElementById('artwork-price').textContent = price;
            document.getElementById('main-artwork-img').style.backgroundImage = `url('${image}')`;

            // Show modal
            artworkModal.style.display = 'block';
        });
    });

    // ========== Exhibition Modal Functionality ==========
    exhibitionCards.forEach(card => {
        const viewButton = card.querySelector('.view-exhibition');
        viewButton.addEventListener('click', function() {
            const title = card.querySelector('h3').textContent;
            const date = card.querySelector('.meta-item:nth-child(1) span').textContent;
            const location = card.querySelector('.meta-item:nth-child(2) span').textContent;
            const description = card.querySelector('p').textContent;
            const artists = Array.from(card.querySelectorAll('.artists-list span')).map(span => span.textContent);
            const image = card.querySelector('.exhibition-image').style.backgroundImage;

            // Set modal content
            document.getElementById('exhibition-title').textContent = title;
            document.getElementById('exhibition-date').textContent = date;
            document.getElementById('exhibition-location').textContent = location;
            document.getElementById('exhibition-description').textContent = description;
            document.getElementById('main-exhibition-img').style.backgroundImage = image;

            // Clear and add artists
            const artistsList = document.querySelector('.modal-info .artists-list');
            artistsList.innerHTML = '';
            artists.forEach(artist => {
                const artistElement = document.createElement('span');
                artistElement.textContent = artist;
                artistsList.appendChild(artistElement);
            });

            // Show modal
            exhibitionModal.style.display = 'block';
        });
    });

    // ========== Modal Close Functionality ==========
    if (closeModal) {
        closeModal.addEventListener('click', function() {
            artworkModal.style.display = 'none';
            exhibitionModal.style.display = 'none';
        });
    }

    // Close modals when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target === artworkModal) {
            artworkModal.style.display = 'none';
        }
        if (event.target === exhibitionModal) {
            exhibitionModal.style.display = 'none';
        }
    });

    // ========== Filter Functionality ==========
    if (categoryFilter && sortFilter) {
        if (artworksGrid) {
            categoryFilter.addEventListener('change', filterArtworks);
            sortFilter.addEventListener('change', filterArtworks);
        }
        if (exhibitionsGrid) {
            categoryFilter.addEventListener('change', filterExhibitions);
            sortFilter.addEventListener('change', filterExhibitions);
        }
    }

    function filterArtworks() {
        const category = categoryFilter.value;
        const sort = sortFilter.value;
        const cards = Array.from(artworksGrid.querySelectorAll('.artwork-card'));

        // Filter by category
        cards.forEach(card => {
            const cardCategory = card.getAttribute('data-category') || 'all';
            if (category === 'all' || cardCategory === category) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });

        // Sort artworks
        const visibleCards = cards.filter(card => card.style.display !== 'none');
        visibleCards.sort((a, b) => {
            const priceA = parseInt(a.querySelector('.artwork-price').textContent.replace(/[^0-9]/g, ''));
            const priceB = parseInt(b.querySelector('.artwork-price').textContent.replace(/[^0-9]/g, ''));

            if (sort === 'price-low') {
                return priceA - priceB;
            } else if (sort === 'price-high') {
                return priceB - priceA;
            }
            return 0;
        });

        // Reorder the grid
        visibleCards.forEach(card => {
            artworksGrid.appendChild(card);
        });
    }

    function filterExhibitions() {
        const category = categoryFilter.value;
        const sort = sortFilter.value;
        const cards = Array.from(exhibitionsGrid.querySelectorAll('.exhibition-card'));

        // Filter by category
        cards.forEach(card => {
            const cardCategory = card.getAttribute('data-category') || 'all';
            if (category === 'all' || cardCategory === category) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });

        // Sort exhibitions
        const visibleCards = cards.filter(card => card.style.display !== 'none');
        visibleCards.sort((a, b) => {
            const dateA = new Date(a.querySelector('.meta-item:nth-child(1) span').textContent.split(' - ')[0]);
            const dateB = new Date(b.querySelector('.meta-item:nth-child(1) span').textContent.split(' - ')[0]);

            if (sort === 'newest') {
                return dateB - dateA;
            } else if (sort === 'oldest') {
                return dateA - dateB;
            }
            return 0;
        });

        // Reorder the grid
        visibleCards.forEach(card => {
            exhibitionsGrid.appendChild(card);
        });
    }

    // ========== Load More Functionality ==========
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', function() {
            // In a real application, this would load more content from the server
            // For demo purposes, we'll just show an alert
            alert('Loading more content...');
        });
    }



    // ========== Tab Functionality ==========
    function setupTabs(tabButtonsClass, tabContentsClass) {
        const tabButtons = document.querySelectorAll(`.${tabButtonsClass}`);
        const tabContents = document.querySelectorAll(`.${tabContentsClass}`);
        
        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const tabId = button.getAttribute('data-tab');
                
                // Update buttons
                tabButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                
                // Update contents
                tabContents.forEach(content => content.classList.remove('active'));
                document.getElementById(tabId).classList.add('active');
            });
        });
    }
    
    // Initialize all tab systems
    setupTabs('tab-btn', 'tab-content'); // Exhibition tabs
    setupTabs('comm-tab-btn', 'comm-tab-content'); // Community tabs
    setupTabs('creator-tab-btn', 'creator-tab-content'); // Creator portal tabs

    let displayedArtworks = 6;
    const artworksPerLoad = 3;

    // Event Listeners for Gallery
    document.addEventListener('DOMContentLoaded', function() {
        const categoryFilter = document.getElementById('category-filter');
        const priceFilter = document.getElementById('price-filter');
        const sortFilter = document.getElementById('sort-filter');
        const loadMoreBtn = document.getElementById('load-more-btn');

        if (categoryFilter && priceFilter && sortFilter) {
            categoryFilter.addEventListener('change', filterArtworks);
            priceFilter.addEventListener('change', filterArtworks);
            sortFilter.addEventListener('change', filterArtworks);
        }

        if (loadMoreBtn) {
            loadMoreBtn.addEventListener('click', function() {
                // Redirect to gallery page
                window.location.href = 'pages/gallery.html';
            });
        }

        // Initialize gallery
        filterArtworks();
    });



    // ========== Community Interactions ==========
    document.addEventListener('click', function(e) {
            // ========== Form Submissions ==========
    // Login form
    const loginForm = document.getElementById('login-form');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const emailError = document.getElementById('email-error');
    const passwordError = document.getElementById('password-error');
    const togglePassword = document.querySelector('.toggle-password');

    // Toggle password visibility
    if (togglePassword) {
        togglePassword.addEventListener('click', function() {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            this.classList.toggle('fa-eye');
            this.classList.toggle('fa-eye-slash');
        });
    }

    // Form validation
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    function validatePassword(password) {
        return password.length >= 6;
    }

    // Handle form submission
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Reset error messages
            emailError.textContent = '';
            passwordError.textContent = '';
            
            const email = emailInput.value.trim();
            const password = passwordInput.value.trim();
            let isValid = true;

            // Validate email
            if (!email) {
                emailError.textContent = 'Email is required';
                isValid = false;
            } else if (!validateEmail(email)) {
                emailError.textContent = 'Please enter a valid email address';
                isValid = false;
            }

            // Validate password
            if (!password) {
                passwordError.textContent = 'Password is required';
                isValid = false;
            } else if (!validatePassword(password)) {
                passwordError.textContent = 'Password must be at least 6 characters long';
                isValid = false;
            }

            if (isValid) {
                // In a real application, you would send this data to your backend
                // For demo purposes, we'll simulate a successful login
                const userData = {
                    email: email,
                    remember: document.getElementById('remember').checked
                };

                // Store user data in localStorage if "Remember me" is checked
                if (userData.remember) {
                    localStorage.setItem('userData', JSON.stringify(userData));
                } else {
                    sessionStorage.setItem('userData', JSON.stringify(userData));
                }

                // Redirect to home page after successful login
                window.location.href = '../index.html';
            }
        });
    }

    // Check for stored user data
    const storedUserData = localStorage.getItem('userData') || sessionStorage.getItem('userData');
    if (storedUserData) {
        const userData = JSON.parse(storedUserData);
        emailInput.value = userData.email;
        if (userData.remember) {
            document.getElementById('remember').checked = true;
        }
    }
    
    // Signup form
    document.getElementById('signup-form')?.addEventListener('submit', function(e) {
        e.preventDefault();
        alert('Account created successfully!');
        closeAllModals();
    });
    
    // Newsletter form
    document.querySelector('.newsletter-form')?.addEventListener('submit', function(e) {
        e.preventDefault();
        const email = this.querySelector('input').value;
        alert(`Thank you for subscribing with ${email}!`);
        this.querySelector('input').value = '';
    });
    
    // Creator application form
    document.getElementById('creator-application-form')?.addEventListener('submit', function(e) {
        e.preventDefault();
        alert('Your application has been submitted for review!');
        closeAllModals();
    });

    // Render exhibitions
    function renderExhibitions() {
        Object.keys(exhibitions).forEach(type => {
            const container = document.getElementById(type);
            if (container) {
                container.innerHTML = '';
                
                exhibitions[type].forEach(exhibition => {
                    const exhibitionCard = document.createElement('div');
                    exhibitionCard.className = 'exhibition-card';
                    exhibitionCard.innerHTML = `
                        <div class="exhibition-img" style="background-image: url('${exhibition.image}')"></div>
                        <div class="exhibition-details">
                            <h3>${exhibition.title}</h3>
                            <div class="exhibition-meta">
                                <div><i class="fas fa-calendar-alt"></i> <span>${exhibition.date}</span></div>
                                <div><i class="fas fa-map-marker-alt"></i> <span>${exhibition.location}</span></div>
                            </div>
                            <div class="exhibition-description">
                                <p>${exhibition.description}</p>
                                <p>Featured artists: ${exhibition.artists.join(', ')}</p>
                            </div>
                            <a href="#" class="exhibition-btn view-exhibition">View Details</a>
                        </div>
                    `;
                    container.appendChild(exhibitionCard);
                });
            }
        });
    }

    // Community Functionality
    const communityPosts = [
        {
            id: 1,
            user: "Sarah Johnson",
            avatar: "images/artist1.jpg",
            time: "2 hours ago",
            text: "Just finished my latest piece 'Starry Night Reflections'. It's a tribute to Van Gogh's masterpiece with a modern twist. What do you think?",
            image: "images/artwork1.jpg",
            likes: 245,
            comments: 32,
            category: "artwork"
        },
        {
            id: 2,
            user: "Michael Chen",
            avatar: "images/artist2.jpg",
            time: "5 hours ago",
            text: "Looking for recommendations for art supplies in Mumbai. Any local stores you'd recommend?",
            image: null,
            likes: 78,
            comments: 45,
            category: "question"
        },
        {
            id: 3,
            user: "Emma Rodriguez",
            avatar: "images/artist3.jpg",
            time: "1 day ago",
            text: "Excited to announce my upcoming exhibition 'Eternal Flow' at the Downtown Gallery next month!",
            image: "images/artwork3.jpg",
            likes: 512,
            comments: 89,
            category: "event"
        }
    ];

    const featuredArtists = [
        {
            id: 1,
            name: "Sarah Johnson",
            avatar: "images/artist1.jpg",
            followers: "12.5k",
            artworks: 45,
            category: "Painting"
        },
        {
            id: 2,
            name: "Michael Chen",
            avatar: "images/artist2.jpg",
            followers: "8.2k",
            artworks: 32,
            category: "Photography"
        },
        {
            id: 3,
            name: "Emma Rodriguez",
            avatar: "images/artist3.jpg",
            followers: "15.7k",
            artworks: 67,
            category: "Sculpture"
        }
    ];

    const discussions = [
        {
            id: 1,
            title: "Best practices for preserving digital art",
            author: "Alex Turner",
            replies: 24,
            views: 156,
            lastActivity: "3 hours ago"
        },
        {
            id: 2,
            title: "How to price your artwork as a beginner",
            author: "Sarah Johnson",
            replies: 42,
            views: 289,
            lastActivity: "1 day ago"
        },
        {
            id: 3,
            title: "Art competitions and exhibitions in India",
            author: "Michael Chen",
            replies: 18,
            views: 123,
            lastActivity: "2 days ago"
        }
    ];

    const events = [
        {
            id: 1,
            title: "Digital Art Workshop",
            date: "June 15, 2023",
            location: "Online",
            image: "images/event1.jpg",
            attendees: 45
        },
        {
            id: 2,
            title: "Art Gallery Opening",
            date: "June 20, 2023",
            location: "Downtown Gallery, Mumbai",
            image: "images/event2.jpg",
            attendees: 120
        },
        {
            id: 3,
            title: "Artist Meetup",
            date: "June 25, 2023",
            location: "Art Cafe, Delhi",
            image: "images/event3.jpg",
            attendees: 30
        }
    ];

    function renderTrendingPosts() {
        const trendingContainer = document.getElementById('trending');
        if (!trendingContainer) return;

        trendingContainer.innerHTML = '';
        communityPosts.forEach(post => {
            const postElement = document.createElement('div');
            postElement.className = 'community-post';
            postElement.innerHTML = `
                <div class="post-header">
                    <img src="${post.avatar}" alt="${post.user}">
                    <div>
                        <h3>${post.user}</h3>
                        <span>${post.time}</span>
                    </div>
                    <button class="follow-btn">Follow</button>
                </div>
                <div class="post-content">
                    <p>${post.text}</p>
                    ${post.image ? `<div class="post-image"><img src="${post.image}" alt="Post image"></div>` : ''}
                </div>
                <div class="post-actions">
                    <button class="like-btn"><i class="far fa-heart"></i> ${post.likes}</button>
                    <button class="comment-btn"><i class="far fa-comment"></i> ${post.comments}</button>
                    <button class="share-btn"><i class="fas fa-share"></i> Share</button>
                </div>
            `;
            trendingContainer.appendChild(postElement);
        });
    }

    function renderFeaturedArtists() {
        const artistsContainer = document.querySelector('.artists-grid');
        if (!artistsContainer) return;

        artistsContainer.innerHTML = '';
        featuredArtists.forEach(artist => {
            const artistCard = document.createElement('div');
            artistCard.className = 'artist-card';
            artistCard.innerHTML = `
                <img src="${artist.avatar}" alt="${artist.name}">
                <h3>${artist.name}</h3>
                <span class="artist-category">${artist.category}</span>
                <div class="artist-stats">
                    <div class="stat">
                        <span class="stat-number">${artist.followers}</span>
                        <span class="stat-label">Followers</span>
                    </div>
                    <div class="stat">
                        <span class="stat-number">${artist.artworks}</span>
                        <span class="stat-label">Artworks</span>
                    </div>
                </div>
                <button class="follow-btn">Follow</button>
            `;
            artistsContainer.appendChild(artistCard);
        });
    }

    function renderDiscussions() {
        const discussionsContainer = document.querySelector('.discussions-list');
        if (!discussionsContainer) return;

        discussionsContainer.innerHTML = '';
        discussions.forEach(discussion => {
            const discussionItem = document.createElement('div');
            discussionItem.className = 'discussion-item';
            discussionItem.innerHTML = `
                <div class="discussion-content">
                    <h3>${discussion.title}</h3>
                    <span class="author">by ${discussion.author}</span>
                </div>
                <div class="discussion-stats">
                    <div class="stat">
                        <i class="far fa-comment"></i>
                        <span>${discussion.replies}</span>
                    </div>
                    <div class="stat">
                        <i class="far fa-eye"></i>
                        <span>${discussion.views}</span>
                    </div>
                    <span class="last-activity">${discussion.lastActivity}</span>
                </div>
            `;
            discussionsContainer.appendChild(discussionItem);
        });
    }

    function renderEvents() {
        const eventsContainer = document.querySelector('.events-grid');
        if (!eventsContainer) return;

        eventsContainer.innerHTML = '';
        events.forEach(event => {
            const eventCard = document.createElement('div');
            eventCard.className = 'event-card';
            eventCard.innerHTML = `
                <div class="event-image" style="background-image: url('${event.image}')"></div>
                <div class="event-info">
                    <h3>${event.title}</h3>
                    <div class="event-meta">
                        <div class="meta-item">
                            <i class="far fa-calendar"></i>
                            <span>${event.date}</span>
                        </div>
                        <div class="meta-item">
                            <i class="fas fa-map-marker-alt"></i>
                            <span>${event.location}</span>
                        </div>
                        <div class="meta-item">
                            <i class="fas fa-users"></i>
                            <span>${event.attendees} attending</span>
                        </div>
                    </div>
                    <button class="btn-primary">RSVP</button>
                </div>
            `;
            eventsContainer.appendChild(eventCard);
        });
    }

    // Event Listeners for Community
    document.addEventListener('DOMContentLoaded', function() {
        // Tab functionality
        const tabButtons = document.querySelectorAll('.tab-btn');
        const tabContents = document.querySelectorAll('.tab-content');

        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const tabId = button.getAttribute('data-tab');
                
                // Update active tab
                tabButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                
                // Show corresponding content
                tabContents.forEach(content => {
                    content.classList.remove('active');
                    if (content.id === tabId) {
                        content.classList.add('active');
                    }
                });

                // Render content based on active tab
                switch(tabId) {
                    case 'trending':
                        renderTrendingPosts();
                        break;
                    case 'artists':
                        renderFeaturedArtists();
                        break;
                    case 'discussions':
                        renderDiscussions();
                        break;
                    case 'events':
                        renderEvents();
                        break;
                }
            });
        });

        // Initialize with trending posts
        renderTrendingPosts();

        // Create post modal
        const createPostBtn = document.querySelector('.create-post-btn');
        const createPostModal = document.getElementById('create-post-modal');
        const createPostForm = document.getElementById('create-post-form');

        if (createPostBtn && createPostModal) {
            createPostBtn.addEventListener('click', () => {
                createPostModal.style.display = 'block';
            });

            createPostForm.addEventListener('submit', (e) => {
                e.preventDefault();
                // Handle post creation
                createPostModal.style.display = 'none';
            });
        }

        // Post interaction handlers
        document.addEventListener('click', function(e) {
            if (e.target.classList.contains('like-btn')) {
                e.target.querySelector('i').classList.toggle('far');
                e.target.querySelector('i').classList.toggle('fas');
            }
        });
    });

    // Initialize page content based on current page
    const currentPage = window.location.pathname.split('/').pop();
    
    switch(currentPage) {
        case 'gallery.html':
            // Initialize gallery
            filterArtworks();
            break;
            
        case 'exhibitions.html':
            // Initialize exhibitions
            renderExhibitions();
            break;
            
        case 'community.html':
            // Initialize community
            renderCommunityContent();
            break;
            
        default:
            // Initialize home page content
            if (window.location.pathname.endsWith('index.html') || window.location.pathname.endsWith('/')) {
                filterArtworks();
                renderExhibitions();
                renderCommunityContent();
            }
        }
    });
});