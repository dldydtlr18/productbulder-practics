document.addEventListener('DOMContentLoaded', () => {

    // --- Lotto Generator Elements ---
    const lottoBtn = document.getElementById('lotto-btn');
    const resetBtn = document.getElementById('reset-btn');
    const lottoGrid = document.getElementById('lotto-grid');
    const lottoRows = document.querySelectorAll('.lotto-row .lotto-number-set');

    // --- Map Elements ---
    const mapSearchBtn = document.getElementById('map-search-btn');
    const keywordInput = document.getElementById('keyword');
    const mapContainer = document.getElementById('map');
    const storeList = document.getElementById('store-list');

    // --- Lotto Generator Logic ---
    const selectedNumbers = new Set();
    const gridNumbers = [];

    // Create number grid
    for (let i = 1; i <= 45; i++) {
        const gridNumber = document.createElement('div');
        gridNumber.classList.add('grid-number');
        gridNumber.textContent = i;
        gridNumber.dataset.value = i;
        gridNumber.addEventListener('click', () => {
            if (selectedNumbers.has(i)) {
                selectedNumbers.delete(i);
                gridNumber.classList.remove('selected');
            } else {
                if (selectedNumbers.size < 6) {
                    selectedNumbers.add(i);
                    gridNumber.classList.add('selected');
                } else {
                    alert('최대 6개의 번호만 선택할 수 있습니다.');
                }
            }
        });
        lottoGrid.appendChild(gridNumber);
        gridNumbers.push(gridNumber);
    }
    
    // Reset button logic
    resetBtn.addEventListener('click', () => {
        selectedNumbers.clear();
        gridNumbers.forEach(gn => gn.classList.remove('selected'));
        lottoRows.forEach(row => {
            const numberSpans = row.querySelectorAll('.lotto-number');
            numberSpans.forEach(span => {
                span.textContent = '?';
                span.style.backgroundColor = '#aaaaaa';
            });
        });
    });

    // Number generation logic
    lottoBtn.addEventListener('click', () => {
        lottoRows.forEach(row => {
            const finalNumbers = new Set(selectedNumbers);
            while (finalNumbers.size < 6) {
                const randomNumber = Math.floor(Math.random() * 45) + 1;
                finalNumbers.add(randomNumber);
            }
            const sortedNumbers = Array.from(finalNumbers).sort((a, b) => a - b);
            
            const numberSpans = row.querySelectorAll('.lotto-number');
            numberSpans.forEach((span, index) => {
                const num = sortedNumbers[index];
                span.textContent = num;
                span.style.backgroundColor = getLottoBallColor(num);
            });
        });
    });

    function getLottoBallColor(number) {
        if (number <= 10) return '#fbc400'; // Yellow
        if (number <= 20) return '#69c8f2'; // Blue
        if (number <= 30) return '#ff7272'; // Red
        if (number <= 40) return '#aaaaaa'; // Gray
        return '#b0d840'; // Green
    }


    // --- Kakao Map Logic ---
    let map = null;
    let ps = null;
    let infowindow = null;
    let currentMarkers = [];

    kakao.maps.load(() => {
        const mapOption = {
            center: new kakao.maps.LatLng(37.566826, 126.9786567), // Default: Seoul City Hall
            level: 5
        };
        map = new kakao.maps.Map(mapContainer, mapOption);
        ps = new kakao.maps.services.Places();
        infowindow = new kakao.maps.InfoWindow({ zIndex: 1 });

        mapSearchBtn.addEventListener('click', searchPlaces);
        keywordInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                searchPlaces();
            }
        });
    });

    function searchPlaces() {
        const keyword = keywordInput.value.trim();
        if (!keyword) {
            alert('검색어를 입력해주세요!');
            return;
        }
        
        // Add "로또" to the keyword for better search results
        ps.keywordSearch(keyword + ' 로또', placesSearchCB);
    }

    function placesSearchCB(data, status, pagination) {
        if (status === kakao.maps.services.Status.OK) {
            clearMarkers();
            storeList.innerHTML = '';
            const bounds = new kakao.maps.LatLngBounds();

            for (let i = 0; i < data.length; i++) {
                displayMarker(data[i]);
                bounds.extend(new kakao.maps.LatLng(data[i].y, data[i].x));
                
                const li = document.createElement('li');
                li.innerHTML = `<strong>${data[i].place_name}</strong><p>${data[i].road_address_name || data[i].address_name}</p>`;
                storeList.appendChild(li);
            }
            map.setBounds(bounds);
        } else if (status === kakao.maps.services.Status.ZERO_RESULT) {
            alert('검색 결과가 존재하지 않습니다.');
        } else {
            alert('검색 중 오류가 발생했습니다.');
        }
    }

    function displayMarker(place) {
        const marker = new kakao.maps.Marker({
            map: map,
            position: new kakao.maps.LatLng(place.y, place.x)
        });
        currentMarkers.push(marker);

        kakao.maps.event.addListener(marker, 'click', () => {
            infowindow.setContent(`<div style="padding:5px;font-size:12px;">${place.place_name}</div>`);
            infowindow.open(map, marker);
        });
    }

    function clearMarkers() {
        for (let i = 0; i < currentMarkers.length; i++) {
            currentMarkers[i].setMap(null);
        }
        currentMarkers = [];
    }
});