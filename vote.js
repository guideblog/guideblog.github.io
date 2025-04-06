// vote.js
Gmeek.component('vote-bar', {
    template: `
        <div class="gmeek-vote-container">
            <div class="vote-item" v-for="(item, index) in processedData" :key="index">
                <div class="vote-label">
                    <span>{{ item.label }}</span>
                    <span v-if="config.showNumbers">
                        {{ item.value }} ({{ item.percentage.toFixed(1) }}%)
                    </span>
                </div>
                <div class="vote-bar">
                    <div class="vote-fill" 
                         :style="{
                             width: item.percentage + '%',
                             backgroundColor: config.colors[index % config.colors.length]
                         }">
                    </div>
                </div>
            </div>
        </div>
    `,

    config: {
        container: '#voteContainer',
        dataUrl: './data.json',
        colors: ['#FF6B6B', '#4ECDC4', '#45B7D1'],
        barHeight: '28px',
        showNumbers: true,
        refreshInterval: 5000
    },

    init() {
        this.processedData = []
        this.total = 0
        this.setupStyles()
        this.startPolling()
    },

    async mounted() {
        await this.loadData()
    },

    methods: {
        async loadData() {
            try {
                const response = await Gmeek.http.get(this.config.dataUrl)
                this.calculatePercentages(response.data)
            } catch (error) {
                console.error('[Gmeek Vote] Data load failed:', error)
            }
        },

        calculatePercentages(rawData) {
            this.total = rawData.reduce((sum, item) => sum + item.value, 0)
            this.processedData = rawData.map(item => ({
                ...item,
                percentage: this.total > 0 ? (item.value / this.total) * 100 : 0
            }))
        },

        setupStyles() {
            const styles = `
                .gmeek-vote-container {
                    width: 100%;
                    max-width: 800px;
                    margin: 20px auto;
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto;
                }

                .vote-item {
                    margin: 18px 0;
                }

                .vote-label {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 8px;
                    font-size: 14px;
                    color: #666;
                }

                .vote-bar {
                    background-color: #f8f9fa;
                    height: ${this.config.barHeight};
                    border-radius: 12px;
                    overflow: hidden;
                    box-shadow: inset 0 1px 2px rgba(0,0,0,0.05);
                }

                .vote-fill {
                    height: 100%;
                    transition: width 0.6s cubic-bezier(0.22, 0.61, 0.36, 1);
                    position: relative;
                }

                .vote-fill::after {
                    content: "";
                    position: absolute;
                    right: 0;
                    top: 0;
                    bottom: 0;
                    width: 4px;
                    background: linear-gradient(90deg, 
                        rgba(255,255,255,0.3) 0%, 
                        rgba(255,255,255,0.15) 100%);
                }
            `

            Gmeek.style.inject('gmeek-vote-styles', styles)
        },

        startPolling() {
            if (this.config.refreshInterval > 0) {
                this.polling = setInterval(() => {
                    this.loadData()
                }, this.config.refreshInterval)
            }
        }
    },

    beforeUnmount() {
        clearInterval(this.polling)
        Gmeek.style.remove('gmeek-vote-styles')
    }
})
