import React, { useEffect, useRef } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { PointerLockControls as ThreePointerLockControls } from 'three-stdlib';
import { Vector3, Vector2, Raycaster, Object3D } from 'three';
import { sounds } from '@/utils/audio';

interface PlayerControllerProps {
  walkSpeedBonus: number;
  onFocusChange: (objectName: string | null) => void;
  onInteract: () => void;
  isLocked: boolean;
  setIsLocked: (locked: boolean) => void;
  onMoveChange: (isMoving: boolean) => void;
  enabled?: boolean;
}

// Vectores pre-asignados a nivel de módulo para evitar Garbage Collection en cada fotograma
const ORIGIN_2D = new Vector2(0, 0);
const _dir = new Vector3();
const _camDir = new Vector3();
const _camSide = new Vector3();
const _up = new Vector3(0, 1, 0);

const VALID_INTERACTABLE_NAMES = [
  'flour',
  'egg',
  'milk',
  'chocolate',
  'sugar',
  'strawberry',
  'mixer',
  'oven',
  'decorating',
  'counter',
  'customer',
  'trash',
];

export const PlayerController: React.FC<PlayerControllerProps> = ({
  walkSpeedBonus,
  onFocusChange,
  onInteract,
  isLocked,
  setIsLocked,
  onMoveChange,
  enabled = true,
}) => {
  const { camera, scene, gl } = useThree();
  const moveState = useRef({ forward: false, backward: false, left: false, right: false });
  const raycaster = useRef(new Raycaster());
  const lastStepTime = useRef(0);
  const wasMovingRef = useRef(false);
  const justLockedTime = useRef(0);
  const controlsRef = useRef<ThreePointerLockControls | null>(null);

  // Evitar re-renders y re-suscripciones innecesarias de listeners
  const onInteractRef = useRef(onInteract);
  onInteractRef.current = onInteract;

  const lastFocusRef = useRef<string | null>(null);
  const frameCounterRef = useRef<number>(0);

  // Posición y orientación inicial de la cámara
  useEffect(() => {
    camera.position.set(0, 1.7, 0);
    camera.lookAt(0, 1.7, -4);
  }, [camera]);

  // Controles de puntero nativos de Three.js
  useEffect(() => {
    if (!enabled) {
      if (controlsRef.current) {
        controlsRef.current.disconnect();
        controlsRef.current.dispose();
        controlsRef.current = null;
      }
      setIsLocked(false);
      onMoveChange(false);
      return;
    }

    const controls = new ThreePointerLockControls(camera, gl.domElement);
    controlsRef.current = controls;

    const onLock = () => {
      justLockedTime.current = performance.now();
      setIsLocked(true);
    };

    const onUnlock = () => {
      setIsLocked(false);
      onMoveChange(false);
    };

    controls.addEventListener('lock', onLock);
    controls.addEventListener('unlock', onUnlock);
    controls.connect(gl.domElement);

    return () => {
      controls.removeEventListener('lock', onLock);
      controls.removeEventListener('unlock', onUnlock);
      controls.disconnect();
      controls.dispose();
      controlsRef.current = null;
    };
  }, [enabled, camera, gl.domElement, setIsLocked, onMoveChange]);

  // Event listeners de teclado y ratón: estables y persistentes (no se recrean en cada tick de tiempo)
  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.code) {
        case 'KeyW':
        case 'ArrowUp':
          moveState.current.forward = true;
          break;
        case 'KeyS':
        case 'ArrowDown':
          moveState.current.backward = true;
          break;
        case 'KeyA':
        case 'ArrowLeft':
          moveState.current.left = true;
          break;
        case 'KeyD':
        case 'ArrowRight':
          moveState.current.right = true;
          break;
        case 'KeyE':
          if (isLocked) {
            onInteractRef.current();
          }
          break;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      switch (e.code) {
        case 'KeyW':
        case 'ArrowUp':
          moveState.current.forward = false;
          break;
        case 'KeyS':
        case 'ArrowDown':
          moveState.current.backward = false;
          break;
        case 'KeyA':
          moveState.current.left = false;
          break;
        case 'KeyD':
          moveState.current.right = false;
          break;
      }
    };

    const handleMouseDown = (e: MouseEvent) => {
      if (isLocked && enabled && e.button === 0) {
        if (performance.now() - justLockedTime.current > 150) {
          onInteractRef.current();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('mousedown', handleMouseDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('mousedown', handleMouseDown);
    };
  }, [enabled, isLocked]);

  // Bucle de física, movimiento y raycasting optimizado
  useFrame((_, delta) => {
    if (!enabled || !isLocked) return;

    const baseSpeed = 4.8 * (1 + walkSpeedBonus);
    const speed = baseSpeed * Math.min(delta, 0.08);

    _dir.set(0, 0, 0);
    camera.getWorldDirection(_camDir);
    _camDir.y = 0;
    _camDir.normalize();

    _camSide.crossVectors(_camDir, _up).normalize();

    if (moveState.current.forward) _dir.add(_camDir);
    if (moveState.current.backward) _dir.sub(_camDir);
    if (moveState.current.left) _dir.sub(_camSide);
    if (moveState.current.right) _dir.add(_camSide);

    const isMoving = _dir.lengthSq() > 0.001;

    if (isMoving !== wasMovingRef.current) {
      wasMovingRef.current = isMoving;
      onMoveChange(isMoving);
    }

    if (isMoving) {
      _dir.normalize();
      const nextX = camera.position.x + _dir.x * speed;
      const nextZ = camera.position.z + _dir.z * speed;

      // Límites de la cocina
      const minX = -4.5;
      const maxX = 4.5;
      const minZ = -4.6;
      const maxZ = 2.8;

      let validX = nextX;
      let validZ = nextZ;

      if (validX < minX) validX = minX;
      if (validX > maxX) validX = maxX;
      if (validZ < minZ) validZ = minZ;
      if (validZ > maxZ) validZ = maxZ;

      // Colisiones con mobiliario
      if (validX < -3.8 && validZ > -5.2 && validZ < -0.8) validX = -3.8;
      if (validX > 3.8 && validZ > -5.2 && validZ < -0.8) validX = 3.8;
      if (validZ < -4.2 && validX > -3.5 && validX < 3.5) validZ = -4.2;
      if (validZ > 2.5 && validX > -3.5 && validX < 3.5) validZ = 2.5;

      camera.position.x = validX;
      camera.position.z = validZ;

      // Sonido de pasos (reutiliza buffer pre-sintetizado sin GC lag)
      const now = performance.now();
      if (now - lastStepTime.current > 330) {
        sounds.playFootstep();
        lastStepTime.current = now;
      }
    }

    // Raycast optimizado: corre cada 2 fotogramas para reducir sobrecarga de GPU/CPU
    frameCounterRef.current++;
    if (frameCounterRef.current % 2 === 0) {
      raycaster.current.setFromCamera(ORIGIN_2D, camera);
      raycaster.current.far = 4.0;

      const intersects = raycaster.current.intersectObjects(scene.children, true);
      let hitInteractable: string | null = null;

      for (let i = 0; i < intersects.length; i++) {
        let cur: Object3D | null = intersects[i].object;
        while (cur) {
          if (cur.name && VALID_INTERACTABLE_NAMES.includes(cur.name)) {
            hitInteractable = cur.name === 'customer' ? 'counter' : cur.name;
            break;
          }
          cur = cur.parent;
        }
        if (hitInteractable) break;
      }

      // CRÍTICO: Únicamente disparar setFocusedObject en React si el objeto bajo la mira realmente cambió
      if (hitInteractable !== lastFocusRef.current) {
        lastFocusRef.current = hitInteractable;
        onFocusChange(hitInteractable);
      }
    }
  });

  return null;
};
