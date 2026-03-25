import { useScroll } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function SceneController() {
    const scroll = useScroll();

    useFrame((state) => {
        const offset = scroll.offset;

        // Smooth scroll camera transitions matching Solar System quality
        let cameraZ = 60;
        let warpFactor = 0;

        // Transition from Section 1 to 2 (0 to 0.125)
        if (offset < 0.125) {
            const p = offset / 0.125;
            cameraZ = THREE.MathUtils.lerp(60, -95, p);
            // Peak warp at the middle of the transition
            warpFactor = Math.sin(p * Math.PI) * 1.5;
        }
        else if (offset < 0.25) {
            cameraZ = THREE.MathUtils.mapLinear(offset, 0.125, 0.25, -95, -230);
        } else if (offset < 0.375) {
            cameraZ = THREE.MathUtils.mapLinear(offset, 0.25, 0.375, -230, -290);
        } else if (offset < 0.5) {
            cameraZ = THREE.MathUtils.mapLinear(offset, 0.375, 0.5, -290, -380);
        } else if (offset < 0.625) {
            cameraZ = THREE.MathUtils.mapLinear(offset, 0.5, 0.625, -380, -420);
        } else {
            cameraZ = -420;
        }

        state.camera.position.z = THREE.MathUtils.lerp(state.camera.position.z, cameraZ, 0.1);

        // Communicate warp factor to global state or objects if needed
        // We'll use this factor in OrionArm or MilkyWay to stretch stars

        // Camera Tilt & Orbit
        let targetTiltX = 0;
        let targetPosY = 25;
        let targetPosX = 0;

        if (offset > 0.5 && offset <= 0.625) {
            const localP = (offset - 0.5) / 0.125;
            targetTiltX = THREE.MathUtils.lerp(-Math.PI / 2, -Math.PI / 6, localP);
            targetPosY = THREE.MathUtils.lerp(20, -25, localP);
            targetPosX = THREE.MathUtils.lerp(0, 5, localP);
        } else if (offset > 0.625) {
            targetTiltX = -Math.PI / 6;
            targetPosY = -25;
            targetPosX = 5;
        } else if (offset > 0.25 && offset <= 0.375) {
            targetTiltX = -Math.PI / 8;
            targetPosY = 15;
        } else {
            targetTiltX = THREE.MathUtils.mapLinear(Math.min(offset, 0.125), 0, 0.125, 0, Math.PI * 0.05);
        }

        state.camera.rotation.x = THREE.MathUtils.lerp(state.camera.rotation.x, targetTiltX, 0.05);
        state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, targetPosY, 0.1);
        state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, targetPosX, 0.1);

        // Apply Warp speed "motion blur" by FOV trick or post-process check
        if (state.camera instanceof THREE.PerspectiveCamera) {
            state.camera.fov = 60 + (warpFactor * 20);
            state.camera.updateProjectionMatrix();
        }

        // Background color
        const bg = state.scene.background as THREE.Color;
        if (bg) {
            if (offset > 0.6) {
                const p = Math.min((offset - 0.6) * 5, 1.0);
                bg.copy(new THREE.Color('#080414')).lerp(new THREE.Color('#000000'), p);
            } else {
                const p = Math.min(Math.max(offset / 0.15, 0), 1);
                bg.copy(new THREE.Color('#000000')).lerp(new THREE.Color('#080414'), p);
            }
        }
    });

    return null;
}
