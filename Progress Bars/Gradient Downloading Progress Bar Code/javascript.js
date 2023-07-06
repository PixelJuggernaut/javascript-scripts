const ITEMS = 20;
const ANIMMS = 200;
const SIMMS = 500;
const text = document.getElementById('progress-text');
const bar = document.getElementById('progress-bar');
const statusBar = document.getElementById('status-bar');
const moveBar = debounce(function (amount) {
    const pct = (1 - amount / ITEMS) * 100;
    bar.style.right = `${pct}%`;
    if (amount > 0 && !bar.style.transition) {
        const seconds = ANIMMS / 1000;
        bar.style.transition = `right ${seconds}s ease-in`;
    }
}, ANIMMS);
let loading = false;
let downloaded = 0;
setProgress(downloaded);
start();
const btn = document.getElementById('btn');
btn.onclick = () => {
    if (loading) return;
    downloaded = 0;
    setProgress(downloaded);
    start();
    btn.style.display = 'none';
};
function start() {
    loading = true;
    statusBar.className = '';
    simulateLoad(function () {
        downloaded++;
        setProgress(downloaded);
        if (downloaded >= ITEMS) {
            loading = false;
            setTimeout(() => {
                statusBar.className = 'complete';
                bar.style.transition = '';
                btn.style.display = 'block';
                setProgressText('Done!');
            }, ANIMMS);
        }
    }, () => loading);
}
function downloadLabel(amountDownloaded) {
    return `Downloading ${amountDownloaded} of ${ITEMS} tings`;
}
function setProgressText(txt) {
    text.innerText = txt;
}
function setProgress(amount) {
    moveBar(amount);
    setProgressText(downloadLabel(amount));
}
function simulateLoad(loadPart, stillLoading) {
    next();
    function next() {
        const nextIntervalTime = Math.random() * SIMMS;
        setTimeout(() => {
            loadPart();
            if (stillLoading()) next();
        }, nextIntervalTime);
    }
}
function debounce(func, wait) {
    let timeout;
    return function () {
        const context = this, args = arguments;
        const later = () => {
            timeout = null;
            func.apply(context, args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (!timeout) func.apply(context, args);
    };
}