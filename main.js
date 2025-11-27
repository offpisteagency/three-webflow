// =========================================================
// CONFIGURATION
// =========================================================
const CONFIG = {
    // DOM Element ID (Must match Webflow ID)
    containerId: 'particle-canvas',
    
    // GitHub Settings for Production
    ghUser: 'offpisteagency',
    ghRepo: 'three-webflow',
    ghBranch: 'main',
    
    // Asset Settings
    fileName: 'logo.glb', // Ensure this matches your file inside /assets
    
    // Visual Settings
    particleColor: '#ffffff',
    particleCount: 700,
    bgColor: 'transparent' // 'transparent' lets Webflow gradients show through
};

// =========================================================
// INIT
// =========================================================
const container = document.getElementById(CONFIG.containerId);

if (container) {
    initThreeScene();
} else {
    console.error(`Three.js Error: Container #${CONFIG.containerId} not found.`);
}

function initThreeScene() {
    // -----------------------------------------------------
    // 1. SETUP: Scene, Camera, Renderer
    // -----------------------------------------------------
    const scene = new THREE.Scene();
    
    const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.z = 5; // Move camera back to see everything

    const renderer = new THREE.WebGLRenderer({ 
        alpha: true, 
        antialias: true 
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Performance cap
    container.appendChild(renderer.domElement);

    // -----------------------------------------------------
    // 2. LIGHTING (Required for the 3D Model)
    // -----------------------------------------------------
    // Ambient Light (Soft global fill)
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    // Directional Light (Sun-like shadows/highlights)
    const dirLight = new THREE.DirectionalLight(0xffffff, 1.2);
    dirLight.position.set(5, 5, 5);
    scene.add(dirLight);

    // -----------------------------------------------------
    // 3. PARTICLE SYSTEM
    // -----------------------------------------------------
    const particlesGeometry = new THREE.BufferGeometry();
    const posArray = new Float32Array(CONFIG.particleCount * 3);

    for(let i = 0; i < CONFIG.particleCount * 3; i++) {
        // Scatter particles in a wide area (spread of 10)
        posArray[i] = (Math.random() - 0.5) * 10;
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

    const particlesMaterial = new THREE.PointsMaterial({
        size: 0.02,
        color: CONFIG.particleColor,
        transparent: true,
        opacity: 0.8
    });

    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);

    // -----------------------------------------------------
    // 4. MODEL LOADING (Draco + GLTF)
    // -----------------------------------------------------
    
    // Determine the correct URL
    // If on localhost, look in ./assets/
    // If on Webflow/Live, look in GitHub CDN
    const localPath = `./assets/${CONFIG.fileName}`;
    const cdnPath = `https://cdn.jsdelivr.net/gh/${CONFIG.ghUser}/${CONFIG.ghRepo}@${CONFIG.ghBranch}/assets/${CONFIG.fileName}`;
    
    let modelUrl = localPath;
    if (window.location.hostname.includes('webflow') || window.location.hostname.includes('yourdomain')) {
        modelUrl = cdnPath;
    }

    // Loaders
    const loader = new THREE.GLTFLoader();
    const dracoLoader = new THREE.DRACOLoader();
    
    // Point to the standard Google Draco decoder (stable)
    dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.6/');
    loader.setDRACOLoader(dracoLoader);

    let logoModel = null;

    loader.load(
        modelUrl,
        (gltf) => {
            logoModel = gltf.scene;

            // A. Center the model (Fixes offset issues)
            const box = new THREE.Box3().setFromObject(logoModel);
            const center = box.getCenter(new THREE.Vector3());
            logoModel.position.sub(center);

            // B. Initial Size (Set to 0 for pop-in effect)
            logoModel.scale.set(0, 0, 0);

            // C. Add to Scene
            scene.add(logoModel);

            // D. Pop-in Animation
            let scale = 0;
            const targetScale = 1.5; // Change this if logo is too big/small
            
            const popInInterval = setInterval(() => {
                scale += (targetScale - scale) * 0.1; // Smooth lerp
                if (scale >= targetScale - 0.01) {
                    logoModel.scale.set(targetScale, targetScale, targetScale);
                    clearInterval(popInInterval);
                } else {
                    logoModel.scale.set(scale, scale, scale);
                }
            }, 16);
        },
        undefined, // Progress callback
        (error) => {
            console.error('Error loading GLB:', error);
        }
    );

    // -----------------------------------------------------
    // 5. MOUSE INTERACTION
    // -----------------------------------------------------
    let mouseX = 0;
    let mouseY = 0;
    
    // Only track mouse if window is focused
    document.addEventListener('mousemove', (event) => {
        mouseX = event.clientX / window.innerWidth - 0.5;
        mouseY = event.clientY / window.innerHeight - 0.5;
    });

    // -----------------------------------------------------
    // 6. ANIMATION LOOP
    // -----------------------------------------------------
    const clock = new THREE.Clock();

    const animate = () => {
        const elapsedTime = clock.getElapsedTime();

        // A. Animate Particles
        particlesMesh.rotation.y = elapsedTime * 0.05;
        particlesMesh.rotation.x = mouseY * 0.1; // Subtle tilt

        // B. Animate Logo (If loaded)
        if (logoModel) {
            // Spin on Y axis (Standard spin)
            logoModel.rotation.y += 0.01; 
            
            // Add a "floating" bobbing effect
            logoModel.position.y = Math.sin(elapsedTime) * 0.1;
            
            // Subtle mouse parallax on logo
            logoModel.rotation.x = mouseY * 0.5;
            logoModel.rotation.z = mouseX * 0.5;
        }

        renderer.render(scene, camera);
        requestAnimationFrame(animate);
    };

    animate();

    // -----------------------------------------------------
    // 7. RESIZE HANDLER
    // -----------------------------------------------------
    window.addEventListener('resize', () => {
        // Update camera
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();

        // Update renderer
        renderer.setSize(container.clientWidth, container.clientHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    });
}