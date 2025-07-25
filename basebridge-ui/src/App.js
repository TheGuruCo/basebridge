import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import "./App.css";

function App() {
  const [balances, setBalances] = useState([]);
  const [latest, setLatest] = useState({ root: "", timestamp: 0 });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const rpcUrl = process.env.REACT_APP_JSON_RPC_URL;
  const bridgeAddress = process.env.REACT_APP_BASEBRIDGE_ADDRESS;

  useEffect(() => {
    // Load mock balances
    fetch("/balances.json")
      .then((r) => r.json())
      .then(setBalances);

    // Connect to Base Sepolia
    const provider = new ethers.JsonRpcProvider(rpcUrl);
    const bridge = new ethers.Contract(
      bridgeAddress,
      ["event ReserveCommitted(bytes32 root, uint256 timestamp)"],
      provider
    );

    // Fetch latest on-chain commit
    async function loadLatest() {
      const head = await provider.getBlockNumber();
      const events = await bridge.queryFilter(
        bridge.filters.ReserveCommitted(),
        head - 5000,
        head
      );
      if (events.length) {
        const { root, timestamp } = events.pop().args;
        setLatest({ root, timestamp: timestamp.toNumber() });
      }
    }
    loadLatest();
  }, [rpcUrl, bridgeAddress]);

  // Helper to shorten addresses
  const shorten = (addr) => addr.slice(0, 6) + "…" + addr.slice(-4);

  // Publish handler
  const handlePublish = async () => {
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch("/.netlify/functions/publish", { method: "POST" });
      if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
      const { txHash } = await res.json();
      setMessage(`✅ Published! Tx hash: ${txHash}`);
    } catch (err) {
      setMessage(`❌ Publish failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <header className="hero">
        <h1>BaseBridge</h1>
        <p>On-chain Proof-of-Reserves</p>
      </header>

      <section className="balances-section">
        <h2>Mock Balances</h2>
        <div className="balances-grid">
          {balances.map(({ address, amount }) => (
            <div className="balance-card" key={address}>
              <span className="balance-addr mono">{shorten(address)}</span>
              <span className="balance-amt">{amount} BTC</span>
            </div>
          ))}
        </div>
      </section>

      <section className="commit-section">
        <h2>Latest Commit</h2>
        <div className="commit-grid">
          <div>
            <span className="label">Merkle Root</span>
            <code className="mono value">{latest.root || "—"}</code>
          </div>
          <div>
            <span className="label">Timestamp</span>
            <time className="value">
              {latest.timestamp
                ? new Date(latest.timestamp * 1000).toLocaleString()
                : "—"}
            </time>
          </div>
        </div>
        <button
          className="btn-publish"
          onClick={handlePublish}
          disabled={loading}
        >
          {loading ? "Publishing…" : "Publish Now"}
        </button>
        {message && <p className="publish-message">{message}</p>}
      </section>
    </div>
  );
}

export default App;
