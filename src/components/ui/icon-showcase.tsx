"use client";

import { IconButton } from "./icon-button";
import {
  // Lucide icons
  Home,
  User,
  Settings,
  Bell,
  Search,
  Wallet,
  Shield,
  Lock,
  Zap,
  Heart,
  Share2,
  MessageCircle,
  TrendingUp,
  Crown,
  Coins,
  Sparkles,
  Rocket,
  Gem,
  Flame,
  Verified,
  QrCode,
  ArrowRight,
  Plus,
  Check,
  X,
  MoreHorizontal,
  ExternalLink,
  Copy,
  Download,
  Upload,
  Trash2,
  Edit3,
  RefreshCw,
  Loader2,
  Moon,
  Sun,
  Globe,
  Link,
  Eye,
  EyeOff,
  Key,
  Fingerprint,
  CreditCard,
  Award,
  Trophy,
  BadgeCheck,
  Activity,
  BarChart3,
  PieChart,
  LineChart,
  Clock,
  Calendar,
  MapPin,
  Target,
  Scan,
  Wifi,
  Bluetooth,
  Battery,
  BatteryCharging,
  Volume2,
  VolumeX,
  Play,
  Pause,
  Maximize2,
  Minimize2,
  Grid,
  List,
  LayoutGrid,
  Filter,
  Menu,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  ArrowLeft,
  ArrowUp,
  ArrowDown,
  RotateCw,
  RotateCcw,
  Flag,
  Bookmark,
  ThumbsUp,
  ThumbsDown,
  AtSign,
  Hash,
  Quote,
  Code,
  Terminal,
  Cpu,
  Database,
  Server,
  FileText,
  Folder,
  FolderOpen,
  Image,
  File,
  Cloud,
  CloudUpload,
  CloudDownload,
  Mail,
  Inbox,
  Send,
  Phone,
  Video,
  Mic,
  MicOff,
  Camera,
  CameraOff,
  BellRing,
  BellOff,
  AlertCircle,
  AlertTriangle,
  Info,
  HelpCircle,
  CheckCircle,
  CheckCircle2,
  XCircle,
  Minus,
  MoreVertical,
  GripVertical,
  Trash,
  Edit,
  Clipboard,
  ClipboardCheck,
  Banknote,
  Receipt,
  ShoppingCart,
  Gift,
  Diamond,
  HeartOff,
  Repeat,
  Repeat2,
  Unlock,
  ShieldCheck,
  ShieldAlert,
  StopCircle,
  BatteryFull,
  BatteryLow,
  BatteryMedium,
  Timer,
  Hourglass,
  History,
  Navigation,
  Compass,
  Crosshair,
  ScanLine,
  Sidebar,
  Sheet,
  Maximize,
  Minimize,
  MessageSquare,
  PanelLeft,
  PanelRight,
  ScanFace,
  Radio,
  Rabbit,
  Rat,
  Star,
  Users,
} from "lucide-react";

import {
  // Radix icons
  DashboardIcon,
  MixIcon,
  LayoutIcon,
  GridIcon,
  ListBulletIcon,
  CardStackIcon,
  ViewGridIcon,
  ViewHorizontalIcon,
  ViewVerticalIcon,
  HomeIcon,
  PersonIcon,
  AvatarIcon,
  FaceIcon,
  IdCardIcon,
  GearIcon,
  MixerHorizontalIcon,
  MixerVerticalIcon,
  GlobeIcon,
  LockClosedIcon,
  LockOpen1Icon,
  LockOpen2Icon,
  EyeOpenIcon,
  EyeNoneIcon,
  EyeClosedIcon,
  TokensIcon,
  BackpackIcon,
  SunIcon,
  MoonIcon,
  MagnifyingGlassIcon,
  DotsHorizontalIcon,
  DotsVerticalIcon,
  DotFilledIcon,
  DotIcon,
  ActivityLogIcon,
  LightningBoltIcon,
  TimerIcon,
  ClockIcon,
  CalendarIcon,
  ClipboardCopyIcon,
  CodeIcon,
  Component1Icon,
  ComponentPlaceholderIcon,
  ContainerIcon,
  CookieIcon,
  CrumpledPaperIcon,
  CubeIcon,
  CursorArrowIcon,
  DesktopIcon,
  DiscIcon,
  DropdownMenuIcon,
  EraserIcon,
  ExitFullScreenIcon,
  ExternalLinkIcon,
  FontStyleIcon,
  FontRomanIcon,
  FontItalicIcon,
  FontBoldIcon,
  FrameIcon,
  FramerLogoIcon,
  GitHubLogoIcon,
  TwitterLogoIcon,
  FigmaLogoIcon,
  VercelLogoIcon,
  StitchesLogoIcon,
  EnterIcon,
  ExitIcon,
  HamburgerMenuIcon,
  Cross1Icon,
  CheckIcon,
  CheckCircledIcon,
  CrossCircledIcon,
  ExclamationTriangleIcon,
  InfoCircledIcon,
  QuestionMarkCircledIcon,
  PlusIcon,
  MinusIcon,
  ReloadIcon,
  ResetIcon,
  UpdateIcon,
  TrashIcon,
  Pencil1Icon,
  Pencil2Icon,
  CopyIcon,
  ClipboardIcon,
  RocketIcon,
  StarIcon,
  StarFilledIcon,
  HeartIcon,
  HeartFilledIcon,
  BookmarkIcon,
  BookmarkFilledIcon,
  BellIcon,
  ChatBubbleIcon,
  EnvelopeClosedIcon,
  EnvelopeOpenIcon,
  PaperPlaneIcon,
  Share1Icon,
  Share2Icon,
  ImageIcon,
  VideoIcon,
  SpeakerLoudIcon,
  SpeakerOffIcon,
  PlayIcon,
  PauseIcon,
  StopIcon,
  TrackPreviousIcon,
  TrackNextIcon,
  FileIcon,
  FileTextIcon,
  ArchiveIcon,
  UploadIcon,
  DownloadIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  ThickArrowLeftIcon,
  ThickArrowRightIcon,
  ThickArrowUpIcon,
  ThickArrowDownIcon,
} from "@radix-ui/react-icons";

const iconGroups = [
  {
    title: "Navigation",
    icons: [
      { Icon: Home, label: "Home" },
      { Icon: HomeIcon, label: "Home (Radix)", variant: "radix" },
      { Icon: DashboardIcon, label: "Dashboard", variant: "radix" },
      { Icon: MixIcon, label: "Mix", variant: "radix" },
      { Icon: Menu, label: "Menu" },
      { Icon: HamburgerMenuIcon, label: "Menu (Radix)", variant: "radix" },
      { Icon: LayoutGrid, label: "Grid" },
      { Icon: GridIcon, label: "Grid (Radix)", variant: "radix" },
      { Icon: List, label: "List" },
      { Icon: ListBulletIcon, label: "List (Radix)", variant: "radix" },
      { Icon: Search, label: "Search" },
      { Icon: MagnifyingGlassIcon, label: "Search (Radix)", variant: "radix" },
    ],
  },
  {
    title: "Arrows",
    icons: [
      { Icon: ArrowLeft, label: "Left" },
      { Icon: ArrowLeftIcon, label: "Left (Radix)", variant: "radix" },
      { Icon: ThickArrowLeftIcon, label: "Thick Left", variant: "radix" },
      { Icon: ArrowRight, label: "Right" },
      { Icon: ArrowRightIcon, label: "Right (Radix)", variant: "radix" },
      { Icon: ThickArrowRightIcon, label: "Thick Right", variant: "radix" },
      { Icon: ChevronLeft, label: "Chevron L" },
      { Icon: ChevronRight, label: "Chevron R" },
      { Icon: ChevronUp, label: "Chevron U" },
      { Icon: ChevronDown, label: "Chevron D" },
    ],
  },
  {
    title: "Actions",
    icons: [
      { Icon: Plus, label: "Add" },
      { Icon: PlusIcon, label: "Add (Radix)", variant: "radix" },
      { Icon: Check, label: "Check" },
      { Icon: CheckIcon, label: "Check (Radix)", variant: "radix" },
      { Icon: CheckCircledIcon, label: "Check Circle", variant: "radix" },
      { Icon: X, label: "Close" },
      { Icon: Cross1Icon, label: "Close (Radix)", variant: "radix" },
      { Icon: CrossCircledIcon, label: "X Circle", variant: "radix" },
      { Icon: Trash2, label: "Delete" },
      { Icon: TrashIcon, label: "Delete (Radix)", variant: "radix" },
      { Icon: Edit3, label: "Edit" },
      { Icon: Pencil2Icon, label: "Edit (Radix)", variant: "radix" },
      { Icon: Copy, label: "Copy" },
      { Icon: CopyIcon, label: "Copy (Radix)", variant: "radix" },
      { Icon: RefreshCw, label: "Refresh" },
      { Icon: ReloadIcon, label: "Reload (Radix)", variant: "radix" },
      { Icon: MoreHorizontal, label: "More" },
      { Icon: DotsHorizontalIcon, label: "More (Radix)", variant: "radix" },
    ],
  },
  {
    title: "Communication",
    icons: [
      { Icon: MessageCircle, label: "Message" },
      { Icon: ChatBubbleIcon, label: "Chat (Radix)", variant: "radix" },
      { Icon: Send, label: "Send" },
      { Icon: PaperPlaneIcon, label: "Send (Radix)", variant: "radix" },
      { Icon: Mail, label: "Mail" },
      { Icon: EnvelopeClosedIcon, label: "Mail (Radix)", variant: "radix" },
      { Icon: Bell, label: "Bell" },
      { Icon: BellIcon, label: "Bell (Radix)", variant: "radix" },
      { Icon: Share2, label: "Share" },
      { Icon: Share2Icon, label: "Share (Radix)", variant: "radix" },
      { Icon: Share1Icon, label: "Share Alt", variant: "radix" },
    ],
  },
  {
    title: "Social",
    icons: [
      { Icon: Heart, label: "Like" },
      { Icon: HeartIcon, label: "Like (Radix)", variant: "radix" },
      { Icon: HeartFilledIcon, label: "Like Filled", variant: "radix" },
      { Icon: ThumbsUp, label: "Thumbs" },
      { Icon: Bookmark, label: "Save" },
      { Icon: BookmarkIcon, label: "Save (Radix)", variant: "radix" },
      { Icon: BookmarkFilledIcon, label: "Save Filled", variant: "radix" },
      { Icon: Star, label: "Star" },
      { Icon: StarIcon, label: "Star (Radix)", variant: "radix" },
      { Icon: StarFilledIcon, label: "Star Filled", variant: "radix" },
      { Icon: User, label: "User" },
      { Icon: PersonIcon, label: "User (Radix)", variant: "radix" },
      { Icon: Users, label: "Users" },
    ],
  },
  {
    title: "Crypto & Finance",
    icons: [
      { Icon: Wallet, label: "Wallet" },
      { Icon: BackpackIcon, label: "Wallet (Radix)", variant: "radix" },
      { Icon: Coins, label: "Coins" },
      { Icon: TokensIcon, label: "Tokens", variant: "radix" },
      { Icon: CreditCard, label: "Card" },
      { Icon: Banknote, label: "Cash" },
      { Icon: Receipt, label: "Receipt" },
      { Icon: ShoppingCart, label: "Cart" },
      { Icon: Gift, label: "Gift" },
      { Icon: TrendingUp, label: "Trend" },
      { Icon: ThickArrowUpIcon, label: "Trend (Radix)", variant: "radix" },
      { Icon: Crown, label: "Crown" },
      { Icon: Award, label: "Award" },
      { Icon: Trophy, label: "Trophy" },
      { Icon: Gem, label: "Gem" },
      { Icon: Diamond, label: "Diamond" },
    ],
  },
  {
    title: "Security",
    icons: [
      { Icon: Shield, label: "Shield" },
      { Icon: ShieldCheck, label: "Verified" },
      { Icon: BadgeCheck, label: "Badge" },
      { Icon: Verified, label: "Verified" },
      { Icon: Lock, label: "Lock" },
      { Icon: LockClosedIcon, label: "Lock (Radix)", variant: "radix" },
      { Icon: LockOpen1Icon, label: "Unlock", variant: "radix" },
      { Icon: Key, label: "Key" },
      { Icon: Fingerprint, label: "Fingerprint" },
      { Icon: Eye, label: "View" },
      { Icon: EyeOpenIcon, label: "View (Radix)", variant: "radix" },
      { Icon: EyeOff, label: "Hide" },
      { Icon: EyeNoneIcon, label: "Hide (Radix)", variant: "radix" },
      { Icon: QrCode, label: "QR" },
      { Icon: Scan, label: "Scan" },
    ],
  },
  {
    title: "Media",
    icons: [
      { Icon: Play, label: "Play" },
      { Icon: PlayIcon, label: "Play (Radix)", variant: "radix" },
      { Icon: Pause, label: "Pause" },
      { Icon: PauseIcon, label: "Pause (Radix)", variant: "radix" },
      { Icon: Image, label: "Image" },
      { Icon: ImageIcon, label: "Image (Radix)", variant: "radix" },
      { Icon: Video, label: "Video" },
      { Icon: Volume2, label: "Volume" },
      { Icon: SpeakerLoudIcon, label: "Volume (Radix)", variant: "radix" },
      { Icon: VolumeX, label: "Mute" },
      { Icon: SpeakerOffIcon, label: "Mute (Radix)", variant: "radix" },
      { Icon: Mic, label: "Mic" },
      { Icon: Camera, label: "Camera" },
    ],
  },
  {
    title: "Files",
    icons: [
      { Icon: FileText, label: "File" },
      { Icon: FileTextIcon, label: "File (Radix)", variant: "radix" },
      { Icon: Folder, label: "Folder" },
      { Icon: Upload, label: "Upload" },
      { Icon: UploadIcon, label: "Upload (Radix)", variant: "radix" },
      { Icon: Download, label: "Download" },
      { Icon: DownloadIcon, label: "Download (Radix)", variant: "radix" },
      { Icon: Cloud, label: "Cloud" },
      { Icon: CloudUpload, label: "Cloud Up" },
      { Icon: CloudDownload, label: "Cloud Down" },
      { Icon: ArchiveIcon, label: "Archive", variant: "radix" },
      { Icon: Clipboard, label: "Clipboard" },
      { Icon: ClipboardIcon, label: "Clipboard (Radix)", variant: "radix" },
    ],
  },
  {
    title: "Status",
    icons: [
      { Icon: Zap, label: "Zap" },
      { Icon: LightningBoltIcon, label: "Lightning", variant: "radix" },
      { Icon: Flame, label: "Fire" },
      { Icon: Sparkles, label: "Sparkle" },
      { Icon: Rocket, label: "Rocket" },
      { Icon: RocketIcon, label: "Rocket (Radix)", variant: "radix" },
      { Icon: Loader2, label: "Loading" },
      { Icon: Activity, label: "Activity" },
      { Icon: ActivityLogIcon, label: "Activity (Radix)", variant: "radix" },
      { Icon: AlertCircle, label: "Alert" },
      { Icon: ExclamationTriangleIcon, label: "Warning", variant: "radix" },
      { Icon: Info, label: "Info" },
      { Icon: InfoCircledIcon, label: "Info (Radix)", variant: "radix" },
      { Icon: HelpCircle, label: "Help" },
      { Icon: QuestionMarkCircledIcon, label: "Help (Radix)", variant: "radix" },
    ],
  },
  {
    title: "Theme",
    icons: [
      { Icon: Sun, label: "Sun" },
      { Icon: SunIcon, label: "Sun (Radix)", variant: "radix" },
      { Icon: Moon, label: "Moon" },
      { Icon: MoonIcon, label: "Moon (Radix)", variant: "radix" },
    ],
  },
];

export function IconShowcase() {
  return (
    <div className="p-6 space-y-8">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-white">Icon Library</h1>
        <p className="text-zinc-400">
          Polished icon system using <strong>Lucide</strong> and <strong>Radix UI</strong> icons
        </p>
      </div>

      {/* Icon Button Variants */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-white">Button Variants</h2>
        <div className="flex flex-wrap gap-3">
          <IconButton variant="default" size="md">
            <Home className="w-5 h-5" />
          </IconButton>
          <IconButton variant="ghost" size="md">
            <Heart className="w-5 h-5" />
          </IconButton>
          <IconButton variant="outline" size="md">
            <Settings className="w-5 h-5" />
          </IconButton>
          <IconButton variant="solid" size="md">
            <Zap className="w-5 h-5" />
          </IconButton>
          <IconButton variant="soft" size="md">
            <Shield className="w-5 h-5" />
          </IconButton>
          <IconButton variant="default" size="md" badge={3}>
            <Bell className="w-5 h-5" />
          </IconButton>
          <IconButton variant="default" size="md" isLoading>
            <RefreshCw className="w-5 h-5" />
          </IconButton>
        </div>
      </div>

      {/* Size Variants */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-white">Button Sizes</h2>
        <div className="flex flex-wrap items-center gap-3">
          <IconButton variant="solid" size="xs">
            <Plus className="w-3.5 h-3.5" />
          </IconButton>
          <IconButton variant="solid" size="sm">
            <Plus className="w-4 h-4" />
          </IconButton>
          <IconButton variant="solid" size="md">
            <Plus className="w-5 h-5" />
          </IconButton>
          <IconButton variant="solid" size="lg">
            <Plus className="w-6 h-6" />
          </IconButton>
        </div>
      </div>

      {/* All Icons by Category */}
      {iconGroups.map((group) => (
        <div key={group.title} className="space-y-4">
          <h2 className="text-lg font-semibold text-white">{group.title}</h2>
          <div className="flex flex-wrap gap-2">
            {group.icons.map((icon, idx) => (
              <div
                key={idx}
                className="flex flex-col items-center gap-1 p-3 bg-white/5 rounded-xl border border-white/5 hover:border-white/10 transition-colors"
              >
                <icon.Icon
                  className={`w-5 h-5 ${icon.variant === "radix" ? "text-red-400" : "text-zinc-300"}`}
                  strokeWidth={icon.variant === "radix" ? undefined : 1.5}
                />
                <span className="text-[10px] text-zinc-500">{icon.label}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
