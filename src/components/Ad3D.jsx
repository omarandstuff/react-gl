import React from "react";
import PropTypes from "prop-types";
import "babylonjs-loaders";
import * as BABYLON from "babylonjs";

import "./Ad3D.css";
import model from "../models/tango.obj";
import envTexture from "../textures/env.hdr";
import diffuseTexture from "../textures/albedo.png";
import reflectionTexture from "../textures/roughness.jpg";

const RAD_DEGREE_FACTOR = 0.0174533;

export default class Ad3D extends React.Component {
  static propTypes = {};

  state = {};

  constructor(props) {
    super(props);
    this.canvasRef = React.createRef();
  }

  componentDidMount() {
    const canvas = this.canvasRef.current;

    this.canvasRef.current.onwheel = function(event) {
      event.preventDefault();
    };

    this.canvasRef.current.onmousewheel = function(event) {
      event.preventDefault();
    };

    var engine = new BABYLON.Engine(canvas, true, {
      preserveDrawingBuffer: true,
      stencil: true
    });

    var createScene = function() {
      var scene = new BABYLON.Scene(engine);
      scene.clearColor = new BABYLON.Color4(1, 1, 1, 0.0);

      var camera = new BABYLON.ArcRotateCamera(
        "camera1",
        RAD_DEGREE_FACTOR * 90,
        RAD_DEGREE_FACTOR * 90,
        3.5,
        BABYLON.Vector3.Zero(),
        scene
      );

      camera.attachControl(canvas, false, true);

      var light = new BABYLON.HemisphericLight(
        "light1",
        new BABYLON.Vector3(-1, 1, -1),
        scene
      );
      var light2 = new BABYLON.HemisphericLight(
        "light2",
        new BABYLON.Vector3(1, 1, 1),
        scene
      );

      light.intensity = 7;
      light2.intensity = 2;

      BABYLON.SceneLoader.ImportMesh(null, model, "", scene, function(
        meshes,
        particleSystems,
        skeletons
      ) {
        var pbr = new BABYLON.PBRMetallicRoughnessMaterial("pbr", scene);
        pbr.baseTexture = new BABYLON.Texture(diffuseTexture, scene);
        pbr.metallic = 0.5;
        pbr.roughness = 0.5;
        pbr.environmentTexture = new BABYLON.HDRCubeTexture(
          envTexture,
          scene,
          64,
          true
        );
        pbr.environmentTexture.coordinatesMode = BABYLON.Texture.LINEAR_LINEAR;
        pbr.metallicRoughnessTexture = new BABYLON.Texture(
          reflectionTexture,
          scene
        );

        for (let i = 0; i < meshes.length; i++) {
          meshes[i].material = pbr;
        }
      });

      return scene;
    };

    var scene = createScene();

    engine.runRenderLoop(function() {
      scene.render();
    });

    window.addEventListener("resize", function() {
      engine.resize();
    });
  }

  render() {
    return (
      <div className="ad-3d">
        <canvas ref={this.canvasRef} id="renderCanvas" />
      </div>
    );
  }
}
