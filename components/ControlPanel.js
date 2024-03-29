let ControlPanel = function( ) {
    this.gui = new dat.gui.GUI({width: 280, closeOnTop: true, name: 'Control Panel'});
}

ControlPanel.prototype = {

    init: function ( ) {

        this.gui.add(globalData, 'showData' ).name( "Data" ).listen( ).onChange( function ( ) {
            console.log('show Data: ', globalData.showData);
            document.getElementById('cellData').setAttribute('visible', ''+globalData.showData);
        });

        this.gui.add(globalData, 'showCompass' ).name( "Compass" ).listen( ).onChange( function ( ) {
            console.log('show compass & axis: ', globalData.showCompass);
            compass.showCompass(globalData.showCompass);
            // axis.showAxis(globalData.showCompass);

            // minimap will only occur when there is a trajectory
            if (globalData.inputFile2 && target !== 's4') {
                minimap.showMinimap(globalData.showCompass);
            }
        });

        if (globalData.inputSlice) {
            this.gui.add(globalData, 'showImg' ).name( "Image" ).listen( ).onChange( function ( ) {
                console.log('show image: ', globalData.showImg);
                // document.getElementById('sliceImg').setAttribute('visible', ''+globalData.showImg);
                // document.getElementById('sliceImg').setAttribute('animation', 'property: visible;  to: '+ globalData.showImg+'; dur: 1000; easing: linear')
                for (let i = 1; i < globalData.numOfSlices + 1; i++) {
                    const idTemp = 'slice' + i
                    document.getElementById(idTemp).setAttribute('visible', ''+globalData.showImg);
                }
            });
        }



        this.gui.add(globalData, 'showColormap' ).name( "Colourmap Panel" ).listen( ).onChange( function ( ) {
            console.log('show colormap: ', globalData.showColormap);
            if (globalData.showColormap) {
                $('#colormapToast').toast('show');
            } else {
                $('#colormapToast').toast('hide');
            }
        });

        const changeColormap = this.gui.add( globalData.curColormap, 'Colourmap' ).options( globalData.colormapList);

        changeColormap.onChange( function () {
            console.log('current colormap: ', globalData.curColormap);

            document.getElementById('theSpinner').style.height = '100%';
            document.getElementById('theSpinner').style.visibility = 'visible';

            const colormapPath = globalData.colormapInfo[globalData.curColormap.Colourmap].path

            fetch(colormapPath)
                .then(response => response.text())
                .then(text => {
                    if (globalData.curColormap.Colourmap === "Batlow") {
                        globalData.curUsingColormap = text.split("\n");
                    } else {
                        globalData.curUsingColormap = text.split("\r\n");
                    }
                })
                .then(text => {
                    if (globalData.curVisMode.Mode === 'Default') {
                        loader.renderPoints(globalData.cellData, true, 0);
                    } else {
                        loader.renderPoints(globalData.cellData, true, 1);
                    }
                })
        } );
        let searchAttribute = {
            searchAttribute : function () {
                console.log('search attribute pop-up window');
                $('#theSearchModal').modal('toggle');
                keyboard.enableKeyboardControl(false);
                autocomplete(document.getElementById("myInput"), globalData.markerGeneList);
            }
        };

        let attributeFolder = this.gui.addFolder('Attribute', '#FFFFFF');

        const changeGeneMarker = attributeFolder.add( globalData.curMarkerGene, 'Attribute' ).options( globalData.markerGeneList );

        attributeFolder.add(searchAttribute, 'searchAttribute').name("Search");

        attributeFolder.open();

        changeGeneMarker.onChange( function () {

            console.log('gene marker: ', globalData.curMarkerGene.Attribute);
            document.getElementById('theSpinner').style.height = '100%';
            document.getElementById('theSpinner').style.visibility = 'visible';

            setTimeout(function (){
                if (globalData.curVisMode.Mode === 'High-Quality') {
                    loader.renderPoints(globalData.cellData, true, 1, true)
                } else {
                    loader.renderPoints(globalData.cellData, true, 0, true)
                }
            }, 1);

        } );

        let visMethodFolder = this.gui.addFolder('Visualization', '#FFFFFF');
        const changeVisMethodX = visMethodFolder.add(globalData.curVisMethod, 'x').options( globalData.markerGeneList );
        const changeVisMethodY = visMethodFolder.add(globalData.curVisMethod, 'y').options( globalData.markerGeneList );
        const changeVisMethodZ = visMethodFolder.add(globalData.curVisMethod, 'z').options( globalData.markerGeneList );
        visMethodFolder.open()
        changeVisMethodX.onChange( function () {
            document.getElementById('theSpinner').style.height = '100%';
            document.getElementById('theSpinner').style.visibility = 'visible';

            setTimeout(function (){
                if (globalData.curVisMode.Mode === 'High-Quality') {
                    loader.renderPoints(globalData.cellData, true, 1, true)
                } else {
                    loader.renderPoints(globalData.cellData, true, 0, true)
                }
            }, 1);
        });
        changeVisMethodY.onChange( function () {
            document.getElementById('theSpinner').style.height = '100%';
            document.getElementById('theSpinner').style.visibility = 'visible';

            setTimeout(function (){
                if (globalData.curVisMode.Mode === 'High-Quality') {
                    loader.renderPoints(globalData.cellData, true, 1, true)
                } else {
                    loader.renderPoints(globalData.cellData, true, 0, true)
                }
            }, 1);
        });
        changeVisMethodZ.onChange( function () {
            document.getElementById('theSpinner').style.height = '100%';
            document.getElementById('theSpinner').style.visibility = 'visible';

            setTimeout(function (){
                if (globalData.curVisMode.Mode === 'High-Quality') {
                    loader.renderPoints(globalData.cellData, true, 1, true)
                } else {
                    loader.renderPoints(globalData.cellData, true, 0, true)
                }
            }, 1);
        });


        if (globalData.inputFile2 && target !== 's3' && target !== 's4') {
            let trajectoryFolder = this.gui.addFolder('Trajectory', '#FFFFFF');
            trajectoryFolder.add(globalData, 'showTrajectory' ).name( "Trajectory" ).listen( ).onChange( function ( ) {
                console.log('show the trajectory: ', globalData.showTrajectory);
                document.getElementById('trajectory').setAttribute('visible', ''+globalData.showTrajectory);
            });

            let trajMove = {
                trajMove: function () {
                    loader2.traObjectsContainer.setAttribute('visible', 'false');
                    setTimeout(function (){
                        loader2.traObjectsContainer.setAttribute('visible', 'true');

                        // TODO set the checkpoint
                        loader.getObjectFromID(globalData.trajectoryData, globalData.destinationCheckpoint.id, globalData.idStrTra).then(target => {

                            let childrenList
                            try {
                                childrenList = target.children.split(",")
                            } catch (e) {
                                alert('Reached the end')
                                childrenList = [globalData.trajRootId];
                            }


                            if (childrenList.length === 1) {
                                console.log("Only one child");
                                loader.getObjectFromID(globalData.trajectoryData, childrenList[0], globalData.idStrTra).then(target2 => {
                                    console.log('feat: ', target2);
                                    globalData.destinationCheckpoint = {id: target2[globalData.idStrTra], x: target2.x*globalData.scaleUp, y: target2.y*globalData.scaleUp, z: target2.z*globalData.scaleUp}
                                })
                            }
                        })


                    }, movementController.positionAnimationDur)
                    movementController.move(camera, container, globalData.destinationCheckpoint);
                },
            };

            trajectoryFolder.add(trajMove, 'trajMove' ).name( "Continue");

            trajectoryFolder.open();
        }



        let animationWithPath = {
            animationWithPath: function () {
            },
        };
        let stopAnimation = {
            stopAnimation: function () {
                console.log('stop animation');
                globalData.stopMoveBtn = true;
            },
        };

        if (globalData.numOfSlices === 0) {
            let stare = "30 30 30"
            if (target === 's2') {
                stare = "75 75 75"
            }
            let i = 0;
            let lap =  {
                lap: function(){
                    console.log(globalData.lapPath[target].length);
                    if (i >= globalData.lapPath[target].length - 1) {
                        i = 0;
                    } else {
                        i++;
                    }
                    let d = globalData.lapPath[target][i].split(" ");
                    let destination = new THREE.Vector3(d[0], d[1], d[2]);
                    movementController.move(camera, container, destination, false, stare, 0, 1200, 1000);
                }
            };
            this.gui.add(lap, 'lap').name("Lap");
        };

        if (globalData.inputPath && target !== 's3' && target !== 's4') {
            let defaultPathFolder = this.gui.addFolder('Animation', '#FFFFFF');
            Object.keys(globalData.curAnimationPath).forEach(function(key) {
                defaultPathFolder.add(animationWithPath, 'animationWithPath').name( key ).listen( ).onChange( function ( ) {
                    let pathList = globalData.curAnimationPath[key].split(' ');

                    console.log('path list: ', pathList);

                    globalData.stopMoveBtn = false;

                    try {
                        movementController.moveThroughPath(camera, container, pathList);
                    } catch (error) {
                        console.log(error);
                        alert('This input path is not applicable');
                    }


                });
            });

            defaultPathFolder.add(stopAnimation, 'stopAnimation').name('Stop');
        }

        let reset = {
            reset: function () {

                if (globalData.onMovement) {
                    window.location.href = window.location.href;
                }


                if (globalData.inputSlice) {
                    camera.setAttribute("position", "75 75 350");
                } else {
                    if (target === 's1') {
                        camera.setAttribute("position", "30 30 250");
                    } else {
                        camera.setAttribute("position", "75 75 250");
                    }

                }

                container.setAttribute('rotation', '0 0 0');

                camera.components["look-controls"].pitchObject.rotation.x = 0;
                camera.components["look-controls"].yawObject.rotation.y = 0;


            }
        };

        let screenShot =  {
            screenShot: function(){
                document.getElementById('scene').components.screenshot.capture('perspective');
            }
        };

        let help = {
            help: function () {
                console.log('show the help modal');
                $('#theModal').modal('toggle');
            }
        };

        let exit = {
            exit: function () {
                location.href = "index.html";
            }
        };



        let liftUp = {

            liftUp1: function () {
                if (target === 's3' && globalData.s3Trans2) {
                    if ( globalData.curVisMode.Mode === 'High-Quality' ) {
                        transform_hp(globalData.cellData3D2, 2)
                    } else {
                        transform(globalData.cellData3D2, 2);
                    }
                } else {
                    if ( globalData.curVisMode.Mode === 'High-Quality' ) {
                        transform_hp(globalData.cellData3D, 1)
                    } else {
                        transform(globalData.cellData3D, 1);
                    }
                }

                // TODO add history trajectory


            },

            liftUp2: function () {
                if ( globalData.curVisMode.Mode === 'High-Quality' ) {
                    transform_hp(globalData.cellData3D2, 2);
                } else {
                    transform(globalData.cellData3D2, 2);
                }

            },

        };


        function transform(dataObj, status) {
            if (globalData.startFrom2D) {
                console.log('From 2D to 3D');
                globalData.startFrom2D = false;

                let target = document.getElementById('cellData').object3D;
                createjs.Tween.get(target.position).to({x: 75, y: 75}, 1000)
                createjs.Tween.get(target.scale).to({x: 0.05, y: 0.05, z: 0.05}, 1000).call(f);

                function f() {

                    if (globalData.isStr) {

                        // TODO bug fileTrans has no mg information
                        let newPosObj = loader.object3DToBufferArrayCluster(dataObj, globalData.curMarkerGene.Attribute);

                        //console.log(newPosObj);

                        Object.entries(globalData.groupRenderColor).forEach(element => {
                            const id = element[0];
                            let newPos = new THREE.Float32BufferAttribute(newPosObj[id], 3)
                            document.getElementById('3Dcluster_'+id).object3D.children[0].geometry.setAttribute(
                                'position',
                                newPos
                            )
                        })

                    } else {
                        let newPos = new THREE.Float32BufferAttribute(loader.object3DToBufferArray(dataObj), 3);
                        document.getElementById('cellData').object3D.children[0].children[0].geometry.setAttribute(
                            'position',
                            newPos
                        );
                    }
                    f1();
                }

                function f1() {
                    createjs.Tween.get(target.position).to({x: 0, y: 0}, 1000)
                    createjs.Tween.get(target.scale).to({x: 1, y: 1, z: 1}, 1000);
                }

                // if (globalData.inputSlice) {
                //     for (let i = 1; i < globalData.numOfSlices + 1; i++) {
                //         const idTemp = 'slice' + i
                //         let targetImg = document.getElementById(idTemp);
                //         let originalImgPos = targetImg.getAttribute('position');
                //         let originalImgPosStr = '';
                //         if (globalData.imagePositionCache[idTemp] !== undefined) {
                //             originalImgPosStr = globalData.imagePositionCache[idTemp];
                //         } else {
                //             originalImgPosStr = originalImgPos.x + ' ' + originalImgPos.y + ' ' + originalImgPos.z;
                //             globalData.imagePositionCache[idTemp] = originalImgPosStr;
                //         }
                //         let originalImgPosStrArray = originalImgPosStr.split(' ');
                //         let posImgStr = originalImgPosStrArray[0] + ' ' + (Number(originalImgPosStrArray[1]) - 200) + ' ' + (Number(originalImgPosStrArray[2]) - 30);
                //         targetImg.setAttribute('animation', 'property: position; from: ' + originalImgPosStr + '; to: ' + posImgStr + '; dur: 500; easing: easeInOutSine')
                //     }
                // }

                if (status === 1) {
                    globalData.curStatus = 1;
                } else if (status === 2) {
                    globalData.curStatus = 2;
                }

            } else {
                console.log('From 3D to 2D');
                if (document.getElementById('lineConnection') != null) {
                    container.removeChild(document.getElementById('lineConnection'));
                }
                globalData.showLinkage = false;

                globalData.startFrom2D = true;

                let target = document.getElementById('cellData').object3D;
                createjs.Tween.get(target.position).to({x: 75, y: 75}, 1000)
                createjs.Tween.get(target.scale).to({x: 0.05, y: 0.05, z: 0.05}, 1000).call(f);
                function f() {
                    if (globalData.isStr) {
                        let newPosObj = loader.object3DToBufferArrayCluster(globalData.cellData, globalData.curMarkerGene.Attribute);
                        Object.entries(globalData.groupRenderColor).forEach(element => {
                            const id = element[0];
                            let newPos = new THREE.Float32BufferAttribute(newPosObj[id], 3)
                            document.getElementById('3Dcluster_'+id).object3D.children[0].geometry.setAttribute(
                                'position',
                                newPos
                            )
                        })
                    } else {
                        let newPos = new THREE.Float32BufferAttribute(loader.object3DToBufferArray(globalData.cellData), 3);
                        document.getElementById('cellData').object3D.children[0].children[0].geometry.setAttribute(
                            'position',
                            newPos
                        );
                    }
                    f1();
                }
                function f1() {
                    createjs.Tween.get(target.position).to({x: 0, y: 0}, 1000)
                    createjs.Tween.get(target.scale).to({x: 1, y: 1, z: 1}, 1000);
                }

                // if (globalData.inputSlice) {
                //     for (let i = 1; i < globalData.numOfSlices+1; i++) {
                //         const idTemp = 'slice' + i
                //         let targetImg = document.getElementById(idTemp);
                //         let originalImgPos = targetImg.getAttribute('position');
                //         let originalImgPosStr = originalImgPos.x + ' ' + originalImgPos.y + ' ' + originalImgPos.z;
                //         let posImgStr = globalData.imagePositionCache[idTemp];
                //         targetImg.setAttribute('animation', 'property: position; from: ' + originalImgPosStr + '; to: '+ posImgStr +'; dur: 3000; easing: easeInOutSine')
                //     }
                // }

                globalData.curStatus = 0;

            }

        }

        function transform_hp(dataObj, status) {

            if (globalData.startFrom2D) {
                console.log('From 2D to 3D');
                globalData.startFrom2D = false;
                globalData.cellData.forEach(element => {
                    let origin = document.getElementById(element[globalData.idStr]);
                    let originalPos = origin.getAttribute('position');
                    let originalPosStr = originalPos.x + ' ' + originalPos.y + ' ' + originalPos.z;
                    loader.getObjectFromID(dataObj, element[globalData.idStr], globalData.idStr).then(
                        target => {
                            let targetStr = target.x*globalData.scaleUp+ ' ' + target.y*globalData.scaleUp + ' ' + target.z*globalData.scaleUp;
                            origin.setAttribute('animation', 'property: position; from: ' + originalPosStr + '; to: '+ targetStr +'; dur: 1500; easing: easeInOutSine');
                        },
                        reject => {
                            let targetStr = originalPos.x + ' ' + (Number(originalPos.y) - 200) + ' ' + (Number(originalPos.z) - 30);
                            origin.setAttribute('animation', 'property: position; from: ' + originalPosStr + '; to: '+ targetStr +'; dur: 1000; easing: easeInOutSine');
                        }
                    )
                });


                if (status === 1) {
                    globalData.curStatus = 1;
                } else if (status === 2) {
                    globalData.curStatus = 2;
                }


            } else {
                console.log('From 3D to 2D');
                if (document.getElementById('lineConnection') != null) {
                    container.removeChild(document.getElementById('lineConnection'));
                }
                globalData.showLinkage = false;

                globalData.startFrom2D = true;
                globalData.cellData.forEach(element => {
                    let origin = document.getElementById(element[globalData.idStr]);
                    let originalPos = origin.getAttribute('position');
                    let originalPosStr = originalPos.x + ' ' + originalPos.y + ' ' + originalPos.z;
                    loader.getObjectFromID(globalData.cellData, element[globalData.idStr], globalData.idStr).then(
                        target => {
                            let targetStr = target.x*globalData.scaleUp+ ' ' + target.y*globalData.scaleUp + ' ' + target.z*globalData.scaleUp;
                            origin.setAttribute('animation', 'property: position; from: ' + originalPosStr + '; to: '+ targetStr +'; dur: 1500; easing: easeInOutSine');
                        }
                    )
                });


                globalData.curStatus = 0;


            }

        }




        // TODO from current point to the
        // function transform_slider(dataObj, status, slider_pos) {
        //     let percentage = slider_pos / 100;
        //     globalData.cellData.forEach(element => {
        //         let origin = document.getElementById(element[globalData.idStr]);
        //         let originalPos = origin.getAttribute('position');
        //         let originalPosStr = originalPos.x + ' ' + originalPos.y + ' ' + originalPos.z;
        //         loader.getObjectFromID(dataObj, element[globalData.idStr], globalData.idStr).then(
        //             target => {
        //                 let targetStr = target.x*globalData.scaleUp*percentage + originalPos.x*(1-percentage)
        //                     + ' '
        //                     + target.y*globalData.scaleUp*percentage + originalPos.y*(1-percentage)
        //                     + ' '
        //                     + target.z*globalData.scaleUp*percentage + originalPos.z*(1-percentage);
        //                 origin.setAttribute('animation', 'property: position; from: ' + originalPosStr + '; to: '+ targetStr +'; dur: 500; easing: linear');
        //             },
        //             reject => {
        //                 let targetStr = originalPos.x + ' ' + (Number(originalPos.y) - 200) + ' ' + (Number(originalPos.z) - 30);
        //                 origin.setAttribute('animation', 'property: position; from: ' + originalPosStr + '; to: '+ targetStr +'; dur: 1000; easing: easeInOutSine');
        //             }
        //         )
        //     });
        //     if (globalData.inputSlice) {
        //         for (let i = 1; i < globalData.numOfSlices+1; i++) {
        //             const idTemp = 'slice' + i
        //             let targetImg = document.getElementById(idTemp);
        //             let originalImgPos = targetImg.getAttribute('position');
        //             let originalImgPosStr = '';
        //             if (globalData.imagePositionCache[idTemp] !== undefined) {
        //                 originalImgPosStr = globalData.imagePositionCache[idTemp];
        //             } else {
        //                 originalImgPosStr = originalImgPos.x + ' ' + originalImgPos.y + ' ' + originalImgPos.z;
        //                 globalData.imagePositionCache[idTemp] = originalImgPosStr;
        //             }
        //             let originalImgPosStrArray = originalImgPosStr.split(' ');
        //             let posImgStr = originalImgPosStrArray[0] + ' ' + (Number(originalImgPosStrArray[1]) - 200*percentage) + ' ' + (Number(originalImgPosStrArray[2]) - 30*percentage);
        //             targetImg.setAttribute('animation', 'property: position; from: ' + originalImgPosStr + '; to: ' + posImgStr + '; dur: 500; easing: linear')
        //         }
        //     }
        // }















        if (globalData.inputFile1Trans) {
            let transFolder = this.gui.addFolder('Transformation', '#FFFFFF');

            if (globalData.inputFile1Trans === true || globalData.numOfSlices > 0) {
                const changeVisMode = transFolder.add( globalData.curVisMode, 'Mode' ).options( globalData.visModeList );
                changeVisMode.onChange( function () {
                    console.log('current visualisation mode: ', globalData.curVisMode);
                    document.getElementById('theSpinner').style.height = '100%';
                    document.getElementById('theSpinner').style.visibility = 'visible';
                    setTimeout(function (){
                        if (globalData.curVisMode.Mode === 'High-Quality') {
                            loader.renderPoints(globalData.cellData, true, 1)
                        } else {
                            loader.renderPoints(globalData.cellData, true, 0)
                        }
                    }, 1);

                } );
            }


            transFolder.add(liftUp, 'liftUp1').name("Transform_1");

            if (globalData.inputFile1Trans2 && target !== 's3') {
                transFolder.add(liftUp,'liftUp2').name("Transform_2");
            }

            transFolder.add(globalData, 'showLinkage' ).name( "Connection" ).listen( ).onChange( function ( ) {

                if (globalData.curStatus === 0) {
                    alert("You can only check the trajectory after the transformation.");
                    globalData.showLinkage = false;
                } else {
                    let endData
                    if (globalData.curStatus === 1) {
                        endData = globalData.cellData3D;
                    } else if (globalData.curStatus === 2) {
                        endData = globalData.cellData3D2;
                    }
                    if (document.getElementById('lineConnection') === null) {
                        let lineConnectionContainer = document.createElement( 'a-entity' );
                        lineConnectionContainer.setAttribute('id', 'lineConnection');
                        for (let i = 0; i < endData.length; i++) {
                            if (endData[i][globalData.curMarkerGene.Attribute] !== "None" && Math.random() < 0.05) {
                                let path = document.createElement('a-entity');

                                // todo get same id start point
                                const startPoint = globalData.cellData[i].x*globalData.scaleUp + ' ' + globalData.cellData[i].y*globalData.scaleUp + ' ' + globalData.cellData[i].z*globalData.scaleUp;

                                endPoint = endData[i].x*globalData.scaleUp + ' ' + endData[i].y*globalData.scaleUp + ' ' + endData[i].z*globalData.scaleUp;
                                path.setAttribute('meshline', "lineWidth: 0.4; path: "+startPoint+", "+endPoint+"; color: #212F3C");
                                lineConnectionContainer.appendChild(path);
                            }
                        }

                        container.appendChild(lineConnectionContainer);

                    } else {
                        container.removeChild(document.getElementById('lineConnection'));
                        // document.getElementById('lineConnection').setAttribute('visible', ''+globalData.showLinkage);
                    }
                }









            });


            transFolder.open();
        }

        this.gui.add(reset, 'reset').name("Reset Camera");
        this.gui.add(help, 'help').name("Help");
        this.gui.add(exit, 'exit').name('Exit');


    },

}
