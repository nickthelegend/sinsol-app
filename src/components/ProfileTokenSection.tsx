"use client";

import { useState, useEffect } from "react";
import { TrendingUp, TrendingDown, Users, ExternalLink, Loader2, ArrowUpRight } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface ProfileTokenSectionProps {
  username: string;
  displayName: string;
  avatar?: string;
  tokenMint?: string;
  tokenSymbol?: string;
  tokenImage?: string;
  onBuyClick?: () => void;
}

// Mock price data for the chart
const generatePriceData = () => {
  const data = [];
  let price = Math.random() * 0.5 + 0.1;
  for (let i = 0; i < 24; i++) {
    price = price * (1 + (Math.random() - 0.5) * 0.1);
    data.push(price);
  }
  return data;
};

export default function ProfileTokenSection({
  username,
  displayName,
  avatar,
  tokenMint,
  tokenSymbol,
  tokenImage,
  onBuyClick,
}: ProfileTokenSectionProps) {
  const [priceData, setPriceData] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);

  // Simulate fetching price data
  useEffect(() => {
    setTimeout(() => {
      setPriceData(generatePriceData());
      setLoading(false);
    }, 500);
  }, [tokenMint]);

  const currentPrice = priceData[priceData.length - 1] || 0;
  const priceChange = priceData.length > 1 ? ((priceData[priceData.length - 1] - priceData[0]) / priceData[0]) * 100 : 0;
  const isPositive = priceChange >= 0;

  // If no token mint, show "Launch Token" CTA
  if (!tokenMint) {
    return (
      <Card className="mt-4 border-purple-900/50 bg-black/60">
        <CardContent className="p-6 text-center">
          <div className="mb-4 flex justify-center">
            <div className="h-16 w-16 rounded-full bg-gradient-to-br from-purple-900/50 to-pink-900/50 flex items-center justify-center">
              <TrendingUp className="h-8 w-8 text-purple-400" />
            </div>
          </div>
          <h3 className="text-lg font-bold text-white mb-2">Launch Your Creator Token</h3>
          <p className="text-sm text-gray-400 mb-4">
            Let your fans buy and trade your token. Earn from every trade.
          </p>
          <Button className="bg-gradient-to-r from-[#e11d48] to-[#c026d3] hover:from-[#ff0022] hover:to-[#d946ef]">
            <TrendingUp className="h-4 w-4 mr-2" />
            Launch Token
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Find min/max for chart scaling
  const minPrice = Math.min(...priceData);
  const maxPrice = Math.max(...priceData);
  const priceRange = maxPrice - minPrice || 1;

  return (
    <Card className="mt-4 border-purple-900/50 bg-black/60 overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={tokenImage || avatar} />
              <AvatarFallback>{username[0]?.toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-lg">{displayName}</CardTitle>
              <p className="text-sm text-gray-400">@{username}</p>
            </div>
          </div>
          <Badge variant={isPositive ? "success" : "destructive"} className="text-xs">
            {isPositive ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
            {Math.abs(priceChange).toFixed(1)}%
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Price Chart */}
        <div className="relative h-24 w-full overflow-hidden rounded-lg bg-purple-900/20">
          {loading ? (
            <div className="flex h-full items-center justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-purple-400" />
            </div>
          ) : (
            <div className="flex h-full items-end gap-0.5 p-2">
              {priceData.map((price, i) => {
                const height = ((price - minPrice) / priceRange) * 100;
                return (
                  <div
                    key={i}
                    className={`flex-1 rounded-t ${
                      i === priceData.length - 1
                        ? isPositive
                          ? "bg-gradient-to-t from-[#e11d48] to-[#ff0022]"
                          : "bg-gradient-to-t from-red-600 to-red-400"
                        : "bg-purple-900/50"
                    }`}
                    style={{ height: `${Math.max(height, 4)}%` }}
                  />
                );
              })}
            </div>
          )}
        </div>

        {/* Stats Row */}
        <div className="flex items-center justify-between text-sm">
          <div>
            <p className="text-gray-400">Price</p>
            <p className="text-xl font-bold text-white">${currentPrice.toFixed(4)}</p>
          </div>
          <div className="text-right">
            <p className="text-gray-400">Holders</p>
            <p className="font-semibold text-white flex items-center justify-end gap-1">
              <Users className="h-4 w-4 text-purple-400" />
              {Math.floor(Math.random() * 500) + 50}
            </p>
          </div>
        </div>

        {/* Buy Button */}
        <Button
          onClick={onBuyClick}
          className="w-full bg-gradient-to-r from-[#e11d48] to-[#c026d3] hover:from-[#ff0022] hover:to-[#d946ef] h-12 text-base font-semibold"
        >
          <ArrowUpRight className="h-5 w-5 mr-2" />
          Buy ${tokenSymbol || username.toUpperCase().slice(0, 6)}
        </Button>

        {/* External Link */}
        <a
          href={`https://dexscreener.com/solana/${tokenMint}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-1 text-xs text-gray-500 hover:text-purple-400 transition-colors"
        >
          View on DexScreener
          <ExternalLink className="h-3 w-3" />
        </a>
      </CardContent>
    </Card>
  );
}