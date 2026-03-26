/**
 * Worker to generate galaxy star positions and colors
 */
self.onmessage = (e) => {
    const { particlesCount, branches, radius, spin } = e.data;

    const positions = new Float32Array(particlesCount * 3);
    const colors = new Float32Array(particlesCount * 3);

    // Warm golden-white core
    const colorInside = { r: 1.0, g: 0.96, b: 0.8 }; // #fff5cc

    // Star Cohorts
    const colorBlue = { r: 0.5, g: 0.8, b: 1.0 };   // Hot blue-white
    const colorYellow = { r: 1.0, g: 0.9, b: 0.5 }; // Warm solar yellow
    const colorOrange = { r: 1.0, g: 0.4, b: 0.2 }; // Red-orange

    for (let i = 0; i < particlesCount; i++) {
        const i3 = i * 3;
        const distance = Math.pow(Math.random(), 2.0) * radius; // More distribution outward
        const spinAngle = distance * spin;
        const branchAngle = ((i % branches) / branches) * Math.PI * 2;

        const randomX = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * 4;
        const randomY = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * 2;
        const randomZ = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * 4;

        positions[i3] = Math.cos(branchAngle + spinAngle) * distance + randomX;
        positions[i3 + 1] = randomY;
        positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * distance + randomZ;

        const mixRatio = distance / radius;
        const rand = Math.random();

        let target;
        if (rand > 0.7) target = colorBlue;
        else if (rand > 0.3) target = colorYellow;
        else target = colorOrange;

        // Dynamic Color Mixing
        colors[i3] = colorInside.r + (target.r - colorInside.r) * mixRatio;
        colors[i3 + 1] = colorInside.g + (target.g - colorInside.g) * mixRatio;
        colors[i3 + 2] = colorInside.b + (target.b - colorInside.b) * mixRatio;
    }

    // Transfer buffers
    self.postMessage({ positions, colors }, [positions.buffer, colors.buffer]);
};

