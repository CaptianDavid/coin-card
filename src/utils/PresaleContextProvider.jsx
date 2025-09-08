import React, {
  useContext,
  useMemo,
  useState,
  useCallback,
  useEffect,
} from 'react';
import { ethers } from 'ethers';
import { useAccount, useChainId, useWalletClient } from 'wagmi';
import { CHAINS } from '../contracts/chainConfig';
import { TOKENS } from '../contracts/tokens';
import { buy as buyService } from './purchase';
import { getQuote } from './quotes';
import PresaleContext from './PresaleContext';

export default function PresaleContextProvider({ children }) {
  const { chain, isConnected, address } = useAccount();
  const chainId = useChainId();
  const { data: walletClient } = useWalletClient();
  const [selectedChainId, setSelectedChainId] = useState(chainId || 56); // Use current chain or default to BNB
  const [selectedPayAssetKey, setSelectedPayAssetKey] = useState('NATIVE');
  const [amountHuman, setAmountHuman] = useState('');

  const [isQuoting, setIsQuoting] = useState(false);
  const [quoteError, setQuoteError] = useState(null);
  const [quoteUsd, setQuoteUsd] = useState('0');
  const [quoteStayx, setQuoteStayx] = useState('0');

  // Update chainId when user switches networks
  useEffect(() => {
    console.log('=== CHAIN DEBUG ===');
    console.log('chain from useAccount:', chain);
    console.log('chainId from useChainId:', chainId);
    console.log('current selectedChainId:', selectedChainId);
    if (chainId) {
      console.log('Setting selectedChainId to:', chainId);
      setSelectedChainId(chainId);
    }
    console.log('==================');
  }, [chainId, selectedChainId]);

  const chainMeta = useMemo(
    () => Object.values(CHAINS).find((c) => c.chainId === selectedChainId),
    [selectedChainId]
  );
  const payAsset = useMemo(
    () => (TOKENS[selectedChainId] || {})[selectedPayAssetKey] || null,
    [selectedChainId, selectedPayAssetKey]
  );

  const handlePaymentInput = (v) => setAmountHuman(v);
  const makeEmptyInputs = () => ({ token: '', amount: '' });
  const [userBalance, setUserBalance] = useState('0');

  const provider = useMemo(() => {
    // Try wagmi walletClient first (works better on mobile)
    if (walletClient) {
      console.log('Using wagmi walletClient for provider');
      return new ethers.BrowserProvider(walletClient);
    }
    
    // Fallback to window.ethereum
    if (typeof window !== 'undefined' && window.ethereum) {
      console.log('Using window.ethereum for provider');
      return new ethers.BrowserProvider(window.ethereum);
    }
    
    console.log('No provider available');
    return null;
  }, [walletClient, selectedChainId]);

  const presaleAddress = chainMeta?.presale;

  useEffect(() => {
    let cancelled = false;
    async function run() {
      setQuoteError(null);
      if (
        !provider ||
        !presaleAddress ||
        !amountHuman ||
        Number(amountHuman) <= 0
      ) {
        setQuoteUsd('0');
        setQuoteStayx('0');
        return;
      }
      setIsQuoting(true);
      try {
        const q = await getQuote({
          provider,
          chainId: selectedChainId,
          presaleAddress,
          assetKey: selectedPayAssetKey,
          amountHuman,
        });
        if (!cancelled) {
          setQuoteUsd(q.usdFormatted);
          setQuoteStayx(q.stayxFormatted);
        }
      } catch (e) {
        if (!cancelled) {
          setQuoteError(e?.message || 'Quote failed');
          setQuoteUsd('0');
          setQuoteStayx('0');
        }
      } finally {
        if (!cancelled) setIsQuoting(false);
      }
    }
    run();
    return () => {
      cancelled = true;
    };
  }, [
    provider,
    presaleAddress,
    selectedChainId,
    selectedPayAssetKey,
    amountHuman,
  ]);

  const buyToken = useCallback(async (overrideAmount = null, overrideChainId = null) => {
    console.log('=== BUYTOKEN DEBUG ===');
    console.log('selectedChainId in buyToken:', selectedChainId);
    console.log('chainId from useChainId in buyToken:', chainId);
    console.log('chain from useAccount in buyToken:', chain);
    console.log('isConnected from useAccount:', isConnected);
    console.log('address from useAccount:', address);
    console.log('overrideChainId:', overrideChainId);
    console.log('presaleAddress:', presaleAddress);
    console.log('selectedPayAssetKey:', selectedPayAssetKey);
    console.log('========================');
    
    if (!provider) throw new Error('No provider');
    if (!presaleAddress) throw new Error('Missing presale address');
    if (!selectedPayAssetKey) throw new Error('Select asset');
    
    const amountToUse = overrideAmount || amountHuman;
    if (!amountToUse || Number(amountToUse) <= 0)
      throw new Error('Enter amount');

    const signer = await provider.getSigner();
    const user = await signer.getAddress();

    // Use override chainId if provided, otherwise use selectedChainId
    const chainIdToUse = overrideChainId || selectedChainId;

    // Mobile-specific: Check if wallet is actually connected
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    console.log('=== CONNECTION CHECK DEBUG ===');
    console.log('isMobile:', isMobile);
    console.log('isConnected:', isConnected);
    console.log('address:', address);
    console.log('user from signer:', user);
    
    if (isMobile) {
      const savedConnection = localStorage.getItem('walletConnected');
      const savedAddress = localStorage.getItem('walletAddress');
      console.log('Mobile localStorage check:', { savedConnection, savedAddress });
      
      // For mobile, just check if we have a user address from signer
      if (!user) {
        console.log('❌ Mobile connection failed - no user from signer');
        throw new Error('Wallet not connected. Please connect your wallet first.');
      }
      console.log('✅ Mobile connection verified - user exists:', user);
    } else {
      // For desktop, check if wagmi says connected
      console.log('Desktop connection check:', { isConnected, address });
      if (!isConnected || !address) {
        console.log('❌ Desktop connection failed - wagmi check');
        throw new Error('Wallet not connected. Please connect your wallet first.');
      }
      console.log('✅ Desktop connection verified');
    }
    console.log('==============================');

    return await buyService({
      provider,
      user,
      chainId: chainIdToUse,
      presaleAddress,
      payAssetKey: selectedPayAssetKey,
      amountHuman: amountToUse,
    });
  }, [
    provider,
    presaleAddress,
    selectedChainId,
    selectedPayAssetKey,
    amountHuman,
    chainId,
  ]);

  return (
    <PresaleContext.Provider
      value={{
        selectedChainId,
        setSelectedChainId,
        selectedPayAssetKey,
        setSelectedPayAssetKey,
        paymentAmount: amountHuman,
        handlePaymentInput,
        chainMeta,
        payAsset,
        isQuoting,
        quoteError,
        quoteUsd,
        quoteStayx,
        buyToken,
        makeEmptyInputs,
        userBalance,
        setUserBalance,
        raisedToken: 0,
        goalToken: 0,
      }}
    >
      {children}
    </PresaleContext.Provider>
  );
}

export function usePresaleData() {
  const ctx = useContext(PresaleContext);
  if (!ctx)
    throw new Error(
      'usePresaleData must be used within PresaleContextProvider'
    );
  return ctx;
}
