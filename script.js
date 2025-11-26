// A. Configuration Object
// (Keep all tweakable numbers at the top. Easier to edit later!)
const config = {
    count: 500,
    color: 0xffffff,
    size: 0.02,
    speed: 0.05
};

// B. Safety Check
const container = document.getElementById('particle-canvas');

if (container) {
    initThreeJS();
} else {
    console.error("Three.js Error: Container #particle-canvas not found.");
}

function initThreeJS() {
    // 1. Scene & Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 100);
    
    // 2. Renderer (Use alpha: true for Webflow background compatibility)
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Performance optimization
    container.appendChild(renderer.domElement);

    // 3. Object (Your Particles)
    const geometry = new THREE.TorusGeometry(10, 3, 16, 100);
    const material = new THREE.PointsMaterial({
        size: config.size,
        color: config.color
    });
    const sphere = new THREE.Points(geometry, material);
    scene.add(sphere);
    camera.position.z = 30;

    // 4. Animation
    const clock = new THREE.Clock();
    
    const animate = () => {
        const elapsedTime = clock.getElapsedTime();
        sphere.rotation.y = elapsedTime * config.speed;
        renderer.render(scene, camera);
        window.requestAnimationFrame(animate);
    };
    animate();

    // 5. Handle Resize (Critical for Webflow responsiveness)
    window.addEventListener('resize', () => {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    });
}