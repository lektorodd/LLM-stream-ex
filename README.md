# 🔮 LLM Token Visualizer

An interactive web application for visualizing how Large Language Models predict the next token. Perfect for presentations and educational demonstrations!

## Features

- **Multiple Provider Options**: Choose between free local inference (Transformers.js) or OpenAI API
- **Real-time Token Predictions**: See the top probable next tokens with their probabilities
- **Interactive Bar Charts**: Visual representation of token probability distributions
- **Temperature Control**: Adjust randomness in token selection (0-2 scale)
- **Step-through Mode**: Click through token-by-token generation like a presentation
- **Temperature-based Sampling**: Demonstrates how temperature affects token selection
- **Projector-Friendly Design**: Large text and high-contrast colors for visibility
- **No Setup Required**: Works out-of-the-box with Transformers.js (no API key needed!)

## How It Works

1. **Choose a Provider**: Select Transformers.js (free, local) or OpenAI API
2. **Enter a Prompt**: Type something like "Norway is a"
3. **Get Predictions**: Click to see what tokens the model thinks should come next
4. **View Probabilities**: See a bar chart showing the top token candidates and their probabilities
5. **Select Next Token**: Click to sample and add the next token (temperature affects selection)
6. **Repeat**: Continue building text token-by-token

## Setup Instructions

### Quick Start (No API Key Required!)

1. **Open the application**
   - Simply open `index.html` in your web browser
   - The default provider is **Transformers.js** which runs locally - no setup needed!
   - On first use, it will download the GPT-2 model (~100MB, cached afterward)

2. **Start exploring!**
   - Try different prompts
   - Adjust the temperature to see how it affects selection
   - Change the number of top tokens displayed

### Using OpenAI API (Optional)

For faster and more capable predictions, you can use OpenAI:

1. **Get an API key** from [OpenAI](https://platform.openai.com/api-keys)
2. **Select "OpenAI API"** from the provider dropdown
3. **Enter your API key** in the field that appears
4. Your key is saved locally in your browser

## Provider Comparison

### Transformers.js (Default)
✅ **Pros:**
- Completely free
- No API key required
- Runs locally in browser
- Privacy-friendly (no data leaves your computer)
- Works offline after first load

❌ **Cons:**
- First load takes 1-2 minutes (downloads ~100MB model)
- Slower inference (2-5 seconds per prediction)
- Uses GPT-2 (smaller model, less sophisticated)
- Requires modern browser and decent hardware

### OpenAI API
✅ **Pros:**
- Very fast (<1 second per prediction)
- More capable model (GPT-3.5)
- Better quality predictions
- Works on any device

❌ **Cons:**
- Requires API key
- Costs money (very minimal - few cents per session)
- Requires internet connection
- Data sent to OpenAI

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

- **Frontend**: Vanilla JavaScript ES6 Modules, HTML5, CSS3
- **Charts**: Chart.js
- **Providers**:
  - Transformers.js (Xenova/gpt2) - Browser-based inference via WebAssembly
  - OpenAI Completions API (gpt-3.5-turbo-instruct)
- **Features Used**:
  - Logprobs (token probabilities) for OpenAI
  - Monte Carlo sampling for Transformers.js probability estimation

## API Costs

**Transformers.js**: Completely free! No API costs.

**OpenAI API** (optional):
- Model: `gpt-3.5-turbo-instruct`
- Cost: Very minimal (1 token per prediction)
- Typical session: A few cents

## Privacy & Security

**Transformers.js**:
- 100% private - all processing happens in your browser
- No data ever leaves your computer
- Model downloaded from Hugging Face CDN (one-time)

**OpenAI API**:
- Your API key is stored **only** in your browser's local storage
- Data is sent to OpenAI's API for processing
- Subject to OpenAI's privacy policy

## Troubleshooting

### Transformers.js Issues

**Model taking too long to load:**
- First download can take 1-2 minutes
- Check your internet connection
- Model is cached after first load

**"Out of memory" errors:**
- Try using a desktop/laptop instead of mobile
- Close other browser tabs
- Restart your browser
- Switch to OpenAI API provider

**Slow predictions:**
- This is normal for browser-based inference
- Consider using OpenAI API for faster results
- Close other tabs to free up resources

### OpenAI API Issues

**"Please enter your OpenAI API key first":**
- Make sure you've selected "OpenAI API" provider
- Enter a valid OpenAI API key
- Check that the key starts with `sk-`

**"API request failed":**
- Verify your API key is valid and has credits
- Check your internet connection
- Ensure you haven't exceeded API rate limits

### General Issues

**No predictions showing:**
- Open browser console (F12) to check for errors
- Try switching providers
- Try a different prompt or temperature
- Ensure you're using a modern browser

**Browser compatibility:**
- Use Chrome, Firefox, Edge, or Safari (latest versions)
- IE11 and older browsers are not supported
- Transformers.js requires WebAssembly support

## Customization

### Change the OpenAI Model

Edit `app.js` line ~229 to use a different OpenAI model:
```javascript
model: 'gpt-3.5-turbo-instruct',  // Change this
```

### Change the Transformers.js Model

Edit `app.js` line ~173 to use a different model:
```javascript
this.model = await pipeline('text-generation', 'Xenova/gpt2', {
```

Available models: `Xenova/gpt2`, `Xenova/gpt2-medium`, `Xenova/distilgpt2`

### Adjust Chart Appearance

Modify the Chart.js configuration in `app.js` starting at line ~87

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
- Local inference powered by [Transformers.js](https://huggingface.co/docs/transformers.js) from Hugging Face
- Cloud inference powered by [OpenAI API](https://openai.com/api/)
- GPT-2 model from [Hugging Face Model Hub](https://huggingface.co/models)

---

**Happy exploring! 🚀**

For questions or issues, please open a GitHub issue.
