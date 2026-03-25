import { useScroll } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function SceneController() {
    const scroll = useScroll();

    useFrame((state) => {
        // Scroll ranges with 8 pages total
        // P1: 0 - 0.125  (Milky Way)
        // P2: 0.125 - 0.25 (Orion)
        // P3: 0.25 - 0.375 (Solar System)
        // P4: 0.375 - 0.5 (Earth)
        // P5: 0.5 - 0.625 (Mumbai)
        // P6-8: 0.625 - 1.0 (Business UI fade)

        const offset = scroll.offset;

        // 1. Z-Position Camera Movement Map
        let cameraZ = 60;

        if (offset < 0.125) {
            cameraZ = THREE.MathUtils.mapLinear(offset, 0, 0.125, 60, -95);
        } else if (offset < 0.25) {
            cameraZ = THREE.MathUtils.mapLinear(offset, 0.125, 0.25, -95, -230);
        } else if (offset < 0.375) {
            cameraZ = THREE.MathUtils.mapLinear(offset, 0.25, 0.375, -230, -290);
        } else if (offset < 0.5) {
            cameraZ = THREE.MathUtils.mapLinear(offset, 0.375, 0.5, -290, -380);
        } else if (offset < 0.625) {
            cameraZ = THREE.MathUtils.mapLinear(offset, 0.5, 0.625, -380, -420);
        } else {
            cameraZ = THREE.MathUtils.mapLinear(offset, 0.625, 1.0, -420, -420); // Keep at Mumbai while scrolling UI
        }

        state.camera.position.z = THREE.MathUtils.lerp(state.camera.position.z, cameraZ, 0.1);

        // 2. Camera Tilt & Orbit Movement
        let targetTiltX = 0;
        let targetPosY = 25;
        let targetPosX = 0;

        if (offset > 0.5 && offset <= 0.625) {
            // Mumbai Night: Top down transitioning to 45 degree cinematic angle
            const localP = (offset - 0.5) / 0.125;
            targetTiltX = THREE.MathUtils.lerp(-Math.PI / 2, -Math.PI / 6, localP);
            targetPosY = THREE.MathUtils.lerp(20, -25, localP);
            targetPosX = THREE.MathUtils.lerp(0, 5, localP);
        } else if (offset > 0.625) {
            // Keep static angle for Business UI
            targetTiltX = -Math.PI / 6;
            targetPosY = -25;
            targetPosX = 5;
        } else if (offset > 0.25 && offset <= 0.375) {
            // Solar System orbit view
            targetTiltX = -Math.PI / 8;
            targetPosY = 15;
        } else {
            // Milky Way and Orion Parallax
            targetTiltX = THREE.MathUtils.mapLinear(Math.min(offset, 0.125), 0, 0.125, 0, Math.PI * 0.05);
        }

        state.camera.rotation.x = THREE.MathUtils.lerp(state.camera.rotation.x, targetTiltX, 0.05);
        state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, targetPosY, 0.1);
        state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, targetPosX, 0.1);

        // 3. Background Color Transition
        const black = new THREE.Color('#000000');
        const haze = new THREE.Color('#080414');

        const bg = state.scene.background;
        if (bg instanceof THREE.Color) {
            // Fade out to pure black at the end for business HTML view
            if (offset > 0.6) {
                const p = Math.min((offset - 0.6) * 5, 1.0);
                bg.copy(haze).lerp(black, p);
            } else {
                const p = Math.min(Math.max(offset / 0.15, 0), 1);
                bg.copy(black).lerp(haze, p);
            }
        }
    });

    return null;
}
