import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { RotateCw, Maximize2, Layers, Eye, Info, Upload, Sparkles, Sliders, RefreshCw, Scissors, Image as ImageIcon, ChevronDown, Smartphone } from "lucide-react";
import { useTranslation } from "../locales/i18n";

interface Product3DViewerProps {
  productType: "bags" | "boxes" | string;
  w: number; // width or length in cm
  h: number; // height or width in cm
  d: number; // depth or height in cm
  paperType?: string; // id of paper or type name
  lamination?: "matte" | "glossy" | string;
  handleType?: "cord" | "satin" | string;
  ribbonColor?: string; // or general color specification
  finishes?: string[];
  colorsCount?: number; // colors count
  sides?: number; // active print sides (1 or 2)
  ribbonWidthCm?: number; // ribbon width in cm from admin rules
  boxStyle?: "shoulder_lid" | "sleeve_drawer" | string;
  logoFoilMode?: "none" | "gold" | "silver" | string;
}

// ── PROCEDURAL 3D IPHONE BUILDER FOR SCALE REFERENCE ─────────────────────────
const buildProceduralIPhone = (
  factor: number,
  regDisposable: <T extends THREE.BufferGeometry | THREE.Material | THREE.Texture>(obj: T) => T
): THREE.Group => {
  const phoneW = 7.15 * factor;
  const phoneH = 14.96 * factor;
  const phoneD = 0.825 * factor;
  const phoneR = 0.85 * factor; // rounded corners

  const phoneGroup = new THREE.Group();

  // 1. Sleek metallic titanium frame shape
  const shape = new THREE.Shape();
  shape.moveTo(-phoneW / 2 + phoneR, -phoneH / 2);
  shape.lineTo(phoneW / 2 - phoneR, -phoneH / 2);
  shape.quadraticCurveTo(phoneW / 2, -phoneH / 2, phoneW / 2, -phoneH / 2 + phoneR);
  shape.lineTo(phoneW / 2, phoneH / 2 - phoneR);
  shape.quadraticCurveTo(phoneW / 2, phoneH / 2, phoneW / 2 - phoneR, phoneH / 2);
  shape.lineTo(-phoneW / 2 + phoneR, phoneH / 2);
  shape.quadraticCurveTo(-phoneW / 2, phoneH / 2, -phoneW / 2, phoneH / 2 - phoneR);
  shape.lineTo(-phoneW / 2, -phoneH / 2 + phoneR);
  shape.quadraticCurveTo(-phoneW / 2, -phoneH / 2, -phoneW / 2 + phoneR, -phoneH / 2);

  const extrudeSettings = {
    depth: phoneD - 0.08 * factor,
    bevelEnabled: true,
    bevelSegments: 4,
    steps: 1,
    bevelSize: 0.04 * factor,
    bevelThickness: 0.04 * factor,
  };

  const chassisGeo = regDisposable(new THREE.ExtrudeGeometry(shape, extrudeSettings));
  // Centralize geometry so its local origin is in the middle of depth too
  chassisGeo.center();

  // Natural titanium material: sleek grey metal
  const bodyMaterial = regDisposable(new THREE.MeshPhysicalMaterial({
    color: new THREE.Color("#8A8F93"), // Space gray or natural titanium
    metalness: 0.9,
    roughness: 0.25,
    clearcoat: 0.2,
    clearcoatRoughness: 0.1,
  }));

  const chassis = new THREE.Mesh(chassisGeo, bodyMaterial);
  chassis.castShadow = true;
  chassis.receiveShadow = true;
  phoneGroup.add(chassis);

  // 2. Black Front Glass Screen
  const screenShape = new THREE.Shape();
  const screenBorder = 0.15 * factor;
  const sw = phoneW - screenBorder * 2;
  const sh = phoneH - screenBorder * 2;
  const sr = (0.85 - 0.15) * factor;

  screenShape.moveTo(-sw / 2 + sr, -sh / 2);
  screenShape.lineTo(sw / 2 - sr, -sh / 2);
  screenShape.quadraticCurveTo(sw / 2, -sh / 2, sw / 2, -sh / 2 + sr);
  screenShape.lineTo(sw / 2, sh / 2 - sr);
  screenShape.quadraticCurveTo(sw / 2, sh / 2, sw / 2 - sr, sh / 2);
  screenShape.lineTo(-sw / 2 + sr, sh / 2);
  screenShape.quadraticCurveTo(-sw / 2, sh / 2, -sw / 2, sh / 2 - sr);
  screenShape.lineTo(-sw / 2, -sh / 2 + sr);
  screenShape.quadraticCurveTo(-sw / 2, -sh / 2, -sw / 2 + sr, -sh / 2);

  const screenExtrudeSettings = {
    depth: 0.01 * factor,
    bevelEnabled: false,
  };

  const screenGeo = regDisposable(new THREE.ExtrudeGeometry(screenShape, screenExtrudeSettings));
  screenGeo.center();

  // Smooth, high-gloss screen element
  const screenMaterial = regDisposable(new THREE.MeshPhysicalMaterial({
    color: new THREE.Color("#08080c"), // Glossy black screen
    metalness: 0.1,
    roughness: 0.05,
    clearcoat: 1.0,
    clearcoatRoughness: 0.02,
  }));

  const screen = new THREE.Mesh(screenGeo, screenMaterial);
  // Place screen on the front side of the phone chassis
  screen.position.z = phoneD / 2 + 0.005 * factor;
  phoneGroup.add(screen);

  // 3. Dynamic Island Pill Shape (Front Screen Detail)
  const pillGeo = regDisposable(new THREE.CapsuleGeometry(0.12 * factor, 0.45 * factor, 4, 12));
  pillGeo.rotateZ(Math.PI / 2); // Rotate to lay horizontal
  const pillMat = regDisposable(new THREE.MeshBasicMaterial({ color: "#000000" }));
  const pill = new THREE.Mesh(pillGeo, pillMat);
  pill.position.set(0, sh / 2 - 0.6 * factor, phoneD / 2 + 0.011 * factor);
  phoneGroup.add(pill);

  // 4. Back camera square plate base (iPhone iconic design)
  const plateW = 2.8 * factor;
  const plateShape = new THREE.Shape();
  const plateR = 0.4 * factor;
  plateShape.moveTo(-plateW / 2 + plateR, -plateW / 2);
  plateShape.lineTo(plateW / 2 - plateR, -plateW / 2);
  plateShape.quadraticCurveTo(plateW / 2, -plateW / 2, plateW / 2, -plateW / 2 + plateR);
  plateShape.lineTo(plateW / 2, plateW / 2 - plateR);
  plateShape.quadraticCurveTo(plateW / 2, plateW / 2, plateW / 2 - plateR, plateW / 2);
  plateShape.lineTo(-plateW / 2 + plateR, plateW / 2);
  plateShape.quadraticCurveTo(-plateW / 2, plateW / 2, -plateW / 2, plateW / 2 - plateR);
  plateShape.lineTo(-plateW / 2, -plateW / 2 + plateR);
  plateShape.quadraticCurveTo(-plateW / 2, -plateW / 2, -plateW / 2 + plateR, -plateW / 2);

  const plateExtrSettings = {
    depth: 0.1 * factor,
    bevelEnabled: true,
    bevelSegments: 2,
    steps: 1,
    bevelSize: 0.02 * factor,
    bevelThickness: 0.02 * factor,
  };
  const plateGeo = regDisposable(new THREE.ExtrudeGeometry(plateShape, plateExtrSettings));
  plateGeo.center();

  // Shiny glass-like camera base
  const plateMat = regDisposable(new THREE.MeshPhysicalMaterial({
    color: new THREE.Color("#4C4F52"),
    metalness: 0.4,
    roughness: 0.1,
    clearcoat: 1.0,
    clearcoatRoughness: 0.05,
  }));

  const cameraPlate = new THREE.Mesh(plateGeo, plateMat);
  cameraPlate.position.set(-phoneW / 2 + 1.65 * factor, phoneH / 2 - 1.65 * factor, -phoneD / 2 - 0.05 * factor);
  phoneGroup.add(cameraPlate);

  // 5. Classic Triple Ring Camera Lenses
  const lensPositions = [
    { x: -0.6 * factor, y: 0.6 * factor },   // Top-left
    { x: -0.6 * factor, y: -0.6 * factor },  // Bottom-left
    { x: 0.6 * factor, y: 0.0 }              // Right-center
  ];

  lensPositions.forEach((pos) => {
    // Elegant bezel rings
    const ringGeo = regDisposable(new THREE.CylinderGeometry(0.42 * factor, 0.42 * factor, 0.15 * factor, 16));
    ringGeo.rotateX(Math.PI / 2);
    const ringMat = regDisposable(new THREE.MeshPhysicalMaterial({ color: "#2A2B2D", metalness: 0.9, roughness: 0.1 }));
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.position.set(cameraPlate.position.x + pos.x, cameraPlate.position.y + pos.y, cameraPlate.position.z - 0.08 * factor);
    phoneGroup.add(ring);

    // Dark lens glass center
    const glassGeo = regDisposable(new THREE.CylinderGeometry(0.32 * factor, 0.32 * factor, 0.16 * factor, 16));
    glassGeo.rotateX(Math.PI / 2);
    const glassMat = regDisposable(new THREE.MeshPhysicalMaterial({ color: "#050505", roughness: 0.02, metalness: 0.5, clearcoat: 1.0 }));
    const glass = new THREE.Mesh(glassGeo, glassMat);
    glass.position.set(cameraPlate.position.x + pos.x, cameraPlate.position.y + pos.y, cameraPlate.position.z - 0.09 * factor);
    phoneGroup.add(glass);
  });

  // 6. Realistic Side Buttons
  const btnMat = regDisposable(new THREE.MeshPhysicalMaterial({ color: "#5F6265", metalness: 0.8, roughness: 0.3 }));

  // Power button on right side
  const powerBtnGeo = regDisposable(new THREE.BoxGeometry(0.04 * factor, 0.9 * factor, 0.12 * factor));
  const powerBtn = new THREE.Mesh(powerBtnGeo, btnMat);
  powerBtn.position.set(phoneW / 2 + 0.02 * factor, 1.2 * factor, 0);
  phoneGroup.add(powerBtn);

  // Volume buttons on left side
  const volUpGeo = regDisposable(new THREE.BoxGeometry(0.04 * factor, 0.45 * factor, 0.12 * factor));
  const volUp = new THREE.Mesh(volUpGeo, btnMat);
  volUp.position.set(-phoneW / 2 - 0.02 * factor, 1.4 * factor, 0);
  phoneGroup.add(volUp);

  const volDownGeo = regDisposable(new THREE.BoxGeometry(0.04 * factor, 0.45 * factor, 0.12 * factor));
  const volDown = new THREE.Mesh(volDownGeo, btnMat);
  volDown.position.set(-phoneW / 2 - 0.02 * factor, 0.82 * factor, 0);
  phoneGroup.add(volDown);

  return phoneGroup;
};

export const Product3DViewer: React.FC<Product3DViewerProps> = ({
  productType,
  w = 20,
  h = 25,
  d = 8,
  paperType = "p1",
  lamination = "matte",
  handleType = "cord",
  ribbonColor = "#3A2010",
  finishes = [],
  colorsCount = 1,
  sides = 1,
  ribbonWidthCm = 2.0,
  boxStyle = "shoulder_lid",
  logoFoilMode = "none",
}) => {
  const { t } = useTranslation();
  const containerRef = useRef<HTMLDivElement>(null);
  const [autoRotate, setAutoRotate] = useState<boolean>(false);
  const [showGuidelines, setShowGuidelines] = useState<boolean>(true);
  const [compareSize, setCompareSize] = useState<boolean>(false);
  const [bagBaseColor, setBagBaseColor] = useState<string>("#ff2300"); // default is the premium brand Red of Capsule Lab!
  const [bagHandleColor, setBagHandleColor] = useState<string>(""); // empty means auto-matched
  const [isOpen, setIsOpen] = useState<boolean>(true); // Collapsible dropdown state - OPEN by default for rich visual presentation!
  const [handlePose, setHandlePose] = useState<"upright" | "draped">("draped");

  // Reset custom color selections back to paper natural default when the user changes paperType or productType spec
  useEffect(() => {
    setBagBaseColor("");
    setBagHandleColor("");
  }, [paperType, productType]);




  // Beautiful soft procedural shadow creator
  const createContactShadowTexture = () => {
    const canvas = document.createElement("canvas");
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    const grad = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
    grad.addColorStop(0, "rgba(20, 15, 10, 0.45)");
    grad.addColorStop(0.35, "rgba(20, 15, 10, 0.28)");
    grad.addColorStop(0.7, "rgba(20, 15, 10, 0.08)");
    grad.addColorStop(1, "rgba(20, 15, 10, 0)");

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 128, 128);

    const tex = new THREE.CanvasTexture(canvas);
    return tex;
  };

  // Soft textured paper grain & linen weave generator for extreme realism!
  const createPremiumPaperTexture = (type: string) => {
    const canvas = document.createElement("canvas");
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    ctx.fillStyle = "#808080";
    ctx.fillRect(0, 0, 256, 256);

    const imgData = ctx.getImageData(0, 0, 256, 256);
    const data = imgData.data;

    const isKraft = type === "p3" || type === "box_kraft" || type?.toLowerCase().includes("kraft");
    const isLinen = type === "linen" || type === "p5" || type?.toLowerCase().includes("linen") || type?.toLowerCase().includes("premium") || type === "p1"; // standard white can also have micro-texture

    for (let y = 0; y < 256; y++) {
      for (let x = 0; x < 256; x++) {
        const idx = (y * 256 + x) * 4;
        let noise = (Math.random() - 0.5) * 9; // base fine grain noise

        if (isKraft) {
          // Add organic dark pulp specks
          if (Math.random() < 0.015) {
            noise -= 32;
          }
          if (Math.random() < 0.005) {
            // Wood pulp fiber strands
            const len = Math.floor(Math.random() * 4) + 2;
            for (let step = 0; step < len; step++) {
              const ny = (y + step) % 256;
              const nx = (x + step) % 256;
              const nIdx = (ny * 256 + nx) * 4;
              if (nIdx < data.length) {
                data[nIdx] = 85;
                data[nIdx + 1] = 85;
                data[nIdx + 2] = 85;
              }
            }
          }
        } else if (isLinen) {
          // Cross-hatch linen weave texture pattern
          const weave = (Math.sin(x * 12.0) + Math.sin(y * 12.0)) * 6;
          noise += weave;
        }

        data[idx] = Math.max(0, Math.min(255, data[idx] + noise));
        data[idx + 1] = Math.max(0, Math.min(255, data[idx + 1] + noise));
        data[idx + 2] = Math.max(0, Math.min(255, data[idx + 2] + noise));
      }
    }

    ctx.putImageData(imgData, 0, 0);
    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;

    if (isLinen) {
      tex.repeat.set(16, 16);
    } else if (isKraft) {
      tex.repeat.set(5, 5);
    } else {
      tex.repeat.set(8, 8);
    }

    return tex;
  };

  // Generate exquisite twisted/braided rope fiber textures for polycords
  const createRopeTexture = (colorHex: string) => {
    const canvas = document.createElement("canvas");
    canvas.width = 256;
    canvas.height = 64;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    // Gray bump-map base represents mid-height
    ctx.fillStyle = "#7F7F7F";
    ctx.fillRect(0, 0, 256, 64);

    // Draw high-fidelity 3D interlocking braided twine strands
    // We paint beautiful overlapping diagonal threads with soft shadow & highlight gradients 
    ctx.lineWidth = 6;
    
    // Draw columns of interlocking braided chevrons for genuine braided rope appearance
    for (let xOffset = -64; xOffset < 320; xOffset += 16) {
      // Forward strand group (falling left-to-right)
      const gradForw = ctx.createLinearGradient(xOffset, 0, xOffset + 32, 64);
      gradForw.addColorStop(0, "#222222");     // Deep root joint shadow
      gradForw.addColorStop(0.2, "#8a8a8a");   // Strand body transitions
      gradForw.addColorStop(0.5, "#ffffff");   // Peak highlight bulge
      gradForw.addColorStop(0.8, "#8a8a8a");   // Back down
      gradForw.addColorStop(1, "#222222");     // Deep root joint shadow

      ctx.strokeStyle = gradForw;
      ctx.beginPath();
      ctx.moveTo(xOffset, -4);
      ctx.lineTo(xOffset + 32, 68);
      ctx.stroke();

      // Interlocking back strand group (rising left-to-right) spaced perfectly to weave
      const gradBack = ctx.createLinearGradient(xOffset + 12, 0, xOffset - 20, 64);
      gradBack.addColorStop(0, "#111111");     // Extreme occlusion shadow (creates 3D overlap)
      gradBack.addColorStop(0.2, "#707070");   
      gradBack.addColorStop(0.5, "#ececec");   // Fiber crown highlight
      gradBack.addColorStop(0.8, "#707070");   
      gradBack.addColorStop(1, "#111111");     // occluding crease shadow

      ctx.strokeStyle = gradBack;
      ctx.beginPath();
      ctx.moveTo(xOffset + 24, -4);
      ctx.lineTo(xOffset - 8, 68);
      ctx.stroke();
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(16, 1);
    return tex;
  };

  // Generate gorgeous ribbed/woven grosgrain fabric textures for luxury ribbons
  const createRibbonWeaveTexture = () => {
    const canvas = document.createElement("canvas");
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    ctx.fillStyle = "#808080";
    ctx.fillRect(0, 0, 64, 64);

    const imgData = ctx.getImageData(0, 0, 64, 64);
    const data = imgData.data;

    for (let y = 0; y < 64; y++) {
      for (let x = 0; x < 64; x++) {
        const idx = (y * 64 + x) * 4;
        // High-end grosgrain ribbed horizontal lines combined with fine vertical weaving
        const rib = Math.sin(y / 1.2) * 22; 
        const weave = Math.sin((x + y) / 0.5) * 8; 
        const val = Math.max(0, Math.min(255, 128 + rib + weave));
        data[idx] = val;
        data[idx + 1] = val;
        data[idx + 2] = val;
      }
    }

    ctx.putImageData(imgData, 0, 0);
    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(32, 1); // beautifully tiled along the ribbon path length!
    return tex;
  };

  // Mathematical high-precision ribbon sweep geometry generator (eliminates 3D Frenet twists!)
  const createPremiumRibbonGeometry = (
    curve: THREE.CatmullRomCurve3,
    ribbonWidth: number,
    thickness: number,
    isBack: boolean,
    N = 48
  ) => {
    const geom = new THREE.BufferGeometry();
    const points = curve.getPoints(N);
    const verticesList: THREE.Vector3[] = [];
    const uvsList: THREE.Vector2[] = [];

    for (let i = 0; i <= N; i++) {
      const t = i / N;
      const p = points[i];

      // Slanted tangent along path
      const tangent = curve.getTangentAt(t).normalize();

      // Rotating normal reference in the Y-Z plane to prevent standard Frenet ribbon twisting!
      const phi = t * Math.PI;
      const refVec = new THREE.Vector3(0, Math.sin(phi), isBack ? -Math.cos(phi) : Math.cos(phi));

      // Width vector: orthogonal to tangent and plane orientation
      let widthVec = new THREE.Vector3().crossVectors(tangent, refVec);
      if (widthVec.lengthSq() < 0.0001) {
        widthVec.set(1, 0, 0);
      } else {
        widthVec.normalize();
      }

      // Orthogonal thick vector (out of ribbon plane)
      const thickVec = new THREE.Vector3().crossVectors(tangent, widthVec).normalize();

      const halfW = ribbonWidth / 2;
      const halfT = thickness / 2;

      // 4 points of cross-section quad box
      const c1 = p.clone().addScaledVector(widthVec, halfW).addScaledVector(thickVec, halfT);
      const c2 = p.clone().addScaledVector(widthVec, -halfW).addScaledVector(thickVec, halfT);
      const c3 = p.clone().addScaledVector(widthVec, -halfW).addScaledVector(thickVec, -halfT);
      const c4 = p.clone().addScaledVector(widthVec, halfW).addScaledVector(thickVec, -halfT);

      verticesList.push(c1, c2, c3, c4);

      // Repeat texture elegantly along length
      uvsList.push(
        new THREE.Vector2(t, 0),
        new THREE.Vector2(t, 0.33),
        new THREE.Vector2(t, 0.66),
        new THREE.Vector2(t, 1)
      );
    }

    const indices: number[] = [];
    for (let i = 0; i < N; i++) {
      const curr = i * 4;
      const next = (i + 1) * 4;

      // Wrap ribbon faces properly
      indices.push(curr, next, curr + 1);
      indices.push(next, next + 1, curr + 1);

      indices.push(curr + 1, next + 1, curr + 2);
      indices.push(next + 1, next + 2, curr + 2);

      indices.push(curr + 2, next + 2, curr + 3);
      indices.push(next + 2, next + 3, curr + 3);

      indices.push(curr + 3, next + 3, curr);
      indices.push(next + 3, next, curr);
    }

    // Start-side Cap
    indices.push(0, 1, 2);
    indices.push(0, 2, 3);

    // End-side Cap
    const last = N * 4;
    indices.push(last, last + 2, last + 1);
    indices.push(last, last + 3, last + 2);

    const positionsFloat = new Float32Array(verticesList.length * 3);
    const uvsFloat = new Float32Array(uvsList.length * 2);

    for (let i = 0; i < verticesList.length; i++) {
      positionsFloat[i * 3] = verticesList[i].x;
      positionsFloat[i * 3 + 1] = verticesList[i].y;
      positionsFloat[i * 3 + 2] = verticesList[i].z;

      uvsFloat[i * 2] = uvsList[i].x;
      uvsFloat[i * 2 + 1] = uvsList[i].y;
    }

    geom.setAttribute("position", new THREE.BufferAttribute(positionsFloat, 3));
    geom.setAttribute("uv", new THREE.BufferAttribute(uvsFloat, 2));
    geom.setIndex(indices);
    geom.computeVertexNormals();
    return geom;
  };

  // Base paper default colors
  const getPaperColorInfo = () => {
    // Kraft
    if (paperType === "p3" || paperType === "box_kraft" || paperType?.toLowerCase().includes("kraft")) {
      return { color: "#C59B6D", roughness: 0.95, metalness: 0.05, name: "Kraft (Կրաֆտ)", grain: 0.008 };
    }
    // Coated / Chalk cards
    if (paperType === "p4" || paperType?.toLowerCase().includes("chalk") || paperType?.toLowerCase().includes("cardboard")) {
      return { color: "#FAFAFA", roughness: (lamination === "glossy" || lamination === "gloss") ? 0.15 : 0.72, metalness: 0.0, name: "Chalk board / Coated", grain: 0.003 };
    }
    // Default white paper
    return { color: "#F7F6F3", roughness: (lamination === "glossy" || lamination === "gloss") ? 0.15 : 0.65, metalness: 0.0, name: "Premium White", grain: 0.004 };
  };

  const paperConfig = getPaperColorInfo();
  const baseHexColor = bagBaseColor || paperConfig.color;

  // Track state changes inside a ref for the animate loop to access without recreating scene
  const paramsRef = useRef({
    productType, w, h, d, paperType, lamination, handleType, ribbonColor, finishes, colorsCount, baseHexColor,
    grainScale: paperConfig.grain, sides, handlePose, bagHandleColor, ribbonWidthCm, boxStyle, compareSize, showGuidelines, logoFoilMode
  });

  useEffect(() => {
    paramsRef.current = {
      productType, w, h, d, paperType, lamination, handleType, ribbonColor, finishes, colorsCount, baseHexColor,
      grainScale: paperConfig.grain, sides, handlePose, bagHandleColor, ribbonWidthCm, boxStyle, compareSize, showGuidelines, logoFoilMode
    };
  }, [productType, w, h, d, paperType, lamination, handleType, ribbonColor, finishes, colorsCount, baseHexColor, paperConfig.grain, sides, handlePose, bagHandleColor, ribbonWidthCm, boxStyle, compareSize, showGuidelines, logoFoilMode]);

  useEffect(() => {
    if (!containerRef.current || !w || !h) return;

    let isIntersecting = true;
    let observer: IntersectionObserver | null = null;
    if (typeof window !== "undefined" && "IntersectionObserver" in window) {
      observer = new IntersectionObserver(([entry]) => {
        isIntersecting = entry.isIntersecting;
      }, { threshold: 0.05 });
      observer.observe(containerRef.current);
    }

    // Disposable tracking array for memory cleanup (declared early)
    const disposables: (THREE.BufferGeometry | THREE.Material | THREE.Texture)[] = [];

    const regDisposable = <T extends THREE.BufferGeometry | THREE.Material | THREE.Texture>(obj: T): T => {
      disposables.push(obj);
      return obj;
    };

    // ── SCENE & RENDERER SETUP ──────────────────────────────────────────────
    const width = containerRef.current.clientWidth || 400;
    const height = containerRef.current.clientHeight || 380;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#FAF8F5"); // Premium studio off-white
    scene.fog = new THREE.FogExp2("#FAF8F5", 0.012);

    const camera = new THREE.PerspectiveCamera(36, width / height, 0.1, 1000);
    camera.position.set(0, 10, 27); // Flawless dramatic portrait angle for packaging

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.max(1.5, Math.min(window.devicePixelRatio, 3))); // High-DPI professional render quality (minimum 1.5x up to 3x)
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    renderer.outputColorSpace = THREE.SRGBColorSpace; // Guarantees 100% color-correct output to match UI pickers
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15; // Premium gloss exposure highlight profile


    // Clear old canvases
    containerRef.current.innerHTML = "";
    containerRef.current.appendChild(renderer.domElement);

    // ── CONTROLS ────────────────────────────────────────────────────────────
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxPolarAngle = Math.PI / 2 + 0.03; // Stay above studio ground level
    controls.minDistance = 7;
    controls.maxDistance = 45;
    controls.target.set(0, 0, 0); // Will be dynamically centered in buildProductModel

    // ── FOUR-POINT HIGH-END STUDIO LIGHTING (LUX PORTRAIT STANDARD) ─────────
    const ambientLight = new THREE.AmbientLight("#ffffff", 0.45); // balanced environmental studio glow
    scene.add(ambientLight);

    // 1. Pristine Broadcast Key Studio Light (Neutral white for 100% color correctness)
    const keyLight = new THREE.DirectionalLight("#ffffff", 1.95);
    keyLight.position.set(12, 15, 12);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 2048;
    keyLight.shadow.mapSize.height = 2048;
    keyLight.shadow.bias = -0.00018; // Pristine close shadow mapping contact
    keyLight.shadow.radius = 10.0;   // Ultra-soft photorealistic shadow blur! (Upgraded from 6.0)
    keyLight.shadow.camera.near = 0.5;
    keyLight.shadow.camera.far = 70;
    const dLightSize = 12;
    keyLight.shadow.camera.left = -dLightSize;
    keyLight.shadow.camera.right = dLightSize;
    keyLight.shadow.camera.top = dLightSize;
    keyLight.shadow.camera.bottom = -dLightSize;
    scene.add(keyLight);

    // 2. Neutral Diffuse Fill Light (Ensures no blue or warm color temperature shifting)
    const fillLight = new THREE.DirectionalLight("#ffffff", 0.95);
    fillLight.position.set(-12, 7, 10);
    scene.add(fillLight);

    // 3. Crisp Back Rim Light (highlighting crisp edges of paper materials)
    const rimLight = new THREE.DirectionalLight("#ffffff", 2.3);
    rimLight.position.set(-8, 16, -12);
    scene.add(rimLight);

    // 4. Floor Reflection Bouce Light (Neutralized to preserve exact base hue)
    const bounceLight = new THREE.DirectionalLight("#ffffff", 0.55);
    bounceLight.position.set(0, -6, 0);
    scene.add(bounceLight);

    // 5. Upgrade: Overhead Studio Spotlight (emphasizes beautiful physical geometry & handles instantly)
    const overheadLight = new THREE.DirectionalLight("#FFFFFF", 0.65);
    overheadLight.position.set(0, 18, 0);
    scene.add(overheadLight);

    // ── CYCLORAMA BACKDROP SWEEP (PORTRAIT STUDIO FEEL WITH PROCEDURAL VIGNETTE) ──
    const backdropGeo = new THREE.PlaneGeometry(160, 110, 32, 20);
    const posAttr = backdropGeo.attributes.position;
    for (let i = 0; i < posAttr.count; i++) {
       const y = posAttr.getY(i);
       if (y > 0) {
         // Bend upwards smoothly to form seamless background gradient sweep
         posAttr.setY(i, y + Math.pow(y / 15, 2.5));
       }
    }
    backdropGeo.computeVertexNormals();

    // Procedural canvas to render high-res photographers' light bloom behind the 3D pack
    const createStudioGradientTexture = () => {
      const canvas = document.createElement("canvas");
      canvas.width = 512;
      canvas.height = 512;
      const ctx = canvas.getContext("2d");
      if (!ctx) return null;

      const grad = ctx.createRadialGradient(256, 320, 20, 256, 256, 360);
      grad.addColorStop(0, "#FEFDFB"); // Pristine direct studio focal light
      grad.addColorStop(0.5, "#F7F5F2"); // Gradual floor sweep
      grad.addColorStop(1, "#E8E5DF"); // Balanced rich warm vignettes for dramatic studio corners
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 512, 512);

      const texture = new THREE.CanvasTexture(canvas);
      texture.colorSpace = THREE.SRGBColorSpace;
      return texture;
    };
    const backdropTex = regDisposable(createStudioGradientTexture()!);

    const backdropMat = new THREE.MeshStandardMaterial({
       map: backdropTex || undefined,
       roughness: 0.95,
       metalness: 0.0,
       side: THREE.DoubleSide
    });
    const backdrop = new THREE.Mesh(backdropGeo, backdropMat);
    backdrop.rotation.x = -Math.PI / 2;
    backdrop.position.set(0, -4.5, -8); // Sitting perfectly at design floor height of -4.5
    backdrop.receiveShadow = true;
    scene.add(backdrop);

    // ── GEOMETRY GROUPS & RE-BUILD LOGIC ─────────────────────────────────────
    const productGroup = new THREE.Group();
    scene.add(productGroup);

    const helperLinesGroup = new THREE.Group();
    scene.add(helperLinesGroup);

    const drawBrandLogoPath = (ctx: CanvasRenderingContext2D, color: string) => {
      ctx.fillStyle = color;
      const pathD = "M31.2642 73.1904C25.5856 73.1904 20.6542 71.8318 16.4701 69.1156C12.3458 66.3391 9.1478 62.6262 6.87642 57.979C4.60494 53.2704 3.4693 48.0804 3.4693 42.4058C3.4693 37.8781 4.18662 33.6521 5.62117 29.7296C7.05572 25.7458 9.05814 22.2752 11.6284 19.3168C14.1986 16.3584 17.1575 14.0357 20.5049 12.3449C23.8521 10.6541 27.4385 9.80969 31.2642 9.80969C36.2253 9.80969 40.4993 10.5345 44.0857 11.983C47.6721 13.3703 50.2725 15.0611 51.8864 17.0535C53.0212 18.4407 53.6797 20.3738 53.859 22.8477C54.0383 25.3226 54.1279 27.9182 54.1279 30.6343H52.3348C51.1985 24.7195 49.0761 20.3738 45.9685 17.5963C42.9201 14.8188 38.9151 13.4316 33.954 13.4316C30.0686 13.4316 26.4821 14.3373 23.1946 16.1478C19.9071 17.9582 17.2771 20.9759 15.3045 25.202C13.3916 29.4281 12.4354 35.162 12.4354 42.4058C12.4354 45.7854 12.8239 49.1057 13.601 52.3657C14.4377 55.5644 15.7228 58.4615 17.4564 61.0571C19.1898 63.6536 24.7215 60.6144 27.4113 62.1836C30.1608 63.6935 30.1284 69.5685 33.954 69.5685C38.437 69.5685 42.2924 68.4818 45.5202 66.3095C48.7482 64.1361 51.6174 60.9968 54.1279 56.8923L55.9212 58.2509C53.052 63.9255 49.5552 67.848 45.4306 70.0213C41.3061 72.1333 36.584 73.1904 31.2642 73.1904ZM114.921 71.8318C113.607 71.8318 111.992 71.5905 110.079 71.108C108.167 70.5642 106.284 69.4785 104.431 67.848C102.578 66.1572 100.994 63.5626 99.6781 60.0614L97.4373 54.1762L84.8844 50.5543L72.3319 54.1762L65.159 71.3799H61.1243L86.2293 11.6201H88.9187L108.644 60.0614C110.079 63.441 111.455 65.827 112.769 67.2142C114.084 68.5431 115.997 69.3272 118.507 69.5685V71.3799C117.431 71.6805 116.236 71.8318 114.921 71.8318ZM73.6768 50.5543L84.8844 46.9324L95.6432 50.5543L84.8844 24.2963L73.6768 50.5543ZM125.569 71.3799V22.4858C125.569 19.7697 125.182 17.5963 124.404 15.9668C123.686 14.276 121.983 13.4316 119.293 13.4316H117.5V11.6201H140.812C142.367 11.6201 144.1 11.7408 146.012 11.983C147.984 12.164 149.957 12.6168 151.929 13.3406C153.963 14.0041 155.816 15.0008 157.488 16.3287C159.223 17.6577 160.597 19.4078 161.613 21.5801C162.689 23.7534 163.227 26.4696 163.227 29.7296C163.227 32.8077 162.719 35.4042 161.702 37.5162C160.687 39.569 159.342 41.2281 157.668 42.4957C156.054 43.7633 154.35 44.7304 152.557 45.3939C150.764 45.998 149.061 46.4192 147.447 46.6615C145.833 46.8424 144.519 46.9324 143.502 46.9324H133.639V71.3799H125.569ZM140.363 43.7633C141.619 43.7633 143.024 43.5221 144.577 43.0396C146.133 42.5571 147.657 41.7423 149.15 40.5943C150.645 39.4473 151.871 37.9691 152.826 36.1577C153.783 34.2859 154.261 31.9929 154.261 29.2768C154.261 26.5606 153.783 24.2963 152.826 22.4858C151.871 20.614 150.645 19.1062 149.15 17.9582C147.657 16.8112 146.133 15.9965 144.577 15.514C143.024 15.0314 141.619 14.7892 140.363 14.7892C139.229 14.7892 138.033 14.8801 136.777 15.0611C135.582 15.242 134.535 15.4526 133.639 15.6949V22.4858L136.777 29.2768L133.639 36.1577V42.8586C134.535 43.0999 135.582 43.3105 136.777 43.4924C138.033 43.6734 139.229 43.7633 140.363 43.7633ZM190.822 72.9184C188.43 72.9184 186.009 72.6475 183.559 72.1037C181.167 71.6212 178.955 70.8974 176.924 69.9304C174.952 68.9643 173.367 67.8183 172.172 66.4904C170.975 65.1022 170.379 63.5626 170.379 61.8728V52.1838H171.992C173.009 58.2806 174.98 62.6579 177.91 65.3128C180.898 67.9686 184.933 69.2965 190.015 69.2965C192.046 69.2965 193.96 68.9643 195.753 68.3009C197.546 67.5771 198.98 66.5201 200.057 65.1318C201.191 63.7446 201.76 62.0538 201.76 60.0614C201.76 57.4065 200.923 55.1422 199.249 53.2704C197.636 51.3987 195.184 49.4972 191.897 47.5662L184.318 46.6615L180.869 40.9572C177.043 38.6632 174.324 36.3386 172.71 33.9853C171.155 31.631 170.379 28.7636 170.379 25.3829C170.379 20.7357 171.962 17.0238 175.131 14.2463C178.359 11.4095 182.573 9.99064 187.773 9.99064C189.983 9.99064 192.225 10.2329 194.498 10.7154C196.768 11.1979 198.86 11.9217 200.774 12.8877C202.686 13.7935 204.21 14.9098 205.347 16.2387C206.542 17.5667 207.14 19.1062 207.14 20.8563V30.5444H205.526C204.509 24.4486 202.567 20.1019 199.698 17.5064C196.828 14.9098 192.853 13.6125 187.773 13.6125C186.038 13.6125 184.366 14.0041 182.752 14.7892C181.139 15.514 179.823 16.571 178.807 17.9582C177.85 19.2871 177.373 20.886 177.373 22.7578C177.373 25.3533 178.209 27.4949 179.883 29.1858C181.556 30.8766 184.037 32.6881 187.324 34.6191L198.353 41.2281C202.178 43.5221 204.988 45.7557 206.781 47.9291C208.574 50.0411 209.471 52.7879 209.471 56.1686C209.471 61.239 207.796 65.3128 204.45 68.3918C201.101 71.4096 196.56 72.9184 190.822 72.9184ZM245.085 72.2846C239.286 72.2846 234.714 71.2889 231.367 69.2965C228.018 67.3052 225.657 64.3467 224.283 60.4233C222.907 56.4395 222.221 51.4896 222.221 45.5748V22.4858C222.221 19.7697 221.831 17.5963 221.055 15.9668C220.339 14.276 218.634 13.4316 215.945 13.4316H214.152V11.6201H222.221C224.312 11.6201 225.926 11.8921 227.063 12.4359C228.258 12.9787 229.094 14.0358 229.573 15.6049C230.051 17.1731 230.29 19.4681 230.29 22.4858V48.291C230.29 54.629 231.456 59.6085 233.787 63.2304C236.118 66.8523 240.243 68.6627 246.16 68.6627C250.762 68.6627 254.378 67.848 257.009 66.2185C259.639 64.589 258.114 59.5482 259.251 56.1686C260.386 52.7276 264.362 50.8865 264.362 45.5748V11.6201H267.948V45.5748C267.948 51.4896 267.32 56.4395 266.065 60.4233C264.81 64.3467 262.538 67.3052 259.251 69.2965C255.963 71.2889 251.241 72.2846 245.085 72.2846ZM284.402 71.3799V57.9391V45.2068V34.5956V22.4858C284.402 19.7697 284.014 17.5963 283.237 15.9668C282.519 14.276 280.816 13.4316 278.126 13.4316H276.332V11.6201H284.402C286.496 11.6201 288.109 11.8921 289.244 12.4359C290.441 12.9787 291.277 14.0358 291.754 15.6049C292.234 17.1731 292.472 19.4681 292.472 22.4858V67.758H324.301V71.3799H284.402ZM332.735 71.3799V22.4858C332.735 19.7697 332.346 17.5963 331.57 15.9668C330.852 14.276 329.149 13.4316 326.458 13.4316H324.665V11.6201H362.861C364.954 11.6201 366.537 11.983 367.613 12.7068C368.689 13.3703 369.437 14.276 369.855 15.423C370.274 16.5096 370.482 17.6576 370.482 18.8639V25.6549H368.689C368.689 22.033 367.703 19.4078 365.73 17.7773C363.818 16.0864 361.068 15.242 357.481 15.242H340.805V38.7839H353.132H365.013V42.4058H358.736H353.132H348.228H340.805V67.758H356.496C360.561 67.758 363.758 67.0036 366.089 65.4937C368.481 63.9848 370.363 61.42 371.738 57.7981L373.531 58.2509L370.392 66.8523C369.915 68.2405 369.108 69.3579 367.972 70.2023C366.896 70.9874 365.461 71.3799 363.668 71.3799H332.735Z";
      const p2d = new Path2D(pathD);
      ctx.save();
      const scale = 2.4;
      ctx.translate((1024 - (380 * scale)) / 2, (256 - (80 * scale)) / 2);
      ctx.scale(scale, scale);
      ctx.fill(p2d);
      ctx.restore();
    };

    const createBrandLogoTexture = (color: string): THREE.CanvasTexture => {
      const canvas = document.createElement("canvas");
      // Double the texturing dimensions for pristine vector sharpness
      canvas.width = 2048;
      canvas.height = 512;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.save();
        // Scale rendering context by 2 to perfectly map the drawing path vector
        ctx.scale(2, 2);
        drawBrandLogoPath(ctx, color);
        ctx.restore();
      }
      const texture = new THREE.CanvasTexture(canvas);
      texture.colorSpace = THREE.SRGBColorSpace;
      
      // Keep min and mag filters clean and crisp
      texture.minFilter = THREE.LinearMipmapLinearFilter;
      texture.magFilter = THREE.LinearFilter;
      
      // Inject maximum anisotropic filtering to keep textures hyper-sharp at flat perspective angles!
      if (renderer && renderer.capabilities) {
        texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
      }
      return texture;
    };

    // Interactive custom loaded texture tracking
    let activeCustomTexture: THREE.Texture | null = null;
    let loadedLogoUrl = "";
    let drawerMeshGroup: THREE.Group | null = null;
    let magneticFlapGroup: THREE.Group | null = null;
    let shoulderNeckLidGroup: THREE.Group | null = null;

    const buildProductModel = () => {
      // Clear current group children safely
      while (productGroup.children.length > 0) {
        const child = productGroup.children[0];
        productGroup.remove(child);
      }

      drawerMeshGroup = null;
      magneticFlapGroup = null;
      shoulderNeckLidGroup = null;

      const p = paramsRef.current;

      // Generate dynamic high-performance texture according to chosen paper selection
      const paperTex = regDisposable(createPremiumPaperTexture(p.paperType)!);

      // Aspect scaling math (proportional to real dimensions)
      const isBox = p.productType === "boxes";
      let scaleW: number, scaleH: number, scaleD: number;
      let normFactor = 1.0;

      if (isBox) {
        // For boxes, dimensions are: w (length), h (width), d (height)
        // We normalize uniformly so the physical box proportions correspond 1:1 with Three.js scales.
        const maxDim = Math.max(p.w, p.h, p.d);
        normFactor = 4.8 / Math.max(10, maxDim); // normalized bounding factor
        scaleW = p.w * normFactor;
        scaleD = p.h * normFactor; // Width (W) in physical maps to Depth (Z-axis) in 3D
        scaleH = p.d * normFactor; // Height (H) in physical maps to Height (Y-axis) in 3D
      } else {
        const aspectW = p.w / 20; 
        const aspectH = p.h / 25;
        const aspectD = p.d / 8;
        scaleW = Math.max(0.4, Math.min(2.4, aspectW)) * 4.6;
        scaleH = Math.max(0.4, Math.min(2.4, aspectH)) * 5.6;
        scaleD = Math.max(0.2, Math.min(2.4, aspectD)) * 2.2;
      }

      const halfW = scaleW / 2;
      const halfH = scaleH / 2;
      const halfD = scaleD / 2;

      // Update OrbitControls target to look directly at the center of the bag resting on floor
      controls.target.set(0, -4.5 + halfH, 0);

      // Base material mapping with dynamic micro bump textures
      const isGlossy = p.lamination === "glossy" || p.lamination === "gloss";
      const isSoftTouch = p.lamination === "soft_touch";
      const surfaceMat = regDisposable(new THREE.MeshPhysicalMaterial({
        color: new THREE.Color(p.baseHexColor),
        roughness: isGlossy ? 0.16 : isSoftTouch ? 0.88 : 0.76,
        metalness: p.finishes?.includes("fin_foil") || p.finishes?.includes("fin_dec_foil") ? 0.08 : 0.01,
        bumpMap: paperTex || undefined,
        bumpScale: p.grainScale || (p.paperType?.toLowerCase().includes("kraft") ? 0.008 : 0.004),
        side: THREE.DoubleSide,
        clearcoat: isGlossy ? 1.0 : 0.0,
        clearcoatRoughness: 0.05,
        sheen: isGlossy ? 0.0 : isSoftTouch ? 0.98 : 0.85,
        sheenColor: isSoftTouch ? new THREE.Color("#EAEAEA") : new THREE.Color("#FFFDF0"),
        sheenRoughness: isSoftTouch ? 0.85 : 0.6,
      }));

      // Foil high-gloss metal material
      const foilGoldMat = regDisposable(new THREE.MeshPhysicalMaterial({
        color: "#E5C17D", // Luxury polished gold
        roughness: 0.12,
        metalness: 0.98,
        clearcoat: 1.0,
        clearcoatRoughness: 0.03,
        side: THREE.DoubleSide,
      }));

      const foilSilverMat = regDisposable(new THREE.MeshPhysicalMaterial({
        color: "#D0D0D0", // Elegant bright silver
        roughness: 0.12,
        metalness: 0.98,
        clearcoat: 1.0,
        clearcoatRoughness: 0.03,
        side: THREE.DoubleSide,
      }));

      const printColor = "#3A2010"; // Capsule's gorgeous brown branding tint

      // ── MODEL A: MODISH DIBASIC PAPER BAG ─────────────────────────────────
      if (p.productType === "bags") {
        
        // Custom geometry helper to build perfect, seamless, and performant 3D quads
        const createQuadGeometry = (
          p1: THREE.Vector3,
          p2: THREE.Vector3,
          p3: THREE.Vector3,
          p4: THREE.Vector3
        ) => {
          const geom = regDisposable(new THREE.BufferGeometry());
          const vertices = new Float32Array([
            p1.x, p1.y, p1.z,
            p2.x, p2.y, p2.z,
            p3.x, p3.y, p3.z,
            
            p1.x, p1.y, p1.z,
            p3.x, p3.y, p3.z,
            p4.x, p4.y, p4.z,
          ]);
          const uvs = new Float32Array([
            0, 0,
            1, 0,
            1, 1,
            
            0, 0,
            1, 1,
            0, 1
          ]);
          geom.setAttribute("position", new THREE.BufferAttribute(vertices, 3));
          geom.setAttribute("uv", new THREE.BufferAttribute(uvs, 2));
          geom.computeVertexNormals();
          return geom;
        };

         // Premium Luxury Proportional Styling Metrics (Tapered & Nicely Pinched)
         const isDecorative = false;
         const wBot = halfW;
         const wTop = isDecorative ? halfW * 0.94 : halfW;       // Beautiful designer tapered width at top (completely straight for standard bags)
         const dBot = halfD;
         // Premium realistic bag pinch! Real paper bags are folded/pinched thin at the top rim to keep handles close.
         const dTop = isDecorative ? halfD * 0.22 : halfD * 0.28; // Elegantly pinched/slim top opening (flat folded crease like the mockup photos!)

        // Define the 8 key structural vertices of the bag in productGroup space
        const fbl = new THREE.Vector3(-wBot, -halfH, dBot); // Front-Bottom-Left
        const fbr = new THREE.Vector3(wBot, -halfH, dBot);  // Front-Bottom-Right
        const ftr = new THREE.Vector3(wTop, halfH, dTop);   // Front-Top-Right
        const ftl = new THREE.Vector3(-wTop, halfH, dTop);  // Front-Top-Left

        const bbl = new THREE.Vector3(-wBot, -halfH, -dBot); // Back-Bottom-Left
        const bbr = new THREE.Vector3(wBot, -halfH, -dBot);  // Back-Bottom-Right
        const btr = new THREE.Vector3(wTop, halfH, -dTop);   // Back-Top-Right
        const btl = new THREE.Vector3(-wTop, halfH, -dTop);  // Back-Top-Left

        // 1. Sleek Tapered Outer Panels
        // Front Panel
        const frontGeo = createQuadGeometry(fbl, fbr, ftr, ftl);
        const frontPanel = new THREE.Mesh(frontGeo, surfaceMat);
        frontPanel.castShadow = true;
        frontPanel.receiveShadow = true;
        productGroup.add(frontPanel);

        // Trigonometric placement helpers to align accessories along tilted slant
        const deltaZ = dTop - dBot;
        const slantAngle = Math.atan2(deltaZ, scaleH);

        const getFrontZ = (y: number, offset = 0) => {
          const ratio = (y - (-halfH)) / scaleH;
          return dBot + ratio * deltaZ + offset;
        };

        const getBackZ = (y: number, offset = 0) => {
          const ratio = (y - (-halfH)) / scaleH;
          return -(dBot + ratio * deltaZ) - offset;
        };

        // Folded top lip reinforcement (simulates professional folded card opening)
        const topLipGeo = regDisposable(new THREE.PlaneGeometry(scaleW * 0.945, 0.35));
        const topLipY = halfH - 0.175;

        const topLipF = new THREE.Mesh(topLipGeo, surfaceMat);
        topLipF.rotation.x = slantAngle;
        topLipF.position.set(0, topLipY, getFrontZ(topLipY, 0.005));
        productGroup.add(topLipF);

        // BRANDING LOGO COMPONENT (Perfect layout positioning and tilt mapping!)
        const brandingInFoil = p.finishes?.includes("fin_foil") || p.finishes?.includes("fin_dec_foil") || p.logoFoilMode !== "none";
        const brandingInSpotUV = p.finishes?.includes("fin_spotUv") || p.finishes?.includes("fin_uv") || p.finishes?.includes("fin_dec_uv") || p.finishes?.includes("fin_emboss");
        const logoTex = regDisposable(createBrandLogoTexture("#ffffff"));
        const logoScaleW = scaleW * 0.54;
        const logoGeo = regDisposable(new THREE.PlaneGeometry(logoScaleW, logoScaleW * (80 / 380)));
        const logoMat = regDisposable(new THREE.MeshPhysicalMaterial({
          color: brandingInFoil ? (p.logoFoilMode === "silver" ? "#D0D0D0" : "#E5C17D") : printColor,
          alphaMap: logoTex,
          transparent: true,
          side: THREE.DoubleSide,
          roughness: brandingInFoil ? 0.12 : (brandingInSpotUV ? 0.08 : 0.68),
          metalness: brandingInFoil ? 0.98 : 0.0,
          clearcoat: (brandingInFoil || brandingInSpotUV) ? 1.0 : 0.0,
          clearcoatRoughness: 0.02,
          sheen: brandingInFoil ? 0.0 : 0.85,
          sheenColor: new THREE.Color("#FFFFFF"),
        }));

        const logoY = -scaleH * 0.04;
        const logoMesh = new THREE.Mesh(logoGeo, logoMat);
        logoMesh.rotation.x = slantAngle;
        logoMesh.position.set(0, logoY, getFrontZ(logoY, 0.008));
        productGroup.add(logoMesh);

        if (p.sides === 2) {
          const logoMeshB = new THREE.Mesh(logoGeo, logoMat);
          logoMeshB.rotation.set(0, 0, 0);
          logoMeshB.rotateY(Math.PI);
          logoMeshB.rotateX(slantAngle);
          logoMeshB.position.set(0, logoY, getBackZ(logoY, 0.008));
          productGroup.add(logoMeshB);
        }

        // Back Panel
        const backGeo = createQuadGeometry(bbr, bbl, btl, btr);
        const backPanel = new THREE.Mesh(backGeo, surfaceMat);
        backPanel.castShadow = true;
        backPanel.receiveShadow = true;
        productGroup.add(backPanel);

        // Back Top Lip reinforcement
        const topLipB = new THREE.Mesh(topLipGeo, surfaceMat);
        topLipB.rotation.x = -slantAngle;
        topLipB.position.set(0, topLipY, getBackZ(topLipY, 0.005));
        productGroup.add(topLipB);

        // Bottom Board Base Overlay
        const bottomGeo = createQuadGeometry(fbl, fbr, bbr, bbl);
        const bottomPanel = new THREE.Mesh(bottomGeo, surfaceMat);
        bottomPanel.receiveShadow = true;
        productGroup.add(bottomPanel);

        // Luxury Side Profile Crest/Fold Math (Self-Shadowed Inside Creasing)
        const pinchBot = dBot * 0.15; // Sleek soft fold crease at bottom
        // Perfect mathematical paper-folding crease fold at top rim!
        // To prevent the side paper from stretching in 3D during a pinch, pinchTop^2 + dTop^2 = dBot^2.
        const pinchTop = Math.sqrt(Math.max(0.01, dBot * dBot - dTop * dTop));

        const bcl = new THREE.Vector3(-wBot + pinchBot, -halfH, 0); // Crease left-bottom
        const tcl = new THREE.Vector3(-wTop + pinchTop, halfH, 0);  // Crease left-top
        const bcr = new THREE.Vector3(wBot - pinchBot, -halfH, 0);  // Crease right-bottom
        const tcr = new THREE.Vector3(wTop - pinchTop, halfH, 0);   // Crease right-top

        const gussetMat = regDisposable(new THREE.MeshPhysicalMaterial({
          color: new THREE.Color(p.baseHexColor).multiplyScalar(0.92), // Realistic self-shadowing interior folds
          roughness: isGlossy ? 0.22 : 0.85,
          metalness: 0.0,
          bumpMap: paperTex || undefined,
          bumpScale: (p.grainScale || 0.004) * 1.4,
          side: THREE.DoubleSide,
          sheen: isGlossy ? 0.0 : 0.9,
          sheenColor: new THREE.Color("#FAF6F0"),
          sheenRoughness: 0.7,
        }));

        // Left Foldable Gusset Flaps
        const sideGeoL1 = createQuadGeometry(fbl, bcl, tcl, ftl);
        const sideMeshL1 = new THREE.Mesh(sideGeoL1, gussetMat);
        sideMeshL1.castShadow = true;
        sideMeshL1.receiveShadow = true;
        productGroup.add(sideMeshL1);

        const sideGeoL2 = createQuadGeometry(bcl, bbl, btl, tcl);
        const sideMeshL2 = new THREE.Mesh(sideGeoL2, gussetMat);
        sideMeshL2.castShadow = true;
        sideMeshL2.receiveShadow = true;
        productGroup.add(sideMeshL2);

        // Right Foldable Gusset Flaps
        const sideGeoR1 = createQuadGeometry(bcr, fbr, ftr, tcr);
        const sideMeshR1 = new THREE.Mesh(sideGeoR1, gussetMat);
        sideMeshR1.castShadow = true;
        sideMeshR1.receiveShadow = true;
        productGroup.add(sideMeshR1);

        const sideGeoR2 = createQuadGeometry(bbr, bcr, tcr, btr);
        const sideMeshR2 = new THREE.Mesh(sideGeoR2, gussetMat);
        sideMeshR2.castShadow = true;
        sideMeshR2.receiveShadow = true;
        productGroup.add(sideMeshR2);

        // 2. Proportional Grommet Placements (Lux physical eyelets)
        // Eyelets align natively with the tilted face
        const grommetScale = Math.max(0.4, Math.min(1.4, scaleW * 0.14));
        const grommetGeo = regDisposable(new THREE.TorusGeometry(0.12 * grommetScale, 0.04 * grommetScale, 12, 32));
        const grommetMat = regDisposable(new THREE.MeshPhysicalMaterial({
          color: p.logoFoilMode === "gold" || p.finishes?.includes("fin_foil") ? "#E5C17D" : "#CCCCCC", // Luxury polished gold or anodized silver steel
          roughness: 0.12,
          metalness: 0.98,
          clearcoat: 1.0,
          clearcoatRoughness: 0.05,
        }));

        const leftGrommetX = -halfW * 0.44;
        const rightGrommetX = halfW * 0.44;
        const grommetY = halfH - Math.max(0.24, Math.min(0.72, scaleH * 0.08));

        // Render luxury grommets ONLY for braided rope cord handles
        if (p.handleType === "cord") {
          // Front grommets
          const gmF1 = new THREE.Mesh(grommetGeo, grommetMat);
          gmF1.rotation.x = slantAngle;
          gmF1.position.set(leftGrommetX * 0.96, grommetY, getFrontZ(grommetY, 0.012));
          productGroup.add(gmF1);

          const gmF2 = new THREE.Mesh(grommetGeo, grommetMat);
          gmF2.rotation.x = slantAngle;
          gmF2.position.set(rightGrommetX * 0.96, grommetY, getFrontZ(grommetY, 0.012));
          productGroup.add(gmF2);

          // Back grommets
          const gmB1 = new THREE.Mesh(grommetGeo, grommetMat);
          gmB1.rotation.x = Math.PI - slantAngle;
          gmB1.position.set(leftGrommetX * 0.96, grommetY, getBackZ(grommetY, 0.012));
          productGroup.add(gmB1);

          const gmB2 = new THREE.Mesh(grommetGeo, grommetMat);
          gmB2.rotation.x = Math.PI - slantAngle;
          gmB2.position.set(rightGrommetX * 0.96, grommetY, getBackZ(grommetY, 0.012));
          productGroup.add(gmB2);
        }

        // 3. Handles (Fully aligned and dynamically colored to match user mockup files!)
        const loopHeight = Math.max(0.8, Math.min(4.8, scaleH * 0.36)); 
        const loopDepth = Math.max(0.3, Math.min(2.8, scaleD * 0.58)); 
        
        // Smart handle color auto-matching based on selected bag mockup colors, or user override!
        let handleColorValue = p.bagHandleColor || p.ribbonColor || "#3A2010";
        if (!p.bagHandleColor) {
          if (p.baseHexColor === "#ff2300" || p.baseHexColor === "#E31B23" || p.baseHexColor?.toLowerCase() === "#ff2300") { // Scarlet Premium Red / Brand Red
            handleColorValue = "#F9F6F0"; // Exquisite luxury white/cream straps or ropes, matching the red mockup bag!
          } else if (p.baseHexColor === "#FFD200") { // Solar Yellow
            handleColorValue = "#151515"; // Bold satin black straps/ropes, matching the yellow mockup bag!
          } else if (p.baseHexColor === "#2C3135") { // Slate Carbon (dark grey)
            handleColorValue = "#FAF8F5"; // Crisp bright off-white for beautiful contrast!
          } else if (p.baseHexColor === "#1D3557") { // Royal Blue
            handleColorValue = "#E5C17D"; // Exquisite polished gold straps!
          }
        }

        let curveF: THREE.CatmullRomCurve3;
        let curveB: THREE.CatmullRomCurve3;

        if (p.handlePose === "upright") {
          // Standing proudly in a beautiful, high-precision natural teardrop suspension arch!
          // We start slightly inside the grommet cavity for a seamless physical connection.
          const inZOffset = -0.06; 
          const startInsideF  = new THREE.Vector3(leftGrommetX * 0.96, grommetY - 0.08, getFrontZ(grommetY - 0.08, inZOffset));
          const exitF1        = new THREE.Vector3(leftGrommetX * 0.96, grommetY, getFrontZ(grommetY, 0.015));
          // Moving smoothly inward and up, with natural teardrop tension
          const flareF1       = new THREE.Vector3(leftGrommetX * 0.86, grommetY + loopHeight * 0.36, getFrontZ(grommetY, 0.08) + loopDepth * 0.32);
          const shoulderF1    = new THREE.Vector3(leftGrommetX * 0.42, grommetY + loopHeight * 0.78, getFrontZ(grommetY, 0.12) + loopDepth * 0.76);
          const peakF         = new THREE.Vector3(0, grommetY + loopHeight * 1.02, getFrontZ(grommetY, 0.12) + loopDepth * 0.92);
          
          const shoulderF2    = new THREE.Vector3(rightGrommetX * 0.42, grommetY + loopHeight * 0.78, getFrontZ(grommetY, 0.12) + loopDepth * 0.76);
          const flareF2       = new THREE.Vector3(rightGrommetX * 0.86, grommetY + loopHeight * 0.36, getFrontZ(grommetY, 0.08) + loopDepth * 0.32);
          const exitF2        = new THREE.Vector3(rightGrommetX * 0.96, grommetY, getFrontZ(grommetY, 0.015));
          const endInsideF    = new THREE.Vector3(rightGrommetX * 0.96, grommetY - 0.08, getFrontZ(grommetY - 0.08, inZOffset));

          curveF = new THREE.CatmullRomCurve3([
            startInsideF,
            exitF1,
            flareF1,
            shoulderF1,
            peakF,
            shoulderF2,
            flareF2,
            exitF2,
            endInsideF
          ]);

          // Back upright loop curves (mirror of the front, inverting appropriate Z-coordinates and depth)
          const startInsideB  = new THREE.Vector3(leftGrommetX * 0.96, grommetY - 0.08, getBackZ(grommetY - 0.08, inZOffset));
          const exitB1        = new THREE.Vector3(leftGrommetX * 0.96, grommetY, getBackZ(grommetY, 0.015));
          const flareB1       = new THREE.Vector3(leftGrommetX * 0.86, grommetY + loopHeight * 0.36, getBackZ(grommetY, 0.08) - loopDepth * 0.32);
          const shoulderB1    = new THREE.Vector3(leftGrommetX * 0.42, grommetY + loopHeight * 0.78, getBackZ(grommetY, 0.12) - loopDepth * 0.76);
          const peakB         = new THREE.Vector3(0, grommetY + loopHeight * 1.02, getBackZ(grommetY, 0.12) - loopDepth * 0.92);
          
          const shoulderB2    = new THREE.Vector3(rightGrommetX * 0.42, grommetY + loopHeight * 0.78, getBackZ(grommetY, 0.12) - loopDepth * 0.76);
          const flareB2       = new THREE.Vector3(rightGrommetX * 0.86, grommetY + loopHeight * 0.36, getBackZ(grommetY, 0.08) - loopDepth * 0.32);
          const exitB2        = new THREE.Vector3(rightGrommetX * 0.96, grommetY, getBackZ(grommetY, 0.015));
          const endInsideB    = new THREE.Vector3(rightGrommetX * 0.96, grommetY - 0.08, getBackZ(grommetY - 0.08, inZOffset));

          curveB = new THREE.CatmullRomCurve3([
            startInsideB,
            exitB1,
            flareB1,
            shoulderB1,
            peakB,
            shoulderB2,
            flareB2,
            exitB2,
            endInsideB
          ]);
        } else {
          // Gravity Draped: hangs down naturally with absolute precision
          const inZOffset = -0.06;
          const startInsideF  = new THREE.Vector3(leftGrommetX * 0.96, grommetY + 0.08, getFrontZ(grommetY + 0.08, inZOffset));
          const exitF1        = new THREE.Vector3(leftGrommetX * 0.96, grommetY, getFrontZ(grommetY, 0.015));
          const sagF1         = new THREE.Vector3(leftGrommetX * 0.82, grommetY - loopHeight * 0.38, getFrontZ(grommetY - loopHeight * 0.38, 0.12));
          const bodyF1        = new THREE.Vector3(leftGrommetX * 0.32, grommetY - loopHeight * 0.74, getFrontZ(grommetY - loopHeight * 0.74, 0.18));
          const centerF       = new THREE.Vector3(0, grommetY - loopHeight * 0.90, getFrontZ(grommetY - loopHeight * 0.90, 0.22));
          const bodyF2        = new THREE.Vector3(rightGrommetX * 0.32, grommetY - loopHeight * 0.74, getFrontZ(grommetY - loopHeight * 0.74, 0.18));
          const sagF2         = new THREE.Vector3(rightGrommetX * 0.82, grommetY - loopHeight * 0.38, getFrontZ(grommetY - loopHeight * 0.38, 0.12));
          const exitF2        = new THREE.Vector3(rightGrommetX * 0.96, grommetY, getFrontZ(grommetY, 0.015));
          const endInsideF    = new THREE.Vector3(rightGrommetX * 0.96, grommetY + 0.08, getFrontZ(grommetY + 0.08, inZOffset));

          curveF = new THREE.CatmullRomCurve3([
            startInsideF,
            exitF1,
            sagF1,
            bodyF1,
            centerF,
            bodyF2,
            sagF2,
            exitF2,
            endInsideF
          ]);

          const startInsideB  = new THREE.Vector3(leftGrommetX * 0.96, grommetY + 0.08, getBackZ(grommetY + 0.08, inZOffset));
          const exitB1        = new THREE.Vector3(leftGrommetX * 0.96, grommetY, getBackZ(grommetY, 0.015));
          const sagB1         = new THREE.Vector3(leftGrommetX * 0.82, grommetY - loopHeight * 0.38, getBackZ(grommetY - loopHeight * 0.38, 0.12));
          const bodyB1        = new THREE.Vector3(leftGrommetX * 0.32, grommetY - loopHeight * 0.74, getBackZ(grommetY - loopHeight * 0.74, 0.18));
          const centerB       = new THREE.Vector3(0, grommetY - loopHeight * 0.90, getBackZ(grommetY - loopHeight * 0.90, 0.22));
          const bodyB2        = new THREE.Vector3(rightGrommetX * 0.32, grommetY - loopHeight * 0.74, getBackZ(grommetY - loopHeight * 0.74, 0.18));
          const sagB2         = new THREE.Vector3(rightGrommetX * 0.82, grommetY - loopHeight * 0.38, getBackZ(grommetY - loopHeight * 0.38, 0.12));
          const exitB2        = new THREE.Vector3(rightGrommetX * 0.96, grommetY, getBackZ(grommetY, 0.015));
          const endInsideB    = new THREE.Vector3(rightGrommetX * 0.96, grommetY + 0.08, getBackZ(grommetY + 0.08, inZOffset));

          curveB = new THREE.CatmullRomCurve3([
            startInsideB,
            exitB1,
            sagB1,
            bodyB1,
            centerB,
            bodyB2,
            sagB2,
            exitB2,
            endInsideB
          ]);
        }

        if (p.handleType === "ribbon" || p.handleType === "satin") {
          // Render thin horizontal metal ribbons-slots on bag surface instead of round holes!
          const ribbonRatio = (p.ribbonWidthCm || 2.0) / 2.0;
          const baseRibbonThickWidth = Math.max(0.12, Math.min(0.42, scaleW * 0.06));
          const ribbonThickWidth = baseRibbonThickWidth * ribbonRatio;
          const slotWidth = ribbonThickWidth * 1.35;
          const slotHeight = 0.06;
          const slotDepth = 0.03;
          const slotGeo = regDisposable(new THREE.BoxGeometry(slotWidth, slotHeight, slotDepth));
          const slotMat = regDisposable(new THREE.MeshPhysicalMaterial({
            color: p.logoFoilMode === "gold" || p.finishes?.includes("fin_foil") ? "#E5C17D" : "#CCCCCC",
            roughness: 0.12,
            metalness: 0.98,
            clearcoat: 1.0,
            clearcoatRoughness: 0.05,
          }));

          const addSlot = (x: number, y: number, z: number, isBack: boolean) => {
            const slot = new THREE.Mesh(slotGeo, slotMat);
            slot.rotation.x = isBack ? Math.PI - slantAngle : slantAngle;
            slot.position.set(x, y, z + (isBack ? -0.01 : 0.01));
            productGroup.add(slot);
          };

          addSlot(leftGrommetX * 0.96, grommetY, getFrontZ(grommetY, 0.005), false);
          addSlot(rightGrommetX * 0.96, grommetY, getFrontZ(grommetY, 0.005), false);
          addSlot(leftGrommetX * 0.96, grommetY, getBackZ(grommetY, 0.005), true);
          addSlot(rightGrommetX * 0.96, grommetY, getBackZ(grommetY, 0.005), true);

          const ribbonTex = regDisposable(createRibbonWeaveTexture()!);
          const isSatin = p.handleType === "satin";
          const ribbonMaterial = regDisposable(new THREE.MeshPhysicalMaterial({
            color: handleColorValue,
            roughness: isSatin ? 0.22 : 0.45,
            metalness: isSatin ? 0.02 : 0.03,
            bumpMap: isSatin ? undefined : (ribbonTex || undefined),
            bumpScale: isSatin ? 0.0 : 0.018,
            clearcoat: isSatin ? 0.95 : 0.1,
            clearcoatRoughness: isSatin ? 0.05 : 0.45,
            sheen: isSatin ? 1.0 : 0.5,
            sheenColor: new THREE.Color(handleColorValue).clone().multiplyScalar(1.25),
            sheenRoughness: isSatin ? 0.1 : 0.5,
            side: THREE.DoubleSide
          }));

          // Dynamic repeat frequency proportional to the actual geometry length
          const curveLength = curveF.getLength();
          const ribbonFrequency = Math.max(12, Math.round(curveLength * 4.8));
          if (!isSatin && ribbonTex) {
            ribbonTex.repeat.set(ribbonFrequency, 1);
          }

          // Mathematically perfect, non-twisting custom ribbon geometry sweeps!
          const ribbonFGeo = regDisposable(createPremiumRibbonGeometry(curveF, ribbonThickWidth, 0.02, false));
          const handleFMesh = new THREE.Mesh(ribbonFGeo, ribbonMaterial);
          handleFMesh.castShadow = true;
          productGroup.add(handleFMesh);

          const ribbonBGeo = regDisposable(createPremiumRibbonGeometry(curveB, ribbonThickWidth, 0.02, true));
          const handleBMesh = new THREE.Mesh(ribbonBGeo, ribbonMaterial);
          handleBMesh.castShadow = true;
          productGroup.add(handleBMesh);

        } else {
          // Braided rope handles (highly detailed and thicker, like real braided cords!)
          const handleThick = Math.max(0.065, Math.min(0.145, scaleH * 0.024));
          const ropeTex = regDisposable(createRopeTexture(handleColorValue)!);
          const cordMaterial = regDisposable(new THREE.MeshPhysicalMaterial({
            color: handleColorValue,
            roughness: 0.62,
            metalness: 0.02,
            bumpMap: ropeTex || undefined,
            bumpScale: 0.018,
            clearcoat: 0.08,
            clearcoatRoughness: 0.45,
            sheen: 1.0,
            sheenColor: new THREE.Color(handleColorValue),
            sheenRoughness: 0.4,
          }));

          // Braid density scaling dynamically with geometry dimensions
          const curveLength = curveF.getLength();
          const cordFrequency = Math.max(8, Math.round(curveLength * 4.2));
          ropeTex.repeat.set(cordFrequency, 1);

          // Render the high-precision smoothly curved cable tubes traversing the grommets perfectly!
          const tubeFGeo = regDisposable(new THREE.TubeGeometry(curveF, 64, handleThick, 16, false));
          const handleFMesh = new THREE.Mesh(tubeFGeo, cordMaterial);
          handleFMesh.castShadow = true;
          productGroup.add(handleFMesh);

          const tubeBGeo = regDisposable(new THREE.TubeGeometry(curveB, 64, handleThick, 16, false));
          const handleBMesh = new THREE.Mesh(tubeBGeo, cordMaterial);
          handleBMesh.castShadow = true;
          productGroup.add(handleBMesh);
        }

      } 
      // ── MODEL B: RIGID GIFT BOXES ─────────────────────────────────────────
      else if (p.productType === "boxes") {
        const boxMaterial = surfaceMat;

        if (p.boxStyle === "sleeve_drawer") {
          const sleeveThick = 0.055;
          const sleeveMaterial = boxMaterial;

          // hollow outer sleeve
          // Top wall
          const topGeo = regDisposable(new THREE.BoxGeometry(scaleW, sleeveThick, scaleD));
          const topSleeve = new THREE.Mesh(topGeo, sleeveMaterial);
          topSleeve.position.set(0, scaleH / 2 - sleeveThick / 2, 0);
          topSleeve.castShadow = true;
          topSleeve.receiveShadow = true;
          productGroup.add(topSleeve);

          // Bottom wall
          const botGeo = regDisposable(new THREE.BoxGeometry(scaleW, sleeveThick, scaleD));
          const botSleeve = new THREE.Mesh(botGeo, sleeveMaterial);
          botSleeve.position.set(0, -(scaleH / 2 - sleeveThick / 2), 0);
          botSleeve.castShadow = true;
          botSleeve.receiveShadow = true;
          productGroup.add(botSleeve);

          // Left wall
          const leftGeo = regDisposable(new THREE.BoxGeometry(sleeveThick, scaleH - sleeveThick * 2, scaleD));
          const leftSleeve = new THREE.Mesh(leftGeo, sleeveMaterial);
          leftSleeve.position.set(-(scaleW / 2 - sleeveThick / 2), 0, 0);
          leftSleeve.castShadow = true;
          leftSleeve.receiveShadow = true;
          productGroup.add(leftSleeve);

          // Right wall
          const rightGeo = regDisposable(new THREE.BoxGeometry(sleeveThick, scaleH - sleeveThick * 2, scaleD));
          const rightSleeve = new THREE.Mesh(rightGeo, sleeveMaterial);
          rightSleeve.position.set(scaleW / 2 - sleeveThick / 2, 0, 0);
          rightSleeve.castShadow = true;
          rightSleeve.receiveShadow = true;
          productGroup.add(rightSleeve);

          // Brand logo on Sleeve Top
          const boxLogoInFoil = p.finishes?.includes("fin_foil") || p.finishes?.includes("fin_dec_foil") || p.logoFoilMode !== "none";
          const boxLogoInSpotUV = p.finishes?.includes("fin_spotUv") || p.finishes?.includes("fin_uv") || p.finishes?.includes("fin_dec_uv") || p.finishes?.includes("fin_emboss");
          const logoTex = regDisposable(createBrandLogoTexture("#ffffff"));
          const logoGeo = regDisposable(new THREE.PlaneGeometry(scaleW * 0.58, (scaleW * 0.58) * (80 / 380)));
          const logoMat = regDisposable(new THREE.MeshPhysicalMaterial({
            color: boxLogoInFoil ? (p.logoFoilMode === "silver" ? "#D0D0D0" : "#E5C17D") : printColor,
            alphaMap: logoTex,
            transparent: true,
            side: THREE.DoubleSide,
            roughness: boxLogoInFoil ? 0.12 : (boxLogoInSpotUV ? 0.08 : 0.68),
            metalness: boxLogoInFoil ? 0.98 : 0.0,
            clearcoat: (boxLogoInFoil || boxLogoInSpotUV) ? 1.0 : 0.0,
            clearcoatRoughness: 0.02,
            sheen: boxLogoInFoil ? 0.0 : 0.85,
            sheenColor: new THREE.Color("#FFFFFF"),
          }));
          const logoMesh = new THREE.Mesh(logoGeo, logoMat);
          logoMesh.rotation.x = -Math.PI / 2;
          logoMesh.position.set(0, scaleH / 2 + 0.005, 0);
          productGroup.add(logoMesh);

          // drawerMeshGroup
          drawerMeshGroup = new THREE.Group();

          const drawerW = scaleW - sleeveThick * 2 - 0.04;
          const drawerH = scaleH - sleeveThick * 2 - 0.04;
          const drawerD = scaleD - 0.02;

          const drawerThick = 0.04;
          const drawerMaterial = boxMaterial;

          // bottom of drawer tray
          const trayBotGeo = regDisposable(new THREE.BoxGeometry(drawerW - drawerThick * 2, drawerThick, drawerD));
          const trayBotMesh = new THREE.Mesh(trayBotGeo, drawerMaterial);
          trayBotMesh.position.set(0, -(drawerH / 2 - drawerThick / 2), 0);
          trayBotMesh.castShadow = true;
          trayBotMesh.receiveShadow = true;
          drawerMeshGroup.add(trayBotMesh);

          // left of drawer tray
          const trayLeftGeo = regDisposable(new THREE.BoxGeometry(drawerThick, drawerH - drawerThick, drawerD));
          const trayLeftMesh = new THREE.Mesh(trayLeftGeo, drawerMaterial);
          trayLeftMesh.position.set(-(drawerW / 2 - drawerThick / 2), drawerThick / 2, 0);
          trayLeftMesh.castShadow = true;
          trayLeftMesh.receiveShadow = true;
          drawerMeshGroup.add(trayLeftMesh);

          // right of drawer tray
          const trayRightGeo = regDisposable(new THREE.BoxGeometry(drawerThick, drawerH - drawerThick, drawerD));
          const trayRightMesh = new THREE.Mesh(trayRightGeo, drawerMaterial);
          trayRightMesh.position.set(drawerW / 2 - drawerThick / 2, drawerThick / 2, 0);
          trayRightMesh.castShadow = true;
          trayRightMesh.receiveShadow = true;
          drawerMeshGroup.add(trayRightMesh);

          // back panel of drawer tray
          const trayBackGeo = regDisposable(new THREE.BoxGeometry(drawerW - drawerThick * 2, drawerH - drawerThick, drawerThick));
          const trayBackMesh = new THREE.Mesh(trayBackGeo, drawerMaterial);
          trayBackMesh.position.set(0, drawerThick / 2, -(drawerD / 2 - drawerThick / 2));
          trayBackMesh.castShadow = true;
          trayBackMesh.receiveShadow = true;
          drawerMeshGroup.add(trayBackMesh);

          // front pane (double card faceplate)
          const trayFrontGeo = regDisposable(new THREE.BoxGeometry(drawerW - 0.01, drawerH - 0.01, drawerThick * 1.5));
          const trayFrontMesh = new THREE.Mesh(trayFrontGeo, drawerMaterial);
          trayFrontMesh.position.set(0, 0, drawerD / 2 - (drawerThick * 1.5) / 2);
          trayFrontMesh.castShadow = true;
          trayFrontMesh.receiveShadow = true;
          drawerMeshGroup.add(trayFrontMesh);

          // Charcoal inner foam insert
          const foamW = drawerW - drawerThick * 2 - 0.04;
          const foamD = drawerD - drawerThick * 2 - 0.04;
          const foamH = drawerH - drawerThick - 0.08;

          const foamMat = regDisposable(new THREE.MeshStandardMaterial({
            color: "#303030", // luxury charcoal padding
            roughness: 0.92,
            metalness: 0.02,
          }));

          const rimThick = foamW * 0.16;

          // foam front strip
          const foamFGeo = regDisposable(new THREE.BoxGeometry(foamW, foamH, rimThick));
          const foamFMesh = new THREE.Mesh(foamFGeo, foamMat);
          foamFMesh.position.set(0, -drawerH / 2 + drawerThick + foamH / 2, foamD / 2 - rimThick / 2);
          foamFMesh.castShadow = true;
          foamFMesh.receiveShadow = true;
          drawerMeshGroup.add(foamFMesh);

          // foam back strip
          const foamBGeo = regDisposable(new THREE.BoxGeometry(foamW, foamH, rimThick));
          const foamBMesh = new THREE.Mesh(foamBGeo, foamMat);
          foamBMesh.position.set(0, -drawerH / 2 + drawerThick + foamH / 2, -(foamD / 2 - rimThick / 2));
          foamBMesh.castShadow = true;
          foamBMesh.receiveShadow = true;
          drawerMeshGroup.add(foamBMesh);

          // foam left strip
          const foamLGeo = regDisposable(new THREE.BoxGeometry(rimThick, foamH, foamD - rimThick * 2));
          const foamLMesh = new THREE.Mesh(foamLGeo, foamMat);
          foamLMesh.position.set(-(foamW / 2 - rimThick / 2), -drawerH / 2 + drawerThick + foamH / 2, 0);
          foamLMesh.castShadow = true;
          foamLMesh.receiveShadow = true;
          drawerMeshGroup.add(foamLMesh);

          // foam right strip
          const foamRGeo = regDisposable(new THREE.BoxGeometry(rimThick, foamH, foamD - rimThick * 2));
          const foamRMesh = new THREE.Mesh(foamRGeo, foamMat);
          foamRMesh.position.set(foamW / 2 - rimThick / 2, -drawerH / 2 + drawerThick + foamH / 2, 0);
          foamRMesh.castShadow = true;
          foamRMesh.receiveShadow = true;
          drawerMeshGroup.add(foamRMesh);

          // bottom cushion pad (recess)
          const foamCushGeo = regDisposable(new THREE.BoxGeometry(foamW - rimThick * 2, foamH * 0.45, foamD - rimThick * 2));
          const foamCushMesh = new THREE.Mesh(foamCushGeo, foamMat);
          foamCushMesh.position.set(0, -drawerH / 2 + drawerThick + (foamH * 0.45) / 2, 0);
          foamCushMesh.castShadow = true;
          foamCushMesh.receiveShadow = true;
          drawerMeshGroup.add(foamCushMesh);

          // Satin extraction loop
          const ribbonColorValue = p.ribbonColor || p.bagHandleColor || "#3A2010";
          const rPullMat = regDisposable(new THREE.MeshStandardMaterial({
            color: ribbonColorValue,
            roughness: 0.18,
            metalness: 0.1,
            side: THREE.DoubleSide
          }));

          const ribbonLoopGroup = new THREE.Group();
          const steps = 18;
          const ribbonLoopW = 0.16;

          for (let i = 0; i <= steps; i++) {
            const theta = (i / steps) * Math.PI;
            const ry = Math.sin(theta) * 0.05;
            const rz = (1 - Math.cos(theta)) * 0.16;

            const segmentGeo = regDisposable(new THREE.BoxGeometry(ribbonLoopW, 0.01, 0.03));
            const segmentMesh = new THREE.Mesh(segmentGeo, rPullMat);
            segmentMesh.position.set(0, ry, rz);
            segmentMesh.rotation.x = -theta + Math.PI / 2;
            ribbonLoopGroup.add(segmentMesh);
          }

          ribbonLoopGroup.position.set(0, 0, drawerD / 2);
          drawerMeshGroup.add(ribbonLoopGroup);

          productGroup.add(drawerMeshGroup);
        } else if (p.boxStyle === "magnetic_flap") {
          // Inner tray of the magnetic box (slightly smaller in footprint)
          const trayW = scaleW * 0.95;
          const trayH = scaleH * 0.92;
          const trayD = scaleD * 0.96;
          const trayThick = 0.045;

          // Inside paper or velvet lining for premium box container
          const innerLiningMat = regDisposable(new THREE.MeshStandardMaterial({
            color: "#FAF6F0", // Warm luxury ivory interior
            roughness: 0.8,
            metalness: 0.0          
          }));

          // Bottom of inner tray
          const trayBotMesh = new THREE.Mesh(regDisposable(new THREE.BoxGeometry(trayW - trayThick * 2, trayThick, trayD - trayThick * 2)), innerLiningMat);
          trayBotMesh.position.set(0, -scaleH / 2 + trayThick / 2 + 0.02, 0);
          trayBotMesh.castShadow = true;
          trayBotMesh.receiveShadow = true;
          productGroup.add(trayBotMesh);

          // Thick walls of inner tray
          const wallL = new THREE.Mesh(regDisposable(new THREE.BoxGeometry(trayThick, trayH, trayD)), boxMaterial);
          wallL.position.set(-trayW / 2 + trayThick / 2, -scaleH / 2 + trayH / 2 + 0.02, 0);
          wallL.castShadow = true;
          wallL.receiveShadow = true;
          productGroup.add(wallL);

          const wallR = new THREE.Mesh(regDisposable(new THREE.BoxGeometry(trayThick, trayH, trayD)), boxMaterial);
          wallR.position.set(trayW / 2 - trayThick / 2, -scaleH / 2 + trayH / 2 + 0.02, 0);
          wallR.castShadow = true;
          wallR.receiveShadow = true;
          productGroup.add(wallR);

          const wallF = new THREE.Mesh(regDisposable(new THREE.BoxGeometry(trayW - trayThick * 2, trayH, trayThick)), boxMaterial);
          wallF.position.set(0, -scaleH / 2 + trayH / 2 + 0.02, trayD / 2 - trayThick / 2);
          wallF.castShadow = true;
          wallF.receiveShadow = true;
          productGroup.add(wallF);

          const wallB = new THREE.Mesh(regDisposable(new THREE.BoxGeometry(trayW - trayThick * 2, trayH, trayThick)), boxMaterial);
          wallB.position.set(0, -scaleH / 2 + trayH / 2 + 0.02, -(trayD / 2 - trayThick / 2));
          wallB.castShadow = true;
          wallB.receiveShadow = true;
          productGroup.add(wallB);

          // Now the folding outer book jacket cover
          const coverThick = 0.052;

          // 1. Bottom Cover Slab (under the tray)
          const bottomCover = new THREE.Mesh(regDisposable(new THREE.BoxGeometry(scaleW * 1.02, coverThick, scaleD * 1.02)), boxMaterial);
          bottomCover.position.set(0, -scaleH / 2 + 0.015, 0);
          bottomCover.castShadow = true;
          bottomCover.receiveShadow = true;
          productGroup.add(bottomCover);

          // 2. Back Spine Wall
          const spineH = scaleH + coverThick * 2;
          const spineMesh = new THREE.Mesh(regDisposable(new THREE.BoxGeometry(scaleW * 1.02, spineH, coverThick)), boxMaterial);
          spineMesh.position.set(0, 0, -scaleD / 2 - coverThick / 2);
          spineMesh.castShadow = true;
          spineMesh.receiveShadow = true;
          productGroup.add(spineMesh);

          // 3. Hinged Folding Group (Top cover + Flap + Logo)
          magneticFlapGroup = new THREE.Group();
          magneticFlapGroup.position.set(0, scaleH / 2 + coverThick / 2, -scaleD / 2);
          
          // Outer Top lid cover slab (extends forward from Z=0)
          const topCoverMesh = new THREE.Mesh(regDisposable(new THREE.BoxGeometry(scaleW * 1.02, coverThick, scaleD * 1.025)), boxMaterial);
          topCoverMesh.position.set(0, 0, scaleD * 0.51); // centered locally
          topCoverMesh.castShadow = true;
          topCoverMesh.receiveShadow = true;
          magneticFlapGroup.add(topCoverMesh);

          // Outer flap (folds down vertically at the front edge of topCover)
          const flapH = scaleH * 0.45; // covers top ~45% of the front wall luxuriously
          const flapMesh = new THREE.Mesh(regDisposable(new THREE.BoxGeometry(scaleW * 1.018, flapH, coverThick)), boxMaterial);
          flapMesh.position.set(0, -flapH / 2, scaleD * 1.02 - coverThick / 2);
          flapMesh.castShadow = true;
          flapMesh.receiveShadow = true;
          magneticFlapGroup.add(flapMesh);

          // Foil/UV Branding Logo on Magnetic FLAP center
          const boxLogoInFoil = p.finishes?.includes("fin_foil") || p.finishes?.includes("fin_dec_foil") || p.logoFoilMode !== "none";
          const boxLogoInSpotUV = p.finishes?.includes("fin_spotUv") || p.finishes?.includes("fin_uv") || p.finishes?.includes("fin_dec_uv") || p.finishes?.includes("fin_emboss");
          const logoTex = regDisposable(createBrandLogoTexture("#ffffff"));
          const logoGeo = regDisposable(new THREE.PlaneGeometry(scaleW * 0.58, (scaleW * 0.58) * (80 / 380)));
          const logoMat = regDisposable(new THREE.MeshPhysicalMaterial({
            color: boxLogoInFoil ? (p.logoFoilMode === "silver" ? "#D0D0D0" : "#E5C17D") : printColor,
            alphaMap: logoTex,
            transparent: true,
            side: THREE.DoubleSide,
            roughness: boxLogoInFoil ? 0.12 : (boxLogoInSpotUV ? 0.08 : 0.68),
            metalness: boxLogoInFoil ? 0.98 : 0.0,
            clearcoat: (boxLogoInFoil || boxLogoInSpotUV) ? 1.0 : 0.0,
            clearcoatRoughness: 0.02,
            sheen: boxLogoInFoil ? 0.0 : 0.85,
            sheenColor: new THREE.Color("#FFFFFF"),
          }));
          const logoMesh = new THREE.Mesh(logoGeo, logoMat);
          logoMesh.rotation.x = -Math.PI / 2;
          logoMesh.position.set(0, coverThick / 2 + 0.005, scaleD * 0.51);
          magneticFlapGroup.add(logoMesh);

          // Elegant Ribbon Pull Loop (decorative luxury fabric tab at bottom of front flap)
          const ribbonColorValue = p.bagHandleColor || p.ribbonColor || "#3A2010";
          const ribbonTabMat = regDisposable(new THREE.MeshStandardMaterial({
            color: ribbonColorValue,
            roughness: 0.16,
            metalness: 0.1,
            side: THREE.DoubleSide
          }));

          const ribbonWidthTab = Math.max(0.18, scaleW * 0.08);
          // A folded ribbon tab extending out forward
          const ribbonTabGeo = regDisposable(new THREE.BoxGeometry(ribbonWidthTab, 0.015, 0.22));
          const ribbonTab = new THREE.Mesh(ribbonTabGeo, ribbonTabMat);
          
          // Positioned precisely at the bottom center of outer flap, sticking forward to pull
          ribbonTab.position.set(0, -flapH + 0.01, scaleD * 1.02 - coverThick / 2 + 0.095);
          ribbonTab.rotation.x = 0.15; // elegant forward drape slope
          magneticFlapGroup.add(ribbonTab);

          productGroup.add(magneticFlapGroup);
        } else if (p.boxStyle === "shoulder_neck") {
          // ── BRAND NEW LUXURY HINGED SHOULDER / NECK BOX ───────────────────
          // Features hollow base, hollow conjoined lid, inner exposed neck, and luxury velvet pad inside!
          
          const baseTrayH = scaleH * 0.42;
          const lidH = scaleH * 0.42;
          const neckH = scaleH * 0.55;
          const wallThick = 0.08;

          const baseGroup = new THREE.Group();
          baseGroup.position.set(0, -scaleH / 2, 0); // rest bottom of base tray on floor

          // 1. Bottom panel
          const bBot = new THREE.Mesh(regDisposable(new THREE.BoxGeometry(scaleW, wallThick, scaleD)), boxMaterial);
          bBot.position.set(0, wallThick / 2, 0);
          bBot.castShadow = true;
          bBot.receiveShadow = true;
          baseGroup.add(bBot);

          // 2. Left wall of base
          const bLeft = new THREE.Mesh(regDisposable(new THREE.BoxGeometry(wallThick, baseTrayH - wallThick, scaleD)), boxMaterial);
          bLeft.position.set(-scaleW / 2 + wallThick / 2, baseTrayH / 2 + wallThick / 2, 0);
          bLeft.castShadow = true;
          bLeft.receiveShadow = true;
          baseGroup.add(bLeft);

          // 3. Right wall of base
          const bRight = new THREE.Mesh(regDisposable(new THREE.BoxGeometry(wallThick, baseTrayH - wallThick, scaleD)), boxMaterial);
          bRight.position.set(scaleW / 2 - wallThick / 2, baseTrayH / 2 + wallThick / 2, 0);
          bRight.castShadow = true;
          bRight.receiveShadow = true;
          baseGroup.add(bRight);

          // 4. Front wall of base
          const bFront = new THREE.Mesh(regDisposable(new THREE.BoxGeometry(scaleW - 2 * wallThick, baseTrayH - wallThick, wallThick)), boxMaterial);
          bFront.position.set(0, baseTrayH / 2 + wallThick / 2, scaleD / 2 - wallThick / 2);
          bFront.castShadow = true;
          bFront.receiveShadow = true;
          baseGroup.add(bFront);

          // 5. Back wall of base
          const bBack = new THREE.Mesh(regDisposable(new THREE.BoxGeometry(scaleW - 2 * wallThick, baseTrayH - wallThick, wallThick)), boxMaterial);
          bBack.position.set(0, baseTrayH / 2 + wallThick / 2, -scaleD / 2 + wallThick / 2);
          bBack.castShadow = true;
          bBack.receiveShadow = true;
          baseGroup.add(bBack);

          // ── LUXURY CHROME / FOIL INNER SHOULDER COLLAR (NECK) ───────────────
          const neckW = scaleW - wallThick * 1.15;
          const neckD = scaleD - wallThick * 1.15;
          const neckGroup = new THREE.Group();
          const neckThick = 0.05;
          const neckWallH = neckH;
          const neckMaterial = regDisposable(new THREE.MeshStandardMaterial({
            color: p.logoFoilMode === "gold" || p.finishes?.includes("fin_foil") ? "#D4AF37" : (p.logoFoilMode === "silver" ? "#D0D0D0" : "#EBE6DF"),
            roughness: p.logoFoilMode !== "none" || p.finishes?.includes("fin_foil") ? 0.2 : 0.45,
            metalness: p.logoFoilMode !== "none" || p.finishes?.includes("fin_foil") ? 0.88 : 0.0,
          }));

          // Left neck wall
          const nLeft = new THREE.Mesh(regDisposable(new THREE.BoxGeometry(neckThick, neckWallH, neckD)), neckMaterial);
          nLeft.position.set(-neckW / 2 + neckThick / 2, neckWallH / 2, 0);
          nLeft.castShadow = true;
          nLeft.receiveShadow = true;
          neckGroup.add(nLeft);

          // Right neck wall
          const nRight = new THREE.Mesh(regDisposable(new THREE.BoxGeometry(neckThick, neckWallH, neckD)), neckMaterial);
          nRight.position.set(neckW / 2 - neckThick / 2, neckWallH / 2, 0);
          nRight.castShadow = true;
          nRight.receiveShadow = true;
          neckGroup.add(nRight);

          // Front neck wall
          const nFront = new THREE.Mesh(regDisposable(new THREE.BoxGeometry(neckW - 2 * neckThick, neckWallH, neckThick)), neckMaterial);
          nFront.position.set(0, neckWallH / 2, neckD / 2 - neckThick / 2);
          nFront.castShadow = true;
          nFront.receiveShadow = true;
          neckGroup.add(nFront);

          // Back neck wall
          const nBack = new THREE.Mesh(regDisposable(new THREE.BoxGeometry(neckW - 2 * neckThick, neckWallH, neckThick)), neckMaterial);
          nBack.position.set(0, neckWallH / 2, -neckD / 2 + neckThick / 2);
          nBack.castShadow = true;
          nBack.receiveShadow = true;
          neckGroup.add(nBack);

          neckGroup.position.set(0, wallThick, 0);
          baseGroup.add(neckGroup);

          // ── LUXURY ACCESSORY PULL-OUT VELVET INSERT PAD ─────────────────────
          const padW = neckW - neckThick * 2 - 0.04;
          const padD = neckD - neckThick * 2 - 0.04;
          const padH = 0.15;
          const padGeo = regDisposable(new THREE.BoxGeometry(padW, padH, padD));
          const padMat = regDisposable(new THREE.MeshStandardMaterial({
            color: "#FAF8F5", // Pristine off-white/ivory velvet texture feel
            roughness: 0.85,
            metalness: 0.02,
          }));
          const padMesh = new THREE.Mesh(padGeo, padMat);
          padMesh.position.set(0, wallThick + padH / 2 + 0.01, 0);
          padMesh.castShadow = true;
          padMesh.receiveShadow = true;
          baseGroup.add(padMesh);

          // ── CONJOINED HINGED LID ROTATION GROUP ──────────────────────────────
          shoulderNeckLidGroup = new THREE.Group();
          // Position pivot perfectly on the Y axis top edge of the base back wall, and on back border Z-axis!
          shoulderNeckLidGroup.position.set(0, baseTrayH, -scaleD / 2);

          const lidSubGroup = new THREE.Group();
          lidSubGroup.position.set(0, 0, scaleD / 2); // rest of lid is relative to hinge axis coordinates

          // Lid Top Cover panel
          const lTop = new THREE.Mesh(regDisposable(new THREE.BoxGeometry(scaleW, wallThick, scaleD)), boxMaterial);
          lTop.position.set(0, lidH - wallThick / 2, 0);
          lTop.castShadow = true;
          lTop.receiveShadow = true;
          lidSubGroup.add(lTop);

          // Lid Left wall
          const lLeft = new THREE.Mesh(regDisposable(new THREE.BoxGeometry(wallThick, lidH - wallThick, scaleD)), boxMaterial);
          lLeft.position.set(-scaleW / 2 + wallThick / 2, (lidH - wallThick) / 2, 0);
          lLeft.castShadow = true;
          lLeft.receiveShadow = true;
          lidSubGroup.add(lLeft);

          // Lid Right wall
          const lRight = new THREE.Mesh(regDisposable(new THREE.BoxGeometry(wallThick, lidH - wallThick, scaleD)), boxMaterial);
          lRight.position.set(scaleW / 2 - wallThick / 2, (lidH - wallThick) / 2, 0);
          lRight.castShadow = true;
          lRight.receiveShadow = true;
          lidSubGroup.add(lRight);

          // Lid Front wall
          const lFront = new THREE.Mesh(regDisposable(new THREE.BoxGeometry(scaleW - 2 * wallThick, lidH - wallThick, wallThick)), boxMaterial);
          lFront.position.set(0, (lidH - wallThick) / 2, scaleD / 2 - wallThick / 2);
          lFront.castShadow = true;
          lFront.receiveShadow = true;
          lidSubGroup.add(lFront);

          // Lid Back wall
          const lBack = new THREE.Mesh(regDisposable(new THREE.BoxGeometry(scaleW - 2 * wallThick, lidH - wallThick, wallThick)), boxMaterial);
          lBack.position.set(0, (lidH - wallThick) / 2, -scaleD / 2 + wallThick / 2);
          lBack.castShadow = true;
          lBack.receiveShadow = true;
          lidSubGroup.add(lBack);

          // Foil logo decoration on the top surface of the lid conjoined top
          const lboxLogoInFoil = p.finishes?.includes("fin_foil") || p.finishes?.includes("fin_dec_foil") || p.logoFoilMode !== "none";
          const lboxLogoInSpotUV = p.finishes?.includes("fin_spotUv") || p.finishes?.includes("fin_uv") || p.finishes?.includes("fin_dec_uv") || p.finishes?.includes("fin_emboss");
          const llogoTex = regDisposable(createBrandLogoTexture("#ffffff"));
          const llogoGeo = regDisposable(new THREE.PlaneGeometry(scaleW * 0.58, (scaleW * 0.58) * (80 / 380)));
          const llogoMat = regDisposable(new THREE.MeshPhysicalMaterial({
            color: lboxLogoInFoil ? (p.logoFoilMode === "silver" ? "#D0D0D0" : "#E5C17D") : printColor,
            alphaMap: llogoTex,
            transparent: true,
            side: THREE.DoubleSide,
            roughness: lboxLogoInFoil ? 0.12 : (lboxLogoInSpotUV ? 0.08 : 0.68),
            metalness: lboxLogoInFoil ? 0.98 : 0.0,
            clearcoat: (lboxLogoInFoil || lboxLogoInSpotUV) ? 1.0 : 0.0,
            clearcoatRoughness: 0.02,
            sheen: lboxLogoInFoil ? 0.0 : 0.85,
            sheenColor: new THREE.Color("#FFFFFF"),
          }));
          const llogoMesh = new THREE.Mesh(llogoGeo, llogoMat);
          llogoMesh.rotation.x = -Math.PI / 2;
          llogoMesh.position.set(0, lidH + 0.005, 0);
          lidSubGroup.add(llogoMesh);

          shoulderNeckLidGroup.add(lidSubGroup);
          baseGroup.add(shoulderNeckLidGroup);

          productGroup.add(baseGroup);
        } else {
          // Bottom box base tray
          const lidOverlapH = Math.max(0.3, scaleH * 0.2); // Proportional lid overlap
          const baseTrayH = scaleH - lidOverlapH;

          const bottomBoxGeo = regDisposable(new THREE.BoxGeometry(scaleW, baseTrayH, scaleD));
          const bottomBox = new THREE.Mesh(bottomBoxGeo, boxMaterial);
          bottomBox.position.set(0, -lidOverlapH / 2, 0);
          bottomBox.castShadow = true;
          bottomBox.receiveShadow = true;
          productGroup.add(bottomBox);

          // ── LUXURY SHOULDER BOX INNER NECK/COLLAR ─────────────────────────────
          // pro packaging detail: raises out of the base tray, keeping lid floating
          const neckW = scaleW * 0.985;
          const neckD = scaleD * 0.985;
          const neckH = scaleH * 0.35; // sleek shoulder collar height
          const neckFoilMat = regDisposable(new THREE.MeshStandardMaterial({
            color: p.logoFoilMode === "gold" || p.finishes?.includes("fin_foil") ? "#D4AF37" : (p.logoFoilMode === "silver" ? "#D0D0D0" : "#EADDC9"), // shiny metallic or premium ivory board
            roughness: p.logoFoilMode !== "none" || p.finishes?.includes("fin_foil") ? 0.15 : 0.4,
            metalness: p.logoFoilMode !== "none" || p.finishes?.includes("fin_foil") ? 0.92 : 0.0,
          }));
          const neckMesh = new THREE.Mesh(regDisposable(new THREE.BoxGeometry(neckW, neckH, neckD)), neckFoilMat);
          // Positioned at junction so it protrudes elegance
          neckMesh.position.set(0, baseTrayH / 2 - lidOverlapH / 2 + neckH / 4, 0);
          neckMesh.castShadow = true;
          neckMesh.receiveShadow = true;
          productGroup.add(neckMesh);

          // Hovering overlapping lid with custom margins
          const lidW = scaleW * 1.025;
          const lidH = lidOverlapH * 1.1;
          const lidD = scaleD * 1.025;

          const lidGeo = regDisposable(new THREE.BoxGeometry(lidW, lidH, lidD));
          const lidMesh = new THREE.Mesh(lidGeo, boxMaterial);
          // Positioned slightly floating upward to show off the premium gold/silver collar gap!
          const lidYPos = baseTrayH / 2 + neckH / 2 - 0.04;
          lidMesh.position.set(0, lidYPos, 0);
          lidMesh.castShadow = true;
          lidMesh.receiveShadow = true;
          productGroup.add(lidMesh);

          // Render branding logo or engraving on box lid!
          const logoInFoil = p.finishes?.includes("fin_foil") || p.finishes?.includes("fin_dec_foil") || p.logoFoilMode !== "none";
          const targetFoilMat = p.logoFoilMode === "silver" ? foilSilverMat : foilGoldMat;
          const decPlateMat = logoInFoil ? targetFoilMat : regDisposable(new THREE.MeshStandardMaterial({ color: printColor, roughness: 0.3 }));

          const handleColorValue = p.bagHandleColor || p.ribbonColor || "#3A2010";

          // ── OPTIONAL DECORATIVE RIBBON BAND AND 3D KNOT BOW ON LID ───────────
          if (p.handleType === "ribbon" || p.handleType === "satin") {
            const ribbonRatio = (p.ribbonWidthCm || 2.0) / 2.0;
            const ribbonW = Math.max(0.18, scaleW * 0.08) * ribbonRatio;
            const ribbonThick = 0.015;
            const rMat = regDisposable(new THREE.MeshStandardMaterial({
              color: handleColorValue,
              roughness: 0.16,
              metalness: 0.1,
              side: THREE.DoubleSide
            }));

            // Cross vertical ribbon band on lid
            const bandVGeo = regDisposable(new THREE.BoxGeometry(ribbonW, ribbonThick, lidD * 1.015));
            const bandVMesh = new THREE.Mesh(bandVGeo, rMat);
            bandVMesh.position.set(0, lidYPos + lidH / 2 + 0.015, 0);
            bandVMesh.castShadow = true;
            productGroup.add(bandVMesh);

            // Cross horizontal ribbon band on lid
            const bandHGeo = regDisposable(new THREE.BoxGeometry(lidW * 1.015, ribbonThick, ribbonW));
            const bandHMesh = new THREE.Mesh(bandHGeo, rMat);
            bandHMesh.position.set(0, lidYPos + lidH / 2 + 0.012, 0);
            bandHMesh.castShadow = true;
            productGroup.add(bandHMesh);

            // Gorgeous centered 3D ribbon tied bow knot!
            const bowGroup = new THREE.Group();
            bowGroup.position.set(0, lidYPos + lidH / 2 + 0.025, 0);

            // Bow loop 1
            const curveL = new THREE.CatmullRomCurve3([
              new THREE.Vector3(0, 0, 0),
              new THREE.Vector3(-0.4, 0.28, 0.1),
              new THREE.Vector3(-0.8, 0.22, 0),
              new THREE.Vector3(-0.4, 0.02, -0.1),
              new THREE.Vector3(0, 0, 0)
            ]);
            const bowLGeo = regDisposable(new THREE.TubeGeometry(curveL, 24, 0.045, 8, false));
            const bowLMesh = new THREE.Mesh(bowLGeo, rMat);
            bowLMesh.castShadow = true;
            bowGroup.add(bowLMesh);

            // Bow loop 2
            const curveR = new THREE.CatmullRomCurve3([
              new THREE.Vector3(0, 0, 0),
              new THREE.Vector3(0.4, 0.28, -0.1),
              new THREE.Vector3(0.8, 0.22, 0),
              new THREE.Vector3(0.4, 0.02, 0.1),
              new THREE.Vector3(0, 0, 0)
            ]);
            const bowRGeo = regDisposable(new THREE.TubeGeometry(curveR, 24, 0.045, 8, false));
            const bowRMesh = new THREE.Mesh(bowRGeo, rMat);
            bowRMesh.castShadow = true;
            bowGroup.add(bowRMesh);

            // Small central tie sphere knot
            const knotMesh = new THREE.Mesh(regDisposable(new THREE.SphereGeometry(0.08, 12, 12)), rMat);
            bowGroup.add(knotMesh);

            // Left dangling tail
            const tailLCurve = new THREE.CatmullRomCurve3([
              new THREE.Vector3(0, 0, 0),
              new THREE.Vector3(-0.35, -0.12, 0.35),
              new THREE.Vector3(-0.65, -0.28, 0.72)
            ]);
            const tailLMesh = new THREE.Mesh(regDisposable(new THREE.TubeGeometry(tailLCurve, 16, 0.032, 8, false)), rMat);
            tailLMesh.castShadow = true;
            bowGroup.add(tailLMesh);

            // Right dangling tail
            const tailRCurve = new THREE.CatmullRomCurve3([
              new THREE.Vector3(0, 0, 0),
              new THREE.Vector3(0.35, -0.12, 0.35),
              new THREE.Vector3(0.65, -0.28, 0.72)
            ]);
            const tailRMesh = new THREE.Mesh(regDisposable(new THREE.TubeGeometry(tailRCurve, 16, 0.032, 8, false)), rMat);
            tailRMesh.castShadow = true;
            bowGroup.add(tailRMesh);

            productGroup.add(bowGroup);
          }

          // Render branding logo or engraving centered on box lid!
          const boxLogoInFoil = p.finishes?.includes("fin_foil") || p.finishes?.includes("fin_dec_foil") || p.logoFoilMode !== "none";
          const boxLogoInSpotUV = p.finishes?.includes("fin_spotUv") || p.finishes?.includes("fin_uv") || p.finishes?.includes("fin_dec_uv") || p.finishes?.includes("fin_emboss");
          const logoTex = regDisposable(createBrandLogoTexture("#ffffff"));
          const logoGeo = regDisposable(new THREE.PlaneGeometry(lidW * 0.58, (lidW * 0.58) * (80 / 380)));
          const logoMat = regDisposable(new THREE.MeshPhysicalMaterial({
            color: boxLogoInFoil ? (p.logoFoilMode === "silver" ? "#D0D0D0" : "#E5C17D") : printColor,
            alphaMap: logoTex,
            transparent: true,
            side: THREE.DoubleSide,
            roughness: boxLogoInFoil ? 0.12 : (boxLogoInSpotUV ? 0.08 : 0.68),
            metalness: boxLogoInFoil ? 0.98 : 0.0,
            clearcoat: (boxLogoInFoil || boxLogoInSpotUV) ? 1.0 : 0.0,
            clearcoatRoughness: 0.02,
            sheen: boxLogoInFoil ? 0.0 : 0.85,
            sheenColor: new THREE.Color("#FFFFFF"),
          }));
          const logoMesh = new THREE.Mesh(logoGeo, logoMat);
          logoMesh.rotation.x = -Math.PI / 2;
          // Shunted slightly back if ribbon is active
          const plateZOffset = (p.handleType === "ribbon" || p.handleType === "satin") ? (lidD * 0.22) : 0;
          logoMesh.position.set(0, lidYPos + lidH / 2 + 0.012, plateZOffset);
          productGroup.add(logoMesh);
        }
      }
      // ── MODEL C: SPOOLS, LABELS, STANDARD ROLL SHAPES ─────────────────────
      else {
        const generalGeo = regDisposable(new THREE.CylinderGeometry(scaleW * 0.44, scaleW * 0.44, scaleH * 0.22, 32));
        const generalMesh = new THREE.Mesh(generalGeo, surfaceMat);
        generalMesh.castShadow = true;
        generalMesh.receiveShadow = true;
        productGroup.add(generalMesh);

        const coreMat = regDisposable(new THREE.MeshStandardMaterial({ color: "#e8dfd0", roughness: 0.9 }));
        const coreGeo = regDisposable(new THREE.CylinderGeometry(scaleW * 0.14, scaleW * 0.14, scaleH * 0.24, 32));
        const coreMesh = new THREE.Mesh(coreGeo, coreMat);
        productGroup.add(coreMesh);
      }

      // ── PROCEDURAL AMBIENT OCCLUSION CONTACT SHADOW ─────────────────────────
      const contactShadowTex = regDisposable(createContactShadowTexture()!);
      const shadowMat = regDisposable(new THREE.MeshBasicMaterial({
        map: contactShadowTex,
        transparent: true,
        blending: THREE.MultiplyBlending,
        premultipliedAlpha: true,
        opacity: 0.88,
        depthWrite: false,
      }));
      // Soft shadow plane sized specifically to follow the actual base bounds
      const shadowPlaneGeo = regDisposable(new THREE.PlaneGeometry(scaleW * 1.55, scaleD * 1.55));
      const contactShadowMesh = new THREE.Mesh(shadowPlaneGeo, shadowMat);
      contactShadowMesh.rotation.x = -Math.PI / 2;
      contactShadowMesh.position.set(0, -halfH + 0.005, 0); // Sits micro-offset above floor edge inside the group
      productGroup.add(contactShadowMesh);

      // Place the model so its bottom sits exactly at the floor height y = -4.5
      productGroup.position.y = -4.5 + halfH;

      // ── RENDER 1:1 SCALE IPHONE FOR VISUAL SIZE COMPARISON ─────────────────
      if (p.compareSize) {
        const factor = isBox ? normFactor : (scaleH / p.h);
        const phoneW = 7.15 * factor;
        const phoneH = 14.96 * factor;
        const phoneD = 0.825 * factor;

        const phoneMesh = buildProceduralIPhone(factor, regDisposable);

        // Position it to the right of the packaging with some visual spacing
        const gap = 1.0 * factor;
        phoneMesh.position.x = halfW + gap + (phoneW / 2);
        phoneMesh.position.y = -halfH + (phoneH / 2);
        phoneMesh.position.z = 0.25 * factor; 
        phoneMesh.rotation.y = -0.32; // Rotate slightly to face the camera naturally

        productGroup.add(phoneMesh);

        // Simple procedural contact shadow for the phone base
        const phoneShadowGeo = regDisposable(new THREE.PlaneGeometry(phoneW * 2.2, phoneD * 4.5));
        const phoneShadowMesh = new THREE.Mesh(phoneShadowGeo, shadowMat);
        phoneShadowMesh.rotation.x = -Math.PI / 2;
        phoneShadowMesh.position.set(phoneMesh.position.x, -halfH + 0.005, phoneMesh.position.z);
        phoneShadowMesh.rotation.z = -0.32; // Align rotation with the stance
        productGroup.add(phoneShadowMesh);
      }
    };

    const buildGuidelines = () => {
      // Clear existing helper elements
      while (helperLinesGroup.children.length > 0) {
        helperLinesGroup.remove(helperLinesGroup.children[0]);
      }

      if (!showGuidelines) return;

      const p = paramsRef.current;
      const isBox = p.productType === "boxes";
      let scaleW: number, scaleH: number, scaleD: number;

      if (isBox) {
        // For boxes, dimensions are: w (length), h (width), d (height)
        // We normalize uniformly so the physical box proportions correspond 1:1 with Three.js scales.
        const maxDim = Math.max(p.w, p.h, p.d);
        const normFactor = 4.8 / Math.max(10, maxDim); // normalized bounding factor
        scaleW = p.w * normFactor;
        scaleD = p.h * normFactor; // Width (W) in physical maps to Depth (Z-axis) in 3D
        scaleH = p.d * normFactor; // Height (H) in physical maps to Height (Y-axis) in 3D
      } else {
        const aspectW = p.w / 20; 
        const aspectH = p.h / 25;
        const aspectD = p.d / 8;
        scaleW = Math.max(0.4, Math.min(2.4, aspectW)) * 4.6;
        scaleH = Math.max(0.4, Math.min(2.4, aspectH)) * 5.6;
        scaleD = Math.max(0.2, Math.min(2.4, aspectD)) * 2.2;
      }

      const halfW = scaleW / 2;
      const halfH = scaleH / 2;
      const halfD = scaleD / 2;
      const offsetPos = productGroup.position.y;

      const caliperColor = "#3A2010";

      // Guidelines Material (dotted styling)
      const lineMaterial = regDisposable(new THREE.LineBasicMaterial({
        color: caliperColor,
        transparent: true,
        opacity: 0.38,
      }));

      // ── W (Width/Length) Caliper ─────────────────────────────
      const pointsH = [
        new THREE.Vector3(-halfW, -halfH + offsetPos, halfD + 0.6),
        new THREE.Vector3(halfW, -halfH + offsetPos, halfD + 0.6)
      ];
      const geoH = regDisposable(new THREE.BufferGeometry().setFromPoints(pointsH));
      const lineH = new THREE.Line(geoH, lineMaterial);
      helperLinesGroup.add(lineH);

      // Support drop-pins
      const pinL = [
        new THREE.Vector3(-halfW, -halfH + offsetPos, halfD),
        new THREE.Vector3(-halfW, -halfH + offsetPos, halfD + 0.7)
      ];
      helperLinesGroup.add(new THREE.Line(regDisposable(new THREE.BufferGeometry().setFromPoints(pinL)), lineMaterial));

      const pinR = [
        new THREE.Vector3(halfW, -halfH + offsetPos, halfD),
        new THREE.Vector3(halfW, -halfH + offsetPos, halfD + 0.7)
      ];
      helperLinesGroup.add(new THREE.Line(regDisposable(new THREE.BufferGeometry().setFromPoints(pinR)), lineMaterial));

      // ── H (Height) Caliper ─────────────────────────────────────
      const pointsV = [
        new THREE.Vector3(halfW + 0.6, -halfH + offsetPos, halfD),
        new THREE.Vector3(halfW + 0.6, halfH + offsetPos, halfD)
      ];
      const geoV = regDisposable(new THREE.BufferGeometry().setFromPoints(pointsV));
      const lineV = new THREE.Line(geoV, lineMaterial);
      helperLinesGroup.add(lineV);

      // Support drop-pins for H
      const pinV1 = [
        new THREE.Vector3(halfW, -halfH + offsetPos, halfD),
        new THREE.Vector3(halfW + 0.7, -halfH + offsetPos, halfD)
      ];
      helperLinesGroup.add(new THREE.Line(regDisposable(new THREE.BufferGeometry().setFromPoints(pinV1)), lineMaterial));

      const pinV2 = [
        new THREE.Vector3(halfW, halfH + offsetPos, halfD),
        new THREE.Vector3(halfW + 0.7, halfH + offsetPos, halfD)
      ];
      helperLinesGroup.add(new THREE.Line(regDisposable(new THREE.BufferGeometry().setFromPoints(pinV2)), lineMaterial));


      // ── D (Depth/Gusset) Caliper ──────────────────────────────
      const pointsD = [
        new THREE.Vector3(halfW + 0.6, -halfH + offsetPos, -halfD),
        new THREE.Vector3(halfW + 0.6, -halfH + offsetPos, halfD)
      ];
      const geoD = regDisposable(new THREE.BufferGeometry().setFromPoints(pointsD));
      const lineD = new THREE.Line(geoD, lineMaterial);
      helperLinesGroup.add(lineD);

      const pinD1 = [
        new THREE.Vector3(halfW, -halfH + offsetPos, -halfD),
        new THREE.Vector3(halfW + 0.7, -halfH + offsetPos, -halfD)
      ];
      helperLinesGroup.add(new THREE.Line(regDisposable(new THREE.BufferGeometry().setFromPoints(pinD1)), lineMaterial));

      const pinD2 = [
        new THREE.Vector3(halfW, -halfH + offsetPos, halfD),
        new THREE.Vector3(halfW + 0.7, -halfH + offsetPos, halfD)
      ];
      helperLinesGroup.add(new THREE.Line(regDisposable(new THREE.BufferGeometry().setFromPoints(pinD2)), lineMaterial));

      // ── Dynamic 3D Dimension Sprite Labels on the Package itself ──
      const createLabelSprite = (text: string) => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        if (!ctx) return new THREE.Sprite();

        // 512x256 High resolution raster canvas for ultra-crisp vector-like text
        canvas.width = 512;
        canvas.height = 256;

        // Custom stylized premium photographic badge drop-shadow for gorgeous float depth
        ctx.shadowColor = "rgba(0, 0, 0, 0.38)";
        ctx.shadowBlur = 18;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 8;

        // Custom stylized deep dark forest opulent background capsule
        ctx.fillStyle = "rgba(16, 44, 25, 0.96)"; // Premium opulent capsule primary
        ctx.strokeStyle = "rgba(255, 255, 255, 0.98)";
        ctx.lineWidth = 8;

        const r = 40;
        const x = 12;
        const y = 12;
        const w = canvas.width - 24;
        const h = canvas.height - 24;

        ctx.beginPath();
        ctx.moveTo(x + r, y);
        ctx.lineTo(x + w - r, y);
        ctx.quadraticCurveTo(x + w, y, x + w, y + r);
        ctx.lineTo(x + w, y + h - r);
        ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
        ctx.lineTo(x + r, y + h);
        ctx.quadraticCurveTo(x, y + h, x, y + h - r);
        ctx.lineTo(x, y + r);
        ctx.quadraticCurveTo(x, y, x + r, y);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Reset canvas context drop shadow to ensure text edges are perfectly razor-sharp
        ctx.shadowColor = "transparent";
        ctx.shadowBlur = 0;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;

        // Draw crisp bold uppercase numbers
        ctx.fillStyle = "#FFFFFF";
        ctx.font = "bold 92px system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(text, canvas.width / 2, canvas.height / 2);

        const texture = regDisposable(new THREE.CanvasTexture(canvas));
        texture.minFilter = THREE.LinearMipmapLinearFilter;
        texture.magFilter = THREE.LinearFilter;

        const mat = regDisposable(new THREE.SpriteMaterial({
          map: texture,
          transparent: true,
          sizeAttenuation: true,
          depthTest: false, // Ensures labels are readable layered cleanly above lines
        }));

        const sprite = new THREE.Sprite(mat);
        sprite.scale.set(1.9, 0.95, 1); // Perfect scaling for ultra-high legibility
        return sprite;
      };

      const unitLabel = t("common.units.cm", "սմ");

      // 1. Width (W) label: Centered along the Width caliper line
      const wLabel = createLabelSprite(`${p.w} ${unitLabel}`);
      wLabel.position.set(0, -halfH + offsetPos, halfD + 1.2);
      helperLinesGroup.add(wLabel);

      // 2. Height (H) label: Centered along the Height caliper line
      const hValue = isBox ? p.d : p.h;
      const hLabel = createLabelSprite(`${hValue} ${unitLabel}`);
      hLabel.position.set(halfW + 1.7, offsetPos, halfD);
      helperLinesGroup.add(hLabel);

      // 3. Depth (D) label: Centered along the Depth caliper line
      const dValue = isBox ? p.h : p.d;
      const dLabel = createLabelSprite(`${dValue} ${unitLabel}`);
      dLabel.position.set(halfW + 1.6, -halfH + offsetPos, 0);
      helperLinesGroup.add(dLabel);
    };

    // First model generation
    buildProductModel();
    buildGuidelines();

    // ── ANIMATE & FAST 60FPS REBUILD FRAME LOOP ─────────────────────────────
    let animationFrameId: number;
    let lastParamsKey = "";

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      // CPU/GPU relief when the component runs off-screen
      if (!isIntersecting) {
        return;
      }

      // Instantly track params changes inside loop to avoid laggy set-intervals!
      const p = paramsRef.current;
      const currentParamsKey = `${p.productType}_${p.w}_${p.h}_${p.d}_${p.paperType}_${p.lamination}_${p.handleType}_${p.ribbonColor}_${p.finishes?.join(",")}_${p.colorsCount}_${p.baseHexColor}_${p.grainScale}_${p.sides}_${p.handlePose}_${p.bagHandleColor}_${p.ribbonWidthCm}_${p.boxStyle}_${p.compareSize}_${p.showGuidelines}`;
      
      if (currentParamsKey !== lastParamsKey) {
        buildProductModel();
        buildGuidelines();
        lastParamsKey = currentParamsKey;
      }

      // Smooth custom drawer box sliding animation
      if (drawerMeshGroup && p.productType === "boxes" && p.boxStyle === "sleeve_drawer") {
        const time = performance.now() * 0.0012;
        const slideRatio = Math.sin(time * 1.5) * 0.5 + 0.5; // goes seamlessly from 0.0 to 1.0
        const aspectD = p.d / 8;
        const scaleD = Math.max(0.2, Math.min(2.4, aspectD)) * 2.2;
        drawerMeshGroup.position.z = slideRatio * (scaleD * 0.62);
      }

      // Smooth custom magnetic box flap opening/closing loop
      if (magneticFlapGroup && p.productType === "boxes" && p.boxStyle === "magnetic_flap") {
        const time = performance.now() * 0.0012;
        const openRatio = Math.sin(time * 1.5) * 0.5 + 0.5; // goes seamlessly from 0.0 to 1.0
        magneticFlapGroup.rotation.x = -openRatio * Math.PI * 0.45; // Beautifully rotates open and closed
      }

      // Smooth custom shoulder neck conjoined hinged lid opening/closing loop
      if (shoulderNeckLidGroup && p.productType === "boxes" && p.boxStyle === "shoulder_neck") {
        const time = performance.now() * 0.0012;
        const openRatio = Math.sin(time * 1.5) * 0.5 + 0.5; // goes seamlessly from 0.0 to 1.0
        shoulderNeckLidGroup.rotation.x = -openRatio * 1.9; // Beautifully rotates backwards up to ~110 degrees
      }

      // Smooth rotate animation
      if (autoRotate && controls) {
        productGroup.rotation.y += 0.0055;
        helperLinesGroup.rotation.y += 0.0055;
      } else {
        helperLinesGroup.rotation.y = productGroup.rotation.y;
      }

      controls.update();
      renderer.render(scene, camera);
    };

    animate();

    // ── RE-BUILD TRIGGERS ON RESIZE ──────────────────────────────────────────
    const handleResize = () => {
      if (!containerRef.current) return;
      const wWidth = containerRef.current.clientWidth || 400;
      const wHeight = containerRef.current.clientHeight || height;
      camera.aspect = wWidth / wHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(wWidth, wHeight);
    };

    window.addEventListener("resize", handleResize);

    // ── DISPOSE CLEANUPS ────────────────────────────────────────────────────
    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
      controls.dispose();

      if (observer) {
        observer.disconnect();
      }

      // Exhaustive dispose of WebGL objects to prevent memory leaks
      disposables.forEach((item) => {
        item.dispose();
      });

      if (renderer) {
        renderer.dispose();
      }
    };
  }, [productType, showGuidelines, autoRotate, isOpen, sides, handlePose]);

  // Color options palette
  const colorsPalette = [
    { label: t("model3d.color_natural", "Բնական (Default)"), hex: "" },
    { label: t("model3d.color_brand", "Capsule Red (Ֆիրմային)"), hex: "#ff2300" }, // Exquisitely matching the corporate brand color of Capsule Lab!
    { label: t("model3d.color_solar", "Solar Yellow (Դեղին)"), hex: "#FFD200" }, // Matching the gorgeous yellow mockup bag perfectly!
    { label: t("model3d.color_forest", "Forest Sylvan (Կանաչ)"), hex: "#2C4A3E" },
    { label: t("model3d.color_slate", "Slate Carbon (Մոխրագույն)"), hex: "#2C3135" },
    { label: t("model3d.color_royal", "Classic Royal (Կապույտ)"), hex: "#1D3557" },
    { label: t("model3d.color_cream", "Luxury Cream (Կրեմագույն)"), hex: "#FDF6E2" },
  ];

  return (
    <div className="bg-capsule-surf border border-capsule-accent/15 rounded-3xl p-5 shadow-sm space-y-4 select-none relative overflow-hidden transition-all duration-300">
      
      {/* Interactive live viewport controls / Header accordion dropdown toggle */}
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="flex justify-between items-center border-b border-capsule-accent/5 pb-2 cursor-pointer hover:opacity-90 select-none group/hdr"
      >
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-capsule-accent/5 text-capsule-accent">
            <Layers size={14} className={`text-capsule-accent ${isOpen ? "animate-pulse" : ""}`} />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] tracking-widest font-bold uppercase text-capsule-text-muted">{t("model3d.title", "Ինտերակտիվ 3D Մոդել (Live)")}</span>
            <span className="text-[8px] text-capsule-accent/70 font-semibold uppercase">{isOpen ? t("model3d.click_to_close", "Սեղմեք փակելու համար") : t("model3d.click_to_open", "Սեղմեք բացելու համար")}</span>
          </div>
          <ChevronDown 
            size={14} 
            className={`text-capsule-accent transition-transform duration-300 ml-1 ${isOpen ? "rotate-180" : ""}`} 
          />
        </div>
        
        {isOpen && (
          <div 
            onClick={(e) => e.stopPropagation()} 
            className="flex items-center gap-1"
          >
            <button
              onClick={() => setAutoRotate(!autoRotate)}
              title={t("model3d.rotate_mode", "Պտտման Ռեժիմ")}
              className={`p-1.5 rounded-lg border text-[10px] font-bold cursor-pointer transition-all flex items-center gap-1 ${
                autoRotate 
                  ? "bg-capsule-accent/10 border-capsule-accent/30 text-capsule-accent" 
                  : "bg-capsule-surf2/40 border-capsule-accent/10 text-capsule-text-secondary"
              }`}
            >
              <RotateCw size={10} className={autoRotate ? "animate-spin" : ""} />
              <span className="hidden sm:inline">{t("model3d.rotate", "Պտտում")}</span>
            </button>

            <button
              onClick={() => setShowGuidelines(!showGuidelines)}
              title={t("model3d.guidelines_mode", "Չափման Գծեր")}
              className={`p-1.5 rounded-lg border text-[10px] font-bold cursor-pointer transition-all flex items-center gap-1 ${
                showGuidelines
                  ? "bg-capsule-accent/10 border-capsule-accent/30 text-capsule-accent"
                  : "bg-capsule-surf2/40 border-capsule-accent/10 text-capsule-text-secondary"
              }`}
            >
              <Info size={10} />
              <span className="hidden sm:inline">{t("model3d.guidelines", "Գծեր")}</span>
            </button>

            <button
              onClick={() => setCompareSize(!compareSize)}
              title={t("model3d.compare_size", "Չափի Համեմատում")}
              className={`p-1.5 rounded-lg border text-[10px] font-bold cursor-pointer transition-all flex items-center gap-1 ${
                compareSize
                  ? "bg-capsule-accent/10 border-capsule-accent/30 text-capsule-accent"
                  : "bg-capsule-surf2/40 border-capsule-accent/10 text-capsule-text-secondary"
              }`}
            >
              <Smartphone size={10} />
              <span className="hidden sm:inline">{t("model3d.compare", "Համեմատել")}</span>
            </button>

            {(productType === "bags") && (
              <button
                onClick={() => setHandlePose(handlePose === "upright" ? "draped" : "upright")}
                title={t("model3d.handle_pose", "Բռնակի դիրք")}
                className="p-1.5 rounded-lg border text-[10px] font-bold cursor-pointer transition-all flex items-center gap-1 bg-capsule-surf2/40 border-capsule-accent/10 hover:bg-capsule-accent/5 hover:text-capsule-accent hover:border-capsule-accent/20 text-capsule-text-secondary"
              >
                <Sliders size={10} />
                <span className="hidden sm:inline">{handlePose === "upright" ? t("model3d.upright", "Աղեղնաձև") : t("model3d.draped", "Կախված")}</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Collapsible Content Area */}
      {isOpen && (
        <div className="space-y-4 animate-fadeIn transition-all duration-300">
          {/* WebGL Canvas viewport wrapper */}
          <div className="relative group rounded-3xl overflow-hidden bg-gradient-to-b from-[#FEFDFB] via-[#FAF8F5] to-[#EAE6DD] border border-[#1A3F25]/10 shadow-[0_12px_45px_-12px_rgba(26,63,37,0.12)] transition-all duration-300 hover:border-[#1A3F25]/20 hover:shadow-[0_20px_50px_-16px_rgba(26,63,37,0.22)]">
            
            {/* Helper instruction */}
            <div className="absolute top-3 left-3 bg-capsule-surf/85 backdrop-blur-md border border-[#1A3F25]/10 rounded-full px-2.5 py-1 text-[9px] font-bold text-capsule-text-muted flex items-center gap-1 pointer-events-none select-none z-10">
              <Eye size={10} className="text-[#1A3F25]" />
              <span>{t("model3d.rotate_mouse", "Պտտեք մկնիկով")}</span>
            </div>

            {(!w || !h) ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-capsule-surf2/90 backdrop-blur-sm space-y-3 select-none z-20">
                <div className="p-3 bg-capsule-accent/5 rounded-full text-capsule-accent border border-capsule-accent/10">
                  <Sparkles size={24} className="animate-pulse text-capsule-accent" />
                </div>
                <div className="text-[11px] font-bold text-capsule-accent uppercase tracking-wider">{t("model3d.phy_modeling", "3D Ֆիզիկական Մոդելավորում")}</div>
                <p className="text-[10px] sm:text-xs leading-relaxed max-w-[260px] text-capsule-text-secondary mx-auto">
                  {t("model3d.select_fields_error", "Խնդրում ենք ընտրել բոլոր պարտադիր դաշտերը՝ ինտերակտիվ 3D նախադիտումը բեռնելու համար։")}
                </p>
              </div>
            ) : null}

            <div 
              ref={containerRef} 
              className={`w-full h-[320px] xs:h-[360px] sm:h-[420px] md:h-[480px] lg:h-[500px] cursor-grab active:cursor-grabbing transform duration-300 ${(!w || !h) ? 'opacity-0 pointer-events-none' : ''}`}
            />
          </div>

          {/* CUSTOM COLOR PALETTE TO TRY ON MODEL */}
          <div className="space-y-2 select-none">
            <span className="block text-[10px] font-bold text-capsule-text-muted uppercase tracking-wider">{t("model3d.test_color", "Փորձարկեք Գույնը (3D Mockup Color)")}</span>
            <div className="flex flex-wrap gap-2 items-center">
              
              {/* Custom Color Selector Container - Gorgeous interactive color wheel trigger & manual hex validator */}
              <div className="flex items-center gap-1.5 bg-capsule-surf2/45 hover:bg-capsule-surf2/70 rounded-full px-2 py-0.5 border border-capsule-accent/15 transition-all shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
                <label className="relative flex items-center gap-1 cursor-pointer text-[10px] font-bold text-capsule-text-secondary select-none">
                  {/* Invisible native picker spanning above visual badge */}
                  <input 
                    type="color" 
                    value={bagBaseColor ? (bagBaseColor.startsWith("#") && bagBaseColor.length === 7 ? bagBaseColor : "#FAF8F5") : "#FAF8F5"}
                    onChange={(e) => setBagBaseColor(e.target.value)}
                    className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                  />
                  <span 
                    className="w-3.5 h-3.5 rounded-full border border-white shadow-sm flex items-center justify-center overflow-hidden transition-transform duration-200 hover:scale-110 active:scale-95" 
                    style={{ 
                      backgroundColor: bagBaseColor || "#FAF8F5",
                    }} 
                  />
                  <span>{t("model3d.custom_hex", "Անհատական HEX՝")}</span>
                </label>
                <div className="flex items-center bg-white border border-[#1A3F25]/10 rounded-md px-1 py-0.5 shadow-inner">
                  <span className="text-[10px] text-[#1A3F25]/40 font-mono font-bold select-none">#</span>
                  <input 
                    type="text"
                    maxLength={6}
                    placeholder="FFFFFF"
                    value={bagBaseColor ? bagBaseColor.replace("#", "") : ""}
                    onChange={(e) => {
                      const cleanVal = e.target.value.replace(/[^0-9A-Fa-f]/g, "");
                      if (cleanVal.length === 6 || cleanVal.length === 3) {
                        setBagBaseColor("#" + cleanVal);
                      } else {
                        // Keep typing, update temporarily to hex without validation error
                        setBagBaseColor("#" + cleanVal);
                      }
                    }}
                    className="w-[50px] bg-transparent text-[10px] font-mono text-capsule-dark outline-none font-bold placeholder-gray-300 uppercase tracking-wide"
                  />
                </div>
              </div>

              {/* Preset swatches */}
              <div className="flex items-center gap-1.5 flex-wrap">
                {colorsPalette.map((col, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setBagBaseColor(col.hex)}
                    title={col.label}
                    className={`w-5 h-5 rounded-full border transition-all cursor-pointer relative flex items-center justify-center ${
                      (bagBaseColor === col.hex || (col.hex === "" && !bagBaseColor))
                        ? "ring-2 ring-capsule-accent/80 border-white scale-110 shadow-md"
                        : "border-capsule-accent/20 hover:scale-105"
                    }`}
                    style={{ backgroundColor: col.hex || "#FAF8F5" }}
                  >
                    {(bagBaseColor === col.hex || (col.hex === "" && !bagBaseColor)) && (
                      <span className="w-1.5 h-1.5 rounded-full bg-capsule-accent" style={{ backgroundColor: col.hex === "" ? "#1A3F25" : "#FFF" }} />
                    )}
                  </button>
                ))}
              </div>

            </div>
          </div>

          {/* CUSTOM HANDLE COLOR PALETTE */}
          {(productType === "bags" || productType === "boxes") && (
            <div className="space-y-2 select-none border-t border-capsule-accent/5 pt-3">
              <span className="block text-[10px] font-bold text-capsule-text-muted uppercase tracking-wider">
                {productType === "boxes" 
                  ? t("model3d.ribbon_color_label", "Ժապավենի / Բռնակի Գույն (Ribbon / Pull Color)") 
                  : t("model3d.handle_color_label", "Բռնակի Գույն (Custom Handle Color)")}
              </span>
              <div className="flex flex-wrap gap-1.5 font-sans">
                
                {/* Custom Ribbon/Handle Color Picker & HEX Input */}
                <div className="flex items-center gap-1.5 bg-capsule-surf2/45 hover:bg-capsule-surf2/70 rounded-full px-2 py-0.5 border border-capsule-accent/15 transition-all shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
                  <label className="relative flex items-center gap-1 cursor-pointer text-[10px] font-bold text-capsule-text-secondary select-none">
                    {/* Invisible native picker spanning above visual badge */}
                    <input 
                      type="color" 
                      value={bagHandleColor ? (bagHandleColor.startsWith("#") && bagHandleColor.length === 7 ? bagHandleColor : "#3A2010") : "#3A2010"}
                      onChange={(e) => setBagHandleColor(e.target.value)}
                      className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                    />
                    <span 
                      className="w-3.5 h-3.5 rounded-full border border-white shadow-sm flex items-center justify-center overflow-hidden transition-transform duration-200 hover:scale-110 active:scale-95" 
                      style={{ 
                        backgroundColor: bagHandleColor || "#3A2010",
                      }} 
                    />
                    <span>{t("model3d.custom_hex", "Անհատական HEX՝")}</span>
                  </label>
                  <div className="flex items-center bg-white border border-[#1A3F25]/10 rounded-md px-1 py-0.5 shadow-inner">
                    <span className="text-[10px] text-[#1A3F25]/40 font-mono font-bold select-none">#</span>
                    <input 
                      type="text"
                      maxLength={6}
                      placeholder="FFFFFF"
                      value={bagHandleColor ? bagHandleColor.replace("#", "") : ""}
                      onChange={(e) => {
                        const cleanVal = e.target.value.replace(/[^0-9A-Fa-f]/g, "");
                        if (cleanVal.length === 6 || cleanVal.length === 3) {
                          setBagHandleColor("#" + cleanVal);
                        } else {
                          setBagHandleColor("#" + cleanVal);
                        }
                      }}
                      className="w-[50px] bg-transparent text-[10px] font-mono text-capsule-dark outline-none font-bold placeholder-gray-300 uppercase tracking-wide"
                    />
                  </div>
                </div>

              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
