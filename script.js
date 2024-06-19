document.addEventListener('DOMContentLoaded', function() {
    const shootOpponent = document.getElementById('shootOpponent');
    const shootSelf = document.getElementById('shootSelf');
    const useItem = document.getElementById('useItem');
    const resetButton = document.getElementById('resetButton');
    const clickInfo = document.getElementById('clickInfo');
    const bulletInfo = document.getElementById('bulletInfo');
    const itemInfoP1 = document.getElementById('itemInfoP1');
    const itemInfoP2 = document.getElementById('itemInfoP2');
    const lifeInfoP1 = document.getElementById('lifeInfoP1');
    const lifeInfoP2 = document.getElementById('lifeInfoP2');
    const totalBullets = 10;
    const maxItems = 4;
    let realBullets;
    let blankBullets;
    let lifePointsP1;
    let lifePointsP2;
    let currentPlayer = 'P1';
    let itemsP1 = [];
    let itemsP2 = [];
    const items = ['알약', '돋보기', '맥주', '조커카드'];

    const initializeGame = () => {
        realBullets = Math.floor(Math.random() * (totalBullets / 2)) + 1;
        blankBullets = totalBullets - realBullets;
        const initialLifePoints = Math.floor(Math.random() * 4) + 2; // 2~5 랜덤 생명
        lifePointsP1 = initialLifePoints;
        lifePointsP2 = initialLifePoints;
        itemsP1 = [];
        itemsP2 = [];
        currentPlayer = 'P1';
        updateUI();
    };

    const updateUI = () => {
        updateBulletInfo();
        updateClickInfo();
        updateItemInfo();
        updateLifeInfo();
        shootOpponent.disabled = false;
        shootSelf.disabled = false;
        shootOpponent.textContent = '상대에게 쏘기';
        shootSelf.textContent = '자신에게 쏘기';
        shootOpponent.style.backgroundColor = '#007BFF';
        shootSelf.style.backgroundColor = '#007BFF';
        useItem.disabled = currentPlayer === 'P1' ? itemsP1.length === 0 : itemsP2.length === 0;
    };

    const updateBulletInfo = () => {
        bulletInfo.textContent = `실탄: ${realBullets}, 공포탄: ${blankBullets}`;
    };

    const updateClickInfo = () => {
        clickInfo.textContent = `현재 턴: ${currentPlayer}`;
    };

    const updateItemInfo = () => {
        itemInfoP1.textContent = `P1 아이템: ${itemsP1.join(', ')}`;
        itemInfoP2.textContent = `P2 아이템: ${itemsP2.join(', ')}`;
    };

    const updateLifeInfo = () => {
        lifeInfoP1.textContent = `P1 생명: ${lifePointsP1}`;
        lifeInfoP2.textContent = `P2 생명: ${lifePointsP2}`;
    };

    const handleShoot = (target) => {
        const isRealBullet = Math.random() < realBullets / (realBullets + blankBullets);
        if (isRealBullet) {
            realBullets--;
            if (target === 'self') {
                if (currentPlayer === 'P1') {
                    lifePointsP1--;
                } else {
                    lifePointsP2--;
                }
                checkLife();
            } else {
                if (currentPlayer === 'P1') {
                    lifePointsP2--;
                } else {
                    lifePointsP1--;
                }
                checkLife();
                currentPlayer = currentPlayer === 'P1' ? 'P2' : 'P1';
            }
        } else {
            blankBullets--;
            if (target === 'self') {
                shootSelf.textContent = '공포탄';
                shootSelf.style.backgroundColor = 'green';
            } else {
                shootOpponent.textContent = '공포탄';
                shootOpponent.style.backgroundColor = 'green';
                currentPlayer = currentPlayer === 'P1' ? 'P2' : 'P1';
            }
        }
        updateUI();

        if (realBullets === 0 && blankBullets === 0) {
            setTimeout(() => {
                alert('탄약을 다 사용했습니다! 무승부로 탄약을 재장전합니다.');
                realBullets = Math.floor(Math.random() * (totalBullets / 2)) + 1;
                blankBullets = totalBullets - realBullets;
                updateUI();
            }, 100);
        }

        giveItemToCurrentPlayer();
    };

    const handleUseItem = (itemIndex) => {
        let currentItem;
        if (currentPlayer === 'P1') {
            currentItem = itemsP1.splice(itemIndex, 1)[0];
        } else {
            currentItem = itemsP2.splice(itemIndex, 1)[0];
        }

        if (currentItem === '알약') {
            if (currentPlayer === 'P1') {
                lifePointsP1++;
            } else {
                lifePointsP2++;
            }
            alert('알약을 사용하여 생명이 1 증가했습니다!');
        } else if (currentItem === '돋보기') {
            const nextBullet = Math.random() < realBullets / (realBullets + blankBullets) ? '실탄' : '공포탄';
            alert(`돋보기를 사용하여 다음 탄은 ${nextBullet}입니다!`);
        } else if (currentItem === '맥주') {
            const isRealBullet = Math.random() < realBullets / (realBullets + blankBullets);
            if (isRealBullet) {
                realBullets--;
            } else {
                blankBullets--;
            }
            alert('맥주를 사용하여 이번 탄을 제거했습니다!');

            // 마지막 남은 탄을 제거한 경우 탄약 재장전
            if (realBullets === 0 && blankBullets === 0) {
                alert('마지막 탄을 제거했습니다! 무승부로 탄약을 재장전합니다.');
                realBullets = Math.floor(Math.random() * (totalBullets / 2)) + 1;
                blankBullets = totalBullets - realBullets;
            }
        } else if (currentItem === '조커카드') {
            realBullets = Math.floor(Math.random() * (totalBullets / 2)) + 1;
            blankBullets = totalBullets - realBullets;
            alert('조커카드를 사용하여 탄약을 재장전했습니다!');
        }

        // 아이템 사용 후 턴 변경하지 않음
        updateUI();
        if (currentPlayer === 'P2') {
            aiTurn();
        }
    };

    const giveItemToCurrentPlayer = () => {
        if ((currentPlayer === 'P1' && itemsP1.length < maxItems) || (currentPlayer === 'P2' && itemsP2.length < maxItems)) {
            const randomIndex = Math.floor(Math.random() * items.length);
            if (currentPlayer === 'P1') {
                itemsP1.push(items[randomIndex]);
            } else {
                itemsP2.push(items[randomIndex]);
            }
            updateItemInfo();
            // 아이템을 받은 후 즉시 사용할 수 있도록 useItem 버튼 활성화
            useItem.disabled = false;
        } else {
            alert(`${currentPlayer}는 이미 최대 아이템을 보유 중입니다!`);
        }
        if (currentPlayer === 'P2') {
            aiTurn();
        }
    };

    const checkLife = () => {
        if (lifePointsP1 <= 0) {
            setTimeout(() => {
                alert('P2가 승리했습니다!');
                initializeGame();
            }, 100);
        } else if (lifePointsP2 <= 0) {
            setTimeout(() => {
                alert('P1가 승리했습니다!');
                initializeGame();
            }, 100);
        }
    };

    const aiTurn = () => {
        setTimeout(() => {
            if (currentPlayer !== 'P2') return;

            // AI 전략: 생명 점수가 낮을 때 아이템 사용 우선
            if (lifePointsP2 <= 2 && itemsP2.includes('알약')) {
                handleUseItem(itemsP2.indexOf('알약'));
                return;
            }

            // 생명이 충분할 때, 총 쏘기 시도
            if (lifePointsP2 > 2 || itemsP2.length === 0) {
                handleShoot('opponent');
                return;
            }

            // 생명이 낮을 때 다른 아이템 사용
            if (itemsP2.includes('돋보기')) {
                handleUseItem(itemsP2.indexOf('돋보기'));
                return;
            }

            if (itemsP2.includes('맥주')) {
                handleUseItem(itemsP2.indexOf('맥주'));
                return;
            }

            if (itemsP2.includes('조커카드')) {
                handleUseItem(itemsP2.indexOf('조커카드'));
                return;
            }

            // 아이템이 없을 때 마지막으로 총 쏘기 시도
            handleShoot('opponent');
        }, 1000);
    };

    shootOpponent.addEventListener('click', () => handleShoot('opponent'));
    shootSelf.addEventListener('click', () => handleShoot('self'));
    useItem.addEventListener('click', () => {
        if (currentPlayer === 'P1') {
            if (itemsP1.length === 0) {
                alert('사용할 수 있는 아이템이 없습니다.');
                return;
            }
            const itemList = itemsP1.map((item, index) => `${index}: ${item}`).join('\n');
            const itemIndex = prompt(`사용할 아이템을 선택하세요:\n${itemList}`);
            const itemIndexInt = parseInt(itemIndex, 10);
            if (isNaN(itemIndexInt) || itemIndexInt < 0 || itemIndexInt >= itemsP1.length) {
                alert('유효한 인덱스를 입력하세요.');
            } else {
                handleUseItem(itemIndexInt);
            }
        }
    });
    resetButton.addEventListener('click', initializeGame);

    

    initializeGame();
});
