// Simplified and robust script for Hyperblue website - LAN Version
// This version focuses on core functionality with minimal dependencies for local network use

document.addEventListener('DOMContentLoaded', function() {
    console.log('Hyperblue LAN website initializing...');
    
    // --- Basic UI functionality ---
    setupNavigation();
    setupScrollAnimations();
    
    // Check if THREE.js is available before attempting to create 3D scenes
    if (typeof THREE !== 'undefined') {
        try {
            // --- Create 3D scenes ---
            setupHeroScene();
            setupEarthGlobe();
            setupKronosEngine();
            setupRocketModel();
            setupSatelliteConstellation();
            setupRDModelScene(); // New R&D visualization
            console.log('All 3D scenes initialized successfully');
        } catch (error) {
            console.error('Error initializing 3D scenes:', error);
            setupFallbackStyles();
        }
    } else {
        console.warn('THREE.js not available - using fallback styles');
        setupFallbackStyles();
    }
    
    console.log('All initializations complete');
});

// ----- UI FUNCTIONS -----

function setupNavigation() {
    // Mobile menu toggle
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
        });
        
        // Close menu when clicking links
        document.querySelectorAll('.nav-menu a').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
            });
        });
    }
    
    // Navbar background on scroll
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 100) {
                navbar.style.background = 'rgba(0, 0, 0, 0.5)';
                navbar.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.2)';
            } else {
                navbar.style.background = 'rgba(0, 0, 0, 0.1)';
                navbar.style.boxShadow = 'none';
            }
        });
    }
    
    // Button actions
    document.querySelectorAll('.hero-buttons .btn').forEach(btn => {
        btn.addEventListener('click', function() {
            if (this.textContent.includes('Explore R&D')) {
                document.querySelector('#rd')?.scrollIntoView({ behavior: 'smooth' });
            } else if (this.textContent.includes('Our Vision')) {
                document.querySelector('#mission')?.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
}

function setupScrollAnimations() {
    // Simple reveal animations on scroll
    const sections = document.querySelectorAll('.section');
    
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
    });
    
    function checkSections() {
        sections.forEach(section => {
            const rect = section.getBoundingClientRect();
            const isVisible = (
                rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 0.8 &&
                rect.bottom >= 0
            );
            
            if (isVisible) {
                section.style.opacity = '1';
                section.style.transform = 'translateY(0)';
            }
        });
    }
    
    // Check initially and on scroll
    checkSections();
    window.addEventListener('scroll', checkSections);
}

// ----- 3D SCENE FUNCTIONS -----

function setupHeroScene() {
    console.log('Setting up hero scene...');
    const canvas = document.getElementById('hero-canvas');
    if (!canvas) {
        console.error('Hero canvas not found');
        return;
    }
    
    try {
        // Simple star field setup
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.z = 5;
        
        const renderer = new THREE.WebGLRenderer({ 
            canvas: canvas,
            antialias: true,
            alpha: true 
        });
        renderer.setSize(window.innerWidth, window.innerHeight);
        
        // Create stars
        const starsGeometry = new THREE.BufferGeometry();
        const starsMaterial = new THREE.PointsMaterial({
            color: 0xffffff,
            size: 0.5
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
        
        // Handle window resize
        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        });
        
        // Animation loop
        function animate() {
            requestAnimationFrame(animate);
            stars.rotation.y += 0.0002;
            renderer.render(scene, camera);
        }
        
        animate();
        console.log('Hero scene setup complete');
    } catch (error) {
        console.error('Error setting up hero scene:', error);
        // Add fallback background if 3D fails
        canvas.style.background = 'linear-gradient(to bottom, #000510, #001030)';
    }
}

function setupEarthGlobe() {
    console.log('Setting up Earth globe...');
    const canvas = document.getElementById('earth-canvas');
    if (!canvas) {
        console.error('Earth canvas not found');
        return;
    }
    
    try {
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
        camera.position.z = 4;
        
        const renderer = new THREE.WebGLRenderer({ 
            canvas: canvas,
            antialias: true,
            alpha: true 
        });
        renderer.setSize(canvas.clientWidth, canvas.clientHeight);
        
        // Simple Earth
        const earthGeometry = new THREE.SphereGeometry(1.5, 32, 32);
        const earthMaterial = new THREE.MeshBasicMaterial({
            color: 0x2244aa
        });
        const earth = new THREE.Mesh(earthGeometry, earthMaterial);
        scene.add(earth);
        
        // Simple clouds
        const cloudGeometry = new THREE.SphereGeometry(1.55, 32, 32);
        const cloudMaterial = new THREE.MeshBasicMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 0.3
        });
        const clouds = new THREE.Mesh(cloudGeometry, cloudMaterial);
        scene.add(clouds);
        
        // Resize handler
        window.addEventListener('resize', () => {
            camera.aspect = canvas.clientWidth / canvas.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(canvas.clientWidth, canvas.clientHeight);
        });
        
        // Animation
        function animate() {
            requestAnimationFrame(animate);
            earth.rotation.y += 0.002;
            clouds.rotation.y += 0.0025;
            renderer.render(scene, camera);
        }
        
        animate();
        console.log('Earth globe setup complete');
    } catch (error) {
        console.error('Error setting up Earth globe:', error);
        // Add fallback content if 3D fails
        canvas.style.background = 'radial-gradient(circle, #0055aa, #002244)';
    }
}

function setupKronosEngine() {
    console.log('Setting up Kronos engine...');
    const canvas = document.getElementById('engine-canvas');
    if (!canvas) {
        console.error('Engine canvas not found');
        return;
    }
    
    try {
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x000000);
        
        const camera = new THREE.PerspectiveCamera(60, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
        camera.position.set(0, 0, 7);
        
        const renderer = new THREE.WebGLRenderer({
            canvas: canvas,
            antialias: true
        });
        renderer.setSize(canvas.clientWidth, canvas.clientHeight);
        
        // Lighting
        const ambientLight = new THREE.AmbientLight(0x333333);
        scene.add(ambientLight);
        
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(5, 3, 5);
        scene.add(directionalLight);
        
        // Engine group
        const engineGroup = new THREE.Group();
        scene.add(engineGroup);
        
        // Engine parts with simple geometry
        // Main body
        const mainBody = new THREE.Mesh(
            new THREE.CylinderGeometry(1, 1.2, 3, 32),
            new THREE.MeshPhongMaterial({ color: 0x888888, shininess: 70 })
        );
        engineGroup.add(mainBody);
        
        // Nozzle
        const nozzle = new THREE.Mesh(
            new THREE.CylinderGeometry(1.2, 0.6, 2, 32, 1, true),
            new THREE.MeshPhongMaterial({ color: 0x666666, shininess: 100 })
        );
        nozzle.position.y = -2.5;
        engineGroup.add(nozzle);
        
        // Upper section
        const upperSection = new THREE.Mesh(
            new THREE.CylinderGeometry(0.8, 1, 1, 32),
            new THREE.MeshPhongMaterial({ color: 0x999999, shininess: 70 })
        );
        upperSection.position.y = 2;
        engineGroup.add(upperSection);
        
        // Add cooling rings to the engine
        const coolingRingGeo = new THREE.TorusGeometry(1.1, 0.06, 16, 36);
        const coolantMaterial = new THREE.MeshPhongMaterial({ 
            color: 0x00ccff, 
            shininess: 90,
            emissive: 0x003366,
            emissiveIntensity: 0.5
        });
        
        // Add multiple cooling rings
        for (let i = 0; i < 5; i++) {
            const coolingRing = new THREE.Mesh(coolingRingGeo, coolantMaterial);
            coolingRing.rotation.x = Math.PI / 2;
            coolingRing.position.y = -0.8 + (i * 0.3);
            engineGroup.add(coolingRing);
        }
        
        // Flame effect
        const flame = new THREE.Mesh(
            new THREE.ConeGeometry(0.6, 3, 32, 1, true),
            new THREE.MeshBasicMaterial({ 
                color: 0xff6600, 
                transparent: true, 
                opacity: 0.7 
            })
        );
        flame.position.y = -4;
        flame.rotation.x = Math.PI;
        engineGroup.add(flame);
        
        // Resize handler
        window.addEventListener('resize', () => {
            camera.aspect = canvas.clientWidth / canvas.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(canvas.clientWidth, canvas.clientHeight);
        });
        
        // Animation
        function animate() {
            requestAnimationFrame(animate);
            
            engineGroup.rotation.y += 0.01;
            
            // Animate flame
            flame.scale.x = 0.9 + Math.sin(Date.now() * 0.01) * 0.2;
            flame.scale.z = 0.9 + Math.cos(Date.now() * 0.01) * 0.2;
            
            // Animate cooling rings
            engineGroup.children.forEach(child => {
                if (child.geometry && child.geometry.type === 'TorusGeometry') {
                    // Pulse the emissive intensity to simulate heat exchange
                    if (child.material && child.material.emissiveIntensity) {
                        child.material.emissiveIntensity = 0.3 + Math.sin(Date.now() * 0.003 + child.position.y) * 0.3;
                    }
                }
            });
            
            renderer.render(scene, camera);
        }
        
        animate();
        console.log('Kronos engine setup complete');
    } catch (error) {
        console.error('Error setting up Kronos engine:', error);
        canvas.style.background = 'linear-gradient(to bottom, #000000, #220000)';
    }
}

function setupRocketModel() {
    console.log('Setting up rocket model...');
    const canvas = document.getElementById('rocket-canvas');
    if (!canvas) {
        console.error('Rocket canvas not found');
        return;
    }
    
    try {
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x000000);
        
        const camera = new THREE.PerspectiveCamera(60, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
        camera.position.set(0, 0, 15);
        
        const renderer = new THREE.WebGLRenderer({
            canvas: canvas,
            antialias: true
        });
        renderer.setSize(canvas.clientWidth, canvas.clientHeight);
        
        // Lighting
        const ambientLight = new THREE.AmbientLight(0x333333);
        scene.add(ambientLight);
        
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(5, 3, 5);
        scene.add(directionalLight);
        
        // Rocket group
        const rocketGroup = new THREE.Group();
        scene.add(rocketGroup);
        
        // First stage
        const firstStage = new THREE.Mesh(
            new THREE.CylinderGeometry(1, 1.2, 8, 32),
            new THREE.MeshPhongMaterial({ color: 0xeeeeee, shininess: 50 })
        );
        firstStage.position.y = -3;
        rocketGroup.add(firstStage);
        
        // Second stage
        const secondStage = new THREE.Mesh(
            new THREE.CylinderGeometry(0.8, 1, 4, 32),
            new THREE.MeshPhongMaterial({ color: 0xdddddd, shininess: 50 })
        );
        secondStage.position.y = 3;
        rocketGroup.add(secondStage);
        
        // Nose cone
        const noseCone = new THREE.Mesh(
            new THREE.ConeGeometry(0.8, 3, 32),
            new THREE.MeshPhongMaterial({ color: 0xffffff, shininess: 70 })
        );
        noseCone.position.y = 6.5;
        rocketGroup.add(noseCone);
        
        // Add engines
        for (let i = 0; i < 5; i++) {
            const angle = (i / 5) * Math.PI * 2;
            const radius = 0.7;
            
            const engine = new THREE.Mesh(
                new THREE.CylinderGeometry(0.2, 0.1, 0.5, 16),
                new THREE.MeshPhongMaterial({ color: 0x555555, shininess: 100 })
            );
            
            engine.position.set(
                Math.cos(angle) * radius,
                -7.2,
                Math.sin(angle) * radius
            );
            
            rocketGroup.add(engine);
            
            // Add flame
            const flame = new THREE.Mesh(
                new THREE.ConeGeometry(0.1, 1, 16, 1, true),
                new THREE.MeshBasicMaterial({ 
                    color: 0xff6600, 
                    transparent: true, 
                    opacity: 0.7 
                })
            );
            flame.position.y = -0.7;
            flame.rotation.x = Math.PI;
            engine.add(flame);
        }
        
        // Resize handler
        window.addEventListener('resize', () => {
            camera.aspect = canvas.clientWidth / canvas.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(canvas.clientWidth, canvas.clientHeight);
        });
        
        // Animation
        function animate() {
            requestAnimationFrame(animate);
            
            rocketGroup.rotation.y += 0.005;
            
            // Animate flames
            rocketGroup.traverse((child) => {
                if (child.geometry && child.geometry.type === 'ConeGeometry' && 
                    child.material && child.material.opacity && child.position.y < 0) {
                    child.scale.x = 0.9 + Math.sin(Date.now() * 0.01) * 0.2;
                    child.scale.z = 0.9 + Math.cos(Date.now() * 0.01) * 0.2;
                }
            });
            
            renderer.render(scene, camera);
        }
        
        animate();
        console.log('Rocket model setup complete');
    } catch (error) {
        console.error('Error setting up rocket model:', error);
        canvas.style.background = 'linear-gradient(to bottom, #000000, #001030)';
    }
}

function setupSatelliteConstellation() {
    console.log('Setting up satellite constellation...');
    const canvas = document.getElementById('satellite-canvas');
    if (!canvas) {
        console.error('Satellite canvas not found');
        return;
    }
    
    try {
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x000000);
        
        const camera = new THREE.PerspectiveCamera(60, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
        camera.position.set(0, 15, 25);
        camera.lookAt(0, 0, 0);
        
        const renderer = new THREE.WebGLRenderer({
            canvas: canvas,
            antialias: true
        });
        renderer.setSize(canvas.clientWidth, canvas.clientHeight);
        
        // Lighting
        const ambientLight = new THREE.AmbientLight(0x222222);
        scene.add(ambientLight);
        
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(5, 3, 5);
        scene.add(directionalLight);
        
        // Earth
        const earth = new THREE.Mesh(
            new THREE.SphereGeometry(5, 32, 32),
            new THREE.MeshPhongMaterial({ 
                color: 0x0055aa, 
                shininess: 25,
                emissive: 0x001133,
                emissiveIntensity: 0.2
            })
        );
        scene.add(earth);
        
        // Create satellite constellations
        const satellites = [];
        const orbitRadii = [8, 10, 12, 14];
        
        orbitRadii.forEach((radius, index) => {
            // Create orbit line
            const orbitLine = new THREE.Line(
                new THREE.CircleGeometry(radius, 64),
                new THREE.LineBasicMaterial({ 
                    color: 0x0088ff, 
                    transparent: true,
                    opacity: 0.3
                })
            );
            orbitLine.rotation.x = Math.PI / 2;
            scene.add(orbitLine);
            
            // Add satellites to orbit
            const satCount = 3 + index;
            for (let i = 0; i < satCount; i++) {
                const angle = (i / satCount) * Math.PI * 2;
                
                // Simple satellite
                const satellite = new THREE.Group();
                
                // Main body
                const body = new THREE.Mesh(
                    new THREE.BoxGeometry(0.5, 0.2, 0.8),
                    new THREE.MeshPhongMaterial({ color: 0xdddddd, shininess: 80 })
                );
                satellite.add(body);
                
                // Solar panels
                const leftPanel = new THREE.Mesh(
                    new THREE.BoxGeometry(1.2, 0.05, 0.4),
                    new THREE.MeshPhongMaterial({ color: 0x2244aa, shininess: 70 })
                );
                leftPanel.position.x = -0.85;
                satellite.add(leftPanel);
                
                const rightPanel = new THREE.Mesh(
                    new THREE.BoxGeometry(1.2, 0.05, 0.4),
                    new THREE.MeshPhongMaterial({ color: 0x2244aa, shininess: 70 })
                );
                rightPanel.position.x = 0.85;
                satellite.add(rightPanel);
                
                // Position satellite
                const x = Math.cos(angle) * radius;
                const z = Math.sin(angle) * radius;
                satellite.position.set(x, 0, z);
                
                // Look at center
                satellite.lookAt(0, 0, 0);
                
                // Store orbit data
                satellite.userData = {
                    angle: angle,
                    radius: radius,
                    speed: 0.002 - (index * 0.0003)
                };
                
                scene.add(satellite);
                satellites.push(satellite);
            }
        });
        
        // Resize handler
        window.addEventListener('resize', () => {
            camera.aspect = canvas.clientWidth / canvas.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(canvas.clientWidth, canvas.clientHeight);
        });
        
        // Animation
        function animate() {
            requestAnimationFrame(animate);
            
            // Rotate Earth
            earth.rotation.y += 0.001;
            
            // Move satellites
            satellites.forEach(satellite => {
                satellite.userData.angle += satellite.userData.speed;
                
                // Update position
                satellite.position.x = Math.cos(satellite.userData.angle) * satellite.userData.radius;
                satellite.position.z = Math.sin(satellite.userData.angle) * satellite.userData.radius;
                
                // Look at center
                satellite.lookAt(0, 0, 0);
            });
            
            renderer.render(scene, camera);
        }
        
        animate();
        console.log('Satellite constellation setup complete');
    } catch (error) {
        console.error('Error setting up satellite constellation:', error);
        canvas.style.background = 'linear-gradient(to bottom, #000510, #001030)';
    }
}

// Fallback styles when 3D rendering isn't available
function setupFallbackStyles() {
    console.log('Setting up fallback styles for 3D elements');
    
    // Apply gradient backgrounds to all canvas elements
    const canvasElements = [
        { id: 'hero-canvas', style: 'linear-gradient(to bottom, #000510, #001030)' },
        { id: 'earth-canvas', style: 'radial-gradient(circle, #0055aa, #002244)' },
        { id: 'engine-canvas', style: 'linear-gradient(to bottom, #000000, #220000)' },
        { id: 'rocket-canvas', style: 'linear-gradient(to bottom, #000000, #001030)' },
        { id: 'satellite-canvas', style: 'linear-gradient(to bottom, #000510, #001030)' },
        { id: 'rd-model-canvas', style: 'linear-gradient(135deg, #001030, #000510)' }
    ];
    
    canvasElements.forEach(element => {
        const canvas = document.getElementById(element.id);
        if (canvas) {
            canvas.style.background = element.style;
        }
    });
    
    // Add some subtle animations to sections to compensate for missing 3D
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        section.style.transition = 'transform 0.5s ease, opacity 0.5s ease';
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
    });
    
    // Show sections on scroll
    window.addEventListener('scroll', function() {
        sections.forEach(section => {
            const position = section.getBoundingClientRect().top;
            const screenPosition = window.innerHeight / 1.3;
            
            if (position < screenPosition) {
                section.style.opacity = '1';
                section.style.transform = 'translateY(0)';
            }
        });
    });
    
    // Trigger initial check
    window.dispatchEvent(new Event('scroll'));
}

// Create R&D model scene with orbital simulation and data flow visualization
function setupRDModelScene() {
    console.log('Setting up R&D model scene...');
    const canvas = document.getElementById('rd-model-canvas');
    if (!canvas) {
        console.error('R&D model canvas not found');
        return;
    }
    
    try {
        const scene = new THREE.Scene();
        
        const camera = new THREE.PerspectiveCamera(60, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
        camera.position.set(0, 15, 30);
        camera.lookAt(0, 0, 0);
        
        const renderer = new THREE.WebGLRenderer({
            canvas: canvas,
            antialias: true,
            alpha: true
        });
        renderer.setSize(canvas.clientWidth, canvas.clientHeight);
        
        // Lighting
        const ambientLight = new THREE.AmbientLight(0x222244, 0.5);
        scene.add(ambientLight);
        
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(5, 10, 5);
        scene.add(directionalLight);
        
        const blueLight = new THREE.PointLight(0x0088ff, 2, 30);
        blueLight.position.set(-10, 5, 10);
        scene.add(blueLight);
        
        // Create a central data hub
        const hubGroup = new THREE.Group();
        scene.add(hubGroup);
        
        // Central sphere representing the main data core
        const hubCore = new THREE.Mesh(
            new THREE.SphereGeometry(3, 32, 32),
            new THREE.MeshPhongMaterial({
                color: 0x0066cc,
                emissive: 0x003366,
                emissiveIntensity: 0.5,
                shininess: 90
            })
        );
        hubGroup.add(hubCore);
        
        // Create orbiting data nodes
        const nodeCount = 7;
        const nodePaths = [];
        const nodes = [];
        
        for (let i = 0; i < nodeCount; i++) {
            // Create path
            const pathRadius = 6 + i * 1.2;
            const pathSegments = 64;
            const pathGeometry = new THREE.BufferGeometry();
            const pathVertices = [];
            
            for (let j = 0; j <= pathSegments; j++) {
                const angle = (j / pathSegments) * Math.PI * 2;
                const x = Math.cos(angle) * pathRadius;
                const z = Math.sin(angle) * pathRadius;
                pathVertices.push(new THREE.Vector3(x, 0, z));
            }
            
            pathGeometry.setFromPoints(pathVertices);
            
            const pathMaterial = new THREE.LineBasicMaterial({
                color: 0x3399ff,
                transparent: true,
                opacity: 0.3
            });
            
            const path = new THREE.Line(pathGeometry, pathMaterial);
            path.rotation.x = Math.PI / 4;
            path.rotation.y = Math.random() * Math.PI / 4;
            scene.add(path);
            nodePaths.push(path);
            
            // Create node
            const nodeSize = 0.6 - (i * 0.05);
            const nodeGeometry = new THREE.SphereGeometry(nodeSize, 16, 16);
            const nodeMaterial = new THREE.MeshPhongMaterial({
                color: i % 2 === 0 ? 0x66aaff : 0x0088cc,
                emissive: i % 2 === 0 ? 0x003366 : 0x001133,
                emissiveIntensity: 0.5,
                shininess: 80
            });
            
            const node = new THREE.Mesh(nodeGeometry, nodeMaterial);
            
            // Position node on path
            const angle = Math.random() * Math.PI * 2;
            const pathVector = new THREE.Vector3();
            pathVector.x = Math.cos(angle) * pathRadius;
            pathVector.z = Math.sin(angle) * pathRadius;
            pathVector.applyAxisAngle(new THREE.Vector3(1, 0, 0), Math.PI / 4);
            pathVector.applyAxisAngle(new THREE.Vector3(0, 1, 0), path.rotation.y);
            
            node.position.copy(pathVector);
            node.userData = {
                angle: angle,
                radius: pathRadius,
                speed: 0.002 - (i * 0.0001),
                pathRotationX: Math.PI / 4,
                pathRotationY: path.rotation.y
            };
            
            scene.add(node);
            nodes.push(node);
            
            // Add connection line to the central hub
            const connectionGeometry = new THREE.BufferGeometry().setFromPoints([
                new THREE.Vector3(0, 0, 0),
                node.position
            ]);
            
            const connectionMaterial = new THREE.LineBasicMaterial({
                color: 0x00aaff,
                transparent: true,
                opacity: 0.4
            });
            
            const connection = new THREE.Line(connectionGeometry, connectionMaterial);
            node.userData.connection = connection;
            scene.add(connection);
            
            // Add data packet traveling from node to center
            if (i % 2 === 0) {
                const packetGeometry = new THREE.BoxGeometry(0.3, 0.3, 0.3);
                const packetMaterial = new THREE.MeshPhongMaterial({
                    color: 0x00ffff,
                    emissive: 0x00aaaa,
                    emissiveIntensity: 0.7,
                    transparent: true,
                    opacity: 0.9
                });
                
                const packet = new THREE.Mesh(packetGeometry, packetMaterial);
                
                // Place packet somewhere on the connection line
                const packetProgress = Math.random();
                packet.position.lerpVectors(
                    new THREE.Vector3(0, 0, 0),
                    node.position,
                    packetProgress
                );
                
                packet.userData = {
                    progress: packetProgress,
                    speed: 0.01 + Math.random() * 0.01,
                    node: node
                };
                
                scene.add(packet);
                node.userData.packet = packet;
            }
        }
        
        // Create data visualization grid on the floor
        const gridSize = 20;
        const gridGeometry = new THREE.PlaneGeometry(gridSize, gridSize, 20, 20);
        const gridMaterial = new THREE.MeshPhongMaterial({
            color: 0x001133,
            emissive: 0x001133,
            emissiveIntensity: 0.2,
            transparent: true,
            opacity: 0.7,
            wireframe: true
        });
        
        const grid = new THREE.Mesh(gridGeometry, gridMaterial);
        grid.rotation.x = -Math.PI / 2;
        grid.position.y = -5;
        scene.add(grid);
        
        // Resize handler
        window.addEventListener('resize', () => {
            camera.aspect = canvas.clientWidth / canvas.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(canvas.clientWidth, canvas.clientHeight);
        });
        
        // Animation
        function animate() {
            requestAnimationFrame(animate);
            
            // Rotate the hub
            hubCore.rotation.y += 0.01;
            
            // Animate grid vertices
            const gridVertices = grid.geometry.attributes.position.array;
            const time = Date.now() * 0.001;
            
            for (let i = 0; i < gridVertices.length; i += 3) {
                // Skip boundary vertices
                const x = gridVertices[i];
                const z = gridVertices[i + 2];
                
                if (Math.abs(x) < gridSize / 2 - 1 && Math.abs(z) < gridSize / 2 - 1) {
                    gridVertices[i + 1] = Math.sin(time + x + z) * 0.5;
                }
            }
            grid.geometry.attributes.position.needsUpdate = true;
            
            // Animate nodes
            nodes.forEach((node) => {
                // Move node along its path
                node.userData.angle += node.userData.speed;
                
                // Calculate new position
                const pathVector = new THREE.Vector3();
                pathVector.x = Math.cos(node.userData.angle) * node.userData.radius;
                pathVector.z = Math.sin(node.userData.angle) * node.userData.radius;
                pathVector.applyAxisAngle(new THREE.Vector3(1, 0, 0), node.userData.pathRotationX);
                pathVector.applyAxisAngle(new THREE.Vector3(0, 1, 0), node.userData.pathRotationY);
                
                node.position.copy(pathVector);
                
                // Update connection line
                if (node.userData.connection) {
                    node.userData.connection.geometry.setFromPoints([
                        new THREE.Vector3(0, 0, 0),
                        node.position
                    ]);
                }
                
                // Animate data packet
                if (node.userData.packet) {
                    const packet = node.userData.packet;
                    packet.userData.progress += packet.userData.speed;
                    
                    // Reset when reaching center
                    if (packet.userData.progress >= 1) {
                        packet.userData.progress = 0;
                    }
                    
                    // Update packet position
                    packet.position.lerpVectors(
                        new THREE.Vector3(0, 0, 0),
                        node.position,
                        1 - packet.userData.progress
                    );
                    
                    // Rotate packet
                    packet.rotation.x += 0.05;
                    packet.rotation.y += 0.05;
                }
            });
            
            // Animate lights
            blueLight.intensity = 1.5 + Math.sin(Date.now() * 0.001) * 0.5;
            
            renderer.render(scene, camera);
        }
        
        animate();
        console.log('R&D model scene setup complete');
    } catch (error) {
        console.error('Error setting up R&D model scene:', error);
        canvas.style.background = 'linear-gradient(135deg, #001030, #000510)';
    }
}
