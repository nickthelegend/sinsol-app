# 📖 SinSol Contributing & Setup Instructions

Welcome to SinSol! This guide will help you get started with development, contribution, and deployment.

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** 18.x or later
- **npm** 9.x or later (or yarn/pnpm)
- **Git**
- **Solana Wallet** (Phantom, Backpack, or other)

### Local Development Setup

```bash
# 1. Clone the repository
git clone https://github.com/chandm1213/SinSol.lol.git
cd sinsol-app

# 2. Install dependencies
npm install

# 3. Copy environment template
cp .env.example .env

# 4. Edit .env with your configuration
# See Environment Variables section below

# 5. Run development server
npm run dev

# 6. Open http://localhost:3000
```

---

## ⚙️ Environment Variables

Create a `.env` file in the project root:

```env
# Required
NEXT_PUBLIC_RPC_URL=https://api.mainnet-beta.solana.com
NEXT_PUBLIC_PROGRAM_ID=8zCF4zrtbgibaXJ77q84jZaJacyMopW8nL1afE4jUE2z

# Optional - For development
NEXT_PUBLIC_PRIVY_APP_ID=your_privy_app_id
MAGICBLOCK_API_KEY=your_magicblock_key

# For local development
NEXT_PUBLIC_RPC_URL=https://api.devnet.solana.com
```

---

## 🧪 Running Tests

```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Run in watch mode
npm run test:watch
```

---

## 🏗️ Building for Production

### Development Build
```bash
npm run build
```

### Production Build
```bash
npm run build
npm start
```

### Vercel Deployment
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Or connect GitHub for automatic deployments
```

---

## 🎨 Development Guidelines

### Code Style
- Use **2 spaces** for indentation
- Use **single quotes** for strings
- Add **type annotations** for function parameters
- Use **const** over let where possible

### Component Structure
```typescript
// Good
export default function ComponentName() {
  // Hooks at top
  const { state } = useAppStore()
  
  // Early returns
  if (!state) return null
  
  // Render
  return (
    <div className="premium-card">
      Content
    </div>
  )
}
```

### Tailwind Classes Order
1. Layout (flex, grid, position)
2. Sizing (w, h, p, m)
3. Typography (text, font, leading)
4. Colors (text-, bg-, border-)
5. Effects (shadow, opacity)
6. Animations (transition, animate)

### Theme Classes Reference

| Element | Class |
|---------|-------|
| Dark card | `premium-card` |
| Red button | `premium-button` |
| Dark input | `premium-input` |
| Card hover | `.premium-card:hover` |
| Red text | `text-red-500` |
| Red bg | `bg-red-600` |

---

## 🔧 Common Tasks

### Adding a New Screen
1. Create component in `/src/components/`
2. Add route in `page.tsx` with state
3. Update navigation (Sidebar/MobileNav)

### Adding New UI Component
1. Create in `/src/components/ui/`
2. Use existing variants as template
3. Export from `index.ts`

### Adding Blockchain Function
1. Add to program hook in `/src/hooks/`
2. Type the function parameters
3. Add error handling

### Updating Theme
1. Edit `/src/app/globals.css`
2. Update CSS variables
3. Rebuild to see changes

---

## 🐛 Debugging

### Common Issues

**Build fails**
```bash
# Clear node_modules and reinstall
rm -rf node_modules
npm install

# Clear Next.js cache
rm -rf .next
npm run build
```

**Wallet connection issues**
- Check Privy app ID configuration
- Verify RPC URL is correct
- Try different wallet

**Transaction failures**
- Check wallet balance
- Verify network (mainnet vs devnet)
- Check program ID matches

### Debug Mode
```typescript
// Add console logs
console.log('Debug:', { variable })

// Use React DevTools
// Install browser extension
```

---

## 📦 Project Scripts

| Script | Usage |
|--------|-------|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm run start` | Production server |
| `npm run lint` | Lint code |
| `npm run typecheck` | Type check |
| `npm test` | Run tests |

---

## 🔐 Security Guidelines

### Never Do
- ❌ Commit private keys
- ❌ Commit API secrets
- ❌ Expose wallet seeds
- ❌ Skip validation

### Always Do
- ✅ Use environment variables
- ✅ Validate user input
- ✅ Type check everything
- ✅ Sanitize data

---

## 📚 Learning Resources

### Solana
- [Solana Docs](https://docs.solana.com)
- [Solana Cookbook](https://solanacookbook.com)
- [Anchor Docs](https://www.anchor-lang.com)

### Next.js
- [Next.js Docs](https://nextjs.org/docs)
- [App Router Guide](https://nextjs.org/docs/app)

### Project Specific
- [Context](./context.md) - Project background
- [Architecture](./architecture.md) - System design
- [Plans](./plans.md) - Roadmap

---

## 🤝 How to Contribute

### Good First Issues
1. Fix typos in docs
2. Add comments to code
3. Improve error messages
4. Update dependencies
5. Fix small bugs

### Pull Request Process
1. Fork the repo
2. Create feature branch
3. Make changes
4. Add tests (if applicable)
5. Update docs
6. Submit PR
7. Wait for review

### PR Checklist
- [ ] Code compiles
- [ ] Tests pass
- [ ] Docs updated
- [ ] No lint errors
- [ ] TypeScript clean

---

## 📞 Getting Help

| Channel | Link |
|--------|------|
| GitHub Issues | [github.com/chandm1213/SinSol.lol/issues](https://github.com/chandm1213/SinSol.lol/issues) |
| Discord | [Join SinSol Discord] |
| Twitter | [@SinSol_lol](https://x.com/SinSol_lol) |

---

## 📝 License

MIT License - See LICENSE file for details.

---

*Happy Coding! 🚀*