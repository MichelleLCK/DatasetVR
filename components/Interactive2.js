AFRAME.registerComponent('clickpoints', {
    init: function () {
        let data = this.data;
        let el = this.el;
        this.el.addEventListener('raycaster-intersected', function (evt) {

            var targetElement = evt.target || evt.srcElement;
            const dataSelectionMode = (document.getElementById("selectionModeDropdown")).value
            var intersectionDetails = evt.detail.el.components.raycaster.getIntersection(el);
            if (dataSelectionMode == "Single"){
                if (intersectionDetails.distance <= globalData.camDepth){
                    while (globalData.curImg.length > 0){
                        var curId = globalData.curImg[0];
                        console.log(document.getElementById(curId));
                        document.getElementById(curId).setAttribute('material', 'opacity', '1');
                        globalData.curImg.splice(0, 1);
                    }
                    var curId = targetElement.id
                    globalData.curImg.push(targetElement.id);
                    targetElement.setAttribute('material', 'opacity', '0.5');
                    for (let k = 0; k < globalData.selectedImageType.length; k++){
                        var selectImgType = globalData.selectedImageType[k]
                        console.log(globalData.selectedImageType)
                        console.log(selectImgType)
                        var curImgContent = globalData.cellImg[selectImgType][curId];
                        var curImgBox = "cellImage" + selectImgType;
                        document.getElementById(curImgBox).src = curImgContent;
                        document.getElementById('cellId').innerText = "Cell ID: " + targetElement.id;
                    }
                }
            } else {
                if (intersectionDetails.distance <= globalData.camDepth){
                    if (globalData.removeSelectionBtn == false) {
                        if (globalData.confirmSelectionBtn == false) {
                            if (globalData.startSelectionBtn == true) {
                                if (globalData.curImgMultiple.indexOf(targetElement.id) == -1){
                                    globalData.curImgMultiple.push(targetElement.id);
                                    targetElement.setAttribute('material', 'opacity', '0.5');
                                }
                            } else{
                                while (globalData.curImg.length > 0){
                                    var curId = globalData.curImg[0];
                                    console.log(document.getElementById(curId));
                                    document.getElementById(curId).setAttribute('material', 'opacity', '1');
                                    globalData.curImg.splice(0, 1);
                                }
                            }
                            var curId = targetElement.id
                            globalData.curImg.push(targetElement.id);
                            targetElement.setAttribute('material', 'opacity', '0.5');
                            for (let k = 0; k < globalData.selectedImageType.length; k++){
                                var selectImgType = globalData.selectedImageType[k]
                                console.log(globalData.selectedImageType)
                                console.log(selectImgType)
                                var curImgContent = globalData.cellImg[selectImgType][curId];
                                var curImgBox = "cellImage" + selectImgType;
                                document.getElementById(curImgBox).src = curImgContent;
                                document.getElementById('cellId').innerText = "Cell ID: " + targetElement.id;
                            }
                            
                        }
                    }
                }
            }

        });
        this.el.addEventListener('raycaster-intersected-cleared', function (evt) {
            
            var targetElement = evt.target || evt.srcElement;
            const dataSelectionMode = (document.getElementById("selectionModeDropdown")).value
            if (dataSelectionMode == "Single"){
                
                targetElement.setAttribute('material', 'opacity', '1');
                let index = globalData.curImg.indexOf(targetElement.id);
                if (index != -1){
                    globalData.curImg.splice(index, 1); // 2nd parameter means remove one item only
                }

                if (globalData.curImg.length == 0) {
                    for (let k = 0; k < globalData.selectedImageType.length; k++){
                        var selectImgType = globalData.selectedImageType[k]
                        var curImgBox = "cellImage" + selectImgType;
                        document.getElementById(curImgBox).src = "image/qpiPlaceholder.png";
                        document.getElementById('cellId').innerText = "";
                    }
                    
                }
            } else {
                if (globalData.removeSelectionBtn == false) {
                    if (globalData.confirmSelectionBtn == false) {
                        if (globalData.startSelectionBtn == false) {
                            targetElement.setAttribute('material', 'opacity', '1');
                            let index = globalData.curImg.indexOf(targetElement.id);
                            if (index != -1){
                                globalData.curImg.splice(index, 1); // 2nd parameter means remove one item only
                            }
            
                            if (globalData.curImg.length == 0) {
                                for (let k = 0; k < globalData.selectedImageType.length; k++){
                                    var selectImgType = globalData.selectedImageType[k]
                                    var curImgBox = "cellImage" + selectImgType;
                                    document.getElementById(curImgBox).src = "image/qpiPlaceholder.png";
                                    document.getElementById('cellId').innerText = "";
                                }
                                
                            }
                        } else {
                            for (let k = 0; k < globalData.selectedImageType.length; k++){
                                var selectImgType = globalData.selectedImageType[k]
                                var curImgBox = "cellImage" + selectImgType;
                                document.getElementById(curImgBox).src = "image/qpiPlaceholder.png";
                                document.getElementById('cellId').innerText = "";
                            }
                        }
                    }
                }
                    
            }
        });

        this.el.addEventListener('raycaster-intersected', function (evt) {
            var intersectionDetails = evt.detail.el.components.raycaster.getIntersection(el);
            if (globalData.removeSelectionBtn == true){
                if (intersectionDetails.distance <= globalData.camDepth){
                    var targetElement = evt.target || evt.srcElement;
                    var curId = targetElement.id
                    globalData.curImg.push(targetElement.id);
                    for (let k = 0; k < globalData.selectedImageType.length; k++){
                        var selectImgType = globalData.selectedImageType[k]
                        console.log(globalData.selectedImageType)
                        console.log(selectImgType)
                        var curImgContent = globalData.cellImg[selectImgType][curId];
                        var curImgBox = "cellImage" + selectImgType;
                        document.getElementById(curImgBox).src = curImgContent;
                        document.getElementById('cellId').innerText = "Cell ID: " + targetElement.id;
                    }
                }
            }
        });
        
        this.el.addEventListener('raycaster-intersected-cleared', function (evt) {
            
            var targetElement = evt.target || evt.srcElement;
            if (globalData.removeSelectionBtn == true){
                for (let k = 0; k < globalData.selectedImageType.length; k++){
                    var selectImgType = globalData.selectedImageType[k]
                    var curImgBox = "cellImage" + selectImgType;
                    document.getElementById(curImgBox).src = "image/qpiPlaceholder.png";
                    document.getElementById('cellId').innerText = "";
                }
            }
        });
        
        this.el.addEventListener('click', function (evt) {
            
            if (globalData.removeSelectionBtn == true){
                if (evt.detail.intersection.distance <= globalData.camDepth){
                    var targetElement = evt.target || evt.srcElement;
                    let index = globalData.curImgMultiple.indexOf(targetElement.id);
                    if (index != -1){
                        globalData.curImgMultiple.splice(index, 1); // 2nd parameter means remove one item only
                        targetElement.setAttribute('material', 'opacity', '1');
                    }
                }
            }
        });
    }
})