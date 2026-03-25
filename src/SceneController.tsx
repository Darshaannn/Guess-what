import { useScroll } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function SceneController() {
    const scroll = useScroll();

    useFrame((state) => {
        // We have 10 pages total now
        // Section Mapping (Strict 1-viewport center where sections are visible)
        // S1: 0, S2: 0.2, S3: 0.4, S4: 0.6, S5: 0.8, S6: 0.9+
        const offset = scroll.offset;

        let cameraZ = 60;
        let warpFactor = 0;

        // S1 -> S2 (0 to 0.2)
        if (offset < 0.2) {
            const p = offset / 0.2;
            cameraZ = THREE.MathUtils.lerp(60, -95, p);
            warpFactor = Math.sin(p * Math.PI) * 1.5;
        }
        // S2 -> S3 (0.2 to 0.4)
        else if (offset < 0.4) {
            cameraZ = THREE.MathUtils.mapLinear(offset, 0.2, 0.4, -95, -230);
        }
        // S3 -> S4 (0.4 to 0.6)
        else if (offset < 0.6) {
            cameraZ = THREE.MathUtils.mapLinear(offset, 0.4, 0.6, -230, -290);
        }
        // S4 -> S5 (0.6 to 0.8)
        else if (offset < 0.8) {
            cameraZ = THREE.MathUtils.mapLinear(offset, 0.6, 0.8, -290, -380);
        }
        // S5 -> S6 (0.8 to 1.0)
        else {
            cameraZ = THREE.MathUtils.mapLinear(offset, 0.8, 1.0, -380, -420);
        }

        // Smoothing factor (Speed Limiter Logic included in lerp)
        state.camera.position.z = THREE.MathUtils.lerp(state.camera.position.z, cameraZ, 0.08);

        // Camera Tilt & Orbit refined for strict steps
        let targetTiltX = 0;
        let targetPosY = 25;
        let targetPosX = 0;

        if (offset > 0.6 && offset <= 0.8) {
            // Transitioning to Mumbai
            const localP = (offset - 0.6) / 0.2;
            targetTiltX = THREE.MathUtils.lerp(-Math.PI / 2, -Math.PI / 6, localP);
            targetPosY = THREE.MathUtils.lerp(20, -25, localP);
            targetPosX = THREE.MathUtils.lerp(0, 5, localP);
        } else if (offset > 0.8) {
            targetTiltX = -Math.PI / 6;
            targetPosY = -25;
            targetPosX = 5;
        } else if (offset > 0.2 && offset <= 0.4) {
            // Transitioning to Solar System
            targetTiltX = -Math.PI / 8;
            targetPosY = 15;
        } else {
            targetTiltX = THREE.MathUtils.mapLinear(Math.min(offset, 0.2), 0, 0.2, 0, Math.PI * 0.05);
        }

        state.camera.rotation.x = THREE.MathUtils.lerp(state.camera.rotation.x, targetTiltX, 0.05);
        state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, targetPosY, 0.08);
        state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, targetPosX, 0.08);

        // Warp Effect
        if (state.camera instanceof THREE.PerspectiveCamera) {
            // Smoother warp transition
            const targetFov = 60 + (warpFactor * 20);
            state.camera.fov = THREE.MathUtils.lerp(state.camera.fov, targetFov, 0.1);
            state.camera.updateProjectionMatrix();
        }

        // Background color
        const bg = state.scene.background as THREE.Color;
        if (bg) {
            if (offset > 0.7) {
                const p = Math.min((offset - 0.7) * 3, 1.0);
                bg.copy(new THREE.Color('#080414')).lerp(new THREE.Color('#000000'), p);
            } else {
                const p = Math.min(Math.max(offset / 0.2, 0), 1);
                bg.copy(new THREE.Color('#000000')).lerp(new THREE.Color('#080414'), p);
            }
        }
    });

    return null;
}
