import { createThirdwebClient, defineChain } from "thirdweb";

// Create the thirdweb client
export const client = createThirdwebClient({
  clientId: import.meta.env.VITE_THIRDWEB_CLIENT_ID || "your-client-id-here",
});

// Define COTI Testnet chain
export const cotiTestnet = defineChain({
  id: 7082400,
  name: "COTI Testnet",
  rpc: "https://testnet.coti.io/rpc",
  nativeCurrency: {
    name: "COTI",
    symbol: "COTI",
    decimals: 18,
  },
  blockExplorers: [
    {
      name: "COTI Testnet Explorer",
      url: "https://testnet.cotiscan.io",
    },
  ],
  testnet: true,
});
