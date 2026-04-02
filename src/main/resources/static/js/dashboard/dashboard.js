document.addEventListener("DOMContentLoaded", function () {
    var tabs = document.querySelectorAll("[data-dashboard-tab]");
    var panels = document.querySelectorAll("[data-dashboard-panel]");
    var tabIndicator = document.querySelector(".Dashboard-TabIndicator");
    var tabContainer = document.querySelector(".Dashboard-Tabs");
    var metricTabs = document.querySelectorAll("[data-metric-tab]");
    var metricTitle = document.querySelector("[data-metric-title]");
    var metricSummary = document.querySelector("[data-metric-summary]");
    var metricChartCanvas = document.getElementById("dashboardMetricChart");
    var dateToggle = document.querySelector("[data-date-toggle]");
    var dateMenu = document.querySelector("[data-date-menu]");
    var dateLabel = document.querySelector("[data-date-label]");
    var dateRange = document.querySelector("[data-date-range]");
    var dateOptions = document.querySelectorAll("[data-date-option]");
    var metricChart;
    var activeMetric = "views";
    var activeRange = "28d";

    var metricMap = {
        views: {
            title: "조회수 추이",
            summary: "지난 4주 동안 조회수가 안정적으로 증가했습니다.",
            color: "#3182f6",
            fill: "rgba(49, 130, 246, 0.12)",
            ranges: {
                "28d": { labels: ["3.4", "3.9", "3.13", "3.18", "3.22", "3.27", "3.31"], values: [18, 26, 24, 35, 44, 52, 63], summary: "지난 4주 동안 조회수가 안정적으로 증가했습니다." },
                "month": { labels: ["1주", "2주", "3주", "4주"], values: [24, 31, 45, 63], summary: "이번 달 조회수는 주차가 갈수록 높아졌습니다." },
                "3m": { labels: ["1월", "2월", "3월"], values: [420, 590, 830], summary: "최근 3개월 동안 조회수는 꾸준한 상승 흐름입니다." },
                "6m": { labels: ["10월", "11월", "12월", "1월", "2월", "3월"], values: [180, 220, 310, 420, 590, 830], summary: "최근 6개월 기준 조회수 성장세가 뚜렷합니다." },
                "12m": { labels: ["4월", "6월", "8월", "10월", "12월", "2월", "3월"], values: [90, 130, 170, 260, 390, 610, 830], summary: "최근 12개월 동안 조회수는 장기적으로 상승했습니다." }
            }
        },
        auction: {
            title: "경매 추이",
            color: "#13b886",
            fill: "rgba(19, 184, 134, 0.14)",
            ranges: {
                "28d": { labels: ["3.4", "3.9", "3.13", "3.18", "3.22", "3.27", "3.31"], values: [4, 6, 5, 9, 13, 15, 19], summary: "중반 이후 경매 등록이 빠르게 늘어났습니다." },
                "month": { labels: ["1주", "2주", "3주", "4주"], values: [5, 7, 12, 19], summary: "이번 달 후반부에 경매 등록이 몰렸습니다." },
                "3m": { labels: ["1월", "2월", "3월"], values: [18, 27, 42], summary: "최근 3개월 경매 생성 건수는 상승 중입니다." },
                "6m": { labels: ["10월", "11월", "12월", "1월", "2월", "3월"], values: [8, 11, 14, 18, 27, 42], summary: "최근 6개월 동안 경매 활동이 점진적으로 커졌습니다." },
                "12m": { labels: ["4월", "6월", "8월", "10월", "12월", "2월", "3월"], values: [4, 6, 8, 11, 15, 27, 42], summary: "최근 12개월 기준 경매 활동은 장기 상승 흐름입니다." }
            }
        },
        pending: {
            title: "결제 예정 추이",
            color: "#f59e0b",
            fill: "rgba(245, 158, 11, 0.16)",
            ranges: {
                "28d": { labels: ["3.4", "3.9", "3.13", "3.18", "3.22", "3.27", "3.31"], values: [3, 4, 7, 6, 9, 11, 14], summary: "결제 예정 건수는 최근 일주일 사이 완만하게 증가했습니다." },
                "month": { labels: ["1주", "2주", "3주", "4주"], values: [4, 6, 9, 14], summary: "이번 달 결제 예정 건수는 후반부로 갈수록 늘었습니다." },
                "3m": { labels: ["1월", "2월", "3월"], values: [9, 12, 18], summary: "최근 3개월 동안 결제 예정 건수는 안정적으로 증가했습니다." },
                "6m": { labels: ["10월", "11월", "12월", "1월", "2월", "3월"], values: [4, 5, 7, 9, 12, 18], summary: "최근 6개월 기준 결제 예정 건수는 우상향입니다." },
                "12m": { labels: ["4월", "6월", "8월", "10월", "12월", "2월", "3월"], values: [2, 3, 4, 6, 8, 12, 18], summary: "최근 12개월 동안 결제 예정 흐름이 점차 커졌습니다." }
            }
        },
        contest: {
            title: "공모전 추이",
            color: "#8b5cf6",
            fill: "rgba(139, 92, 246, 0.14)",
            ranges: {
                "28d": { labels: ["3.4", "3.9", "3.13", "3.18", "3.22", "3.27", "3.31"], values: [1, 2, 2, 3, 5, 6, 7], summary: "공모전 관련 지표는 후반부에 참여가 집중되었습니다." },
                "month": { labels: ["1주", "2주", "3주", "4주"], values: [2, 2, 5, 7], summary: "이번 달 공모전 참여는 마지막 주에 집중되었습니다." },
                "3m": { labels: ["1월", "2월", "3월"], values: [3, 4, 7], summary: "최근 3개월 공모전 활동은 완만한 증가세입니다." },
                "6m": { labels: ["10월", "11월", "12월", "1월", "2월", "3월"], values: [1, 2, 2, 3, 4, 7], summary: "최근 6개월 기준 공모전 참여가 점차 늘었습니다." },
                "12m": { labels: ["4월", "6월", "8월", "10월", "12월", "2월", "3월"], values: [1, 1, 2, 2, 3, 4, 7], summary: "최근 12개월 동안 공모전 흐름은 완만하게 상승했습니다." }
            }
        }
    };

    var rangeMap = {
        "28d": { label: "지난 28일", range: "2026. 3. 4. ~ 2026. 3. 31." },
        "month": { label: "이번 달", range: "2026. 3. 1. ~ 2026. 3. 31." },
        "3m": { label: "최근 3개월", range: "2026. 1. 1. ~ 2026. 3. 31." },
        "6m": { label: "최근 6개월", range: "2025. 10. 1. ~ 2026. 3. 31." },
        "12m": { label: "최근 12개월", range: "2025. 4. 1. ~ 2026. 3. 31." }
    };

    function renderMetricChart(key, rangeKey) {
        var metric = metricMap[key];
        var range = metric && metric.ranges[rangeKey];
        if (!metric || !metricChartCanvas || typeof Chart === "undefined") {
            return;
        }

        if (metricTitle) {
            metricTitle.textContent = metric.title;
        }
        if (metricSummary) {
            metricSummary.textContent = range.summary;
        }

        if (metricChart) {
            metricChart.destroy();
        }

        metricChart = new Chart(metricChartCanvas, {
            type: "line",
            data: {
                labels: range.labels,
                datasets: [{
                    data: range.values,
                    borderColor: metric.color,
                    backgroundColor: metric.fill,
                    fill: true,
                    tension: 0,
                    borderWidth: 2.5,
                    pointRadius: 4,
                    pointHoverRadius: 6,
                    pointBackgroundColor: metric.color,
                    pointBorderColor: "#ffffff",
                    pointBorderWidth: 2,
                    pointHitRadius: 12
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: {
                    intersect: false,
                    mode: "index"
                },
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        displayColors: false,
                        backgroundColor: "#1f2937",
                        titleColor: "#ffffff",
                        bodyColor: "#ffffff",
                        padding: 12,
                        cornerRadius: 12
                    }
                },
                scales: {
                    x: {
                        grid: {
                            display: false,
                            drawBorder: false
                        },
                        border: {
                            display: false
                        },
                        ticks: {
                            color: "#8b95a1",
                            font: {
                                size: 11
                            }
                        }
                    },
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: "#eef2f6",
                            drawBorder: false
                        },
                        border: {
                            display: false
                        },
                        ticks: {
                            color: "#8b95a1",
                            font: {
                                size: 11
                            }
                        }
                    }
                }
            }
        });
    }

    function syncTabIndicator(activeTab) {
        if (!tabIndicator || !tabContainer || !activeTab) {
            return;
        }

        var containerRect = tabContainer.getBoundingClientRect();
        var tabRect = activeTab.getBoundingClientRect();
        var offset = tabRect.left - containerRect.left;

        tabIndicator.style.width = tabRect.width + "px";
        tabIndicator.style.transform = "translateX(" + offset + "px)";
    }

    tabs.forEach(function (tab) {
        tab.addEventListener("click", function () {
            var target = tab.getAttribute("data-dashboard-tab");

            tabs.forEach(function (item) {
                item.classList.remove("is-active");
                item.setAttribute("aria-selected", "false");
            });

            panels.forEach(function (panel) {
                var active = panel.getAttribute("data-dashboard-panel") === target;
                panel.classList.toggle("is-active", active);
                panel.hidden = !active;
            });

            tab.classList.add("is-active");
            tab.setAttribute("aria-selected", "true");
            syncTabIndicator(tab);
        });
    });

    var initialActiveTab = document.querySelector(".Dashboard-Tab.is-active");
    syncTabIndicator(initialActiveTab);

    window.addEventListener("resize", function () {
        syncTabIndicator(document.querySelector(".Dashboard-Tab.is-active"));
    });

    metricTabs.forEach(function (tab) {
        var rippleInstance = null;

        function startRipple(event) {
            var rect = tab.getBoundingClientRect();
            var ripple = document.createElement("span");
            var clientX = event.clientX;
            var clientY = event.clientY;
            var localX;
            var localY;
            var maxX;
            var maxY;
            var radius;

            if (typeof clientX !== "number" || typeof clientY !== "number") {
                clientX = rect.left + rect.width / 2;
                clientY = rect.top + rect.height / 2;
            }

            localX = clientX - rect.left;
            localY = clientY - rect.top;
            maxX = Math.max(localX, rect.width - localX);
            maxY = Math.max(localY, rect.height - localY);
            radius = Math.sqrt(maxX * maxX + maxY * maxY);

            ripple.className = "Dashboard-MetricRipple";
            ripple.style.left = localX + "px";
            ripple.style.top = localY + "px";
            ripple.style.setProperty("--ripple-scale", String(radius / 12 + 2));
            tab.appendChild(ripple);
            tab.classList.add("is-pressing");
            rippleInstance = ripple;

            requestAnimationFrame(function () {
                ripple.classList.add("is-pressing");
            });
        }

        function releaseRipple() {
            if (!rippleInstance) {
                tab.classList.remove("is-pressing");
                return;
            }

            rippleInstance.classList.remove("is-pressing");
            rippleInstance.classList.add("is-releasing");
            tab.classList.remove("is-pressing");

            var rippleToRemove = rippleInstance;
            rippleInstance = null;

            window.setTimeout(function () {
                rippleToRemove.remove();
            }, 260);
        }

        tab.addEventListener("pointerdown", function (event) {
            startRipple(event);
        });

        tab.addEventListener("pointerup", releaseRipple);
        tab.addEventListener("pointerleave", releaseRipple);
        tab.addEventListener("pointercancel", releaseRipple);
        tab.addEventListener("blur", releaseRipple);

        tab.addEventListener("click", function () {
            var target = tab.getAttribute("data-metric-tab");

            metricTabs.forEach(function (item) {
                item.classList.remove("is-active");
            });

            tab.classList.add("is-active");
            activeMetric = target;
            renderMetricChart(activeMetric, activeRange);
        });
    });

    if (dateToggle && dateMenu) {
        dateToggle.addEventListener("click", function (event) {
            event.stopPropagation();
            var willOpen = dateMenu.hidden;
            dateMenu.hidden = !willOpen;
            dateToggle.setAttribute("aria-expanded", String(willOpen));
        });

        document.addEventListener("click", function (event) {
            if (!dateMenu.hidden && !event.target.closest(".Dashboard-DatePicker")) {
                dateMenu.hidden = true;
                dateToggle.setAttribute("aria-expanded", "false");
            }
        });
    }

    dateOptions.forEach(function (option) {
        option.addEventListener("click", function () {
            var rangeKey = option.getAttribute("data-date-option");
            var rangeData = rangeMap[rangeKey];
            if (!rangeData) {
                return;
            }

            dateOptions.forEach(function (item) {
                item.classList.remove("is-active");
            });
            option.classList.add("is-active");

            activeRange = rangeKey;
            if (dateLabel) {
                dateLabel.textContent = rangeData.label;
            }
            if (dateRange) {
                dateRange.textContent = rangeData.range;
            }

            if (dateMenu && dateToggle) {
                dateMenu.hidden = true;
                dateToggle.setAttribute("aria-expanded", "false");
            }

            renderMetricChart(activeMetric, activeRange);
        });
    });

    renderMetricChart(activeMetric, activeRange);
});
