export const PBRMaterials = {
    // 1. Raw, unpolished aluminum straight from the mill
    millFinishAluminum: {
        color: "#e2e8f0",
        metalness: 0.85,
        roughness: 0.45,
        clearcoat: 0.1,
        envMapIntensity: 1.5,
    },

    // 2. Linear brushed aluminum (simulated via higher roughness and specific tint)
    brushedAluminum: {
        color: "#cbd5e1",
        metalness: 0.9,
        roughness: 0.35,
        clearcoat: 0.2,
        envMapIntensity: 2.0,
    },

    // 3. Highly polished, reflective stainless steel
    stainlessSteel: {
        color: "#f1f5f9",
        metalness: 1.0,
        roughness: 0.12,
        clearcoat: 0.8,
        clearcoatRoughness: 0.1,
        envMapIntensity: 2.5,
    },

    // 4. Dark, heavy, slightly matte industrial steel
    darkIndustrialSteel: {
        color: "#1e293b",
        metalness: 0.65,
        roughness: 0.6,
        clearcoat: 0.05,
        envMapIntensity: 1.2,
    },

    // 5. Aluminium Composite Panel (Glossy painted metallic surface)
    acp: {
        color: "#ffffff", // Can be overridden
        metalness: 0.3,
        roughness: 0.15,
        clearcoat: 1.0,
        clearcoatRoughness: 0.1,
        envMapIntensity: 1.8,
    },

    // 6. Transparent, reflective architectural glass
    architecturalGlass: {
        color: "#a8b8c8",
        metalness: 0.1,
        roughness: 0.05,
        transmission: 0.95, // Glass transparency
        transparent: true,
        opacity: 1,
        ior: 1.5, // Index of Refraction for glass
        thickness: 0.5,
        clearcoat: 1.0,
        envMapIntensity: 3.0,
    }
};