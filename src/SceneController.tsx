import { useScroll } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface SceneControllerProps {
    onSectionChange: (name: string) => void;
    onLightingChange: (data: { bloom: number, sun: number }) => void;
}

export default function SceneController({ onSectionChange, onLightingChange }: SceneControllerProps) {
    const scroll = useScroll();

    useFrame((state) => {
        const offset = scroll.offset;

        // 1. Determine Section Name
        let sectionName = "Deep Space";
        if (offset < 0.1) sectionName = "The Void";
        else if (offset < 0.3) sectionName = "Milky Way";
        else if (offset < 0.5) sectionName = "Solar System";
        else if (offset < 0.7) sectionName = "Arrival: Earth";
        else if (offset < 0.9) sectionName = "Mumbai Orbit";
        else sectionName = "The Landing";

        onSectionChange(sectionName);

        // 2. Lighting Modulation (Visual Washout Fix)
        let bloomInt = 1.2;
        let sunVis = 1.0;

        if (offset > 0.8) {
            // Transition from Mumbai Orbit (0.9) to Landing (1.0)
            // Yellow fades to black over 0.5s equivalent scroll
            const p = (offset - 0.8) / 0.2;
            bloomInt = THREE.MathUtils.lerp(1.2, 0.3, Math.min(p * 2, 1));
            sunVis = THREE.MathUtils.lerp(1.0, 0, Math.min(p * 2, 1));
        }

        onLightingChange({ bloom: bloomInt, sun: sunVis });

        // 3. Camera Positioning (Smooth Lerping)
        let cameraZ = 60;
        let warpFactor = 0;


        if (offset < 0.2) {
            const p = offset / 0.2;
            cameraZ = THREE.MathUtils.lerp(60, -95, p);
            warpFactor = Math.sin(p * Math.PI) * 1.5;
        } else if (offset < 0.4) {
            cameraZ = THREE.MathUtils.mapLinear(offset, 0.2, 0.4, -95, -230);
        } else if (offset < 0.6) {
            cameraZ = THREE.MathUtils.mapLinear(offset, 0.4, 0.6, -230, -290);
        } else if (offset < 0.8) {
            cameraZ = THREE.MathUtils.mapLinear(offset, 0.6, 0.8, -290, -380);
        } else {
            cameraZ = THREE.MathUtils.mapLinear(offset, 0.8, 1.0, -380, -420);
        }

        // Extremely smooth lerp for camera
        state.camera.position.z = THREE.MathUtils.lerp(state.camera.position.z, cameraZ, 0.05);

        let targetTiltX = 0;
        let targetPosY = 25;
        let targetPosX = 0;

        if (offset > 0.4 && offset <= 0.6) {
            const localP = (offset - 0.4) / 0.2;
            targetTiltX = THREE.MathUtils.lerp(0, -Math.PI / 10, localP);
            targetPosY = THREE.MathUtils.lerp(25, -25, localP);
            const orbitAngle = THREE.MathUtils.lerp(0, -Math.PI * 0.4, localP);
            state.camera.rotation.y = THREE.MathUtils.lerp(state.camera.rotation.y, orbitAngle, 0.03);
        } else if (offset > 0.6 && offset <= 0.8) {
            const localP = (offset - 0.6) / 0.2;
            targetTiltX = THREE.MathUtils.lerp(-Math.PI / 10, -Math.PI / 6, localP);
            targetPosY = THREE.MathUtils.lerp(-25, -25, localP);
            targetPosX = THREE.MathUtils.lerp(0, 5, localP);
        } else if (offset > 0.8) {
            const localP = (offset - 0.8) * 5; // Finish earlier
            targetTiltX = THREE.MathUtils.lerp(-Math.PI / 6, 0, Math.min(localP, 1));
            targetPosY = -25;
            targetPosX = 5;
            state.camera.rotation.y = THREE.MathUtils.lerp(state.camera.rotation.y, 0, 0.03);
        } else if (offset > 0.2 && offset <= 0.4) {
            targetTiltX = -Math.PI / 8;
            targetPosY = 15;
        } else {
            targetTiltX = THREE.MathUtils.mapLinear(Math.min(offset, 0.2), 0, 0.2, 0, Math.PI * 0.05);
        }

        state.camera.rotation.x = THREE.MathUtils.lerp(state.camera.rotation.x, targetTiltX, 0.03);
        state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, targetPosY, 0.05);
        state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, targetPosX, 0.05);

        if (state.camera instanceof THREE.PerspectiveCamera) {
            const targetFov = 60 + (warpFactor * 20);
            state.camera.fov = THREE.MathUtils.lerp(state.camera.fov, targetFov, 0.05);
            state.camera.updateProjectionMatrix();
        }

        // 3. Background Color Transition
        const bg = state.scene.background as THREE.Color;
        if (bg) {
            const spaceBlack = new THREE.Color('#000005');
            const deepColor = new THREE.Color('#080414');
            if (offset > 0.7) {
                const p = Math.min((offset - 0.7) * 3, 1.0);
                bg.copy(deepColor).lerp(spaceBlack, p);
            } else {
                const p = Math.min(Math.max(offset / 0.2, 0), 1);
                bg.copy(spaceBlack).lerp(deepColor, p);
            }
        }
    });

    return null;
}

