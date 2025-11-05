(function() {
    'use strict';

    const provinceData = {
        'western-cape': { name: 'Western Cape', irradiation: [6.2,6.8,6.1,4.9,3.8,3.2,3.5,4.3,5.4,6.3,6.8,6.4] },
        'northern-cape': { name: 'Northern Cape', irradiation: [7.1,7.3,6.8,5.9,4.8,4.1,4.3,5.2,6.4,7.0,7.4,7.2] },
        'eastern-cape': { name: 'Eastern Cape', irradiation: [6.0,6.2,5.8,4.7,3.9,3.4,3.6,4.2,5.1,5.8,6.3,6.1] },
        'kwazulu-natal': { name: 'KwaZulu-Natal', irradiation: [5.8,6.0,5.5,4.8,4.2,3.8,4.0,4.6,5.2,5.7,6.1,5.9] },
        'free-state': { name: 'Free State', irradiation: [6.5,6.7,6.2,5.3,4.5,4.0,4.2,4.9,5.8,6.4,6.8,6.6] },
        'gauteng': { name: 'Gauteng', irradiation: [6.1,6.3,5.9,5.1,4.3,3.9,4.1,4.7,5.5,6.0,6.4,6.2] },
        'mpumalanga': { name: 'Mpumalanga', irradiation: [5.9,6.1,5.7,4.9,4.1,3.7,3.9,4.5,5.3,5.8,6.2,6.0] },
        'limpopo': { name: 'Limpopo', irradiation: [6.3,6.5,6.0,5.2,4.6,4.1,4.3,5.0,5.8,6.3,6.7,6.5] },
        'north-west': { name: 'North West', irradiation: [6.4,6.6,6.1,5.3,4.7,4.2,4.4,5.1,5.9,6.5,6.9,6.7] }
    };

    function initSolarCalculator() {
        const inverterSelect = document.getElementById('inverter');
        const panelsSelect = document.getElementById('panels');
        const batterySlider = document.getElementById('battery');
        const batteryValue = document.getElementById('battery-value');
        const provinceSelect = document.getElementById('province');
        const calculateBtn = document.getElementById('calculate-btn');
        const resultsPanel = document.getElementById('results');
        const loadingPanel = document.getElementById('loading');
        const backBtn = document.getElementById('back-btn');

        // Exit if elements don't exist (calculator not loaded)
        if (!inverterSelect || !panelsSelect || !batterySlider || !provinceSelect || !calculateBtn) {
            return;
        }

        function populatePanels() {
            panelsSelect.innerHTML = '<option value="">Select number of panels...</option>';
            const inverterSize = parseInt(inverterSelect.value);
            if (!inverterSize) return;
            let maxPanels = inverterSize * 2; 
            for(let i=1;i<=maxPanels;i++){ panelsSelect.innerHTML += `<option value="${i}">${i} Panels</option>`; }
        }

        inverterSelect.addEventListener('change', ()=> {
            populatePanels();
            batterySlider.disabled = !inverterSelect.value;
            checkCalculateBtn();
        });

        panelsSelect.addEventListener('change', checkCalculateBtn);
        provinceSelect.addEventListener('change', checkCalculateBtn);
        batterySlider.addEventListener('input', ()=>{ batteryValue.textContent = batterySlider.value + ' kWh'; });

        function checkCalculateBtn(){
            calculateBtn.disabled = !(provinceSelect.value && inverterSelect.value && panelsSelect.value);
        }

        calculateBtn.addEventListener('click', ()=> {
            if (loadingPanel) loadingPanel.style.display = 'block';
            if (resultsPanel) resultsPanel.style.display = 'none';
            setTimeout(()=> {
                if (loadingPanel) loadingPanel.style.display = 'none';
                if (resultsPanel) resultsPanel.style.display = 'block';
                updateResults();
            }, 1000);
        });

        if (backBtn) {
            backBtn.addEventListener('click', ()=> {
                // Hide calculator and show main content
                const calcDiv = document.getElementById('solar-cost-calc');
                const mainContainer = document.getElementById('main-container');
                if (calcDiv) calcDiv.style.display = 'none';
                if (calcDiv) calcDiv.innerHTML = '';
                if (mainContainer) mainContainer.style.display = 'block';
            });
        }

        function updateResults(){
            const panels = parseInt(panelsSelect.value);
            const inverterSize = parseInt(inverterSelect.value);
            const battery = parseInt(batterySlider.value);
            const province = provinceData[provinceSelect.value];
            const totalKwp = (panels*0.595).toFixed(2);

            // Corrected monthly savings using R3.5/kWh
            const avgIrradiation = province.irradiation.reduce((a,b)=>a+b,0)/12;
            const monthlySavings = Math.round(totalKwp * avgIrradiation * 30 * 3.5);

            const totalPanelsEl = document.getElementById('total-panels');
            const totalKwpEl = document.getElementById('total-kwp');
            const totalBatteryEl = document.getElementById('total-battery');
            const monthlySavingsEl = document.getElementById('monthly-savings');
            const savingsChartEl = document.getElementById('savings-chart');

            if (totalPanelsEl) totalPanelsEl.textContent = panels;
            if (totalKwpEl) totalKwpEl.textContent = totalKwp + ' kWp';
            if (totalBatteryEl) totalBatteryEl.textContent = battery + ' kWh';
            if (monthlySavingsEl) monthlySavingsEl.textContent = 'R ' + monthlySavings.toLocaleString();

            if (savingsChartEl && typeof Chart !== 'undefined') {
                const ctx = savingsChartEl.getContext('2d');
                if(window.solarChart) window.solarChart.destroy();
                window.solarChart = new Chart(ctx, {
                    type: 'bar',
                    data: {
                        labels: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
                        datasets: [{
                            label: 'Monthly kWh Production',
                            data: province.irradiation.map(i=>parseFloat((i*totalKwp*30).toFixed(0))),
                            backgroundColor: 'rgba(0,255,255,0.6)',
                            borderColor: '#193966',
                            borderWidth: 1
                        }]
                    },
                    options: {
                        responsive: true,
                        plugins: { legend: { labels: { color: '#193966', font:{ size:14 } } } },
                        scales: {
                            y: { ticks: { color:'#193966', beginAtZero:true }, grid: { color:'rgba(25,57,102,0.6)' } },
                            x: { ticks: { color:'#193966' }, grid: { color:'rgba(25,57,102,0.4)' } }
                        }
                    }
                });
            }
        }
    }

    // Initialize when calculator is loaded
    function initOnLoad() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initSolarCalculator);
        } else {
            initSolarCalculator();
        }
    }

    initOnLoad();
})();