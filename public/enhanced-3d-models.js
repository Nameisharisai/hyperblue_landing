// This file will enhance our 3D models with GLTF loading
document.addEventListener('DOMContentLoaded', function() {
    // Load 3D models from GLB files
    initEnhancedKronosEngine();
    initEnhancedNebula1Rocket();
    initEnhancedSatellites();
});

// Enhanced Kronos Engine with GLTF model
function initEnhancedKronosEngine() {
    const canvas = document.getElementById('engine-canvas');
    if (!canvas) return;

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
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    renderer.outputEncoding = THREE.sRGBEncoding;

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

    // Small rim light to highlight edges
    const rimLight = new THREE.PointLight(0xffffcc, 1.5, 20);
    rimLight.position.set(-5, 8, -8);
    scene.add(rimLight);

    // Engine model container
    const engineGroup = new THREE.Group();
    scene.add(engineGroup);

    // GLTF Loader for high-quality model
    const loader = new THREE.GLTFLoader();
    
    // Add loading indicator or placeholder while model loads
    const placeholderGeo = new THREE.CylinderGeometry(1.5, 2, 6, 32);
    const placeholderMat = new THREE.MeshStandardMaterial({
        color: 0x333333,
        metalness: 0.8,
        roughness: 0.3
    });
    const placeholder = new THREE.Mesh(placeholderGeo, placeholderMat);
    engineGroup.add(placeholder);

    // Load the detailed model
    loader.load(
        // Resource URL
        './img/kronos_engine.glb',
        
        // Called when resource is loaded
        function(gltf) {
            // Remove placeholder
            engineGroup.remove(placeholder);
            
            // Add the loaded model
            const model = gltf.scene;
            model.scale.set(5, 5, 5); // Adjust scale as needed
            model.position.set(0, 0, 0);
            model.traverse((node) => {
                if (node.isMesh) {
                    node.castShadow = true;
                    node.receiveShadow = true;
                }
            });
            engineGroup.add(model);
            
            // Since we don't have the actual model, we'll create a realistic fallback
            createDetailedEngineModel(engineGroup);
        },
        
        // Called when loading is in progress
        function(xhr) {
            console.log('Engine model: ' + (xhr.loaded / xhr.total * 100) + '% loaded');
        },
        
        // Called when loading has errors
        function(error) {
            console.error('Error loading engine model:', error);
            // Create a fallback detailed model if loading fails
            createDetailedEngineModel(engineGroup);
        }
    );

    // Function to create a detailed engine model if GLTF loading fails
    function createDetailedEngineModel(group) {
        // Remove placeholder if it exists
        if (placeholder.parent === group) {
            group.remove(placeholder);
        }
        
        // Advanced physically-based materials
        const titaniumMaterial = new THREE.MeshStandardMaterial({
            color: 0x8c8c8c,
            metalness: 0.9,
            roughness: 0.3,
            envMapIntensity: 1.0
        });

        const copperMaterial = new THREE.MeshStandardMaterial({
            color: 0xca6533,
            metalness: 0.9,
            roughness: 0.2,
            envMapIntensity: 1.0
        });

        const coolantMaterial = new THREE.MeshPhysicalMaterial({
            color: 0x00aaff,
            metalness: 0.9,
            roughness: 0.05,
            transparent: true,
            opacity: 0.6,
            envMapIntensity: 1.0,
            clearcoat: 1.0,
            clearcoatRoughness: 0.1,
            transmission: 0.5
        });

        const carbonFiberMaterial = new THREE.MeshStandardMaterial({
            color: 0x111111,
            metalness: 0.3,
            roughness: 0.8
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
                child.geometry.type.includes('ConeGeometry')) {
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
}

// Enhanced Nebula 1 Rocket with GLTF model
function initEnhancedNebula1Rocket() {
    const canvas = document.getElementById('rocket-canvas');
    if (!canvas) return;

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
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    renderer.outputEncoding = THREE.sRGBEncoding;

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

    // GLTF Loader for high-quality model
    const loader = new THREE.GLTFLoader();
    
    // Placeholder while loading
    const placeholderGeo = new THREE.CylinderGeometry(2, 2, 20, 32);
    const placeholderMat = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        metalness: 0.5,
        roughness: 0.4
    });
    const placeholder = new THREE.Mesh(placeholderGeo, placeholderMat);
    rocketGroup.add(placeholder);

    // Load the detailed model
    loader.load(
        './img/nebula1_rocket.glb',
        function(gltf) {
            rocketGroup.remove(placeholder);
            
            const model = gltf.scene;
            model.scale.set(0.5, 0.5, 0.5); // Adjust scale as needed
            model.position.set(0, 0, 0);
            model.traverse((node) => {
                if (node.isMesh) {
                    node.castShadow = true;
                    node.receiveShadow = true;
                }
            });
            rocketGroup.add(model);
            
            // Fallback detailed model if needed
            createDetailedRocketModel(rocketGroup);
        },
        function(xhr) {
            console.log('Rocket model: ' + (xhr.loaded / xhr.total * 100) + '% loaded');
        },
        function(error) {
            console.error('Error loading rocket model:', error);
            createDetailedRocketModel(rocketGroup);
        }
    );

    // Create a detailed rocket model if GLTF loading fails
    function createDetailedRocketModel(group) {
        // Remove placeholder if it exists
        if (placeholder.parent === group) {
            group.remove(placeholder);
        }
        
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
}

// Enhanced Satellite Model with GLTF
function initEnhancedSatellites() {
    const canvas = document.getElementById('satellite-canvas');
    if (!canvas) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);
    scene.fog = new THREE.FogExp2(0x000815, 0.01);

    // Camera with better positioning
    const camera = new THREE.PerspectiveCamera(60, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
    camera.position.set(0, 30, 35);
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
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    renderer.outputEncoding = THREE.sRGBEncoding;

    // Studio lighting for satellites and Earth
    const hemiLight = new THREE.HemisphereLight(0x0066ff, 0x002244, 0.2);
    scene.add(hemiLight);
    
    const ambientLight = new THREE.AmbientLight(0x111122, 0.3);
    scene.add(ambientLight);

    // Sun directional light
    const sunLight = new THREE.DirectionalLight(0xffffee, 1.5);
    sunLight.position.set(50, 50, 50);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    sunLight.shadow.camera.far = 100;
    sunLight.shadow.bias = -0.0005;
    scene.add(sunLight);

    // Blue accent light
    const blueLight = new THREE.PointLight(0x0066ff, 5, 100);
    blueLight.position.set(-20, 10, 20);
    scene.add(blueLight);

    // Create Earth with realistic materials
    const earthGroup = new THREE.Group();
    scene.add(earthGroup);
    
    const earthGeo = new THREE.SphereGeometry(10, 64, 64);
    const textureLoader = new THREE.TextureLoader();
    textureLoader.setCrossOrigin('anonymous');
    
    // Earth material with realistic maps
    const earthMaterial = new THREE.MeshPhongMaterial({
        color: 0xffffff,
        shininess: 15
    });
    
    // Try to load earth textures
    textureLoader.load('./img/earth_atmos_2048.jpg', 
        (texture) => {
            earthMaterial.map = texture;
            earthMaterial.needsUpdate = true;
        },
        undefined,
        (err) => console.error('Error loading earth texture:', err)
    );
    
    textureLoader.load('./img/earth_normal_2048.jpg', 
        (texture) => {
            earthMaterial.bumpMap = texture;
            earthMaterial.bumpScale = 0.1;
            earthMaterial.needsUpdate = true;
        },
        undefined,
        (err) => console.error('Error loading normal map:', err)
    );
    
    const earth = new THREE.Mesh(earthGeo, earthMaterial);
    earth.castShadow = true;
    earth.receiveShadow = true;
    earthGroup.add(earth);
    
    // Cloud layer
    const cloudGeo = new THREE.SphereGeometry(10.3, 64, 64);
    const cloudMaterial = new THREE.MeshPhongMaterial({
        transparent: true,
        opacity: 0.6
    });
    
    textureLoader.load('./img/earth_clouds_2048.jpg', 
        (texture) => {
            cloudMaterial.map = texture;
            cloudMaterial.needsUpdate = true;
        },
        undefined,
        (err) => console.error('Error loading clouds texture:', err)
    );
    
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

    // Create satellite orbits
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
    
    // GLTF Loader for high-quality satellite model
    const loader = new THREE.GLTFLoader();
    
    // Create a detailed satellite model
    function createDetailedSatellite() {
        const satGroup = new THREE.Group();
        
        // Materials
        const bodyMaterial = new THREE.MeshStandardMaterial({
            color: 0xeeeeee,
            metalness: 0.8,
            roughness: 0.2
        });
        
        const panelMaterial = new THREE.MeshStandardMaterial({
            color: 0x0055aa,
            metalness: 0.5,
            roughness: 0.3
        });
        
        const goldMaterial = new THREE.MeshStandardMaterial({
            color: 0xddb257,
            metalness: 0.9,
            roughness: 0.1
        });
        
        // Main body - more detailed
        const body = new THREE.Mesh(
            new THREE.BoxGeometry(0.8, 0.4, 1.5),
            bodyMaterial
        );
        satGroup.add(body);
        
        // Add details to body
        const detailTop = new THREE.Mesh(
            new THREE.BoxGeometry(0.6, 0.1, 1.2),
            goldMaterial
        );
        detailTop.position.y = 0.25;
        satGroup.add(detailTop);
        
        // Solar panels with texture
        const panelGeo = new THREE.BoxGeometry(4, 0.05, 1);
        const panelLeft = new THREE.Mesh(panelGeo, panelMaterial);
        panelLeft.position.x = -2.4;
        
        // Solar cell grid texture
        const gridMaterial = new THREE.MeshStandardMaterial({
            color: 0x0044aa,
            metalness: 0.5,
            roughness: 0.3
        });
        
        // Add cell grid to panel
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 3; j++) {
                const cell = new THREE.Mesh(
                    new THREE.BoxGeometry(0.45, 0.01, 0.3),
                    gridMaterial
                );
                cell.position.set(-1.75 + i * 0.5, 0.03, -0.35 + j * 0.35);
                panelLeft.add(cell);
            }
        }
        
        satGroup.add(panelLeft);
        
        // Right panel (mirror of left)
        const panelRight = panelLeft.clone();
        panelRight.position.x = 2.4;
        satGroup.add(panelRight);
        
        // Communication dish
        const dishGroup = new THREE.Group();
        
        const dishGeo = new THREE.SphereGeometry(0.5, 16, 8, 0, Math.PI);
        const dishMaterial = new THREE.MeshStandardMaterial({
            color: 0xcccccc,
            metalness: 0.8,
            roughness: 0.2
        });
        const dish = new THREE.Mesh(dishGeo, dishMaterial);
        dish.rotation.x = Math.PI / 2;
        dishGroup.add(dish);
        
        // Dish support arm
        const supportArm = new THREE.Mesh(
            new THREE.CylinderGeometry(0.05, 0.05, 0.5, 8),
            bodyMaterial
        );
        supportArm.position.z = -0.25;
        supportArm.rotation.x = Math.PI / 2;
        dishGroup.add(supportArm);
        
        dishGroup.position.set(0, 0, 0.8);
        satGroup.add(dishGroup);
        
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
        
        // Add antennas
        const antennaGeo = new THREE.CylinderGeometry(0.03, 0.01, 0.8, 8);
        const antennaMaterial = new THREE.MeshStandardMaterial({
            color: 0x666666,
            metalness: 0.8,
            roughness: 0.2
        });
        
        for (let i = 0; i < 2; i++) {
            const antenna = new THREE.Mesh(antennaGeo, antennaMaterial);
            antenna.position.set(i === 0 ? 0.2 : -0.2, 0.2, -0.6);
            antenna.rotation.x = Math.PI / 6;
            satGroup.add(antenna);
        }
        
        return satGroup;
    }
    
    // Create multiple satellites in each orbit
    let satIndex = 0;
    orbitRadii.forEach((radius, orbitIndex) => {
        const count = 6 + orbitIndex * 3; // More satellites in outer orbits
        
        for (let i = 0; i < count; i++) {
            const angle = (i / count) * Math.PI * 2;
            const inclination = (orbitIndex % 2 === 0) ? 0.1 : -0.1; // Alternate orbit inclination
            
            const x = Math.cos(angle) * radius;
            const y = Math.sin(inclination * Math.PI) * radius;
            const z = Math.sin(angle) * radius;
            
            // Try to load GLTF model first
            if (satIndex === 0) {
                loader.load(
                    './img/satellite.glb',
                    function(gltf) {
                        const model = gltf.scene;
                        model.scale.set(0.2, 0.2, 0.2);
                        model.position.set(x, y, z);
                        model.lookAt(0, 0, 0);
                        
                        model.userData = {
                            orbit: orbitIndex,
                            angle: angle,
                            radius: radius,
                            inclination: inclination,
                            speed: 0.0002 * (1 - orbitIndex * 0.15),
                            links: []
                        };
                        
                        satelliteGroup.add(model);
                        satelliteBodies.push(model);
                    },
                    undefined,
                    function(error) {
                        console.error('Error loading satellite model:', error);
                        // Fallback to created model
                        createSatsWithDetailedModel();
                    }
                );
            } else {
                // For other satellites, use the detailed model
                const satellite = createDetailedSatellite();
                satellite.position.set(x, y, z);
                satellite.lookAt(0, 0, 0);
                
                satellite.userData = {
                    orbit: orbitIndex,
                    angle: angle,
                    radius: radius,
                    inclination: inclination,
                    speed: 0.0002 * (1 - orbitIndex * 0.15),
                    links: []
                };
                
                satelliteGroup.add(satellite);
                satelliteBodies.push(satellite);
            }
            
            satIndex++;
        }
    });
    
    // Function to create all satellites with detailed model if GLTF fails
    function createSatsWithDetailedModel() {
        // Clear existing satellites
        while(satelliteBodies.length > 0) {
            const sat = satelliteBodies.pop();
            satelliteGroup.remove(sat);
        }
        
        // Create new satellites
        orbitRadii.forEach((radius, orbitIndex) => {
            const count = 6 + orbitIndex * 3;
            
            for (let i = 0; i < count; i++) {
                const angle = (i / count) * Math.PI * 2;
                const inclination = (orbitIndex % 2 === 0) ? 0.1 : -0.1;
                
                const x = Math.cos(angle) * radius;
                const y = Math.sin(inclination * Math.PI) * radius;
                const z = Math.sin(angle) * radius;
                
                const satellite = createDetailedSatellite();
                satellite.position.set(x, y, z);
                satellite.lookAt(0, 0, 0);
                
                satellite.userData = {
                    orbit: orbitIndex,
                    angle: angle,
                    radius: radius,
                    inclination: inclination,
                    speed: 0.0002 * (1 - orbitIndex * 0.15),
                    links: []
                };
                
                satelliteGroup.add(satellite);
                satelliteBodies.push(satellite);
            }
        });
    }

    // Function to create intersatellite links
    function updateSatelliteLinks() {
        // Remove old links
        interSatLinks.forEach(link => {
            satelliteGroup.remove(link);
        });
        interSatLinks.length = 0;
        
        // Create new links
        satelliteBodies.forEach(sat => {
            sat.userData.links = [];
            
            // Find closest satellites in same or adjacent orbit
            const potentialLinks = [];
            
            satelliteBodies.forEach(otherSat => {
                if (sat === otherSat) return;
                
                // Calculate distance
                const distance = sat.position.distanceTo(otherSat.position);
                
                // Check orbit relationship
                const sameOrbit = sat.userData.orbit === otherSat.userData.orbit;
                const adjacentOrbit = Math.abs(sat.userData.orbit - otherSat.userData.orbit) === 1;
                
                if (sameOrbit || adjacentOrbit) {
                    // Check line of sight (not blocked by Earth)
                    const midPoint = new THREE.Vector3().addVectors(
                        sat.position, otherSat.position
                    ).multiplyScalar(0.5);
                    
                    // If midpoint is farther than Earth radius + buffer, there's line of sight
                    if (midPoint.length() > 10.5) {
                        potentialLinks.push({
                            satellite: otherSat,
                            distance: distance
                        });
                    }
                }
            });
            
            // Sort by distance and take closest ones
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
                    
                    // Create visual link with enhanced laser effect
                    const linkPoints = [
                        sat.position.clone(),
                        link.satellite.position.clone()
                    ];
                    
                    const linkGeo = new THREE.BufferGeometry().setFromPoints(linkPoints);
                    
                    // Laser beam effect
                    const laserMaterial = new THREE.LineBasicMaterial({
                        color: 0x00ffff,
                        transparent: true,
                        opacity: 0.7,
                        linewidth: 1
                    });
                    
                    const laserLink = new THREE.Line(linkGeo, laserMaterial);
                    
                    // Add data packets animation along link
                    const packetCount = Math.floor(Math.random() * 3) + 1;
                    const packets = [];
                    
                    for (let j = 0; j < packetCount; j++) {
                        const packetGeo = new THREE.SphereGeometry(0.1, 8, 8);
                        const packetMat = new THREE.MeshBasicMaterial({
                            color: 0x00ffff,
                            transparent: true,
                            opacity: 0.8
                        });
                        
                        const packet = new THREE.Mesh(packetGeo, packetMat);
                        
                        // Initial position along the link
                        const initialPos = Math.random();
                        packet.userData = {
                            position: initialPos,
                            speed: 0.005 + Math.random() * 0.01,
                            direction: Math.random() > 0.5 ? 1 : -1
                        };
                        
                        // Position at the right point along the link
                        packet.position.copy(
                            sat.position.clone().lerp(
                                link.satellite.position, 
                                packet.userData.position
                            )
                        );
                        
                        packets.push(packet);
                        satelliteGroup.add(packet);
                    }
                    
                    // Store reference to endpoints and packets
                    laserLink.userData = {
                        from: sat,
                        to: link.satellite,
                        packets: packets
                    };
                    
                    satelliteGroup.add(laserLink);
                    interSatLinks.push(laserLink);
                }
            }
        });
    }
    
    // Create initial links
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
        earth.rotation.y += 0.0005;
        clouds.rotation.y += 0.0007;
        
        // Animate satellites in orbit
        satelliteBodies.forEach(sat => {
            sat.userData.angle += sat.userData.speed;
            
            const inclination = sat.userData.inclination;
            const radius = sat.userData.radius;
            
            sat.position.x = Math.cos(sat.userData.angle) * radius;
            sat.position.y = Math.sin(inclination * Math.PI) * radius;
            sat.position.z = Math.sin(sat.userData.angle) * radius;
            
            // Orient satellite to face Earth
            sat.lookAt(0, 0, 0);
            
            // Pulse AI modules if they exist
            sat.traverse((child) => {
                if (child.material && child.material.emissiveIntensity) {
                    child.material.emissiveIntensity = 
                        0.3 + 0.2 * Math.sin(Date.now() * 0.002 + sat.userData.angle * 5);
                }
            });
        });
        
        // Update satellite links periodically
        if (Math.floor(Date.now() / 3000) !== Math.floor((Date.now() - 33) / 3000)) {
            updateSatelliteLinks();
        }
        
        // Update link positions and packet animations
        interSatLinks.forEach(link => {
            // Update link endpoints
            const points = [
                link.userData.from.position.clone(),
                link.userData.to.position.clone()
            ];
            link.geometry.setFromPoints(points);
            
            // Animate data packets
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
        
        // Slowly rotate camera for dramatic effect
        camera.position.x = 35 * Math.cos(Date.now() * 0.0001);
        camera.position.z = 35 * Math.sin(Date.now() * 0.0001);
        camera.lookAt(0, 0, 0);
        
        renderer.render(scene, camera);
    }
    
    animate();
}
