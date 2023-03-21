export { calculator }

class FpsCalculator {
    constructor() {
        this._isRunning = false;
        this._beginTime = Date.now();
        this._prevTime = this._beginTime;
        this._frames = 0;
    }
    start() {
        // 重複起動防止
        if (this._isRunning) {
            return null;
        }
        // 初期化
        this._beginTime = Date.now();
        this._prevTime = this._beginTime;
        this._frames = 0;
        // フラグが立っている時にループ
        this._isRunning = true;
        const loop = () => {
            if (!this._isRunning) {
                return null;
            }
            this._update();
            requestAnimationFrame(loop);
        }
        loop();
    }
    stop() {
        // 停止してリセット
        this._isRunning = false;
        this._frames = 0;
    }
    _update() {
        this._frames++;
        let prevTime = this._prevTime;
        let time = Date.now();
        // 一秒経過時点でフレーム数の計算
        if (time > prevTime + 1000) {
            // console.log((this._frames * 1000) / (time - prevTime));
            let currentFPS = Math.floor((this._frames * 1000) / (time - prevTime));
            document.getElementById("fps").children[0].innerHTML = currentFPS;
            this._prevTime = time;
            this._frames = 0;
        }

        this._beginTime = time;
    }
}
const calculator = new FpsCalculator();