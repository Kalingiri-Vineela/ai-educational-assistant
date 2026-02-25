"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function ThreeScene({ subject }: { subject: string }) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 500 / 400, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });

    renderer.setSize(500, 400);

    if (mountRef.current) {
      mountRef.current.appendChild(renderer.domElement);
    }

    camera.position.z = 5;

    let object: THREE.Object3D;

    // PHYSICS → Pendulum
    if (subject === "Physics") {
      const geometry = new THREE.SphereGeometry(0.5);
      const material = new THREE.MeshNormalMaterial();
      const bob = new THREE.Mesh(geometry, material);
      bob.position.y = -2;

      const stringGeometry = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(0, 2, 0),
        new THREE.Vector3(0, -2, 0),
      ]);

      const string = new THREE.Line(
        stringGeometry,
        new THREE.LineBasicMaterial({ color: 0xffffff })
      );

      object = new THREE.Group();
      object.add(bob);
      object.add(string);

      scene.add(object);

      let angle = 0;
      const animate = () => {
        requestAnimationFrame(animate);
        angle += 0.02;
        object.rotation.z = Math.sin(angle) * 0.5;
        renderer.render(scene, camera);
      };
      animate();
    }

    // CHEMISTRY → Atom Model
    else if (subject === "Chemistry") {
      const nucleus = new THREE.Mesh(
        new THREE.SphereGeometry(1),
        new THREE.MeshNormalMaterial()
      );

      const electron = new THREE.Mesh(
        new THREE.SphereGeometry(0.2),
        new THREE.MeshBasicMaterial({ color: 0x00ffff })
      );

      electron.position.x = 3;

      const group = new THREE.Group();
      group.add(nucleus);
      group.add(electron);
      scene.add(group);

      const animate = () => {
        requestAnimationFrame(animate);
        electron.position.x = 3 * Math.cos(Date.now() * 0.002);
        electron.position.z = 3 * Math.sin(Date.now() * 0.002);
        renderer.render(scene, camera);
      };
      animate();
    }

    // MATHS → Rotating 3D Shape
    else {
      const geometry = new THREE.BoxGeometry();
      const material = new THREE.MeshNormalMaterial();
      const cube = new THREE.Mesh(geometry, material);
      scene.add(cube);

      const animate = () => {
        requestAnimationFrame(animate);
        cube.rotation.x += 0.01;
        cube.rotation.y += 0.01;
        renderer.render(scene, camera);
      };
      animate();
    }

    return () => {
      if (mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
    };
  }, [subject]);

  return <div className="flex justify-center mt-6" ref={mountRef}></div>;
}
