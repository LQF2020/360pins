/*! Authur: Qifu LU
    Created Date: 7/12/2020
    Contact: qifu1995@gmail.com
    This JS script is used to create 360 pins image a second.
*/
function FullViewer({
    $img_wrapper,
    $first_display_img,
    srcFolder,
    totalImgNum,
}) {
    const that = this;
    this.targetImgIndex = 0;
    this.currImgIndex = 0;
    this.$image_wrapper = $img_wrapper;
    this.$first_display_img = $first_display_img;
    this.totalImgNum = totalImgNum;
    const FullViewerUtils = {
        getCurrXPos: function (ev) {
            var oEvent = ev || event;
            return oEvent.clientX;
        },
        getScreenWidth: function () {
            const e = document.documentElement;
            const g = document.getElementsByTagName("body")[0];
            const screenWidth =
                window.innerWidth || e.clientWidth || g.clientWidth;
            return screenWidth;
        },
    };
    this.calculateMouseMove = function (startPoint) {
        let currX = FullViewerUtils.getCurrXPos();
        let hasMovedX = currX - startPoint;
        if (hasMovedX === 0) return;
        let moveFrameRatio = Math.ceil(
            (this.totalImgNum * hasMovedX) / FullViewerUtils.getScreenWidth()
        );
        let rotateDistance = this.currImgIndex - moveFrameRatio;
        this.targetImgIndex =
            rotateDistance > 0
                ? rotateDistance % this.totalImgNum
                : (rotateDistance + this.totalImgNum) % this.totalImgNum;
    };
    this.doAnimate = function (startPoint) {
        this.calculateMouseMove(startPoint);
        [].slice
            .call(that.$image_wrapper.getElementsByTagName("img"), 0)
            .forEach(($img, index) => {
                if (index === this.targetImgIndex) {
                    $img.style.opacity = "1";
                } else {
                    $img.style.opacity = "0";
                }
            });
    };
    this.init = function () {
        for (let i = 1; i < this.totalImgNum + 1; i++) {
            let imgDOM = document.createElement("img");
            imgDOM.src = `${srcFolder}/${i}.png`;
            this.$image_wrapper.appendChild(imgDOM);
        }
    };
    this.$image_wrapper.onmousedown = function () {
        let startPoint = FullViewerUtils.getCurrXPos();
        document.onmousemove = function (ev) {
            that.$first_display_img.style.opacity = "0";
            that.doAnimate(startPoint);
        };
        document.onmouseup = function () {
            that.currImgIndex = that.targetImgIndex;
            document.onmousemove = null;
            document.onmouseup = null;
        };
    };
    this.$image_wrapper.ontouchstart = function () {
        let startPoint = FullViewerUtils.getCurrXPos();
        document.ontouchmove = function (ev) {
            that.$first_display_img.style.opacity = "0";
            that.doAnimate(startPoint);
        };
        document.ontouchend = function () {
            that.currImgIndex = that.targetImgIndex;
            document.ontouchmove = null;
            document.ontouchend = null;
        };
    };
}
