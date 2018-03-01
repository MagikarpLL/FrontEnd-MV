define('threeUtil', ['THREE'], function (THREE) {
    var vsCode = undefined;
    var psCode = undefined;


    return {
        pointListToShape: function (xyzPoints, alt, material) {
            var planeShape = new THREE.Shape();
            planeShape.moveTo(xyzPoints[0].x, xyzPoints[0].z);
            for (var j = 1; j < xyzPoints.length; j++) {
                planeShape.lineTo(xyzPoints[j].x, xyzPoints[j].z);
            }

            var materialArea = material;
            var geometry = new THREE.ShapeGeometry(planeShape);
            var currentArea = new THREE.Mesh(geometry, materialArea);
            currentArea.position.set(0, alt, 0);
            currentArea.rotateX(-Math.PI / 2);
            currentArea.scale.set(1, -1, 1);
            return currentArea;
        },

        removeAllChildren: function (group) {
            for (var j = group.children.length - 1; j >= 0; j--) {
                group.remove(group.children[j]);
            }
        },

        pointListToMeshData: function (lnglatPoints, low, high) {
            //point: {lng,lat,alt}
            //points: [top0,top1,...,top(n-1),bottom0,bottom1,...,bottom(n-1)]
            var points = [];
            lnglatPoints.forEach(function (lnglat) {
                points.push({lng: lnglat[0], lat: lnglat[1], alt: high});
            });
            lnglatPoints.forEach(function (lnglat) {
                points.push({lng: lnglat[0], lat: lnglat[1], alt: low});
            });

            //point: {x,y,z} override point relative position
            //scenePoints:{ sceneId1:{index1:point1, index2:point2, ...}, sceneId2:... }

            //point: {u,v,w} as extension to corresponding point
            //{points:{index1:point1, index2:point2, ...], faces:[[0,1,2],[0,2,3],...], texture:'base64...'}
            var faceGroups = [];
            //top
            var xyPoints = [];
            lnglatPoints.forEach(function (lnglat) {
                xyPoints.push(new THREE.Vector2(lnglat[0], lnglat[1]));
            });
            var topFaces = THREE.ShapeUtils.triangulateShape(xyPoints, []);
            faceGroups.push({
                points: {},
                faces: topFaces,
                textureContent: null,
            });
            //side
            var count = lnglatPoints.length;
            for (var i = 0; i < count; i++) {
                var top1 = i;
                var top2 = (i + 1) % count;
                var bottom1 = i + count;
                var bottom2 = (i + 1) % count + count;
                faceGroups.push({
                    points: {},
                    faces: [[top1, bottom1, top2], [top2, bottom1, bottom2]],
                    textureContent: null,
                });
            }

            return {points: points, faceGroups: faceGroups};
        },

        texture2dProjMaterial: function (color, texture, alpha) {
            if (!vsCode) {
                var vs = THREE.ShaderChunk.meshbasic_vert;
                vs = vs.replace("#include <uv_pars_vertex>",
                    "#include <uv_pars_vertex>\n" +
                    "attribute vec4 tex4;" +
                    "varying vec4 vTex4;"
                );
                vs = vs.replace("#include <project_vertex>",
                    "#include <project_vertex>\n" +
                    "vTex4 = tex4;"
                );
                vsCode = vs;
            }

            if (!psCode) {
                var ps = THREE.ShaderChunk.meshbasic_frag;
                ps = ps.replace("#include <uv_pars_fragment>",
                    "#include <uv_pars_fragment>\n" +
                    "varying vec4 vTex4;"
                );
                ps = ps.replace("#include <map_fragment>",
                    "#ifdef USE_MAP\n\t" +
                    "vec4 texelColor = texture2DProj( map, vTex4 );\n\t" +
                    "texelColor = mapTexelToLinear( texelColor );\n\t" +
                    "diffuseColor *= texelColor;\n" +
                    "#endif\n"
                );
                psCode = ps;
            }

            var material = new THREE.ShaderMaterial({
                uniforms: THREE.UniformsUtils.merge([
                    THREE.UniformsLib.common,
                    THREE.UniformsLib.specularmap,
                    THREE.UniformsLib.envmap,
                    THREE.UniformsLib.aomap,
                    THREE.UniformsLib.lightmap,
                    THREE.UniformsLib.fog
                ]),
                vertexShader: vsCode,
                fragmentShader: psCode,
                transparent: true,
            });
            material.uniforms.diffuse.value = color;
            material.uniforms.map.value = texture;
            material.uniforms.opacity.value = alpha;
            material.map = texture;
            return material;
        },
    }
});