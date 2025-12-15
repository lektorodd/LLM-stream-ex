# 🔮 LLM Token Visualizer

An interactive web application for visualizing how Large Language Models predict the next token. Perfect for presentations and educational demonstrations!

## Features

- **Real-time Token Predictions**: See the top probable next tokens with their probabilities
- **Interactive Bar Charts**: Visual representation of token probability distributions
- **Temperature Control**: Adjust randomness in token selection (0-2 scale)
- **Step-through Mode**: Click through token-by-token generation like a presentation
- **Temperature-based Sampling**: Demonstrates how temperature affects token selection
- **Projector-Friendly Design**: Large text and high-contrast colors for visibility

## How It Works

1. **Enter a Prompt**: Type something like "Norway is a"
2. **Get Predictions**: Click to see what tokens the model thinks should come next
3. **View Probabilities**: See a bar chart showing the top token candidates and their probabilities
4. **Select Next Token**: Click to sample and add the next token (temperature affects selection)
5. **Repeat**: Continue building text token-by-token

## Setup Instructions

### Prerequisites

- A modern web browser (Chrome, Firefox, Safari, or Edge)
- An OpenAI API key ([Get one here](https://platform.openai.com/api-keys))

### Installation

1. **Clone or download this repository**
   ```bash
   git clone <repository-url>
   cd LLM-stream-ex
   ```

2. **Open the application**
   - Simply open `index.html` in your web browser
   - Or use a local server:
     ```bash
     # Python 3
     python -m http.server 8000

     # Python 2
     python -m SimpleHTTPServer 8000

     # Node.js
     npx serve
     ```
   - Then navigate to `http://localhost:8000`

3. **Enter your OpenAI API Key**
   - Paste your API key in the "OpenAI API Key" field
   - It will be saved in your browser's local storage for future use

4. **Start exploring!**
   - Try different prompts
   - Adjust the temperature to see how it affects selection
   - Change the number of top tokens displayed

## Understanding Temperature

Temperature controls the randomness of token selection:

- **Temperature = 0**: Deterministic (always picks the most probable token)
- **Temperature = 0.7**: Balanced (default, good mix of coherence and variety)
- **Temperature = 1.0**: Natural sampling from the distribution
- **Temperature > 1.0**: More random (increases probability of unlikely tokens)
- **Temperature = 2.0**: Very random (can produce unexpected results)

## Usage Tips

### For Presentations

1. Set up your prompt beforehand
2. Use a projector or large screen
3. Increase browser zoom (Ctrl/Cmd +) for better visibility
4. Walk through token selection step-by-step
5. Compare different temperature settings live

### For Education

- Demonstrate how LLMs work at the token level
- Show the probabilistic nature of text generation
- Explain the role of temperature in AI creativity
- Compare deterministic vs. stochastic selection

## Technical Details

- **Frontend**: Vanilla JavaScript, HTML5, CSS3
- **Charts**: Chart.js
- **API**: OpenAI Completions API (gpt-3.5-turbo-instruct)
- **Features Used**: Logprobs (token probabilities)

## API Costs

The application uses the OpenAI API which has associated costs:
- Model: `gpt-3.5-turbo-instruct`
- Cost: Very minimal (1 token per prediction)
- Typical session: A few cents

## Privacy & Security

- Your API key is stored **only** in your browser's local storage
- No data is sent to any server except OpenAI's API
- All processing happens client-side

## Troubleshooting

### "Please enter your OpenAI API key first"
- Make sure you've entered a valid OpenAI API key
- Check that the key starts with `sk-`

### "API request failed"
- Verify your API key is valid and has credits
- Check your internet connection
- Ensure you haven't exceeded API rate limits

### No predictions showing
- Open browser console (F12) to check for errors
- Verify the API response is successful
- Try a different prompt or temperature

## Customization

### Change the Model

Edit `app.js` line ~122 to use a different model:
```javascript
model: 'gpt-3.5-turbo-instruct',  // Change this
```

### Adjust Chart Appearance

Modify the Chart.js configuration in `app.js` starting at line ~55

### Update Styling

Edit `styles.css` to change colors, sizes, or layout

## Browser Compatibility

- Chrome/Edge: ✅ Fully supported
- Firefox: ✅ Fully supported
- Safari: ✅ Fully supported
- IE11: ❌ Not supported

## License

MIT License - Feel free to use for educational purposes!

## Contributing

Contributions are welcome! Feel free to:
- Report bugs
- Suggest features
- Submit pull requests

## Acknowledgments

- Built with [Chart.js](https://www.chartjs.org/)
- Powered by [OpenAI API](https://openai.com/api/)

---

**Happy exploring! 🚀**

For questions or issues, please open a GitHub issue.
