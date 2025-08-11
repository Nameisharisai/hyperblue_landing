// Fixed combined script for Hyperblue website
// This combines the essential functions from both script.js and enhanced-3d-models.js
// to ensure proper loading of all 3D elements

// Wait for DOM content to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded - initializing Hyperblue website');
    
    // --- NAVIGATION AND UI SETUP ---
    
    // Mobile navigation toggle
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
        });

        // Close mobile menu when clicking on a link
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

    // --- SECTION ANIMATIONS ---

    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
                console.log(`Section animated: ${entry.target.id || 'unnamed section'}`);
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

    // --- 3D SCENES INITIALIZATION ---
    
    console.log('Initializing 3D scenes...');
    
    // Initialize hero scene first (most visible)
    initHeroScene();
    
    // Initialize Earth Globe for mission section
    initEarthGlobe();
    
    // Initialize enhanced 3D models
    console.log('Initializing enhanced 3D models...');
    initEnhancedKronosEngine();
    initEnhancedNebula1Rocket();
    initEnhancedSatellites();
});

// --- UTILITY FUNCTIONS ---

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
    
    // Add to DOM
    document.body.appendChild(notification);
    
    // Animation
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 10);
    
    // Close button
    const closeButton = notification.querySelector('.notification-close');
    if (closeButton) {
        closeButton.addEventListener('click', () => {
            closeNotification(notification);
        });
    }
    
    // Auto close after 5 seconds
    setTimeout(() => {
        closeNotification(notification);
    }, 5000);
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

// Check if element is in viewport
function isElementInViewport(el) {
    const rect = el.getBoundingClientRect();
    
    return (
        rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 0.8 &&
        rect.bottom >= 0
    );
}

// --- 3D SCENE IMPLEMENTATIONS ---

// Hero Scene with Stars and Nebula
function initHeroScene() {
    console.log('Initializing hero scene...');
    const canvas = document.getElementById('hero-canvas');
    if (!canvas) {
        console.error('Hero canvas not found in DOM');
        return;
    }

    try {
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
        const textureLoader = new THREE.TextureLoader();
        textureLoader.load('./img/nebula_texture.jpg', 
            function(nebulaTexture) {
                const nebulaGeometry = new THREE.SphereGeometry(800, 32, 32);
                const nebulaMaterial = new THREE.MeshBasicMaterial({
                    map: nebulaTexture,
                    side: THREE.BackSide,
                    transparent: true,
                    opacity: 0.3
                });
                const nebula = new THREE.Mesh(nebulaGeometry, nebulaMaterial);
                scene.add(nebula);
                
                // Store in animation loop
                animate(stars, nebula);
            },
            undefined,
            function(error) {
                console.error('Error loading nebula texture:', error);
                animate(stars, null);
            }
        );
        
        // Position camera
        camera.position.z = 5;
        
        // Handle window resize
        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        });
        
        // Animation loop
        function animate(stars, nebula) {
            requestAnimationFrame(() => animate(stars, nebula));
            
            stars.rotation.y += 0.0001;
            stars.rotation.z += 0.0001;
            
            if (nebula) {
                nebula.rotation.y += 0.0002;
            }
            
            renderer.render(scene, camera);
        }
        
        // Parallax effect on mouse move
        document.addEventListener('mousemove', (e) => {
            const mouseX = (e.clientX / window.innerWidth) * 2 - 1;
            const mouseY = (e.clientY / window.innerHeight) * 2 - 1;
            
            stars.rotation.x += mouseY * 0.0001;
            stars.rotation.y += mouseX * 0.0001;
        });
        
        console.log('Hero scene initialized successfully');
    } catch (error) {
        console.error('Error initializing hero scene:', error);
    }
}

// Earth Globe for Mission Section
function initEarthGlobe() {
    console.log('Initializing Earth globe...');
    const canvas = document.getElementById('earth-canvas');
    if (!canvas) {
        console.error('Earth canvas not found in DOM');
        return;
    }

    try {
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
        
        const renderer = new THREE.WebGLRenderer({ 
            canvas: canvas,
            antialias: true,
            alpha: true 
        });
        renderer.setSize(canvas.clientWidth, canvas.clientHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        
        // Add Earth with fallback
        const earthGeometry = new THREE.SphereGeometry(2, 32, 32);
        const earthMaterial = new THREE.MeshPhongMaterial({
            color: 0x2233aa,  // Default color if texture fails
            shininess: 15
        });
        const earth = new THREE.Mesh(earthGeometry, earthMaterial);
        scene.add(earth);
        
        // Add a simple cloud layer with fallback
        const cloudGeometry = new THREE.SphereGeometry(2.05, 32, 32);
        const cloudMaterial = new THREE.MeshPhongMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 0.4
        });
        const clouds = new THREE.Mesh(cloudGeometry, cloudMaterial);
        scene.add(clouds);
        
        // Add atmosphere glow
        const glowGeometry = new THREE.SphereGeometry(2.1, 32, 32);
        const glowMaterial = new THREE.MeshPhongMaterial({
            color: 0x0077ff,
            transparent: true,
            opacity: 0.2,
            side: THREE.BackSide
        });
        const glow = new THREE.Mesh(glowGeometry, glowMaterial);
        scene.add(glow);
        
        // Add lights
        const ambientLight = new THREE.AmbientLight(0x555555);
        scene.add(ambientLight);
        
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(5, 3, 5);
        scene.add(directionalLight);
        
        // Position camera
        camera.position.z = 5;
        
        // Load textures after scene setup
        const textureLoader = new THREE.TextureLoader();
        
        // Earth texture
        textureLoader.load('./img/earth_atmos_2048.jpg', 
            function(texture) {
                earthMaterial.map = texture;
                earthMaterial.needsUpdate = true;
                console.log('Earth texture loaded successfully');
            },
            undefined,
            function(error) {
                console.error('Error loading earth texture:', error);
            }
        );
        
        // Earth normal map
        textureLoader.load('./img/earth_normal_2048.jpg', 
            function(texture) {
                earthMaterial.bumpMap = texture;
                earthMaterial.bumpScale = 0.05;
                earthMaterial.needsUpdate = true;
                console.log('Earth normal map loaded successfully');
            },
            undefined,
            function(error) {
                console.error('Error loading earth normal map:', error);
            }
        );
        
        // Cloud texture
        textureLoader.load('./img/earth_clouds_2048.jpg', 
            function(texture) {
                cloudMaterial.map = texture;
                cloudMaterial.needsUpdate = true;
                console.log('Cloud texture loaded successfully');
            },
            undefined,
            function(error) {
                console.error('Error loading cloud texture:', error);
            }
        );
        
        // Handle window resize
        window.addEventListener('resize', () => {
            camera.aspect = canvas.clientWidth / canvas.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(canvas.clientWidth, canvas.clientHeight);
        });
        
        // Animation loop
        function animate() {
            requestAnimationFrame(animate);
            
            earth.rotation.y += 0.002;
            clouds.rotation.y += 0.0025;
            
            renderer.render(scene, camera);
        }
        
        animate();
        console.log('Earth globe initialized successfully');
    } catch (error) {
        console.error('Error initializing Earth globe:', error);
    }
}

// Enhanced Kronos Engine with GLTF model
function initEnhancedKronosEngine() {
    console.log('Initializing enhanced Kronos engine...');
    const canvas = document.getElementById('engine-canvas');
    if (!canvas) {
        console.error('Engine canvas not found in DOM');
        return;
    }

    try {
        // Create scene
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x000000);
        scene.fog = new THREE.FogExp2(0x000815, 0.02);

        // Camera setup with better positioning for dramatic effect
        const camera = new THREE.PerspectiveCamera(60, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
        camera.position.set(5, 2, 8);
        camera.lookAt(0, 0, 0);

        // Enhanced renderer setup
        const renderer = new THREE.WebGLRenderer({
            canvas: canvas,
            antialias: true,
            alpha: true
        });
        renderer.setSize(canvas.clientWidth, canvas.clientHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        
        // Advanced studio lighting setup
        // Ambient hemisphere light (blue/orange gradient)
        const hemiLight = new THREE.HemisphereLight(0x0066ff, 0xff9900, 0.3);
        scene.add(hemiLight);

        // Base ambient light
        const ambientLight = new THREE.AmbientLight(0x111122, 0.4);
        scene.add(ambientLight);

        // Primary blue-tinted key light
        const keyLight = new THREE.DirectionalLight(0xccddff, 1.5);
        keyLight.position.set(7, 5, 7);
        keyLight.castShadow = true;
        keyLight.shadow.bias = -0.001;
        keyLight.shadow.mapSize.width = 2048;
        keyLight.shadow.mapSize.height = 2048;
        keyLight.shadow.camera.far = 50;
        scene.add(keyLight);

        // Orange fill light (simulates engine heat)
        const fillLight = new THREE.PointLight(0xff6600, 4, 25);
        fillLight.position.set(-4, -3, 4);
        fillLight.castShadow = true;
        fillLight.shadow.bias = -0.001;
        scene.add(fillLight);

        // Engine model container
        const engineGroup = new THREE.Group();
        scene.add(engineGroup);

        // Check if GLTFLoader is available
        if (typeof THREE.GLTFLoader === 'function') {
            console.log('GLTFLoader available, attempting to load model');
            
            // Create detailed fallback model immediately
            createDetailedEngineModel(engineGroup);
            
            // Try to load the GLTF model
            const loader = new THREE.GLTFLoader();
            loader.load(
                './img/kronos_engine.glb',
                function(gltf) {
                    // Clear the engineGroup to replace with loaded model
                    while(engineGroup.children.length > 0) {
                        engineGroup.remove(engineGroup.children[0]);
                    }
                    
                    const model = gltf.scene;
                    model.scale.set(5, 5, 5);
                    model.position.set(0, 0, 0);
                    model.traverse((node) => {
                        if (node.isMesh) {
                            node.castShadow = true;
                            node.receiveShadow = true;
                        }
                    });
                    engineGroup.add(model);
                    console.log('GLTF model loaded successfully');
                },
                function(xhr) {
                    console.log('Engine model: ' + (xhr.loaded / xhr.total * 100) + '% loaded');
                },
                function(error) {
                    console.error('Error loading engine model:', error);
                    // We already created the fallback model
                }
            );
        } else {
            console.warn('GLTFLoader not available, using fallback model');
            createDetailedEngineModel(engineGroup);
        }

        // Function to create a detailed engine model if GLTF loading fails
        function createDetailedEngineModel(group) {
            console.log('Creating detailed engine model fallback');
            
            // Advanced physically-based materials
            const titaniumMaterial = new THREE.MeshStandardMaterial({
                color: 0x8c8c8c,
                metalness: 0.9,
                roughness: 0.3
            });

            const copperMaterial = new THREE.MeshStandardMaterial({
                color: 0xca6533,
                metalness: 0.9,
                roughness: 0.2
            });

            const coolantMaterial = new THREE.MeshStandardMaterial({
                color: 0x00aaff,
                metalness: 0.9,
                roughness: 0.05,
                transparent: true,
                opacity: 0.6
            });

            // Create realistic nozzle bell shape
            const createNozzleBell = () => {
                const points = [];
                for (let i = 0; i <= 20; i++) {
                    const t = i / 20;
                    const x = 2 * Math.pow(Math.sin(t * Math.PI * 0.6), 0.5);
                    const y = -t * 4;
                    points.push(new THREE.Vector2(x, y));
                }
                return new THREE.LatheGeometry(points, 64);
            };

            // Main combustion chamber
            const chamber = new THREE.Mesh(
                new THREE.CylinderGeometry(1.5, 1.8, 3, 64, 4),
                titaniumMaterial
            );
            chamber.castShadow = true;
            chamber.receiveShadow = true;
            chamber.position.y = 1;
            group.add(chamber);

            // Upper fuel delivery system
            const upperSystem = new THREE.Mesh(
                new THREE.CylinderGeometry(1.2, 1.5, 1.5, 64),
                titaniumMaterial
            );
            upperSystem.castShadow = true;
            upperSystem.receiveShadow = true;
            upperSystem.position.y = 3.25;
            group.add(upperSystem);

            // Fuel injector plate
            const injectorPlate = new THREE.Mesh(
                new THREE.CylinderGeometry(1.2, 1.2, 0.2, 64),
                copperMaterial
            );
            injectorPlate.position.y = 2.4;
            group.add(injectorPlate);

            // Engine nozzle with realistic bell shape
            const nozzle = new THREE.Mesh(createNozzleBell(), titaniumMaterial);
            nozzle.position.y = -1.5;
            nozzle.castShadow = true;
            nozzle.receiveShadow = true;
            group.add(nozzle);
            
            // Add cooling tubes around nozzle
            const tubeGroup = new THREE.Group();
            const tubeCount = 36;
            const tubeRadius = 0.06;
            
            for (let i = 0; i < tubeCount; i++) {
                const angle = (i / tubeCount) * Math.PI * 2;
                const tube = new THREE.Mesh(
                    new THREE.TorusGeometry(1.83, tubeRadius, 8, 48, Math.PI * 1.6),
                    copperMaterial
                );
                tube.position.y = -1.5;
                tube.rotation.y = angle;
                tube.rotation.x = Math.PI / 2;
                tubeGroup.add(tube);
            }
            group.add(tubeGroup);
            
            // Add heat effect inside nozzle
            const heatGlow = new THREE.Mesh(
                createNozzleBell(), 
                new THREE.MeshStandardMaterial({
                    color: 0xff4400,
                    emissive: 0xff2200,
                    emissiveIntensity: 1.0,
                    side: THREE.BackSide
                })
            );
            heatGlow.scale.set(0.95, 0.95, 0.95);
            heatGlow.position.y = -1.5;
            group.add(heatGlow);
            
            // Create turbopumps and plumbing
            const fuelPump = new THREE.Mesh(
                new THREE.CylinderGeometry(0.6, 0.6, 0.8, 32),
                titaniumMaterial
            );
            fuelPump.position.set(1.5, 0.5, 0);
            group.add(fuelPump);
            
            // Add exhaust flame
            const flameGroup = new THREE.Group();
            
            // Main flame cone
            const flameCone = new THREE.Mesh(
                new THREE.ConeGeometry(0.5, 4, 32, 1, true),
                new THREE.MeshBasicMaterial({
                    color: 0xff9900,
                    transparent: true,
                    opacity: 0.7,
                    side: THREE.DoubleSide
                })
            );
            flameCone.position.y = -5;
            flameCone.rotation.x = Math.PI;
            flameGroup.add(flameCone);
            
            // Inner bright flame
            const innerFlame = new THREE.Mesh(
                new THREE.ConeGeometry(0.3, 2.5, 32, 1, true),
                new THREE.MeshBasicMaterial({
                    color: 0xffdd00,
                    transparent: true,
                    opacity: 0.9,
                    side: THREE.DoubleSide
                })
            );
            innerFlame.position.y = -4;
            innerFlame.rotation.x = Math.PI;
            flameGroup.add(innerFlame);
            
            group.add(flameGroup);
        }

        // Window resize handler
        window.addEventListener('resize', () => {
            camera.aspect = canvas.clientWidth / canvas.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(canvas.clientWidth, canvas.clientHeight);
        });

        // Animation loop with more realistic effects
        function animate() {
            requestAnimationFrame(animate);
            
            // Slowly rotate engine for showcase
            engineGroup.rotation.y += 0.005;
            
            // Animate engine flame effects if they exist
            engineGroup.traverse((child) => {
                // Animate heat glow
                if (child.material && child.material.emissiveIntensity) {
                    child.material.emissiveIntensity = 0.8 + Math.sin(Date.now() * 0.002) * 0.3;
                }
                
                // Animate flames
                if (child.material && child.material.opacity && child.geometry && 
                    child.geometry.type && child.geometry.type.includes('ConeGeometry')) {
                    child.scale.x = 0.9 + Math.sin(Date.now() * 0.01) * 0.2;
                    child.scale.z = 0.9 + Math.cos(Date.now() * 0.01) * 0.2;
                    child.material.opacity = 0.6 + Math.sin(Date.now() * 0.01) * 0.3;
                }
            });
            
            // Pulse lights for dramatic effect
            keyLight.intensity = 1.5 + Math.sin(Date.now() * 0.001) * 0.3;
            fillLight.intensity = 4 + Math.sin(Date.now() * 0.001) * 1.5;
            
            renderer.render(scene, camera);
        }
        
        animate();
        console.log('Kronos engine initialized successfully');
    } catch (error) {
        console.error('Error initializing Kronos engine:', error);
    }
}

// Enhanced Nebula 1 Rocket with GLTF model
function initEnhancedNebula1Rocket() {
    console.log('Initializing enhanced Nebula 1 rocket...');
    const canvas = document.getElementById('rocket-canvas');
    if (!canvas) {
        console.error('Rocket canvas not found in DOM');
        return;
    }

    try {
        // Scene setup
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x000000);
        scene.fog = new THREE.FogExp2(0x000815, 0.02);

        // Camera with better positioning
        const camera = new THREE.PerspectiveCamera(60, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
        camera.position.set(15, 10, 15);
        camera.lookAt(0, 0, 0);

        // Enhanced renderer
        const renderer = new THREE.WebGLRenderer({
            canvas: canvas,
            antialias: true,
            alpha: true
        });
        renderer.setSize(canvas.clientWidth, canvas.clientHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        
        // Atmospheric lighting
        const hemiLight = new THREE.HemisphereLight(0x0066ff, 0xff9900, 0.3);
        scene.add(hemiLight);
        
        const ambientLight = new THREE.AmbientLight(0x111122, 0.4);
        scene.add(ambientLight);

        // Main directional light (sun)
        const sunLight = new THREE.DirectionalLight(0xffffee, 1.2);
        sunLight.position.set(15, 25, 15);
        sunLight.castShadow = true;
        sunLight.shadow.mapSize.width = 2048;
        sunLight.shadow.mapSize.height = 2048;
        sunLight.shadow.camera.far = 50;
        sunLight.shadow.bias = -0.0005;
        scene.add(sunLight);

        // Blue rim light
        const blueLight = new THREE.PointLight(0x0066ff, 4, 50);
        blueLight.position.set(-15, 10, 15);
        blueLight.castShadow = true;
        blueLight.shadow.bias = -0.0005;
        scene.add(blueLight);

        // Rocket model container
        const rocketGroup = new THREE.Group();
        scene.add(rocketGroup);

        // Create rocket fallback model
        createDetailedRocketModel(rocketGroup);

        // Check if GLTFLoader is available
        if (typeof THREE.GLTFLoader === 'function') {
            console.log('GLTFLoader available, attempting to load rocket model');
            
            // Try to load the GLTF model
            const loader = new THREE.GLTFLoader();
            loader.load(
                './img/nebula1_rocket.glb',
                function(gltf) {
                    // Clear group for loaded model
                    while(rocketGroup.children.length > 0) {
                        rocketGroup.remove(rocketGroup.children[0]);
                    }
                    
                    const model = gltf.scene;
                    model.scale.set(0.5, 0.5, 0.5);
                    model.position.set(0, 0, 0);
                    model.traverse((node) => {
                        if (node.isMesh) {
                            node.castShadow = true;
                            node.receiveShadow = true;
                        }
                    });
                    rocketGroup.add(model);
                    console.log('Rocket GLTF model loaded successfully');
                },
                function(xhr) {
                    console.log('Rocket model: ' + (xhr.loaded / xhr.total * 100) + '% loaded');
                },
                function(error) {
                    console.error('Error loading rocket model:', error);
                    // We already created the fallback model
                }
            );
        } else {
            console.warn('GLTFLoader not available for rocket, using fallback model');
            // Fallback created already
        }

        // Create a detailed rocket model
        function createDetailedRocketModel(group) {
            console.log('Creating detailed rocket model fallback');
            
            // Advanced physically-based materials
            const whitePaintMaterial = new THREE.MeshStandardMaterial({
                color: 0xfcfcfc,
                metalness: 0.3,
                roughness: 0.6
            });

            const metalMaterial = new THREE.MeshStandardMaterial({
                color: 0x888888,
                metalness: 0.9,
                roughness: 0.3
            });

            const carbonMaterial = new THREE.MeshStandardMaterial({
                color: 0x111111,
                metalness: 0.3,
                roughness: 0.7
            });

            const blueAccentMaterial = new THREE.MeshStandardMaterial({
                color: 0x0066aa,
                metalness: 0.7,
                roughness: 0.3
            });

            // Create first stage
            const firstStageGroup = new THREE.Group();
            
            // Main body cylinder
            const firstStageCylinder = new THREE.Mesh(
                new THREE.CylinderGeometry(2, 2.2, 18, 32),
                whitePaintMaterial
            );
            firstStageCylinder.castShadow = true;
            firstStageCylinder.receiveShadow = true;
            firstStageGroup.add(firstStageCylinder);
            
            // Engine section (octaweb)
            const engineSection = new THREE.Mesh(
                new THREE.CylinderGeometry(2.2, 2.3, 2, 32),
                metalMaterial
            );
            engineSection.position.y = -9.5;
            firstStageGroup.add(engineSection);
            
            // Add 9 engines in octaweb pattern
            for (let i = 0; i < 9; i++) {
                let posX = 0;
                let posZ = 0;
                
                if (i > 0) {
                    const angle = ((i - 1) / 8) * Math.PI * 2;
                    posX = Math.cos(angle) * 1.4;
                    posZ = Math.sin(angle) * 1.4;
                }
                
                const engine = new THREE.Group();
                
                // Engine bell
                const bellGeo = new THREE.CylinderGeometry(0.4, 0.2, 1.2, 24, 1, true);
                const bell = new THREE.Mesh(bellGeo, metalMaterial);
                engine.add(bell);
                
                // Engine flame
                const flameGeo = new THREE.ConeGeometry(0.2, 3, 16, 1, true);
                const flameMaterial = new THREE.MeshBasicMaterial({
                    color: 0xff6600,
                    transparent: true,
                    opacity: 0.7,
                    side: THREE.DoubleSide
                });
                const flame = new THREE.Mesh(flameGeo, flameMaterial);
                flame.rotation.x = Math.PI;
                flame.position.y = -1.5;
                flame.userData = {
                    type: 'flame',
                    flickerSpeed: 0.01 + Math.random() * 0.02
                };
                engine.add(flame);
                
                engine.position.set(posX, -11, posZ);
                firstStageGroup.add(engine);
            }
            
            // Add grid fins
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
            
            // Add landing legs
            for (let i = 0; i < 4; i++) {
                const angle = (i / 4) * Math.PI * 2 + (Math.PI / 4);
                
                // Create landing leg with joint
                const legGroup = new THREE.Group();
                
                const upperLeg = new THREE.Mesh(
                    new THREE.CylinderGeometry(0.15, 0.15, 3, 8),
                    metalMaterial
                );
                upperLeg.rotation.x = Math.PI / 3;
                legGroup.add(upperLeg);
                
                const footPad = new THREE.Mesh(
                    new THREE.BoxGeometry(0.8, 0.1, 0.8),
                    metalMaterial
                );
                footPad.position.set(0, -1.5, 1.2);
                legGroup.add(footPad);
                
                legGroup.position.set(
                    Math.cos(angle) * 2.2,
                    -8.5,
                    Math.sin(angle) * 2.2
                );
                legGroup.rotation.y = angle;
                
                firstStageGroup.add(legGroup);
            }
            
            // Add blue company stripe
            const blueStripe = new THREE.Mesh(
                new THREE.CylinderGeometry(2.01, 2.01, 1, 32),
                blueAccentMaterial
            );
            blueStripe.position.y = 3;
            firstStageGroup.add(blueStripe);
            
            // Add second stage
            const secondStageGroup = new THREE.Group();
            secondStageGroup.position.y = 13;
            
            const secondStageCylinder = new THREE.Mesh(
                new THREE.CylinderGeometry(1.8, 1.8, 4, 32),
                whitePaintMaterial
            );
            secondStageCylinder.castShadow = true;
            secondStageCylinder.receiveShadow = true;
            secondStageGroup.add(secondStageCylinder);
            
            // Second stage engine
            const secondStageEngine = new THREE.Mesh(
                new THREE.CylinderGeometry(0.6, 0.3, 1.2, 24, 1, true),
                metalMaterial
            );
            secondStageEngine.position.y = -2.5;
            secondStageGroup.add(secondStageEngine);
            
            // Add payload fairing
            const fairingGroup = new THREE.Group();
            fairingGroup.position.y = 16;
            
            // Fairing base
            const fairingBase = new THREE.Mesh(
                new THREE.CylinderGeometry(1.8, 1.8, 1, 32),
                whitePaintMaterial
            );
            fairingGroup.add(fairingBase);
            
            // Fairing nose cone
            const points = [];
            for (let i = 0; i <= 10; i++) {
                const t = i / 10;
                const x = 1.8 * (1 - t);
                const y = t * 5;
                points.push(new THREE.Vector2(x, y));
            }
            const noseGeo = new THREE.LatheGeometry(points, 32);
            const noseCone = new THREE.Mesh(noseGeo, whitePaintMaterial);
            noseCone.position.y = 0.5;
            fairingGroup.add(noseCone);
            
            // Add all components to rocket group
            group.add(firstStageGroup);
            group.add(secondStageGroup);
            group.add(fairingGroup);
        }

        // Window resize handler
        window.addEventListener('resize', () => {
            camera.aspect = canvas.clientWidth / canvas.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(canvas.clientWidth, canvas.clientHeight);
        });

        // Animation loop
        function animate() {
            requestAnimationFrame(animate);
            
            // Gentle rocket rotation
            rocketGroup.rotation.y += 0.003;
            
            // Animate engine flames
            rocketGroup.traverse((child) => {
                if (child.userData && child.userData.type === 'flame') {
                    child.scale.x = 0.9 + Math.sin(Date.now() * child.userData.flickerSpeed) * 0.2;
                    child.scale.z = 0.9 + Math.cos(Date.now() * child.userData.flickerSpeed) * 0.2;
                }
            });
            
            // Light animation
            blueLight.intensity = 4 + Math.sin(Date.now() * 0.001) * 1;
            
            renderer.render(scene, camera);
        }
        
        animate();
        console.log('Nebula 1 rocket initialized successfully');
    } catch (error) {
        console.error('Error initializing Nebula 1 rocket:', error);
    }
}

// Enhanced Satellite Model with GLTF
function initEnhancedSatellites() {
    console.log('Initializing enhanced satellites constellation...');
    const canvas = document.getElementById('satellite-canvas');
    if (!canvas) {
        console.error('Satellite canvas not found in DOM');
        return;
    }

    try {
        // Basic scene setup
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x000000);
        
        // Camera setup
        const camera = new THREE.PerspectiveCamera(60, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
        camera.position.set(0, 30, 35);
        camera.lookAt(0, 0, 0);

        // Basic renderer
        const renderer = new THREE.WebGLRenderer({
            canvas: canvas,
            antialias: true
        });
        renderer.setSize(canvas.clientWidth, canvas.clientHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        
        // Basic lighting
        const ambientLight = new THREE.AmbientLight(0x404040);
        scene.add(ambientLight);
        
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(1, 1, 1);
        scene.add(directionalLight);
        
        // Simple Earth representation
        const earthGeometry = new THREE.SphereGeometry(10, 32, 32);
        const earthMaterial = new THREE.MeshPhongMaterial({
            color: 0x0055aa,
            emissive: 0x112244,
            emissiveIntensity: 0.2,
            shininess: 15
        });
        const earth = new THREE.Mesh(earthGeometry, earthMaterial);
        scene.add(earth);
        
        // Simple satellite representation
        const satelliteGroup = new THREE.Group();
        scene.add(satelliteGroup);
        
        const satellites = [];
        const orbitRadii = [15, 18, 21, 24];
        
        // Create orbit paths
        orbitRadii.forEach(radius => {
            const orbitGeometry = new THREE.RingGeometry(radius - 0.05, radius + 0.05, 64);
            const orbitMaterial = new THREE.MeshBasicMaterial({
                color: 0x0099ff,
                transparent: true, 
                opacity: 0.3,
                side: THREE.DoubleSide
            });
            const orbit = new THREE.Mesh(orbitGeometry, orbitMaterial);
            orbit.rotation.x = Math.PI / 2;
            scene.add(orbit);
            
            // Add satellites to orbit
            const satCount = 6;
            for (let i = 0; i < satCount; i++) {
                const angle = (i / satCount) * Math.PI * 2;
                
                // Create simple satellite
                const satGeometry = new THREE.BoxGeometry(0.5, 0.2, 1);
                const satMaterial = new THREE.MeshPhongMaterial({
                    color: 0xdddddd,
                    shininess: 100
                });
                const satellite = new THREE.Mesh(satGeometry, satMaterial);
                
                // Add solar panels
                const panelGeometry = new THREE.BoxGeometry(2, 0.05, 0.6);
                const panelMaterial = new THREE.MeshPhongMaterial({
                    color: 0x2233aa,
                    shininess: 80
                });
                
                const leftPanel = new THREE.Mesh(panelGeometry, panelMaterial);
                leftPanel.position.x = -1.25;
                satellite.add(leftPanel);
                
                const rightPanel = new THREE.Mesh(panelGeometry, panelMaterial);
                rightPanel.position.x = 1.25;
                satellite.add(rightPanel);
                
                // Position satellite in orbit
                const x = Math.cos(angle) * radius;
                const z = Math.sin(angle) * radius;
                satellite.position.set(x, 0, z);
                
                // Look at Earth
                satellite.lookAt(0, 0, 0);
                
                // Store orbit data
                satellite.userData = {
                    angle: angle,
                    radius: radius,
                    speed: 0.0005 + Math.random() * 0.0005
                };
                
                satelliteGroup.add(satellite);
                satellites.push(satellite);
            }
        });
        
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
            
            // Move satellites
            satellites.forEach(sat => {
                sat.userData.angle += sat.userData.speed;
                
                // Update position
                sat.position.x = Math.cos(sat.userData.angle) * sat.userData.radius;
                sat.position.z = Math.sin(sat.userData.angle) * sat.userData.radius;
                
                // Look at Earth
                sat.lookAt(0, 0, 0);
            });
            
            // Slowly move camera for a dynamic view
            const time = Date.now() * 0.0001;
            camera.position.x = Math.sin(time) * 35;
            camera.position.z = Math.cos(time) * 35;
            camera.lookAt(0, 0, 0);
            
            renderer.render(scene, camera);
        }
        
        animate();
        console.log('Satellites constellation initialized successfully');
    } catch (error) {
        console.error('Error initializing satellites constellation:', error);
    }
}
