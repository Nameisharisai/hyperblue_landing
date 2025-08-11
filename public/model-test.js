// This is a test file to validate that the Earth globe and other 3D models are loading correctly
document.addEventListener('DOMContentLoaded', function() {
    console.log('Testing 3D model loading...');
    
    // Check if the Earth canvas exists
    const earthCanvas = document.getElementById('earth-canvas');
    if (earthCanvas) {
        console.log('Earth canvas found in the DOM');
    } else {
        console.error('Earth canvas not found in the DOM');
    }
    
    // Check if Three.js is loaded
    if (window.THREE) {
        console.log('Three.js is loaded correctly');
    } else {
        console.error('Three.js is not loaded');
    }
    
    // Log when Earth globe initialization completes
    const originalInitEarthGlobe = window.initEarthGlobe;
    window.initEarthGlobe = function() {
        console.log('Earth globe initialization started');
        const result = originalInitEarthGlobe.apply(this, arguments);
        console.log('Earth globe initialization completed');
        return result;
    };
    
    // Check for texture loading errors
    const originalTextureLoad = THREE.TextureLoader.prototype.load;
    THREE.TextureLoader.prototype.load = function(url, onLoad, onProgress, onError) {
        console.log('Loading texture:', url);
        return originalTextureLoad.call(
            this, 
            url,
            function(texture) {
                console.log('Successfully loaded texture:', url);
                if (onLoad) onLoad(texture);
            },
            onProgress,
            function(err) {
                console.error('Failed to load texture:', url, err);
                if (onError) onError(err);
            }
        );
    };
});
