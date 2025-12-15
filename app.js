// LLM Token Visualizer
// Main application logic

class TokenVisualizer {
    constructor() {
        this.currentText = document.getElementById('prompt').value;
        this.tokenProbabilities = [];
        this.chart = null;
        this.apiKey = localStorage.getItem('openai_api_key') || '';

        this.initializeEventListeners();
        this.initializeChart();
        this.loadApiKey();
    }

    initializeEventListeners() {
        // Temperature slider
        document.getElementById('temperature').addEventListener('input', (e) => {
            document.getElementById('temp-value').textContent = e.target.value;
        });

        // Top tokens slider
        document.getElementById('top-tokens').addEventListener('input', (e) => {
            document.getElementById('top-tokens-value').textContent = e.target.value;
            if (this.tokenProbabilities.length > 0) {
                this.updateChart();
            }
        });

        // API Key input
        document.getElementById('api-key').addEventListener('change', (e) => {
            this.apiKey = e.target.value;
            localStorage.setItem('openai_api_key', this.apiKey);
        });

        // Buttons
        document.getElementById('predict-btn').addEventListener('click', () => this.getPredictions());
        document.getElementById('next-btn').addEventListener('click', () => this.selectNextToken());
        document.getElementById('reset-btn').addEventListener('click', () => this.reset());

        // Enter key on prompt
        document.getElementById('prompt').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.getPredictions();
            }
        });
    }

    loadApiKey() {
        if (this.apiKey) {
            document.getElementById('api-key').value = this.apiKey;
        }
    }

    initializeChart() {
        const ctx = document.getElementById('tokenChart').getContext('2d');
        this.chart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: [],
                datasets: [{
                    label: 'Token Probability (%)',
                    data: [],
                    backgroundColor: 'rgba(102, 126, 234, 0.8)',
                    borderColor: 'rgba(102, 126, 234, 1)',
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                indexAxis: 'y',
                plugins: {
                    legend: {
                        display: true,
                        labels: {
                            font: {
                                size: 16
                            }
                        }
                    },
                    tooltip: {
                        titleFont: {
                            size: 16
                        },
                        bodyFont: {
                            size: 14
                        },
                        callbacks: {
                            label: function(context) {
                                return `Probability: ${context.parsed.x.toFixed(2)}%`;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        beginAtZero: true,
                        max: 100,
                        ticks: {
                            font: {
                                size: 14
                            },
                            callback: function(value) {
                                return value + '%';
                            }
                        },
                        title: {
                            display: true,
                            text: 'Probability (%)',
                            font: {
                                size: 16,
                                weight: 'bold'
                            }
                        }
                    },
                    y: {
                        ticks: {
                            font: {
                                size: 14,
                                weight: 'bold'
                            }
                        }
                    }
                }
            }
        });
    }

    async getPredictions() {
        if (!this.apiKey) {
            alert('Please enter your OpenAI API key first!');
            return;
        }

        const promptInput = document.getElementById('prompt');
        this.currentText = promptInput.value;
        document.getElementById('text-display').textContent = this.currentText;

        const predictBtn = document.getElementById('predict-btn');
        predictBtn.disabled = true;
        predictBtn.textContent = 'Loading...';

        try {
            const temperature = parseFloat(document.getElementById('temperature').value);

            // Call OpenAI API
            const response = await fetch('https://api.openai.com/v1/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.apiKey}`
                },
                body: JSON.stringify({
                    model: 'gpt-3.5-turbo-instruct',
                    prompt: this.currentText,
                    max_tokens: 1,
                    temperature: temperature,
                    logprobs: 20,
                    echo: false
                })
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error?.message || 'API request failed');
            }

            const data = await response.json();

            // Extract token probabilities
            if (data.choices && data.choices[0] && data.choices[0].logprobs) {
                const logprobs = data.choices[0].logprobs;
                const topLogprobs = logprobs.top_logprobs[0];

                // Convert logprobs to probabilities
                this.tokenProbabilities = Object.entries(topLogprobs).map(([token, logprob]) => ({
                    token: token,
                    logprob: logprob,
                    probability: Math.exp(logprob) * 100
                }));

                // Sort by probability (highest first)
                this.tokenProbabilities.sort((a, b) => b.probability - a.probability);

                this.updateChart();
                document.getElementById('next-btn').disabled = false;
            } else {
                throw new Error('No logprobs in response');
            }

        } catch (error) {
            console.error('Error:', error);
            alert(`Error getting predictions: ${error.message}`);
        } finally {
            predictBtn.disabled = false;
            predictBtn.textContent = 'Get Predictions';
        }
    }

    updateChart() {
        const topN = parseInt(document.getElementById('top-tokens').value);
        const topTokens = this.tokenProbabilities.slice(0, topN);

        const labels = topTokens.map(t => this.formatToken(t.token));
        const data = topTokens.map(t => t.probability);

        this.chart.data.labels = labels;
        this.chart.data.datasets[0].data = data;

        // Color the bars with gradient based on probability
        this.chart.data.datasets[0].backgroundColor = topTokens.map((t, i) => {
            const intensity = 1 - (i / topN) * 0.5;
            return `rgba(102, 126, 234, ${intensity})`;
        });

        this.chart.update();
    }

    formatToken(token) {
        // Replace special characters for display
        return token
            .replace(/\n/g, '\\n')
            .replace(/\t/g, '\\t')
            .replace(/ /g, '·'); // Show spaces as middle dots
    }

    selectNextToken() {
        const temperature = parseFloat(document.getElementById('temperature').value);

        // Temperature-based sampling
        let selectedToken;
        if (temperature === 0 || Math.random() < 0.1) {
            // Deterministic or mostly pick the top token
            selectedToken = this.tokenProbabilities[0];
        } else {
            // Sample based on temperature-adjusted probabilities
            selectedToken = this.sampleWithTemperature(temperature);
        }

        // Update display
        this.currentText += selectedToken.token;
        document.getElementById('text-display').textContent = this.currentText;
        document.getElementById('prompt').value = this.currentText;

        // Show selected token
        const displayToken = this.formatToken(selectedToken.token);
        document.getElementById('selected-display').innerHTML = `
            <span class="token-text">"${displayToken}"</span>
            <span class="token-prob">${selectedToken.probability.toFixed(2)}%</span>
        `;

        // Highlight the selected token in the chart
        this.highlightSelectedToken(selectedToken.token);

        // Disable next button until new predictions are fetched
        document.getElementById('next-btn').disabled = true;

        // Auto-fetch next predictions after a short delay
        setTimeout(() => {
            this.getPredictions();
        }, 500);
    }

    sampleWithTemperature(temperature) {
        // Apply temperature to probabilities
        const temps = this.tokenProbabilities.map(t => ({
            ...t,
            adjustedProb: Math.pow(Math.exp(t.logprob), 1 / temperature)
        }));

        // Normalize
        const sum = temps.reduce((acc, t) => acc + t.adjustedProb, 0);
        temps.forEach(t => t.normalizedProb = t.adjustedProb / sum);

        // Sample
        const random = Math.random();
        let cumulative = 0;

        for (const token of temps) {
            cumulative += token.normalizedProb;
            if (random <= cumulative) {
                return token;
            }
        }

        return temps[0]; // Fallback
    }

    highlightSelectedToken(token) {
        const topN = parseInt(document.getElementById('top-tokens').value);
        const topTokens = this.tokenProbabilities.slice(0, topN);

        this.chart.data.datasets[0].backgroundColor = topTokens.map(t => {
            if (t.token === token) {
                return 'rgba(237, 137, 54, 0.9)'; // Orange for selected
            }
            const intensity = 1 - (topTokens.indexOf(t) / topN) * 0.5;
            return `rgba(102, 126, 234, ${intensity})`;
        });

        this.chart.update();
    }

    reset() {
        const initialPrompt = "Norway is a";
        this.currentText = initialPrompt;
        document.getElementById('prompt').value = initialPrompt;
        document.getElementById('text-display').textContent = initialPrompt;
        document.getElementById('selected-display').innerHTML = `
            <span class="token-text">-</span>
            <span class="token-prob">-</span>
        `;

        this.tokenProbabilities = [];
        this.chart.data.labels = [];
        this.chart.data.datasets[0].data = [];
        this.chart.update();

        document.getElementById('next-btn').disabled = true;
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new TokenVisualizer();
});
