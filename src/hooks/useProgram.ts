"use client";

import { useMemo } from "react";
import { useConnection, useAnchorWallet } from "@/hooks/usePrivyWallet";
import { AnchorProvider } from "@coral-xyz/anchor";
import { SinSolClient } from "@/lib/program";

export function useProgram(): SinSolClient | null {
  const { connection } = useConnection();
  const wallet = useAnchorWallet();

  const client = useMemo(() => {
    if (!wallet) return null;
    const provider = new AnchorProvider(connection, wallet, {
      commitment: "confirmed",
    });
    return new SinSolClient(provider);
  }, [connection, wallet]);

  return client;
}
