// LLM Token Visualizer
// Main application logic with support for multiple providers

import { pipeline, env } from 'https://cdn.jsdelivr.net/npm/@xenova/transformers@2.17.2';

// Disable local model loading, use CDN
env.allowLocalModels = false;

class TokenVisualizer {
    constructor() {
        this.currentText = document.getElementById('prompt').value;
        this.tokenProbabilities = [];
        this.chart = null;
        this.apiKey = localStorage.getItem('openai_api_key') || '';
        this.provider = localStorage.getItem('provider') || 'transformers';
        this.model = null;
        this.modelLoading = false;

        this.initializeEventListeners();
        this.initializeChart();
        this.loadSettings();
        this.updateProviderUI();
    }

    initializeEventListeners() {
        // Provider selection
        document.getElementById('provider').addEventListener('change', (e) => {
            this.provider = e.target.value;
            localStorage.setItem('provider', this.provider);
            this.updateProviderUI();
        });

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

    loadSettings() {
        if (this.apiKey) {
            document.getElementById('api-key').value = this.apiKey;
        }
        document.getElementById('provider').value = this.provider;
    }

    updateProviderUI() {
        const apiKeySection = document.getElementById('api-key-setting');
        const providerInfo = document.getElementById('provider-info');

        if (this.provider === 'openai') {
            apiKeySection.style.display = 'flex';
            providerInfo.textContent = 'Requires API key - faster and more capable';
            providerInfo.style.color = '#667eea';
        } else {
            apiKeySection.style.display = 'none';
            providerInfo.textContent = 'Runs locally in your browser - no API key needed!';
            providerInfo.style.color = '#48bb78';
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

    async loadTransformersModel() {
        if (this.model || this.modelLoading) {
            return this.model;
        }

        this.modelLoading = true;
        const loadingIndicator = document.getElementById('model-loading');
        loadingIndicator.style.display = 'block';

        try {
            // Load GPT-2 model for token prediction
            this.model = await pipeline('text-generation', 'Xenova/gpt2', {
                revision: 'main',
            });

            loadingIndicator.style.display = 'none';
            this.modelLoading = false;
            return this.model;
        } catch (error) {
            loadingIndicator.style.display = 'none';
            this.modelLoading = false;
            throw error;
        }
    }

    async getPredictions() {
        const promptInput = document.getElementById('prompt');
        this.currentText = promptInput.value;
        document.getElementById('text-display').textContent = this.currentText;

        const predictBtn = document.getElementById('predict-btn');
        predictBtn.disabled = true;
        predictBtn.textContent = 'Loading...';

        try {
            if (this.provider === 'openai') {
                await this.getPredictionsOpenAI();
            } else {
                await this.getPredictionsTransformers();
            }

            this.updateChart();
            document.getElementById('next-btn').disabled = false;

        } catch (error) {
            console.error('Error:', error);
            alert(`Error getting predictions: ${error.message}`);
        } finally {
            predictBtn.disabled = false;
            predictBtn.textContent = 'Get Predictions';
        }
    }

    async getPredictionsOpenAI() {
        if (!this.apiKey) {
            throw new Error('Please enter your OpenAI API key first!');
        }

        const temperature = parseFloat(document.getElementById('temperature').value);

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

        if (data.choices && data.choices[0] && data.choices[0].logprobs) {
            const logprobs = data.choices[0].logprobs;
            const topLogprobs = logprobs.top_logprobs[0];

            this.tokenProbabilities = Object.entries(topLogprobs).map(([token, logprob]) => ({
                token: token,
                logprob: logprob,
                probability: Math.exp(logprob) * 100
            }));

            this.tokenProbabilities.sort((a, b) => b.probability - a.probability);
        } else {
            throw new Error('No logprobs in response');
        }
    }

    async getPredictionsTransformers() {
        // Load model if not already loaded
        const model = await this.loadTransformersModel();

        // Generate with the model to get logits
        // Note: transformers.js doesn't directly expose logprobs,
        // so we'll generate multiple samples and estimate probabilities
        const temperature = parseFloat(document.getElementById('temperature').value);

        // Generate a token with the model
        const output = await model(this.currentText, {
            max_new_tokens: 1,
            temperature: temperature,
            do_sample: true,
            return_dict_in_generate: true,
            output_scores: true,
            num_return_sequences: 1
        });

        // For transformers.js, we need to use a different approach
        // since it doesn't expose logprobs directly. We'll generate multiple
        // samples with low temperature to estimate token probabilities
        const samples = {};
        const numSamples = 100;

        for (let i = 0; i < numSamples; i++) {
            const result = await model(this.currentText, {
                max_new_tokens: 1,
                temperature: Math.max(0.7, temperature),
                do_sample: true,
                num_return_sequences: 1
            });

            // Extract just the new token
            const generatedText = result[0].generated_text;
            const newToken = generatedText.slice(this.currentText.length);

            if (newToken) {
                samples[newToken] = (samples[newToken] || 0) + 1;
            }
        }

        // Convert counts to probabilities
        const totalSamples = Object.values(samples).reduce((a, b) => a + b, 0);
        this.tokenProbabilities = Object.entries(samples).map(([token, count]) => ({
            token: token,
            logprob: Math.log(count / totalSamples),
            probability: (count / totalSamples) * 100
        }));

        this.tokenProbabilities.sort((a, b) => b.probability - a.probability);

        // Keep only top 20
        this.tokenProbabilities = this.tokenProbabilities.slice(0, 20);
    }

    updateChart() {
        const topN = parseInt(document.getElementById('top-tokens').value);
        const topTokens = this.tokenProbabilities.slice(0, topN);

        const labels = topTokens.map(t => this.formatToken(t.token));
        const data = topTokens.map(t => t.probability);

        this.chart.data.labels = labels;
        this.chart.data.datasets[0].data = data;

        this.chart.data.datasets[0].backgroundColor = topTokens.map((t, i) => {
            const intensity = 1 - (i / topN) * 0.5;
            return `rgba(102, 126, 234, ${intensity})`;
        });

        this.chart.update();
    }

    formatToken(token) {
        return token
            .replace(/\n/g, '\\n')
            .replace(/\t/g, '\\t')
            .replace(/^ $/, '·')
            .replace(/^$/, '[empty]');
    }

    selectNextToken() {
        const temperature = parseFloat(document.getElementById('temperature').value);

        let selectedToken;
        if (temperature === 0 || Math.random() < 0.1) {
            selectedToken = this.tokenProbabilities[0];
        } else {
            selectedToken = this.sampleWithTemperature(temperature);
        }

        this.currentText += selectedToken.token;
        document.getElementById('text-display').textContent = this.currentText;
        document.getElementById('prompt').value = this.currentText;

        const displayToken = this.formatToken(selectedToken.token);
        document.getElementById('selected-display').innerHTML = `
            <span class="token-text">"${displayToken}"</span>
            <span class="token-prob">${selectedToken.probability.toFixed(2)}%</span>
        `;

        this.highlightSelectedToken(selectedToken.token);
        document.getElementById('next-btn').disabled = true;

        setTimeout(() => {
            this.getPredictions();
        }, 500);
    }

    sampleWithTemperature(temperature) {
        const temps = this.tokenProbabilities.map(t => ({
            ...t,
            adjustedProb: Math.pow(Math.exp(t.logprob), 1 / temperature)
        }));

        const sum = temps.reduce((acc, t) => acc + t.adjustedProb, 0);
        temps.forEach(t => t.normalizedProb = t.adjustedProb / sum);

        const random = Math.random();
        let cumulative = 0;

        for (const token of temps) {
            cumulative += token.normalizedProb;
            if (random <= cumulative) {
                return token;
            }
        }

        return temps[0];
    }

    highlightSelectedToken(token) {
        const topN = parseInt(document.getElementById('top-tokens').value);
        const topTokens = this.tokenProbabilities.slice(0, topN);

        this.chart.data.datasets[0].backgroundColor = topTokens.map(t => {
            if (t.token === token) {
                return 'rgba(237, 137, 54, 0.9)';
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
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new TokenVisualizer();
    });
} else {
    new TokenVisualizer();
}
