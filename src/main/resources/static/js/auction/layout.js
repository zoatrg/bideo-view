const AuctionLayout = (() => {

    let countdownTimerId = null;

    // 타이머 시작
    const startCountdown = (closingAt) => {
        const cdDay               = document.getElementById('cdDay');
        const cdHour              = document.getElementById('cdHour');
        const cdMin               = document.getElementById('cdMin');
        const cdSec               = document.getElementById('cdSec');
        const auctionDeadlineDate = document.getElementById('auctionDeadlineDate');

        const endTime = new Date(closingAt);
        if (Number.isNaN(endTime.getTime())) return;

        if (countdownTimerId) {
            window.clearInterval(countdownTimerId);
        }

        function update() {
            const diff = endTime.getTime() - Date.now();

            if (diff <= 0) {
                cdDay.textContent  = '00';
                cdHour.textContent = '00';
                cdMin.textContent  = '00';
                cdSec.textContent  = '00';
                auctionDeadlineDate.textContent = '경매가 종료되었습니다.';
                window.clearInterval(countdownTimerId);
                countdownTimerId = null;
                return;
            }

            const d = Math.floor(diff / 86400000);
            const h = Math.floor((diff % 86400000) / 3600000);
            const m = Math.floor((diff % 3600000) / 60000);
            const s = Math.floor((diff % 60000) / 1000);

            cdDay.textContent  = String(d).padStart(2, '0');
            cdHour.textContent = String(h).padStart(2, '0');
            cdMin.textContent  = String(m).padStart(2, '0');
            cdSec.textContent  = String(s).padStart(2, '0');
        }

        update();
        countdownTimerId = window.setInterval(update, 1000);
    }

    // 임의 마감일 설정 +3일
    const init = () => {
        const mockClosingAt = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);
        auctionDeadlineDate.textContent = formatDeadline(mockClosingAt);
        startCountdown(mockClosingAt);
    }

    function formatDeadline(value) {
        if (!value) return '';
        const date = new Date(value);
        if (Number.isNaN(date.getTime())) return '';
        return `마감 ${date.toLocaleString('ko-KR', {
            year: 'numeric', month: '2-digit', day: '2-digit',
            hour: '2-digit', minute: '2-digit', hour12: true
        })}`;
    }

    return {
        startCountdown: startCountdown,
        init: init,
    };
})();