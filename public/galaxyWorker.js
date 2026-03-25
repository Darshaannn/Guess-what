/**
 * Worker to generate galaxy star positions and colors
 */
self.onmessage = (e) => {
    const { particlesCount, branches, radius, spin } = e.data;

    const positions = new Float32Array(particlesCount * 3);
    const colors = new Float32Array(particlesCount * 3);

    const colorInside = { r: 1.0, g: 0.92, b: 0.72 }; // #ffebb8
    const colorBlue = { r: 0.66, g: 0.78, b: 1.0 }; // #a8c7ff
    const colorOrange = { r: 1.0, g: 0.54, b: 0.36 }; // #ff8a5c

    for (let i = 0; i < particlesCount; i++) {
        const i3 = i * 3;
        const distance = Math.pow(Math.random(), 3.0) * radius;
        const spinAngle = distance * spin;
        const branchAngle = ((i % branches) / branches) * Math.PI * 2;

        const randomX = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * 3;
        const randomY = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * 1.5;
        const randomZ = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * 3;

        positions[i3] = Math.cos(branchAngle + spinAngle) * distance + randomX;
        positions[i3 + 1] = randomY;
        positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * distance + randomZ;

        const mixRatio = distance / radius;
        const isBlue = Math.random() > 0.6;

        // Simple LERP in worker
        const target = isBlue ? colorBlue : colorOrange;
        colors[i3] = colorInside.r + (target.r - colorInside.r) * mixRatio;
        colors[i3 + 1] = colorInside.g + (target.g - colorInside.g) * mixRatio;
        colors[i3 + 2] = colorInside.b + (target.b - colorInside.b) * mixRatio;
    }

    // Transfer buffers to main thread with zero copy
    self.postMessage({ positions, colors }, [positions.buffer, colors.buffer]);
};
