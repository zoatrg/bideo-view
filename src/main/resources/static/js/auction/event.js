window.onload = () => {

    const instantBidCheck     = document.getElementById('instantBidCheck');
    const bidSubmitBtn        = document.getElementById('bidSubmitBtn');
    const bidConfirmBackdrop  = document.getElementById('bidConfirmBackdrop');
    const bidConfirmOk        = document.getElementById('bidConfirmOk');
    const bidConfirmCancel    = document.getElementById('bidConfirmCancel');
    const auctionToast        = document.getElementById('auctionToast');
    const auctionToastMessage = document.getElementById('auctionToastMessage');
    const bidCustomInput      = document.getElementById('bidCustomInput');
    const bidNextAmountEl     = document.getElementById('bidNextAmount');
    const bidInputWrapper     = bidCustomInput?.closest('.Auction-Bid-InputWrapper');
    const bidInfoBtn     = document.getElementById('bidInfoBtn');
    const bidInfoTooltip = document.getElementById('bidInfoTooltip');

    let toastTimerId = null;

    //  초기화
    AuctionLayout.init();

    // [서버 요청 필요] 경매 상품 정보 조회
    // GET /api/auctions/by-work/:workId
    // 응답값: 마감 일시(closingAt), 시작 금액(startingPrice), 현재 최고가(currentPrice) 등

    // [서버 요청 필요] 입찰 내역 조회
    // GET /api/auctions/:auctionId/bids
    // 응답값: 입찰자 목록 (닉네임, 금액, 시각)
    // 응답 후 layout.js의 renderBidItem() 으로 목록 렌더링

    //  토스트
    function showToast(message, duration = 3000, isError = false) {
        if (!auctionToast || !auctionToastMessage) return;

        if (toastTimerId) {
            window.clearTimeout(toastTimerId);
            auctionToast.classList.remove('Auction-Toast--hide');
        }

        auctionToastMessage.textContent = message;
        auctionToast.classList.remove('off');

        // 에러 여부에 따라 색상 토글
        if (isError) {
            auctionToast.classList.add('is-error');
        } else {
            auctionToast.classList.remove('is-error');
        }

        toastTimerId = window.setTimeout(() => {
            auctionToast.classList.add('Auction-Toast--hide');
            window.setTimeout(() => {
                auctionToast.classList.add('off');
                auctionToast.classList.remove('Auction-Toast--hide');
                auctionToast.classList.remove('is-error');
                toastTimerId = null;
            }, 300);
        }, duration);
    }

    // 정보 아이콘 클릭 시 툴팁 토글
    bidInfoBtn?.addEventListener('click', (e) => {
        e.stopPropagation();
        bidInfoTooltip?.classList.toggle('on');
    });

    // 툴팁 외부 클릭 시 닫기
    document.addEventListener('click', () => {
        bidInfoTooltip?.classList.remove('on');
    });


    //  최소 입찰가 가져오기
    function getMinAmount() {
        return parseInt(bidNextAmountEl?.dataset.amount || '0');
    }

    //  input 유효성 상태 업데이트
    function setInputError(isError) {
        if (isError) {
            bidInputWrapper?.classList.add('is-error');
        } else {
            bidInputWrapper?.classList.remove('is-error');
        }
    }

    //  input keyup — 숫자 검증 + 테두리 + 버튼 금액 변경
    bidCustomInput?.addEventListener('input', () => {
        // 숫자 외 문자 제거
        bidCustomInput.value = bidCustomInput.value.replace(/[^0-9]/g, '');

        const minAmount  = getMinAmount();
        const inputValue = bidCustomInput.value.trim();

        if (!inputValue) {
            // 비어있으면 기본 최소 입찰가로 복구, 에러 해제
            bidNextAmountEl.textContent = `${minAmount.toLocaleString('ko-KR')}원으로 입찰하기`;
            setInputError(false);
            return;
        }

        const inputAmount = parseInt(inputValue);

        if (isNaN(inputAmount) || inputAmount < minAmount) {
            // 숫자가 아니거나 최소 입찰가 미만 → 버튼 금액 변동 없음, 테두리 red
            setInputError(true);
        } else {
            // 유효한 금액 → 버튼 금액 변경, 에러 해제
            bidNextAmountEl.textContent = `${inputAmount.toLocaleString('ko-KR')}원으로 입찰하기`;
            setInputError(false);
        }
    });

    //  입찰 버튼 클릭
    bidSubmitBtn?.addEventListener('click', () => {
        if (instantBidCheck?.checked) {
            executeBid();
            return;
        }
        bidConfirmBackdrop?.classList.remove('off');
    });

    //  모달 - 확인 버튼
    bidConfirmOk?.addEventListener('click', () => {
        bidConfirmBackdrop?.classList.add('off');
        executeBid();
    });

    //  모달 - 취소 버튼
    bidConfirmCancel?.addEventListener('click', () => {
        bidConfirmBackdrop?.classList.add('off');
    });

    //  모달 - 백드롭 클릭 시 닫기
    bidConfirmBackdrop?.addEventListener('click', (e) => {
        if (e.target === bidConfirmBackdrop) {
            bidConfirmBackdrop.classList.add('off');
        }
    });

    //  ESC 키로 모달 닫기
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !bidConfirmBackdrop?.classList.contains('off')) {
            bidConfirmBackdrop?.classList.add('off');
        }
    });

    //  입찰 실행
    function executeBid() {
        const minAmount  = getMinAmount();
        const inputValue = bidCustomInput?.value.trim();
        const bidAmount  = inputValue ? parseInt(inputValue) : minAmount;

        // 최소 금액 미만이면 빨간 토스트 후 return
        if (isNaN(bidAmount) || bidAmount < minAmount) {
            setInputError(true);
            showToast('최소 입찰가보다 낮은 금액입니다.', 3000, true);
            bidCustomInput?.focus();
            return;
        }

        setInputError(false);

        // [서버 요청 필요] 입찰 요청
        // POST /api/auctions/:auctionId/bids
        // body: { bidPrice: bidAmount }
        // 성공 시:
        //   showToast(`${bidAmount.toLocaleString('ko-KR')}원으로 입찰되었습니다.`);
        //   updateBidUI(bidAmount) 호출하여 최고가 및 버튼 금액 갱신
        //   layout.js의 renderBidItem() 으로 입찰 내역 상단에 추가
        //   bidCustomInput.value = ''; 입력값 초기화
        // 실패 시:
        //   showToast('입찰에 실패했습니다. 다시 시도해주세요.', 3000, true);

        // 임시: 서버 연동 전 토스트 확인용
        showToast(`${bidAmount.toLocaleString('ko-KR')}원으로 입찰되었습니다.`);
        bidCustomInput.value = '';
    }

};