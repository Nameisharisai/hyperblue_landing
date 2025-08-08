// Three.js Implementations and Advanced Animations
document.addEventListener('DOMContentLoaded', function() {
    // Mobile navigation toggle
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');

    navToggle.addEventListener('click', function() {
        navMenu.classList.toggle('active');
    });

    // Close mobile menu when clicking on a link
    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
        });
    });

    // Navbar background on scroll
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            navbar.style.background = 'rgba(0, 0, 0, 0.5)';
            navbar.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.2)';
        } else {
            navbar.style.background = 'rgba(0, 0, 0, 0.1)';
            navbar.style.boxShadow = 'none';
        }
    });

    // Initialize 3D Hero Scene
    initHeroScene();
    
    // Initialize Earth Globe
    initEarthGlobe();
    
    // Initialize Engine Model
    initKronosEngine();
    
    // Initialize Rocket Model
    initNebula1Rocket();
    
    // Initialize Satellite Network
    initHyperclusterConstellation();

    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
            }
        });
    }, observerOptions);

    // Observe sections for scroll animations
    document.querySelectorAll('.section').forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(50px)';
        section.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        observer.observe(section);
    });

    // Add animated class
    document.addEventListener('scroll', function() {
        document.querySelectorAll('.section').forEach(section => {
            if (isElementInViewport(section)) {
                section.classList.add('animated');
            }
        });
    });

    // Form handling
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const name = formData.get('name');
            const email = formData.get('email');
            const message = formData.get('message');

            // Simple validation
            if (!name || !email || !message) {
                showNotification('Please fill in all fields', 'error');
                return;
            }

            if (!isValidEmail(email)) {
                showNotification('Please enter a valid email address', 'error');
                return;
            }

            // Simulate form submission
            showNotification('Message sent successfully! We\'ll get back to you soon.', 'success');
            this.reset();
        });
    }

    // CTA button actions
    document.querySelectorAll('.hero-buttons .btn').forEach(btn => {
        btn.addEventListener('click', function() {
            if (this.textContent.includes('Explore R&D')) {
                document.querySelector('#rd').scrollIntoView({ behavior: 'smooth' });
            } else if (this.textContent.includes('Our Vision')) {
                document.querySelector('#mission').scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
});

    // Create dynamic star field
    createStarField();

    // Enhanced particle system
    createParticleSystem();

    // Initialize heat map animation
    initializeHeatMap();

    // Initialize satellite mesh animation
    initializeSatelliteMesh();
});

// Email validation function
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;

    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? 'rgba(0, 200, 0, 0.9)' : 'rgba(200, 0, 0, 0.9)'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        backdrop-filter: blur(10px);
        z-index: 10000;
        transform: translateX(400px);
        transition: transform 0.3s ease;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
    `;

    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 10);

    // Add close functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        closeNotification(notification);
    });

    // Auto close after 5 seconds
    setTimeout(() => {
        closeNotification(notification);
    }, 5000);
}

// Initialize Hero Scene with Three.js
function initHeroScene() {
    const canvas = document.getElementById('hero-canvas');
    if (!canvas) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    
    const renderer = new THREE.WebGLRenderer({ 
        canvas: canvas,
        antialias: true,
        alpha: true 
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    
    // Add stars
    const starsGeometry = new THREE.BufferGeometry();
    const starsMaterial = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 0.5,
        transparent: true
    });
    
    const starsVertices = [];
    for (let i = 0; i < 15000; i++) {
        const x = (Math.random() - 0.5) * 2000;
        const y = (Math.random() - 0.5) * 2000;
        const z = (Math.random() - 0.5) * 2000;
        starsVertices.push(x, y, z);
    }
    
    starsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starsVertices, 3));
    const stars = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(stars);
    
    // Add nebula
    const nebulaTexture = new THREE.TextureLoader().load('https://images.pexels.com/photos/1169754/pexels-photo-1169754.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1');
    const nebulaGeometry = new THREE.SphereGeometry(800, 32, 32);
    const nebulaMaterial = new THREE.MeshBasicMaterial({
        map: nebulaTexture,
        side: THREE.BackSide,
        transparent: true,
        opacity: 0.3
    });
    const nebula = new THREE.Mesh(nebulaGeometry, nebulaMaterial);
    scene.add(nebula);
    
    // Add distant planet
    const planetGeometry = new THREE.SphereGeometry(20, 32, 32);
    const planetMaterial = new THREE.MeshBasicMaterial({
        color: 0x4a9eff,
        transparent: true,
        opacity: 0.8
    });
    const planet = new THREE.Mesh(planetGeometry, planetMaterial);
    planet.position.set(-100, 50, -300);
    scene.add(planet);
    
    // Add Saturn-like ring
    const ringGeometry = new THREE.RingGeometry(25, 35, 64);
    const ringMaterial = new THREE.MeshBasicMaterial({
        color: 0xc0c0c0,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.6
    });
    const ring = new THREE.Mesh(ringGeometry, ringMaterial);
    ring.position.copy(planet.position);
    ring.rotation.x = Math.PI / 2;
    scene.add(ring);
    
    // Position camera
    camera.position.z = 5;
    
    // Handle window resize
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
    
    // Animation loop
    function animate() {
        requestAnimationFrame(animate);
        
        stars.rotation.y += 0.0001;
        stars.rotation.z += 0.0001;
        
        nebula.rotation.y += 0.0002;
        
        planet.rotation.y += 0.005;
        ring.rotation.z += 0.002;
        
        renderer.render(scene, camera);
    }
    
    animate();
    
    // Parallax effect on mouse move
    document.addEventListener('mousemove', (e) => {
        const mouseX = (e.clientX / window.innerWidth) * 2 - 1;
        const mouseY = (e.clientY / window.innerHeight) * 2 - 1;
        
        stars.rotation.x += mouseY * 0.0001;
        stars.rotation.y += mouseX * 0.0001;
    });
}

// Check if element is in viewport
function isElementInViewport(el) {
    const rect = el.getBoundingClientRect();
    
    return (
        rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 0.8 &&
        rect.bottom >= 0
    );
}

// Close notification
function closeNotification(notification) {
    notification.style.transform = 'translateX(400px)';
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 300);
}

// Initialize everything
document.addEventListener('DOMContentLoaded', function() {
    // Initialize navigation interactions
    initNav();
    
    // Initialize scroll animations
    window.addEventListener('scroll', animateSectionsOnScroll);
    animateSectionsOnScroll(); // Run once to check initial viewport
    
    // Initialize Three.js scenes
    initHeroScene();
    
    // Add parallax effect to section backgrounds
    initParallaxEffect();
});

// Scroll-based animation for sections
function animateSectionsOnScroll() {
    const sections = document.querySelectorAll('section');
    
    sections.forEach(section => {
        if (isElementInViewport(section) && !section.classList.contains('visible')) {
            section.classList.add('visible');
            
            // Initialize 3D scenes when sections come into view
            if (section.id === 'mission') {
                initEarthScene();
            } else if (section.id === 'kronos-engine') {
                initEngineScene();
            } else if (section.id === 'nebula-1') {
                initRocketScene();
            } else if (section.id === 'hypercluster') {
                initSatelliteScene();
            }
        }
    });
}

// Initialize navigation
function initNav() {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('open');
            hamburger.classList.toggle('active');
        });
    }
}

// Initialize parallax effect for section backgrounds
function initParallaxEffect() {
    const sections = document.querySelectorAll('section');
    
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        
        sections.forEach(section => {
            const backgroundImage = section.querySelector('.section-bg');
            if (backgroundImage) {
                const speed = 0.3;
                backgroundImage.style.transform = `translateY(${scrollY * speed}px)`;
            }
        });
    });
    
    // Parallax on mouse move for hero section
    const heroSection = document.querySelector('#hero');
    if (heroSection) {
        const heroContent = heroSection.querySelector('.hero-content');
        
        document.addEventListener('mousemove', (e) => {
            const mouseX = (e.clientX / window.innerWidth) * 2 - 1;
            const mouseY = (e.clientY / window.innerHeight) * 2 - 1;
            
            if (heroContent) {
                heroContent.style.transform = `translate(${mouseX * -20}px, ${mouseY * -20}px)`;
            }
        });
    }
}

// Initialize Rocket Scene with Three.js
function initRocketScene() {
    const canvas = document.getElementById('rocket-canvas');
    if (!canvas) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
    
    const renderer = new THREE.WebGLRenderer({ 
        canvas: canvas,
        antialias: true,
        alpha: true 
    });
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    
    // Add lights
    const ambientLight = new THREE.AmbientLight(0x404040);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 3, 5);
    scene.add(directionalLight);
    
    // Create rocket components
    const rocketGroup = new THREE.Group();
    scene.add(rocketGroup);
    
    // Rocket body
    const bodyGeometry = new THREE.CylinderGeometry(1, 1, 8, 32);
    const bodyMaterial = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        metalness: 0.3,
        roughness: 0.4
    });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    rocketGroup.add(body);
    
    // Rocket nose cone
    const noseGeometry = new THREE.ConeGeometry(1, 2, 32);
    const noseMaterial = new THREE.MeshStandardMaterial({
        color: 0xdd3333,
        metalness: 0.2,
        roughness: 0.4
    });
    const nose = new THREE.Mesh(noseGeometry, noseMaterial);
    nose.position.y = 5;
    rocketGroup.add(nose);
    
    // Rocket fins
    const finGeometry = new THREE.BoxGeometry(0.2, 2, 1.5);
    const finMaterial = new THREE.MeshStandardMaterial({
        color: 0x3333dd,
        metalness: 0.3,
        roughness: 0.4
    });
    
    for (let i = 0; i < 4; i++) {
        const fin = new THREE.Mesh(finGeometry, finMaterial);
        fin.position.y = -3;
        fin.position.x = Math.cos(i * Math.PI / 2) * 1.2;
        fin.position.z = Math.sin(i * Math.PI / 2) * 1.2;
        fin.rotation.y = i * Math.PI / 2;
        rocketGroup.add(fin);
    }
    
    // Rocket engines
    const engineGeometry = new THREE.CylinderGeometry(0.3, 0.5, 1, 16);
    const engineMaterial = new THREE.MeshStandardMaterial({
        color: 0x333333,
        metalness: 0.8,
        roughness: 0.2
    });
    
    for (let i = 0; i < 3; i++) {
        const engine = new THREE.Mesh(engineGeometry, engineMaterial);
        engine.position.y = -4.5;
        
        if (i === 0) {
            engine.position.x = 0;
            engine.position.z = 0;
        } else {
            engine.position.x = Math.cos((i - 1) * Math.PI + Math.PI / 2) * 0.7;
            engine.position.z = Math.sin((i - 1) * Math.PI + Math.PI / 2) * 0.7;
        }
        
        rocketGroup.add(engine);
        
        // Engine flames
        const flameGeometry = new THREE.ConeGeometry(0.3, 2, 16);
        const flameMaterial = new THREE.MeshBasicMaterial({
            color: 0xff5500,
            transparent: true,
            opacity: 0.7
        });
        const flame = new THREE.Mesh(flameGeometry, flameMaterial);
        flame.position.y = -1;
        flame.rotation.x = Math.PI;
        engine.add(flame);
    }
    
    // Rocket stripe details
    const stripeGeometry = new THREE.CylinderGeometry(1.01, 1.01, 0.5, 32);
    const stripeMaterial = new THREE.MeshStandardMaterial({
        color: 0x3333dd,
        metalness: 0.3,
        roughness: 0.4
    });
    
    for (let i = 0; i < 3; i++) {
        const stripe = new THREE.Mesh(stripeGeometry, stripeMaterial);
        stripe.position.y = -2 + (i * 2);
        rocketGroup.add(stripe);
    }
    
    // Add stars background
    const starsGeometry = new THREE.BufferGeometry();
    const starsMaterial = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 0.1,
        transparent: true
    });
    
    const starsVertices = [];
    for (let i = 0; i < 5000; i++) {
        const x = (Math.random() - 0.5) * 2000;
        const y = (Math.random() - 0.5) * 2000;
        const z = (Math.random() - 0.5) * 2000;
        starsVertices.push(x, y, z);
    }
    
    starsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starsVertices, 3));
    const stars = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(stars);
    
    // Position camera
    camera.position.z = 15;
    
    // Handle window resize
    window.addEventListener('resize', () => {
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    });
    
    // Animation variables
    let rocketY = -5;
    let rocketVelocity = 0.03;
    let rocketRotationX = 0;
    let rocketRotationZ = 0;
    
    // Animation loop
    function animate() {
        requestAnimationFrame(animate);
        
        // Rocket movement animation
        rocketY += rocketVelocity;
        if (rocketY > 5 || rocketY < -5) {
            rocketVelocity *= -1;
        }
        
        rocketGroup.position.y = rocketY;
        
        // Small wobble for realism
        rocketRotationX = Math.sin(Date.now() * 0.001) * 0.05;
        rocketRotationZ = Math.cos(Date.now() * 0.001) * 0.05;
        
        rocketGroup.rotation.x = rocketRotationX;
        rocketGroup.rotation.z = rocketRotationZ;
        
        // Animate flames
        rocketGroup.children.forEach(child => {
            if (child.children && child.children.length > 0) {
                child.children.forEach(grandchild => {
                    if (grandchild.material && grandchild.material.opacity) {
                        grandchild.scale.x = 0.8 + Math.sin(Date.now() * 0.01) * 0.2;
                        grandchild.scale.z = 0.8 + Math.cos(Date.now() * 0.01) * 0.2;
                        grandchild.material.opacity = 0.5 + Math.sin(Date.now() * 0.01) * 0.3;
                    }
                });
            }
        });
        
        // Rotate stars slightly
        stars.rotation.y += 0.0001;
        
        renderer.render(scene, camera);
    }
    
    animate();
}

// Initialize Satellite Constellation Scene with Three.js
function initSatelliteScene() {
    const canvas = document.getElementById('satellite-canvas');
    if (!canvas) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
    
    const renderer = new THREE.WebGLRenderer({ 
        canvas: canvas,
        antialias: true,
        alpha: true 
    });
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    
    // Add lights
    const ambientLight = new THREE.AmbientLight(0x404040);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 3, 5);
    scene.add(directionalLight);
    
    // Create Earth (smaller and partially visible)
    const earthGeometry = new THREE.SphereGeometry(5, 32, 32);
    const earthMaterial = new THREE.MeshPhongMaterial({
        color: 0x1a4d7c,
        emissive: 0x112244,
        specular: 0x333333,
        shininess: 15
    });
    const earth = new THREE.Mesh(earthGeometry, earthMaterial);
    earth.position.set(0, -8, 0);
    scene.add(earth);
    
    // Create satellite constellation
    const constellationGroup = new THREE.Group();
    scene.add(constellationGroup);
    
    // Orbit rings
    const orbitMaterial = new THREE.LineBasicMaterial({
        color: 0x4444ff,
        transparent: true,
        opacity: 0.3
    });
    
    const orbitCount = 3;
    const satellitesPerOrbit = [8, 12, 16]; // Different number of satellites per orbit
    const orbitRadii = [8, 11, 14]; // Different orbit radii
    
    // Create orbits and satellites
    for (let i = 0; i < orbitCount; i++) {
        // Create orbit ring
        const orbitGeometry = new THREE.RingGeometry(orbitRadii[i] - 0.05, orbitRadii[i] + 0.05, 128);
        const orbitMesh = new THREE.Mesh(
            orbitGeometry,
            new THREE.MeshBasicMaterial({
                color: 0x4444ff,
                transparent: true,
                opacity: 0.3,
                side: THREE.DoubleSide
            })
        );
        orbitMesh.rotation.x = Math.PI / 2;
        constellationGroup.add(orbitMesh);
        
        // Create satellites in this orbit
        for (let j = 0; j < satellitesPerOrbit[i]; j++) {
            const angle = (j / satellitesPerOrbit[i]) * Math.PI * 2;
            
            // Satellite group (for easier positioning and animation)
            const satGroup = new THREE.Group();
            
            // Satellite body
            const bodyGeometry = new THREE.BoxGeometry(0.4, 0.2, 0.8);
            const bodyMaterial = new THREE.MeshStandardMaterial({
                color: 0xdddddd,
                metalness: 0.7,
                roughness: 0.3
            });
            const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
            satGroup.add(body);
            
            // Solar panels
            const panelGeometry = new THREE.BoxGeometry(2, 0.05, 0.6);
            const panelMaterial = new THREE.MeshStandardMaterial({
                color: 0x2244aa,
                metalness: 0.6,
                roughness: 0.4
            });
            
            const leftPanel = new THREE.Mesh(panelGeometry, panelMaterial);
            leftPanel.position.x = -1.2;
            satGroup.add(leftPanel);
            
            const rightPanel = new THREE.Mesh(panelGeometry, panelMaterial);
            rightPanel.position.x = 1.2;
            satGroup.add(rightPanel);
            
            // Antenna
            const antennaGeometry = new THREE.CylinderGeometry(0.02, 0.02, 0.6, 8);
            const antennaMaterial = new THREE.MeshStandardMaterial({
                color: 0x888888,
                metalness: 0.8,
                roughness: 0.2
            });
            const antenna = new THREE.Mesh(antennaGeometry, antennaMaterial);
            antenna.rotation.x = Math.PI / 2;
            antenna.position.z = 0.7;
            satGroup.add(antenna);
            
            // Position satellite in orbit
            satGroup.position.x = Math.cos(angle) * orbitRadii[i];
            satGroup.position.z = Math.sin(angle) * orbitRadii[i];
            
            // Store orbit info in the object for animation
            satGroup.userData = {
                orbitRadius: orbitRadii[i],
                orbitSpeed: 0.0005 * (1 - i * 0.15), // Different speeds for each orbit
                orbitAngle: angle
            };
            
            constellationGroup.add(satGroup);
        }
    }
    
    // Add connection lines between satellites
    const connectionMaterial = new THREE.LineBasicMaterial({
        color: 0x00ffff,
        transparent: true,
        opacity: 0.2
    });
    
    const connections = [];
    
    function updateConnections() {
        // Remove old connections
        connections.forEach(conn => constellationGroup.remove(conn));
        connections.length = 0;
        
        // Find satellites
        const satellites = [];
        constellationGroup.children.forEach(child => {
            if (child.children && child.children.length > 0 && child.userData && child.userData.orbitRadius) {
                satellites.push(child);
            }
        });
        
        // Create connections between closest satellites
        satellites.forEach(sat => {
            // Find 2 closest satellites
            const distances = satellites.map(other => {
                if (other === sat) return Infinity;
                const dx = sat.position.x - other.position.x;
                const dy = sat.position.y - other.position.y;
                const dz = sat.position.z - other.position.z;
                return Math.sqrt(dx*dx + dy*dy + dz*dz);
            });
            
            // Get indices of 2 smallest distances
            const closest = [];
            for (let i = 0; i < 2; i++) {
                let minIdx = 0;
                let minDist = Infinity;
                
                for (let j = 0; j < distances.length; j++) {
                    if (distances[j] < minDist && !closest.includes(j)) {
                        minDist = distances[j];
                        minIdx = j;
                    }
                }
                
                if (minDist < 10) { // Only connect if within reasonable distance
                    closest.push(minIdx);
                }
            }
            
            // Create connections to closest satellites
            closest.forEach(idx => {
                const other = satellites[idx];
                
                // Create line geometry
                const points = [
                    new THREE.Vector3(sat.position.x, sat.position.y, sat.position.z),
                    new THREE.Vector3(other.position.x, other.position.y, other.position.z)
                ];
                
                const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
                const line = new THREE.Line(lineGeometry, connectionMaterial);
                
                constellationGroup.add(line);
                connections.push(line);
            });
        });
    }
    
    // Add stars background
    const starsGeometry = new THREE.BufferGeometry();
    const starsMaterial = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 0.1,
        transparent: true
    });
    
    const starsVertices = [];
    for (let i = 0; i < 5000; i++) {
        const x = (Math.random() - 0.5) * 2000;
        const y = (Math.random() - 0.5) * 2000;
        const z = (Math.random() - 0.5) * 2000;
        starsVertices.push(x, y, z);
    }
    
    starsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starsVertices, 3));
    const stars = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(stars);
    
    // Position camera
    camera.position.z = 20;
    camera.position.y = 10;
    camera.rotation.x = -0.5;
    
    // Handle window resize
    window.addEventListener('resize', () => {
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    });
    
    // Animation loop
    function animate() {
        requestAnimationFrame(animate);
        
        // Rotate entire constellation slightly
        constellationGroup.rotation.y += 0.001;
        
        // Animate each satellite along its orbit
        constellationGroup.children.forEach(child => {
            if (child.userData && child.userData.orbitRadius) {
                child.userData.orbitAngle += child.userData.orbitSpeed;
                
                child.position.x = Math.cos(child.userData.orbitAngle) * child.userData.orbitRadius;
                child.position.z = Math.sin(child.userData.orbitAngle) * child.userData.orbitRadius;
                
                // Make satellite face the direction of movement
                child.rotation.y = child.userData.orbitAngle + Math.PI / 2;
            }
        });
        
        // Update connections every 30 frames to reduce computation
        if (Math.floor(Date.now() / 100) % 3 === 0) {
            updateConnections();
        }
        
        // Rotate stars slightly
        stars.rotation.y += 0.0001;
        
        renderer.render(scene, camera);
    }
    
    animate();
}

// Enhanced particle system
function createParticleSystem() {
    const canvas = document.createElement('canvas');
    canvas.id = 'particle-canvas';
    canvas.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: -1;
        opacity: 0.3;
    `;
    document.body.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    let particles = [];
    
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    // Particle constructor
    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.vx = (Math.random() - 0.5) * 0.5;
            this.vy = (Math.random() - 0.5) * 0.5;
            this.size = Math.random() * 2 + 0.5;
            this.alpha = Math.random() * 0.5 + 0.2;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
            if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
        }

        draw() {
            ctx.save();
            ctx.globalAlpha = this.alpha;
            ctx.fillStyle = '#4a9eff';
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }
    }

    // Create particles
    for (let i = 0; i < 30; i++) {
        particles.push(new Particle());
    }

    // Animation loop
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });

        requestAnimationFrame(animate);
    }

    animate();
}

// Initialize heat map animation
function initializeHeatMap() {
    const heatZones = document.querySelectorAll('.zone');
    
    heatZones.forEach((zone, index) => {
        zone.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.1)';
            this.style.opacity = '0.8';
        });

        zone.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
            this.style.opacity = '0.3';
        });
    });
}

// Initialize satellite mesh animation
function initializeSatelliteMesh() {
    const satelliteNodes = document.querySelectorAll('.satellite-node');
    
    satelliteNodes.forEach((node, index) => {
        node.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.5)';
            this.style.boxShadow = '0 0 30px rgba(74, 158, 255, 0.8)';
        });

        node.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
            this.style.boxShadow = '0 0 20px rgba(74, 158, 255, 0.5)';
        });
    });
}

// Scroll-triggered animations
window.addEventListener('scroll', function() {
    const scrolled = window.pageYOffset;
    const viewportHeight = window.innerHeight;
    
    // Earth rotation speed based on scroll
    const earth = document.querySelector('.earth');
    if (earth) {
        const rotation = scrolled * 0.1;
        earth.style.transform = `translate(-50%, -50%) rotate(${rotation}deg)`;
    }

    // Heat zones intensity based on scroll
    const heatZones = document.querySelectorAll('.zone');
    const kronosSection = document.querySelector('#kronos');
    if (kronosSection) {
        const rect = kronosSection.getBoundingClientRect();
        const visibility = Math.max(0, Math.min(1, 1 - Math.abs(rect.top) / viewportHeight));
        
        heatZones.forEach(zone => {
            zone.style.opacity = visibility * 0.6;
        });
    }

    // Rocket stages assembly animation
    const rocketStages = document.querySelectorAll('.stage');
    const nebulaSection = document.querySelector('#nebula');
    if (nebulaSection) {
        const rect = nebulaSection.getBoundingClientRect();
        const visibility = Math.max(0, Math.min(1, 1 - Math.abs(rect.top) / viewportHeight));
        
        rocketStages.forEach((stage, index) => {
            const delay = index * 0.2;
            const stageVisibility = Math.max(0, visibility - delay);
            stage.style.opacity = stageVisibility;
            stage.style.transform = `translateY(${(1 - stageVisibility) * 50}px)`;
        });
    }

    // Satellite mesh formation
    const satelliteNodes = document.querySelectorAll('.satellite-node');
    const hyperclusterSection = document.querySelector('#hypercluster');
    if (hyperclusterSection) {
        const rect = hyperclusterSection.getBoundingClientRect();
        const visibility = Math.max(0, Math.min(1, 1 - Math.abs(rect.top) / viewportHeight));
        
        satelliteNodes.forEach((node, index) => {
            const delay = index * 0.1;
            const nodeVisibility = Math.max(0, visibility - delay);
            node.style.opacity = nodeVisibility;
            node.style.transform = `scale(${nodeVisibility})`;
        });
    }
});

// Add subtle mouse movement parallax
document.addEventListener('mousemove', function(e) {
    const mouseX = e.clientX / window.innerWidth - 0.5;
    const mouseY = e.clientY / window.innerHeight - 0.5;
    
    const rocketBg = document.querySelector('.rocket-bg');
    if (rocketBg) {
        const moveX = mouseX * 20;
        const moveY = mouseY * 20;
        rocketBg.style.transform = `translate(${moveX}px, ${moveY}px)`;
    }
});

// Performance optimization
let ticking = false;

function updateAnimations() {
    // Batch DOM updates here
    ticking = false;
}

window.addEventListener('scroll', function() {
    if (!ticking) {
        requestAnimationFrame(updateAnimations);
        ticking = true;
    }
});

// Initialize Kronos Engine with AI control systems
function initKronosEngine() {
    const canvas = document.getElementById('engine-canvas');
    if (!canvas) return;

    // Create scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);
    scene.fog = new THREE.FogExp2(0x000815, 0.03);

    // Camera setup
    const camera = new THREE.PerspectiveCamera(60, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
    camera.position.set(0, 0, 10);
    camera.lookAt(0, 0, 0);

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        antialias: true,
        alpha: true
    });
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;

    // Advanced lighting
    const ambientLight = new THREE.AmbientLight(0x111122, 0.5);
    scene.add(ambientLight);

    const blueLight = new THREE.PointLight(0x0066ff, 5, 15);
    blueLight.position.set(5, 3, 5);
    blueLight.castShadow = true;
    scene.add(blueLight);

    const orangeLight = new THREE.PointLight(0xff6600, 5, 15);
    orangeLight.position.set(-5, -3, 5);
    orangeLight.castShadow = true;
    scene.add(orangeLight);

    // Create engine group
    const engineGroup = new THREE.Group();
    scene.add(engineGroup);

    // Advanced materials
    const metalMaterial = new THREE.MeshStandardMaterial({
        color: 0x333333,
        metalness: 0.9,
        roughness: 0.2,
        envMapIntensity: 1.0
    });

    const glowBlueMaterial = new THREE.MeshStandardMaterial({
        color: 0x0099ff,
        emissive: 0x0066aa,
        emissiveIntensity: 0.8,
        metalness: 0.5,
        roughness: 0.4
    });

    const glassyMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x223366,
        metalness: 0.9,
        roughness: 0.05,
        transparent: true,
        opacity: 0.6,
        envMapIntensity: 1.0,
        clearcoat: 1.0,
        clearcoatRoughness: 0.1
    });

    // Main engine body
    const engineBodyGeo = new THREE.CylinderGeometry(1.5, 2, 6, 64);
    const engineBody = new THREE.Mesh(engineBodyGeo, metalMaterial);
    engineBody.castShadow = true;
    engineBody.receiveShadow = true;
    engineGroup.add(engineBody);

    // Engine nozzle
    const nozzleGeo = new THREE.CylinderGeometry(2, 0.8, 3, 64, 8, true);
    const nozzle = new THREE.Mesh(nozzleGeo, metalMaterial);
    nozzle.position.y = -4.5;
    nozzle.castShadow = true;
    nozzle.receiveShadow = true;
    engineGroup.add(nozzle);

    // Advanced cooling system
    const coolingRingGeo = new THREE.TorusGeometry(1.6, 0.08, 16, 100);
    
    for (let i = 0; i < 12; i++) {
        const coolingRing = new THREE.Mesh(coolingRingGeo, glowBlueMaterial);
        coolingRing.rotation.x = Math.PI / 2;
        coolingRing.position.y = -1.5 + (i * 0.4);
        coolingRing.scale.y = 1 + (i % 2) * 0.1;
        engineGroup.add(coolingRing);
    }

    // AI Control Systems
    // Central AI core
    const aiCoreGeo = new THREE.SphereGeometry(0.4, 32, 32);
    const aiCore = new THREE.Mesh(aiCoreGeo, glassyMaterial);
    aiCore.position.y = 3.5;
    engineGroup.add(aiCore);

    // AI circuit patterns
    const circuitGeo = new THREE.CylinderGeometry(1.51, 2.01, 6.01, 64);
    
    // Load circuit texture
    const textureLoader = new THREE.TextureLoader();
    const circuitTexture = textureLoader.load('https://i.imgur.com/LVJHqGF.jpg');
    circuitTexture.wrapS = THREE.RepeatWrapping;
    circuitTexture.wrapT = THREE.RepeatWrapping;
    circuitTexture.repeat.set(4, 4);
    
    const circuitMaterial = new THREE.MeshStandardMaterial({
        map: circuitTexture,
        emissive: 0x0055aa,
        emissiveIntensity: 0.5,
        transparent: true,
        opacity: 0.7
    });
    
    const circuitPattern = new THREE.Mesh(circuitGeo, circuitMaterial);
    engineGroup.add(circuitPattern);

    // Control modules
    const moduleGeo = new THREE.BoxGeometry(0.3, 0.2, 0.6);
    
    for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI * 2;
        const module = new THREE.Mesh(moduleGeo, metalMaterial);
        module.position.set(
            Math.cos(angle) * 1.6,
            2.5,
            Math.sin(angle) * 1.6
        );
        module.rotation.y = angle;
        
        // Add glow LED
        const ledGeo = new THREE.SphereGeometry(0.04, 8, 8);
        const ledMaterial = new THREE.MeshBasicMaterial({
            color: i % 3 === 0 ? 0xff0000 : i % 3 === 1 ? 0x00ff00 : 0x0088ff
        });
        const led = new THREE.Mesh(ledGeo, ledMaterial);
        led.position.set(0, 0.15, 0.25);
        module.add(led);
        
        engineGroup.add(module);
    }

    // Engine flame effect
    const flameGroup = new THREE.Group();
    
    // Main flame
    const flameGeo = new THREE.ConeGeometry(0.9, 5, 32, 1, true);
    const flameMaterial = new THREE.MeshBasicMaterial({
        color: 0xff4400,
        transparent: true,
        opacity: 0.7
    });
    const flame = new THREE.Mesh(flameGeo, flameMaterial);
    flame.rotation.x = Math.PI;
    flameGroup.add(flame);
    
    // Blue core
    const coreGeo = new THREE.ConeGeometry(0.4, 3, 32, 1, true);
    const coreMaterial = new THREE.MeshBasicMaterial({
        color: 0x00aaff,
        transparent: true,
        opacity: 0.9
    });
    const core = new THREE.Mesh(coreGeo, coreMaterial);
    core.rotation.x = Math.PI;
    core.position.y = 1;
    flameGroup.add(core);
    
    flameGroup.position.y = -6;
    engineGroup.add(flameGroup);

    // Data hologram
    const hologramGeo = new THREE.CircleGeometry(3, 32);
    const hologramMaterial = new THREE.MeshBasicMaterial({
        color: 0x00aaff,
        transparent: true,
        opacity: 0.2,
        side: THREE.DoubleSide
    });
    
    const hologram = new THREE.Mesh(hologramGeo, hologramMaterial);
    hologram.rotation.x = -Math.PI / 2;
    hologram.position.y = -1;
    
    // Add data lines to hologram
    const lineMaterial = new THREE.LineBasicMaterial({
        color: 0x00ffff,
        transparent: true,
        opacity: 0.6
    });
    
    for (let i = 0; i < 8; i++) {
        const linePoints = [];
        const segments = 50;
        
        for (let j = 0; j < segments; j++) {
            const x = (j / (segments - 1)) * 6 - 3;
            const z = Math.sin((j / (segments - 1)) * Math.PI * 4 + i) * 0.2;
            linePoints.push(new THREE.Vector3(x, 0, z));
        }
        
        const lineGeo = new THREE.BufferGeometry().setFromPoints(linePoints);
        const line = new THREE.Line(lineGeo, lineMaterial);
        hologram.add(line);
    }
    
    scene.add(hologram);

    // Window resize handler
    window.addEventListener('resize', () => {
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    });

    // Animation
    function animate() {
        requestAnimationFrame(animate);
        
        // Rotate engine
        engineGroup.rotation.y += 0.005;
        
        // AI system pulsing
        aiCore.scale.set(
            1 + Math.sin(Date.now() * 0.002) * 0.1,
            1 + Math.sin(Date.now() * 0.002) * 0.1,
            1 + Math.sin(Date.now() * 0.002) * 0.1
        );
        
        glassyMaterial.opacity = 0.6 + Math.sin(Date.now() * 0.002) * 0.2;
        circuitMaterial.emissiveIntensity = 0.3 + Math.sin(Date.now() * 0.001) * 0.2;
        
        // Animate flame
        flame.scale.x = 0.9 + Math.sin(Date.now() * 0.01) * 0.2;
        flame.scale.z = 0.9 + Math.cos(Date.now() * 0.01) * 0.2;
        flameMaterial.opacity = 0.6 + Math.sin(Date.now() * 0.01) * 0.3;
        
        core.scale.x = 0.8 + Math.cos(Date.now() * 0.02) * 0.2;
        core.scale.z = 0.8 + Math.sin(Date.now() * 0.02) * 0.2;
        
        // Animate hologram
        hologram.rotation.z += 0.005;
        hologram.children.forEach((line, index) => {
            const positions = line.geometry.attributes.position.array;
            for (let i = 0; i < positions.length; i += 3) {
                const j = i / 3;
                positions[i+2] = Math.sin(
                    (j / (positions.length/3 - 1)) * Math.PI * 4 + 
                    index + Date.now() * 0.001
                ) * 0.2;
            }
            line.geometry.attributes.position.needsUpdate = true;
        });
        
        // Pulse lights
        blueLight.intensity = 4 + Math.sin(Date.now() * 0.001) * 2;
        orangeLight.intensity = 4 + Math.cos(Date.now() * 0.001) * 2;
        
        renderer.render(scene, camera);
    }
    
    animate();
}

// Initialize the Nebula 1 Rocket with landing capabilities
function initNebula1Rocket() {
    const canvas = document.getElementById('rocket-canvas');
    if (!canvas) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);
    scene.fog = new THREE.FogExp2(0x000815, 0.03);

    // Camera
    const camera = new THREE.PerspectiveCamera(60, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
    camera.position.set(0, 0, 20);
    camera.lookAt(0, 0, 0);

    // Renderer
    const renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        antialias: true,
        alpha: true
    });
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x111122, 0.5);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xffffff, 1);
    sunLight.position.set(10, 20, 10);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    scene.add(sunLight);

    const blueLight = new THREE.PointLight(0x0066ff, 3, 30);
    blueLight.position.set(-10, 5, 10);
    scene.add(blueLight);

    // Advanced materials
    const rocketBodyMaterial = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        metalness: 0.5,
        roughness: 0.4
    });

    const metalMaterial = new THREE.MeshStandardMaterial({
        color: 0x333333,
        metalness: 0.9,
        roughness: 0.2
    });

    const engineMaterial = new THREE.MeshStandardMaterial({
        color: 0x222222,
        metalness: 0.9,
        roughness: 0.1
    });

    const blueAccentMaterial = new THREE.MeshStandardMaterial({
        color: 0x0066aa,
        metalness: 0.7,
        roughness: 0.3
    });

    // Create rocket group
    const rocketGroup = new THREE.Group();
    scene.add(rocketGroup);

    // First stage
    const firstStageGroup = new THREE.Group();
    
    // Main body
    const firstStageGeo = new THREE.CylinderGeometry(2, 2, 12, 32);
    const firstStage = new THREE.Mesh(firstStageGeo, rocketBodyMaterial);
    firstStage.castShadow = true;
    firstStage.receiveShadow = true;
    firstStageGroup.add(firstStage);
    
    // Blue stripe
    const stripeGeo = new THREE.CylinderGeometry(2.01, 2.01, 1, 32);
    const stripe = new THREE.Mesh(stripeGeo, blueAccentMaterial);
    stripe.position.y = 3;
    firstStageGroup.add(stripe);
    
    // Company logo
    const logoGeo = new THREE.BoxGeometry(1, 1, 0.1);
    const logoMaterial = new THREE.MeshBasicMaterial({
        color: 0x0099ff
    });
    const logo = new THREE.Mesh(logoGeo, logoMaterial);
    logo.position.set(0, 0, 2.01);
    firstStageGroup.add(logo);
    
    // Grid fins
    const finGeo = new THREE.BoxGeometry(1.5, 0.1, 1.5);
    
    for (let i = 0; i < 4; i++) {
        const angle = (i / 4) * Math.PI * 2;
        const fin = new THREE.Mesh(finGeo, metalMaterial);
        fin.position.set(
            Math.cos(angle) * 2.5,
            5,
            Math.sin(angle) * 2.5
        );
        fin.rotation.y = angle;
        firstStageGroup.add(fin);
    }
    
    // Landing legs
    const legGeo = new THREE.CylinderGeometry(0.1, 0.1, 3, 8);
    
    for (let i = 0; i < 4; i++) {
        const angle = (i / 4) * Math.PI * 2 + (Math.PI / 4);
        const leg = new THREE.Mesh(legGeo, metalMaterial);
        leg.position.set(
            Math.cos(angle) * 2,
            -6,
            Math.sin(angle) * 2
        );
        leg.rotation.x = Math.PI / 4;
        leg.rotation.z = angle;
        
        // Foot pad
        const footGeo = new THREE.BoxGeometry(0.8, 0.1, 0.8);
        const foot = new THREE.Mesh(footGeo, metalMaterial);
        foot.position.set(0, -1.5, 0);
        leg.add(foot);
        
        firstStageGroup.add(leg);
    }
    
    // Engines - 9 Kronos engines in octaweb configuration
    const engineGroupGeo = new THREE.CylinderGeometry(2, 1.8, 1, 32);
    const engineGroup = new THREE.Mesh(engineGroupGeo, metalMaterial);
    engineGroup.position.y = -6;
    firstStageGroup.add(engineGroup);
    
    // Individual engines
    for (let i = 0; i < 9; i++) {
        let posX = 0;
        let posZ = 0;
        
        if (i > 0) {
            const angle = ((i - 1) / 8) * Math.PI * 2;
            posX = Math.cos(angle) * 1.2;
            posZ = Math.sin(angle) * 1.2;
        }
        
        const engineGeo = new THREE.CylinderGeometry(0.3, 0.4, 0.8, 16);
        const engine = new THREE.Mesh(engineGeo, engineMaterial);
        engine.position.set(posX, -6.5, posZ);
        
        // Engine bell
        const bellGeo = new THREE.CylinderGeometry(0.4, 0.2, 0.6, 16);
        const bell = new THREE.Mesh(bellGeo, engineMaterial);
        bell.position.y = -0.7;
        engine.add(bell);
        
        // Engine flame
        const flameGeo = new THREE.ConeGeometry(0.2, 1.5, 16);
        const flameMaterial = new THREE.MeshBasicMaterial({
            color: 0xff4400,
            transparent: true,
            opacity: 0.7
        });
        const flame = new THREE.Mesh(flameGeo, flameMaterial);
        flame.rotation.x = Math.PI;
        flame.position.y = -1;
        engine.add(flame);
        
        firstStageGroup.add(engine);
    }
    
    firstStageGroup.position.y = -2;
    rocketGroup.add(firstStageGroup);

    // Second stage
    const secondStageGroup = new THREE.Group();
    
    // Main body
    const secondStageGeo = new THREE.CylinderGeometry(1.8, 1.8, 5, 32);
    const secondStage = new THREE.Mesh(secondStageGeo, rocketBodyMaterial);
    secondStage.castShadow = true;
    secondStage.receiveShadow = true;
    secondStageGroup.add(secondStage);
    
    // Blue stripe
    const secondStripeGeo = new THREE.CylinderGeometry(1.81, 1.81, 0.5, 32);
    const secondStripe = new THREE.Mesh(secondStripeGeo, blueAccentMaterial);
    secondStripe.position.y = 1.5;
    secondStageGroup.add(secondStripe);
    
    // Engine
    const secondEngineGeo = new THREE.CylinderGeometry(0.8, 1, 1, 32);
    const secondEngine = new THREE.Mesh(secondEngineGeo, engineMaterial);
    secondEngine.position.y = -3;
    
    // Engine bell
    const secondBellGeo = new THREE.CylinderGeometry(1, 0.5, 1, 32);
    const secondBell = new THREE.Mesh(secondBellGeo, engineMaterial);
    secondBell.position.y = -1;
    secondEngine.add(secondBell);
    
    secondStageGroup.add(secondEngine);
    
    secondStageGroup.position.y = 6.5;
    rocketGroup.add(secondStageGroup);

    // Payload fairing
    const fairingGroup = new THREE.Group();
    
    // Fairing base
    const fairingBaseGeo = new THREE.CylinderGeometry(1.8, 1.8, 1, 32);
    const fairingBase = new THREE.Mesh(fairingBaseGeo, rocketBodyMaterial);
    fairingGroup.add(fairingBase);
    
    // Fairing cone
    const fairingConeGeo = new THREE.ConeGeometry(1.8, 4, 32);
    const fairingCone = new THREE.Mesh(fairingConeGeo, rocketBodyMaterial);
    fairingCone.position.y = 2.5;
    fairingGroup.add(fairingCone);
    
    // Satellite payload
    const satelliteGeo = new THREE.BoxGeometry(1.5, 0.5, 1.5);
    const satellite = new THREE.Mesh(satelliteGeo, metalMaterial);
    
    // Solar panels
    const panelGeo = new THREE.BoxGeometry(3, 0.05, 0.8);
    const panelMaterial = new THREE.MeshStandardMaterial({
        color: 0x2255aa,
        metalness: 0.5,
        roughness: 0.3
    });
    
    const panel1 = new THREE.Mesh(panelGeo, panelMaterial);
    panel1.position.x = 2.5;
    satellite.add(panel1);
    
    const panel2 = new THREE.Mesh(panelGeo, panelMaterial);
    panel2.position.x = -2.5;
    satellite.add(panel2);
    
    satellite.position.y = 1;
    satellite.visible = false; // Hidden inside fairing
    fairingGroup.add(satellite);
    
    fairingGroup.position.y = 12;
    rocketGroup.add(fairingGroup);

    // Add stars background
    const starsGeo = new THREE.BufferGeometry();
    const starsMaterial = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 0.1,
        transparent: true
    });
    
    const starsVertices = [];
    for (let i = 0; i < 5000; i++) {
        const x = (Math.random() - 0.5) * 2000;
        const y = (Math.random() - 0.5) * 2000;
        const z = (Math.random() - 0.5) * 2000;
        starsVertices.push(x, y, z);
    }
    
    starsGeo.setAttribute('position', new THREE.Float32BufferAttribute(starsVertices, 3));
    const stars = new THREE.Points(starsGeo, starsMaterial);
    scene.add(stars);

    // Distant Earth
    const earthGeo = new THREE.SphereGeometry(50, 64, 64);
    const earthMaterial = new THREE.MeshPhongMaterial({
        color: 0x1155aa,
        emissive: 0x112233,
        specular: 0x333333,
        shininess: 15
    });
    const earth = new THREE.Mesh(earthGeo, earthMaterial);
    earth.position.set(0, -80, -100);
    scene.add(earth);

    // Animation variables
    let phase = 0; // 0: ready, 1: launch, 2: stage separation, 3: satellite deployment
    let rocketY = -5;
    let rocketVelocity = 0;
    let separationTimer = 0;
    
    // Window resize handler
    window.addEventListener('resize', () => {
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    });

    // Launch sequence
    function launchSequence() {
        phase = 1;
        rocketVelocity = 0.1;
    }
    
    // Click to launch
    canvas.addEventListener('click', () => {
        if (phase === 0) {
            launchSequence();
        } else if (phase === 1 && rocketY > 15) {
            phase = 2; // Trigger stage separation
        } else if (phase === 3) {
            phase = 0; // Reset
            rocketY = -5;
            rocketVelocity = 0;
            rocketGroup.position.y = rocketY;
            rocketGroup.rotation.z = 0;
            firstStageGroup.visible = true;
            firstStageGroup.position.y = -2;
            secondStageGroup.position.y = 6.5;
            satellite.visible = false;
            fairingGroup.visible = true;
            separationTimer = 0;
        }
    });

    // Automatic demo mode
    setTimeout(() => {
        if (phase === 0) launchSequence();
    }, 2000);

    // Animation loop
    function animate() {
        requestAnimationFrame(animate);
        
        // Update rocket position based on phase
        if (phase === 1) { // Launch
            rocketVelocity += 0.005;
            rocketY += rocketVelocity;
            rocketGroup.position.y = rocketY;
            
            // Flame animations
            firstStageGroup.children.forEach(child => {
                if (child.children && child.children.length > 0) {
                    child.children.forEach(grandchild => {
                        if (grandchild.material && grandchild.material.color && 
                            grandchild.material.color.r > 0.8) {
                            grandchild.scale.x = 0.8 + Math.sin(Date.now() * 0.01) * 0.2;
                            grandchild.scale.z = 0.8 + Math.cos(Date.now() * 0.01) * 0.2;
                            grandchild.material.opacity = 0.6 + Math.sin(Date.now() * 0.01) * 0.3;
                        }
                    });
                }
            });
            
            // Camera follow
            if (rocketY > 5) {
                camera.position.y = rocketY - 5;
            }
            
            // Trigger stage separation
            if (rocketY > 30 && phase === 1) {
                phase = 2;
            }
        } else if (phase === 2) { // Stage separation
            separationTimer++;
            
            if (separationTimer < 50) {
                // First stage falls back
                firstStageGroup.position.y -= 0.1;
                firstStageGroup.position.x += 0.05;
                firstStageGroup.rotation.z += 0.002;
                
                // Second stage continues
                rocketVelocity = Math.max(0.1, rocketVelocity * 0.98);
                rocketY += rocketVelocity;
                rocketGroup.position.y = rocketY;
                
                // Camera follow
                camera.position.y = rocketY;
            } else if (separationTimer < 100) {
                // Deploy payload
                if (separationTimer === 50) {
                    fairingGroup.visible = false;
                    satellite.visible = true;
                }
                
                // Slow down and prepare for satellite deployment
                rocketVelocity = Math.max(0.05, rocketVelocity * 0.95);
                rocketY += rocketVelocity;
                rocketGroup.position.y = rocketY;
                
                // Camera focus on satellite
                camera.position.y = rocketY + 5;
                camera.position.z = 15;
                camera.lookAt(0, rocketY, 0);
            } else {
                // Satellite deployment
                phase = 3;
                satellite.position.y += 0.1;
                
                if (satellite.position.y > 10) {
                    // Deploy solar panels animation
                    panel1.rotation.y = Math.min(panel1.rotation.y + 0.05, Math.PI / 2);
                    panel2.rotation.y = Math.max(panel2.rotation.y - 0.05, -Math.PI / 2);
                }
            }
        } else if (phase === 3) { // Satellite operational
            satellite.rotation.y += 0.005;
            
            // Slowly pull camera back
            camera.position.z = Math.min(camera.position.z + 0.05, 30);
            camera.lookAt(0, rocketY + satellite.position.y, 0);
        } else { // Ready state
            // Small hover animation
            rocketGroup.position.y = rocketY + Math.sin(Date.now() * 0.001) * 0.2;
            
            // Small rotation
            rocketGroup.rotation.y = Math.sin(Date.now() * 0.0005) * 0.1;
        }
        
        // Stars rotation
        stars.rotation.y += 0.0001;
        stars.rotation.x += 0.00005;
        
        // Earth rotation
        earth.rotation.y += 0.001;
        
        renderer.render(scene, camera);
    }
    
    animate();
}

// Initialize the Hypercluster Satellite Constellation
function initHyperclusterConstellation() {
    const canvas = document.getElementById('satellite-canvas');
    if (!canvas) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);
    scene.fog = new THREE.FogExp2(0x000815, 0.01);

    // Camera
    const camera = new THREE.PerspectiveCamera(60, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
    camera.position.set(0, 20, 35);
    camera.lookAt(0, 0, 0);

    // Renderer
    const renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        antialias: true,
        alpha: true
    });
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x111122, 0.5);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xffffff, 1);
    sunLight.position.set(50, 50, 50);
    sunLight.castShadow = true;
    scene.add(sunLight);

    const blueLight = new THREE.PointLight(0x0066ff, 5, 100);
    blueLight.position.set(-20, 10, 20);
    scene.add(blueLight);

    // Earth
    const earthGroup = new THREE.Group();
    scene.add(earthGroup);
    
    const earthGeo = new THREE.SphereGeometry(10, 64, 64);
    const textureLoader = new THREE.TextureLoader();
    
    const earthTexture = textureLoader.load('https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_atmos_2048.jpg');
    const earthBumpMap = textureLoader.load('https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_normal_2048.jpg');
    const earthSpecMap = textureLoader.load('https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_specular_2048.jpg');
    const cloudsTexture = textureLoader.load('https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_clouds_2048.jpg');
    
    const earthMaterial = new THREE.MeshPhongMaterial({
        map: earthTexture,
        bumpMap: earthBumpMap,
        bumpScale: 0.1,
        specularMap: earthSpecMap,
        specular: new THREE.Color(0x333333),
        shininess: 15
    });
    
    const earth = new THREE.Mesh(earthGeo, earthMaterial);
    earth.castShadow = true;
    earth.receiveShadow = true;
    earthGroup.add(earth);
    
    // Cloud layer
    const cloudGeo = new THREE.SphereGeometry(10.3, 64, 64);
    const cloudMaterial = new THREE.MeshPhongMaterial({
        map: cloudsTexture,
        transparent: true,
        opacity: 0.6
    });
    
    const clouds = new THREE.Mesh(cloudGeo, cloudMaterial);
    earthGroup.add(clouds);
    
    // Atmosphere glow
    const glowGeo = new THREE.SphereGeometry(10.5, 64, 64);
    const glowMaterial = new THREE.MeshPhongMaterial({
        color: 0x0077ff,
        transparent: true,
        opacity: 0.1,
        side: THREE.BackSide
    });
    
    const glow = new THREE.Mesh(glowGeo, glowMaterial);
    earthGroup.add(glow);

    // Orbit paths
    const orbitPaths = [];
    const orbitRadii = [15, 18, 21, 24];
    
    const orbitMaterial = new THREE.LineBasicMaterial({
        color: 0x0099ff,
        transparent: true,
        opacity: 0.3
    });
    
    orbitRadii.forEach(radius => {
        const orbitPoints = [];
        const segments = 128;
        
        for (let i = 0; i <= segments; i++) {
            const angle = (i / segments) * Math.PI * 2;
            orbitPoints.push(
                new THREE.Vector3(
                    Math.cos(angle) * radius,
                    0,
                    Math.sin(angle) * radius
                )
            );
        }
        
        const orbitGeo = new THREE.BufferGeometry().setFromPoints(orbitPoints);
        const orbit = new THREE.Line(orbitGeo, orbitMaterial);
        orbit.rotation.x = Math.PI / 2;
        scene.add(orbit);
        orbitPaths.push(orbit);
    });

    // Create satellites
    const satelliteGroup = new THREE.Group();
    scene.add(satelliteGroup);
    
    const satelliteBodies = [];
    const interSatLinks = [];
    
    // Detailed satellite model
    function createSatellite() {
        const satGroup = new THREE.Group();
        
        // Main body
        const bodyGeo = new THREE.BoxGeometry(0.8, 0.4, 1.5);
        const bodyMaterial = new THREE.MeshStandardMaterial({
            color: 0xdddddd,
            metalness: 0.8,
            roughness: 0.2
        });
        const body = new THREE.Mesh(bodyGeo, bodyMaterial);
        satGroup.add(body);
        
        // Solar panels
        const panelGeo = new THREE.BoxGeometry(4, 0.1, 1);
        const panelMaterial = new THREE.MeshStandardMaterial({
            color: 0x2255aa,
            metalness: 0.5,
            roughness: 0.3
        });
        
        const panelLeft = new THREE.Mesh(panelGeo, panelMaterial);
        panelLeft.position.x = -2.4;
        satGroup.add(panelLeft);
        
        const panelRight = new THREE.Mesh(panelGeo, panelMaterial);
        panelRight.position.x = 2.4;
        satGroup.add(panelRight);
        
        // Communication dish
        const dishGeo = new THREE.SphereGeometry(0.5, 16, 8, 0, Math.PI);
        const dishMaterial = new THREE.MeshStandardMaterial({
            color: 0x999999,
            metalness: 0.8,
            roughness: 0.2
        });
        const dish = new THREE.Mesh(dishGeo, dishMaterial);
        dish.rotation.x = Math.PI / 2;
        dish.position.z = 0.8;
        satGroup.add(dish);
        
        // AI module with glow
        const aiModuleGeo = new THREE.BoxGeometry(0.5, 0.3, 0.5);
        const aiModuleMaterial = new THREE.MeshStandardMaterial({
            color: 0x00aaff,
            emissive: 0x0055aa,
            emissiveIntensity: 0.5,
            transparent: true,
            opacity: 0.9
        });
        const aiModule = new THREE.Mesh(aiModuleGeo, aiModuleMaterial);
        aiModule.position.y = 0.3;
        satGroup.add(aiModule);
        
        // Antennas
        const antennaGeo = new THREE.CylinderGeometry(0.03, 0.03, 0.8, 8);
        const antennaMaterial = new THREE.MeshStandardMaterial({
            color: 0x666666,
            metalness: 0.8,
            roughness: 0.2
        });
        
        for (let i = 0; i < 2; i++) {
            const antenna = new THREE.Mesh(antennaGeo, antennaMaterial);
            antenna.position.set(i === 0 ? 0.2 : -0.2, 0.2, -0.6);
            satGroup.add(antenna);
        }
        
        return satGroup;
    }
    
    // Create multiple satellites in each orbit
    orbitRadii.forEach((radius, orbitIndex) => {
        const count = 6 + orbitIndex * 3; // More satellites in outer orbits
        
        for (let i = 0; i < count; i++) {
            const angle = (i / count) * Math.PI * 2;
            const inclination = (orbitIndex % 2 === 0) ? 0.1 : -0.1; // Alternate orbit inclination
            
            const x = Math.cos(angle) * radius;
            const y = Math.sin(inclination * Math.PI) * radius;
            const z = Math.sin(angle) * radius;
            
            const satellite = createSatellite();
            satellite.position.set(x, y, z);
            
            // Orient satellite to face Earth
            satellite.lookAt(0, 0, 0);
            
            // Data for animation
            satellite.userData = {
                orbit: orbitIndex,
                angle: angle,
                radius: radius,
                inclination: inclination,
                speed: 0.0002 * (1 - orbitIndex * 0.15), // Different speeds for each orbit
                links: []
            };
            
            satelliteGroup.add(satellite);
            satelliteBodies.push(satellite);
        }
    });

    // Create inter-satellite laser links
    function updateSatelliteLinks() {
        // Remove old links
        interSatLinks.forEach(link => {
            satelliteGroup.remove(link);
        });
        interSatLinks.length = 0;
        
        // Connect satellites to nearest neighbors in same orbit and adjacent orbits
        satelliteBodies.forEach(sat => {
            // Clear previous links
            sat.userData.links = [];
            
            // Find closest satellites
            const potentialLinks = [];
            
            satelliteBodies.forEach(otherSat => {
                if (sat === otherSat) return;
                
                // Calculate distance
                const dx = sat.position.x - otherSat.position.x;
                const dy = sat.position.y - otherSat.position.y;
                const dz = sat.position.z - otherSat.position.z;
                const distance = Math.sqrt(dx*dx + dy*dy + dz*dz);
                
                // Check if it's in same orbit or adjacent orbit
                const sameOrbit = sat.userData.orbit === otherSat.userData.orbit;
                const adjacentOrbit = Math.abs(sat.userData.orbit - otherSat.userData.orbit) === 1;
                
                if (sameOrbit || adjacentOrbit) {
                    // Satellite must be in line of sight (not blocked by Earth)
                    const midPoint = new THREE.Vector3(
                        (sat.position.x + otherSat.position.x) / 2,
                        (sat.position.y + otherSat.position.y) / 2,
                        (sat.position.z + otherSat.position.z) / 2
                    );
                    
                    // Distance from Earth center to midpoint
                    const midPointDistance = midPoint.length();
                    
                    // If midpoint is farther than Earth radius, there's line of sight
                    if (midPointDistance > 10.5) {
                        potentialLinks.push({
                            satellite: otherSat,
                            distance: distance
                        });
                    }
                }
            });
            
            // Sort by distance
            potentialLinks.sort((a, b) => a.distance - b.distance);
            
            // Take up to 3 closest satellites
            const linkCount = Math.min(3, potentialLinks.length);
            
            for (let i = 0; i < linkCount; i++) {
                const link = potentialLinks[i];
                
                // Avoid duplicate links
                if (!sat.userData.links.includes(link.satellite) && 
                    !link.satellite.userData.links.includes(sat)) {
                    
                    sat.userData.links.push(link.satellite);
                    link.satellite.userData.links.push(sat);
                    
                    // Create visual link
                    const linkPoints = [
                        sat.position.clone(),
                        link.satellite.position.clone()
                    ];
                    
                    const linkGeo = new THREE.BufferGeometry().setFromPoints(linkPoints);
                    
                    // Data packet animation along link
                    const packetCount = Math.floor(Math.random() * 3) + 1;
                    const packets = [];
                    
                    for (let j = 0; j < packetCount; j++) {
                        const packetGeo = new THREE.SphereGeometry(0.05, 8, 8);
                        const packetMaterial = new THREE.MeshBasicMaterial({
                            color: 0x00ffff,
                            transparent: true,
                            opacity: 0.8
                        });
                        const packet = new THREE.Mesh(packetGeo, packetMaterial);
                        
                        // Random position along link
                        const pos = Math.random();
                        packet.position.copy(
                            sat.position.clone().lerp(link.satellite.position, pos)
                        );
                        
                        // Animation data
                        packet.userData = {
                            position: pos,
                            speed: 0.005 + Math.random() * 0.01,
                            direction: Math.random() > 0.5 ? 1 : -1
                        };
                        
                        satelliteGroup.add(packet);
                        packets.push(packet);
                    }
                    
                    // Link material varies based on orbit
                    const linkMaterial = new THREE.LineBasicMaterial({
                        color: sat.userData.orbit === link.satellite.userData.orbit ? 
                               0x00ffff : 0xff00ff,
                        transparent: true,
                        opacity: 0.5
                    });
                    
                    const linkLine = new THREE.Line(linkGeo, linkMaterial);
                    linkLine.userData = {
                        from: sat,
                        to: link.satellite,
                        packets: packets
                    };
                    
                    satelliteGroup.add(linkLine);
                    interSatLinks.push(linkLine);
                }
            }
        });
    }

    // Stars background
    const starsGeo = new THREE.BufferGeometry();
    const starsMaterial = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 0.1
    });
    
    const starsVertices = [];
    for (let i = 0; i < 10000; i++) {
        const x = (Math.random() - 0.5) * 2000;
        const y = (Math.random() - 0.5) * 2000;
        const z = (Math.random() - 0.5) * 2000;
        starsVertices.push(x, y, z);
    }
    
    starsGeo.setAttribute('position', new THREE.Float32BufferAttribute(starsVertices, 3));
    const stars = new THREE.Points(starsGeo, starsMaterial);
    scene.add(stars);

    // Data visualization - coverage areas
    const coverageGroup = new THREE.Group();
    scene.add(coverageGroup);
    
    for (let i = 0; i < 10; i++) {
        const lat = (Math.random() - 0.5) * Math.PI;
        const long = Math.random() * Math.PI * 2;
        
        const radius = 10.2; // Just above Earth surface
        
        const x = Math.cos(lat) * Math.cos(long) * radius;
        const y = Math.sin(lat) * radius;
        const z = Math.cos(lat) * Math.sin(long) * radius;
        
        // Coverage area
        const coverageGeo = new THREE.CircleGeometry(1 + Math.random(), 16);
        const coverageMaterial = new THREE.MeshBasicMaterial({
            color: 0x00ffff,
            transparent: true,
            opacity: 0.2,
            side: THREE.DoubleSide
        });
        
        const coverage = new THREE.Mesh(coverageGeo, coverageMaterial);
        coverage.position.set(x, y, z);
        
        // Orient to face outward
        coverage.lookAt(0, 0, 0);
        coverage.rotateY(Math.PI);
        
        // Animation data
        coverage.userData = {
            pulseRate: 0.5 + Math.random() * 0.5
        };
        
        coverageGroup.add(coverage);
    }

    // Initial link update
    updateSatelliteLinks();

    // Window resize handler
    window.addEventListener('resize', () => {
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    });

    // Animation loop
    function animate() {
        requestAnimationFrame(animate);
        
        // Rotate Earth
        earth.rotation.y += 0.001;
        clouds.rotation.y += 0.0012;
        
        // Move satellites in orbit
        satelliteBodies.forEach(sat => {
            sat.userData.angle += sat.userData.speed;
            
            const inclination = sat.userData.inclination;
            const radius = sat.userData.radius;
            
            sat.position.x = Math.cos(sat.userData.angle) * radius;
            sat.position.y = Math.sin(inclination * Math.PI) * radius;
            sat.position.z = Math.sin(sat.userData.angle) * radius;
            
            // Orient satellite to face Earth
            sat.lookAt(0, 0, 0);
            
            // AI module pulsing
            sat.children.forEach(child => {
                if (child.material && child.material.emissive) {
                    child.material.emissiveIntensity = 
                        0.3 + 0.2 * Math.sin(Date.now() * 0.002 + sat.userData.angle * 5);
                }
            });
        });
        
        // Update links between satellites
        if (Math.floor(Date.now() / 1000) % 3 === 0) {
            updateSatelliteLinks();
        }
        
        // Update link geometries
        interSatLinks.forEach(link => {
            const points = [
                link.userData.from.position.clone(),
                link.userData.to.position.clone()
            ];
            link.geometry.setFromPoints(points);
            
            // Update data packets along link
            link.userData.packets.forEach(packet => {
                // Move packet along link
                packet.userData.position += packet.userData.speed * packet.userData.direction;
                
                // Reverse direction at endpoints
                if (packet.userData.position > 1) {
                    packet.userData.position = 1;
                    packet.userData.direction = -1;
                } else if (packet.userData.position < 0) {
                    packet.userData.position = 0;
                    packet.userData.direction = 1;
                }
                
                // Update position
                packet.position.copy(
                    link.userData.from.position.clone().lerp(
                        link.userData.to.position, 
                        packet.userData.position
                    )
                );
            });
        });
        
        // Animate coverage areas
        coverageGroup.children.forEach(coverage => {
            const scale = 1 + 0.2 * Math.sin(Date.now() * 0.001 * coverage.userData.pulseRate);
            coverage.scale.set(scale, scale, scale);
            coverage.material.opacity = 0.1 + 0.1 * Math.sin(Date.now() * 0.001 * coverage.userData.pulseRate);
        });
        
        // Slowly rotate camera around
        camera.position.x = 35 * Math.cos(Date.now() * 0.0001);
        camera.position.z = 35 * Math.sin(Date.now() * 0.0001);
        camera.lookAt(0, 0, 0);
        
        renderer.render(scene, camera);
    }
    
    animate();
}