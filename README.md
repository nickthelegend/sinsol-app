# 🔥 SinSol - Premium On-Chain Social Platform

<p align="center">
  <img src="/logo.png" alt="SinSol Logo" width="200" />
</p>

<p align="center">
  <img src="/sinsol-logo-full.png" alt="SinSol Full Logo" width="400" />
</p>

---

## 🎯 Project Overview

**SinSol** is a premium on-chain social platform built on Solana that combines the best of Web2 social experiences with Web3 ownership. Unlike traditional social platforms, SinSol gives users complete ownership of their content, identity, and social graph through blockchain technology.

### Mission
To empower creators with true ownership of their content and audience, eliminating middlemen and maximizingCreator monetization through on-chain infrastructure.

---

## 🚀 Hackathon Submission

| Category | Details |
|----------|---------|
| **Project Name** | SinSol |
| **Track** | Social / Creator Economy |
| **Chain** | Solana |
| **Tech Stack** | Next.js 16, TypeScript, Solana Web3.js, Privy, MagicBlock |
| **Status** | 🟢 Production Ready |

---

## ✨ Features

### Core Features
- 📝 **On-Chain Posts** - Permanent, censorship-resistant posts stored on Solana
- 💬 **Encrypted DMs** - End-to-end encrypted chat using NaCl Box encryption
- 💰 **Private Payments** - Zero-knowledge private payments via MagicBlock PER
- 👥 **Social Graph** - On-chain followers/following system
- 🎁 **Creator Tokens** - Launch your own $SIN token (Coming Soon)

### Technical Highlights
- 🔐 **Zero Gas Fees for Users** - Platform sponsors all transaction fees
- 🌐 **Solana Actions** - Native Blink integration for seamless sharing
- 📱 **Mobile Ready** - Fully responsive PWA design
- 🎨 **Premium UX** - Dark theme with red accent design system

---

## 🛠 Tech Stack

### Frontend
- **Next.js 16** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Lucide React** - Icon library

### Blockchain
- **Solana Web3.js** - Blockchain interaction
- **Privy** - Embedded wallet & authentication
- **MagicBlock** - Private payments (PER)
- **Anchor** - Program framework (Rust)

### Infrastructure
- **Vercel** - Deployment & hosting
- **Next.js API Routes** - Backend API
- **Solana RPC** - Blockchain queries

---

## 📁 Project Structure

```
sinsol-app/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── page.tsx            # Main app page
│   │   ├── globals.css         # Global styles & theme
│   │   ├── layout.tsx          # Root layout with fonts
│   │   └── api/                # API routes
│   ├── components/            # React components
│   │   ├── Landing.tsx        # Landing page
│   │   ├── Feed.tsx            # Main feed
│   │   ├── Chat.tsx            # DMs/Whispers
│   │   ├── Profile.tsx          # User profile
│   │   ├── Header.tsx          # App header
│   │   ├── Sidebar.tsx         # Desktop nav
│   │   ├── MobileNav.tsx        # Mobile nav
│   │   └── ui/                 # Reusable UI components
│   ├── hooks/                  # Custom React hooks
│   ├── lib/                   # Utilities & contracts
│   └── contexts/              # React contexts
├── public/                    # Static assets
├── package.json               # Dependencies
└── README.md                  # This file
```

---

## 🎨 Design System

### Theme: Dark Premium (Black & Red)

| Element | Color |
|---------|-------|
| Background | `#0A0A0A` |
| Surface | `#141414` |
| Primary (Red) | `#DC2626` |
| Secondary | `#EF4444` |
| Text Primary | `#FAFAFA` |
| Text Secondary | `#A1A1AA` |

### Typography
- **Headlines**: Bebas Neue (bold, premium feel)
- **Body**: Outfit (clean, modern)
- **Accents**: Montserrat (elegant)

### Route Names (Unique Identity)
| Shyft.lol | SinSol |
|-----------|--------|
| Feed | TIMELINE |
| Chat | WHISPERS |
| Friends | SOULS |
| Payments | TRIBUTE |
| Dashboard | STUDIO |
| Profile | IDENTITY |

---

## 🚦 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Solana wallet (Phantom, Backpack, etc.)

### Installation

```bash
# Clone the repository
git clone https://github.com/chandm1213/SinSol.lol.git
cd sinsol-app

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your RPC URL and program IDs

# Run development server
npm run dev
```

### Environment Variables

```env
NEXT_PUBLIC_RPC_URL=https://api.mainnet-beta.solana.com
NEXT_PUBLIC_PROGRAM_ID=8zCF4zrtbgibaXJ77q84jZaJacyMopW8nL1afE4jUE2z
NEXT_PUBLIC_PRIVY_APP_ID=your_privy_app_id
```

---

## 📱 Building for Production

```bash
# Create production build
npm run build

# Start production server
npm start

# Or deploy to Vercel
vercel deploy
```

---

## 🔗 Important Links

- 🌐 **Website**: [sinsol.lol](https://sinsol.lol)
- 📖 **Docs**: [docs.sinsol.lol](https://sinsol.lol/docs)
- 🐦 **Twitter**: [@SinSol_lol](https://x.com/SinSol_lol)
- 🐙 **GitHub**: [github.com/chandm1213/SinSol.lol](https://github.com/chandm1213/SinSol.lol)
- 🔍 **Explorer**: [Solscan](https://solscan.io/account/8zCF4zrtbgibaXJ77q84jZaJacyMopW8nL1afE4jUE2z)

---

## 🤝 Contributing

We welcome contributions! Please read our contributing guidelines before submitting PRs.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

MIT License - see LICENSE file for details.

---

## 🙏 Acknowledgments

- **Solana Foundation** - Blockchain infrastructure
- **Privy** - Wallet & authentication
- **MagicBlock** - Private payment infrastructure
- **Shyft.lol** - Reference implementation
- **Pinata** - IPFS media storage

---

<p align="center">
  <strong>Built with ❤️ on Solana</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Solana-Black?style=for-the-badge&logo=solana&logoColor=white" alt="Solana" />
  <img src="https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js" />
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
</p>