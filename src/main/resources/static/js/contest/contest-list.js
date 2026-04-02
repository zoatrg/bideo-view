const ContestListModule = (function () {

    const ITEMS_DATA = [
        {
            title: "2026 신인 영상 크리에이터 공모전",
            host: "BIDEO 공식",
            banner: "https://i.ytimg.com/vi/nLD84OB7rO0/hqdefault.jpg",
            avatar: "https://i.ytimg.com/vi/nLD84OB7rO0/hqdefault.jpg",
            status: "모집중",
            period: "2026.03.01 ~ 2026.04.30",
            entries: "128개",
            views: "2,340",
            prize: "총 500만원",
            announce: "2026.05.15",
            desc: "영상 제작에 관심 있는 누구나 참가할 수 있는 공모전입니다. 자유 주제로 3분 이내의 영상을 제출해 주세요. 우수작에는 상금과 BIDEO 공식 채널 노출 기회가 주어집니다.",
            tags: ["#영상공모전", "#크리에이터", "#신인", "#BIDEO"]
        },
        {
            title: "감성 뮤직비디오 챌린지",
            host: "Yebit 예빗",
            banner: "https://i.ytimg.com/vi/nLD84OB7rO0/hqdefault.jpg",
            avatar: "https://i.ytimg.com/vi/nLD84OB7rO0/hqdefault.jpg",
            status: "모집중",
            period: "2026.02.15 ~ 2026.05.15",
            entries: "56개",
            views: "1,919",
            prize: "총 300만원",
            announce: "2026.06.01",
            desc: "좋아하는 음악에 직접 뮤직비디오를 만들어 보세요. 감성적인 영상미와 스토리텔링을 평가합니다. 1인 제작부터 팀 참가까지 모두 가능합니다.",
            tags: ["#뮤직비디오", "#감성", "#챌린지"]
        },
        {
            title: "다큐멘터리 단편 영화제",
            host: "인간개조 용광로",
            banner: "https://i.ytimg.com/vi/nLD84OB7rO0/hqdefault.jpg",
            avatar: "https://i.ytimg.com/vi/nLD84OB7rO0/hqdefault.jpg",
            status: "마감임박",
            period: "2026.01.10 ~ 2026.04.10",
            entries: "312개",
            views: "5,830",
            prize: "총 1,000만원",
            announce: "2026.05.01",
            desc: "일상 속 숨겨진 이야기를 다큐멘터리로 담아보세요. 10분 이내의 단편 다큐멘터리를 모집합니다. 사회, 문화, 환경 등 자유 주제.",
            tags: ["#다큐멘터리", "#단편영화", "#영화제"]
        },
        {
            title: "경제 교육 영상 콘테스트",
            host: "EBS",
            banner: "https://i.ytimg.com/vi/nLD84OB7rO0/hqdefault.jpg",
            avatar: "https://i.ytimg.com/vi/nLD84OB7rO0/hqdefault.jpg",
            status: "모집중",
            period: "2026.03.15 ~ 2026.06.15",
            entries: "45개",
            views: "890",
            prize: "총 200만원",
            announce: "2026.07.10",
            desc: "경제 개념을 쉽고 재미있게 설명하는 교육 영상을 만들어 주세요. 대학생 및 일반인 누구나 참가 가능하며, 우수작은 EBS 채널에 소개됩니다.",
            tags: ["#경제교육", "#EBS", "#콘테스트"]
        },
        {
            title: "토크쇼 형식 인터뷰 영상 공모",
            host: "짠한형 신동엽",
            banner: "https://i.ytimg.com/vi/nLD84OB7rO0/hqdefault.jpg",
            avatar: "https://i.ytimg.com/vi/nLD84OB7rO0/hqdefault.jpg",
            status: "접수마감",
            period: "2026.01.01 ~ 2026.03.01",
            entries: "203개",
            views: "7,120",
            prize: "총 800만원",
            announce: "2026.04.01",
            desc: "주변의 흥미로운 인물을 인터뷰하여 토크쇼 형식의 영상을 만들어 보세요. 편집 스타일과 질문 구성력을 종합 평가합니다.",
            tags: ["#토크쇼", "#인터뷰", "#영상공모"]
        }
    ];

    let selectedIndex = -1;

    function init() {
        var items = document.querySelectorAll(".Contest-List-Item");
        items.forEach(function (item) {
            item.addEventListener("click", function () {
                var index = parseInt(item.getAttribute("data-index"));
                selectItem(index, items);
            });
        });
    }

    function selectItem(index, items) {
        var panel = document.getElementById("contestDetailPanel");
        var data = ITEMS_DATA[index];
        if (!data) return;

        // 이전 선택 해제
        items.forEach(function (item) {
            item.classList.remove("Contest-List-Item--active");
        });

        // 같은 항목 클릭 시 닫기 애니메이션
        if (selectedIndex === index) {
            selectedIndex = -1;
            panel.classList.remove("Contest-Detail-Panel--visible");
            panel.classList.add("Contest-Detail-Panel--closing");
            panel.addEventListener("animationend", function handler() {
                panel.classList.remove("Contest-Detail-Panel--closing");
                panel.removeEventListener("animationend", handler);
            });
            return;
        }

        // 새 항목 선택
        selectedIndex = index;
        items[index].classList.add("Contest-List-Item--active");

        // 상세 패널 업데이트
        document.getElementById("detailBanner").src = data.banner;
        document.getElementById("detailAvatar").src = data.avatar;
        document.getElementById("detailTitle").textContent = data.title;
        document.getElementById("detailHost").textContent = data.host;
        document.getElementById("detailStatus").textContent = data.status;
        document.getElementById("detailPeriod").textContent = data.period;
        document.getElementById("detailEntries").textContent = data.entries;
        document.getElementById("detailViews").textContent = data.views;
        document.getElementById("detailDesc").textContent = data.desc;
        document.getElementById("detailPrize").textContent = data.prize;
        document.getElementById("detailAnnounce").textContent = data.announce;

        // 태그 렌더링
        var tagsContainer = document.getElementById("detailTags");
        tagsContainer.innerHTML = "";
        data.tags.forEach(function (tag) {
            var span = document.createElement("span");
            span.className = "Contest-Detail-Tag";
            span.textContent = tag;
            tagsContainer.appendChild(span);
        });

        // 상태 뱃지 색상
        var statusEl = document.getElementById("detailStatus");
        statusEl.className = "Contest-Detail-InfoValue Contest-Detail-Status";
        if (data.status === "모집중") {
            statusEl.classList.add("Contest-Detail-Status--open");
        } else if (data.status === "마감임박") {
            statusEl.classList.add("Contest-Detail-Status--closing");
        } else {
            statusEl.classList.add("Contest-Detail-Status--closed");
        }

        // 열기 애니메이션
        panel.classList.remove("Contest-Detail-Panel--visible", "Contest-Detail-Panel--closing");
        void panel.offsetWidth;
        panel.classList.add("Contest-Detail-Panel--visible");
    }

    return { init: init };

})();

document.addEventListener("DOMContentLoaded", ContestListModule.init);
