# VLN Brand Monitoring Dashboard

A comprehensive brand visibility tracking platform that monitors how AI models (ChatGPT, Claude, Gemini, Perplexity) rank your brand against competitors in real-time.

## 🚀 Features

### Core Functionality
- **Step 1**: Brand domain input with comprehensive validation
- **Step 2**: Dynamic competitor domain management (up to 10 competitors)
- **Step 3**: Multi-AI provider analysis with intelligent prompts
- **Step 4**: Rich analytics dashboard with 4 key insight cards

### Four Key Analytics Cards

#### 1. 🔍 Brand Visibility Tracking
- Overall visibility score across all AI models
- Brand mention frequency and rankings
- Top 3 position tracking
- Historical trend analysis

#### 2. 📊 Competitor Analysis
- Interactive bar chart comparing visibility scores
- Head-to-head brand performance metrics
- Market position insights
- Competitive intelligence

#### 3. ⚡ Real-time Analysis Feed
- Live brand mention tracking
- Sentiment analysis (positive/neutral/negative)
- Timestamped AI responses
- Provider-specific insights

#### 4. 👥 Multi-AI Provider Comparison
- Performance across ChatGPT, Claude, Gemini, Perplexity
- Provider-specific mention rates
- Model reliability scoring
- Cross-platform visibility metrics

## 🛠 Technical Implementation

### Architecture
```
VLN/
├── Frontend (Next.js 15 + React 19)
│   ├── Landing page with domain input
│   ├── Setup page with competitor management
│   └── Dashboard with analytics cards
├── Backend API
│   ├── Multi-AI provider integration
│   ├── Brand analysis engine
│   └── Demo data fallback
└── Validation & Security
    ├── Comprehensive domain validation
    ├── Rate limiting (5 requests/hour)
    └── Input sanitization
```

### AI Provider Integration
- **OpenAI**: GPT-4o-mini for comprehensive analysis
- **Anthropic**: Claude-3-haiku for balanced insights
- **Google**: Gemini-1.5-flash for diverse perspectives
- **Perplexity**: Llama-3.1-sonar for web-aware analysis

### Analysis Process
1. **Prompt Generation**: Creates 8 strategic prompts for competitive analysis
2. **Multi-Provider Querying**: Queries 3 prompts per provider (12 total responses)
3. **Response Analysis**: Extracts brand mentions, positions, and sentiment
4. **Metric Calculation**: Computes visibility scores and competitive metrics
5. **Dashboard Rendering**: Presents insights through interactive visualizations

## 🎯 Use Cases

### For Businesses
- **Brand Monitoring**: Track how AI models perceive your brand
- **Competitive Intelligence**: Understand competitor positioning
- **Market Research**: Analyze industry landscape through AI lens
- **SEO Strategy**: Optimize for AI-powered search results

### For Agencies
- **Client Reporting**: Comprehensive brand visibility reports
- **Competitive Analysis**: Multi-client competitive intelligence
- **Campaign Tracking**: Monitor brand perception changes
- **Strategic Planning**: Data-driven brand positioning

### For Startups
- **Market Positioning**: Understand competitive landscape
- **Brand Awareness**: Track mention frequency and sentiment
- **Investor Relations**: Demonstrate market presence
- **Product Positioning**: Optimize messaging for AI responses

## 🚦 Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL database
- Optional: AI provider API keys (OpenAI, Anthropic, Google, Perplexity)

### Quick Setup
```bash
# 1. Clone and install
git clone <repository-url>
cd vln-dashboard
npm install

# 2. Environment setup
cp .env.example .env.local
# Add your database URL and AI provider keys

# 3. Run setup
npm run setup

# 4. Start development
npm run dev
```

### Demo Mode
VLN includes comprehensive demo data that works without AI provider configuration:
- Realistic brand analysis scenarios
- Simulated competitor comparisons
- Interactive dashboard functionality
- Full feature demonstration

## 📋 Usage Guide

### Step 1: Brand Domain Input
1. Navigate to the VLN homepage
2. Enter your brand's domain (e.g., `example.com`)
3. Domain validation ensures proper format
4. Click "Start Analysis" to proceed

### Step 2: Competitor Management
1. Add competitor domains using the dynamic input system
2. Use "Add Another Competitor" for multiple entries
3. Remove competitors with the X button
4. Preview shows final analysis scope
5. Click "Start AI Analysis" to begin

### Step 3: Analysis Processing
- Automatic multi-AI provider querying
- Real-time progress indicators
- Intelligent prompt generation
- Response analysis and scoring

### Step 4: Dashboard Analytics
- **Overview Metrics**: Key performance indicators
- **Brand Visibility**: Detailed mention tracking
- **Competitor Analysis**: Interactive comparison charts
- **Real-time Feed**: Latest AI responses
- **Provider Comparison**: Cross-platform insights
- **Detailed Results**: Complete response breakdown

## 🔧 Configuration

### AI Provider Setup
```env
# OpenAI
OPENAI_API_KEY=sk-...

# Anthropic
ANTHROPIC_API_KEY=sk-ant-...

# Google AI
GOOGLE_GENERATIVE_AI_API_KEY=...

# Perplexity
PERPLEXITY_API_KEY=pplx-...
```

### Rate Limiting
- Default: 5 requests per hour per IP
- Configurable in `lib/vln-validation.ts`
- Prevents API abuse and cost management

### Domain Validation
- Comprehensive format checking
- Protocol and www prefix handling
- Duplicate detection
- Maximum 10 competitors per analysis

## 📊 Analytics Explained

### Visibility Score Calculation
```typescript
visibilityScore = (brandMentions / totalResponses) * 100
```

### Sentiment Analysis
- **Positive**: Brand mentioned favorably
- **Neutral**: Brand mentioned without sentiment
- **Negative**: Brand mentioned unfavorably

### Position Tracking
- Extracts ranking positions from AI responses
- Tracks top 5 positions across all queries
- Calculates average position for competitive analysis

### Confidence Scoring
- AI response reliability assessment
- Based on response quality and consistency
- Range: 50-100% confidence levels

## 🛡 Security Features

### Input Validation
- Zod schema validation for all inputs
- Domain format verification
- SQL injection prevention
- XSS protection

### Rate Limiting
- IP-based request limiting
- Configurable time windows
- Graceful degradation

### Error Handling
- Comprehensive error types
- User-friendly error messages
- Fallback to demo data
- Graceful API failures

## 🎨 UI/UX Features

### Modern Design
- Gradient backgrounds and glassmorphism effects
- Responsive design for all devices
- Intuitive progress indicators
- Interactive data visualizations

### User Experience
- Clear step-by-step workflow
- Real-time validation feedback
- Loading states and progress tracking
- Error recovery mechanisms

### Accessibility
- ARIA labels and semantic HTML
- Keyboard navigation support
- Screen reader compatibility
- High contrast color schemes

## 🔍 Technical Details

### Frontend Stack
- **Next.js 15**: React framework with App Router
- **React 19**: Latest React features
- **TypeScript 5.7**: Type safety and developer experience
- **Tailwind CSS v4**: Utility-first styling
- **shadcn/ui**: High-quality component library
- **Recharts**: Interactive data visualizations
- **Lucide React**: Modern icon library

### Backend Stack
- **AI SDK**: Multi-provider AI integration
- **Zod**: Runtime type validation
- **Next.js API Routes**: Serverless functions
- **Rate Limiting**: Built-in request throttling

### Data Flow
1. **Client Input**: Domain validation and sanitization
2. **API Request**: Validated data sent to analysis endpoint
3. **AI Querying**: Parallel requests to multiple providers
4. **Response Processing**: Mention detection and sentiment analysis
5. **Metric Calculation**: Visibility scores and competitive metrics
6. **Dashboard Rendering**: Real-time data visualization

## 📈 Performance Optimizations

### Frontend
- React 19 concurrent features
- Component memoization
- Lazy loading for large datasets
- Optimized re-renders

### Backend
- Parallel AI provider querying
- Request deduplication
- Response caching (future enhancement)
- Error boundary handling

### User Experience
- Progressive loading states
- Optimistic UI updates
- Graceful error recovery
- Demo data fallback

## 🚀 Deployment

### Vercel (Recommended)
```bash
# Deploy to Vercel
vercel --prod

# Set environment variables in Vercel dashboard
# Configure custom domain if needed
```

### Environment Variables
```env
# Required
DATABASE_URL=postgresql://...
BETTER_AUTH_SECRET=...

# Optional (for AI analysis)
OPENAI_API_KEY=...
ANTHROPIC_API_KEY=...
GOOGLE_GENERATIVE_AI_API_KEY=...
PERPLEXITY_API_KEY=...
```

## 🤝 Contributing

### Development Setup
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

### Code Standards
- TypeScript for type safety
- ESLint for code quality
- Prettier for formatting
- Conventional commits

## 📄 License

MIT License - see LICENSE file for details.

## 🆘 Support

### Common Issues
- **No AI responses**: Check API keys and rate limits
- **Validation errors**: Ensure domains are properly formatted
- **Dashboard not loading**: Check network connectivity

### Demo Mode
If AI providers aren't configured, VLN automatically uses demo data to showcase all features.

---

**VLN Brand Monitoring Dashboard** - Track your brand's visibility across AI models with comprehensive analytics and competitive intelligence.