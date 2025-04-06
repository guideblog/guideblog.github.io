// vote.js
(function() {
    'use strict';
    
    class VoteBarPlugin {
        constructor(config) {
            this.config = Object.assign({
                containerSelector: '#voteContainer',
                dataUrl: './data.json',
                colors: ['#ff6b6b', '#4ecdc4', '#45b7d1'],
                barHeight: '25px',
                showNumbers: true,
                refreshInterval: 0
            }, config);

            this.container = document.querySelector(this.config.containerSelector);
            this.initStyles();
            this.init();
        }

        initStyles() {
            const style = document.createElement('style');
            style.textContent = `
                .vote-container {
                    width: 100%;
                    max-width: 600px;
                    margin: 20px auto;
                    font-family: Arial, sans-serif;
                }
                .vote-item {
                    margin: 15px 0;
                }
                .vote-label {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 8px;
                    font-size: 14px;
                }
                .vote-bar {
                    background-color: #f0f0f0;
                    height: ${this.config.barHeight};
                    border-radius: 10px;
                    overflow: hidden;
                }
                .vote-fill {
                    height: 100%;
                    transition: width 0.5s ease-in-out;
                }
            `;
            document.head.appendChild(style);
        }

        async fetchData() {
            try {
                const response = await fetch(this.config.dataUrl);
                return await response.json();
            } catch (error) {
                console.error('Failed to fetch voting data:', error);
                return [];
            }
        }

        calculatePercentages(data) {
            const total = data.reduce((sum, item) => sum + item.value, 0);
            return data.map(item => ({
                ...item,
                percentage: total > 0 ? (item.value / total) * 100 : 0
            }));
        }

        async render() {
            const rawData = await this.fetchData();
            const data = this.calculatePercentages(rawData);
            
            this.container.innerHTML = data.map((item, index) => `
                <div class="vote-item">
                    <div class="vote-label">
                        <span>${item.label}</span>
                        ${this.config.showNumbers ? 
                            `<span>${item.value} (${item.percentage.toFixed(1)}%)</span>` : ''}
                    </div>
                    <div class="vote-bar">
                        <div class="vote-fill" 
                             style="width: ${item.percentage}%;
                                    background-color: ${this.config.colors[index % this.config.colors.length]};">
                        </div>
                    </div>
                </div>
            `).join('');

            if (this.config.refreshInterval > 0) {
                this.startAutoRefresh();
            }
        }

        startAutoRefresh() {
            if (this.intervalId) clearInterval(this.intervalId);
            this.intervalId = setInterval(() => this.render(), this.config.refreshInterval);
        }

        async init() {
            await this.render();
        }
    }

    // 自动初始化
    fetch('./config.json')
        .then(response => response.json())
        .then(config => {
            if (!document.querySelector(config.containerSelector)) {
                const container = document.createElement('div');
                container.id = config.containerSelector.replace('#', '');
                document.body.appendChild(container);
            }
            new VoteBarPlugin(config);
        })
        .catch(error => console.error('Failed to load config:', error));

})();

