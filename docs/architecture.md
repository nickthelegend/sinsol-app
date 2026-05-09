# 🏗 SinSol Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         Frontend (Next.js)                       │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐        │
│  │  Landing  │ │   Feed   │ │   Chat   │ │ Profile  │  ...   │
│  └─────┬──────┘ └─────┬──────┘ └─────┬──────┘ └─────┬──────┘        │
│        │             │             │             │              │
│  ┌─────┴─────────────┴─────────────┴─────────────┴──────┐       │
│  │              Components Library (UI)                │       │
│  │   Button, Card, Input, Badge, Avatar, Toast       │       │
│  └────────────────────────┬──────────────────────────┘       │
│                           │                                    │
│  ┌────────────────────────┴──────────────────────────┐       │
│  │              State Management (Zustand)            │       │
│  │    User state, Active tab, Notifications          │       │
│  └────────────────────────┬──────────────────────────┘       │
└───────────────────────────┼────────────────────────────────────┘
                            │
┌───────────────────────────┼────────────────────────────────────┐
│                     External Services                           │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐              │
│  │   Privy     │  │ MagicBlock  │  │   Solana    │              │
│  │  (Wallet)   │  │  (Payments) │  │    RPC      │              │
│  └─────────────┘  └─────────────┘  └─────────────┘              │
└─────────────────────────────────────────────────────────────────┘
                            │
┌───────────────────────────┼────────────────────────────────────┐
│                     Solana Blockchain                           │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                    SinSol Program                       │   │
│  │  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐        │   │
│  │  │Profile PDA│ │Post PDA │ │Comment │ │Reaction │  ...   │   │
│  │  └─────────┘ └─────────┘ └─────────┘ └─────────┘        │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

## Layer Architecture

### 1. Presentation Layer (Frontend)

#### Tech Stack
- **Next.js 16** - React framework with App Router
- **Tailwind CSS** - Styling with custom theme
- **Lucide React** - Icon components
- **Framer Motion** - Animations (optional)

#### Key Components

| Component | Purpose |
|-----------|---------|
| `Landing.tsx` | Marketing landing page |
| `Feed.tsx` | Main timeline with posts |
| `Chat.tsx` | Encrypted DMs (Whispers) |
| `Profile.tsx` | User profile page |
| `Header.tsx` | Top navigation bar |
| `Sidebar.tsx` | Desktop side navigation |
| `MobileNav.tsx` | Mobile bottom navigation |

#### UI Components (`/src/components/ui`)
- `Button.tsx` - Primary, secondary, destructive variants
- `Input.tsx` - Text input with dark theme
- `Card.tsx` - Content containers
- `Badge.tsx` - Status indicators
- `Avatar.tsx` - User images
- `Toast.tsx` - Notifications

### 2. State Management

Using **Zustand** for global state:

```typescript
// src/lib/store.ts
interface AppState {
  // User
  currentUser: User | null;
  setCurrentUser: (user: User) => void;
  
  // Navigation
  activeTab: string;
  setActiveTab: (tab: string) => void;
  
  // Data
  posts: Post[];
  addPost: (post: Post) => void;
  
  // UI
  theme: 'dark' | 'light';
  toggleTheme: () => void;
}
```

### 3. Blockchain Integration Layer

#### Wallet Connection (Privy)
```typescript
// src/hooks/usePrivyWallet.ts
- login() - Connect wallet
- logout() - Disconnect
- connected - Connection status
- publicKey - User's wallet address
- signTransaction() - Sign transactions
```

#### Program Interaction
```typescript
// src/hooks/useProgram.ts
- program.getProfile(wallet) - Fetch user profile
- program.createPost(content) - Create new post
- program.likePost(author, postId) - Like a post
- program.createComment(...) - Comment on post
- program.follow(target) - Follow user
```

#### RPC Configuration
- Mainnet: `https://api.mainnet-beta.solana.com`
- Devnet: `https://api.devnet.solana.com`

### 4. Backend Layer (Next.js API Routes)

| Route | Purpose |
|-------|---------|
| `/api/stats` | Get on-chain statistics |
| `/api/upload` | Media upload to IPFS |
| `/api/push/*` | Push notification handling |
| `/api/actions/*` | Solana Actions (Blinks) |

### 5. Smart Contract (Solana Program)

#### Program ID
```
8zCF4zrtbgibaXJ77q84jZaJacyMopW8nL1afE4jUE2z
```

#### Account Types

| Account | PDA Format | Data |
|---------|------------|------|
| Profile | `profile:${wallet}` | username, displayName, bio, avatar |
| Post | `post:${wallet}:${id}` | content, likes, timestamp |
| Comment | `comment:${post}:${index}` | content, author, timestamp |
| Reaction | `reaction:${post}:${user}:${type}` | user, reactionType |
| Follow | `follow:${from}:${to}` | follower, following |

#### Key Instructions
- `create_profile` - Initialize user profile
- `create_post` - Publish on-chain post
- `like_post` - Like a post
- `create_comment` - Comment on post
- `react_to_post` - React with emoji
- `follow` - Follow user
- `edit_post` - Modify own post
- `delete_post` - Remove post

## Data Flow

### User Creates Post
```
1. User types content in Feed
2. UI calls program.createPost()
3. Privy signs transaction
4. Sent to Solana RPC
5. Program validates & executes
6. Post account created on-chain
7. UI updates with new post
```

### Private Payment (MagicBlock PER)
```
1. User initiates payment in Chat
2. MagicBlock creates private transfer
3. Deposit & withdrawal unlinkable
4. Recipient receives funds
5. On-chain notification sent
```

## Security Architecture

### Wallet Security
- Privy handles key management
- Embedded wallet - no extensions needed
- Biometric unlock support

### Encryption
- **DMs**: NaCl Box (asymmetric encryption)
- **Content**: User controls visibility
- **Payments**: Zero-knowledge proofs

### Smart Contract
- Anchor framework for safety
- Owner-only mutations
- Reentrant guards

## Performance Optimization

### Frontend
- Server-side rendering for initial load
- Client-side navigation for transitions
- Optimistic UI updates
- Image optimization

### Blockchain
- RPC caching for queries
- Batch operations where possible
- Lazy loading of feed items
- Pagination (50 posts/page)

## Environment Configuration

```
# Development
NEXT_PUBLIC_RPC_URL=https://api.devnet.solana.com

# Production
NEXT_PUBLIC_RPC_URL=https://api.mainnet-beta.solana.com
```

## Deployment

### Vercel (Frontend)
- Automatic deployments on push
- Edge functions for API routes
- CDN for static assets

### Solana (Program)
- Anchor deploy to mainnet
- Upgrade authority controlled by team

---

## Future Architecture (Phase 3)

### Planned Additions
- **Token Program** - SPL token for creator coins
- **IPFS Integration** - Off-chain media storage
- **Indexer** - Better query performance
- **Mobile Apps** - Native iOS/Android

### Scaling Strategy
1. Read replicas for heavy queries
2. CDN for media content
3. RPC load balancing
4. Program optimization